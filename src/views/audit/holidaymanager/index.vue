<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <h3>设置假期规则
        <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加假期</el-button>
        <!-- <el-button class="filter-item" style="margin-left: 10px;" @click="show" type="primary">show</el-button> -->
      </h3>
    </div>

    <!--
      <div style="overflow: hidden">
      <transition name="sliderRight">
        <div class="food-content" v-show="showFlag">
          <div>transition</div>
        </div>
      </transition>
    </div>
    -->

    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="假期名称" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.jqmc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="请假单位" width="140">
        <template slot-scope="scope">
          <span>{{getValue('qjdw', scope.row.qjdw)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="计算请假时长方式">
        <template slot-scope="scope">
          <span>{{getValue('scfs', scope.row.scfs)}}</span>
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
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="550px">
      <el-form :model="form" ref="form" label-width="140px">

        <el-form-item label="假期名称" prop="jqmc" :rules="[{ required: true, message: '该条件不能为空' }]">
          <el-input placeholder="请输入假期名称" style="width: 190px;" v-model="form.jqmc" :maxlength="6"></el-input>
        </el-form-item>

        <el-form-item label="最小请假单位" prop="qjdw" :rules="[{ required: true, message: '该条件不能为空' }]">
          <el-select placeholder="请选择请假单位" v-model="form.qjdw">
            <el-option v-for="dw in dictMap.qjdw" :label=dw.text :value=dw.id :key="dw.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日折算时长" prop="zssc" v-if="form.qjdw==='3'" :rules="[{ required: true, message: '该条件不能为空' }]">
          <el-input-number placeholder="请输入折算时长" style="width: 140px;" :min="1" :max="24" v-model="form.zssc"></el-input-number>
          <span>小时=1天</span>
          <p style="font-size: 12px;color: gray;margin-bottom: 0;">请假，出差，外出，加班的日折算时长同时生效</p>
        </el-form-item>

        <el-form-item label="计算请假时长方式" prop="scfs" v-if="form.qjdw==='3'" :rules="[{ required: true, message: '该条件不能为空' }]">
          <el-select placeholder="请选择计算方式" v-model="form.scfs">
            <el-option v-for="fs in dictMap.scfs" :label=fs.text  :value=fs.id :key="fs.id"></el-option>
          </el-select>

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
  import { page, get, del, post, put } from 'api/audit/holidaymanager/index'

  export default {
    name: 'holidayManager',
    data() {
      return {
        // showFlag: false,
        xxdm: '',
        tableKey: 0,
        listLoading: false,
        total: 0,
        list: [],
        dictMap: { qjdw: [{ id: '1', text: '按天请假' }, { id: '3', text: '按小时请假' }],
        // dictMap: { qjdw: [{ id: '1', text: '按天请假' }, { id: '2', text: '按半天请假' }, { id: '3', text: '按小时请假' }],
          scfs: [{ id: '1', text: '按自然日计算请假时长' }, { id: '2', text: '按工作日计算请假时长' }] },
        form: { jqmc:'', qjdw:'', zssc:1 },
        listQuery: {              // 分页
          page: 1,
          limit: 20,
          xxdm: ''
        },
        textMap: {
          update: '编辑假期',
          create: '新增假期'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        // tabPosition: 'left',
        changeSure: false // 防止重复提交
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      this.getList();
    },
    watch: {
      dialogFormVisible(val) {
        if (val === false) {
          this.$refs.form.resetFields();
          this.form.jqmc = '';
          this.form.qjdw = '';
          this.form.zssc = 1;
        }
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
        })
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
        this.num = 1;
        this.changeSure = false;
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.changeSure = false;
        get(row.jqid).then(response => {
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
          del(row.jqid).then(() => {
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
      cancel() {
        this.dialogFormVisible = false;
      },
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.form.xxdm = this.xxdm;
            if (typeof this.form.scfs === 'undefined') {
              this.form.scfs = '2';
            }
            post({
              jqmc: this.form.jqmc,
              qjdw: this.form.qjdw,
              scfs: this.form.scfs,
              xxdm: this.form.xxdm,
              zssc: this.form.zssc
            }).then(res => {
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
            this.$notify({ title: '失败', message: '还有未填项', type: 'error', duration: 2000 });
            return false;
          }
        });
      },

      update(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.dialogFormVisible = false;
            this.form.password = undefined;
            put(this.form.jqid, this.form).then(res => {
              this.getList();
              if (res.status === 200) {
                this.dialogFormVisible = false;
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
            this.$notify({ title: '失败', message: '还有未填项', type: 'error', duration: 2000 });
            return false;
          }
        });
      },

      getValue(type, key) {
        const data = this.dictMap[type];
        return _.find(data, { id: key }).text;
      }

    }
  }
</script>
<style>
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

  .line {
    text-align: center;
  }

  .sliderRight-enter-active {
    animation-name: fadeInRight;
    animation-duration: .5s;
  }

  .sliderRight-leave-active {
    animation-name: fadeOutRight;
    animation-duration: .5s;
  }

  @-webkit-keyframes fadeInRight {
    from {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  @-webkit-keyframes fadeOutRight {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
  }

  @keyframes fadeOutRight {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
  }
</style>
