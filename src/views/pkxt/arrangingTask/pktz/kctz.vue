<template>
  <div>
    <el-row>
      <div class="selgroup fl">
        <el-select v-model="selectNj" placeholder="请选择年级" style="width:150px;margin:0 5px;">
          <el-option v-for="item in gradeDataList" :key="item.njdm" :label="item.njmc" :value="item.njdm"></el-option>
        </el-select>
        <el-select v-model="selectKc" placeholder="请选择课程" style="width:150px;margin:0 5px;">
          <el-option v-for="item in courseList" :key="item.kcdm" :label="item.kcmc" :value="item.kcdm"></el-option>
        </el-select>
        <el-select v-model="selectJs" placeholder="请选择教师" style="width:150px;margin:0 5px;">
          <el-option v-for="item in teacherList" :key="item.zgh" :label="item.jsmc" :value="item.zgh"></el-option>
        </el-select>
      </div>
      <div class="statInfoTips fr">
        <span class="stattip stat_1">当前选中的课程</span>
        <span class="stattip stat_2">可对调课程</span>
        <span class="stattip stat_4">已对调课程</span>
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
              <td v-for="(element,colIndex) in timeTable.daysPerWeek" :key="'col-'+colIndex"
                  @click.stop="cellClick(tableCellDataSet[rowIndex][colIndex])"
                  @mouseenter.stop="cellMouseover(tableCellDataSet[rowIndex][colIndex])">

                    <!--<span :class="computStyle(tableCellDataSet[rowIndex][colIndex])">-->
                      <!--{{tableCellDataSet[rowIndex][colIndex].bjmc}}-->
                      <!--{{tableCellDataSet[rowIndex][colIndex].courseName}}-->
                    <!--</span>-->

                <template v-if="tableCellDataSet[rowIndex][colIndex].muiltiple">
                  <span :class="computStyle(tableCellDataSet[rowIndex][colIndex])">
                    {{tableCellDataSet[rowIndex][colIndex].bjmc}}
                    {{tableCellDataSet[rowIndex][colIndex].singleName}}/{{tableCellDataSet[rowIndex][colIndex].doubleName}}
                  </span>
                </template>

                <template v-else>
                  <span :class="computStyle(tableCellDataSet[rowIndex][colIndex])">
                    {{tableCellDataSet[rowIndex][colIndex].bjmc}}
                    {{tableCellDataSet[rowIndex][colIndex].courseName}}
                  </span>
                </template>

              </td>
            </tr>
          </template>
          <!-- 暂存区 -->
          <tr>
            <th class="xh" rowspan="2">暂<br>存<br>区</th>
            <td v-for="(element,colIndex) in timeTable.daysPerWeek" :key="'zcq-0-'+colIndex"
                @click.stop="cellClick(zcqDataSet[0][colIndex])"
                @mouseenter.stop="cellMouseover(zcqDataSet[0][colIndex])">
                  <span :class="computStyle(zcqDataSet[0][colIndex])">
                    {{zcqDataSet[0][colIndex].bjmc}}
                    {{zcqDataSet[0][colIndex].courseName}}
                  </span>
            </td>
          </tr>
          <tr>
            <td v-for="(element,colIndex) in timeTable.daysPerWeek" :key="'zcq-1-'+colIndex"
                @click.stop="cellClick(zcqDataSet[1][colIndex])"
                @mouseenter.stop="cellMouseover(zcqDataSet[1][colIndex])">
                  <span :class="computStyle(zcqDataSet[1][colIndex])">
                    {{zcqDataSet[1][colIndex].bjmc}}
                    {{zcqDataSet[1][colIndex].courseName}}
                  </span>
            </td>
          </tr>
        </table>
      </template>
    </el-row>

    <el-row class="tzteachbox mt30">
      <el-col :span="12" class="tzteachUnit">
        <div class="tzteachtit">{{swapTeacherName}}教师课表</div>
        <template v-if="timeTable !== null && timeTable !== ''">
          <table cellpadding="0" cellspacing="0" class="gentable fl mt10 tzkcTable">
            <tr>
              <th class="xh"></th>
              <th v-for="(item, index) in timeTable.weekdayList" :key="'teachtitle'+index">{{item | weekdayFormat}}</th>
            </tr>
            <template v-for="(item, rowIndex) in teacherTableCellDataSet">
              <tr v-if="tableRowDivider.includes(rowIndex)" :key="'teach-row-divider-'+rowIndex">
                <td class="xh tableRowDivider" :colspan="(timeTable.daysPerWeek + 1)"></td>
              </tr>
              <tr :key="'teach-row-'+rowIndex">
                <td class="xh">{{rowIndex + 1}}</td>
                <td v-for="(element,colIndex) in timeTable.daysPerWeek" :key="'teach-col-'+colIndex">
                    <span :class="computStyle(teacherTableCellDataSet[rowIndex][colIndex])">
                      {{teacherTableCellDataSet[rowIndex][colIndex].bjmc}}
                      {{teacherTableCellDataSet[rowIndex][colIndex].kcmc}}
                    </span>
                </td>
              </tr>
            </template>
          </table>
        </template>
      </el-col>
      <el-col :span="12" class="tzteachUnit">
        <div class="tzteachtit">{{activeClassName}}班级课表</div>
        <template v-if="timeTable !== null && timeTable !== ''">
          <table cellpadding="0" cellspacing="0" class="gentable fl mt10 tzkcTable">
            <tr>
              <th class="xh"></th>
              <th v-for="(item, index) in timeTable.weekdayList" :key="'classtitle'+index">{{item | weekdayFormat}}</th>
            </tr>
            <template v-for="(item, rowIndex) in classTableCellDataSet">
              <tr v-if="tableRowDivider.includes(rowIndex)" :key="'class-row-divider-'+rowIndex">
                <td class="xh tableRowDivider" :colspan="(timeTable.daysPerWeek + 1)"></td>
              </tr>
              <tr :key="'class-row-'+rowIndex">
                <td class="xh">{{rowIndex + 1}}</td>
                <td v-for="(element,colIndex) in timeTable.daysPerWeek" :key="'class-col-'+colIndex">
                    <span :class="computStyle(classTableCellDataSet[rowIndex][colIndex])">
                      {{classTableCellDataSet[rowIndex][colIndex].kcmc}}
                    </span>
                </td>
              </tr>
            </template>
          </table>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as api from '@/api/pkxt/arrangingTask/pktz/index';
  import * as pktz from './pktz.js';
  import * as kctz from './kctz.js';
  import jcsj from '@/api/jcsj';
  export default {
    data() {
      return {
        activeClassName: null, // 当前选中课程教师名称
        swapTeacherName: null, // 鼠标划入时对应课程教师名称
        curActive: null, // 当前选中课程对象
        mouseEnterIndex: null, // 鼠标划入时对应课程对象
        mouseLeaveIndex: null, // 鼠标划出时对应课程教对象
        query: { taskId: this.$route.query.rwid },
        selectNj: '', // 当前选中年级
        selectKc: '', // 当前选中课程
        selectJs: '', // 当前选中教师
        timeTable: '', // 课表结构
        tableCellDataSet: [], // 主课表
        teacherTableCellDataSet: [], // 教师课表
        classTableCellDataSet: [], // 班级课表
        zcqDataSet: [],
        tableRowDivider: [], // 上午、下午、晚上课表分割下标列表
        ruleDataSet: [], // 规则列表
        coursePlanDataSet: [], // 排课结果列表
        pkJxjhList: [] // 排课教学计划列表
      }
    },
    computed: {
      courseList() {
        const arr = this.pkJxjhList.filter(item => {
          if (this.selectNj !== null && this.selectNj !== '') {
            return item.njdm === this.selectNj && item.zxs > 0;
          } else {
            return false;
          }
        });
        return _.uniqWith(arr, (o1, o2) => o1.kcdm === o2.kcdm);
      },
      teacherList() {
        const result = [];
        const arr = this.pkJxjhList.filter(item => {
          if (this.selectNj !== null && this.selectNj !== ''
              && this.selectKc !== null && this.selectKc !== '') {
            return item.njdm === this.selectNj && item.zxs > 0 && item.kcdm === this.selectKc;
          } else {
            return false;
          }
        });
        arr.forEach(item => {
          const zgh = item.zgh;
          if (zgh && zgh !== null && zgh !== '') {
            const tempArr = zgh.split(',');
            tempArr.forEach(element => {
              const temp = {};
              temp.zgh = element;
              temp.jsmc = jcsj.hqjsmcByid(this.teacherDataList, element);
              result.push(temp)
            });
          }
        })
        return _.uniqWith(result, (o1, o2) => o1.zgh === o2.zgh);
      }
    },
    created() {
      //
    },
    methods: {
      loadData() {
        this.selectNj = '';
        this.selectKc = '';
        this.selectJs = '';
        this.getTimeTableInfo(this.query.taskId);
        this.getRuleList(this.query.taskId);
        this.getCoursePlanList(this.query.taskId);
        this.getPkJxjhList(this.query.taskId);
//        this.selectNj = this.gradeDataList[0].njdm;
      },
      cellClick(item) {
        if (!item.enable) {
          return;
        }
        if (this.curActive !== null) {
          if (this.curActive.index === item.index && this.curActive.ctype === item.ctype) {
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
        // 刷新教师课表
        this.refreshTeacherTableContent();
      },
      setSwapState(fromItem, toItem) {
        const fromType = fromItem.ctype;
        const toType = toItem.ctype;
        if (fromType === '1') {
          this.zcqDataSet[fromItem.row][fromItem.col].state = 4;
        } else {
          this.tableCellDataSet[fromItem.row][fromItem.col].state = 4;
        }
        if (toType === '1') {
          this.zcqDataSet[toItem.row][toItem.col].state = 4;
        } else {
          this.tableCellDataSet[toItem.row][toItem.col].state = 4;
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
        api.saveKctz(records);
      },
      refreshMainTableContent() {
        this.tableCellDataSet = this.getTableConentByTeacherId(this.selectJs);
        this.zcqDataSet = this.getZcqContentByTeacherId(this.selectJs);
      },
      refreshTeacherTableContent() {
        let teacherName = this.curActive === null ? '' : this.curActive.jsmc;
        let className = this.curActive === null ? '' : this.curActive.bjmc;
        let teacherId = this.curActive === null ? '' : this.curActive.zgh ? this.curActive.zgh : '';
        let classId = this.curActive === null ? '' : this.curActive.bjdm ? this.curActive.bjdm : '';
        if (this.specialCourse(this.curActive)) {
          console.log('特殊课程,不显示副课表');
          teacherId = '';
          teacherName = '';
          classId = '';
          className = '';
        }
        // 特殊课程,不显示副课表
        this.swapTeacherName = teacherName;
        this.activeClassName = className;
        this.teacherTableCellDataSet = this.getTableConentByTeacherId(teacherId);
        this.classTableCellDataSet = this.getTableConentByClassId(classId);
      },
      cellMouseover(item) {
        if (this.mouseEnterIndex !== null && this.mouseEnterIndex.index === item.index) {
          return;
        }
        this.mouseLeaveIndex = this.mouseEnterIndex;
        this.mouseLeaveHandler();
        this.mouseEnterIndex = item;
        this.mouseEnterHandler();
      },
      specialCourse(item) {
        if (item === null) {
          return true;
        }
        if (item.isdjs === '1' || item.isdsz !== '0' || item.ishb === '1') {
          return true;
        }
        return false;
      },
      mouseEnterHandler() {
        this.refreshMouseEnterTableContent();
        if (this.mouseEnterIndex !== null && this.mouseEnterIndex !== '' && this.mouseEnterIndex.ctype === '0') {
          this.teacherTableCellDataSet[this.mouseEnterIndex.row][this.mouseEnterIndex.col].state = 4;
          this.classTableCellDataSet[this.mouseEnterIndex.row][this.mouseEnterIndex.col].state = 4;
        }
      },
      refreshMouseEnterTableContent() {
        if (this.curActive === null) {
          return;
        }
        let teacherId = this.mouseEnterIndex.zgh === '' || this.mouseEnterIndex.zgh === null
        || !this.mouseEnterIndex.zgh ? '' : this.mouseEnterIndex.zgh;
        let teacherName = this.mouseEnterIndex.jsmc;
        // 特殊课程,不显示副课表
        if (this.specialCourse(this.mouseEnterIndex)) {
          console.log('特殊课程,不显示副课表');
          teacherId = '';
          teacherName = '';
        }
        this.teacherTableCellDataSet = this.getTableConentByTeacherId(teacherId);
        this.swapTeacherName = teacherName;
      },
      mouseLeaveHandler() {
        if (this.mouseLeaveIndex !== null && this.mouseLeaveIndex !== '' && this.mouseLeaveIndex.ctype === '0') {
          this.teacherTableCellDataSet[this.mouseLeaveIndex.row][this.mouseLeaveIndex.col].state = 0;
          this.classTableCellDataSet[this.mouseLeaveIndex.row][this.mouseLeaveIndex.col].state = 0;
        }
      },
      getTimeTableInfo(taskId) {
        api.timeTableInfo(taskId).then(res => {
          this.timeTable = res.data;
          this.tableRowDivider = pktz.computTableRowDivider(this.timeTable);
          this.tableCellDataSet = pktz.initTableStructure(this.timeTable);
          this.teacherTableCellDataSet = pktz.initTableStructure(this.timeTable);
          this.classTableCellDataSet = pktz.initTableStructure(this.timeTable);
          this.zcqDataSet = pktz.initZcqStructure(this.timeTable);
        });
      },
      computStyle(item) {
        if (item.active) {
          return 'stat_3';
        } else {
          return 'stat_' + item.state;
        }
      },
      getMainTableContent() {
        const jskb = this.getTableConentByTeacherId(this.selectJs);
        const bjkb = this.getTableConentByClassId(this.curActive.bjdm);
        jskb.forEach(item => {
          item.forEach(element => {
            if (element.enable) {
              bjkb[element.row][element.col] = element;
            }
          });
        });
        return bjkb;
      },
      computEnableCell() {
        // 验证规则冲突，计算所有可对调课程对应课表坐标
        const mainTableDataSet = this.getMainTableContent();
        const initContent = pktz.initTableStructure(this.timeTable);
        const enableCellDataSet = kctz.computEnableCell(mainTableDataSet, initContent, this.ruleDataSet, this.curActive, this.timeTable, this.pkJxjhList,
          this.coursePlanDataSet);
        this.tableCellDataSet = kctz.getSwapCourseList(enableCellDataSet, mainTableDataSet);
        // 计算暂存区可对调课程
        const zcqMainTable = this.getZcqContentByTeacherId(this.selectJs);
        const initZcqContent = pktz.initZcqStructure(this.timeTable);
        const enableZcqCellData = kctz.computZcqEnableCell(zcqMainTable, initZcqContent, this.ruleDataSet, this.curActive, this.timeTable,
          this.pkJxjhList, this.coursePlanDataSet);
        this.zcqDataSet = kctz.getSwapCourseList(enableZcqCellData, zcqMainTable);
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
            item.courseName = kcmc;
            item.jsmc = jsmc;
          });
          this.coursePlanDataSet = result;
        })
      },
      getPkJxjhList(taskId) {
        api.pkJxjhList(taskId).then(res => {
          const data = res.data;
          data.forEach(item => {
            const kcmc = jcsj.hqkcmcByid(this.courseDataList, item.kcdm);
            item.kcmc = kcmc;
          });
          this.pkJxjhList = data;
        });
      },
      // 获取班级课表
      getTableConentByClassId(classId) {
        const dataSet = this.coursePlanDataSet.filter(item => item.bjdm === classId && item.ctype === '0');
        const groupDataSet = pktz.getDataGroupByIndex(dataSet);
        const initContent = pktz.initTableStructure(this.timeTable);
        const list = pktz.getTableContent(initContent, groupDataSet, this.timeTable);
        if (this.curActive !== null && this.curActive.ctype === '0') {
          list[this.curActive.row][this.curActive.col].active = true;
        }
        return list;
      },
      // 获取暂存区内容
      getZcqContentByTeacherId(teacherId) {
        const dataSet = this.coursePlanDataSet.filter(item => item.zgh === teacherId && item.ctype === '1');
        const groupDataSet = pktz.getDataGroupByIndex(dataSet);
        const initContent = pktz.initZcqStructure(this.timeTable);
        const list = pktz.getTableContent(initContent, groupDataSet, this.timeTable);
        if (this.curActive !== null && this.curActive.ctype === '1') {
          list[this.curActive.row][this.curActive.col].active = true;
        }
        return list;
      },
      // 获取教师课表
      getTableConentByTeacherId(teacherId) {
        const dataSet = this.coursePlanDataSet.filter(item => item.zgh === teacherId && item.ctype === '0');
        const groupDataSet = pktz.getDataGroupByIndex(dataSet);
        const initContent = pktz.initTableStructure(this.timeTable);
        const list = pktz.getTableContent(initContent, groupDataSet, this.timeTable);
        if (this.curActive !== null && this.curActive.ctype === '0') {
          list[this.curActive.row][this.curActive.col].active = true;
        }
        return list;
      },
      reset() {
        this.curActive = null;
        this.tableCellDataSet = pktz.initTableStructure(this.timeTable);
        this.teacherTableCellDataSet = pktz.initTableStructure(this.timeTable);
        this.classTableCellDataSet = pktz.initTableStructure(this.timeTable);
      }
    },
    watch: {
      courseList() {
        this.selectKc = '';
        if (this.courseList.length > 0) {
//          this.selectKc = this.courseList[0].kcdm;
        }
      },
      teacherList() {
        this.selectJs = '';
        if (this.teacherList.length > 0) {
//          this.selectJs = this.teacherList[0].zgh;
        }
      },
      selectJs(val) {
        if (val !== null && val !== '') {
          this.reset();
          // 加载教师课表
          this.tableCellDataSet = this.getTableConentByTeacherId(val);
          this.zcqDataSet = this.getZcqContentByTeacherId(val);
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
