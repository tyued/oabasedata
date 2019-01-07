<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名" v-model="listQuery.name"> </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="序号" width="65" type="index"> </el-table-column>
    <el-table-column align="center" label="姓名"> <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
      </template> </el-table-column>
    <el-table-column align="center" label="账户"> <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template> </el-table-column>
    <el-table-column width="80" align="center" label="性别"> <template slot-scope="scope">
            <span>{{scope.row.sex == 1? '男': '女'}}</span>
          </template> </el-table-column>
    <el-table-column align="center" label="备注"> <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template> </el-table-column>
    <el-table-column align="center" label="操作" width="150"> <template slot-scope="scope">
        <el-button  size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button  size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
  </el-table>

  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <el-dialog  :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="姓名" prop="name">
        <el-input :maxlength="20" v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="账户" prop="username">
        <el-input v-if="dialogStatus == 'create'" :maxlength="20"  v-model="form.username" placeholder="请输入账户" readonly onfocus="this.removeAttribute('readonly');"></el-input>
        <el-input v-else :maxlength="20" v-model="form.username" placeholder="请输入账户" readonly></el-input>
      </el-form-item>
      <el-form-item label="密码" placeholder="请输入密码" prop="password">
        <el-input type="password" :maxlength="20" v-model="form.password" readonly onfocus="this.removeAttribute('readonly');"></el-input>
      </el-form-item>
      <el-form-item label="性别" style="width:200px">
        <el-select class="filter-item" v-model="form.sex" placeholder="请选择">
          <el-option v-for="item in  sexOptions" :key="item.code" :label="item.name" :value="item.code"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="学校" v-if="lguserType==1">
        <el-select v-model="form.xxdm" placeholder="请选择" @change="selschChange">
          <el-option v-for="item in dictionary.school" :key="item.xxdm" :label="item.xxmc" :value="item.xxdm"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="角色关联">
        <el-cascader :options="form_js" v-model="form.ssjs" :props="form_props_bm" change-on-select></el-cascader>
      </el-form-item>
      <el-form-item label="职工号" v-if="form.type==3">
        <el-input v-model="form.usercode" disabled></el-input>
      </el-form-item>
      <el-form-item label="学号" v-if="form.type==4">
        <el-input v-model="form.usercode" disabled></el-input>
      </el-form-item>

      <el-form-item label="描述">
        <el-input type="textarea" :maxlength="50" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="form.description"> </el-input>
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
  userAllpage, userpage,
  addObj,
  getObj,
  delObj,
  putObj
} from 'api/admin/user/index';
import { fetchTree } from 'api/admin/group/index';
import { getSchool } from 'api/admin/school/index';
import { getCampus } from 'api/admin/campus/index';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  data() {
    const yzname = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('姓名不能为空'));
      }
      if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
        callback(new Error('请输入姓名'));
      } else {
        callback();
      }
    };
    const yzusername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账户不能为空'));
      }
      if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
        callback(new Error('请输入账户'));
      } else {
        callback();
      }
    };
    return {
      xxdm: '',
      lguserType: '',                  // 登陆用户类型
      form: {
        username: undefined,
        usernameTmp: undefined,
        name: undefined,
        sex: '1',
        password: undefined,
        passwordTmp: undefined,
        description: undefined
      },
      rules: {
        name: [
          { required: true, validator: yzname, trigger: 'blur' }
        ],
        username: [
          { required: true, validator: yzusername, trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 20,
            message: '长度在 5 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      sexOptions: [{ code:'1', name:'男'},{code:'2',name:'女'}],
      dialogFormVisible: false,
      dialogStatus: '',
      userManager_btn_edit: false,
      userManager_btn_del: false,
      userManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,

      dictionary: [],                // 所在部门
      form_js: [],                   // 角色
      js_listQuery: {                         // 角色
        groupType: 1,
        name: undefined
      },
      form_props_bm: {                         // 所属校区下的所在部门
        value: 'id',
        label: 'label',
        children: 'children'
      },

      changeSure: false                       // 防止重复提交
    }
  },
  created() {
    this.xxdm = window.localStorage.getItem('xxdm');
    this.lguserType = window.localStorage.getItem('lguserType');
    this.listQuery.xxdm = this.xxdm;
    this.getList();
    this.userManager_btn_edit = this.elements['userManager:btn_edit'];
    this.userManager_btn_del = this.elements['userManager:btn_del'];
    this.userManager_btn_add = this.elements['userManager:btn_add'];
    this.getDictionary(this.xxdm);
    if (this.lguserType == 1) {
      this.getSchooljson();
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true;
      userpage(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
    handleFilter() {
      this.getList();
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
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      this.changeSure = false;
      getObj(row.id).then(response => {
        this.form = response.data;
        if (this.lguserType == 1 && this.form.xxdm) {
          this.getDictionary(this.form.xxdm)
        }
        this.form.password = '******'
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
        delObj(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            });
      });
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
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
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.changeSure = true;
          this.dialogFormVisible = false;
          if (this.lguserType == 1) {
            this.form.xxdm = this.form.xxdm
          } else {
            this.form.xxdm = this.xxdm;
          }
          putObj(this.form.id, this.form).then(res => {
            if (res.status == '200') {
              this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 1000 });
              this.dialogFormVisible = false;
              this.getList();
            } else {
              this.$notify({ title: '失败', message: res.message, type: 'error', duration: 1000 });
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
    resetTemp() {
      this.form = {
        username: '',
        name: undefined,
        sex: '1',
        password: '',
        description: undefined
      };
      this.changeSure = false;
    },
    getDictionary(val) {
      this.js_listQuery.xxdm = val;
      fetchTree(this.js_listQuery).then(data => {
        if (this.lguserType == 2) {
          this.form_js = _.remove(data, { name: '校管理员' })
        } if (this.lguserType == 1 && !this.form.xxdm) {
          this.form_js = [];
        } else {
          this.form_js = data;
        }
      });
    },
    getSchooljson() {
      getSchool().then(data => {
        this.dictionary.school = data;
      })
    },
    selschChange(val) {
      this.getDictionary(val)
    }
  }
}
</script>
