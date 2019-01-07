<template>
  <div class="app-container calendar-list-container" style="height: 60px;">
    <el-form :inline="true" :model="kslx" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="kslx.lxmc" placeholder="类型名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">增加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      border
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        width="60">
      </el-table-column>
      <el-table-column
        prop="lxmc"
        label="类型名称"
        width="350">
      </el-table-column>
      <el-table-column
        prop="cjsj"
        label="创建日期"
        width="350">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="kslx.query.page" :page-sizes="[8,12,16,20]"
                     :page-size="kslx.query.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-col>
    <!--新增界面-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogForm" width="29%" @close="colseDialog">
      <el-form :model="temp" :rules="rules" ref="dataForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="类型名称" prop="lxmc">
          <el-input v-model="temp.lxmc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="colseDialog">取消</el-button>
        <!--修改-->
        <el-button v-if="dialogStatus=='update'" type="primary" @click="updateSaveData">确认</el-button>
        <!--保存-->
        <el-button v-else type="primary" @click="saveData">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from '@/api/ksgl/kslx/index'

  export default {
    data() {
      /** 验证名称不能重复**/
      const validaName = (rule, value, callback) => {
        if (this.dialogStatus === 'update' && value === this.templxmc) {
          callback();
        } else {
          api.getValidaName({name: value, xxdm: this.xxdm}).then(res => {
            if (res.data > 0) {
              callback(new Error('类型名称不能重复'));
            } else {
              callback();
            }
          })
        }
      };
      return {
        loading: false,
        list: [],
        xxdm: '',
        kslx: {
          lxmc: '',
          query: {
            page: 1,
            limit: 8
          },
          xxdm: this.xxdm
        },
        total: 0,
        textMap: {
          update: '修改类型',
          create: '添加类型'
        },
        dialogStatus: '',
        dialogForm: false,
        temp: {
          /** 保存的form表单数据**/
          jlid: undefined,
          lxmc: '',
          cjsj: new Date(),
          xxdm: this.xxdm,
          xsxx: 0
        },
        rules: {
          /** 表单验证规则**/
          lxmc: [
            {required: true, message: '请输入类型名称', trigger: 'change'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change'},
            {validator: validaName, trigger: 'change'}]
        },
        templxmc: ''
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.getKslxList();// 搜索条件
    },
    methods: {
      getKslxList() {
        /** 类型列表**/
        this.loading = true;
        this.kslx.xxdm = this.xxdm;
        api.getPageList(this.kslx).then(res => {
          this.total = res.data.total;
          this.list = res.data.rows;
          this.loading = false;
        });
      },
      onSubmit() {
        this.kslx.query.page = 1;
        this.getKslxList()
      },
      resetTemp() {
        this.temp = {
          /** 保存的form表单数据**/
          jlid: undefined,
          lxmc: '',
          cjsj: new Date(),
          xxdm: this.xxdm,
          xsxx: 0
        }
      },
      handleAdd() {
        /** 打开新增弹框**/
        this.dialogStatus = 'create'
        this.resetTemp();
        this.dialogForm = true;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      saveData() {
        /** 提交数据**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            tempData.cjsj = +new Date(tempData.cjsj);
            api.getAdd(tempData).then(() => {
              this.dialogForm = false;
              this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000})
              this.getKslxList();
            })
          }
        })
      },
      handleEdit(index, row) {
        this.dialogStatus = 'update';
        const tempData = Object.assign({}, row);
        this.temp.jlid = tempData.jlid;
        this.temp.lxmc = tempData.lxmc;
        this.templxmc = tempData.lxmc;
        this.temp.cjsj = tempData.cjsj;
        this.dialogForm = true;
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate();
        })
      },
      updateSaveData() {
        /** 修改**/
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            api.getUpdate(tempData.jlid, tempData).then(() => {
              this.dialogForm = false;
              this.$notify({title: '成功', message: '修改成功', type: 'success', duration: 2000})
              this.getKslxList();
            })
          }
        })
      },
      handleDelete(index, row) {
        /** 删除验证 **/
        api.getValidaKslx({xxdm: this.xxdm, kslx: row.jlid}).then(res => {
          if (res.data) {
            this.$alert('<strong>考试类型被使用，不能删除！</strong>', '温馨提示', {
              type: 'warning',
              dangerouslyUseHTMLString: true
            });
          } else {
            /** 删除**/
            this.$confirm('删除后数据不可恢复，确认要删除吗？', '提示', {type: 'warning'}).then(() => {
              api.getDelete(row.jlid).then(() => {
                this.$notify({title: '成功', message: '删除成功', type: 'success', duration: 2000});
                this.getKslxList();
              });
            });
          }
        });
      },
      colseDialog() {
        this.dialogForm = false;
      },
      handleSizeChange(val) {
        /** 跳转到某页**/
        this.kslx.query.limit = val;
        this.getKslxList();
      },
      handleCurrentChange(val) {
        /** 跳转到某页**/
        this.kslx.query.page = val;
        this.getKslxList();
      }
    }
  }
</script>
