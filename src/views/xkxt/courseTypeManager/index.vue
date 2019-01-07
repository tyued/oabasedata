<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input placeholder="请输入课程类别" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
        <el-select v-model="searchsel" @change="searchChange" slot="prepend" placeholder="请选择" style="width:120px; height:38px; margin:0 auto;">
          <el-option label="课程类别" value="lbmc"></el-option>
        </el-select>
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="课程类别" >
        <template slot-scope="scope">
          <span>{{scope.row.lbmc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否启用" width="280" >
        <template slot-scope="scope">
          <span v-if="scope.row.sfqy == 0" style="color:#85ce61">{{(scope.row.sfqy == 0) ? "否":"是"}}</span>
          <span v-else style="color:#f56c6c">{{(scope.row.sfqy == 0) ? "否":"是"}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否已使用" width="280">
        <template slot-scope="scope">
          <span v-if="scope.row.sfksk == 0" style="color:#85ce61">{{(scope.row.sfksk == 0) ? "未使用":"已使用"}}</span>
          <span v-else style="color:#f56c6c">{{(scope.row.sfksk == 0) ? "未使用":"已使用"}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="显示顺序" width="280">
        <template slot-scope="scope">
          <span>{{scope.row.xsxx}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.sfksk == 0" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button v-else size="small" type="info" @click="handleDelete(scope.row)" disabled >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]"
                     :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="600px" >
      <el-form :model="form" ref="form" label-width="110px" name="myform">
        <el-form-item label="课程类别"  prop="lbmc" :rules="[{ required: true, message: '课程类别长度需1-40个字符',max:40}]" >
          <el-input v-model.trim="form.lbmc" placeholder="请输入课程类别" ></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="sfqy">
          <el-radio v-model="form.sfqy" label="0">否</el-radio>
          <el-radio v-model="form.sfqy" label="1">是</el-radio>
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
  import { page, get, del, post, put, } from 'api/xkxt/courseTypeManager/index'
  export default {
    name: 'courseTypeManager',
    data() {
      return {
        // showFlag: false,
        xxdm: '',
        tableKey: 0,
        listLoading: false,
        total: 0,
        list: [],
        dictMap: {},
        form: {

        },
        listQuery: {              // 分页
          page: 1,
          limit: 20,
          xxdm: ''
        },
        searchsel:'lbmc',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        // tabPosition: 'left',
        changeSure: false                       // 防止重复提交
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      this.getList();
      // this.getDictMap();
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
      // 搜索
      handleFilter() {
        if(this.searchsel=="all"){
          this.listQuery = { page: 1, limit: 20, name: undefined }
        }
        this.getList();
      },
      searchChange(val){
        this.listQuery = {
          page: 1,
          limit: 20,
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
        this.$set(this.form, 'sfqy', '0');
        this.changeSure = false;
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        this.changeSure = false;
        get(row.lbid).then(response => {
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
          del(row.lbid).then(() => {
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
            post(this.form).then(res => {
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
            this.$notify({ title: '失败', message: '课程类别长度需1-40个字符', type: 'error', duration: 2000 });
            return false;
          }
        });
      },

      update(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.dialogFormVisible = false;
            put(this.form.lbid, this.form).then(res => {
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
      getValue(type, key) {
        const data = this.dictMap[type];
        return _.find(data, { id: key }).text;
      }

    }
  }
</script>
<style>
  .app-container .filter-container .filter-item {
    vertical-align: inherit;
  }

  .app-container .el-input-group__append, .el-input-group__prepend {
    padding: 0 10px;
  }

  .app-container .el-checkbox + .el-checkbox {
    margin-left: 0;
  }

  .app-container .el-checkbox {
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
