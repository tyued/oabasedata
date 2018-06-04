<template>
    <div class="app-container calendar-list-container">
         <el-tabs type="border-card"  @tab-click="handleClick">
            <el-tab-pane >
              <span slot="label"><i class="el-icon-date"></i> 按课程查询</span>
              <div class="filter-container">
                  <el-input placeholder="请输入内容" @keyup.enter.native="kcHandleFilter" v-model="listQuery[kcsearchsel]" class="input-with-select"  style="width: 400px;" >
                      <el-select v-model="kcsearchsel" slot="prepend" @change="searchChange" placeholder="请选择" style="width:120px; height:38px; margin:0 auto;">
                          <el-option label="全部" value="all"></el-option>
                          <el-option label="课程名称" value="kcmc"></el-option>
                          <el-option label="开课人" value="skrxm"></el-option>
                      </el-select>
                  </el-input>
                  <el-button class="filter-item" type="primary" v-waves icon="search" @click="kcHandleFilter">搜索</el-button>
              </div>
              <el-row class="filter-container">
                <el-button type="info" plain @click="handleExportXkmd">导出课程选课名单</el-button>
                <el-button type="warning" plain @click="handleCopy">复制上学期选课结果</el-button>
              </el-row>
              <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                  <el-table-column align="center" label="课程名称">
                      <template slot-scope="scope">
                          <span>{{scope.row.kcmc}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" label="课程类别" width="140">
                      <template slot-scope="scope">
                          <span>{{scope.row.kclb}}</span>
                      </template>
                  </el-table-column>  
                  <el-table-column align="center" label="授课教师" width="140">
                      <template slot-scope="scope">
                          <span>{{scope.row.skrxm}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" label="授课时间" width="280">
                      <template slot-scope="scope">
                          <span>{{scope.row.sksj}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" label="人数限制" width="140">
                      <template slot-scope="scope">
                          <span>{{scope.row.xzrs}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" label="学生人数"  width="140">
                      <template slot-scope="scope">
                          <span>{{scope.row.xsrs}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" label="选满用时" width="140">
                      <template slot-scope="scope">
                          <span>{{scope.row.xmys}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" label="点击量" width="140">
                      <template slot-scope="scope">
                          <span>{{scope.row.djl}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="150">
                      <template slot-scope="scope">
                          <el-button slot="reference" type="success" @click="ckXkjgxx(scope.row)">查看</el-button>
                      </template> 
                  </el-table-column>
              </el-table>
              <div v-show="!listLoading" class="pagination-container">
                  <el-pagination @size-change="kcHandleSizeChange" @current-change="kcHandleCurrentChange" :current-page.sync="listQuery.kcpage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="kctotal"> </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane >
              <span slot="label"> <i class="el-icon-service"></i> 按学生查询</span> 
              <div class="filter-container">
                <el-input placeholder="请输入内容" @keyup.enter.native="xsHandleFilter" v-model="listQuery[xssearchsel]" class="input-with-select"  style="width: 400px;" >
                  <el-select v-model="xssearchsel" slot="prepend" @change="searchChange" placeholder="请选择" style="width:120px; height:38px; margin:0 auto;">
                      <el-option label="全部" value="all"></el-option>
                      <el-option label="学号" value="xh"></el-option>
                      <el-option label="姓名" value="xm"></el-option>
                  </el-select>
                </el-input>
              <el-button class="filter-item" type="primary" v-waves icon="search" @click="xsHandleFilter">搜索</el-button>
            </div>
            <el-row class="filter-container">
                <el-button type="info" plain @click="handleExportXsmd">导出学生选课名单</el-button>
                <el-tooltip class="item" effect="dark" content="点击该按钮可以提醒未选课的学生家长进行选课" placement="top">
                     <el-button type="warning" style="float:right" @click="sendXkRemind">发送选课提醒<i class="el-icon-question"></i></el-button>
                </el-tooltip>
            </el-row>
            <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="学号" width="170">
                    <template slot-scope="scope">
                        <span>{{scope.row.xh}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.xm}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="年级" width="140">
                    <template slot-scope="scope">
                        <span>{{scope.row.njmc}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级" width="140">
                    <template slot-scope="scope">
                        <span>{{scope.row.bjmc}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="特长生类型" >
                    <template slot-scope="scope">
                        <span>{{scope.row.tcslx}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="学生选课数" width="140">
                    <template slot-scope="scope">
                        <span>{{scope.row.xkCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button slot="reference" type="success" @click="ckXkjgxx(scope.row)">查看</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="xsHandleSizeChange" @current-change="xsHandleCurrentChange" :current-page.sync="listQuery.xspage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="xstotal"> </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
         <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="1000px" >
            <el-form  ref="form" label-width="110px" name="myform">
                <span v-if="tableindex == 0"  :v-model="formTitle">
                    课程名称：{{formTitle.kcmc}}  
                    限制人数：{{formTitle.xzrs}} 
                    已选人数：{{formTitle.xsrs}}  
                </span>
                <span v-else  :v-model="formTitle">
                    学生姓名：{{formTitle.xm}}   
                    年级：{{formTitle.njmc}}    
                    班级：{{formTitle.bjmc}}   
                </span>
                <el-table  v-if="tableindex == 0"  :key='tableKey' :data="xkjglist" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                      <el-table-column align="center" label="学号"  width="180">
                          <template slot-scope="scope">
                              <span>{{scope.row.xh}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column align="center" label="姓名" width="140">
                          <template slot-scope="scope">
                              <span>{{scope.row.xm}}</span>
                          </template>
                      </el-table-column>  
                      <el-table-column align="center" label="年级" width="140">
                          <template slot-scope="scope">
                              <span>{{scope.row.njmc}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column align="center" label="班级" width="140">
                          <template slot-scope="scope">
                              <span>{{scope.row.bjmc}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column align="center" label="是否为预分配学生" width="140">
                          <template slot-scope="scope">
                              <!-- <span v-if="scope.row.sjly == 0" style="color:#85ce61">{{(scope.row.sjly == 0) ? "否":"是"}}</span> -->
                              <span>{{(scope.row.sjly == 0) ? "否":"是"}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column align="center" label="加入时间" >
                          <template slot-scope="scope">
                              <span>{{scope.row.sqsj}}</span>
                          </template>
                      </el-table-column>
                  </el-table>
                  <el-table v-else :key='tableKey' :data="xkjglist" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                        <el-table-column align="center" label="课程名称"  width="250">
                            <template slot-scope="scope">
                                <span>{{scope.row.kcmc}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="课程类别" width="200">
                            <template slot-scope="scope">
                                <span>{{scope.row.lbmc}}</span>
                            </template>
                        </el-table-column>  
                        <el-table-column align="center" label="授课教师" width="180">
                            <template slot-scope="scope">
                                <span>{{scope.row.skrxm}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="授课时间" >
                            <template slot-scope="scope">
                                <span>{{scope.row.sksj}}</span>
                            </template>
                        </el-table-column>
                  </el-table>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">关 闭</el-button>
            </div>
          </el-dialog>
           <el-dialog :title="remindMap[dialogStatus]"  :visible.sync="remindFormVisible" width="1000px" >
            <el-form  ref="remindForm" label-width="110px" name="remindForm">
                <el-form-item label="消息内容">
                        <el-input  type="textarea" :autosize="{ minRows: 4, maxRows: 6}"  v-model="sendMessageInfo"></el-input>
                </el-form-item>
                 <el-form-item label="状态">
                    <el-checkbox-group  v-model="checkedMessageType" :min="1" :max="2"> 
                        <el-checkbox v-for="(message,index) in messageTypes" :label="index"  :key="index">{{message}}</el-checkbox>
                        <!-- <el-checkbox v-for="messageType in messageTypes" :label="messageType" :key="messageType">{{messageType}}</el-checkbox> -->
                    </el-checkbox-group>
                 </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sendXkMessage('remindForm')" :disabled="changeSure">确 定</el-button>
                <el-button @click="cancel('remindForm')">关 闭</el-button>
            </div>
          </el-dialog>
    </div>
</template>
<script>
import { xsxxPage,kcxxPage,ckxkjg,copyXkxx,getXkmdUrl,sendXktz} from "api/xkxt/xkjgmanager/index";
import { getXXMess } from "api/dict";
import { dqxnxqObj } from "api/admin/acadyear/index";
import { getToken } from "utils/auth";
import { mapGetters } from "vuex";
const messageTypeOptions = ['短信推送', '微信推送'];
export default {
  name: "xkjgmanager",
  data() {
    return {
      // showFlag: false,
      xxdm: "",
      dqxn: "", //当前学年
      dqxq: "", //当前学期
      usercode:"", //当前用户
      tableKey: 0,
      listLoading: false,
      xstotal: 0,
      kctotal: 0,
      list: [],
      xkjglist: [],
      dictMap: {},
      form: {},
      remindForm: {},
      listQuery: {
        // 分页
        page: 1,
        limit: 20,
        xxdm: ""
      },
      xssearchsel: "all",
      kcsearchsel:"all",
      dialogFormVisible: false,
      remindFormVisible: false,
      dialogStatus: "",
      tabPosition: "top",
      textMap: {
          ckxkjg: '查看',
        },
      remindMap:{
          sendXkMessage:'发送选课提醒',
        }, 
      formTitle:{},// 查看页面题标
      tableindex :'',// 页签标识
      sendMessageText:'',// 发送选课消息推送标识
      changeSure: false, // 防止重复提交
      checkedMessageType: [0],
      sendMessageInfo:'亲爱的家长您好！您的孩子本学期还未报名任何兴趣班课程，请留意学校选课通知，踊跃报名参选！',
      messageType:[],
      messageTypes: messageTypeOptions,
    };
  },
  created() {
    this.xxdm = window.localStorage.getItem("xxdm");
    this.usercode = window.localStorage.getItem("usercode")
     this.getList();
    dqxnxqObj({ xxdm: this.xxdm }).then(response => {
      this.dqxn = response.xn;
      this.dqxq = response.xq;
      this.getList();
    });
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.xxdm = this.xxdm;
      this.listQuery.ssxn = this.dqxn;
      this.listQuery.ssxq = this.dqxq;
      kcxxPage(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.kctotal = response.data.total;
          this.listLoading = false;
        });
    },
    getXsxxList() {
      this.listLoading = true;
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.ssxn = this.dqxn;
        this.listQuery.ssxq = this.dqxq;
        xsxxPage(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.xstotal = response.data.total;
          this.listLoading = false;
        });
    },
    //页签变化事件
    handleClick(tab, event) {
       //判断页签
      if(tab.index==1){
         this.tableindex = 1;
         this.listQuery = { page: 1, limit: 20, name: undefined };
         this.getXsxxList();
      }else{
         this.tableindex = 0;
         this.listQuery = { page: 1, limit: 20, name: undefined };
         this.getList();
      }
    },
    // 学生纬度页面搜索
    xsHandleFilter() {
      if (this.xssearchsel == "all") {
        this.listQuery = { page: 1, limit: 20, name: undefined };
      }
      this.getXsxxList();
    },
    // 课程纬度页面搜索
    kcHandleFilter() {
       if (this.kcsearchsel == "all") {
        this.listQuery = { page: 1, limit: 20, name: undefined };
      }
      this.getList();
    },
    searchChange(val) {
      this.listQuery = {
        page: 1,
        limit: 20,
        name: undefined
      };
      this.listQuery.xxdm = this.xxdm;
    },
    // 查看学生选课结果
    ckXkjgxx(row) {
      this.listQuery.xxdm = this.xxdm;
      this.listQuery.ssxn = this.dqxn;
      this.listQuery.ssxq = this.dqxq;
      this.listQuery.kcdm = row.kcdm;
      this.listQuery.xh = row.xh;
      this.formTitle = row;
      ckxkjg(this.listQuery).then(response => {
        this.xkjglist = response.data.rows;
        this.dialogFormVisible = true;
        this.dialogStatus = 'ckxkjg';
      });
    },
    // 复制上学期选课结果
    handleCopy(row) {
        this.$confirm('确定复制上学期的选课结果吗？（复制成功后将不可撤销哦）', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            copyXkxx(this.listQuery).then(res => {
                if (res.status == '200') {
                this.$notify({
                        title: '成功',
                        message: '复制成功',
                        type: 'success',
                        duration: 2000
                    });
              } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
              }
                
            });
            const that = this;
            setTimeout(() => {
              that.changeSure = false;
            }, 1500);
        }).catch(e => {
                // console.log(e)
        });
    },
    // 导出课程选课名单
    handleExportXkmd() {
        getXkmdUrl(this.listQuery).then(res => {
            const url  = res + "/xkjg/exportKcxkmd?ssxn="+this.dqxn +"&xxdm="+ this.xxdm+"&ssxq="+this.dqxq;
            window.open(url);     
            });
           
    },
    // 导出学生选课名单
    handleExportXsmd(){
         getXkmdUrl(this.listQuery).then(res => {
            const url  = res + "/xkjg/exportXsxkmd?ssxn="+this.dqxn +"&xxdm="+ this.xxdm+"&ssxq="+this.dqxq;
            window.open(url);     
            });
    },
    // 发送选课消息提醒
    sendXkRemind(){
        this.remindFormVisible = true;
        this.dialogStatus = 'sendXkMessage';
    },
    // 选课消息提醒推送
    sendXkMessage(formName) {
         this.listQuery.sendMessageInfo = this.sendMessageInfo;
         const tsfs = this.checkedMessageType;
         this.listQuery.tsfs = tsfs;
         this.listQuery.usercode = this.usercode;
         sendXktz(this.listQuery).then(res => {
                if (res.status == '200') {
                this.$notify({
                        title: '成功',
                        message: '发送成功',
                        type: 'success',
                        duration: 2000
                    });
                } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
                }
            });
            const that = this;
            setTimeout(() => {
              that.changeSure = false;
            }, 1500);
        
         this.remindFormVisible = false;
    },
    kcHandleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    xsHandleSizeChange(val) {
      this.listQuery.limit = val;
      this.getXsxxList();
    },
    kcHandleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    xsHandleCurrentChange(val) {
      this.listQuery.page = val;
     this.getXsxxList();
    },
    cancel() {
      // 关闭查看选课结果弹窗
      this.dialogFormVisible = false;
      // 关闭选课消息推送弹窗
      this.remindFormVisible = false;
    },
    getValue(type, key) {
      const data = this.dictMap[type];
      return _.find(data, { id: key }).text;
    }
  }
};
</script>
<style>
.filter-container .filter-item {
  vertical-align: inherit;
}

.el-input-group__append,
.el-input-group__prepend {
  padding: 0 10px;
}

.el-checkbox + .el-checkbox {
  margin-left: 0;
}

.el-checkbox {
  margin-right: 30px;
}

.line {
  text-align: center;
}

.sliderRight-enter-active {
  animation-name: fadeInRight;
  animation-duration: 0.5s;
}

.sliderRight-leave-active {
  animation-name: fadeOutRight;
  animation-duration: 0.5s;
}

@-webkit-keyframes fadeInRight {
  from {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@-webkit-keyframes fadeOutRight {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
}

@keyframes fadeOutRight {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
}
</style>
