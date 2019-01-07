<template>
  <div>
    <section style="padding: 20px;">
      <div id="main" style="width: 440px;height:400px;"></div>
      <div id="right-table">
        <el-row>(当前书本有选择题：{{q1}}，填空题：{{q2}}，判断题：{{q3}}，多选题：{{q4}})</el-row>
        <div class="center-box">
          <el-row>
            <el-col :span="8">
              <i class="el-icon-menu" style="color: rgb(46, 199, 201)"></i> &nbsp;【选择题】</el-col>
            <el-col :span="8">数量 &nbsp;<input type="number" min="0" :max="q1" v-model="Question1"></el-col>
            <el-col :span="8">分数 &nbsp;<input type="number" min="0" v-model="Question1Score"></el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <i class="el-icon-menu" style="color: rgb(182, 162, 222)"></i> &nbsp;【填空题】</el-col>
            <el-col :span="8">数量 &nbsp;<input type="number" min="0" :max="q2" v-model="Question2"></el-col>
            <el-col :span="8">分数 &nbsp;<input type="number" min="0" v-model="Question2Score"></el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <i class="el-icon-menu" style="color: rgb(90, 177, 239)"></i> &nbsp;【判断题】</el-col>
            <el-col :span="8">数量 &nbsp;<input type="number" min="0" :max="q3" v-model="Question3"></el-col>
            <el-col :span="8">分数 &nbsp;<input type="number" min="0" v-model="Question3Score"></el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <i class="el-icon-menu" style="color: rgb(255, 185, 128)"></i> &nbsp;【多选题】</el-col>
            <el-col :span="8">数量 &nbsp;<input type="number" min="0" :max="q4" v-model="Question4"></el-col>
            <el-col :span="8">分数 &nbsp;<input type="number" min="0" v-model="Question4Score"></el-col>
          </el-row>
        </div>
        <el-row>试卷总分：{{totalScore}}分&emsp;合格分数 &nbsp;<input type="number" min="0" :max="totalScore" v-model="NeedScore">&emsp;考试时长 &nbsp;<input type="number" min="0" v-model="AnswerTime"> &nbsp;分钟</el-row>
        <el-row class="btns">
          <el-button class="save-btn" type="success" @click="saveTable">保存</el-button>
        </el-row>
      </div>
    </section>
    <el-row class="btn-box">
      <el-button v-show="idx > 0" type="primary" @click="goPrev">上一本</el-button>
      <el-button v-show="idx < bookArr.length - 1" type="primary" @click="goNext">下一本</el-button>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
section {
  overflow: hidden;
}
#main {
  float: left;
}
#right-table {
  border-radius: 2px;
  padding: 10px;
  float: left;
  width: 440px;
  height: 400px;
  background-color: #eee;
  text-align: center;
  input {
    width: 46px;
  }
  .center-box {
    padding: 0 10px;
  }
  .el-row {
    height: 50px;
    line-height: 50px;
  }
  .save-btn {
    margin-top: 20px;
    width: 120px;
    // font-size: 18px;
    text-align: center;
    // line-height: ;
  }
}
.btn-box {
  width: 880px;
  text-align: center;
}
</style>
<script>
import * as api from "api/publicLibManager";
import echarts from "echarts";
import { getSchoolCode } from "utils/getNjBjXq.js";
require("echarts/theme/macarons"); // echarts 主题
export default {
  props: ["BookId", "ClassIdx", "GradeIdx"],
  created() {
    this.getData();
    this.SchoolCode = getSchoolCode();
    this.$emit(
      "getBookName",
      this.$route.query.BookId,
      this.$route.query.Class,
      this.$route.query.Grade
    );
    this.queryQIdOut();
    // this.countNumber()
  },
  mounted() {
    this.initEcharts();
  },
  watch: {
    Question1: function(val) {
      this.myChart.setOption({
        series: [
          {
            data: [
              { value: val * this.Question1Score, name: "选择题" },
              { value: this.Question2 * this.Question2Score, name: "填空题" },
              { value: this.Question3 * this.Question3Score, name: "判断题" },
              { value: this.Question4 * this.Question4Score, name: "多选题" }
            ]
          }
        ]
      });
    },
    Question2: function(val) {
      this.myChart.setOption({
        series: [
          {
            data: [
              { value: this.Question1 * this.Question1Score, name: "选择题" },
              { value: val * this.Question2Score, name: "填空题" },
              { value: this.Question3 * this.Question3Score, name: "判断题" },
              { value: this.Question4 * this.Question4Score, name: "多选题" }
            ]
          }
        ]
      });
    },
    Question3: function(val) {
      this.myChart.setOption({
        series: [
          {
            data: [
              { value: this.Question1 * this.Question1Score, name: "选择题" },
              { value: this.Question2 * this.Question2Score, name: "填空题" },
              { value: val * this.Question3Score, name: "判断题" },
              { value: this.Question4 * this.Question4Score, name: "多选题" }
            ]
          }
        ]
      });
    },
    Question4: function(val) {
      this.myChart.setOption({
        series: [
          {
            data: [
              { value: this.Question1 * this.Question1Score, name: "选择题" },
              { value: this.Question2 * this.Question2Score, name: "填空题" },
              { value: this.Question3 * this.Question3Score, name: "判断题" },
              { value: val * this.Question4Score, name: "多选题" }
            ]
          }
        ]
      });
    },
    Question1Score: function(val) {
      this.myChart.setOption({
        series: [
          {
            data: [
              { value: this.Question1 * val, name: "选择题" },
              { value: this.Question2 * this.Question2Score, name: "填空题" },
              { value: this.Question3 * this.Question3Score, name: "判断题" },
              { value: this.Question4 * this.Question4Score, name: "多选题" }
            ]
          }
        ]
      });
    },
    Question2Score: function(val) {
      this.myChart.setOption({
        series: [
          {
            data: [
              { value: this.Question1 * this.Question1Score, name: "选择题" },
              { value: this.Question2 * val, name: "填空题" },
              { value: this.Question3 * this.Question3Score, name: "判断题" },
              { value: this.Question4 * this.Question4Score, name: "多选题" }
            ]
          }
        ]
      });
    },
    Question3Score: function(val) {
      this.myChart.setOption({
        series: [
          {
            data: [
              { value: this.Question1 * this.Question1Score, name: "选择题" },
              { value: this.Question2 * this.Question2Score, name: "填空题" },
              { value: this.Question3 * val, name: "判断题" },
              { value: this.Question4 * this.Question4Score, name: "多选题" }
            ]
          }
        ]
      });
    },
    Question4Score: function(val) {
      this.myChart.setOption({
        series: [
          {
            data: [
              { value: this.Question1 * this.Question1Score, name: "选择题" },
              { value: this.Question2 * this.Question2Score, name: "填空题" },
              { value: this.Question3 * this.Question3Score, name: "判断题" },
              { value: this.Question4 * val, name: "多选题" }
            ]
          }
        ]
      });
    },
  },
  beforeDestroy() {
    if (!this.myChart) {
      return;
    }
    this.myChart.dispose();
    this.myChart = null;
  },
  computed: {
    totalScore() {
      return (
        parseInt(this.Question1Score) * this.Question1 +
        parseInt(this.Question2Score) * this.Question2 +
        parseInt(this.Question3Score) * this.Question3 +
        parseInt(this.Question4Score) * this.Question4
      );
    }
  },
  data() {
    return {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      bookArr: [],
      SchoolCode: "",
      idx: null,
      BookID: "",
      NeedScore: 0,
      AnswerTime: 0,
      Question1Score: 0,
      Question2Score: 0,
      Question3Score: 0,
      Question4Score: 0,
      Question1: 0,
      Question2: 0,
      Question3: 0,
      Question4: 0,
      myChart: null,
      option: {
        // title: {
        //   text: "题目类型",
        //   // subtext: "纯属虚构",
        //   x: "center"
        // },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["选择题", "填空题", "判断题", "多选题"]
        },
        series: [
          {
            name: "题目类型",
            type: "pie",
            radius: "55%",
            center: ["40%", "60%"],
            data: [
              { value: 0, name: "选择题" },
              { value: 0, name: "填空题" },
              { value: 0, name: "判断题" },
              { value: 0, name: "多选题" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    initEcharts() { 
      this.myChart = echarts.init(document.getElementById("main"), "macarons");
      this.myChart.setOption(this.option);
    },
    getData(BookID = this.$route.query.BookId) { // 获取数据
      this.q1 = 0
      this.q2 = 0
      this.q3 = 0
      this.q4 = 0
      api.getQList({
        SchoolCode: this.SchoolCode,
        Page: 1,
        PageSize: 10000,
        BookId: BookID
      }).then((res) => {
        if (res.Value) {
          res.Value.List.forEach((item) => {
            switch (item.Type) {
              case 1:
                this.q1++
                break;
              case 2:
                this.q2++
                break;
              case 3:
                this.q3++
                break;
              case 4:
                this.q4++
                break;
            }
          })
        }
      })

      api
        .getRuleInfo({
          BookID
        })
        .then(res => {
          // console.log(res)
          const {
            AnswerTime,
            NeedScore,
            BookID,
            Question1,
            Question2,
            Question3,
            Question4,
            Question1Score,
            Question2Score,
            Question3Score,
            Question4Score
          } = res.Value;
          this.NeedScore = NeedScore;
          this.AnswerTime = AnswerTime == 0 ? 5 : AnswerTime;
          this.BookID = BookID;
          this.Question1 = Question1;
          this.Question2 = Question2;
          this.Question3 = Question3;
          this.Question4 = Question4;
          this.Question1Score = Question1Score;
          this.Question2Score = Question2Score;
          this.Question3Score = Question3Score;
          this.Question4Score = Question4Score;
          this.myChart.setOption({
            series: [
              {
                data: [
                  { value: Question1 * Question1Score, name: "选择题" },
                  { value: Question2 * Question2Score, name: "填空题" },
                  { value: Question3 * Question3Score, name: "判断题" },
                  { value: Question4 * Question4Score, name: "多选题" }
                ]
              }
            ]
          });
        });
    },
    saveTable() {
      let arr = [
        this.Question1,
        this.Question2,
        this.Question3,
        this.Question4,
        this.Question1Score,
        this.Question2Score,
        this.Question3Score,
        this.Question4Score,
        this.NeedScore,
        this.AnswerTime,
      ]
      let bool = arr.every((n) => {
        n = Number(n)
        return n >= 0 && n === parseInt(n)
      })
      if (!bool) {
        this.$notify.error({
          title: "错误",
          message: `请输入正整数`
        });
        return 
      }
      if (this.Question1 > this.q1) {
        this.$notify.error({
          title: "错误",
          message: `选择题总数不能超过${this.q1}题`
        });
        return 
      } else if (this.Question2 > this.q2) {
        this.$notify.error({
          title: "错误",
          message: `填空题总数不能超过${this.q2}题`
        });
        return 
      } else if (this.Question3 > this.q3) {
        this.$notify.error({
          title: "错误",
          message: `判断题总数不能超过${this.q3}题`
        });
        return 
      } else if (this.Question4 > this.q4) {
        this.$notify.error({
          title: "错误",
          message: `多选题总数不能超过${this.q4}题`
        });
        return 
      }
      if (this.NeedScore > this.totalScore) {
        this.$notify.error({
          title: "错误",
          message: "合格分数不能大于总分！"
        });
        return;
      }
      if (this.AnswerTime < 5) {
        this.$notify.error({
          title: "错误",
          message: "考试时间不能小于五分钟"
        });
        return;
      }
      api
        .saveRuleInfo({
          BookID: this.BookId,
          Question1: this.Question1,
          Question1Score: this.Question1Score,
          Question2: this.Question2,
          Question2Score: this.Question2Score,
          Question3: this.Question3,
          Question3Score: this.Question3Score,
          Question4: this.Question4,
          Question4Score: this.Question4Score,
          AnswerTime: this.AnswerTime,
          NeedScore: this.NeedScore
        })
        .then(res => {
          if (res.State == 1) {
            this.$notify({
              title: "成功",
              message: "保存成功",
              type: "success"
            });
            this.getData(this.BookId);
          }
        });
    },
    goPrev() { // 上一页
      this.idx--;
      if (this.idx < 0) {
        this.idx = 0;
      }
      this.getData(this.bookArr[this.idx].BookId);
      this.$emit(
        "getBookName",
        this.bookArr[this.idx].BookId,
        this.$route.query.Class,
        this.$route.query.Grade,
      );
    },
    goNext() {
      this.idx++;
      if (this.idx > this.bookArr.length - 1) {
        this.idx = this.bookArr.length - 1;
      }
      this.getData(this.bookArr[this.idx].BookId);
      this.$emit(
        "getBookName",
        this.bookArr[this.idx].BookId,
        this.$route.query.Class,
        this.$route.query.Grade,
      );
    },
    queryQIdOut() { // 获取书本列表
      let query = {
        SchoolCode: this.SchoolCode,
        Page: 1,
        PageSize: 10000,
        Class: this.$route.query.Class,
        Grade: this.$route.query.Grade
      };
      if (!query.Grade) {
        delete query.Grade
      }
      api.getBookId(query).then(res => {
        this.bookArr = res.Value.List.map(book => {
          let { BookName, ID, BookId } = book;
          return {
            BookName,
            BookId: ID
          };
        });
        this.bookArr.forEach((item, index) => {
          if (item.BookId == this.$route.query.BookId) {
            this.idx = index;
          }
        });
      });
    }
  }
};
</script>
