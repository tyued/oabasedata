<template>
  <div class="app-container calendar-list-container njApp">
    <div class="filter-container">
      <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]"
                class="input-with-select" style="width: 400px;">
        <el-select v-model="searchsel" slot="prepend" @change="searchChange" placeholder="请选择"
                   style="width:120px; height:38px; margin:0 auto;">
          <!--<el-option label="全部" value="all"></el-option>-->
          <el-option label="年级名称" value="njmc"></el-option>
        </el-select>
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate('form')" type="primary" icon="edit">添加
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="njsjHandler" type="primary" icon="edit">年级升级
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
              style="width: 100%">
      <el-table-column align="center" label="年级代码">
        <template slot-scope="scope">
          <span>{{scope.row.njdm}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="年级名称">
        <template slot-scope="scope">
          <span>{{scope.row.njmc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="年级类型">
        <template slot-scope="scope">
          <span>{{scope.row.njlxmc}}</span>
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

    <el-dialog class="njsjDialog" title="年级升级" width='50%' :visible.sync="dialogTableVisible">
      <div style="float:left">
        前一学年：
        <el-select v-model="pre_xndm" placeholder="请选择">
          <el-option v-for="item in xnsjoptions" :key="item.xn" :label="item.xn" :value="item.xn">
          </el-option>
        </el-select>
      </div>
      <div style="float:left;margin-left:100px;">
        当前学年：
        <el-input class="bordernone" readonly v-model="dqxnoptions"></el-input>
      </div>
      <el-table border :data="gridData" style="margin-top:80px;">
        <el-table-column property="njmc" label="年级"></el-table-column>
        <el-table-column label="升级后">
          <template slot-scope="scope">
            <!-- njsjh 每个年级选择后的升级的值 -->
            <el-select v-model="scope.row.njsj" @change="changeVal(scope.row.index, scope.row.njsj)" placeholder="请选择">
              <el-option v-for="(item, index) in sjData" :key="item.value + scope.row.index" :label="item.value"
                         :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelnjsjfunction">取 消</el-button>
        <el-button type="primary" @click="handlenjsjfu" :loading="handlenjsjLoading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="年级代码" prop="njdm">
              <el-input v-model="form.njdm" :maxlength="20" :disabled="(dialogStatus=='create')?false:true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级名称" prop="njmc">
              <el-input v-model="form.njmc" :maxlength="20" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="年级类型" prop="njlxdm"
                          :rules="[{ required: true, message: '年级类型不能为空',trigger: 'change'}]">
              <el-select v-model="form.njlxdm" placeholder="请选择" :disabled="(dialogStatus=='create')?false:true">
                <el-option v-for="item in dictionary.xzlx" :key="item.id" :label="item.text"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级学制" prop="njxz">
              <el-input v-model="form.njxz" :maxlength="2" :disabled="(dialogStatus=='create')?false:true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="是否毕业年级">
          <el-radio-group v-model="form.sfbynj">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.bz" :maxlength="100" placeholder="不超过100个字"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定
        </el-button>
        <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
      </div>

    </el-dialog>
    <!-- <el-dialog title="年级升级" :visible.sync="dialog_njsj" width="600px">

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNjsj">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="handleNjsj()" :disabled="changeSure">确 定</el-button>
      </div>

    </el-dialog> -->
  </div>
</template>
<script>
  import {
    gradepage,
    getObj,
    putObj,
    delObj,
    getxnlb,
    getdqxn,
    getnjlb,
    njLevelUp,
    addObj
  } from 'api/admin/grade/index';
  import { page, getCurrentXnxq } from 'api/admin/acadyear/index';
  import { mapGetters } from 'vuex';

  export default {
    name: 'grade',
    data() {
      const yznjdm = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年级代码不能为空'));
        }
        if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
          callback(new Error('请输入年级代码'));
        } else {
          callback();
        }
      };
      const yznjmc = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年级名称不能为空'));
        }
        if (value.replace(/(^\s*)|(\s*$)/g, '') === '') {
          callback(new Error('请输入年级名称'));
        } else {
          callback();
        }
      };
      const yznjxz = (rule, value, callback) => {
        if (value) {
          if (value.toString().replace(/[^\d]/g, '') === '' || value.toString().length !== value.toString().replace(/[^\d]/g, '').length) {
            callback(new Error('请输入数字'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      return {
        sjData: [], // 升级选择所需数据
        xxdm: '',
        listLoading: true, // 加载
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        searchsel: 'njmc', // 查询条件                    //判断点击弹层是creat（添加）还是update（编辑）

        tableKey: 0, // 表格
        list: null,
        total: null,

        dialogFormVisible: false, // 弹层是否显示
        handlenjsjLoading: false, // 弹层是否显示
        dialogStatus: '',
        textMap: {
          // 判断弹层是添加还是编辑
          update: '编辑',
          create: '创建'
        },
        tabPosition: 'left',
        form: {}, // 表单
        dictionary: [],

        changeSure: false, // 防止重复提交
        dialog_njsj: false,
        dialogTableVisible: false,
        xnsjoptions: [], // 学年列表
        dqxnoptions: '', // 当前学年
        gridData: [], // 列表数据
        pre_xndm: '', // 前一学年
        dqxn: '', // 学年列表
        rules: {
          njdm: [
            { required: true, validator: yznjdm, trigger: 'blur' }
          ],
          njmc: [
            { required: true, validator: yznjmc, trigger: 'blur' }
          ],
          njxz: [
            { validator: yznjxz, trigger: 'blur' }
          ]
        }
      };
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      this.dictionary.xzlx = this.$store.getters.dict_xzlx; // 学制类型
      this.getList();
      this.getXnList();
      this.getCtList();
      this.getnjlbList();
    },
    computed: {
      ...mapGetters(['dict'])
    },
    watch: {
      dict() {
        this.dictionary.xzlx = this.$store.getters.dict_xzlx; // 学制类型
      }
    },
    methods: {
      /**
       * 获得学年列表
       */
      getXnList() {
        getxnlb({ xxdm: this.xxdm }).then(res => {
          this.xnsjoptions = res;
          const xnLength = this.xnsjoptions.length;
          if (xnLength > 1) {
            this.pre_xndm = this.xnsjoptions[xnLength - 2].xn;
          }
        });
      },
      /**
       * 获得当前学年
       */
      getCtList() {
        getdqxn({ xxdm: this.xxdm }).then(res => {
          this.dqxnoptions = res.data.xn;
        });
      },
      /**
       * 获取年级列表信息
       */
      getnjlbList() {
        this.sjData = [];
        const obj = Object();
        getnjlb({ xxdm: this.xxdm }).then(res => {
          res.forEach((item, index) => {
            const obj = Object();
            obj.value = item.njmc;
            obj.id = item.njdm;
            obj.index = index;
            item.index = index;
            if (index === res.length - 1) {
              item.njsj = '毕业';
            } else {
              item.njsj = res[index + 1].njmc;
            }
            this.sjData.push(obj);
          });
          obj.value = '毕业';
          obj.id = 'BIYE';
          obj.index = this.sjData.length;
          this.sjData.push(obj);
          this.sjData.forEach(itema => {
            res.forEach(itemb => {
              if (itemb.njsj === itema.value) {
                itemb.sjid = itema.id;
              }
            });
          });
          this.gridData = res;
        });
      },
      // 取消
      cancelNjsj() {
        this.dialogFormVisible = false;
      },
      // 取消
      cancelnjsjfunction() {
        this.dialogTableVisible = false;
      },
      getList() {
        this.listLoading = true;
        this.listQuery.xxdm = this.xxdm;
        gradepage(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        });
      },
      // 搜索
      handleFilter() {
        if (this.searchsel === 'all') {
          this.listQuery = { page: 1, limit: 20, name: undefined };
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
      handleCreate(formName) {
        if(this.$refs[formName]!= undefined) this.$refs[formName].resetFields();
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      /**
       * 改变函数
       */
      changeVal(indexparm, opt) {
        let flag = false;
        if (this.gridData[indexparm].njmc === opt) {
          this.$message({
            message: '升级后年级不能重复',
            type: 'warning'
          });
          this.gridData[indexparm].njsj = '';
          flag = true;
        }
        this.gridData.forEach((item, indexa) => {
          let tempindex = '';
          this.sjData.forEach(itemb => {
            if (item.njsj === opt && itemb.value === opt) {
              item.sjid = itemb.id;
            }
          });
          if (item.index === indexparm && item.njsj === opt) {
            tempindex = indexa;
          } else {
            if (!flag) {
              if (item.njsj === opt) this.gridData[indexa].njsj = '';
            }
          }
        });
      },
      /**
       * 年级升级函数
       */
      handlenjsjfu() {
        let sjnicount = 0;
        const postParams = { xxdm: this.xxdm, xndm: this.pre_xndm, sjgz: {} };
        this.gridData.forEach(item => {
          if (item.njsj !== '') {
            postParams.sjgz[item.njdm] = item.sjid;
            sjnicount++;
          }
        });
        if (sjnicount === this.gridData.length && this.pre_xndm !== '' &&
          this.dqxnoptions !== this.pre_xndm) {
          this.handlenjsjLoading = true; // 请求返回前不可再点击;
          njLevelUp(postParams).then(res => {
            this.$message({
              message: res.message,
              type: 'warning'
            });
            this.handlenjsjLoading = false; // 请求返回前不可再点击;
            this.dialogTableVisible = false; // 遮罩层消失;
          });
        } else if (this.dqxnoptions === this.pre_xndm) {
          this.$message({
            message: '前一学年与当前学年不能相同 !',
            type: 'warning'
          });
          return
        } else {
          this.$message({
            message: '升级后年级不能为空且不能重复',
            type: 'warning'
          });
        }
      },
      async handleNjsj() {
        await getCurrentXnxq(this.xxdm).then(response => {
          this.dqxnxq = response.data;
        });
        await page(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        });
        this.dialog_njsj = true;
        this.changeSure = false;
      },
      cancedlNjsj() {
        this.dialog_njsj = false;
      },
      resetTemp() {
        this.form = {
          sfbynj: '0'
        };
        this.changeSure = false;
      },
      // 编辑
      handleUpdate(row) {
        this.changeSure = false;
        getObj(row.uuid).then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
      },
      /**
       * 年级升级
       */
      njsjHandler() {
        this.pre_xndm = ''
        this.getXnList();
        this.dialogTableVisible = true;
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
      // 编辑页面
      update(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.form.xxdm = this.xxdm;
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
      // 添加页面
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.form.xxdm = this.xxdm;
            if (this.form.njlxdm.length > 0) {
              this.form.njlxmc = _.find(this.dictionary.xzlx, {
                id: this.form.njlxdm
              }).text;
            }
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
          }
        });
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
</style>
<style>
  .njsjDialog .el-input {
    width: auto !important;
  }

  .njsjDialog .el-dialog {
    min-width: 720px;
  }

  .bordernone .el-input__inner {
    border: none !important;
  }
</style>

