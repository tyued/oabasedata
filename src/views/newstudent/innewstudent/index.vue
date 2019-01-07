<template>
  <div class="app-container calendar-list-container">
    <!-- 页面头部beg -->
    <div class="filter-container">
      <el-input  style="width: 300px;" v-model="searchInfo" placeholder="请输入姓名、身份证号、手机号"> </el-input>
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button style="margin-left: 10px;"  type="primary" icon="edit" @click="handleCreate">新增学生</el-button>
      <el-button type="primary" @click="delectstudent">删除学生</el-button>
      <!-- <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" style="display:inline-block; margin-left:8px;"> -->
      <el-button type="primary" @click="importOnline">批量导入</el-button>
      <!-- </el-upload> -->
      <!-- <el-button type="primary" @click.stop="download">导入模板下载</el-button> -->
    </div>
    <!-- 页面头部end -->
    <!-- 筛选条件及新生人数beg -->
    <div class="studentcontainer">
      <div class="studentNumbercount">
        新生总人数<span class="number">{{studentNumber.totalNum}}</span>人，男生<span class="number">{{studentNumber.boyNum}}</span>人，女生<span class="number">{{studentNumber.girlNum}}</span>人
      </div>
      <div class="studentcondition">
          <span>条件筛选：</span>
        <el-select v-model="value" placeholder="请选择筛选条件" @change="change">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <!-- 筛选条件及新生人数end -->
    <!-- 主题tabel信息beg -->
    <div class="table-container">
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange" ref="table">
        <el-table-column fixed type="selection" width="50"></el-table-column>
        <el-table-column label="序号" width="80">
          <template slot-scope="scope">
            <span>{{ listQuery.startIndex+scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="sex"
        :formatter="formatRole"
        label="性别"
        width="100">
        <!-- :filters="[{ text: '男', value: 1 }, { text: '女', value: 2 }]"
        :filter-method="filterTag" -->
        </el-table-column>
        <el-table-column prop="idCard" label="身份证" width="220"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="140"></el-table-column>
        <el-table-column prop="designateClass" label="预设班级" width="120"></el-table-column>
        <el-table-column prop="totalScore" label="总成绩" sortable width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100"><template slot-scope="scope">
            <el-button type="text" size="small" @click="editstudent(scope.$index, scope.row)">编辑</el-button>
        </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listQuery.total">
      </el-pagination>
    </div>
    <!-- table信息end -->
    <!-- model弹窗beg -->
    <el-dialog  :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="650px" @close="clossaddmodel('form')">
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="姓名" prop="name" resetField :rules="[{ required: true, message: '姓名不能为空'}]">
          <el-input v-model="form.name" placeholder="请输入姓名" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" :rules="[{ required: true, message: '请选择性别'}]">
          <!--  :rules="[{ required: true, message: '请选择性别'}]" -->
          <!-- <el-select class="filter-item" v-model="form.sex" placeholder="请选择">
            <el-option v-for="(item, itemindex) in  sexOptions" :key="itemindex" :label="item.sex" :value="item.value"> </el-option>
          </el-select> -->
          <el-radio-group v-model="form.sex" style="width: 100%;">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <!-- <el-radio :label="9">备选项</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证" prop="idCard" :rules="[{ required: true, message: '身份证不能为空'}]">
          <el-input v-model="form.idCard" placeholder="请输入身份证" :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <!-- :rules="[{ required: true, message: '手机号不能为空'}]" -->
          <el-input v-model="form.mobile" placeholder="请输入手机号" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="预设班级" prop="designateClass">
            <el-input v-model="form.designateClass" placeholder="请输入预设班级" :maxlength="2"></el-input>
        </el-form-item>
        <el-form-item label="总成绩" prop="totalScore" :rules="[{ required: true, message: '成绩不能为空'}]">
          <el-input v-model="form.totalScore" placeholder="请输入成绩" :maxlength="6"></el-input>
        </el-form-item>
        <div class="addmorcourse">
          <div class="addcourse" @click.stop="addcourse">+</div><span>添加学科成绩</span>
          <div class="course">
            <div v-for="(scored, scoreindex) in form.scores" class="coursebox">
              <!-- <span style="color: red">*必选</span> -->
              <el-col :span="3">
                  <div class="preview-content">
                    <select-corse :dataSource="courselist" :scoreindex="scoreindex" @selectclass="selectclass" @choseclass="choseclass" :scores="scored"></select-corse>
                  </div>
              </el-col>
              <el-form-item label="成绩" style="margin-bottom: 0">
                <el-input v-model="scored.score" placeholder="请输入成绩" style="width: 300px" :maxlength="5"></el-input>
              </el-form-item>
              <span class="deletebtn" @click="Delete(scoreindex)">X</span>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗end -->
    <!-- 导入学生名单beg -->
    <el-dialog title="学生导入" :visible.sync="importXSFormVisible" width="540px" :before-close="importCancel" class="import_box">
      <el-row>
          <el-col :span="6" style="line-height:32px">
              文件选择：
          </el-col>
          <!-- http://192.168.0.193:6162 -->
          <el-col :span="18">
              <el-upload
              :data="datas"
              :limit="1"
              name="excelfile"   
              ref="cjForm"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              action="/api/newborn/smartnewborn/v1/Student/ImportExcel"
              :headers= headers
              :file-list="fileList"
              :onError="uploadError"
              :onSuccess="uploadSuccess"
              :before-upload="beforeUpload"
              :on-change="onchange"
              :on-remove="onremove"
              :on-progress="onprogress"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </el-upload>
          </el-col>  
      </el-row>
      <div slot="footer" class="dialog-footer">
          <el-button size="medium" type="primary" @click="importSubmit('cjForm')" :loading="importLoading">{{isSuccess === '上传中'?'数据处理中...':'确定'}}</el-button>
          <!-- isSuccess=== '上传中' ? '数据处理中...' :  -->
          <el-button size="medium" @click="importCancel">取 消</el-button> 
          <el-button size="medium" @click="importMb">模版生成<i class="el-icon-download"></i></el-button> 

          <el-row class="import_desc">
              <el-col :span="6" style="line-height:80px">
                  操作说明：
              </el-col>
              <el-col :span="18" style="margin-top: 30px;">
                  <div class="tip">1.请使用本页面提供的模版进行导入</div>
                  <div class="tip">2.请勿修改模版Excel的表头内容</div>
                  <div class="tip">3.模版提供的默认信息，请勿随意修改</div>
                  <div class="tip">4.具有星号（*）的条目为必填项</div>
              </el-col>               
          </el-row>
      </div>
    </el-dialog>
    <!-- 导入学生end -->
    <!-- 删除学生弹窗beg -->
    <el-dialog  title="确认删除学员" :visible.sync="dialogDLFormVisible" width="600px">
      <el-row class="import_desc">
        <el-col :span="18">
          <p>您确认删除已录入学员？请谨慎操作该选项！</p>
        </el-col>               
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canceldelect">取 消</el-button>
        <el-button type="primary" @click="confirmdelect">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除学生弹窗end -->
    <!-- 导入学生返回数据beg -->
    <el-dialog  title="导入人员信息确认" :visible.sync="dialogDLDetailVisible" width="600px" @close="clossuploadmodel">
      <el-row class="import_desc">
      <el-col :span="18">
        <p style="color: red">* 若有上传失败学员，请将失败部分重新上传或添加进入系统！</p>
      </el-col>               
      </el-row>
      <el-row>
        <div class="callbackstatues">
          <ul class="callbackstatueslist">
            <li class="callbackstatuesitem">
              <span>姓名</span>
              <span>提示信息</span>
            </li>
            <li class="callbackstatuesitem" v-for="(item, index) in callbackStatus" :key="index">
              <span class="studentname">{{item.name}}</span>
              <span class="statuesinfo" :class="{ active: item.success }">{{item.message}}</span>
            </li>
          </ul>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="cancelcheck">取 消</el-button> -->
        <el-button type="primary" @click="confirmcheck">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 导入学生返回数据end -->
  </div>
</template>

<script>
var _ = require('lodash');
var tempdata = [];
import { Queryinfo, Getxndm, Getkcsj, PostStudent, GetStudentDetail, ChangeStudent, DelectStudent, ImportExcel, GetStudentCount, ImportTemplateDownload } from '../../../api/admin/division/index'
// ImportTemplateDownload
import SelectCorse from './SelectCorse'
import { getToken } from '../../../utils/auth'
export default {
  name: 'login',
  components: {
    SelectCorse
  },
  data() {
    return {
      isSuccess: '',
      schoolCode: '',
      batch: '',
      callbackStatus: [],
      dialogDLDetailVisible: false,
      value: '',
      options:[
        {value: null, label: '全部'},
        {value: 1, label: '男生'},
        {value: 2, label: '女生'}
      ],
      studentNumber: {},
      ready: false,
      dialogDLFormVisible: false,
      studentId: [],
      ischose: false,
      msg: '',
      show: false,
      courseselected: {},
      studentpage: {
        keywords: '',
        sex: null,
        schoolCode: localStorage.getItem('xxdm'),
        batch: '',
        pageIndex: 1,
        pageSize: 10
      },
      allData:[],
      dialogFormVisible: false,
      dialogStatus: '',
      sexOptions: [{sex: '女生', value: 2},{sex: '男生', value: 1}],
      form:{
        name:'',
        sex:'',
        idCard:'',
        mobile:'',
        totalScore:'',
        schoolCode: '',
        batch: '',
        scores: [],
        designateClass: null
      },
      tableData: [],
      multipleSelection: [],
      listQuery:{
          page:1,
          limit:10,
          total:0,
          startIndex:0
      },
      data_arrpage:[],
      textMap: {
          update: '编辑',
          create: '创建'
      },
      searchInfo:'',
      courselist: [],
      // 学生导入
      importXSFormVisible: false,
      fileList: [],
      importLoading: false,
      datas: {
        Batch: '',
        SchoolCode: ''
      },
      studentClass: {},
      isadd: false,
      isidentical: false,
      ispadden: false,
      ischangeidentical: false,
      ischanged: false,
      newcourselist: [],
      addcourselist: [],
      sourcescore: false
    }
  },
  computed: {
    headers () {
      return {
        Authorization: getToken()
      }
    }
  },
  mounted: function(){
    const GetYear = () => {
      const date = new Date()
      let y = date.getFullYear()
      return y
    }
    this.batch = this.$store.state.division.batch
    this.schoolCode = this.$store.state.division.schoolCode
    this.form.batch = this.$store.state.division.batch
    this.studentClass.Batch = this.$store.state.division.batch
    this.studentClass.SchoolCode = this.$store.state.division.schoolCode
    this.getstudentnum(this.studentClass)
    this.studentpage.batch = this.$store.state.division.batch
    this.allData = tempdata;
    Getxndm({xxdm: this.batch}).then(data => {
      let params = {
        page: 1,
        limit: 30,
        xxdm: this.$store.state.division.schoolCode,
        ssxn: data.xn,
        ssxq: data.xq
      }
      // 获取课程
      Getkcsj(params).then(data => {
        this.courselist = data.data.rows
      })
    })
    this.dialogStatus = 'create';
    this.getstudentlist(this.studentpage)
    // this.resetData();
  },
  methods: {
    // 表格筛选功能
    filterTag(value, row) {
      return row.sex === value;
    },
    // 每页显示数据条数
    handleSizeChange (val) {
      this.listQuery.page = 1
      this.studentpage.pageIndex = 1
      // this.getstudentlist(this.studentpage)
      this.studentpage.pageSize = val
      this.getstudentlist(this.studentpage)
    },
    // 手机号码正则判断
    isPoneAvailable (str) {
      var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(str)) {
        return false;
      } else {
        return true;
      }
    },
    // 确认查看上传返回数据
    confirmcheck () {
      this.dialogDLDetailVisible = false
      this.callbackStatus = []
    },
    clossuploadmodel () {
      this.dialogDLDetailVisible = false
      this.callbackStatus = []
    },
    // 获取新生人数
    getstudentnum (studentClass) {
      GetStudentCount(studentClass).then(data => {
        this.studentNumber = data
      })
    },
    // 切换筛选条件
    change (val) {
      this.studentpage.sex = val
      this.studentpage.pageIndex = 1
      this.studentpage.pageSize = 10
      this.getstudentlist(this.studentpage)
    },
    GetYear () {
      const date = new Date()
      let y = date.getFullYear()
      return y
    },
    //在线导入
    importOnline(item) {
        this.importXSFormVisible = true;
    },
    importSubmit(fileName){
      if (this.ready) {
        this.datas.SchoolCode = localStorage.getItem('xxdm'),
        this.datas.Batch = window.localStorage.getItem('year')
        this.$refs[fileName].submit();
        this.ready = false
        this.isSuccess = '上传中'
      } else {
        this.$notify({title: '提示', message: '没有要导入的文件', type: 'error', duration: 2000})
      }

    },
    // 文件列表移除文件钩子
    onremove (file, fileList) {
      if (!fileList.length) {
        this.ready = false
      }
    },
    // 文件状态改变函数
    onchange (file, fileList) {
      if (fileList.length) {
        this.ready = true
      } else {
        this.ready = false
      }
    },
    //取消上传
    importCancel() {
        this.importLoading = false;
        this.importXSFormVisible = false;
        this.fileList = [];
    },
    // 上传成功后的回调
    uploadSuccess (response, file, fileList) {
      if (response.result.length) {
        if (response.errorCount === 0) {
          // this.callbackStatus = response
          this.isSuccess = ''
          this.importLoading = false;
          this.getstudentlist(this.studentpage)
          this.getstudentnum(this.studentClass)
          this.$notify({
              title: '成功',
              message: response.message,
              type: 'success',
              duration: 2000
          });
          this.importXSFormVisible = false;
          this.fileList = [];
          // this.dialogDLDetailVisible = true;
        } else {
          this.callbackStatus = response.result
          this.importLoading = false;
          this.getstudentlist(this.studentpage)
          this.getstudentnum(this.studentClass)
          this.importXSFormVisible = false;
          this.fileList = [];
          this.dialogDLDetailVisible = true;
        }
      } else {
        this.importLoading = false;
        this.$notify({
            title: '提示',
            message: '上传成功,但您上传了空数据',
            type: 'warning',
            duration: 2500
        });
        this.importXSFormVisible = false;
        this.fileList = [];
      }
    },
    // 上传错误
    uploadError (response, file, fileList) {
        this.importLoading = false;
        this.$notify({
            title: '失败',
            message: '上传失败，请重试！',
            type: 'warning',
            duration: 2000
        });
    },
    // 上传前对文件的大小的判断
    beforeUpload (file) {
        this.importLoading = true;
        let extension = file.name.split('.')[1] === 'xlsx'
        let isLt2M = file.size / 1024 / 1024 < 10
        if (!extension) {
            this.$notify({
                title: '提示',
                message: '上传模版只支持xlsx格式',
                type: 'info',
                duration: 2000
            });
            this.importLoading = false;     
        }else if (!isLt2M) {
            this.$notify({
                title: '提示',
                message: '上传模板大小不能超过 10MB',
                type: 'info',
                duration: 2000
            });
            this.importLoading = false;
        }
        return extension && isLt2M
    },
    // 下载excel模板
    importMb () {
      ImportTemplateDownload({
        SchoolCode: localStorage.getItem('xxdm')
      }).then(data => {
        var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
        var downloadElement = document.createElement('a');
    　　var href = window.URL.createObjectURL(blob); //创建下载的链接
    　　downloadElement.href = href;
    　　downloadElement.download = '模版.xlsx'; //下载后文件名
    　　document.body.appendChild(downloadElement);
    　　downloadElement.click(); //点击下载
    　　document.body.removeChild(downloadElement); //下载完成移除元素
    　　window.URL.revokeObjectURL(href); //释放掉blob对象 
      })
    },
    // 转换男女性别数字
    formatRole (row, column) {
      return row.sex === 1 ? '男' : '女'
    },
    initform () {
      this.form = {
        name:'',
        sex:'',
        idCard:'',
        mobile:'',
        totalScore:'',
        schoolCode: '',
        batch: this.batch,
        scores: []
      }
    },
    clossaddmodel (formName) {
      this.dialogFormVisible = false
      this.initform()
      this.resetForm(formName)
    },
    // 取消添加新生
    cancel (formName) {
      this.dialogFormVisible = false
      this.initform()
      this.resetForm(formName)
    },
    // 选择课程
    // choseclass () {
    //   this.show = !this.show
    // },
    // 获取学生列表
    getstudentlist (params) {
      Queryinfo(params).then(data => {
        data.list.forEach(item => {
          item.designateClass = item.designateClass ? item.designateClass + '班' : '未设置'
        })
        this.tableData = data.list
        this.listQuery.page = data.pageIndex
        this.listQuery.limit = data.pageSize
        this.listQuery.total = data.totalCount
        this.listQuery.startIndex=(this.listQuery.page-1)*this.listQuery.limit;
      })
    },
    // 添加学生按钮
    handleCreate(){
      this.dialogFormVisible = true;
    },
    // 搜索
    handleSearch(){
        this.studentpage.keywords = this.searchInfo
        this.getstudentlist(this.studentpage)
        this.listQuery.page = 1
        this.studentpage.pageIndex = 1

    },
    // 添加课程及成绩
    addcourse () {
      this.form.scores.push(
        {
          courseId: null,
          courseName: null,
          score: null,
          isselected: false,
        }
      )
    },
    // 删除所添加课程及成绩
    Delete (index) {
      this.form.scores.splice(index, 1)
    },
    // 获取新生详情
    getstudentdetail (id) {
      GetStudentDetail(id).then(data => {
        data.scores.forEach((item) => {
          item.isselected = false
        })
        this.form = data
      })
    },
    // 更新学生信息
    update (formName) {
      this.ispadden = false
      this.ischanged = false
      this.newcourselist = []
      var array = []
      for (var i in this.form.scores) {
        array.push(this.form.scores[i].courseId)
      }
      this.isRepeat(array)
      this.changestudent(formName)
    },
    // 判断数组是否重复
    isRepeat(arr){
      var hash = {};
      for(var i in arr) {
        if(hash[arr[i]])
        return true;
        this.ispadden = true;
        hash[arr[i]] = true;
      }
      this.ispadden = false
      return false;
    },
    // 更新学生信息
    changestudent (formName) {
      this.form.designateClass = this.form.designateClass === '' ?  null : this.form.designateClass
      this.form.mobile = this.form.mobile === ''? null : this.form.mobile;
      if (this.form.scores.length) {
        if (this.form.scores.length > 1) {
          this.form.scores.forEach((item) => {
            if (item.courseId&&item.score&&item.courseName) {
              this.newcourselist.push(item)
            }
          })
          if (this.newcourselist.length === this.form.scores.length) {
            this.ischanged = true
          } else {
            this.ischanged = false
          }
          if (this.ischanged) {
            if (this.ispadden) {
              this.$notify({title: '提示', message: '您选择了重复课程', type: 'error', duration: 2000})
            } else {
              this.addstudent(this.form, formName, 'update')
            }
          } else {
            this.$notify({title: '提示', message: '您有信息未填', type: 'error', duration: 2000})
          }
        } else {
          this.form.scores.forEach((item) => {
            if (item.courseId && item.score && item.courseName) {
              this.ischanged = true
            } else {
              this.ischanged = false
            }
          })
          if (this.ischanged) {
            this.addstudent(this.form, formName, 'update')
          } else {
            this.$notify({title: '提示', message: '您有信息未填', type: 'error', duration: 2000})
          }
        }
      } else {
        this.addstudent(this.form, formName, 'update')
      }
    },
    surechange (form, formName) {
      ChangeStudent(form).then(data => {
        this.dialogFormVisible = false
        this.$notify({title: '提示', message: '更改成功', type: 'success', duration: 2000})
        this.initform()
        this.resetForm(formName)
        this.getstudentlist(this.studentpage)
      })
    },
    // 编辑新生
    editstudent (index, val) {
      this.getstudentdetail(val.id)
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
    },
    // 勾选学生
    handleSelectionChange(val){
      this.studentId = val
      this.multipleSelection = val;
    },
    // 切换显示另一页
    handleCurrentChange(val){
        this.listQuery.page = val
        this.studentpage.pageIndex = val
        this.getstudentlist(this.studentpage)
    },
    // 新增学生
    create(formName) {
      // var xxdm = window.localStorage.getItem('xxdm');
      // var batch = window.localStorage.getItem('year');
      var that = this;
      that.ispadden = false
      that.addcourselist = []
      var array = []
      for (var i in this.form.scores) {
        array.push(this.form.scores[i].courseId)
      }
      that.isRepeat(array)
      this.$refs[formName].validate(valid => {
        var testd = /(^\s+)|(\s+$)/g
        if (valid) {
          var addobj = {};
          addobj.name = that.form.name;
          addobj.sex = that.form.sex;
          addobj.idCard = that.form.idCard;
          addobj.mobile = that.form.mobile === ''? null : that.form.mobile;
          addobj.totalScore = that.form.totalScore;
          addobj.designateClass = that.form.designateClass === '' ? null : that.form.designateClass
          addobj.schoolCode = this.schoolCode;
          addobj.batch = that.batch;
          if (that.form.scores.length) {
            if (that.form.scores.length > 1) {
              that.form.scores.forEach((item) => {
                if (item.courseId&&item.score&&item.courseName) {
                  that.addcourselist.push(item)
                }
              })
              if (that.addcourselist.length === that.form.scores.length) {
                that.isadd = true
              } else {
                that.isadd = false
                addobj.scores = []
              }
              if (that.isadd) {
                if (that.ispadden) {
                  that.$notify({title: '提示', message: '您选择了重复课程', type: 'error', duration: 2000})
                } else {
                  addobj.scores = that.form.scores
                  that.addstudent(addobj, formName, 'add')
                }
              } else {
                that.$notify({title: '提示', message: '您有信息未填', type: 'error', duration: 2000})
              }
            } else {
              that.form.scores.forEach((item) => {
                if (item.courseId && item.score && item.courseName) {
                  that.isadd = true
                } else {
                  that.isadd = false
                }
              })
              if (that.isadd) {
                addobj.scores = that.form.scores
                that.addstudent(addobj, formName, 'add')
              } else {
                that.$notify({title: '提示', message: '您有信息未填', type: 'error', duration: 2000})
              }
            }
          }
          else {
            addobj.scores = []
            that.addstudent(addobj, formName, 'add')
          }
        }
      });
    },
    addstudent (addobj, formName, str) {
      var arr = []
      var strs = ''
      var space = /(^\s+)|(\s+$)/g;
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      var fraction = /^[0-9]+([.][0-9]+){0,1}$/ // /^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+|[1-9]+\d*)$/;
      var scorefraction = /^((\d|[0123456789]\d)(\.\d+)?|200)$/ //^0\.\d+$|^[1-9]+(\.\d+)?$  ^[0-9]+([.][0-9]+){0,1}$
      var positiveinteger = /^[1-9]\d*$/;
      var idcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      var isname = /^[\u4e00-\u9fa5_a-zA-Z]+$/;
      var scoreerr = {}
      var coursescore = {}
      if (isname.test(addobj.name)) {
        if (addobj.sex !== '') {
          if (addobj.mobile === null || myreg.test(addobj.mobile)) {
            if (idcard.test(addobj.idCard)) {
              if (addobj.designateClass === null || positiveinteger.test(addobj.designateClass)) {
                // addobj.designateClass.replace(/(^\s+)|(\s+$)/g,"") === ''
                if (fraction.test(addobj.totalScore)) {
                  if (addobj.scores.length) {
                    // addobj.scores.forEach((item) => {
                    //   arr.push(item.score)
                    //   strs = arr.join('')
                    // })
                    // !scorefraction.test(el.score)
                    scoreerr = addobj.scores.find(el => !fraction.test(el.score))
                    // if (fraction.test(strs)) {
                    //   this.sourcescore = true
                    // } else {
                    //   this.sourcescore = false
                    // }
                    if (scoreerr) {
                      this.$notify({title: '提示', message: '请输入正确分数', type: 'error', duration: 2000})
                    } else {
                      coursescore = addobj.scores.find(el => 0 > el.score || el.score > 200)
                      if (coursescore) {
                        this.$notify({title: '提示', message: '分数限制0-200', type: 'error', duration: 2000})
                      } else {
                        if (str === 'add') {
                          this.sureaddstudent(addobj, formName)
                        } else {
                          this.surechange(addobj, formName)
                        }
                      }
                    }
                  } else {
                  // 发起请求
                    if (str === 'add') {
                      this.sureaddstudent(addobj, formName)
                    } else {
                      this.surechange(addobj, formName)
                    }
                  }
                } else {
                  this.$notify({title: '提示', message: '成绩请输入正数', type: 'error', duration: 2000})
                }
              } else {
                this.$notify({title: '提示', message: '请正确填写预设班级', type: 'error', duration: 2000})
              }
            } else {
              this.$notify({title: '提示', message: '身份证输入不合法', type: 'error', duration: 2000})
            }
          } else {
            this.$notify({title: '提示', message: '请输入正确的手机号', type: 'error', duration: 2000})
          }
        } else {
          this.$notify({title: '提示', message: '性别必选', type: 'error', duration: 2000})
        }
      } else {
        this.$notify({title: '提示', message: '请输入正确的姓名', type: 'error', duration: 2000})
      }
    },
    sureaddstudent (form, formName) {
      PostStudent(form).then(data => {
        this.dialogFormVisible = false;
        this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000})
        this.initform()
        this.resetForm(formName)
        this.getstudentlist(this.studentpage)
        this.getstudentnum(this.studentClass)
      })
    },
    // select选中事件
    selectclass (data, index) {
      this.$set(this.form.scores[index], 'courseId', data.uuid)
      this.$set(this.form.scores[index], 'courseName', data.kcmc)
      this.$set(this.form.scores[index], 'isselected', false)
    },
    choseclass (scores, index) {
      this.form.scores.forEach((item) => {
        if (scores === item) {
          item.isselected = !item.isselected
        } else {
          item.isselected = false
        }
      })
    },
    // 删除新生
    confirmdelect () {
      var arr = []
      this.studentId.forEach((item) => {
        arr.push(item.id)
      })
      DelectStudent(arr).then(data => {
        if (data === '删除成功。') {
          this.getstudentlist(this.studentpage)
          this.getstudentnum(this.studentClass)
          this.dialogDLFormVisible = false
          this.$notify({title: '成功', message: data, type: 'success', duration: 2000})
        } else {
          this.$notify({title: '提示', message: data, type: 'error', duration: 2000})
        }
      })
    },
    // 取消删除人员
    canceldelect () {
      this.dialogDLFormVisible = false
      this.studentId = []
      this.$refs.table.clearSelection();
    },
    delectstudent () {
      if (this.studentId.length) {
        this.dialogDLFormVisible = true
      } else {
        this.$notify({title: '提示', message: '请先选择要删除的人员', type: 'error', duration: 2000})
      }
    },
    resetForm(formName) {
      this.$nextTick(function() {
        this.$refs[formName].resetFields();
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
.studentcontainer{
  padding: 10px 0;
  height: 60px;
  .studentNumbercount{
    height: 100%;
    line-height: 40px;
    float: left;
    .number{
      color: green;
      padding: 0 5px;
    }
  }
  .studentcondition{
    float: left;
    margin-left: 100px;
  }
}
.table-container{
    max-width:1060px;
}
.el-table th{
    background: #f8f8f8;
}
.addmorcourse{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .addcourse{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ccc;
    color: #fff;
    font-size: 24px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }
  .addcourse:hover{
    background-color: aqua;
  }
  .course{
    padding: 5px;
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background:#fff;
    .coursebox{
      padding: 5px;
      /* width: 100%; */
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      position: relative;
      .deletebtn{
        display: inline-block;
        width: 30px;
        height: 30px;
        background-color: #ccc;
        color: #fff;
        font-size: 20px;
        line-height: 30px;
        text-align: center;
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        right: -25px;
        top: 10px;
      }
      .deletebtn:hover{
        background-color: red;
      }
      .selectionbox{
        position: relative;
        /* width: 216px;
        height: 38px; */
        ul{
            margin: 0;
            padding: 0;
            background: #fff;
            position: absolute;
            width: 150px;
            height: 400px;
            bottom: 30px;
            border-radius: 5px;
            border: 1px solid #eee;
            margin-bottom: 20px;
            overflow-x: hidden;
            overflow-y: scroll;
            li{
                height: 30px;
                width: 100%;
                list-style: none;
                line-height: 30px;
                padding-left: 5px;
                border-bottom: solid 1px #eee;
                cursor: pointer;
            }
            li:last-child{
                border-bottom: none;
            }
            li:hover{
              background-color: darkgrey;
              color: #fff;
            }
        }
      }
      .selection{
        /* position: absolute; */
        width: 110px;
        height: 38px;
        background-color: #ffff;
        border: 1px solid #dcdcdc;
        border-radius: 4px;
        position: relative;
        cursor: pointer;
        padding-left: 15px;
        line-height: 40px;
        transition: all .5s ease-in-out;
      }
      .selection:empty::before {  
        content: attr(placeholder);
        color: #ccc;
      }
      .selection:hover{
        border: 1px solid #ccc;
      }
      .selection::after{
        content: '';
        width: 8px;
        height: 8px;
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        position: absolute;
        transform: rotate(135deg);
        right: 11px;
        top: 13px;
        transition: all .5s ease-in-out;
      }
      .avtive::after{
        transform: rotate(-45deg)
      }
    }
  }
}
.tip{
  color: red;
  text-align: left;
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
  -moz-margin-after: 0;
  -moz-margin-before: 0;
}
.studentname{
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.statuesinfo{
  color: red;
  font-size: 15px;
}
.active{
  color: green;
}

.callbackstatues{
  width: 100%;
  height: 500px;
  .callbackstatueslist{
    border: 1px solid #eee;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    .callbackstatuesitem{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      padding: 10px 0;
      span{
        padding: 0 50px;
        display: inline-block;
      }
    }
  }
}
</style>
