<template>
  <div class="app-container calendar-list-container">
    <p style="margin:15px">
    <router-link to="intoBook"> <el-button type="primary" style="margin:-18px">导入书目</el-button> </router-link>
     <el-button  @click="dialogVisible = true"  style="margin-left:27px" type="primary" >添加书目</el-button>
      <el-button @click="dialogFormVisible= true" type="primary">导出书目</el-button>
      <!-- dialogFormVisible= true -->
      </p>
        <p>
    <span >年级</span>
         <el-select v-model="value" clearable placeholder="请选择年级" class="xiala" @change="selectgread">
         <el-option
             v-for="item in options"
             :key="item.value"
             :label="item.label"
             :value="item.value" >
         </el-option>
          </el-select>

          <span style="margin-left:10px">学期</span>
            <el-select v-model="model11" clearable placeholder="请选择学期" @change="selectclear" >
         <el-option
           v-for="item in two"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
      </el-select>
          <el-input class="ask" v-model="textBook" placeholder="请输入书目名称"  style="width: 200px;margin-left:10px"></el-input>

          <el-button  type="primary" icon="el-icon-search" width=100px @click.stop="searchlist">搜索</el-button>
        </p>
  <!--显示表格-->

  <el-table :data="tableData"
    border
    >
    <el-table-column
      fixed
      prop="BookName"
      label="书名"
      width="220">
    </el-table-column>
    <el-table-column
      prop="Author"
      label="作者"
      width="220">
    </el-table-column>
    <el-table-column
      prop="Status"
      label="书目设置"
      width="200"
      :formatter="formatStar">
    </el-table-column>
    <el-table-column
      prop="Type"
      label="是否必读"
      width="200"
      :formatter="formatRole">
    </el-table-column>
    <el-table-column
      prop="Class"
      label="所属年级"
      width="200"
       :formatter="formatclass">
    </el-table-column>
    <el-table-column
      prop="Grade"
      label="所属学期"
      width="200"
      :formatter="formatUp" >
    </el-table-column>
     <el-table-column
      prop="BookSource"
      label="书目来源"
      width="180"
      :formatter="formatSo" >
    </el-table-column>
    <el-table-column
     fixed="right"
      label="操作"
      width="250">
      <template slot-scope="scope" >
        <el-button @click="handleClick(scope.row)" type="primary" size="small" >编辑</el-button>
        <el-button @click="dele(scope.row)" type="danger" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

 <!-- 添加书目模版 -->
          <el-dialog
            title="添加书目"
            :visible.sync="dialogVisible"
            width="50%">
         <!--  :before-close="handleClose" -->
                <div id="moban">
                <el-form :model="formlist1" :rules="rules" ref="formlist" label-width="100px" class="demo-formlist">
                  <el-form-item label="书目名称 " prop="BookName">
                    <el-input v-model="formlist1.BookName" class="rule_inpt"   maxlength="24"></el-input >
                  </el-form-item>
                  <el-form-item label="作者 " prop="Author">
                    <el-input v-model="formlist1.Author" class="rule_inpt"   maxlength="15"></el-input>
                  </el-form-item>
                  <el-form-item label="出版社 " prop="Press">
                    <el-input v-model="formlist1.Press" class="rule_inpt"   maxlength="25"></el-input>
                  </el-form-item>

                      <el-form-item prop="Year" label="出版日期" required  style="height:40px" >
                    <el-date-picker
                     type="date"
                     placeholder="选择出版日期"
                     v-model="formlist1.Year"
                     @change="dateChangeTime"
                    class="rule_inptday"></el-date-picker>


                      </el-form-item>

                  <p>
                  <el-form-item label="所属年级" prop="Class">
                    <el-select v-model="formlist1.Class" placeholder="所属年级" @change="changeValue">
                      <el-option :label="item.label" :value="item.value" v-for="(item, index) in greadlist" :key="index"></el-option>

                    </el-select>
                    <el-select v-model="formlist1.Grade" placeholder="所属学期" @change="changeTerm">
                      <el-option :label="item.lable" :value="item.value" v-for="(item, index) in termlist" :key="index"></el-option>
                    <!-- <el-option label="下学期" value="2"></el-option>-->
                    </el-select>
                  </el-form-item>
                  </p>
                  <el-form-item label="图书类型" prop="BookType">
                    <el-select v-model="formlist1.BookType" placeholder="请选择图书类型"  class="long">
                      <el-option label="历史/地理" value="1"></el-option>
                      <el-option label="故事/漫画" value="2"></el-option>
                       <el-option label="国学/礼仪" value="3"></el-option>
                      <el-option label="名人/传记" value="4"></el-option>
                       <el-option label="人文/教育" value="5"></el-option>
                      <el-option label="诗词/散文" value="6"></el-option>
                       <el-option label="艺术/综合" value="7"></el-option>
                      <el-option label="自然/科普" value="8"></el-option>
                        <el-option label="小说/名著" value="9"></el-option>
                      <el-option label="其他" value="10"></el-option>

                    </el-select>
                  </el-form-item>

                  <el-form-item label="是否必读" prop="Type">
                    <el-radio-group v-model="formlist1.Type">
                      <el-radio :label="1" prop='1'>必读</el-radio>
                      <el-radio :label="2" prop='2'>选读</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="书目设置" prop="Status">
                    <el-radio-group v-model="formlist1.Status">
                      <el-radio :label="1" prop='1'>启用</el-radio>
                      <el-radio :label="2" prop='2'>不启用</el-radio>
                    </el-radio-group>
                  </el-form-item>

               <el-form-item label="上传封面" prop="Image">
                  <el-upload
                    ref='upload'
                    class="avatar-uploader"
                    :action="urls"
                    :show-file-list="false"
                    :on-success="addhandleAvatarSuccess"
                    :before-upload="addbeforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
               </el-form-item>

                  <el-form-item label="导读" prop="Review">
                    <el-input type="textarea"  v-model="formlist1.Review" placeholder="导读内容，不能超过一百个字"
                  maxlength="100" ></el-input>
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" @click="addBook('formlist')" :loading="istrue">确定</el-button>
                  </el-form-item>
                </el-form>
                </div>

          </el-dialog>

 <!--修改书本信息 -->
      <el-dialog
            title="编辑书目"
            :visible.sync="dialogVisibleb"
            width="50%"

           >
           <!--:before-close="handleClose" -->
                <div id="moban">

                <el-form :model="formlist" :rules="rules" ref="formlist" label-width="100px" class="demo-formlist">
                  <el-form-item label="书目名称 " prop="BookName">
                    <el-input v-model="formlist.BookName" class="rule_inpt"  maxlength="24"></el-input >
                  </el-form-item>
                  <el-form-item label="作者 " prop="Author">
                    <el-input v-model="formlist.Author" class="rule_inpt"  maxlength="15"></el-input>
                  </el-form-item>
                  <el-form-item label="出版社 " prop="Press">
                    <el-input v-model="formlist.Press" class="rule_inpt"  maxlength="15"></el-input>
                  </el-form-item>

                 <el-form-item label="出版日期" required prop="Year" style="height:40px" >
                        <el-date-picker type="date" placeholder="选择出版日期" v-model="formlist.Year" class="rule_inptday"></el-date-picker>
                 </el-form-item>

                  <el-form-item label="所属年级" prop="Class">
                    <el-select v-model="formlist.Class" placeholder="所属年级" @change="changeValue">
                      <el-option :label="item.label" :value="item.value" v-for="(item, index) in greadlist" :key="index"></el-option>

                    </el-select>
                    <el-select v-model="formlist.Grade" placeholder="所属学期" @change="changeTerm">
                      <el-option :label="item.lable" :value="item.value" v-for="(item, index) in termlist" :key="index"></el-option>

                    </el-select>
                  </el-form-item>


                  <el-form-item label="图书类型" prop="BookType">
                    <el-select v-model="formlist.BookType" placeholder="请选择图书类型"  class="long">
                      <el-option :label="item.label" :value="item.value" v-for="(item, itemindex) in BookTypelist" :key="itemindex"></el-option>

                    </el-select>
                  </el-form-item>

                  <el-form-item label="是否必读" prop="Type">
                    <el-radio-group v-model="formlist.Type">
                      <el-radio :label="1" prop='1'>必读</el-radio>
                      <el-radio :label="2" prop='2'>选读</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="书目设置" prop="Status">
                    <el-radio-group v-model="formlist.Status">
                      <el-radio :label="1" prop='1'>启用</el-radio>
                      <el-radio :label="2" prop='2'>不启用</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="上传封面" prop="Image">
                   <el-upload
                    class="avatar-uploader"
                    :action="urls"
                    :show-file-list="false"
                    :on-success="edithandleAvatarSuccess"
                    :before-upload="editbeforeAvatarUpload">
                    <img v-if="imageUrl1" :src="formlist.Image" class="avatardele">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                   </el-form-item>
                  <el-form-item label="导读" prop="Review" style="padding-top:20px">
                    <el-input type="textarea" v-model="formlist.Review" placeholder="导读内容，不能超过一百个字"
                  maxlength="100"   prop='Rtatus'></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="remobook()" :loading="istrue">确定</el-button>

                  </el-form-item>



                </el-form>
                </div>

          </el-dialog>




<!-- 导出书库 -->
    <div class="Export" >
          <el-dialog title="导出书目" :visible.sync="dialogFormVisible"
        >
              <el-form :model="form"  ref="form">
                <el-form-item label="年级" :label-width="formLabelWidth" required>
                  <el-select v-model="form.year" placeholder="请选择年级"  style="width: 500px;" @change="selectclass" >
                    <el-option label="一年级" value="1"></el-option>
                    <el-option label="二年级" value="2"></el-option>
                     <el-option label="三年级" value="3"></el-option>
                    <el-option label="四年级" value="4"></el-option>
                    <el-option label="五年级" value="5"></el-option>
                     <el-option label="六年级" value="6"></el-option>
                  </el-select>
                </el-form-item>
                  <el-form-item label="学期" :label-width="formLabelWidth" required >
                  <el-select v-model="form.class" placeholder="请选择学期" style="width: 500px;">
                    <el-option label="上学期" value="1"></el-option>
                    <el-option label="下学期" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="名称" :label-width="formLabelWidth" required>
                  <el-input v-model="form.name" auto-complete="off" style="width: 500px;" placeholder="请输入导出名称" maxlength="30"></el-input>
                </el-form-item>

              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.stop="exportbook('ruleForm')">确 定</el-button>
              </div>
            </el-dialog>
        </div>

    <div class="block" style="margin-left:-6px;margin-top:6px">
     <!--页码 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[15, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listpage">
    </el-pagination>
  </div>

  </div>
</template>

<script>
import axios from "axios";

import * as http from "api/admin/read/readbook.js";
import moment from 'moment';
export default {
  name: "examCount",
  data() {
    return {
      urls: "/red/ReadPC/UploadImage",
      istrue: false,
      model11: "",
      greadlist: [
        { label: "一年级", value: "1" },
        { label: "二年级", value: "2" },
        { label: "三年级", value: "3" },
        { label: "四年级", value: "4" },
        { label: "五年级", value: "5" },
        { label: "六年级", value: "6" }
      ],
      termlist: [
        { lable: "上学期", value: "1" },
        { lable: "下学期", value: "2" }
      ],
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

      textBook: "",
      Managementlist: {},
      // show: true,
      imageUrl: false,
      imageUrl1: true,
      input: "",
      value: [],
      tableData: [{}],
      listpage: "",
      value5: "",
      //下拉菜单一
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
      modle: "",
      dialogImageUrl: "",
      dialogImageUrl1: "",
      dialogVisible: false,
      dialogVisibleb: false,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      Year:'',
      formlist: {
        SchoolCode: "",
        ID: "",
        BookName: "",
        Author: "",
        Press: "",
        Year: "",
        Class: "",
        Grade: "",
        Image: "",
        BookType: "",
        BookSource: "",
        Status: "",
        Review: "",
        CloneTextBookId: ""
      },

      formlist1: {
        SchoolCode: null,
        // ID: "",
        BookName: "",
        Author: "",
        Press: "",
        Year: "",
        Class: "",
        Grade: "",
        Image: "",
        BookType: "",
        BookSource: "",
        Status: "",
        Review: "",
        CloneTextBookId: ""

      },
    //  form:{
    //       year:[{required:true,message:'请选择年级',trigger:'chang'}],
    //       Class:[{required:true,message:'请选择班级',trigger:'chang'}],
    //       name:[{required:true,message:'请输入名称',trigger:blur}]
    //   },
      bookId:'',
      currentPage4: 1,
      dialogFormVisible: false,

      formLabelWidth: "120px",
      form: {
        year:'',
        class:'',
        name:'',
      },
      page11: 1,
      rules: {
        BookName: [
          {
            required: true,
            message: "请输入书本名称",

            trigger: "blur"
          }
        ],
        Author: [{ required: true, message: "请输入作者", trigger: "blur" }],
        Press: [{ required: true, message: "请输入出版社", trigger: "blur" }],
        Year: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        // Class: [{ required: true, message: "请选择年级", trigger: "change" }],

        BookType: [
          { required: true, message: "请选择图书类型", trigger: "change" }
        ],
        Type: [
          { required: true, message: "请选择是否必读", trigger: "change" }
        ],
        Status: [
          { required: true, message: "请选择书目设置", trigger: "change" }
        ],
        Image: [
          { required: true, message: "请选择添加图书封面", trigger: "blur" }
        ],
        Review: [{ required: true, message: "请填写导读内容", trigger: "blur" }]
      },

    };
  },

  created() {
    // this.init();
    console.log(2222);
    this.getList(this.currentPage4);

  },

  directives: {},
  filters: {},
  methods: {
    ////时间选择器(时间戳)
    dateChangeTime (val) {
      console.log(moment(val).format('YYYY-MM-DD'))
    },

    selectclass() {},
    //学期
    changeTerm(data) {
      console.log(data);
      this.formlist.Grade = data;
    },
    // 年级
    changeValue(value) {
      console.log(value);
      this.formlist.Class = value;
    },
    searchlist() {
      this.getList(this.page11);
    },
    // 查询书本
    selectgread(data) {
      // console.log(data)
      this.Managementlist.Grade = data;
      console.log(data);
    },
    selectclear(data) {
      console.log(data);
      this.Managementlist.class = data;
    },
    // 编辑
    handleClick(data) {
      this.bookId = ''
      this.bookId = data.ID

      let datas = {};
      datas = JSON.parse(JSON.stringify(data));
      this.greadlist.forEach(item => {
        if (JSON.parse(item.value) === datas.Class) {
          datas.Class = item.value;
        }
      });

      this.formlist = datas;
      this.dialogVisibleb = true;
      this.formlist.BookType = String(datas.BookType);
      this.formlist.Grade = String(datas.Grade);
    },

    formatRole(row, column) {
      return row.Type === 1 ? "必读" : "选读";
    },
    formatclass(one, two, there, four, five, sex) {
      switch (one.Class) {
        case 1:
          return "一年级";
          break;
        case 2:
          return "二年级";
          break;
        case 3:
          return "三年级";
          break;
        case 4:
          return "四年级";
          break;
        case 5:
          return "五年级";
          break;
        case 6:
          return "六年级";
          break;
        default:
          break;
      }
    },

    formatStar(off, Status) {
      return off.Status === 1 ? "启用" : "不启用";
    },
    formatUp(up, Grade) {
      return up.Grade === 1 ? "上学期" : "下学期";
    },
    formatSo(row, column) {
      return row.BookSource === 1 ? "自有库" : "资源库";
    },
    // 页码
    // init() {},
    handleCurrentChange(val) {
      console.log("currentPage4a:");
      console.log(this.currentPage4);
      this.currentPage4 = val;
      console.log("currentPage4b:");
      console.log(this.currentPage4);
      console.log(val);
      // 这里要重新请求  页码变成你选择的了
      this.getList(this.currentPage4);
    },

    //获取书本列表
    getList(p) {
      const page = p;
      const self = this;
      const sizes = this.fenyesize;

      http
        .queryBook({
          SchoolCode: localStorage.getItem("xxdm"),
          Page: page, //当前页面,默认1
          PageSize: sizes, //页码数,默认15
          Class: self.value, //年级
          Grade: self.model11, //1为上学期，2为下学期
          BookName: self.textBook, //书本名
          Type: "", //1为必读，2为选读
          BookType: "", //书本类型
          Status: "" //启用，不启用
        })
        .then(res => {
          console.log(res);
          this.tableData = res.Value.List;
          this.listpage = res.Value.TotalItemCount;
        });
      console.log(this.tableData);

      //  alert()
    },
    //添加一本书
    addBook(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this;
          console.log(this.formlist);
          this.formlist.SchoolCode = JSON.parse(
            window.localStorage.getItem("xxdm")
          );
          http
            .addBook({
              SchoolCode: localStorage.getItem("xxdm"),
              BookName: that.formlist1.BookName, //书本名"
              Author: that.formlist1.Author, //作者"
              Press: that.formlist1.Press, //出版社"
              Year:  moment(that.formlist1.Year).format('YYYY-MM-DD'), //出版年份"
              Class: that.formlist1.Class, //年级
              Grade: that.formlist1.Grade, //1为上学期，2为下学期
              Image: that.formlist1.Image, //"图片"
              Type: that.formlist1.Type, //1为必读，2为选读
              BookSource: "", //1自己创建，2.书库,修改无效
              Status: that.formlist1.Status, //1为启用，2为不启用
              Review: that.formlist1.Review, //导读
              BookType: that.formlist1.BookType, //书本类型
              CloneTextBookId: "" //书库的ID
            })
            .then(res => {
              if (res.State == 1) {
                that.formlist1 = {};
                that.dialogVisible = false;
                that.getList();

                this.imageUrl = ''
                this.$refs.upload.clearFiles();
                this.$message({ message: "添加书本成功", type: "success" });
               this.$refs["formlist"].resetFields();

              }
            });
        } else {
          this.$message({ message: "必填项未填写完整", type: "error" });
          console.log("error submit!!");
          return false;
        }
      });
    },

    //编辑书目
    remobook() {
      let that = this;
      http
        .addBook({
          ID: that.bookId,
          SchoolCode: localStorage.getItem("xxdm"),
          BookName: that.formlist.BookName, //书本名"
          Author: that.formlist.Author, //作者"
          Press: that.formlist.Press, //出版社"
          Year: that.formlist.Year, //出版年份"
          Class: that.formlist.Class, //年级
          Grade: that.formlist.Grade, //1为上学期，2为下学期
          Image: that.formlist.Image, //"图片"
          Type: that.formlist.Type, //1为必读，2为选读
          BookSource: "", //1自己创建，2.书库,修改无效
          Status: that.formlist.Status, //1为启用，2为不启用
          Review: that.formlist.Review, //导读
          BookType: that.formlist.BookType, //书本类型
          CloneTextBookId: "" //书库的ID
        })
        .then(res => {
          if (res.State == 1) {
            that.formlist = {};
            that.dialogVisibleb = false;
            that.getList();
          } else {
          }
          // console.log(res);
        });
    },
    sizeChange(b) {
      console.log(b);
      let set = this;
      set.fenyesize = b;
      set.getList(this.currentPage4);
    },
    //删除书本信息
    dele(data) {
      var id = data.ID;
      let self = this;

      this.$confirm("确认删除吗？")
        .then(_ => {
          http.dele({ IDs: id }).then(data => {
            console.log(data);
            self.getList(self.currentPage4);
            this.$notify({title: '成功', message: '删除成功', type: 'success'
        });
          });
        })
        .catch(_ => {});
    },

    //导出书目
    exportbook() {
      if(this.form.year === ''){
        this.$message({ message: "年级必须选择", type: "warning" });
      }else if(this.form.class === ''){
         this.$message({message: "请选择学期", type: "warning" });
      }else if(this.form.name === ''){
          this.$message({message: "导出名称填写", type: "warning" ,max:20});
      }else{
          window.open(
        "http://newreadlevel.91sst.com.cn/home/LoadTextBook?" +
          "schoolcode=" +
          localStorage.getItem("xxdm") +
          "&&BookName=" +
          this.form.name +
          "&&Class=" +
          this.form.year +
          "&&Grade=" +
          this.form.class
      );
       this.dialogFormVisible = false;
      this.$notify({ title: "成功导出", type: "success" });
      }


    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },

    // demobeg

    // demoend
    // 上传成功
    addhandleAvatarSuccess(res, file) {
      console.log(res);
      this.imageUrl = URL.createObjectURL(file.raw);

      this.formlist1.Image = res.Value;

    },

//  submitForm(formName) {
//         this.$refs[formName].validate((valid) => {
//           if (valid) {
//             alert('submit!');
//           } else {
//             console.log('error submit!!');
//             return false;
//           }
//         });
//       },




    // 上传之前
    addbeforeAvatarUpload( file) {
      console.log(file);
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return(isJPG||isPNG)  && isLt2M;
    },

  //编辑图片
    edithandleAvatarSuccess(res, file) {
      console.log(res);
      this.imageUrl1 = URL.createObjectURL(file.raw);
      // this.imageUrl1 =  this.formlist.Image
      // this.formlist.Image = res.Image;
      this.formlist.Image = res.Value;

      console.log(res);
    },
    editbeforeAvatarUpload(file) {
      console.log(file);
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style scoped lang="scss">
.ban-ol {
  padding: 10px;

  width: auto;
}
.ban-oll {
  padding-top: 25px;
}
.ge {
  margin-left: 20px;
}
.biao {
  height: 25px;
  width: 25px;
}
#moban {

  width: 750px;
}
.rule_inpt {
  width: 400px;
}
.block {
  margin-left: 40px;
}
.rule_inptday {
  width: 400px;
  margin-bottom: 20px;
}
.long {
  width: 430px;
}
.underline {
  position: relative;
  left: 500px;
  top: -650px;
}
.chuan {
  position: relative;
  left: 550px;
  top: -650px;
}

.xiala {
  width: 150px;
  height: 30px;
}
//导出书库

#year {
  margin-right: 20px;
}
#yeas {
  width: 210px;
}
.fen {
  margin-right: 20px;
  font-weight: 600;
}
.daodu {
  height: 50px;
  width: 580px;
}
.niu {
  margin-top: 20px;
  margin-left: 300px;
  height: 30px;
  width: 100px;
}
.but {
  height: 30px;
  width: 100px;
  background: coral;
}
.right {
  position: relative;
  left: 500px;
  top: -360px;
}
.tu {
  height: 180px;
  width: 150px;
  // background: white;
}
// 图片
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #c0c0c0;
}
.avatardele {
  width: 178px;
  height: 231px;
  // display: none;
}
.avatar {
  width: 178px;
  height: 231px;
  display: block;
}
.dask {
  width: 300px;
  height: 240px;
  // display: none;

}
</style>

