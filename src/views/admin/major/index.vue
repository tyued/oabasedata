<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input placeholder="请选择搜索条件" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
        <el-select v-model="searchsel" @change="searchChange" slot="prepend" style="width:120px; height:38px; margin:0 auto;">
          <el-option label="全部" value="all"></el-option>
          <el-option label="专业名称" value="zymc"></el-option>
          <el-option label="专业代码" value="zydm"></el-option>
        </el-select>
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate('form')" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="zydm" label="专业代码"  align="center"></el-table-column>
      <el-table-column prop="zymc" label="专业名称"  align="center"></el-table-column>
      <el-table-column align="center" label="操作"  >
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="small" type="info" @click="handleUpdateCourse(scope.row)">课程维护</el-button>
          <el-button size="small" type="info" @click="handleUpdateClass(scope.row)">班级维护</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px" >
      <el-form :model="form" ref="form" :rules="rules" label-width="110px">
        <el-form-item label="专业代码" prop="zydm">
          <el-input :maxlength="20" v-model="form.zydm" placeholder="请输入专业代码"></el-input>
        </el-form-item>
        <el-form-item label="专业名称"  prop="zymc">
          <el-input :maxlength="20" v-model="form.zymc" placeholder="请输入专业名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="create('form')" :disabled="changeSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible1" width="600px" >
      <el-form :model="form" ref="form" :rules="rules" label-width="110px">
        <el-form-item label="专业名称" prop="zymc">
          <el-input :maxlength="20" v-model="form.zymc" placeholder="请输入专业名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible2" width="600px" >
      <el-transfer  filterable :filter-method="filterMethod"
                    :titles="['可选课程', '已选课程']" @change="HandleZykcwh"
                    filter-placeholder="请输入课程名" v-model="kcidArr" :data="kcArr">
      </el-transfer>
    </el-dialog>
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible3" width="600px" >
      <el-transfer  filterable :filter-method="filterMethod"
                    :titles="['可选班级', '已选班级']" @change="HandleZyBjwh"
                    filter-placeholder="请输入班级名" v-model="bjidArr" :data="bjArr">
      </el-transfer>
    </el-dialog>
  </div>
</template>
<script>
  import { page, add, del, get, update, getCourseList, updateZykcgx, getClassList, updateZybjgx, fuzzyQuery } from 'api/admin/major/index'
  import jcsj from '@/api/jcsj';
  import { dqxnxqObj } from 'api/admin/acadyear/index';
  export default {
    data() {
      const yzzydm = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('专业代码不能为空'));
        }
        if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
          callback(new Error('请输入专业代码'));
        } else {
          callback();
        }
      };
      const yzzymc = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('专业名称不能为空'));
        }
        if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
          callback(new Error('请输入专业名称'));
        } else {
          callback();
        }
      };
      return {
        xxdm: '',
        dqxn: '',
        tableKey: 0,
        listLoading: false,
        total: 0,
        list: [],
        form: {},
        listQuery: {
          page: 1,
          limit: 10,
          xxdm: ''
        },
        searchsel: 'all',
        titleMap: {
          update: '编辑',
          create: '新增',
          zykcwh: '专业-课程维护',
          zybjwh: '专业-班级维护'
        },
        currentZydm: '',
        dialogStatus: '',
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        changeSure: false, // 防止重复提交
        kcArr: [],  // 待选课程数组
        bjArr: [], // 待选班级数组
        kcidArr: [], // 专业关联的课程代码数组
        bjidArr: [], // 专业关联的班级代码数组
        excludeArr: [],
        filterMethod(query, item) {
          return item.query.indexOf(query) > -1;
        },
        rules: {
          zydm: [
            { required: true, validator: yzzydm, trigger: 'blur' }
          ],
          zymc: [
            { required: true, validator: yzzymc, trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      this.getList();
    },
    mounted() {
      dqxnxqObj({ xxdm: this.xxdm }).then(res => {
        this.dqxn = res.data.xn;
      });
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.xxdm = this.xxdm;
        page(this.listQuery).then(response => {
          // 按专业代码排序
          this.list = _.sortBy(response.data.rows, item => item.zydm);
          this.total = response.data.total;
          this.listLoading = false;
        });
      },
      fuzzyQuery(){
        this.listLoading = true;
        this.listQuery.xxdm = this.xxdm;
        fuzzyQuery(this.listQuery).then(response => {
          // 按专业代码排序
          this.list = _.sortBy(response.data.rows, item => item.zydm);
          this.total = response.data.total;
          this.listLoading = false;
        });
      },
      getCourse(row) {
        this.kcidArr = [];
        // 获取专业已选课程列表
        getCourseList({ xxdm: this.xxdm, zydm: row.zydm }).then(res => {
          if (res.length > 0) {
            const kcidArr = [];
            for (const obj of res) {
              kcidArr.push(obj.kcid);
            }
            this.kcidArr = kcidArr;
          }
          // 获取所有课程列表
          jcsj.hqkclb({ xxdm: this.xxdm }).then(res => {
            const kcArr = [];
            for (let i = 0; i < res.length; i++) {
              const temp = res[i];
              kcArr.push({
                key: temp.uuid,
                label: temp.kcmc,
                query: temp.kcmc
              });
            }
            this.kcArr = kcArr;
          });
        });
      },
      getClass(row) {
        this.bjidArr = [];
        // 获取专业已选班级列表
        getClassList({ xxdm: this.xxdm, xn: this.dqxn }).then(res => {
          if (res.length > 0) {
            // 过滤并保存属于其他专业的班级
            this.excludeArr = _.remove(res, item => item.zydm !== row.zydm);
            const bjidArr = [];
            for (const obj of res) {
              bjidArr.push(obj.bjid);
            }
            this.bjidArr = bjidArr;
          }
          // 获取所有班级列表
          jcsj.hqbjlb({ xxdm: this.xxdm, xn: this.dqxn }).then(res => {
            // 排序
            res = jcsj.sortObjectByStr(res, 'bj');
            res = _.sortBy(res, item => item.njdm);
            // 过滤属于其他专业的班级
            _.pullAllWith(res, this.excludeArr, (arr1, arr2) => arr1.uuid === arr2.bjid);
            const bjArr = [];
            for (let i = 0; i < res.length; i++) {
              const temp = res[i];
              bjArr.push({
                key: temp.uuid,
                label: temp.bj,
                query: temp.bj
              });
            }
            this.bjArr = bjArr;
          });
        });
      },
      // 搜索
      handleFilter() {
        if (this.searchsel === 'all') {
          this.listQuery = { page: 1, limit: 10, zymc: this.listQuery[this.searchsel], zydm: this.listQuery[this.searchsel]};
          this.fuzzyQuery();
          return;
        }
        this.getList();
      },
      searchChange() {
        this.listQuery = {
          page: 1,
          limit: 10,
          name: undefined
        };
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
      handleCreate(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
        this.form = {};
        this.changeSure = false;
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.changeSure = false;
        get(row.uuid).then(response => {
          this.form = response.data;
          this.dialogFormVisible1 = true;
          this.dialogStatus = 'update';
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row.zydm);
          del({ zydm: row.zydm }).then(res => {
            if (res.status === 200) {
              this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
            } else {
              this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
            }
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
            this.getList();
          });
        });
      },
      cancel(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
      },
      // 新建
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.form.xxdm = this.xxdm;
            add(this.form).then(res => {
              if (res.status === 200) {
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
            this.$notify({ title: '失败', message: '请填写完整', type: 'error', duration: 2000 });
            return false;
          }
        });
      },
      // 更新
      update(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            update(this.form).then(res => {
              if (res.status === 200) {
                this.dialogFormVisible1 = false;
                this.getList();
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
            this.$notify({ title: '失败', message: '请填写完整', type: 'error', duration: 2000 });
            return false;
          }
        });
      },
      // 专业-课程维护
      handleUpdateCourse(row) {
        this.changeSure = false;
        this.dialogStatus = 'zykcwh';
        this.dialogFormVisible2 = true;
        this.currentZydm = row.zydm;
        this.getCourse(row);
      },
      // 专业-班级维护
      handleUpdateClass(row) {
        this.changeSure = false;
        this.dialogStatus = 'zybjwh';
        this.dialogFormVisible3 = true;
        this.currentZydm = row.zydm;
        this.getClass(row);
      },
      // 更新专业-课程关系
      HandleZykcwh(val) {
        updateZykcgx({ xxdm: this.xxdm, zydm: this.currentZydm, kcidArr: val }).then(res => {
          if (res.status === 200) {
            this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
          } else {
            this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
          }
        });
      },
      // 更新专业-班级关系
      HandleZyBjwh(val) {
        updateZybjgx({ xxdm: this.xxdm, zydm: this.currentZydm, xn: this.dqxn, bjidArr: val }).then(res => {
          if (res.status === 200) {
            this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
          } else {
            this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
          }
        });
      }
    }
  }
</script>

<style scoped>
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 3px;
    margin-left: 8px;
  }
</style>
