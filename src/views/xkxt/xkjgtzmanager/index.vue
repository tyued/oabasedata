<template>
    <div class="app-container calendar-list-container">
         <el-tabs type="border-card"  @tab-click="handleClick">
            <el-tab-pane >
              <span slot="label"><i class="el-icon-setting"></i> 选课结果调整</span>
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
                  <el-table-column align="center" label="申请人数"  width="140">
                      <template slot-scope="scope">
                          <span>{{scope.row.xsrs}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" label="满足最低人数" width="140">
                      <template slot-scope="scope">
                          <span v-if="scope.row.xsrs - scope.row.zdrs < 0" style="color:#f56c6c">否</span>
                          <span v-else style="color:#85ce61">是</span>
                      </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="150">
                      <template slot-scope="scope">
                          <el-button size="small" type="success" @click="handleUpdate(scope.row)">调整</el-button>
                          <el-button size="small" type="warning" @click="handleCancel(scope.row)">撤销</el-button>
                      </template> 
                  </el-table-column>
              </el-table>
              <div v-show="!listLoading" class="pagination-container">
                  <el-pagination @size-change="kcHandleSizeChange" @current-change="kcHandleCurrentChange" :current-page.sync="listQuery.kcpage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="kctotal"> </el-pagination>
              </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="1100px" >
            <el-form :model="form" ref="form" label-width="110px" name="myform">
                <span :v-model="formTitle">
                    课程名称：{{formTitle.kcmc}}  
                    课程类别：{{formTitle.kclb}} 
                    开课人：{{formTitle.skrxm}}  
                </span>
                 <el-table :key='tableKey' :data="xkjglist" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
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
                      <el-table-column align="center" label="操作" width="150">
                      <template slot-scope="scope">
                          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                      </template> 
                  </el-table-column>
                  </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">返 回</el-button>
                <el-button type="primary" @click="update('form')" :disabled="changeSure">保 存</el-button>
            </div>
      </el-dialog>
    </div>
</template>
<script>
import { page,ckxkjg,tzXsxkxx,cxXsxkjg} from "api/xkxt/xkjgtzmanager/index";
import { getXXMess } from "api/dict";
import { dqxnxqObj } from "api/admin/acadyear/index";
export default {
  name: "xkjgtzmanager",
  data() {
    return {
      // showFlag: false,
      xxdm: "",
      dqxn: "", //当前学年
      dqxq: "", //当前学期
      tableKey: 0,
      listLoading: false,
      xstotal: 0,
      kctotal: 0,
      list: [],
      dictMap: {},
      form: {},
      listQuery: {
        // 分页
        page: 1,
        limit: 20,
        xxdm: ""
      },
      formTitle:{},
      kcsearchsel:"all",
      dialogFormVisible: false,
      dialogStatus: "",
      //tabPosition: "top",
      textMap: {
          update: '选课结果调整',
        },
      tzxslist:[],//调整学号数组   
      xkjglist: [],  
      changeSure: false, // 防止重复提交
    };
  },
  created() {
    this.xxdm = window.localStorage.getItem("xxdm");
    this.listQuery.xxdm = this.xxdm;

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
      page(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.kctotal = response.data.total;
          this.listLoading = false;
        });
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
    //调整
    handleUpdate(row) {
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
    // 撤销
    handleCancel(row) {
        this.$confirm('确定撤销此课程吗？（撤销后将不可恢复哦）', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.listQuery.xxdm = this.xxdm;
            this.listQuery.ssxn = this.dqxn;
            this.listQuery.ssxq = this.dqxq;
            this.listQuery.kcdm = row.kcdm;
            this.listQuery.kcmc = row.kcmc;
            cxXsxkjg(this.listQuery).then(() => {
                this.$notify({
                    title: '成功',
                    message: '撤销成功',
                    type: 'success',
                    duration: 2000
                });
            });
         }).catch(e => {
                // console.log(e)
        });
    },
    handleDelete(row) {
        this.tzxslist.push(row.xh);
        const index = this.xkjglist.indexOf(row);
        this.xkjglist.splice(index, 1);
    },
    ckxkjg(formName) {
        this.$refs[formName].validate(valid => {
            this.changeSure = true;
            this.dialogFormVisible = false;
            put(this.form.lbid, this.form).then(res => {
              this.dialogFormVisible = false;
              this.getList();
              if (res.status == '200') {
                this.$notify({ title: '成功', message: '保存成功', type: 'success', duration: 2000 });
              } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
              }
            });
            const that = this;
            setTimeout(() => {
              that.changeSure = false;
            }, 1500);
        });
      },
    // 保存调整结果
    update(formName) {
        this.changeSure = true;
        this.dialogFormVisible = false; 
            tzXsxkxx({kcdm:this.formTitle.kcdm,kcmc:this.formTitle.kcmc ,tzmd:this.tzxslist,xndm :this.dqxn,xqdm:this.dqxq,xxdm:this.xxdm}).then((res) => {
                if(res.status=="200"){
                    this.dialogFormVisible = false;
                    this.getList();
                    this.$notify({title: '成功', message: '保存成功', type: 'success', duration: 2000});
                }else{
                    this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
                }
            });
            var that = this;
            setTimeout(function(){
                that.changeSure = false;
            },1500);
        this.tzxslist = [];
    },
    handleClick(tab, event) {
       //判断页签
        this.tableindex = 0;
        this.listQuery = { page: 1, limit: 20, name: undefined };
        this.getList();
    },
    kcHandleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    kcHandleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    cancel() {
      this.dialogFormVisible = false;
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
