<template>
  <div class="app-container readcount">
    <el-row>
      <el-button type="primary" @click="handleDataOut('ruleFormQS')">导出数据</el-button>
    </el-row>

    <el-row class="form-item">
      <el-form :model="ruleForm" :rules="rule" ref="ruleFormQS" label-width="100px">
        <el-col class="inline-item">
          <el-form-item label="所属年级" prop="Class">
            <el-select clearable @change="queryClass" v-model="ruleForm.Class" placeholder="请选择年级">
              <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="inline-item">
          <el-form-item v-if="HaveTerm == 0" label="所属学期" prop="Grade">
            <el-select clearable @change="queryClass" v-model="ruleForm.Grade" placeholder="请选择学期">
              <el-option label="上学期" :value="1"></el-option>
              <el-option label="下学期" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="inline-item">
          <el-form-item label="班级" prop="Bj">
            <el-select clearable v-model="ruleForm.Bj" placeholder="请选择班级">
              <el-option v-for="(item, index) in BjArr" :label="item.ClassName" :value="item.ID" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="inline-item">
          <el-button style="margin-left: 20px;" type="primary" @click="handleSearch('ruleFormQS')">搜索</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-alert title="请先选择年级，然后点搜索！" type="error" close-text="知道了"></el-alert>
    <el-row style="margin: 10px 0;">
      <el-table :data="tableData" border style="width: 100%" empty-text="没有找到符合条件的记录~">
        <el-table-column prop="ClassName" label="班级"></el-table-column>
        <el-table-column prop="StudentCount" label="学生数"></el-table-column>
        <el-table-column prop="StudentHonor" label="读书心得数"></el-table-column>
      </el-table>
    </el-row>
    <!-- 分页组件 -->
    <el-row>
      <PageBar :currentpage="CurrentPage" @handlePageSize="handleCurrentPageSize" @handlePage="handleCurrentPage" :total="TotalPage"></PageBar>
    </el-row>
  </div>

</template>

<style scoped lang="scss">
</style>

<script>
import * as api from "api/publicLibManager";
import PageBar from "../../publicLibManager/PageBar/index";
import {
  getNj,
  getGradeState,
  getSchoolCode,
  getBj,
  formatDate
} from "utils/getNjBjXq.js";
export default {
  name: "readCount-nj",
  components: {
    PageBar
  },
  async created() {
    this.xxdm = getSchoolCode();
    this.HaveTerm = await getGradeState(this.xxdm);
    let res = await getNj(this.xxdm);
    this.classOptions = res.map((item, index) => ({
      value: item.ClassID,
      label: item.ClassName
    }));
    this.BjArrAll = await getBj(this.xxdm);
  },
  data() {
    return {
      size: 10,
      flag: true,
      CurrentPage: 0,
      TotalPage: 1,
      classOptions: [],
      BjArr: [],
      xxdm: null,
      tableData: [],
      HaveTerm: 2,
      ruleForm: {
        Class: "",
        Grade: "",
        Bj: ""
      },
      rule: {
        Class: [
          {
            required: true,
            message: "请选择年级",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    async getList(Page = 1, PageSize = this.size) {
      this.flag = false;
      let res = await api.GetCommentListByClass({
        schoolcode: this.xxdm,
        class: this.ruleForm.Class,
        grade: this.ruleForm.Grade,
        classcode: this.ruleForm.Bj
      });
      let { State, Value } = res;
      if (State == 1 && Value) {
        // 排序规则：按照读书心得由多到少排序
        Value = Value.sort(
          (label => {
            return (a, b) => {
              let val1 = a[label];
              let val2 = b[label];
              if (val1 > val2) {
                return -1;
              } else if (val1 < val2) {
                return 1;
              } else {
                return 0;
              }
            };
          })("StudentHonor")
        );
        this.TotalPage = Value.length;
        this.tableData = Value.slice((Page - 1) * PageSize, Page * PageSize);
      }
      this.flag = true;
    },
    handleDataOut(formName) {
      window.open(
        `http://newreadlevel.91sst.com.cn/home/GetHonorByClass?schoolcode=${
          this.xxdm
        }&class=${this.ruleForm.Class}&grade=${this.ruleForm.Grade}&classcode=${
          this.ruleForm.Bj
        }&ExcelName=阅读成果统计-按年级统计-${formatDate()}`
      );
    },
    handleSearch(formName) {
      this.$refs[formName].validate(valid => {
        // 如果请求成功才可以再次请求
        if (valid && this.flag) {
          this.getList(1, this.size);
        }
      });
    },
    queryClass() {
      this.BjArr = this.BjArrAll.filter(item => {
        return item.ClassID === this.ruleForm.Class;
      });
    },
    handleCurrentPage(number) {
      this.getList(number);
      this.CurrentPage = number;
    },
    handleCurrentPageSize(number) {
      this.size = number;
      this.getList(1, number);
      this.CurrentPage = 1;
    }
  }
};
</script>


