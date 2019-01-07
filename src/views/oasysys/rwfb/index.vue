<!--排课系统首页-->
<template>
  <section class="content-container">
    <div v-loading="loading">
      <el-tabs :tab-position="tabPosition" style="height: 200px;">
        <el-tab-pane label="我发出的">
          <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">创建任务</el-button>
            <el-cascader
              :options="wcztOptions" placeholder="完成状态"
              change-on-select clearable style="width:10%"
            ></el-cascader>
            <el-select v-model="pkrw.rwzt" clearable placeholder="时间排序" style="width:10%">
              <el-option v-for="(item,index) in  sjpxOptions" :key="index" :label="item" :value="index"></el-option>
            </el-select>
            <el-input v-model="pkrw.name" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </div>
          <!--列表-->
          <el-row :gutter="12" style="margin-bottom:6px;cursor:pointer" v-for="(item,index) in list" :key="index">
            <el-col :span="24">
              <el-card shadow="hover" class="list-views">
                <div style="height: 52px;font-size: 12px;">
                  <p>任务标题：{{item.name}}</p>
                  <p>截止时间：2017-10-11</p>
                  <p>紧急程度：
                    <el-button class="rwwczt" :type="typeCd[item.jjcd].label" size="mini" round>{{typeCd[item.jjcd].value}}</el-button>
                  </p>
                </div>
                <p></p>
              </el-card>
              <span :class="rwztStyle[item.rwzt].label">{{rwztStyle[item.rwzt].name}}</span>
            </el-col>
          </el-row>
          <!--工具条-->
          <el-col :span="24">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pkrw.query.page" :page-sizes="[4,8,12,16,20]"
                           :page-size="pkrw.query.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="我负责的">
          <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="handleAdd">创建任务</el-button>
            <el-cascader
              :options="wcztOptions" placeholder="完成状态"
              change-on-select clearable style="width:10%"
            ></el-cascader>
            <el-select v-model="pkrw.rwzt" clearable placeholder="时间排序" style="width:10%">
              <el-option v-for="(item,index) in  sjpxOptions" :key="index" :label="item" :value="index"></el-option>
            </el-select>
            <el-input v-model="pkrw.name" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </div>
          <!--列表-->
          <el-row :gutter="12" style="margin-bottom:6px;cursor:pointer;" v-for="(item,index) in list" :key="index">
            <el-col :span="23">
              <el-card shadow="hover" class="list-views">
                <div style="height: 52px;font-size: 12px;">
                  <p>任务标题：{{item.name}}</p>
                  <p>截止时间：2017-10-11</p>
                  <p>紧急程度：
                    <el-button class="rwwczt" :type="typeCd[item.jjcd].label" size="mini" round>{{typeCd[item.jjcd].value}}</el-button>
                  </p>
                </div>
                <p></p>
              </el-card>
              <span :class="rwztStyle[item.rwzt].label">{{rwztStyle[item.rwzt].name}}</span>
            </el-col>
          </el-row>
          <!--工具条-->
          <el-col :span="24">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pkrw.query.page" :page-sizes="[4,8,12,16,20]"
                           :page-size="pkrw.query.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </el-col>
        </el-tab-pane>
      </el-tabs>
      <!--新增界面-->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogForm" width="35%" @close="colseDialog">
        <el-dialog
          width="30%"
          title="内层 Dialog"
          :visible.sync="innerVisible"
          append-to-body>
        </el-dialog>
        <el-form :model="temp"  ref="dataForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item label="责任人" prop="zrr">
            <el-tag
              size="small"
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button icon="el-icon-plus" @click="showInput" circle size="small"></el-button>
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
          <el-form-item label="紧急程度" prop="type">
            <el-select v-model="temp.type" style="width: 100%;" :disabled="rwDisabled" placeholder="请选择紧急程度">
              <el-option v-for="(item,index) in  jjcdOptions" :key="(index+1)" :label="item"
                         :value="(index+1)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务分类" prop="type">
            <el-select v-model="temp.type" style="width: 100%;" :disabled="rwDisabled" placeholder="请选择紧急程度">
              <el-option v-for="(item,index) in  typeOptions" :key="(index+1)" :label="item"
                         :value="(index+1)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="附件">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="/api/admin/kcxx/sctpS"
              :headers="headers"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="form.fjxxList">
              <el-button size="small" icon="el-icon-upload" circle></el-button>
              <span style="margin-left:415px;">(0/3)</span>
              <!--<el-button size="small" icon="el-icon-upload" plain>添加文件</el-button>-->
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-form-item>
          <el-form-item label="任务内容" prop="ggnr">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows:8}"
              placeholder="请输入内容"
              v-model="temp.rwnr">
            </el-input>
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
    </div>

  </section>
</template>
<script>
  import Cookies from 'js-cookie';
  import { formatDate } from '@/utils'
  export default {
    data() {
      return {
        copyDisabled: false,
        copyLoading: false,
        rwDisabled: false,
        list: [{
          name: '已完成的',
          rwzt: 0,
          jjcd: 0
        }, {
          name: '已过期的',
          rwzt: 1,
          jjcd: 1
        }, {
          name: '进行中的',
          rwzt: 2,
          jjcd: 2
        }, {
          name: '未开始的',
          rwzt: 3,
          jjcd: 2
        }],
        xxdm: window.localStorage.getItem('xxdm'),
        loading: true,
        dialogForm: false, // 定义新增弹框默认关闭
        innerVisible: false,
        dialogStatus: '',
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
        form: {},
        rwztOptions: ['我发出的', '我关注的', '我负责的'],
        wcztOptions: [
          {
            value: '1',
            label: '已完成'
          }, {
            value: '2',
            label: '未完成',
            children: [{
              value: '3',
              label: '已过期'
            }, {
              value: '4',
              label: '进行中'
            }, {
              value: '5',
              label: '未开始'
            }]
          }
        ],
        rwztStyle: [
          { label: 'list-ywc', name: '已完成' },
          { label: 'list-ygq', name: '已过期' },
          { label: 'list-jxz', name: '进行中' },
          { label: 'list-wks', name: '未开始' }
        ],
        sjpxOptions: ['截止时间升序', '截止时间降序', '开始时间升序', '开始时间降序'],
        jjcdOptions: ['一般任务', '紧急任务', '了解任务'],
        typeOptions: ['语文作业', '作文', '书法类'],
        typeCd: [
          { label: 'warning', value: '一般任务' },
          { label: 'danger', value: '紧急任务' },
          { label: 'info', value: '了解任务' }
        ],
        tabPosition: 'top',
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
          xn: this.dqxn,
          rwnr: ''
        },
        textMap: {
          update: '修改任务',
          create: '创建任务',
          copy: '任务信息'
        },
        tableData: [],
        total: 0,
        tempName: '',
        dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: ''
      }
    },
    computed: {
      headers() {
        return { Authorization: Cookies.get('Admin-Token'), ReturnResultCode: true }
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
      this.getPkrwList();// 搜索条件
    },
    methods: {
      getPkrwList() {
        /** 排课任务列表**/
        this.loading = false;
    /*    this.loading = true;
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
        })*/
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
      beforeAvatarUpload(file) {
        console.log(file);
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message.error('上传文件大小不能超过 5MB!');
        }
        return isLt5M;
      },
      handleRemove(file, fileList) {
        this.form.fjxxList = _.remove(this.form.fjxxList, n => n.uid = file.uid);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      handleSuccess(response, file, fileList) {
        if (response.status === 200) {
          const curFile = [];
          fileList.forEach(file => {
            const filename = file.name;
            const fjlx = filename.substring(filename.indexOf('.') + 1, filename.length);
            const curNode = { uid: file.uid, fjymc: file.name, sclj: file.response.data[0].path, fjlx, fjdx: file.size };
            curFile.push(curNode);
          });
          this.form.fjxxList = curFile;
        }
      }, handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      showInput() {
        this.innerVisible = true;
      },

      handleInputConfirm() {
      /*  const inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';*/
      }
    }
  }

</script>

<style scoped>
  .content-container {
    /*padding: 20px;*/
    margin-left: 20px;
  }

  .rwwczt .el-button--mini, .el-button--mini.is-round{
    padding: 4px 12px;
  }
  .content-container .item {
    margin-top: 5px;
  }
  .list-views {
   /* padding-left: 2px;*/
    /* color: #563d7c; */
    text-decoration: none;
    background-color: transparent;
    border-left: 1px solid #563d7c;
  }
  .list-ywc {
    background: #67c23a;
    font: 14px/25px "microsoft yahei";
    color: #fff;
    position: absolute;
    right: 68px;
    top: 0;
    padding: 2px 10px;
  }
  .list-wks {
    background: #c8c9cc;
    font: 14px/25px "microsoft yahei";
    color: #fff;
    position: absolute;
    right: 68px;
    top: 0;
    padding: 2px 10px;
  }
  .list-ygq {
    background: #F56C6C;
    font: 14px/25px "microsoft yahei";
    color: #fff;
    position: absolute;
    right: 68px;
    top: 0;
    padding: 2px 10px;
  }
  .list-jxz {
    background: #E6A23C;
    font: 14px/25px "microsoft yahei";
    color: #fff;
    position: absolute;
    right: 68px;
    top: 0;
    padding: 2px 10px;
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


