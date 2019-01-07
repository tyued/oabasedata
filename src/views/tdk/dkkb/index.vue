<template>
  <section>
    <div style="padding: 20px">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="代课时间">
        <el-select v-model="timedefault" placeholder="请选择代课时间范围" style="width: 250px" @change="freshKb">
          <el-option v-for="item in  timeArr" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="exportKb">导出</el-button>
        <el-button type="primary" @click="exportAllKb">全部导出</el-button>
      </el-form-item>
    </el-form>
      <el-card shadow="never" style="height:auto">
        <div class="KbBoxScroll smallscroll">
          <table  ref="kb_table_ref" cellpadding="0" cellspacing="0" class="zkbtable fl" style="width: 100%;height:500px" >
            <thead >
            <tr>
              <th align="center"  v-if="this.currentLabel != '' && this.timedefault !='请选择代课时间'"
                  style="font-size: large" :colspan="pkzs.length + 1">{{this.currentLabel}}的课表( {{this.timedefault}} )</th>
              <th align="center"  v-else-if="this.currentLabel == '' || this.currentLabel != undefined" style="font-size: large"
                  :colspan="pkzs.length + 1">课程表</th>
              <th align="center"  v-else style="font-size: large"
                  :colspan="pkzs.length + 1">{{this.currentLabel}}的课表</th>
            </tr>
            <tr>
              <th style="width: 10%">节数/周次</th>
              <th v-for="zs in pkzs" style="width: 16%" >星期{{zs}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(js,rowIndex) in pkjs" :key='rowIndex' style="height:60px">
              <td>第{{js}}节</td>
              <td v-for="(jc,colIndex) in pkzs" :class="classColor(zzkb[colIndex][rowIndex])" :key='colIndex'>
                  <span>{{(zzkb[colIndex][rowIndex])}}</span>
              </td>
            </tr>
            </tbody>
          </table>
          <table  ref="allTimeKb" cellpadding="0" cellspacing="0" class="zkbtable fl" style="width: 100% ;height:800px" v-show="isShow">
            <div v-for="(kbItem,index) of allTimeKb" >
              <thead >
              <tr >
                <th align="center"  v-if="this.currentLabel != '' && this.timedefault !='请选择代课时间'" style="font-size: large"
                    :colspan="pkzs.length + 1">{{currentLabel}}的课表( {{timeArr[index]}} )</th>
                <th align="center"  v-else-if="this.timedefault !='请选择代课时间'" style="font-size: large"
                    :colspan="pkzs.length + 1">的课表( {{timeArr[index]}} )</th>
              </tr>
              <tr>
                <th style="width: 5%">节数/周次</th>
                <th v-for="zs in pkzs" style="width: 16%">星期{{zs}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(js,rowIndex) in pkjs" style="height:60px">
                <td>第{{js}}节</td>
                <td v-for="(jc,colIndex) in pkzs" :class="classColor(kbItem[colIndex][rowIndex])">{{(kbItem[colIndex][rowIndex])}}</td>
              </tr>
              </tbody>
              <tr style="height: 180px"/>
            </div>
          </table>
        </div>
      </el-card>
    </div>
  </section>
</template>
<script>
  import { getSubstituteWeek, getTeacherSchedule, getClassStructure } from '@/api/tdk/dkkb/index';
  import jcsj from '@/api/jcsj.js';
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        xxdm: window.localStorage.getItem('xxdm'),
        treeData: [],
        jszjsgxList: [],
        pkzs: [],
        pkjs: [],
        zzkb: [],
        allZzkb: [],
        allTimeKb: [],
        currentZgh: window.localStorage.getItem('usercode'), // 当前所选教师职工号
        currentLabel: '', // 当前教师姓名
        tempCurrentLabel: [], // 导出全部课表时表头教师姓名数据
        queryJs: 'noClick', // 输入框输入教师姓名
        isShow: false, // 隐藏所有教师课表table
        defalutArr: [],
        timeArr: [],
        timedefault: '请选择代课时间',
        kcList: [], // 课程集合
        bjList: [], // 班级集合
        jsList: []  // 教师集合
      }
    },
    created() {
      this.initEmpty();
      this.getTimeInfo();
      this.getJsAll();
      this.getClassAll();
      this.getxnAll();
    },
    methods: {
      freshKb() {
        if (this.timedefault === '请选择代课时间') {
          this.$notify({ title: '温馨提示', message: '请选择代课时间', type: 'warning', duration: 2000 });
        } else {
          this.freshTableChage();
        }
      },
      // 导出当前选择的时间课表
      exportKb() {
        // 获取排课教师
        if (this.timedefault === '请选择代课时间') {
          this.$notify({ title: '温馨提示', message: '代课时间不能为空', type: 'warning', duration: 2000 });
        } else {
          const tableHtml = this.$refs.kb_table_ref.outerHTML;
          jcsj.exportTable2Excel(tableHtml, this.currentLabel + '代课课表');
        }
      },
      // 导出教师所有时间段的课表
      exportAllKb() {
        const that = this;
        this.allTimeKb = [];
        getTeacherSchedule({ zgh: this.currentZgh, xxdm: this.xxdm }).then(res => {
          if (res.length > 0) {
            res.forEach(timeKb => {
              const initKb = [];
              that.pkjs.forEach(() => {
                const rowData = [];
                that.pkzs.forEach(() => {
                  rowData.push('');
                });
                initKb.push(rowData);
              });
              this.allZzkb = initKb;
              timeKb.forEach(item => {
                if (parseInt(item.ctype) === 0) {
                  try {
                    const pkzs = that.pkzs.indexOf(item.pkzs);
                    const pkjs = that.pkjs.indexOf(item.pkjs);
                    const kcmc = jcsj.hqkcmcByid(that.kcList, item.kcdm);
                    let bjmc = '';
                    if (item.spjl) {
                      if (item.spjl.dkzt === 'bdk') {
                        const dkr = jcsj.hqjsmcByid(this.jsList, item.spjl.dkr);
                        bjmc += dkr + '#';
                      } else {
                        bjmc += '(代) ';
                      }
                    }
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
                      bjmc += bjmcStr;
                    } else {
                      bjmc += jcsj.hqbjmcByid(that.bjList, item.bjdm);
                    }
                    const kcxx = that.allZzkb[pkzs][pkjs];
                    if (parseInt(item.isdsz) === 1) {
                      if (kcxx !== '' && kcxx !== undefined) {
                        const kcInfo = kcxx + ' / ' + bjmc + ' - ' + kcmc + '( 单 )';
                        that.allZzkb[pkzs][pkjs] = that.formatKcxx(kcInfo);
                      } else {
                        const kcInfo = bjmc + ' - ' + kcmc + '(单)';
                        that.allZzkb[pkzs][pkjs] = that.formatKcxx(kcInfo);
                      }
                    } else if (parseInt(item.isdsz) === 2) {
                      if (kcxx !== '' && kcxx !== undefined) {
                        const kcInfo = kcxx + ' / ' + bjmc + ' - ' + kcmc + '( 双 )';
                        that.allZzkb[pkzs][pkjs] = that.formatKcxx(kcInfo);
                      } else {
                        const kcInfo = bjmc + ' - ' + kcmc + '(双)';
                        that.allZzkb[pkzs][pkjs] = that.formatKcxx(kcInfo);
                      }
                    } else {
                      const kcInfo = bjmc + ' - ' + kcmc;
                      that.allZzkb[pkzs][pkjs] = that.formatKcxx(kcInfo);
                    }
                  } catch (e) {
                    console.error('基础数据取值error');
                  }
                }
              });
              that.allTimeKb.push(that.allZzkb);
            });
            that.$nextTick(() => {
              jcsj.exportTable2Excel(that.$refs.allTimeKb.outerHTML, this.currentLabel + '代课总课表');
            })
          } else {
            this.$notify({ title: '温馨提示', message: '暂无代课课表', type: 'warning', duration: 2000 });
          }
        });
      },
      // 获取教师代课周次
      getTimeInfo() {
        getSubstituteWeek({ zgh: this.currentZgh, xxdm: this.xxdm }).then(res => {
          this.timeArr = res;
          res = [];
          if (res.length > 0) {
            this.timedefault = res[0];
          }
        });
      },
      // 初始化空课表
      initEmpty() {
        getClassStructure({ xxdm: this.xxdm }).then(timeTableRes => {
          const jsArr = [];
          const initKb = [];
          this.pkzs = timeTableRes.pkzs.split(',');
            // 格式化数组
          this.formatArr();
          let rangInfo = 0;
          if (timeTableRes.swjs) {
            rangInfo += timeTableRes.swjs;
          }
          if (timeTableRes.xwjs) {
            rangInfo += timeTableRes.xwjs;
          }
          if (timeTableRes.wsjs) {
            rangInfo += timeTableRes.wsjs;
          }
          for (let i = 1; i <= rangInfo; i++) {
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
        });
      },
      // 刷新课表
      freshTableChage() {
        getClassStructure({ xxdm: this.xxdm }).then(timeTableRes => {
          getTeacherSchedule({ zgh: this.currentZgh, xxdm: this.xxdm, time: this.timedefault }).then(res => {
            const jsArr = [];
            const initKb = [];
            this.pkzs = timeTableRes.pkzs.split(',');
            // 格式化数组
            this.formatArr();
            let rangInfo = 0;
            if (timeTableRes.swjs) {
              rangInfo += timeTableRes.swjs;
            }
            if (timeTableRes.xwjs) {
              rangInfo += timeTableRes.xwjs;
            }
            if (timeTableRes.wsjs) {
              rangInfo += timeTableRes.wsjs;
            }
            for (let i = 1; i <= rangInfo; i++) {
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
            this.formatKb(res);
          });
        });
      },
      // 格式化课表
      formatKb(data) {
        data[0].forEach(item => {
          if (parseInt(item.ctype) === 0) {
            try {
              const pkzs = this.pkzs.indexOf(item.pkzs);
              const pkjs = this.pkjs.indexOf(item.pkjs);
              const kcmc = jcsj.hqkcmcByid(this.kcList, item.kcdm);
              let bjmc = '';
              if (item.spjl) {
                if (item.spjl.dkzt === 'bdk') {
                  const dkr = jcsj.hqjsmcByid(this.jsList, item.spjl.dkr);
                  bjmc += dkr + '#';
                } else {
                  bjmc += '(代) ';
                }
              }
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
                bjmc += bjmcStr;
              } else {
                bjmc += jcsj.hqbjmcByid(this.bjList, item.bjdm);
              }
              const kcxx = this.zzkb[pkzs][pkjs];
              if (parseInt(item.isdsz) === 1) {
                if (kcxx !== '' && kcxx !== undefined) {
                  const kcInfo = kcxx + ' / ' + bjmc + ' - ' + kcmc + '( 单 )';
                  this.zzkb[pkzs][pkjs] = this.formatKcxx(kcInfo);
                } else {
                  const kcInfo = bjmc + ' - ' + kcmc + '(单)';
                  this.zzkb[pkzs][pkjs] = this.formatKcxx(kcInfo);
                }
              } else if (parseInt(item.isdsz) === 2) {
                if (kcxx !== '' && kcxx !== undefined) {
                  const kcInfo = kcxx + ' / ' + bjmc + ' - ' + kcmc + '( 双 )';
                  this.zzkb[pkzs][pkjs] = this.formatKcxx(kcInfo);
                } else {
                  const kcInfo = bjmc + ' - ' + kcmc + '(双)';
                  this.zzkb[pkzs][pkjs] = this.formatKcxx(kcInfo);
                }
              } else {
                const kcInfo = bjmc + ' - ' + kcmc;
                this.zzkb[pkzs][pkjs] = this.formatKcxx(kcInfo);
              }
            } catch (e) {
              console.error('基础数据取值error');
            }
          }
        });
      },
      // 获取所有教师
      getJsAll() {
        const v = { xxdm: this.xxdm };
        jcsj.hqjslb(v).then(res => {
          this.jsList = res;
          this.currentLabel = jcsj.hqjsmcByid(this.jsList, this.currentZgh);
        })
      },
      // 获取所有课程
      getClassAll() {
        const that = this;
        const v = { xxdm: this.xxdm };
        jcsj.hqkclb(v).then(res => {
          that.kcList = res;
        })
      },
      // 获取当前学期
      getxnAll() {
        const that = this;
        jcsj.hqdqxnxq({ xxdm: this.xxdm }).then(response => {
          that.xnAll = response.data.xn;
          that.getbjAll();
        });
      },
      // 获取所有班级
      getbjAll() {
        const that = this;
        const v = { xn: that.xnAll, xxdm: this.xxdm };
        jcsj.hqbjlb(v).then(res => {
          that.bjList = res;
        })
      },
      formatArr() {
        const that = this;
        that.pkzs.forEach((item, index) => {
          that.pkzs[index] = parseInt(item);
        });
      },
      classColor(v) {
        if (v) {
          if (v.indexOf('已被') > -1) {
            return 'aa_1';
          }
        }
      },
      formatKcxx(kcInfo) {
        if (kcInfo.indexOf('#') > -1) {
          const index = kcInfo.indexOf('#');
          const dkr = kcInfo.substr(0, index);
          const kcxx = kcInfo.substr(index + 1, kcInfo.length);
          return kcxx + '( 已被' + dkr + '代课 )';
        } else {
          return kcInfo;
        }
      }
    }
  }
</script>
<style scoped>
  .aa_1 {
    background-color: #E3E3E3;
  }
</style>
