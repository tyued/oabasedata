<!--排课系统首页-->
<template>
  <section class="content-container">
    <div class="handle-box">
     <el-select v-model="kswh.kslx" clearable placeholder="考试类型" style="width: 150px">
        <el-option v-for="(item,index) in  kslxList" :key="item.jlid" :label="item.lxmc" :value="item.jlid"></el-option>
      </el-select>
      <el-select v-model="kswh.ksxn" clearable placeholder="考试学年" style="width: 150px">
        <el-option v-for="(item,index) in  xnList" :key="index" :label="item.xn" :value="item.xn"></el-option>
      </el-select>
      <el-select v-model="kswh.ksxq" clearable placeholder="考试学期" style="width: 150px">
        <el-option v-for="(item,index) in  xqList" :key="index" :label="item.xqmc" :value="item.xq"></el-option>
      </el-select>
      <el-input v-model="kswh.ksmc" placeholder="输入名称关键词" class="handle-input mr10"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    <!--  <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">新建考试</el-button>-->
    </div>
    <div v-loading="loading">
      <!--列表-->
      <el-row v-if="list.length > 0" :gutter="12" style="margin-bottom:6px;" v-for="(item,index) in list" :key="index">
        <el-col :span="24">
          <el-card shadow="always" :class="classColor(item.pkzt)">
            <el-badge :value="listRwZt[item.pkzt].ztmc" >
              <h4>{{item.ksmc}}</h4>
            </el-badge>
            <div style="height: 52px;">
              <p>考试学年学期:{{item.ksxn}}-{{item.ksxq | xqTostring}}</p>
              <p>起止时间:{{item.kskssj | formatDate}}-{{item.ksjssj | formatDate}}</p>
            </div>
            <div style="height: 40px;margin-top: 10px;">
              <el-row style="float:left;">
                <el-button @click="toPage(item,0,'0')" size="small" icon="iconfont icon-el-icon-config" plain
                           :type="listRwZt[item.pkzt].pksz?'info':'primary'"
                           :disabled="listRwZt[item.pkzt].pksz">排考设置
                </el-button>
                <el-button @click="toPage(item,5,'5')" size="small" icon="iconfont icon-el-icon-survey" plain
                           :type="listRwZt[item.pkzt].pktz?'info':'primary'"
                           :disabled="listRwZt[item.pkzt].pktz">排考调整
                </el-button>
                <el-button @click="toPage(item,6,'6')" size="small" icon="iconfont icon-el-icon-templatedefault" plain
                           :type="listRwZt[item.pkzt].pkjg?'info':'primary'"
                           :disabled="listRwZt[item.pkzt].pkjg">排考结果
                </el-button>
                <el-button @click="handleMksz(item)" size="small" icon="el-icon-edit" type="primary" plain>
                  免考设置
                </el-button>
              </el-row>
              <el-row style="float:right;">
                <el-button @click="handleUpdate(item)" size="mini" type="primary" icon="el-icon-edit-outline">编辑</el-button>
                <el-button @click="openData(item.jlid)" size="mini" type="success" icon="el-icon-tickets"
                           :disabled="listRwZt[item.pkzt].qy">启用
                </el-button>
                <el-button @click="deleteData(item.jlid)" size="mini" type="danger" icon="el-icon-delete"
                >删除
                </el-button>
              </el-row>
            </div>
            <p></p>
          </el-card>
        </el-col>
      </el-row>
      <el-row v-else ><p style="align-content: center">暂无数据！</p></el-row>
      <!--工具条-->
      <el-col :span="24">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="kswh.query.page" :page-sizes="[4,8,12,16,20]"
                       :page-size="kswh.query.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-col>
      <!--新增界面-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogForm" width="29%" @close="colseDialog">
        <el-form :model="temp" :rules="rules" ref="dataForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="考试名称" prop="ksmc">
            <el-input v-model="temp.ksmc"></el-input>
          </el-form-item>
          <el-form-item label="学年" prop="ksxn">
            <el-select v-model="temp.ksxn">
              <el-option v-for="(item,index) in  xnList" :key="(index+1)" :label="item.xn" :value="item.xn"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学期" prop="ksxq">
            <el-select v-model="temp.ksxq">
              <el-option v-for="(item,index) in  xqList" :key="(index+1)" :label="item.xqmc" :value="item.xq"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试类型" prop="type">
            <el-select v-model="temp.kslx" placeholder="请选择考试类型">
              <el-option v-for="(item,index) in  kslxList" :key="(index+1)" :label="item.lxmc"
                         :value="item.jlid"></el-option>
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
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseDialog">取消</el-button>
          <!--修改-->
          <el-button v-if="dialogStatus=='update'" type="primary" @click="updateSaveData">确认</el-button>
          <!--保存-->
          <el-button v-else type="primary" @click="saveData">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
  import * as api from '@/api/ksgl/kswh/index'
  import { formatDate } from '@/utils'
  import UploadExcelComponent from '@/components/UploadExcel/index'

  export default {
    name: 'uploadExcel',
    components: { UploadExcelComponent },
    data() {
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
        value3: [], // 是否可录入开关
        value4: [], // 是否审核开关
        list: [],
        xxdm: '',
        dqxn: '',
        dqxq: '',
        loading: true,
        dialogForm: false, // 定义新增弹框默认关闭
        pkxzDialogForm: false,
        dialogStatus: '',
        kswh: {
          /** 保存的form表单数据**/
          ksmc: '',
          kslx: '',
          xxdm: this.xxdm,
          pkfs: 1,
          query: {
            page: 1,
            limit: 4
          }
        },
        rwztOptions: ['期中', '期末', '月考'],
        typeOptions: ['常规排课', '单双周', '暑假排课'],
        xnList: [],
        xqList: [],
        kslxList: [],
        temp: {
          /** 保存的form表单数据**/
          jlid: undefined,
          ksmc: '',
          kslx: '',
          tempTime: '',
          kskssj: null,
          ksjssj: null,
          czsj: new Date(),
          yhm: '',
          query: this.query,
          xxdm: this.xxdm,
          ksxn: this.dqxn,
          ksxq: this.dqxq
        },
        textMap: {
          update: '修改考试',
          create: '新建考试'
        },
        tableData: [],
        total: 0,
        rules: {
          /** 表单验证规则**/
          ksmc: [
            { required: true, message: '请输入任务名称', trigger: 'change' },
            { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'change' }],
          kslx: [{ required: true }],
          ksxn: [{ required: true, message: '学年不能为空' }],
          ksxq: [{ required: true, message: '学期不能为空' }],
          tempTime: [{ required: true, message: '请选择日期', trigger: 'change' },
            { validator: validaDate, trigger: 'change' }]
        },
        tempName: '',
        listRwZt: [/** 列表显示的三种状态**/
          { ztmc: '排考中', pksz: false, pktz: true, pkjg: true, qy: true, lspk: true },
          { ztmc: '未启用', pksz: false, pktz: false, pkjg: false, qy: false, lspk: true },
          { ztmc: '已启用', pksz: true, pktz: true, pkjg: false, qy: true, lspk: false }
        ]
      }
    },
    filters: {
      formatDate(time) {
        /** 过滤时间格式**/
        const date = new Date(time);
        return formatDate(date, 'yyyy年MM月dd日');
      },
      xqTostring(v) {
        return v === '01' ? '上学期' : '下学期';
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      api.dqxnxqObj({ xxdm: this.xxdm }).then(response => {
        this.dqxn = response.xn;
        this.dqxq = response.xq;
        this.getKswhList();// 搜索条件
      })
    },
    methods: {
      getKswhList() {
        /** 初始考试类型 **/
        api.getKslxList({ xxdm: this.xxdm }).then(response => {
          this.kslxList = response.data;
        })
        /** 考试维护列表**/
        this.loading = true;
        this.kswh.xxdm = this.xxdm;
        api.getPageList(this.kswh).then(res => {
          this.total = res.data.total;
          this.list = res.data.rows;
          this.list.forEach(item => {
            this.value3.push({ id: item.jlid, lrzt: item.lrzt === 0 }) // 设置录入状态
            this.value4.push({ id: item.jlid, sffs: item.sffs === 0 }) // 设置审核状态
          })
          this.loading = false;
        });
        /** 初始化学年 **/
        api.xnList({ xxdm: this.xxdm }).then(response => {
          this.xnList = response;
        })
        /** 初始化学期 **/
        api.xqList({ xxdm: this.xxdm }).then(response => {
          this.xqList = response;
        })
      },
      toPage(v, index, activeName) {
        /** 跳转排课设置页面**/
        this.$router.push({
          path: '/znpk/top',
          query: {
            ksmc: v.ksmc,
            index, /** 排考模块跳转标识 **/
            ksid: v.jlid,
            ksxn: v.ksxn,
            ksxq: v.ksxq,
            xxdm: this.xxdm,
            activeName /** 排考tab定位标识 **/
          }
        });
      },
      resetTemp() {
        this.temp = {
          /** 保存的form表单数据**/
          jlid: undefined,
          ksmc: '',
          kslx: '',
          tempTime: '',
          kskssj: null,
          ksjssj: null,
          czsj: new Date(),
          yhm: '',
          query: this.query,
          xxdm: this.xxdm,
          ksxn: this.dqxn,
          ksxq: this.dqxq
        }
      },
      handleAdd() {
        /** 打开新增弹框**/
        this.dialogStatus = 'create'
        this.resetTemp();
        this.dialogForm = true;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      saveData() {
        /** 提交数据**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            debugger
            tempData.czsj = +new Date(tempData.czsj);
            tempData.kskssj = +new Date(tempData.tempTime[0]);
            tempData.ksjssj = +new Date(tempData.tempTime[1]);
            api.getAdd(tempData).then(() => {
              this.dialogForm = false;
              this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 })
              this.getKswhList();
            })
          }
        })
      },
      handleUpdate(row) {
        this.dialogStatus = 'update';
        const tempData = Object.assign({}, row);
        this.temp.jlid = tempData.jlid;
        this.temp.ksmc = tempData.ksmc;
        this.temp.kslx = tempData.kslx;
        this.temp.ksxn = tempData.ksxn;
        this.temp.ksxq = tempData.ksxq;
        this.temp.czsj = tempData.czsj;
        /** 转中国标准时间插件需要的格式Tue Sep 19 2017 08:00:00 GMT+0800 (中国标准时间)**/
        this.temp.tempTime = [new Date(tempData.kskssj), new Date(tempData.ksjssj)];
        this.dialogForm = true;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      updateSaveData() {
        /** 修改**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            tempData.kskssj = +new Date(tempData.tempTime[0]);
            tempData.ksjssj = +new Date(tempData.tempTime[1]);
            api.getUpdate(tempData.rwid, tempData).then(() => {
              this.dialogForm = false;
              this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 })
              this.getKswhList();
            })
          }
        })
      },
      deleteData(id) {
        /** 删除**/
        this.$confirm('删除后数据不可恢复，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
          api.getDelete(id).then(() => {
            this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
            this.getKswhList();
          });
        });
      },
      colseDialog() {
        this.dialogForm = false;
      },
      handleSizeChange(val) {
      /** 跳转到某页**/
        this.kswh.query.limit = val;
        this.getKswhList();
      },
      handleCurrentChange(val) {
      /** 跳转到某页**/
        this.kswh.query.page = val;
        this.getKswhList();
      },
      search() {
        this.kswh.query.page = 1;
        this.getKswhList();
      },
      setKslx(v) {
        const e = _.find(this.kslxList, ['jlid', v]);
        return e ? e.lxmc : ''
      },
      setStateValue(v, e, id) {
        const value = { jlid: id }
        if (e === 0) {
          value.lrzt = v ? 0 : 1;
        } else {
          value.sffs = v ? 0 : 1;
        }
        api.getUpdateState(value).then(() => {
          this.$notify({ title: '成功', message: '操作成功', type: 'success', duration: 2000 });
        })
      },
      classColor(v) {
        return 'aa_' + v;
      },
      handleMksz(v) { /** 免考设置 **/
        /** 跳转排课设置页面**/
        this.$router.push({
          path: '/znpk/mksz',
          query: {
            ksmc: v.ksmc,
            ksid: v.jlid,
            dqxn: this.dqxn,
            dqxq: this.dqxq,
            xxdm: this.xxdm
          }
        });
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


