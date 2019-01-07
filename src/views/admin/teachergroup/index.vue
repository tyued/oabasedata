<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input placeholder="请输入教师组名称" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
        <el-select v-model="searchsel" @change="searchChange" slot="prepend" placeholder="请选择" style="width:120px; height:38px; margin:0 auto;">
          <el-option label="教师组名称" value="zmc"></el-option>
        </el-select>
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="zdm" label="教师组代码" width="300" align="center"></el-table-column>
      <el-table-column prop="zmc" label="教师组名称" width="300" align="center"></el-table-column>
      <el-table-column align="center" label="操作" width="300" >
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)" >删除</el-button>
          <el-button size="small" type="info" @click="handleAdd(scope.row)" plain>教师添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]"
                     :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="600px" >
      <el-form :model="form" ref="form" :rules="rules" label-width="110px" name="myform">
        <el-form-item label="教师组名称"  prop="zmc">
          <el-input :maxlength="20" v-model="form.zmc" placeholder="请输入教师组名称" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="JszMap[dialogJszStatus]"  :visible.sync="dialogJszFormVisible" width="600px" >
        <el-transfer  filterable :filter-method="filterMethod"
                      :titles="['待选教师', '已选教师']" @change="HandleJszWh"
          filter-placeholder="请输入工号"  v-model="value"  :data="jsData">
        </el-transfer>
    </el-dialog>

  </div>
</template>
<script>
  import { page, addObj, getObj, putObj, delJszxx, getJsAll, getJszJsList, addJszjs } from 'api/admin/teachergroup/index'
  export default {
    data() {
      const yzzmc = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('教师组名称不能为空'));
        }
        if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
          callback(new Error('请输入教师组名称'));
        } else {
          callback();
        }
      };
      return {
        xxdm: '',
        tableKey: 0,
        listLoading: false,
        total: 0,
        list: [],
        form: {},
        listQuery: {              // 分页
          page: 1,
          limit: 10,
          xxdm: ''
        },
        searchsel: 'zmc',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        JszMap: {
          jszwh: '教师组教师维护'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        changeSure: false, // 防止重复提交
        dialogJszFormVisible: false,
        dialogJszStatus: '',
        changeJszSure: false, // 防止重复提交
        jsData: [],  // 为分配教师列表
        value: [],
        currentZdm: '',
        filterMethod(query, item) {
          return item.query.indexOf(query) > -1;
        },
        rules: {
          zmc: [
            { required: true, validator: yzzmc, trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.xxdm = this.xxdm;
        page(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      // 获取教师信息
      getTeacherAll(row) {
        getJszJsList({ xxdm: this.xxdm, zdm: row.zdm }).then(response => {
          const jszxxArr = [];
          for (const o of response) {
            jszxxArr.push(
              o.zgh
            );
          }
          this.value = jszxxArr;
          // 获取所有教师列表
          getJsAll({ xxdm: this.xxdm }).then(response => {
            const jsArr = [];
            const arrStr = JSON.stringify(this.value);
            for (let i = 0; i < response.length; i++) {
              const temp = response[i];
              jsArr.push({
                key: temp.gh,
                label: temp.xm,
                query: temp.xm
              });
            }
            this.jsData = jsArr;
          });
        });
      },
      // 搜索
      handleFilter() {
        if (this.searchsel == 'all') {
          this.listQuery = { page: 1, limit: 10, name: undefined }
        }
        this.getList();
      },
      searchChange(val) {
        this.listQuery = {
          page: 1,
          limit: 10,
          name: undefined
        }
        this.listQuery.xxdm = this.xxdm;
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.form = {};
        this.changeSure = false;
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.changeSure = false;
        getObj({ xxdm: this.xxdm, zdm: row.zdm }).then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getJszJsList({ xxdm: this.xxdm, zdm: row.zdm }).then(response => {
            if (response.length == 0) {
              delJszxx({ zdm: row.zdm, xxdm: this.xxdm }).then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
                this.getList();
              });
            } else {
              this.$notify({ title: '温馨提示', message: '请先删除组下教师,再删除教师组', type: 'warning' });
            }
          });
        });
      },
      cancel() {
        this.dialogFormVisible = false;
      },
      // 新建
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.form.xxdm = this.xxdm;
            addObj(this.form).then(res => {
              if (res.status == '200') {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 });
              } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
              }
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
      // 更新
      update(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.dialogFormVisible = false;
            putObj(this.form).then(res => {
              this.dialogFormVisible = false;
              this.getList();
              if (res.status == '200') {
                this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
              } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
              }
            });
            const that = this;
            setTimeout(() => {
              that.changeSure = false;
            }, 1500);
          } else {
            this.$notify({ title: '失败', message: '类别名称不能为空', type: 'error', duration: 2000 });
            return false;
          }
        });
      },
      // 教师组教师添加
      handleAdd(row) {
        this.changeJszSure = false;
        this.dialogJszStatus = 'jszwh';
        this.dialogJszFormVisible = true;
        this.currentZdm = row.zdm;
        this.getTeacherAll(row);
      },
      // 维护教师组教师
      HandleJszWh(val) {
        addJszjs({ xxdm: this.xxdm, zdm: this.currentZdm, zghArr: val }).then(response => {

        });
      },
      getValue(type, key) {
        const data = this.dictMap[type];
        return _.find(data, { id: key }).text;
      }
    }
  }
</script>
