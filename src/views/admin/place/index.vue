<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select" style="width: 400px;">
        <el-select v-model="searchsel" slot="prepend" placeholder="请选择" @change="searchChange" style="width:120px; height:38px; margin:0 auto;">
          <el-option label="全部" value="all"></el-option>
          <el-option label="场地名称" value="cdmc"></el-option>
          <el-option label="场地简称" value="cdjc"></el-option>
          <el-option label="场地地址" value="cddz"></el-option>
          <el-option label="场地用途" value="cdyt"></el-option>
          <el-option label="可容纳人数" value="ksrns"></el-option>
        </el-select>
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="场地名称">
        <template slot-scope="scope">
          <span>{{scope.row.cdmc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="场地简称">
        <template slot-scope="scope">
          <span>{{scope.row.cdjc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="可容纳人数">
        <template slot-scope="scope">
          <span>{{scope.row.ksrns}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="场地地址">
        <template slot-scope="scope">
          <span>{{scope.row.cddz}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="场地用途">
        <template slot-scope="scope">
          <span>{{scope.row.cdyt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" ref="form" :rules="rules" label-width="110px">
        <el-row :gutter="18">
          <el-col :span="12">
            <el-form-item label="场地名称" prop="cdmc">
              <el-input :maxlength="10" v-model="form.cdmc" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场地简称" prop="cdjc">
              <el-input :maxlength="10" v-model="form.cdjc" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址">
          <el-input :maxlength="20" v-model="form.cddz" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="可容纳人数"  prop="ksrns"  :rules="[{ required: true, message: '可容纳人数不能为空'}]">
          <el-input-number size="small" :min="1" :max="999" v-model="form.ksrns"></el-input-number>
        </el-form-item>
        <el-form-item label="用途">
          <el-checkbox-group v-model="formsel_jcdyt">
            <el-checkbox v-for="item in purpose" :key="item.id" :label="item.text">{{item.text}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" prop="bz">
          <el-input  :maxlength="50" type="textarea" v-model="form.bz" placeholder="不超过50个字"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import { page, getObj, addObj, putObj, delObj, fuzzyQuery } from 'api/admin/place/index';
import { mapGetters } from 'vuex';
export default {
  name: 'place',
  data() {
    const yzcdmc = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('场地名称不能为空'));
      }
      if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
        callback(new Error('请输入场地名称'));
      } else {
        callback();
      }
    };
    const yzcdjc = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('场地简称不能为空'));
      }
      if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
        callback(new Error('请输入场地简称'));
      } else {
        callback();
      }
    };
    return {
      xxdm: '',
      listLoading: true, // 加载
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      searchsel: 'all', // 查询条件                    //判断点击弹层是creat（添加）还是update（编辑）

      tableKey: 0, // 表格
      list: null,
      total: null,
      purpose: [], // 场地用途
      formsel_jcdyt: [],

      dialogFormVisible: false, // 弹层是否显示
      dialogStatus: '',
      textMap: {
        // 判断弹层是添加还是编辑
        update: '编辑',
        create: '创建'
      },
      tabPosition: 'left',
      form: {}, // 表单

      changeSure: false, // 防止重复提交
      rules: {
        cdmc: [
          { required: true, validator: yzcdmc, trigger: 'blur' }
        ],
        cdjc: [
          { required: true, validator: yzcdjc, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['dict'])
  },
  created() {
    this.xxdm = window.localStorage.getItem('xxdm');
    this.listQuery.xxdm = this.xxdm;
    this.purpose = this.$store.getters.dict_cdyt; // 场地用途
    this.getList();
  },
  watch: {
    dict() {
      this.purpose = this.$store.getters.dict_cdyt; // 场地用途
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.xxdm = this.xxdm;
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    fuzzyQuery() {
      this.listLoading = true;
      this.listQuery.xxdm = this.xxdm;
      fuzzyQuery(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    // 搜索
    handleFilter() {
      if (this.searchsel === 'all') {
        this.listQuery = { page: 1, limit: 20, cdmc: this.listQuery[this.searchsel], cdjc: this.listQuery[this.searchsel],
          cddz: this.listQuery[this.searchsel], cdyt: this.listQuery[this.searchsel], ksrns: this.listQuery[this.searchsel] };
        this.fuzzyQuery();
        return;
      }
      this.getList();
    },
    searchChange() {
      this.listQuery = {
        page: 1,
        limit: 20,
        xxdm: this.xxdm,
        name: undefined
      };
    },
    // 分页
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    // 添加
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    resetTemp() {
      this.form = {};
      this.formsel_jcdyt = [];
      this.changeSure = false;
    },
    // 编辑
    handleUpdate(row) {
      this.changeSure = false;
      getObj(row.uuid).then(response => {
        this.form = response.data;
        this.judgecdty(this.form.cdyt);
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
      });
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.uuid).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 取消按钮
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    // 添加页面
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeSure = true;
          this.form.cdyt = '';
          this.form.xxdm = this.xxdm;
          if (this.formsel_jcdyt.length > 0) { this.form.cdyt = this.formsel_jcdyt.join(); }
          this.form.xxdm = window.localStorage.getItem('xxdm');
          addObj(this.form).then(res => {
            if (res.status === 200) {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            } else {
              this.$notify({
                title: '失败',
                message: res.message,
                type: 'error',
                duration: 2000
              });
            }
          });

          const that = this;
          setTimeout(() => {
            that.changeSure = false;
          }, 1500);
        } else {
          this.$notify({
            title: '失败',
            message: '还有未填项',
            type: 'error',
            duration: 2000
          });
          return false;
        }
      });
    },
    // 编辑页面
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeSure = true;
          this.dialogFormVisible = false;
          this.form.cdyt = '';
          if (this.formsel_jcdyt.length > 0) { this.form.cdyt = this.formsel_jcdyt.join(); }
          putObj(this.form.uuid, this.form).then(res => {
            if (res.status === 200) {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            } else {
              this.$notify({
                title: '失败',
                message: res.message,
                type: 'error',
                duration: 2000
              });
            }
          });
          const that = this;
          setTimeout(() => {
            that.changeSure = false;
          }, 1500);
        } else {
          this.$notify({
            title: '失败',
            message: '还有未填项',
            type: 'error',
            duration: 2000
          });
          return false;
        }
      });
    },
    // 场地用途
    judgecdty(val) {
      if (val) {
        const str = val.split(',');
        this.formsel_jcdyt = str;
      }
      return this.formsel_jcdyt;
    }
  }
};
</script>
<style scoped>
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
</style>
