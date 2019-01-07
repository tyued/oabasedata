<!--排课系统首页-->
<template>
  <section class="content-container">
    <div class="handle-box">
      <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新建排课任务</el-button>
      <el-select v-model="pkrw.rwzt" clearable placeholder="请选择" class="handle-select mr10">
        <el-option v-for="(item,index) in  rwztOptions" :key="index" :label="item" :value="index"></el-option>
      </el-select>
      <el-input v-model="pkrw.name" placeholder="筛选关键词" class="handle-input mr10"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <i  style="display: block;font-size: 20px; margin-bottom: 15px;color: #606266;float: right"
          class="el-icon-question" @click="ckPkxz">&nbsp;<span style="color: red;font-size: 14px;font-family: '微软雅黑'">排课需知</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
    </div>
    <div v-loading="loading">
      <!--列表-->
      <el-row :gutter="12" style="margin-bottom:6px;" v-for="(item,index) in list" :key="index">
        <el-col :span="24">
          <el-card shadow="always" :class="classColor(item.rwzt)" >
            <el-badge :value="listRwZt[item.rwzt].pkmc" >
              <h4>{{item.name}}</h4>
            </el-badge>
            <div style="height: 52px;">
              <p>起止时间:{{item.kssj | formatDate}}-{{item.jssj | formatDate}}</p>
            </div>
            <div style="height: 40px">
              <el-row style="float:left;">
                <el-button @click="toPksz(item,0,'0')" size="small" icon="iconfont icon-el-icon-config" plain
                           :type="listRwZt[item.rwzt].pksz?'info':'primary'"
                           :disabled="listRwZt[item.rwzt].pksz">排课设置
                </el-button>
                <el-button @click="toPksz(item,3,'0')" size="small" icon="iconfont icon-el-icon-survey" plain
                           :type="listRwZt[item.rwzt].pkwh?'info':'primary'"
                           :disabled="listRwZt[item.rwzt].pkwh">排课调整
                </el-button>
                <el-button @click="toPksz(item,4,'0')" size="small" icon="iconfont icon-el-icon-templatedefault" plain
                           :type="listRwZt[item.rwzt].pkjg?'info':'primary'"
                           :disabled="listRwZt[item.rwzt].pkjg">排课结果
                </el-button>
                <el-button @click="toPksz(item,3,'2')" size="small" icon="iconfont icon-el-icon-yuyuedingdan" plain
                           :type="listRwZt[item.rwzt].lspk?'info':'primary'"
                           :disabled="listRwZt[item.rwzt].lspk">临时  调课
                </el-button>
              </el-row>
              <el-row style="float:right;">
                <!-- <el-tooltip class="item" effect="dark" content="修改" placement="top-start">-->
                <el-button @click="handleUpdate(item)" size="mini" type="primary" icon="el-icon-edit-outline"
                >修改
                </el-button>
                <!-- </el-tooltip>-->
                <el-button @click="deleteData(item.rwid)" size="mini" type="danger" icon="el-icon-delete"
                >删除
                </el-button>
                <el-button @click="openData(item.rwid)" size="mini" type="success" icon="el-icon-tickets"
                           :disabled="listRwZt[item.rwzt].qy">启用
                </el-button>
                <el-button @click="handleCopy(item)" size="mini" type="warning"
                           icon="el-icon-document"
                >复用
                </el-button>
              </el-row>
            </div>
            <p></p>
          </el-card>
        </el-col>
      </el-row>
      <!--工具条-->
      <el-col :span="24">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="pkrw.query.page" :page-sizes="[4,8,12,16,20]"
                       :page-size="pkrw.query.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-col>
      <!--新增界面-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogForm" width="29%" @close="colseDialog">
        <el-form :model="temp" :rules="rules" ref="dataForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item label="学年" prop="xn">
            <el-select v-model="temp.xn" style="width: 100%;">
              <el-option v-for="(item,index) in  xnList" :key="(index+1)" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务类型" prop="type">
            <el-select v-model="temp.type" style="width: 100%;" :disabled="rwDisabled" placeholder="请选择任务类型">
              <el-option v-for="(item,index) in  typeOptions" :key="(index+1)" :label="item"
                         :value="(index+1)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务日期" required>
            <el-col :span="24">
              <el-form-item prop="tempTime">
                <el-date-picker
                  :unlink-panels=true
                  v-model="temp.tempTime"
                  style="width: 100%;"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="11">
               <el-form-item prop="kssj">
                 <el-date-picker type="date" placeholder="选择日期" v-model="temp.kssj"
                                 style="width: 100%;"></el-date-picker>
               </el-form-item>
             </el-col>
             <el-col class="line" :span="1">&nbsp;-</el-col>
             <el-col :span="11">
               <el-form-item prop="jssj">
                 <el-date-picker type="date" placeholder="选择日期" v-model="temp.jssj"
                                 style="width: 100%;"></el-date-picker>
               </el-form-item>
             </el-col>-->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseDialog">取消</el-button>
          <!--修改-->
          <el-button v-if="dialogStatus=='update'" type="primary" @click="updateSaveData">确认</el-button>
          <!--复用-->
          <el-button v-else-if="dialogStatus=='copy'" type="primary" :disabled="copyDisabled" @click="copySaveData">确认</el-button>
          <!--保存-->
          <el-button v-else type="primary" @click="saveData">确认</el-button>
        </div>
      </el-dialog>

      <!--查看排课须知 -->
      <el-dialog title="排课需知" center :visible.sync="pkxzDialogForm" width="29%" @close="colseDialog">
        <el-form  ref="dataForm"  class="demo-ruleForm">
          <el-form-item label="排课流程：" prop="name"/>
          <el-alert title="第一步：创建本次排课任务,选择排课类型。" type="success" :closable="false"  show-icon></el-alert>
          <el-alert title="第二步：录入本次排课的基础信息。" type="success" :closable="false"  show-icon></el-alert>
          <el-alert title="第三步：根据学校实际情况,选填所需的排课规则。" type="success" :closable="false"  show-icon></el-alert>
          <el-alert title="第四步：点击自动排课,生成课表。" type="success" :closable="false"  show-icon></el-alert>
          <el-alert title="*说明：如果排课结果未达到老师满意,也可进行手动微调,同时也支持个别年级进行重新排课。" type="error"   :closable="false" />
          <el-form-item label="排课注意事项：" prop="name"/>
          <el-alert title="1、要求按照流程一步一步设置,避免出现未成功排课。" type="warning" :closable="false"  show-icon></el-alert>
          <el-alert title="2、不需要的规则条件尽量不要设置,以免影响排课结果。" type="warning" :closable="false"  show-icon></el-alert>
          <el-alert title="3、课表启用后,不可再进行重新排课操作。" type="warning" :closable="false"  show-icon></el-alert>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closePkxz">关闭</el-button>
        </div>
      </el-dialog>
    </div>

  </section>
</template>

<script>
  import {
    dqxnxqObj,
    getPageList,
    getAdd,
    getUpdate,
    getCopy,
    getDelete,
    xnPage,
    getValidaName
  } from '@/api/pkxt/arrangingTask/index'
  import { formatDate } from '@/utils'

  export default {
    data() {
      /** 验证名称不能重复**/
      const validaName = (rule, value, callback) => {
        if (this.dialogStatus === 'update' && value === this.tempName) {
          callback();
        } else {
          getValidaName({ name: value }).then(res => {
            if (res.data > 0) {
              callback(new Error('任务名称不能重复'));
            } else {
              callback();
            }
          })
        }
      };
      /** 验证任务时间**/
      const validaDate = (rule, value, callback) => {
        const [start, end] = [new Date(value[0]), new Date(value[1])];
        if (start >= end) {
          callback(new Error('结束时间必须大于开始时间'));
        } else {
          callback();
        }
      };
      return {
        copyDisabled: false,
        copyLoading: false,
        rwDisabled: false,
        list: [],
        xxdm: window.localStorage.getItem('xxdm'),
        dqxn: '',
        dqxq: '',
        loading: true,
        dialogForm: false, // 定义新增弹框默认关闭
        pkxzDialogForm: false,
        dialogStatus: '',
        listRwZt: [/** 列表显示的三种状态**/
          { pkmc: '排课中', pksz: false, pkwh: true, pkjg: true, qy: true, lspk: true },
          { pkmc: '未启用', pksz: false, pkwh: false, pkjg: false, qy: false, lspk: true },
          { pkmc: '已启用', pksz: true, pkwh: true, pkjg: false, qy: true, lspk: false }
        ],
        pkrw: {
          /** 保存的form表单数据**/
          name: '',
          type: '',
          rwzt: '',
          xxdm: this.xxdm,
          query: {
            page: 1,
            limit: 4
          }
        },
        rwztOptions: ['排课中', '未发布', '已发布'],
        typeOptions: ['常规排课', '单双周', '暑假排课'],
        xnList: [],
        temp: {
          /** 保存的form表单数据**/
          rwid: undefined,
          name: '',
          type: 1,
          rwzt: '0',
          tempTime: '',
          kssj: null,
          jssj: null,
          cjsj: new Date(),
          query: this.query,
          xxdm: this.xxdm,
          xn: this.dqxn
        },
        textMap: {
          update: '修改排课任务',
          create: '新建排课任务',
          copy: '复用排课任务'
        },
        tableData: [],
        total: 0,
        rules: {
          /** 表单验证规则**/
          name: [
            { required: true, message: '请输入任务名称', trigger: 'change' },
            { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'change' },
            { validator: validaName, trigger: 'change' }],
          type: [{ required: true }],
          xn: [{ required: true, message: '学年不能为空' }],
          tempTime: [{ required: true, message: '请选择日期', trigger: 'change' },
            { validator: validaDate, trigger: 'change' }]
          /* ,kssj: [{type: 'date', required: true, message: '请选择日期', trigger: 'change'}],
          jssj: [{type: 'date', required: true, message: '请选择日期', trigger: 'change'}]*/
        },
        tempName: ''
      }
    },
    filters: {
      formatDate(time) {
        /** 过滤时间格式**/
        const date = new Date(time);
        return formatDate(date, 'yyyy年MM月dd日');
      }
    },
    created() {
      dqxnxqObj({ xxdm: this.xxdm }).then(response => {
        this.dqxn = response.xn;
        this.dqxq = response.xq;
        this.getPkrwList();// 搜索条件
      })

    },
    methods: {
      getPkrwList() {
        /** 排课任务列表**/
        this.loading = true;
        this.pkrw.xxdm = window.localStorage.getItem('xxdm');
        getPageList(this.pkrw).then(res => {
          this.total = res.data.total;
          this.list = res.data.rows;
          console.log(this.list)
          this.loading = false;
        });
        xnPage({ xxdm: this.xxdm, page: 1, limit: 20000 }).then(response => {
          const year = response.data.rows;
          const rxxn = [];
          for (let i = 0; i < year.length; i++) {
            rxxn[i] = year[i].xn
          }
          this.xnList = _.uniq(rxxn);
        })
      },
      toPksz(v, index, activeName) {
        /** 跳转排课设置页面**/
        this.$router.push({
          path: '/pkxt/pksz',
          query: {
            name: v.name,
            index, /** 排课模块跳转标识 **/
            rwid: v.rwid,
            rwxn: v.xn,
            xxdm: this.xxdm,
            dqxn: this.dqxn,
            dqxq: this.dqxq,
            activeName /** 排课tab定位标识 **/
          }
        });
      },
      resetTemp() {
        this.temp = {
          rwid: undefined,
          name: '',
          type: 1,
          rwzt: '0',
          tempTime: '',
          kssj: null,
          jssj: null,
          cjsj: new Date(),
          query: this.query,
          xxdm: this.xxdm,
          xn: this.dqxn
        }
      },
      handleAdd() {
        /** 打开新增弹框**/
        this.dialogStatus = 'create'
        this.resetTemp();
        this.dialogForm = true;
        this.rwDisabled = false;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      saveData() {
        /** 提交数据**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            tempData.cjsj = +new Date(tempData.cjsj);
            tempData.kssj = +new Date(tempData.tempTime[0]);
            tempData.jssj = +new Date(tempData.tempTime[1]);
            getAdd(tempData).then(() => {
              this.dialogForm = false;
              this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
              this.getPkrwList();
            })
          }
        })
      },
      handleUpdate(row) {
        this.dialogStatus = 'update';
        const tempData = Object.assign({}, row);
        this.temp.rwid = tempData.rwid;
        this.temp.name = tempData.name;
        this.tempName = tempData.name;
        this.temp.type = tempData.type;
        this.temp.rwzt = tempData.rwzt;
        this.temp.xn = tempData.xn;
        this.temp.cjsj = tempData.cjsj;
        /** 转中国标准时间插件需要的格式Tue Sep 19 2017 08:00:00 GMT+0800 (中国标准时间)**/
        this.temp.tempTime = [new Date(tempData.kssj), new Date(tempData.jssj)];
        this.dialogForm = true;
        this.rwDisabled = true;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      updateSaveData() {
        /** 修改**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            tempData.kssj = +new Date(tempData.tempTime[0]);
            tempData.jssj = +new Date(tempData.tempTime[1]);
            getUpdate(tempData.rwid, tempData).then(() => {
              this.dialogForm = false;
              this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
              this.getPkrwList();
            })
          }
        })
      },
      openData(id) {
        /** 启用**/
        this.$confirm('确认要启用吗？', '提示', { type: 'warning' }).then(() => {
          const data = { rwid: id, rwzt: '2' }
          const tempData = Object.assign({}, data);
          getUpdate(id, tempData).then(() => {
            this.$notify({ title: '成功', message: '启用成功', type: 'success', duration: 2000 });
            this.getPkrwList();
          });
        });
      },
      handleCopy(row) {
        /** 复用**/
        this.dialogStatus = 'copy';
        const tempData = Object.assign({}, row);
        this.temp.rwid = tempData.rwid;
        this.temp.name = tempData.name + ' - 副本';
        this.temp.type = tempData.type;
        this.temp.rwzt = tempData.rwzt;
        this.temp.xn = this.dqxn;
        this.temp.xxdm = this.xxdm;
        /** 转中国标准时间插件需要的格式Tue Sep 19 2017 08:00:00 GMT+0800 (中国标准时间)**/
        this.temp.tempTime = [new Date(tempData.kssj), new Date(tempData.jssj)];
        this.dialogForm = true;
        this.rwDisabled = true;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      copySaveData() {
        this.copyDisabled = true;
        /** 复用保存**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            tempData.cjsj = +new Date(tempData.cjsj);
            tempData.kssj = +new Date(tempData.tempTime[0]);
            tempData.jssj = +new Date(tempData.tempTime[1]);
            getCopy(tempData).then(() => {
              this.dialogForm = false;
              this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
              this.getPkrwList();
              this.copyDisabled = false;
            })
          }
        })
      },
      deleteData(id) {
        /** 删除**/
        this.$confirm('删除后数据不可恢复，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
          getDelete(id).then(() => {
            this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
            this.getPkrwList();
          });
        });
      },
      colseDialog() {
        this.dialogForm = false;
      },
      // 查看排课须知
      ckPkxz() {
        this.pkxzDialogForm = true;
      },
      // 关闭排课须知
      closePkxz() {
        this.pkxzDialogForm = false;
      },
      handleSizeChange(val) {
      /** 跳转到某页**/
        this.pkrw.query.limit = val;
        this.getPkrwList();
      },
      handleCurrentChange(val) {
      /** 跳转到某页**/
        this.pkrw.query.page = val;
        this.getPkrwList();
      },
      search() {
        this.pkrw.query.page = 1;
        this.getPkrwList();
      },
      classColor(v) {
        return 'aa_' + v;
      }

    },
    computed: {
      unreadNum() {
        return this.unread.length;
      }

    }
  }

</script>

  <style scoped>
  .content-container {
    padding: 20px;
  }

  .content-container .item {
    margin-top: 5px;
  }

  .aa_0 .el-badge__content {
    background-color: #f56c6c;
  }

  .aa_1 .el-badge__content {
    background-color: #ff9800;
  }

  .aa_2 .el-badge__content {
    background-color: #8bc34a;
  }

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 78px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .del-dialog-cnt {
    font-size: 16px;
    text-align: center
  }

  .content-container.el-date-editor .el-range-separator {
    width: 12%;
  }
  .handle-select {
    width: 95px;
  }
  .content-container h4 {
    font-weight : bold;
    font-size: 16px;
    font-family: 宋体;
  }
</style>


