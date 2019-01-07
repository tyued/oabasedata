<template>
    <div class="app-container calendar-list-container">
        <el-container>
            <el-aside width="250px" v-if="unitCode == 1">
              <TreePart class='screenfull' :treeData='admarea' :treeHeader="treeHeader" :defaultProps="defaultProps" :treemrexpand="mrexpand"
                        @treeCClick="treeCClick"></TreePart>
            </el-aside>
            <el-main>
                <div class="container-block">
                    <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
                        <el-select v-model="searchsel" slot="prepend" placeholder="请选择" @change="searchChange" style="width:120px; height:38px; margin:0 auto;">
                            <!--<el-option label="全部" value="all"></el-option>-->
                            <el-option label="学年" value="xn"></el-option>
                        </el-select>
                    </el-input>
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
                    <el-button v-if="unitCode == 5? false: true" class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
                </div>
                <el-table ref="singleTable" :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" :row-class-name="tableRowClassName">
                    <el-table-column align="center" label="学年" width="140">
                        <template slot-scope="scope">
                            <span>{{scope.row.xn}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="学期" width="140">
                        <template slot-scope="scope">
                            <span :class="(scope.row.dqxnxq=='1')? 'redThis':''">{{scope.row.xqmc}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="工作时间">
                        <template slot-scope="scope">
                            <span>{{workTime(scope.row.gzkssj) + "至" + workTime(scope.row.gzjssj)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="当前学年学期" width="120">
                        <template slot-scope="scope">
                            <span>{{(scope.row.dqxnxq=="1")?"是":"否"}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column v-if="unitCode == 5? false: true" align="center" label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-show="!listLoading" class="pagination-container">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
                </div>
            </el-main>
        </el-container>
        <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="700px" :before-close="cancel">
            <el-form :model="form" ref="form" label-width="110px">
                <el-form-item label="学年" required>
                    <el-col :span="5">
                        <el-input v-model="formxnstart" placeholder="请输入年份"></el-input>
                    </el-col>
                    <el-col class="line" :span="1">-</el-col>
                    <el-col :span="5">
                        <el-input v-model="formxnend" placeholder="请输入年份"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="学期"  prop="xq" :rules="[{ required: true, message: '学期不能为空'}]">
                    <el-col :span="6">
                        <el-select v-model="form.xq" placeholder="请选择">
                            <el-option v-for="item in termList" :key="item.xq" :label="item.xqmc" :value="item.xq"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-row :gutter="18">
                    <el-col :span="12">
                        <el-form-item label="工作开始时间" prop="gzkssj" :rules="[{ required: true, message: '工作开始时间不能为空'}]">
                            <el-date-picker type="date" v-model="form.gzkssj" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工作结束时间"  prop="gzjssj" :rules="[{ required: true, message: '工作结束时间不能为空'}]">
                            <el-date-picker type="date" v-model="form.gzjssj" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item v-if="unitCode == 1? true:false" label="所属区划" prop='xzqh' :rules="[{ required: true, message: '所属区划不能为空'}]">
                    <el-cascader :options="admarea" change-on-select v-model="opation_jg" :props="form_props" @change="xzqhChange"></el-cascader>
                </el-form-item>
                <!--<el-row :gutter="18">
                    <el-col :span="12">
                        <el-form-item label="学习开始时间"  prop="xxkssj" :rules="[{ required: true, message: '学习开始时间不能为空'}]">
                            <el-date-picker type="date" v-model="form.xxkssj" placeholder="选择日期" @change="xxChange"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学习结束时间"  prop="xxjssj" :rules="[{ required: true, message: '学习结束时间不能为空'}]">
                            <el-date-picker type="date" v-model="form.xxjssj" placeholder="选择日期" @change="xxChange"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <!-- <el-form-item label="当前学年学期">
                    <el-radio-group v-model="form.dqxnxq">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <!--<el-form-item label="学习周数">
                    <el-input v-model="xxweek" placeholder="自动计算" :disabled="true"></el-input>
                </el-form-item> -->
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
} from 'api/admin/acadyear/index'
import { getXqlist } from 'api/admin/term/index'
import TreePart from 'components/TreePart';
import { getDict } from 'api/dict'
export default {
  name: 'acadyear',
  components: {
    TreePart
  },
  data() {
    return {
      xxdm: '',
      listLoading: true,                      // 加载
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      searchsel: 'xn',                           // 查询条件                    //判断点击弹层是creat（添加）还是update（编辑）

      tableKey: 0,                            // 表格
      list: null,
      total: null,
      xxweek: '',                              // 学习周数

      dialogFormVisible: false,               // 弹层是否显示
      dialogStatus: '',
      textMap: {                              // 判断弹层是添加还是编辑
        update: '编辑',
        create: '创建'
      },
      tabPosition: 'left',
      form: {},                                // 表单
      termList: [],                            // 学期
      formxnstart: '',
      formxnend: '',

      changeSure: false,                       // 防止重复提交


      unitCode: '',
      admarea: [],                  // 行政区域
      mrexpand: [],                  // 树形默认展开的节点
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      opation_jg: [],                  // 籍贯--传参要求是字符串、所得是数组要转化
      findopa_jg: [],                  // 籍贯
      curopa_jg: {},                  // 籍贯
      form_props: {
        value: 'id',
        label: 'text',
        children: 'children'
      },

      CurXn: '',

      treeHeader: '选择行政区划',
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      treeCCdata: ''
    }
  },
  created() {
    // unitCode (1:系统管理员 2:学校管理员 3:普通老师 4,学生, 5:教育局管理员)'
    this.unitCode = sessionStorage.getItem('unitCode');
    this.xxdm = window.localStorage.getItem('lguserType') != 1 ? window.localStorage.getItem('xxdm') : '0000';
    const time = new Date();
    this.CurXn = time.getFullYear() - 1 + '-' + time.getFullYear();

    this.listQuery.xxdm = this.xxdm;
    // this.getList();
    this.getTermList();
    if (this.xxdm === '0000') { //0000 即 public 解决 mycat分片问题
      getDict().then(response => {
        this.admarea = response.data['JY/T 1001－2012'];         // 籍贯
        this.mrexpand = []
        if (this.admarea && this.admarea.length > 0) {
          this.mrexpand.push(this.admarea[0].id)
          this.listQuery.xzqh = this.admarea[0].children[0].id;
          this.getList();
        }
      }).catch(error => {
        console.log(error);
      });
    } else {
      this.getList();
    }
  },
  methods: {
    treeCClick(value) {
      this.treeCCdata = value.id
      this.handleFilter()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.dqxnxq == 1) {
        return 'curRow';
      }
    },
    getList() {
      // const that = this;
      this.listLoading = true;
      this.listQuery.xxdm = this.xxdm;
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
    getTermList() {
      getXqlist({ xxdm: this.xxdm }).then(response => {
        this.termList = response;
      })
    },
    xzqhChange() {
      this.form.xzqh = this.opation_jg.join()
    },
        // 搜索
    handleFilter() {
      if (this.searchsel === 'all') {
        this.listQuery = { page: 1, limit: 20, name: undefined, xxdm: this.xxdm }
      }
      this.listQuery.xzqh = this.treeCCdata;
      this.getList();
    },
    searchChange() {
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
      this.form = {
        dqxnxq: 1
      };
      this.yearStr();
      this.xxweek = 0;
      this.opation_jg = []
      this.changeSure = false;
    },
        // 编辑
    handleUpdate(row) {
      this.changeSure = false;
      console.log(row)
      getObj(row.uuid).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = 'update';
                // 学年
        this.yearStr(this.form.xn);
                // // 开始时间、结束时间
        this.form.gzkssj = this.workTime(this.form.gzkssj);
        this.form.gzjssj = this.workTime(this.form.gzjssj);
        this.form.dqxnxq ? this.form.dqxnxq : 1;

        this.findcurXZQHL(this.form.xzqh, this.admarea);
        const that = this;
        this.opation_jg = this.findopa_jg.reverse();
      });
    },
    findcurXZQHL(val, data) {
      const that = this
      data.forEach(item => {
        if (item.id === val) {
          that.curopa_jg = item
          that.findopa_jg.push(item.id)
          that.findXZQHL(item, that.admarea)
        }
        if (item.children && item.children.length > 0) {
          that.findcurXZQHL(val, item.children)
        }
      })
    },
    findXZQHL(val, data) {
      const that = this
      if (val.parentId != null) {
        data.forEach(item => {
          if (item.id === val.parentId) {
            that.findopa_jg.push(item.id)
            that.findXZQHL(item, that.admarea)
          }
          if (item.children && item.children.length > 0) {
            that.findXZQHL(val, item.children)
          }
        })
      }
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
        console.log(e)
      });
    },
        // 表格中日期2000-01-01
    workTime(val) {
      const d = new Date(val);              // 时间戳
      const year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day
      return year + '-' + month + '-' + day
    },
        // 周数
    weekNum(xk, js) {
      if (xk && js) {
        const start = new Date(xk);
        const end = new Date(js);
        const diff = parseInt((end - start) / (1000 * 60 * 60 * 24));
        let week = '';
        if (diff) {
          week = parseInt(diff / 7);
        } else {
          week = '0';
        }
      } else {
        week = '0';
      }
      return week
    },
        // 学年
    yearStr(val) {
      if (val) {
        const str = val.split('-');
        this.formxnstart = str[0];
        this.formxnend = str[1];
      } else {
        const time = new Date();
        this.formxnstart = time.getFullYear() - 1;
        this.formxnend = time.getFullYear();
      }
    },
        // 学习时间选择变动
    xxChange() {
      this.xxweek = this.weekNum(this.form.xxkssj, this.form.xxjssj)
    },
        // 取消按钮
    cancel() {
      this.dialogFormVisible = false;
      this.$refs.form.resetFields();
    },
        // 编辑页面
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeSure = true;
          this.form.gzkssj = this.formTime(this.form.gzkssj);
          this.form.gzjssj = this.formTime(this.form.gzjssj);
          this.form.xxdm = this.xxdm;
          this.form.xn = this.formxnstart + '-' + this.formxnend;
          if (this.form.xq) {
            this.form.xqmc = _.find(this.termList, { xq: this.form.xq }).xqmc;
          } else {
            this.form.xqmc = ''
          }
          this.form.sfpltj = '0';             // 是否批量添加
          this.form.xzqh = this.opation_jg[this.opation_jg.length - 1]
          addObj(this.form).then(res => {
            if (res.status === 200) {
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
        // 编辑页面
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeSure = true;
          this.form.gzkssj = this.formTime(this.form.gzkssj);
          this.form.gzjssj = this.formTime(this.form.gzjssj);
          this.form.xxdm = this.xxdm;
          this.form.xn = this.formxnstart + '-' + this.formxnend;
          this.dialogFormVisible = false;
          if (this.form.xq) {
            this.form.xqmc = _.find(this.termList, { xq: this.form.xq }).xqmc;
          } else {
            this.form.xqmc = ''
          }
          this.form.xzqh = this.opation_jg[this.opation_jg.length - 1]
          putObj(this.form.uuid, this.form).then(res => {
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
        // json
    formTime(val) {
      const d = new Date(val);              // 时间戳
      const year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      let hour = d.getHours();
      let min = d.getMinutes();
      let sec = d.getSeconds();
      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;
      if (hour < 10) hour = '0' + hour;
      if (min < 10) min = '0' + min;
      if (sec < 10) sec = '0' + sec;
      return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
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
    .redThis{
      color: red;
    }
</style>
<style>

</style>

