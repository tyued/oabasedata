<template>
  <div class="view">

  <el-row>
    <div class="fr" style="padding-bottom: 10px">
      <el-button type="primary" icon="el-icon-upload2" @click="expTeacherGeneralClassSchedule">全部导出</el-button>
      <el-button type="primary" icon="el-icon-upload2" @click="exportTable">导出</el-button>
    </div>
  </el-row>
  <el-row :gutter="12">
    <el-col :span="4" >
      <el-card shadow="always">
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="this.currentLabel"
          :fetch-suggestions="querySearch"
          placeholder="输入教师姓名进行查询"
          @select="handleSelect">
          <i
            class="el-icon-edit el-input__icon"
            slot="suffix"
            @click="handleIconClick">
          </i>
        </el-autocomplete>
        <div class="pk-jszkb smallscroll">
          <el-tree  width="20%" :data="treeData"
                    node-key="id" :highlight-current="true"  :accordion="true" @node-click="handleCheckClick"></el-tree>
        </div>
      </el-card>
    </el-col>
    <el-col :span="20">
      <el-card shadow="never" style="height:auto">
          <div class="KbBoxScroll smallscroll">
            <table  ref="kb_table_ref" cellpadding="0" cellspacing="0" class="zkbtable fl" style="width: 100%;height:500px" >
              <thead >
              <tr>
                <th align="center"  v-if="this.currentLabel != ''" style="font-family: 	KaiTi;font-size: large" :colspan="pkzs.length + 1">{{this.currentLabel}}的课表</th>
              </tr>
              <tr>
                <th style="width: 10%">节数/周次</th>
                <th v-for="zs in pkzs" style="width: 16%">星期{{zs}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(js,rowIndex) in pkjs" style="height:60px">
                <td>第{{js}}节</td>
                <td v-for="(jc,colIndex) in pkzs">{{(zzkb[colIndex][rowIndex])}}</td>
              </tr>
              </tbody>
            </table>
            <table  ref="allJskb" cellpadding="0" cellspacing="0" class="zkbtable fl" style="width: 100% ;height:800px" v-show="isShow">
              <div v-for="(kbItem,index) of allJskb" >
                <thead >
                <tr >
                  <th align="center"  v-if="this.tempCurrentLabel != ''" style="font-family: 	KaiTi;font-size: large" :colspan="pkzs.length + 1">{{tempCurrentLabel[index]}}的课表</th>
                </tr>
                <tr>
                  <th style="width: 5%">节数/周次</th>
                  <th v-for="zs in pkzs" style="width: 16%">星期{{zs}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(js,rowIndex) in pkjs" style="height:60px">
                  <td>第{{js}}节</td>
                  <td v-for="(jc,colIndex) in pkzs">{{(kbItem[colIndex][rowIndex])}}</td>
                </tr>
                </tbody>
                <tr style="height: 180px"/>
              </div>
            </table>
          </div>
      </el-card>
    </el-col>
  </el-row>
  </div>
</template>
<script>
  import { timeTableInfo, getJskbByZgh, pkjsList } from '@/api/pkxt/arrangingTask/pktz/index';
  import { getJszjsgxList } from '@/api/pkxt/arrangingTask/gztj/jssz'
  import jcsj from '@/api/jcsj.js';
  export default {
    name: 'jskb',
    data() {
      return {
        rwid: this.$route.query.rwid,
        xxdm: this.$route.query.xxdm,
        treeData: [],
        jszjsgxList: [],
        pkzs: [],
        pkjs: [],
        zzkb: [],
        allZzkb: [],
        allJskb: [],
        currentZgh: 'init', // 当前所选教师职工号
        currentLabel: '', // 当前教师姓名
        tempCurrentLabel: [], // 导出全部课表时表头教师姓名数据
        queryJs: 'noClick', // 输入框输入教师姓名
        isShow: false, // 隐藏所有教师课表table
        defalutArr: []
      }
    },
    mounted() {
      pkjsList({ xxdm: this.xxdm, rwid: this.rwid }).then(res => {
        const jsxxList = [];
        if (res.data.rows.length > 0) {
          const zgh = res.data.rows[0];
          const jsxm = jcsj.hqjsmcByid(this.jsList, zgh);
          this.currentZgh = zgh;
          this.currentLabel = jsxm;
        }
        for (const o of res.data.rows) {
          const jsxm = jcsj.hqjsmcByid(this.jsList, o);
          const jsxx = { value: jsxm, zgh: o };
          jsxxList.push(jsxx);
        }
        this.restaurants = jsxxList;
        this.freshTableChage();
      });
    },
    methods: {
      // 刷新课表
      freshTableChage() {
        timeTableInfo(this.rwid).then(timeTableRes => {
          getJskbByZgh({ rwid: this.rwid, zgh: this.currentZgh }).then(res => {
            const jsArr = [];
            const initKb = [];
            this.pkzs = timeTableRes.data.weekdayList;
            for (let i = 1; i <= timeTableRes.data.totalLessonCount; i++) {
              jsArr.push(i);
            }
            jsArr.forEach(() => {
              const rowData = [];
              this.pkzs.forEach(() => {
                rowData.push('');
              });
              initKb.push(rowData);
            });
            this.pkjs = jsArr;
            this.zzkb = initKb;
            this.formatKb(res.data);
          });
        });
      },
      // 格式化课表
      formatKb(data) {
        data.forEach(item => {
          if (parseInt(item.ctype) === 0) {
            try {
              const pkzs = this.pkzs.indexOf(item.pkzs);
              const pkjs = this.pkjs.indexOf(item.pkjs);
              const kcmc = jcsj.hqkcmcByid(this.kcList, item.kcdm);
              let bjmc = '';
              if (parseInt(item.ishb) === 1) {
                const hbbjArr = item.hbbj.split(',');
                let bjmcStr = '';
                for (const hbbj of hbbjArr) {
                  const bj = jcsj.hqbjmcByid(this.bjList, hbbj);
                  if (bjmcStr === '') {
                    bjmcStr += bj;
                  } else {
                    bjmcStr = bjmcStr + '、' + bj;
                  }
                }
                bjmc = bjmcStr;
              } else {
                bjmc = jcsj.hqbjmcByid(this.bjList, item.bjdm);
              }
              const kcxx = this.zzkb[pkzs][pkjs];
              if (parseInt(item.isdsz) === 1) {
                if (kcxx !== '' && kcxx !== undefined) {
                  this.zzkb[pkzs][pkjs] = kcxx + ' / ' + bjmc + ' - ' + kcmc + '( 单 )'
                } else {
                  this.zzkb[pkzs][pkjs] = bjmc + ' - ' + kcmc + '( 单 )';
                }
              } else if (parseInt(item.isdsz) === 2) {
                if (kcxx !== '' && kcxx !== undefined) {
                  this.zzkb[pkzs][pkjs] = kcxx + ' / ' + bjmc + ' - ' + kcmc + '( 双 )';
                } else {
                  this.zzkb[pkzs][pkjs] = bjmc + ' - ' + kcmc + '( 双 )';
                }
              } else {
                this.zzkb[pkzs][pkjs] = bjmc + ' - ' + kcmc;
              }
            } catch (e) {
              console.error('基础数据取值error');
            }
          }
        });
      },
      loadTree() {
        getJszjsgxList({ xxdm: this.xxdm }).then(response => {
          this.jszjsgxList = response;
          // 拼装教师组树数据
          this.pzJszTreeData(this.jszjsgxList);
          this.freshTableChage();
        });
      },
      pzJszTreeData(jszjsgxList) {
        this.treeData = [];
        pkjsList({ xxdm: this.xxdm, rwid: this.rwid }).then(res => {
          for (const item of this.jszList) {
            const exp = {};
            exp.value = item.zmd;
            exp.label = item.zmc;
            exp.children = []
            for (const obj of jszjsgxList) {
              if (item.zdm === obj.zdm) {
                const objexp = {};
                if (res.data.rows.indexOf(obj.zgh) > -1) {
                  objexp.value = obj.zgh;
                  objexp.key = obj.zgh;
                  const jsxm = jcsj.hqjsmcByid(this.jsList, obj.zgh);
                  objexp.label = jsxm;
                  exp.children.push(objexp);
                }
              }
            }
            this.treeData.push(exp);
          }
        });
      },
      /** @树形插件班级点击事件显示教师方法**/
      handleCheckClick(data, node) {
        if (parseInt(node.level) === 2) {
          this.currentZgh = data.value;
          this.queryJs = data.label;
          this.currentLabel = data.label;
          this.freshTableChage();
        }
      },
      // 输入框
      querySearch(queryString, cb) {
        this.queryJs = queryString;
        const restaurants = this.restaurants;
        const results = queryString ? this.createFilter(queryString) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      // 输入框
      createFilter(queryString) {
        const jsQueryArr = [];
        for (const jsxx of this.restaurants) {
          if (jsxx.value.indexOf(queryString) > -1) {
            jsQueryArr.push(jsxx);
          }
        }
        return jsQueryArr;
      },
      // 选中建议词条时触发事件
      handleSelect(item) {
        this.currentLabel = item.value;
        this.currentZgh = item.zgh;
        this.queryJs = item.value;
        this.freshTableChage();
      },
      handleIconClick() {
        if (this.queryJs !== 'noClick') {
          if (this.queryJs === '') {
            this.$notify({ title: '提示', message: '教师姓名不能为空', type: 'warning' });
          } else {
            const jsdm = jcsj.hqjsdmBymc(this.jsList, this.queryJs);
            if (jsdm !== this.queryJs) {
              this.freshTableChage();
            } else {
              this.$notify({ title: '提示', message: '该教师不存在', type: 'warning' });
            }
          }
        }
      },
      exportTable() {
        // 获取排课教师
        const tableHtml = this.$refs.kb_table_ref.outerHTML;
        jcsj.exportTable2Excel(tableHtml, this.currentLabel + '教师课表');
      },
      // 获取教师课表
      // 导出教师总课表
      expTeacherGeneralClassSchedule() {
        const that = this;
        this.allJskb = [];
        // 查询所有上课教师
        pkjsList({ xxdm: that.xxdm, rwid: that.rwid }).then(res => {
          getJskbByZgh({ rwid: that.rwid }).then(allTeachSchedule => {
            res.data.rows.forEach(zgh => {
              const teachSchedule = _.filter(allTeachSchedule.data, ['zgh', zgh]);
              const jsxm = jcsj.hqjsmcByid(that.jsList, zgh);
              that.tempCurrentLabel.push(jsxm);
              const initKb = [];
              that.pkjs.forEach(() => {
                const rowData = [];
                that.pkzs.forEach(() => {
                  rowData.push('');
                });
                initKb.push(rowData);
              });
              this.allZzkb = initKb;
              teachSchedule.forEach(item => {
                if (parseInt(item.ctype) === 0) {
                  try {
                    const pkzs = that.pkzs.indexOf(item.pkzs);
                    const pkjs = that.pkjs.indexOf(item.pkjs);
                    const kcmc = jcsj.hqkcmcByid(that.kcList, item.kcdm);
                    let bjmc = '';
                    if (parseInt(item.ishb) === 1) {
                      const hbbjArr = item.hbbj.split(',');
                      let bjmcStr = '';
                      for (const hbbj of hbbjArr) {
                        const bj = jcsj.hqbjmcByid(that.bjList, hbbj);
                        if (bjmcStr === '') {
                          bjmcStr += bj;
                        } else {
                          bjmcStr = bjmcStr + '、' + bj;
                        }
                      }
                      bjmc = bjmcStr;
                    } else {
                      bjmc = jcsj.hqbjmcByid(that.bjList, item.bjdm);
                    }
                    const kcxx = that.allZzkb[pkzs][pkjs];
                    if (parseInt(item.isdsz) === 1) {
                      if (kcxx !== '' && kcxx !== undefined) {
                        this.allZzkb[pkzs][pkjs] = kcxx + ' / ' + bjmc + ' - ' + kcmc + '( 单 )'
                      } else {
                        that.allZzkb[pkzs][pkjs] = bjmc + ' - ' + kcmc + '(单)';
                      }
                    } else if (parseInt(item.isdsz) === 2) {
                      if (kcxx !== '' && kcxx !== undefined) {
                        that.allZzkb[pkzs][pkjs] = kcxx + ' / ' + bjmc + ' - ' + kcmc + '( 双 )';
                      } else {
                        that.allZzkb[pkzs][pkjs] = bjmc + ' - ' + kcmc + '(双)';
                      }
                    } else {
                      that.allZzkb[pkzs][pkjs] = bjmc + ' - ' + kcmc;
                    }
                  } catch (e) {
                    console.error('基础数据取值error');
                  }
                }
              });
              that.allJskb.push(that.allZzkb);
            });
            that.$nextTick(() => {
              jcsj.exportTable2Excel(that.$refs.allJskb.outerHTML, '教师总课表');
            })
          });
        });
      }
    },
    props: {
      njList: {
        /** 年级类型列表数据**/
        type: Array,
        required: true
      },
      bjList: {
        /** 班级级类型列表数据**/
        type: Array,
        required: true
      },
      kcList: {
        /** 课程级类型列表数据**/
        type: Array,
        required: true
      },
      jsList: {
        /** 教师级类型列表数据**/
        type: Array,
        required: true
      },
      jszList: {
        /** 教师组列表数据**/
        type: Array,
        required: true
      }
    }
  }
</script>
<style scoped>
.pk-jszkb {
  margin-top: 10px;
  height:520px;
  overflow: auto;
}
</style>

