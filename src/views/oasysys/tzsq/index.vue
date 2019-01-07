<template>
<div class="app-container tzgg">
  <el-row>
    <el-col :span="24">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="openDialog" icon="el-icon-plus">创建公告</el-button>
        </el-form-item>
        <el-form-item label="公告类型">
          <el-select v-model="formInline.gglx" placeholder="请选择公告类型">
            <el-option label="全部" value="0"></el-option>
            <el-option v-for="lx in gglx" :label="lx.label" :value="lx.value" :key="lx.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="formInline.shzt" placeholder="请选择审核状态">
            <el-option label="全部" value="0"></el-option>
            <el-option v-for="zt in shzt" :label="zt.label" :value="zt.value" :key="zt.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入内容" v-model="formInline.ggbt">
            <el-button slot="append" icon="el-icon-search" @click="queryPageList"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" tooltip-effect="dark" border fit highlight-current-row style="width: 100%">
        <el-table-column label="标题">
          <template slot-scope="scope">{{ scope.row.ggbt }}</template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">{{ scope.row.gglx }}</template>
        </el-table-column>
        <el-table-column label="申请人">
          <template slot-scope="scope">{{ scope.row.sqrmc }}</template>
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">{{ scope.row.ggnr }}</template>
        </el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="scope">{{ scope.row.sqsj }}</template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" round @click="hanldClick(scope.row.slid)">{{scope.row.shzt}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button  type="text" @click="handleDelete(scope.row.jlid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="formInline.query.page" :page-sizes="[10,20,30,50]" :page-size="formInline.query.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </el-col>
  </el-row>
  <el-dialog title="公告创建" :visible.sync="dialogFormVisible" style="width: 80%;">
    <el-form :model="form" label-width="80px" ref="ruleForm" :rules="rules">
      <el-form-item label="公告标题" prop="ggbt">
        <el-input v-model="form.ggbt"></el-input>
      </el-form-item>
      <el-form-item label="公告类型" prop="gglx">
        <el-select v-model="form.gglx" placeholder="请选择类型">
          <el-option v-for="lx in gglx" :label="lx.label" :value="lx.value" :key="lx.value"></el-option>
        </el-select>
        <el-input v-show="false" v-model="form.gglxmc"></el-input>
      </el-form-item>
      <el-form-item label="是否审批">
        <el-switch @change="getspmb"
          v-model="form.sfsp"
          active-color="#13ce66"
          inactive-color="#B6BCC2"
          active-value="1"
          inactive-value="0">
        </el-switch>
        <el-input v-show="false" v-model="form.mbid"></el-input>
      </el-form-item>
      <el-form-item label="公告内容" prop="ggnr">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows:8}"
          placeholder="请输入内容"
          v-model="form.ggnr">
        </el-input>
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
          <el-button size="small" icon="el-icon-upload" type="primary">点击上传</el-button>
         <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>

  <page-splimx ref="pageSplimx"></page-splimx>
</div>
</template>
<script>
import Cookies from 'js-cookie';
import * as api from '@/api/oasysys/tzsq/index';
import pageSplimx from '@/components/shmb/spmx';
export default {
  name: 'tzsq',
  components: { pageSplimx },
  data() {
    return {
      xxdm: '',
      activeName: 'first',
      formInline: {
        gglx: '0',
        shzt: '0',
        ggbt: '',
        query: { page: 1, limit: 12 }
      },
      tableData: [],
      form: {},
      dialogFormVisible: false,
      listLoading: true,
      total: 0,
      shzt: [{
        value: 5,
        label: '无需审核'
      }, {
        value: 1,
        label: '审批中'
      }, {
        value: 2,
        label: '撤销'
      }, {
        value: 3,
        label: '通过'
      }, {
        value: 4,
        label: '未通过'
      }],
      gglx: [{
        value: 1,
        label: '公告'
      }, {
        value: 2,
        label: '聘任'
      }, {
        value: 3,
        label: '制度'
      }],
      rules: {
        ggbt: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        gglx: [
          { required: true, message: '请选择公告类型', trigger: 'change' }
        ],
        ggnr: [
          { required: true, message: '请输入公告内容', trigger: 'blur' },
          { min: 10, max: 1000, message: '长度在 10 到 300 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.xxdm = window.localStorage.getItem('xxdm');
    this.queryPageList();// 搜索条件
  },
  computed: {
    headers() {
      return { Authorization: Cookies.get('Admin-Token'), ReturnResultCode: true }
    }
  },
  methods: {
    queryPageList() { // 列表查询
      this.formInline.xxdm = this.xxdm;
      api.queryPageList(this.formInline).then(res => {
        const data = res.data.rows;
        data.forEach(da => {
          const lx = _.find(this.gglx, ['value', da.gglx]);
          da.gglx = lx.label;
          const zt = _.find(this.shzt, ['value', da.shzt]);
          da.shzt = zt.label;
        })
        this.tableData = data;
        this.total = res.data.total;
        this.listLoading = false;
      })
    },
    // 分页
    handleSizeChange(val) {
      this.formInline.query.limit = val;
      this.queryPageList();
    },
    handleCurrentChange(val) {
      this.formInline.query.page = val;
      this.queryPageList();
    },
    beforeAvatarUpload(file) {
      console.log(file);
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!');
      }
      return isLt5M;
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          const lx = _.find(this.gglx, ['value', this.form.gglx]);
          this.form.gglxmc = lx.label;
          api.save(this.form).then(res => {
            if (res.status === 200) {
              this.queryPageList();
              this.$notify({ title: '成功', message: '保存成功', type: 'success', duration: 2000 });
            } else {
              this.$notify({ title: '失败', message: res.getMessage(), type: 'error', duration: 2000 });
              console.error(res.getMessage());
            }
          })
        } else {
          return false;
        }
      });
    },
    openDialog() {
      this.dialogFormVisible = true;
      this.$refs.ruleForm.resetFields();
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
          const curNode = { uid: file.uid, fjymc: file.name, sclj: file.response.data[0].path, fjlx, fjdx: file.size, xxdm: this.xxdm };
          curFile.push(curNode);
        });
        this.form.fjxxList = curFile;
      }
    },
    getspmb() {
      if (this.form.sfsp == 1) {
        api.validateLcmb({ xxdm: this.xxdm }).then(res => {
          if (res.status == 200 && res.data != '') {
            this.form.mbid = res.data;
          } else {
            this.$message.warning('请先设置-公文申请-审批模板');
            this.form.sfsp = 0;
          }
        })
      }
    },
    // 删除
    handleDelete(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deletegg(id).then(res => {
          if (res.status === 200) {
            this.$notify({ title: '成功', message: '删除成功', type: 'success', duration: 2000 });
            this.queryPageList();
          } else {
            this.$notify({ title: '失败', message: '删除失败', type: 'warning', duration: 2000 });
            console.error(res.message);
          }
        });
      })
    },
    hanldClick(slid) {
      console.log(slid);
      if (slid) {
        this.$nextTick(() => {
          this.$refs.pageSplimx.init(slid);
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/oasysys.scss";
.tzgg .el-badge__content.is-dot {
  margin-top: 10px
}
</style>
