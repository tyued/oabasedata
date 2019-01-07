<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]"
                class="input-with-select" style="width: 400px;">
        <el-select v-model="searchsel" slot="prepend" @change="searchChange" placeholder="请选择"
                   style="width:120px; height:38px; margin:0 auto;">
          <!--<el-option label="全部" value="all"></el-option>-->
          <el-option label="班级名称" value="bj"></el-option>
        </el-select>
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="班级名称">
        <template slot-scope="scope">
          <span>{{scope.row.bj}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属年级">
        <template slot-scope="scope">
          <span>{{scope.row.njmc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="建班学年">
        <template slot-scope="scope">
          <span>{{scope.row.jbny}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="班级类型">
        <template slot-scope="scope">
          <span>{{jug_bjlxm(scope.row.bjlxm)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="学生数">
        <template slot-scope="scope">
          <span>{{scope.row.bjrs}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="班主任">
        <template slot-scope="scope">
          <span>{{scope.row.bzr}}</span>
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
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="所属年级" prop="njdm" :rules="[{ required: true, message: '所属年级不能为空'}]">
              <el-select @change="changeValue" v-model="form.njdm" placeholder="请选择">
                <el-option v-for="item in gradelist" :key="item.njdm" :label="item.njmc" :value="item.njdm"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级名称" prop="bj">
              <el-input :maxlength="20" v-model="form.bj" placeholder="">
                <template slot="prepend">{{niji}}</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="建班学年" prop="jbny" :rules="[{ required: true, message: '建班学年不能为空'}]">
              <el-select v-model="form.jbny" placeholder="请选择">
                <el-option v-for="item in acadyearlist" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级类型">
              <el-select v-model="form.bjlxm" placeholder="请选择">
                <el-option v-for="item in bjkind" :key="item.id" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="班主任">
          <el-select v-model="form.bzrgh" placeholder="请选择">
            <el-option v-for="item in teacherKind" :key="item.gh" :label="item.xm" :value="item.gh"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :maxlength="200" v-model="form.bz" placeholder="不超过200个字"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定
        </el-button>
        <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
  import {
    classBjpage,
    getObj,
    putObj,
    addObj,
    delObj
  } from 'api/admin/class/index'
  import { gradepage } from 'api/admin/grade/index'
  import { dqxnxqObj, page } from 'api/admin/acadyear/index'
  import { teacherpage } from 'api/admin/teach/index'
  import { mapGetters } from 'vuex';

  export default {
    name: 'class',
    data() {
      const yzbj = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('班级名称不能为空'));
        }
        if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
          callback(new Error('请输入班级名称'));
        } else {
          callback();
        }
      };
      return {
        niji: '',
        xxdm: '',
        dqxn: '',            // 当前学年

        listLoading: true,                      // 加载
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        searchsel: 'bj',                           // 查询条件                    //判断点击弹层是creat（添加）还是update（编辑）

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
        all_listQuery: {
          page: 1,
          limit: 20,
          xxdm: this.xxdm,
          name: undefined
        },
        gradelist: [],                           // 年级
        acadyearlist: [],                        // 学年
        bjkind: [
          {
            id: '001',
            text: '普通班',
            parentId: '',
            type: 'bjlx'
          },
          {
            id: '002',
            text: '实验班',
            parentId: '',
            type: 'bjlx'
          },
          {
            id: '003',
            text: '临时班',
            parentId: '',
            type: 'bjlx'
          }
        ],                              // 班级类型
        teacherKind: [],                         // 老师
        dictionary: [],

        changeSure: false,                       // 防止重复提交
        rules: {
          bj: [
            { required: true, validator: yzbj, trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      this.dictionary.gwzw = this.$store.getters.dict_gwzw;       // 岗位职务
      dqxnxqObj({ xxdm: this.xxdm }).then(response => {
        this.dqxn = response.data.xn;
        this.getList();
      })

      this.getMessage();
    },
    computed: {
      ...mapGetters([
        'dict'
      ])
    },
    watch: {
      dict() {
        this.dictionary.gwzw = this.$store.getters.dict_gwzw;       // 岗位职务
      }
    },
    methods: {
      changeValue(value) {
        this.gradelist.forEach(item => {
          if (item.njdm == value) this.niji = item.njmc;
        })
      },
      getList(val) {
        this.listLoading = true;
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.jbny = this.dqxn;
        classBjpage(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      // 班级类型码
      jug_bjlxm(val) {
        if (val) {
          if (_.find(this.bjkind, { id: val })) {
            return _.find(this.bjkind, { id: val }).text;
          } else return '';
        } else return '';
      },
      getMessage() {
        this.all_listQuery.xxdm = this.xxdm;
        gradepage(this.all_listQuery).then(response => {
          this.gradelist = response.data.rows;
        })
        page(this.all_listQuery).then(response => {
          const year = response.data.rows;
          const rxxn = [];
          for (let i = 0; i < year.length; i++) {
            rxxn[i] = year[i].xn
          }
          this.acadyearlist = _.uniq(rxxn)
        })
        teacherpage(this.all_listQuery).then(response => {
          const teachall = response.data.rows;
          for (let i = 0; i < teachall.length; i++) {
            // if(teachall[i].gwzym=="20,23"){
            this.teacherKind.push(teachall[i]);
            // }
          }
        })
      },
      // 搜索
      handleFilter() {
        if (this.searchsel == 'all') {
          this.listQuery = { page: 1, limit: 20, name: undefined }
        }
        this.getList();
      },
      searchChange(val) {
        this.listQuery = {
          page: 1,
          limit: 20,
          xxdm: this.xxdm,
          name: undefined
        }
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
        this.niji = '';
      },
      // 编辑
      handleUpdate(row) {
        this.changeSure = false;
        getObj(row.uuid).then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
          this.changeValue(this.form.njdm);
        });
      },
      // 删除
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
        }).catch(e => {
          // console.log(e)
        });
      },
      // 取消按钮
      cancel(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
      },
      // 编辑页面
      update(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.form.xxdm = this.xxdm;
            putObj(this.form.uuid, this.form).then(res => {
              this.dialogFormVisible = false;
              this.getList();
              if (res.status == '200') {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 });
              } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
              }
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
      },
      // 添加页面
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
      }

    }
  }
</script>
<style scoped>
  .filter-container .filter-item {
    vertical-align: inherit;
  }

  .el-input-group__append, .el-input-group__prepend {
    padding: 0 10px;
  }

  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }

  .el-checkbox {
    margin-right: 30px;
  }
</style>
