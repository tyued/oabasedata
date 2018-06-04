<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
          <el-select v-model="searchsel" slot="prepend" placeholder="请选择" @change="searchChange" style="width:120px; height:38px; margin:0 auto;">
              <el-option label="全部" value="all"></el-option>
              <el-option label="校区名称" value="xqmc"></el-option>
          </el-select>
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" border fit highlight-current-row style="width:902px;"  v-loading.body="listLoading">
      <el-table-column align="center" label="校区名称" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.xqmc}}</span>
          </template>
      </el-table-column>
      <el-table-column width="600" align="center" label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.bz}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button  size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button  size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-form-item label="校区名称" prop="xqmc">
          <el-input v-model="form.xqmc" placeholder="请输入校区名称" ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="bz">
          <el-input type="textarea" v-model="form.bz" placeholder="不超过50个字"></el-input>
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
  getCampus,
  getObj,
  addObj,
  putObj,
  delObj
} from 'api/admin/campus/index';
export default {
  name: 'campus',
  components: {
  },
  data() {
    return {
      xxdm:'',
      campus:[],
      tableKey:0,
      listLoading: true,
      list: null,
      total: null,
      listQuery: {              //分页
        page: 1,
        limit: 20,
        name: undefined
      },
      form:{
        "xqmc": undefined,
        "bz": undefined,
      },
      searchsel:'all',                           //查询条件                    //判断点击弹层是creat（添加）还是update（编辑）
      rules:{
        xqmc: [{
          required: true,
          message: '请输入校区名称',
          trigger: 'blur'
        }],
        bz: [{
          required: false,
          message: '备注',
          trigger: 'blur'
        }, {
          min: 0,
          max: 50,
          message: '限50个字符',
          trigger: 'blur'
        }],
      },
      textMap:{
        update: '编辑',
        create: '创建'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      tabPosition:'left',

      changeSure:false,                       //防止重复提交
    }
  },
  created() {
    this.xxdm = window.localStorage.getItem("xxdm");
    this.listQuery.xxdm = this.xxdm;
    this.getList();
  },
  mounted() {

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
            xxdm: this.xxdm,
            name: undefined
        }
    },
  // 添加按钮
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    resetTemp() {
      this.form = {
        "xqmc": undefined,
        "bz": undefined,
      };
      this.changeSure = false;
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
    handleUpdate(row) {
      this.changeSure = false;
      getObj(row.uuid).then(response => {
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
      });
    },
  // 弹层
    // 取消按钮
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    // 编辑页面
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeSure = true;
          this.form.xxdm = this.xxdm;
          addObj(this.form).then((res) => {
            if(res.status=="200"){
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000});
            }else{
                this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
            }
          })
          var that = this;
          setTimeout(function(){
              that.changeSure = false;
          },1500);
        } else {
          this.$notify({title: '失败', message: '还有未填项', type: 'error', duration: 2000});
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
          this.form.password = undefined;
          putObj(this.form.uuid, this.form).then((res) => {
              this.dialogFormVisible = false;
              this.getList();
              if(res.status=="200"){
                this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000});
            }else{
                this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
            }
          });

          var that = this;
          setTimeout(function(){
              that.changeSure = false;
          },1500);
        } else {
          this.$notify({title: '失败', message: '还有未填项', type: 'error', duration: 2000});
          return false;
        }
      });
    },

  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
.filter-container .filter-item{ vertical-align: inherit;}
.el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
.el-checkbox+.el-checkbox{margin-left: 0;}
.el-checkbox{ margin-right: 30px;}
</style>
