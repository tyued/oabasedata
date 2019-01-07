<template>
    <div class="app-container calendar-list-intoBook">
        <span style="font-size:20px">书目：{{BookName}}</span>
        
        
        <p>
         <el-radio-group v-model="checkList" @change="b" >
              <el-radio >全选</el-radio>
            <el-radio :label="1" >选择题</el-radio>
            <el-radio :label="2">填空题</el-radio>
            <el-radio :label="3">判断题</el-radio>
             <el-radio :label="4">多选题</el-radio>
              <!-- <el-input placeholder="请输入关键字" class="sou"></el-input> -->
            <el-button type="primary" style="display:inline;margin-left:30px" @click.stop="searchlist" >搜索</el-button>
          </el-radio-group>
          
        </p>


              
     <div v-for= 'item in formdata' :key= 'item.ID'>
          <el-card class="box-card">
       <el-row>
         <el-row>
            <el-checkbox > <P style="color:blue">[{{item.qname}}] </P></el-checkbox>&nbsp;{{item.Title}}
         </el-row>
         <!-- 选择题 -->
         <el-row v-if="item.Type == 1">
        <p v-for="(ele, idx) in item.qArr" :key="idx">
          <el-radio disabled v-model="item.Answer" :label="++idx + ''">
            <span style="color: #303133;">{{ele}}</span>
          </el-radio>
        </p>
      </el-row>
      
      <el-row v-if="item.Type == 2">
        <!-- 填空题 -->
        <!-- <span style="color: #303133;padding-button:10px;" >{{item.qArr[0]}}</span> -->
      </el-row>
      <el-row v-if="item.Type == 3">
        <!-- 判断题 -->
        <p>
          <el-radio disabled v-model="item.Answer" label="1">
            <span style="color: #303133;">{{item.qArr[0]}}</span>
          </el-radio>
        </p>
        <p>
          <el-radio disabled v-model="item.Answer" label="2">
            <span style="color: #303133;">{{item.qArr[1]}}</span>
          </el-radio>
        </p>
      </el-row>
       <el-row v-if="item.Type == 4">
        <el-checkbox-group v-model="item.ansArr">
          <p v-for="(obj, objidx) in item.qArr" :key="objidx">
            <el-checkbox :label="++objidx + ''" disabled>
              <span style="color: #303133;">{{obj}}</span>
            </el-checkbox>
          </p>
        </el-checkbox-group>
      </el-row>


       <div class="hidden-row" :style="'height:'+item.styleIndex+'px;'">
      <p>参考答案：{{item.Answer.split('|').join(',')}}</p>
      <p style="margin-bottom: 0">难易度： {{item.diff}}</p>
    </div>
       </el-row>
              <el-row>
                <p style="margin-top:65px">{{Class}} {{Grade}} </p>
              </el-row>
            </el-card>
            <br>
          </div>
    <div class="block">
   
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="this.CurrentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.TotalPage">
    </el-pagination>

  </div>    
    </div>

</template>
<style scoped lang="scss">
.sou {
  width: 200px;
  height: 30px;
  // display: inline-block;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}
</style>

<script>
// import { page } from "api/project/mainProject/index";
import * as http from "api/admin/read/readbook.js";
export default {
  name: "textbook",
  data() {
    
    return {
      checkList: [],
      shousuo: "",
      
      formdata: {
        item: "",
        sheet: "",
        mazy: "",
        book: "",
        grard: "",
        year: "",
        queryId: "",
       
      }
    };
     
  },
  mounted() {
    this.queryId = this.$route.query.id;
    console.log(1);
    this.BookID(this.queryId);
  },
  created() {
    this.BookName = this.$route.query.BookName;
    this.Class = this.$route.query.Class
    this.Grade = this.$route.query.Grade
    
  },
 

  methods: {
    
    //页码
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    searchlist() {
      this.BookID();
    },
    b(b) {
      console.log(b);
      this.shousuo = b;
    },
    BookID(a) {
      console.log(a);
      let that = this;
      http
        .BookID({
          SchoolCode: localStorage.getItem("xxdm"), //学校代码。必传
          Page: this.CurrentPage, //当前页面,默认1
          PageSize: this.TotalPage, //页码数,默认15
          BookID: a, //书本ID
          Type: this.shousuo, //题型
          Difficulty: "" //困难度
        })
        .then(res => {
          // console.log(res.Value.List);
          that.formdata = res.Value.List;

          console.log(res);
          this.CurrentPage = res.Value.CurrentPage;
          this.TotalPage = res.Value.TotalItemCount;


            

          res.Value.List.forEach(item => {
            item.ansArr = item.Answer.split("|");
            item.state = false;
            item.styleIndex = 0;
            item.qArr = item.Question.split("|");
            switch (item.Difficulty) {
              case 1:
                item.diff = "简单";
                break;
              case 2:
                item.diff = "一般";
                break;
              case 3:
                item.diff = "困难";
                break;
            }

            switch (item.Type) {
              case 1:
                item.qname = "选择题";
                break;
              case 2:
                item.qname = "填空题";
                break;
              case 3:
                item.qname = "判断题";
                break;
              case 4:
                item.qname = "多选题";
                break;
            }

            switch (item.Class) {
              case 1:
                item.ClassName = "一年级";
                break;
              case 2:
                item.ClassName = "二年级";
                break;
              case 3:
                item.ClassName = "三年级";
                break;
              case 4:
                item.ClassName = "四年级";
                break;
              case 5:
                item.ClassName = "五年级";
                break;
              case 6:
                item.ClassName = "六年级";
                break;
            }
            switch (item.Grade) {
              case 1:
                item.GradeName = "上学期";
                break;
              case 2:
                item.GradeName = "下学期";
                break;
            }
          });
          this.QList = res.Value.List;
        });
    }
  }
};
</script>
