<template>
  <div>
    <el-row>
      <div class="selgroup fl">
        <el-select v-model="selectNj" placeholder="请选择年级" style="width:150px;margin:0 5px;">
          <el-option v-for="item in gradeDataList" :key="item.njdm" :label="item.njmc" :value="item.njdm"></el-option>
        </el-select>
        <el-select v-model="selectBj" placeholder="请选择班级" style="width:150px;margin:0 5px;">
          <el-option v-for="item in classList" :key="item.value" :label="item.bj" :value="item.uuid"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-upload2" @click="exportData">导出</el-button>
      </div>
    </el-row>

    <el-row>
      <template v-if="timeTable !== null && timeTable !== ''">
        <table cellpadding="0" cellspacing="0" class="gentable fl mt10 tzkcTable">
          <tr>
            <th class="xh"></th>
            <th v-for="(item, index) in timeTable.weekdayList" :key="'title'+index">{{item | weekdayFormat}}</th>
          </tr>
          <template v-for="(item, rowIndex) in tableCellDataSet">
            <tr v-if="tableRowDivider.includes(rowIndex)" :key="'row-divider-'+rowIndex">
              <td class="xh tableRowDivider" :colspan="(timeTable.daysPerWeek + 1)"></td>
            </tr>
            <tr :key="'row-'+rowIndex">
              <td class="xh">{{rowIndex + 1}}</td>
              <td v-for="(element,colIndex) in timeTable.daysPerWeek" :key="'col-'+colIndex" @click.stop="cellClick(tableCellDataSet[rowIndex][colIndex])">

                <template v-if="tableCellDataSet[rowIndex][colIndex].muiltiple">
                  <span :class="computStyle(tableCellDataSet[rowIndex][colIndex])">
                    {{tableCellDataSet[rowIndex][colIndex].singleName}}/{{tableCellDataSet[rowIndex][colIndex].doubleName}}
                  </span>
                </template>

                <template v-else>
                  <span :class="computStyle(tableCellDataSet[rowIndex][colIndex])">
                    {{tableCellDataSet[rowIndex][colIndex].courseName}}
                  </span>
                </template>

              </td>
            </tr>
          </template>
        </table>
      </template>
    </el-row>

    <div ref="table_ref" v-show="false">
      <el-row v-for="loop in arr" :key="loop.xm">
        <table cellpadding="0" cellspacing="0" class="gentable fl mt10 tzkcTable">

          <tr>
            <th class="xh" :colspan="(timeTable.daysPerWeek + 1)">{{loop.xm}}的课表</th>
          </tr>

          <tr>
            <th class="xh"></th>
            <th v-for="(item, index) in timeTable.weekdayList" :key="'title'+index">{{item | weekdayFormat}}</th>
          </tr>
          <template v-for="(item, rowIndex) in loop.data">
            <tr :key="'row-'+rowIndex">
              <td class="xh">{{rowIndex + 1}}</td>
              <td v-for="(element,colIndex) in timeTable.daysPerWeek" :key="'col-'+colIndex">

                <template v-if="loop.data[rowIndex][colIndex].muiltiple">
                  <span class="stat_0">
                    {{loop.data[rowIndex][colIndex].bjmc}} {{loop.data[rowIndex][colIndex].singleName}}/{{loop.data[rowIndex][colIndex].doubleName}}
                  </span>
                </template>

                <template v-else>
                  <span class="stat_0">
                    {{loop.data[rowIndex][colIndex].bjmc}} {{loop.data[rowIndex][colIndex].courseName}}
                  </span>
                </template>

              </td>
            </tr>
          </template>
        </table>
      </el-row>
    </div>


  </div>
</template>

<script>
  import * as api from '@/api/pkxt/arrangingTask/pktz/index';
  import * as pktz from './pktz.js';
  import * as lstz from './lstz.js';
  import jcsj from '@/api/jcsj';
  export default {
    data() {
      return {
        curActive: null, // 当前选中课程对象
        query: { taskId: this.$route.query.rwid },
        selectNj: '', // 当前选中年级
        selectBj: '', // 当前选中班级
        timeTable: '', // 课表结构
        tableCellDataSet: [], // 主课表
        tableRowDivider: [], // 上午、下午、晚上课表分割下标列表
        ruleDataSet: [], // 规则列表
        coursePlanDataSet: [], // 排课结果列表
        pkJxjhList: [], // 排课教学计划列表
        swapTeacherList: [],
        arr: []
      }
    },
    methods: {
      exportData() {
        if (this.swapTeacherList.length > 0) {
          this.arr = [];
          for (const loop of this.swapTeacherList) {
            const teacherId = loop.zgh;
            const teacherName = loop.xm;
            const dataSet = this.coursePlanDataSet.filter(item => item.zgh === teacherId && item.ctype === '0');
            const groupDataSet = pktz.getDataGroupByIndex(dataSet);
            const initContent = pktz.initTableStructure(this.timeTable);
            const list = pktz.getTableContent(initContent, groupDataSet, this.timeTable);
            const temp = { xm: teacherName, data: list };
            this.arr.push(temp);
          }
          this.swapTeacherList = [];
          this.$nextTick(() => {
            const oHtml = this.$refs.table_ref.outerHTML;
            jcsj.exportTable2Excel(oHtml, '临时调整教师课表');
          })
        }
      },
      loadData() {
        this.selectNj = '';
        this.selectBj = '';
        this.swapTeacherList = [];
        this.getTimeTableInfo(this.query.taskId);
        this.getRuleList(this.query.taskId);
        this.getCoursePlanList(this.query.taskId);
        this.getPkJxjhList(this.query.taskId);
      },
      cellClick(item) {
        if (!item.enable) {
          return;
        }
        if (this.curActive !== null) {
          if (this.curActive.index === item.index) {
            // 取消选中
            this.curActive = null
            this.refreshMainTableContent();
          } else {
            if (item.state === 1) { // 对调课程
              const from = this.curActive;
              const to = item;
              this.curActive = null;
              const records = pktz.swapCourse(from, to);
              this.saveKctz(records);
              this.refreshMainTableContent();
              this.setSwapState(from, to);
            } else { // 不可对调课程
              this.curActive = item;
              // 计算所有可对调课程的格子
              this.computEnableCell();
            }
          }
        } else {
          this.curActive = item;
          // 计算所有可对调课程的格子
          this.computEnableCell();
        }
      },
      saveKctz(records) {
        this.coursePlanDataSet.forEach(item => {
          records.forEach(element => {
            if (element.jlid === item.jlid) {
              item.pkzs = element.pkzs;
              item.pkjs = element.pkjs;
              item.ctype = element.ctype;
            }
          });
        });
        // api.saveKctz(records);
        records.forEach(element => {
          if (!this.containsItem(this.swapTeacherList, element, 'zgh')) {
            const obj = { zgh: element.zgh, xm: element.jsmc };
            this.swapTeacherList.push(obj);
          }
        });
      },
      containsItem(list, obj, key) {
        for (let a = 0, len = list.length; a < len; a++) {
          const loop = list[a];
          if (loop[key] === obj[key]) {
            return true;
          }
        }
        return false;
      },
      setSwapState(fromItem, toItem) {
        this.tableCellDataSet[fromItem.row][fromItem.col].state = 4;
        this.tableCellDataSet[toItem.row][toItem.col].state = 4;
      },
      refreshMainTableContent() {
        this.tableCellDataSet = this.getTableConentByClassId(this.selectBj);
      },
      computEnableCell() {
        // 验证规则冲突，计算所有可对调课程对应课表坐标
        const mainTableDataSet = this.getTableConentByClassId(this.selectBj);
        const initContent = pktz.initTableStructure(this.timeTable);
        const enableCellDataSet = lstz.computEnableCell(mainTableDataSet, initContent, this.ruleDataSet, this.curActive, this.timeTable, this.pkJxjhList,
          this.coursePlanDataSet);
        this.tableCellDataSet = lstz.getSwapCourseList(enableCellDataSet, mainTableDataSet);
      },
      getTimeTableInfo(taskId) {
        api.timeTableInfo(taskId).then(res => {
          this.timeTable = res.data;
          this.tableRowDivider = pktz.computTableRowDivider(this.timeTable);
          this.tableCellDataSet = pktz.initTableStructure(this.timeTable);
          this.teacherTableCellDataSet = pktz.initTableStructure(this.timeTable);
          this.classTableCellDataSet = pktz.initTableStructure(this.timeTable);
        });
      },
      getRuleList(taskId) {
        api.ruleList(taskId).then(res => {
          this.ruleDataSet = res.data;
        })
      },
      getCoursePlanList(taskId) {
        api.coursePlanList(taskId).then(res => {
          const result = res.data;
          result.forEach(item => {
            const bjmc = jcsj.hqbjmcByid(this.classDataList, item.bjdm);
            const njmc = jcsj.hqnjmcByid(this.gradeDataList, item.njdm);
            const kcmc = jcsj.hqkcmcByid(this.courseDataList, item.kcdm);
            const jsmc = jcsj.hqjsmcByid(this.teacherDataList, item.zgh);
            item.bjmc = bjmc;
            item.njmc = njmc;
            item.kcmc = kcmc;
            item.jsmc = jsmc;
            item.courseName = kcmc;
            item.singleName = kcmc;
            item.doubleName = kcmc;
            item.muiltiple = false;
          });
          this.coursePlanDataSet = result;
        })
      },
      getPkJxjhList(taskId) {
        api.pkJxjhList(taskId).then(res => {
          this.pkJxjhList = res.data;
        });
      },
      // 获取班级课表
      getTableConentByClassId(classId) {
        const dataSet = this.coursePlanDataSet.filter(item => item.bjdm === classId && item.ctype === '0');
        const groupDataSet = pktz.getDataGroupByIndex(dataSet);
        const initContent = pktz.initTableStructure(this.timeTable);
        const list = pktz.getTableContent(initContent, groupDataSet, this.timeTable);
        if (this.curActive !== null) {
          list[this.curActive.row][this.curActive.col].active = true;
        }
        return list;
      },
      // 获取教师课表
      getTableConentByTeacherId(teacherId) {
        const dataSet = this.coursePlanDataSet.filter(item => item.zgh === teacherId && item.ctype === '0');
        const initContent = pktz.initTableStructure(this.timeTable);
        const list = lstz.getTeacherTableContent(initContent, dataSet, this.timeTable);
        if (this.curActive !== null) {
          list[this.curActive.row][this.curActive.col].active = true;
        }
        return list;
      },
      computStyle(item) {
        if (item.active) {
          return 'stat_3';
        } else {
          return 'stat_' + item.state;
        }
      },
      reset() {
        this.curActive = null;
        this.tableCellDataSet = pktz.initTableStructure(this.timeTable);
      }
    },
    computed: {
      classList() {
        return this.classDataList.filter(item => {
          if (this.selectNj !== null && this.selectNj !== '') {
            return item.njdm === this.selectNj;
          } else {
            return false;
          }
        });
      }
    },
    created() {
      //
    },
    watch: {
      classList() {
        this.selectBj = '';
        if (this.classList.length > 0) {
          this.selectBj = this.classList[0].uuid;
        }
      },
      selectBj(val) {
        if (val !== null && val !== '') {
          // 加载班级课表
          this.reset();
          this.tableCellDataSet = this.getTableConentByClassId(val);
        }
      }
    },
    props: {
      gradeDataList: {
        /** 年级类型列表数据**/
        type: Array,
        required: true
      },
      classDataList: {
        /** 班级级类型列表数据**/
        type: Array,
        required: true
      },
      courseDataList: {
        /** 课程级类型列表数据**/
        type: Array,
        required: true
      },
      teacherDataList: {
        /** 教师级类型列表数据**/
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped>
  .tableRowDivider {
    background-color: #f5f7fa;
    height: 0px !important;
  }

  .mt30 {
    margin-top: 30px;
  }
  .mt20 {
    margin-top: 20px;
  }
  .mt10 {
    margin-top: 10px;
  }
  .statInfoTips {
    padding-top: 8px;
  }
  .statInfoTips .stattip {
    padding-left: 30px;
    position: relative;
    line-height: 20px;
    font-size: 14px;
    color: #606266;
    margin-left: 30px;
    display: inline-block;
  }
  .statInfoTips .stattip.stat_1::after {
    content: "\20";
    position: absolute;
    width: 20px;
    height: 20px;
    background: #63c249;
    border-radius: 2px;
    top: 0;
    left: 0;
  }
  .statInfoTips .stattip.stat_2::after {
    content: "\20";
    position: absolute;
    width: 20px;
    height: 20px;
    background: #eff9ec;
    border: 1px solid #d3eecc;
    border-radius: 2px;
    top: 0;
    left: 0;
  }
  .statInfoTips .stattip.stat_3::after {
    content: "\20";
    position: absolute;
    width: 20px;
    height: 20px;
    background: #fcf6ec;
    border: 1px solid #f7e5cb;
    border-radius: 2px;
    top: 0;
    left: 0;
  }
  .statInfoTips .stattip.stat_4::after {
    content: "\20";
    position: absolute;
    width: 20px;
    height: 20px;
    background: #f5f5f5;
    border: 1px solid #f5f5f5;
    border-radius: 2px;
    top: 0;
    left: 0;
  }
  .tzkcTable td span {
    cursor: pointer;
  }
  .tzkcTable td > span.stat_1 {
    width: 100%;
    height: 32px;
    background: #eff9ec;
    font-size: 14px;
    color: #63c249;
    line-height: 30px;
    border: 1px solid #d3eecc;
    border-radius: 2px;
    display: block;
    position: relative;
  }
  .tzkcTable td > span.stat_2 {
    width: 100%;
    height: 32px;
    background: #fcf6ec;
    font-size: 14px;
    color: #e6a23c;
    line-height: 30px;
    border: 1px solid #f7e5cb;
    border-radius: 2px;
    display: block;
    position: relative;
  }
  .tzkcTable td > span.stat_3 {
    width: 100%;
    height: 32px;
    background: #63c249;
    font-size: 14px;
    color: #fff;
    line-height: 30px;
    border: 1px solid #63c249;
    border-radius: 2px;
    display: block;
    position: relative;
  }
  .tzkcTable td > span.stat_4 {
    width: 100%;
    height: 32px;
    background: #f5f5f5;
    font-size: 14px;
    color: #000;
    line-height: 30px;
    border: 1px solid #f5f5f5;
    border-radius: 2px;
    display: block;
    position: relative;
  }
  .tzkcTable .zcq > span {
    width: 18%;
    margin: 5px 1%;
    float: left;
    height: 32px;
    line-height: 30px;
    border-radius: 2px;
    display: block;
    position: relative;
  }
  .tzkcTable .zcq {
    line-height: 30px;
  }
  .tzkcTable .zcq > span {
    background: #fff;
    font-size: 14px;
    color: #606266;
    border: 1px solid #e0e0e0;
  }
  .tzkcTable .zcq > span.stat_1 {
    background: #eff9ec;
    font-size: 14px;
    color: #63c249;
    border: 1px solid #d3eecc;
  }
  .tzkcTable .zcq > span.stat_2 {
    background: #fcf6ec;
    font-size: 14px;
    color: #e6a23c;
    border: 1px solid #f7e5cb;
  }
  .tzkcTable .zcq > span.stat_3 {
    background: #63c249;
    font-size: 14px;
    color: #fff;
    border: 1px solid #63c249;
  }
  .tzteachbox .tzteachtit {
    font-size: 14px;
    color: #606266;
  }
  .tzteachbox .tzteachUnit {
    padding-right: 20px;
  }
  .gentable {
    border-collapse: collapse;
    width: 100%;
  }
  .gentable th {
    background: #f5f7fa;
  }
  .gentable th,
  .gentable td {
    width: 300px;
    line-height: 40px;
    height: 50px;
    border: 1px solid #eaedf4;
    text-align: center;
    color: #606266;
    font-size: 14px;
  }
  .gentable td {
    padding: 5px;
  }
  .gentable th.xh,
  .gentable td.xh {
    width: 50px;
  }
</style>
