<template>
  <div>
    <el-tabs v-model="activeName" :tab-position="tabPosition" @tab-click="indexKcsdList">
      <el-tab-pane label="课程时段分配" name="0">
        <div style="margin-bottom: 5px;">
          <span class="demonstration">筛选条件：</span>
          <el-select v-model="selectedOptions[0]" size="small" placeholder="请选择" @change="handleChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-table :data="tableData[0]" height="600" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" prop="km" label="课程"></el-table-column>
          <el-table-column align="center" prop="js" label="教师"></el-table-column>
          <!--课程时段-->
          <el-table-column align="center" label="课程时段">
            <el-table-column align="center"
                             label="全部全天"
                             width="250"
                             :render-header="(h,objct,index) => renderHeader(h,objct,0)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.kcsd"
                          @change="handleCheckedCitiesChange(scope.row,0)"
                          label="1">全天
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="全部上午"
                             width="250"
                             :render-header="(h,objct,index) => renderHeader(h,objct,0)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.kcsd"
                          @change="handleCheckedCitiesChange(scope.row,0)"
                          label="2">上午
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="全部下午"
                             :render-header="(h,objct,index) => renderHeader(h,objct,0)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.kcsd"
                          @change="handleCheckedCitiesChange(scope.row,0)"
                          label="3">下午
                </el-radio>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="重要程度">
            <el-table-column align="center"
                             label="全部重要"
                             width="250"
                             :render-header="(h,objct,index) => renderHeader(h,objct,0)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.zycd"
                          @change="handleCheckedCitiesChange(scope.row,0)"
                          label="1">重要
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="全部一般"
                             :render-header="(h,objct,index) => renderHeader(h,objct,0)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.zycd"
                          @change="handleCheckedCitiesChange(scope.row,0)"
                          label="2">一般
                </el-radio>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="教案齐平" name="1">
        <div style="margin-bottom: 5px;">
          <span class="demonstration">筛选条件：</span>
          <el-select v-model="selectedOptions[1]" size="small" placeholder="请选择" @change="handleChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-table :data="tableData[1]" height="600" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" prop="km" label="课程"></el-table-column>
          <el-table-column align="center" prop="js" label="教师"></el-table-column>
          <el-table-column align="center" label="重要程度">
            <el-table-column align="center"
                             label="全部重要"
                             width="250"
                             :render-header="(h,objct,index) => renderHeader(h,objct,1)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.zycd"
                          @change="handleCheckedCitiesChange(scope.row,1)"
                          label="1">重要
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="全部一般"
                             :render-header="(h,objct,index) => renderHeader(h,objct,1)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.zycd"
                          @change="handleCheckedCitiesChange(scope.row,2)"
                          label="2">一般
                </el-radio>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="周任课分布" name="2">
        <div style="margin-bottom: 5px;">
          <span class="demonstration">筛选条件：</span>
          <el-select v-model="selectedOptions[2]" size="small" placeholder="请选择" @change="handleChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-table :data="tableData[2]" height="600" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" prop="km" label="课程"></el-table-column>
          <el-table-column align="center" prop="js" label="教师"></el-table-column>
          <el-table-column align="center" label="周内分布">
            <el-table-column align="center"
                             label="全部周内分散"
                             width="250"
                             :render-header="(h,objct,index) => renderHeader(h,objct,2)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.znfb"
                          @change="handleCheckedCitiesChange(scope.row,0)"
                          label="1">周内分散
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="全部周内集中"
                             width="250"
                             :render-header="(h,objct,index) => renderHeader(h,objct,2)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.znfb"
                          @change="handleCheckedCitiesChange(scope.row,1)"
                          label="2">周内集中
                </el-radio>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="重要程度">
            <el-table-column align="center"
                             label="全部重要"
                             width="250"
                             :render-header="(h,objct,index) => renderHeader(h,objct,2)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.zycd"
                          @change="handleCheckedCitiesChange(scope.row,1)"
                          label="1">重要
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="全部一般"
                             :render-header="(h,objct,index) => renderHeader(h,objct,2)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.zycd"
                          @change="handleCheckedCitiesChange(scope.row,2)"
                          label="2">一般
                </el-radio>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="天任课分布" name="3">
        <div style="margin-bottom: 5px;">
          <span class="demonstration">筛选条件：</span>
          <el-select v-model="selectedOptions[3]" size="small" placeholder="请选择" @change="handleChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-table :data="tableData[3]" height="600" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" prop="km" label="课程"></el-table-column>
          <el-table-column align="center" prop="js" label="教师"></el-table-column>
          <el-table-column align="center" label="天内分布">
            <el-table-column align="center"
                             label="全部天内分散"
                             width="250"
                             :render-header="(h,objct,index) => renderHeader(h,objct,3)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.tnfb"
                          @change="handleCheckedCitiesChange(scope.row,0)"
                          label="1">天内分散
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="全部天内集中"
                             width="250"
                             :render-header="(h,objct,index) => renderHeader(h,objct,3)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.tnfb"
                          @change="handleCheckedCitiesChange(scope.row,1)"
                          label="2">天内集中
                </el-radio>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="重要程度">
            <el-table-column align="center"
                             label="全部重要"
                             width="250"
                             :render-header="(h,objct,index) => renderHeader(h,objct,3)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.zycd"
                          @change="handleCheckedCitiesChange(scope.row,1)"
                          label="1">重要
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="全部一般"
                             :render-header="(h,objct,index) => renderHeader(h,objct,3)">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.zycd"
                          @change="handleCheckedCitiesChange(scope.row,2)"
                          label="2">一般
                </el-radio>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  /* eslint-disable array-callback-return,indent */
  import {
    getKcSz,
    getQtszList,
    getQtszSave
  } from '@/api/pkxt/arrangingTask/gztj/qtsz'
  import jcsj from '@/api/jcsj'

  export default {
    data() {
      return {
        activeName: '0',
        cityOptions: ['课程时段分配', '教案齐平', '周任课分布', '天任课分布'],
        selectedOptions: ['', '', '', '', ''],
        options: [], /** 年级班级**/
        tabPosition: 'left',
        dialogVisible: false,
        tableData: [[], [], [], []],
        xxdm: this.$route.query.xxdm,
        rwid: this.$route.query.rwid,
        dqxn: this.$route.query.dqxn,
        dqxq: this.$route.query.dqxq,
        kcszList: []
      };
    }, created() {
      // this.loadMain();
    },
    methods: {
      loadMain() {
        /** 初始化年级班级列表**/
        this.options = [];
        this.options = this.njList.map(e => {
          const map = { value: e.njdm, label: e.njmc }
          return map;
        });
        /** 设置年级默认选中**/
        for (const i in this.selectedOptions) {
          this.selectedOptions[i] = this.options[0].value;
        }
        /** 获取指定年级班级课程教师信息**/
        getKcSz({ rwid: this.rwid, xxdm: this.xxdm }).then(response => {
          this.kcszList = response.data;
          this.activeName = '0';
          this.indexKcsdList();
        })
      }, /** 展示列表**/
      indexKcsdList() {
        const i = parseInt(this.activeName);
        const pram = { rwid: this.rwid }
        getQtszList(pram, i).then(res => {
          /** 获取指定班级教学计划信息**/
          const nj_list = _.filter(this.kcszList, item => item.njdm === this.selectedOptions[i] && item.zgh);
          /** 遍历班级课程**/
          if (nj_list) {
            this.tableData.splice(i, 1, this.formTodata(res.data, nj_list, i));
          }
        })
      }, /** 列表数据转换**/
      formTodata(jsonData, query, i) {
        const arry = [];
        for (const o of query) {
          /** 默认参数**/
          const map = {
            rwid: this.rwid,
            xxdm: this.xxdm,
            kcdm: o.kcdm,
            km: jcsj.hqkcmcByid(this.kcList, o.kcdm),
            zgh: o.zgh,
            js: this.getJsToString(o.zgh),
            kcsd: i === 0 ? this.kssdID(jsonData, { kcdm: o.kcdm, zgh: o.zgh }) : '1',
            zycd: this.zycdID(jsonData, { kcdm: o.kcdm, zgh: o.zgh }, i),
            znfb: i === 2 ? this.znfbID(jsonData, { kcdm: o.kcdm, zgh: o.zgh }) : '1',
            tnfb: i === 3 ? this.tnfbID(jsonData, { kcdm: o.kcdm, zgh: o.zgh }) : '1'
          }
          arry.push(map);
        }
        return arry;
      }, kssdID(list, v) {
        /** 课程时段**/
        const res = _.find(list, v);
        if (res) {
          return res.kssd.toString();
        } else {
          return '1';
        }
      }, zycdID(list, v) {
        /** 重要程度**/
        const res = _.find(list, v);
        if (res) {
          return res.zycd.toString();
        } else {
          return '2';
        }
      }, znfbID(list, v) {
        /** 周内**/
        const res = _.find(list, v);
        if (res) {
          return res.znfb.toString();
        } else {
          return '1';
        }
      }, tnfbID(list, v) {
        /** 天内时段**/
        const res = _.find(list, v);
        if (res) {
          return res.tnfb.toString();
        } else {
          return '1';
        }
      }, getJsToString(v) { /** 教师代码转教师名称**/
        if (v) {
          const [arry, map] = [v.split(','), []];
          for (const o of arry) {
            map.push(jcsj.hqjsmcByid(this.jsList, o));
          }
          return map.join(',');
        } else {
          return '';
        }
      }, renderHeader(createElement, { column, $index }, i) { /** @表头复选框点击事件**/
        /** 记录是否全选或者不全选**/
        const count = this.tableData[i].length;
        let parm = {}
        if (i === 0) { /** 课时时段**/
          if (count > 0 && $index === 0 || $index === 1 || $index === 2) {
            const num = this.tableData[i].filter(i => i.kcsd === ($index + 1).toString()).length;
            parm = this.checkBoxZt(num, count, $index);
          }
          if (count > 0 && $index === 3 || $index === 4) {
            const num = this.tableData[i].filter(i => i.zycd === ($index - 2).toString()).length;
            parm = this.checkBoxZt(num, count, $index);
          }
        }
        if (i === 1) { /** 教案齐平**/
          if (count > 0 && $index === 0 || $index === 1) {
            const num = this.tableData[i].filter(i => i.zycd === ($index + 1).toString()).length;
            parm = this.checkBoxZt(num, count, $index);
          }
        }
        if (i === 2) { /** 周内分布**/
          if (count > 0 && $index === 0 || $index === 1) {
            const num = this.tableData[2].filter(i => i.znfb === ($index + 1).toString()).length;
            parm = this.checkBoxZt(num, count, $index);
          }
          if (count > 0 && $index === 2 || $index === 3) {
            const num = this.tableData[2].filter(i => i.zycd === ($index - 1).toString()).length;
            parm = this.checkBoxZt(num, count, $index);
          }
        }
        if (i === 3) { /** 天内分布**/
          if (count > 0 && $index === 0 || $index === 1) {
            const num = this.tableData[3].filter(i => i.tnfb === ($index + 1).toString()).length;
            parm = this.checkBoxZt(num, count, $index);
          }
          if (count > 0 && $index === 2 || $index === 3) {
            const num = this.tableData[3].filter(i => i.zycd === ($index - 1).toString()).length;
            parm = this.checkBoxZt(num, count, $index);
          }
        }
        /** 返回复选框**/
        return createElement(
          'el-checkbox', {
            props: parm,
            // 给div绑定click事件
            on: {
              change: val => {
                this.isCheckAll(val, i, $index);
                /** 是否全选**/
              }
            }
          },
          column.label
        )
      }, isCheckAll(v, i, $index) {
        if (v) {
          /** 全选设置当前年级对应课程选中**/
          this.tableData[i].map(item => {
            switch (i) {
              /** 课程时段**/
              case 0:
                if ($index === 0 || $index === 1 || $index === 2) {
                  item.kcsd = ($index + 1).toString();
                } else {
                  item.zycd = ($index - 2).toString();
                }
                break;
              /** 教案齐平**/
              case 1:
                item.zycd = ($index + 1).toString();
                break;
              /** 周内任课**/
              case 2:
                if ($index === 0 || $index === 1) {
                  item.znfb = ($index + 1).toString();
                } else {
                  item.zycd = ($index - 1).toString();
                }
                break;
              /** 天内内任课**/
              case 3:
                if ($index === 0 || $index === 1) {
                  item.tnfb = ($index + 1).toString();
                } else {
                  item.zycd = ($index - 1).toString();
                }
                break;
            }
          })
          /** 保存数据**/
          this.saveKcsdInfo();
        }
      }, /** 设置标头复选框选中状态属性**/
      checkBoxZt(num, count) {
        const parm = {}
        if (num !== 0 && num === count) {
          parm.value = true;
          parm.disabled = true;
          parm.indeterminate = false;
        } else if (num > 0 && num < count) {
          parm.value = false;
          parm.indeterminate = true;
        } else {
          parm.value = false;
          parm.disabled = false;
          parm.indeterminate = false;
        }
        return parm;
      }, /** 保存信息方法**/
      saveKcsdInfo() {
        const i = parseInt(this.activeName);
        const list = this.saveCl(i);
        const qtsz = [{ kcsdszList: list }, { jaqpszList: list }, { zrkszList: list }, { trkszList: list }];
        if (list.length > 0) {
          getQtszSave(qtsz[i], i).then(res => {
            if (res.data) {
              this.$notify({ title: '成功', message: '保存成功', type: 'success', duration: 2000 })
            } else {
              this.$notify.error({ title: '错误', message: '保存失败' });
            }
          })
        }
      },
      saveCl(i) {
        return this.tableData[i].map(item => {
          const map = {
            rwid: item.rwid,
            kcdm: item.kcdm,
            zgh: item.zgh ? item.zgh : '',
            xxdm: item.xxdm,
            njdm: this.selectedOptions[i],
            zycd: item.zycd
          }
          switch (i) {
            case 0:
              map.kssd = item.kcsd;
              break;
            case 1:
              break;
            case 2:
              map.znfb = item.znfb;
              break;
            case 3:
              map.tnfb = item.tnfb;
              break;
          }
          return map;
        });
      },
      handleChange() {
        this.indexKcsdList();
      },
      /** 点击更新事件**/
      handleCheckedCitiesChange() {
        /** 保存数据**/
        this.saveKcsdInfo();
      }
    },
  props: {
    njList: {
        /** 年级类型列表数据**/
      type: Array,
      required:
          true
    },
    bjList: {
        /** 班级级类型列表数据**/
      type: Array,
      required:
          true
    },
    kcList: {
        /** 课程级类型列表数据**/
      type: Array,
      required:
          true
    },
    jsList: {
        /** 教师级类型列表数据**/
      type: Array,
      required:
          true
    }
  }
  }
</script>
<style scoped>
  #excel-upload-input {
    display: none;
    z-index: -9999;
  }
</style>
