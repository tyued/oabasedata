<template>
  <section class="content-container">
    <div style="width: 95%;margin-left: 2.5%;margin-top: 45px;">
      <!--列表-->
      <el-row :gutter="12" :v-loading="listLoading" style="margin-bottom:6px;" v-for="(item,index) in list" :key="index">
        <el-col :span="24">
          <el-card  shadow="always">
              <div>
              <h4 style="display: inline-block;">{{item.name}}</h4>
              <span @click.stop="editautoclass(item)" style="display: inline-block;width: 50px;margin-left: 10px;text-align: center;cursor: pointer;"><el-button type="text" icon="el-icon-edit"></el-button></span>
              </div>
            <div class="editline">
            <div style="height: 52px;line-height: 52px;">
              <span>创建人:{{item.founder? item.founder : '没有创建人'}}&nbsp;&nbsp;&nbsp;</span><p style="display: inline-block;margin: 0;">创建时间:{{item.createTime}}</p>
            </div>
            <div style="height: 40px">
              <el-row style="float:right;">
                <!-- <el-tooltip class="item" effect="dark" content="调整" placement="top-start" hide-after="1000"> -->
                <el-button size="mini" type="primary" icon="el-icon-edit-outline" @click.stop="adjustment(item)">调整</el-button>
                <!-- </el-tooltip> -->
                <!-- <el-tooltip class="item" effect="dark" content="删除" placement="top-start" hide-after="1000"> -->
                <el-button size="mini" type="danger" icon="el-icon-delete" @click.stop="delecthistoryclass(item)">删除</el-button>
                <!-- </el-tooltip> -->
                <!-- <el-tooltip class="item" effect="dark" content="查看" placement="top-start" hide-after="1000"> -->
                <el-button size="mini" type="success" icon="el-icon-tickets" @click.stop="check(item)">查看</el-button>
                <!-- :disabled="listRwZt[item.rwzt].qy" -->
                <!-- </el-tooltip> -->
                <!-- <el-tooltip class="item" effect="dark" content="导出" placement="top-start" hide-after="1000"> -->
                <el-button size="mini" type="warning" icon="el-icon-document" @click.stop="exporthistoryclass(item)">导出</el-button>
                <!-- </el-tooltip> -->
              </el-row>
            </div>
            </div>
            <p></p>
          </el-card>
        </el-col>
      </el-row>
      <el-pagination
        style="margin: 30px 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listQuery.total">
      </el-pagination>
      <!-- 编辑分班信息beg -->
      <el-dialog
        title="提示"
        :visible.sync="editdialogVisible"
        width="30%"
        @close="clossaddmodel"
        >
        <el-form :model="classobj" :rules="rules" ref="temp" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分班名称" prop="name">
            <el-input v-model="classobj.name" minlength="3" maxlength="20"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancell">取 消</el-button>
          <el-button type="primary" @click.stop="confirmedit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分班信息end -->
    </div>

  </section>
</template>
<script>
  import { GetGroupHistory, EditGroupHistory, DelectGroupHistory, ExcelExport, Adjustmenthistory, GetGroupHistoryPage } from '../../../api/admin/division/index'
  export default {
    data () {
      return {
        editdialogVisible: false,
        listLoading: false,
        list: [],
        classobj: {
          batch: '',
          createTime: '',
          founder: '',
          id: '',
          name: '',
          schoolCode: '',
          studentBatch: '',
          oldname: ''
        },
        xxdm: '',
        // 表单验证
        rules: {
          /**表单验证规则**/
          name: [
            {required: true, message: '请输入任务名称', trigger: 'change'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change'}]
        },
        batchPageParam: {
          schoolCode: '',
          // keywords: '',
          skipFirstBatch: false,
          pageIndex: 1,
          pageSize: 10,
        },
        listQuery:{
          page:1,
          limit:10,
          total:0
        },
      }
    },
    mounted () {
      this.xxdm = localStorage.getItem('xxdm')
      this.batchPageParam.schoolCode = localStorage.getItem('xxdm')
      this.gethistory(this.batchPageParam)
    },
    methods: {
      // 每页显示数据条数
      handleSizeChange (val) {
        this.listQuery.page = 1
        this.batchPageParam.pageIndex = 1
        this.batchPageParam.pageSize = val
        this.gethistory(this.batchPageParam)
      },
      // 切换显示另一页
      handleCurrentChange(val){
          this.listQuery.page = val
          this.batchPageParam.pageIndex = val
          this.gethistory(this.batchPageParam)
      },
      // 导出分班结果
      exporthistoryclass (item) {
        let params = {
          SchoolCode: item.schoolCode,
          Batch: item.batch
        }
        ExcelExport(params).then(data => {
            var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
            var downloadElement = document.createElement('a');
        　　var href = window.URL.createObjectURL(blob); //创建下载的链接
        　　downloadElement.href = href;
        　　downloadElement.download = '历史分班信息表.xlsx'; //下载后文件名
        　　document.body.appendChild(downloadElement);
        　　downloadElement.click(); //点击下载
        　　document.body.removeChild(downloadElement); //下载完成移除元素
        　　window.URL.revokeObjectURL(href); //释放掉blob对象 
        })
      },
      // 查看分班历史
      check (item) {
        this.$router.push({path: '/newStudent/groupresult', query:{datas: item.batch, id: 2, schoolCode: item.schoolCode, from: 'history'}})
      },
      // 调整分班历史
      adjustment (item) {
        Adjustmenthistory(item.id).then(data => {
          this.$router.push({path: '/newStudent/groupconfirm', query:{datas: item.batch, from: 'history', schoolCode: item.schoolCode}})
        })
      },
      // 获取历史分班记录
      gethistory (datas) {
        this.listLoading = true;
        GetGroupHistoryPage(datas).then(data => {
          this.list = data.list
          this.listQuery.page = data.pageIndex
          this.listQuery.limit = data.pageSize
          this.listQuery.total = data.totalCount
          this.listLoading = false;
        })
      },
      // 取消编辑
      cancell  () {
        this.classobj.name = this.oldname
        this.editdialogVisible = false
      },
      clossaddmodel () {
        this.classobj.name = this.oldname
        this.editdialogVisible = false
      },
      // 编辑分班信息
      editautoclass (item) {
        this.classobj = item
        this.oldname = item.name
        this.editdialogVisible = true
      },
      // 确认编辑分班
      confirmedit () {
        if (this.classobj.name.length<3) {
          this.$notify({
              title: '提醒',
              message: '名称长度应为3-20',
              type: 'error',
              duration: 2000
          });
        } else if (this.classobj.name.length > 20) {
          this.$notify({
            title: '提醒',
            message: '名称长度应为3-20',
            type: 'error',
            duration: 2000
          });
        } else {
          EditGroupHistory(this.classobj).then(data => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
          });
            this.gethistory(this.batchPageParam)
            this.editdialogVisible = false
          })
        }
      },
      // 删除历史分班
      delecthistoryclass (item) {
        this.$confirm('确认删除此分班记录吗？删除后无法恢复，请谨慎操作！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DelectGroupHistory(item.id).then(data => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });

            this.gethistory(this.batchPageParam)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.grouphistory{
  width: 80
}
.editline{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
