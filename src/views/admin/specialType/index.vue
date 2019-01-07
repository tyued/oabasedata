<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
        <el-select v-model="searchsel" slot="prepend" placeholder="请选择" @change="searchChange" style="width:120px; height:38px; margin:0 auto;">
          <el-option label="特长生类型" value="lxmc"></el-option>
        </el-select>
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="特长生类型">
        <template slot-scope="scope">
          <span>{{scope.row.lxmc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否已使用">
        <template slot-scope="scope">
          <span>{{scope.row.sfsy}}</span>
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
    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="600px" >
      <el-form :model="form" ref="form" :rules="rules" label-width="110px">
        <el-form-item  prop="lxmc" label="特长生类型">
          <el-input v-model="form.lxmc" placeholder="" maxlength="40"></el-input>
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
  import {
    page,
    getObj,
    addObj,
    putObj,
    delObj
  } from 'api/admin/specialType/index'
  export default {
    name: 'specialType',
    data() {
      const yzlxmc = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('特长生类型名称不能为空'));
        }
        if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
          callback(new Error('请输入特长生类型名称'));
        } else {
          callback();
        }
      };
      return {
        xxdm: '',
        listLoading: true,                      // 加载
        listQuery: {
          page: 1,
          limit: 20,
          xxdm: '',
          name: undefined
        },
        searchsel: 'lxmc',                           // 查询条件                    //判断点击弹层是creat（添加）还是update（编辑）

        tableKey: 0,                            // 表格
        list: null,
        total: null,

        dialogFormVisible: false,               // 弹层是否显示
        dialogStatus: '',
        textMap: {                              // 判断弹层是添加还是编辑
          update: '编辑',
          create: '创建'
        },
        tabPosition: 'left',
        form: {},                                // 表单

        changeSure: false,                       // 防止重复提交
        rules: {
          lxmc: [
            { required: true, validator: yzlxmc, trigger: 'blur' }
          ] }
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      this.getList()
    },
    watch: {

    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      // 搜索
      handleFilter() {
        if (this.searchsel === 'all') {
          this.listQuery = { page: 1, limit: 20, name: undefined }
          this.listQuery.xxdm = this.xxdm;
        }
        this.getList();
      },
      searchChange() {
        this.listQuery = {
          page: 1,
          limit: 20,
          name: undefined
        }
        this.listQuery.xxdm = this.xxdm;
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
        this.changeSure = false;
      },
      // 编辑
      handleUpdate(row) {
        this.changeSure = false;
        getObj(row.lxid).then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
      },
      // 删除
      handleDelete(row) {
        if (row.sfsy === '已使用') {
          this.$message('已使用的特长生类型不可删除');
          return false;
        }
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.lxid).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
          });
        }).catch(e => {
          // console.log(e)
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
            this.form.xxdm = window.localStorage.getItem('xxdm');
            addObj(this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            })

            const that = this;
            setTimeout(() => {
              that.changeSure = false;
            }, 1500);
          } else {
            this.$notify({ title: '失败', message: '还有未填项', type: 'error', duration: 2000 });
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
            putObj(this.form.lxid, this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            });
            const that = this;
            setTimeout(() => {
              that.changeSure = false;
            }, 1500);
          } else {
            this.$notify({ title: '失败', message: '还有未填项', type: 'error', duration: 2000 });
            return false;
          }
        });
      }
    }
  }
</script>
<style scoped>
  .filter-container .filter-item{ vertical-align: inherit;}
  .el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
  .el-checkbox+.el-checkbox{margin-left: 0;}
  .el-checkbox{ margin-right: 30px;}

  .line{ text-align: center;}
</style>
