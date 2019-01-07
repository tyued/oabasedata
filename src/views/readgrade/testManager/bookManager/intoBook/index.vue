<template>
  <div class="app-container calendar-list-intoBook">
    <div style="margin:10px">
      <el-button @click="inporbook" style="margin:10px" type="primary"> 确认导入</el-button>
      <p>
      <span>年级</span>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span>学期</span>
      <el-select v-model="moudle" placeholder="请选择">
      <el-option
        v-for="item in two"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
      <el-select v-model="BookType" placeholder="请选择图书类型"  class="long" style="display:none">
        <el-option :label="item.label" :value="item.value" v-for="(item, itemindex) in BookTypelist" :key="itemindex">
      </el-option>
    </el-select>
    <el-button  type="primary" @click.stop="searchlist">查询</el-button>
    </p>
    </div>
    
  <!-- <div style="width:100%;height:400px; margin-top:50px margin-right:30px"> -->
    <!-- <div class="moban"> -->
      <div id="width">
        <div class="dis"  v-for= 'item in pulist' :key= 'item.id'>
          <div class="day"  >
          <div class="dropdown">
               <img :src="item.Image" alt="" id="img" >
            
            <div  class="dropdown-content">
                  <h2 class="content" >
                      <h4>{{item.BookName}} </h4>
                      <h6>作者 ：{{item.Author}} </h6>
                      <h6>出版社：{{item.Press}}</h6>
                      <h6>出版日期：{{item.Year}}</h6>
                      <h4>
                      <h6>导读：{{item.Review}}</h6> 
                      </h4>
                      <h5 class="type"> 
                        <span class="test"  >{{item.TypeName}}</span>
                      </h5>
                  </h2>
            </div>
              </div>  
              
            </div>

            <p class="fkl"> <span class="left">{{item.BookTypeName}}</span> 
             <span class="right">{{item.classeName}} ({{item.GradeName}})</span>   </p>
            <p>共有多少道题 :{{item.QuestionCount}}     </p>
          
            <p>
              <!-- <el-button>选择导入</el-button> -->

              <el-checkbox-button
               :label="item.label"
               v-if="!item.show"
               @change="adas(item)"
              ></el-checkbox-button>
              <el-button type="primary" v-else 
              >已导入</el-button>
                <!-- <router-link to="textbook"> <el-button>查看题目</el-button> </router-link>  -->
              <router-link :to="{path:'textbook', query:{id: item.BookId , BookName :item.BookName ,Class:item.classeName, Grade:item.GradeName}}">
                <el-button label="复选框 B"
                  style="padding-left:25px;"
                  :disabled="item.QuestionCount?false:true"
                  type='' >
                 查看题目
                </el-button>
              </router-link>
             
                </p>
        </div>
      </div>
      <br>
      <br>
      <p style="color:azure">h</p>

  
  <div class="das">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listpage.total">
    </el-pagination>
  </div>
  </div>
  
</template>

<script>

import * as http from "api/admin/read/readbook.js";
export default {
  name: "intoBook",
  data() {
    return {
      listpage: {
        page: 1,
        total: 0,
        limit: 15
      },
      booklist: {
        SchoolCode: "",
        Page: 1,
        PageSize: 15,
        Class: null,
        Grade: null,
        BookName: "",
        Type: null
      },
      Boolean:true,
     
      checkList: [], // 需要处理
      showText: false,
      hideText: true,
      from: {
        BookName: "",
        press: "",
        year: "",
        redding: "",
        content: "",
        Class: "",
        Grade: "",
        Image: "",
        press: "",
        Status: "",
        Type: ""
      },
      options: [
        {
          value: 1,
          label: "一年级"
        },
        {
          value: 2,
          label: "二年级"
        },
        {
          value: 3,
          label: "三年级"
        },
        {
          value: 4,
          label: "四年级"
        },
        {
          value: 5,
          label: "五年级"
        },
        {
          value: 6,
          label: "六年级"
        }
      ],
      value: "",
      //下拉菜单二
      two: [
        {
          value: 1,
          label: "上学期"
        },
        {
          value: 2,
          label: "下学期"
        }
      ],
      moudle: "",
      BookTypelist: [
        { label: "历史/地理", value: "1" },
        { label: "故事/漫画", value: "2" },
        { label: "国学/礼仪", value: "3" },
        { label: "名人/传记", value: "4" },
        { label: "人文/教育", value: "5" },
        { label: "诗词/散文", value: "6" },
        { label: "艺术/综合", value: "7" },
        { label: "自然/科普", value: "8" },
        { label: "小说/名著", value: "9" },
        { label: "其他", value: "10" }
      ],
      BookType: "",
      currentPage4: 1,
      pulist: []
    };
  },
  created() {
   
    // this.pubook(this.currentPage4);
  },
  mounted() {
    this.booklist.SchoolCode = localStorage.getItem("xxdm");
    this.pubook(this.booklist);
  },

  methods: {
 
    handleSizeChange(val) {
      this.booklist.PageSize = val;
      this.pubook(this.booklist);
    },
    // 切换显示另一页
    handleCurrentChange(val) {
      console.log(val);
      this.listpage.page = val;
      this.booklist.Page = val;
      this.pubook(this.booklist);
    },
     searchlist() {
      this.pubook();
     
     
    },
    adas(a) {
      // console.log(a);
      if (a.label == "选择导入") {
        a.label = "已选择导入";
        this.checkList.push(a.BookId);
      } else {
        a.label = "选择导入";
        this.checkList.map((item, index) => {
          if (a.BookId == item) {
            this.checkList.splice(index, 1);
          }
        });
      }
      // console.log(this.checkList);
    },
    // 获取书本列表
    pubook(datas) {
      console.log(datas);
      let that = this;
      // console.log(http);
      http
        .pubook(
          // datas
          {
            SchoolCode: localStorage.getItem("xxdm"), //学校代码。必传
            Page: that.listpage.page, //当前页面,默认1
            PageSize: 10, //页码数,默认15
            Class: that.value, //年级
            Grade:  that.moudle, //1为上学期，2为下学期
            BookName: "", //书本名
            Type: "" //1为必读，2为选读
          }
        )
        .then(res => {
          console.log("res");
          console.log(res);
          that.listpage.total = res.Value.TotalItemCount;
          const pulist = res.Value.List;
          if( pulist== 0){
           this.$message('没有查询到相关书目哦')
          }
          pulist.forEach((itema, indexa) => {
            if (itema.CloneTextBookId == "不存在") {
              itema.label = "选择导入";
              itema.show = false;
            } else {
              itema.label = "已选择";
              itema.show = true;
            }
          });
           pulist.forEach((itema, indexa) => {
            if (itema.QuestionCount == 0) {
              itema.Questtion = "暂无题目";
             this.Boolean = false
            } else {
              itema.Questtion = "查看题目";
             this.Boolean =true
            }
          });
          //书本类型
          pulist.forEach((itema, indexa) => {
            if (itema.BookType == 1) {
              itema.BookTypeName = "历史/地理";
            } else if (itema.BookType == 2) {
              itema.BookTypeName = "故事/漫画";
            } else if (itema.BookType == 3) {
              itema.BookTypeName = "国学/礼仪";
            } else if (itema.BookType == 4) {
              itema.BookTypeName = "故事/漫画";
            } else if (itema.BookType == 5) {
              itema.BookTypeName = "名人/传记";
            } else if (itema.BookType == 6) {
              itema.BookTypeName = "故事/漫画";
            } else if (itema.BookType == 7) {
              itema.BookTypeName = "诗词/散文";
            } else if (itema.BookType == 8) {
              itema.BookTypeName = "自然/科普";
            } else if (itema.BookType == 9) {
              itema.BookTypeName = "小说/名著";
            } else if (itema.BookType == 10) {
              itema.BookTypeName = "故事/漫画";
            }
          });
          //年级
          pulist.forEach((itema, indexa) => {
            if (itema.Class == 1) {
              itema.classeName = "一年级";
            } else if (itema.Class == 2) {
              itema.classeName = "二年级";
            } else if (itema.Class == 3) {
              itema.classeName = "三年级";
            } else if (itema.Class == 4) {
              itema.classeName = "四年级";
            } else if (itema.Class == 5) {
              itema.classeName = "五年级";
            } else if (itema.Class == 6) {
              itema.classeName = "六年级";
            }
          });
          //年级
          pulist.forEach((itema, indexa) => {
            if (itema.Grade == 1) {
              itema.GradeName = "上学期";
            } else if (itema.Grade == 2) {
              itema.GradeName = "下学期";
            }
          });
          pulist.forEach((itema, indexa) => {
            if (itema.Type == 1) {
              itema.TypeName = "必读";
            } else if (itema.Type == 2) {
              itema.TypeName = "选读";
            }
          });

          that.pulist = pulist;
          console.log(that.pulist);
        });
    },
    //传id值
    inporbook() {
      var se = this.checkList.join(",");
      http
        .inporbook({
          SchoolCode: localStorage.getItem("xxdm"),
          PBTIdS: se
        })
        .then(res => {
          console.log(res);
           this.$message({
          message: '导入成功',
          type: 'success'
        });
          this.$router.push('/testManager/BookManager')
        })
        .catch(err => {
          // console.log(err)
        });
    },
    
  }
};
</script>

<style scoped lang="scss">
body {
  padding: 0;
  margin: 0;
  width: 1700px;
}
.mobam {
  width: 100%;
  background-color: lawngreen;
  // margin-top:20px;
  padding: 15px;
}
.dis {
  width: 340px;
  height: 430px;
  float: left;
}
#width{
  width: 1700px;
}
.left{
  float: left;
}
.fkl{
  width: 190px;
  height: 15px;
}
.right{
  float: right;
}
#img {
  width: 188px;
  height: 245px;
}

.content {
   
  height: 230px;
  width: 230px;
  color:#ffffff;
}
.test {
  color:#FFFFFF;
  position: absolute;
  height: 20px;
  width: 60px;
  font-size: 22px;
  left: -5px;
  top: -30px;
 
  // transform: rotate(-80deg);
  // -o-transform: rotate(30deg);
  // -webkit-transform: rotate(40deg);
  // -moz-transform: rotate(40deg);
  // filter: progid:DXImageTransform.Microsoft.BasicImage(Rotation=2);
}
.type {
  position: absolute;
  left: 88px;
  top: -10px;
  border: 1px solid red;
  width: 0;
  height: 0;

  border-top: 50px solid red;
  border-left: 50px solid transparent;
  border-right: 50px solid red;
  border-bottom: 50px solid transparent;
}
// .day {
//   border: 1px solid rebeccapurple;
//   width: 231px;
//   height: 271px;
//   // margin: 10px;
// }

.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-content {
  display: none;
  position: absolute;
  left: 0px;
  top: 0px;
  height: 245px;
  width: 188px;
  background-color: black;
  opacity: 0.65;

  min-width: 160px;
  // box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 12px 16px;
}
.dropdown:hover .dropdown-content {
  display: block;
}
</style>