<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
          <el-form :inline="true" :model="listQuery" class="demo-form-inline">
            <el-form-item label="审批类型">
              <el-select v-model="listQuery.mbid" >
                <el-option v-for="mb in mbList" :key="mb.mbid" :label="mb.lcmc" :value="mb.mbid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审批状态">
              <el-select v-model="listQuery.slzt">
                <el-option label="审批中" value="1"></el-option>
                <el-option label="已撤销" value="2"></el-option>
                <el-option label="已完成" value="3"></el-option>
                <el-option label="已拒绝" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发起时间">
              <el-date-picker v-model="listQuery.fqfrom" type="date" value-format="yyyy-MM-dd"> </el-date-picker>-
              <el-date-picker v-model="listQuery.fqto" type="date" value-format="yyyy-MM-dd"> </el-date-picker>
            </el-form-item>
            <el-form-item label="完成时间">
              <el-date-picker v-model="listQuery.wcfrom" type="date" value-format="yyyy-MM-dd"> </el-date-picker>-
              <el-date-picker v-model="listQuery.wcto" type="date" value-format="yyyy-MM-dd"> </el-date-picker>
            </el-form-item>
            <el-form-item label="审批编号">
              <el-input v-model="listQuery.slid" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList">查询</el-button>
              <el-button type="primary" @click="exportList">导出</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="审批编号">
                <template slot-scope="scope">
                  <el-button  type="text" @click="ckspxq(scope.row.slid)">{{scope.row.slid}}</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="标题">
                <template slot-scope="scope">
                    <span>{{scope.row.slmc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="发起时间">
                <template slot-scope="scope">
                    <span>{{scope.row.cjsj}}</span>
                </template>
            </el-table-column>
          <el-table-column align="center" label="完成时间">
            <template slot-scope="scope">
              <span>{{scope.row.gxsj}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button  type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
    </div>
</template>
<script>
import {mbxx,page,del,dclcsl} from 'api/audit/mobile/spcx'
export default {
    name: 'spslcx',
    data(){
        return{
            xxdm:'',
            mbList:[],
            listLoading: true,                      //加载
            listQuery: {
                mbid:'',
                page: 1,
                limit: 10
            },
            tableKey: 0,                            //表格
            list: null,
            total: null,
        }
    },
    created(){
        this.xxdm = window.localStorage.getItem("xxdm");
        this.listQuery.xxdm = this.xxdm;
        this.cxmbxx();
        this.getList();
    },
    methods:{
      cxmbxx(){
        mbxx({ xxdm: this.xxdm}).then(response => {
          this.mbList = response;
          if(this.mbList.length>0){
            this.listQuery.mbid = this.mbList[0].mbid;
          }


        })
      },
        getList() {
          this.listQuery.xxdm = this.xxdm;
          this.listQuery.limit = 10;
            this.listLoading = true;
            console.log(this.listQuery);
            page(this.listQuery).then(response => {
                this.list = response.data.rows;
                this.total = response.data.total;
                this.listLoading = false;
            })

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
        // 删除
        handleDelete(row) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                del(row.slid).then(() => {
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
      ckspxq(slid){
        this.$router.push({ path: '/process/info', query: {slid:slid}});
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      exportList(){
        this.listQuery.limit = 999;
        page(this.listQuery).then(response => {
          require.ensure([], () => {
            const { export_json_to_excel } = require('@/vendor/Export2Excel');
            const tHeader = ['审批编号','标题','审批状态','发起时间','完成时间'];
            const filterVal = ['slid', 'slmc', 'slzt', 'cjsj', 'gxsj'];
            const data = this.formatJson(filterVal, response.data.rows);
            export_json_to_excel(tHeader, data, '流程历史');
          })
        })
      },
    }
}
</script>
<style>
    .filter-container .filter-item{ vertical-align: inherit;}
    .el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
    .el-checkbox+.el-checkbox{margin-left: 0;}
    .el-checkbox{ margin-right: 30px;}

    .line{ text-align: center;}
</style>
