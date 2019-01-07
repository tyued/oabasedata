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
            <el-select clearable @change="queryBook" v-model="ruleForm.Grade" placeholder="请选择学期">
              <el-option label="上学期" :value="1"></el-option>
              <el-option label="下学期" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="inline-item">
          <el-form-item label="班级" prop="Bj">
            <el-select @change="queryBook" clearable v-model="ruleForm.Bj" placeholder="请选择班级">
              <el-option v-for="(item, index) in BjArr" :label="item.ClassName" :value="item.ID" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="inline-item">
          <el-form-item label="必读/选读" prop="Require">
            <el-select @change="queryBook" clearable v-model="ruleForm.Require" placeholder="所有类型">
              <el-option label="必读" :value="1"></el-option>
              <el-option label="选读" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="inline-item">
          <el-form-item label="图书类型" prop="BookType">
            <el-select @change="queryBook" v-model="ruleForm.BookType" placeholder="请选择图书类型">
              <el-option label="历史/地理" :value="1"></el-option>
              <el-option label="故事/漫画" :value="2"></el-option>
              <el-option label="国学/礼仪" :value="3"></el-option>
              <el-option label="名人/传记" :value="4"></el-option>
              <el-option label="人文/教育" :value="5"></el-option>
              <el-option label="诗词/散文" :value="6"></el-option>
              <el-option label="艺术/综合" :value="7"></el-option>
              <el-option label="自然/科普" :value="8"></el-option>
              <el-option label="小说/名著" :value="9"></el-option>
              <el-option label="其他" :value="10"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="inline-item">
          <el-form-item label="书目" prop="BookId">
            <el-select clearable v-model="ruleForm.BookId" placeholder="请选择相关书目">
              <el-option v-for="(item, index) in BookList" :label="item.BookName" :value="item.BookId" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col style="width: 600px;">
          <el-form-item label="姓名">
            <el-input maxlength="20" size="medium" style="width: 200px;" v-model="searchName" placeholder="请输入姓名"></el-input>
            <el-button style="margin-left: 20px;" type="primary" @click="handleSearch('ruleFormQS')">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-alert title="请先选择年级和班级，然后点搜索！" type="error" close-text="知道了"></el-alert>
    <el-row style="margin: 10px 0;">
      <el-table :data="tableData" border style="width: 100%;" empty-text="没有找到符合条件的记录~">
        <el-table-column prop="Name" label="姓名"></el-table-column>
        <el-table-column prop="ClassName" label="班级"></el-table-column>
        <el-table-column prop="BookName" label="书目名称"></el-table-column>
        <el-table-column prop="BookType" label="图书类型"></el-table-column>
        <el-table-column prop="Type" label="必读/选读"></el-table-column>
        <el-table-column prop="ExCount" label="读书心得数"></el-table-column>
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
  formatBookType,
  formatType,
  formatDate
} from "utils/getNjBjXq.js";
export default {
  name: "readCount-student",
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
      BookList: [],
      classOptions: [],
      BjArr: [],
      xxdm: null,
      searchName: "",
      tableData: [],
      HaveTerm: 2,
      ruleForm: {
        Class: "",
        Grade: "",
        Bj: "",
        Require: "",
        BookType: "",
        BookId: ""
      },
      rule: {
        Class: [
          {
            required: true,
            message: "请选择年级",
            trigger: "change"
          }
        ],
        Bj: [
          {
            required: true,
            message: "请选择班级",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    async getList(Page = 1, PageSize = this.size) {
      this.flag = false;
      let res = await api.GetCommentListByStudent({
        schoolcode: this.xxdm,
        class: this.ruleForm.Class,
        grade: this.ruleForm.Grade,
        classcode: this.ruleForm.Bj,
        type: this.ruleForm.Require,
        BookType: this.ruleForm.BookType,
        bookid: this.ruleForm.BookId,
        name: this.searchName
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
        let arr = Value.slice((Page - 1) * PageSize, Page * PageSize);
        arr.forEach(item => {
          item.Type = formatType(item.Type);
          item.BookType = formatBookType(item.BookType);
        });
        this.tableData = arr;
      }
      this.flag = true;
    },
    handleDataOut(formName) {
      window.open(
        `http://newreadlevel.91sst.com.cn/home/GetHonorByStudent?schoolcode=${
          this.xxdm
        }&class=${this.ruleForm.Class}&grade=${this.ruleForm.Grade}&classcode=${
          this.ruleForm.Bj
        }&bookid=${this.ruleForm.BookId}&type=${
          this.ruleForm.Require
        }&BookType=${
          this.ruleForm.BookType
        }&ExcelName=阅读成果统计-按学生统计-${formatDate()}`
      );
    },
    handleSearch(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.getList(1, this.size);
        }
      });
    },
    queryClass() {
      this.BjArr = this.BjArrAll.filter(item => {
        return item.ClassID === this.ruleForm.Class;
      });
      this.getBook();
    },
    queryBook() {
      this.getBook();
    },
    getBook() {
      let query = {
        SchoolCode: this.xxdm,
        Page: 1,
        PageSize: 10000,
        Class: this.ruleForm.Class.slice(-1),
        Grade: this.ruleForm.Grade,
        classcode: this.ruleForm.Bj,
        Type: this.ruleForm.Require,
        BookType: this.ruleForm.BookType
      };
      api.getBookId(query).then(res => {
        if (res.ResultCode == 1 && res.Value.List) {
          this.BookList = res.Value.List.map(book => {
            let { BookName, ID, BookId } = book;
            return {
              BookName,
              BookId: ID
            };
          });
        }
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


