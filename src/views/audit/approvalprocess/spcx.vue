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
                <el-option label="全部" value=""></el-option>
                <el-option label="审批中" value="1"></el-option>
                <el-option label="已撤销" value="2"></el-option>
                <el-option label="已完成" value="3"></el-option>
                <el-option label="已拒绝" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发起时间">
              <el-date-picker v-model="listQuery.fqsj" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="完成时间">
              <el-date-picker v-model="listQuery.wcsj" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始时间" end-placeholder="结束时间"> </el-date-picker>
            </el-form-item>
            <el-form-item label="审批编号">
              <el-input v-model="listQuery.slid" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryPageList">查询</el-button>
              <el-button type="primary" @click="exportList">导出</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="审批编号">
                <template slot-scope="scope">
                  <el-button  type="text" @click="hanldClick(scope.row.slid)">{{scope.row.slid}}</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="标题">
                <template slot-scope="scope">
                    <span>{{scope.row.slmc}}</span>
                </template>
            </el-table-column>
          <el-table-column align="center" label="审批状态">
            <template slot-scope="scope">
              <span>{{scope.row.slzt}}</span>
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
      <page-splimx ref="pageSplimx"></page-splimx>
    </div>
</template>
<script>
import { mbxx, page, del } from 'api/audit/mobile/spcx';
import pageSplimx from '@/components/shmb/spmx';
export default {
  name: 'spslcx',
  components: { pageSplimx },
  data() {
    return {
      xxdm: '',
      mbList: [],
      listLoading: true,                      // 加载
      listQuery: {
        mbid: '',
        page: 1,
        limit: 10,
        fqsj: [],
        wcsj: []
      },
      tableKey: 0,                            // 表格
      list: null,
      total: null
    }
  },
  created() {
    this.xxdm = window.localStorage.getItem('xxdm');
    this.listQuery.xxdm = this.xxdm;
    mbxx({ xxdm: this.xxdm }).then(response => {
      this.mbList = response;
      if (this.mbList.length > 0) {
        this.listQuery.mbid = this.mbList[0].mbid;
      }
      this.listQuery.xxdm = this.xxdm;
      this.listLoading = true;
      page(this.listQuery).then(response => {
        this.setSlzt(response);
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    });
  },
  methods: {
    cxmbxx() {
      mbxx({ xxdm: this.xxdm }).then(response => {
        this.mbList = response;
        if (this.mbList.length > 0) {
          this.listQuery.mbid = this.mbList[0].mbid;
        }
      })
    },
    setTime() {
      if (this.listQuery.fqsj === null) {
        this.listQuery.fqsj = [];
      }
      if (this.listQuery.wcsj === null) {
        this.listQuery.wcsj = [];
      }
      if (this.listQuery.fqsj.length === 2) {
        this.listQuery.fqfrom = this.listQuery.fqsj[0];
        this.listQuery.fqto = this.listQuery.fqsj[1];
      } else {
        this.listQuery.fqfrom = '';
        this.listQuery.fqto = '';
      }
      if (this.listQuery.wcsj.length === 2) {
        this.listQuery.wcfrom = this.listQuery.wcsj[0];
        this.listQuery.wcto = this.listQuery.wcsj[1];
      } else {
        this.listQuery.wcfrom = '';
        this.listQuery.wcto = '';
      }
    },
    setSlzt(response) {
      for (let i = 0; i < response.data.rows.length; i++) {
        const res = response.data.rows;
        if (res[i].slzt === 1) {
          res[i].slzt = '审批中';
        } else if (res[i].slzt === 2) {
          res[i].slzt = '已撤销';
        } else if (res[i].slzt === 3) {
          res[i].slzt = '审批通过';
        } else {
          res[i].slzt = '审批拒绝';
        }
      }
    },
    queryPageList() {
      this.setTime();
      this.listQuery.xxdm = this.xxdm;
      this.listLoading = true;
      page(this.listQuery).then(response => {
        this.setSlzt(response);
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
        // 分页
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.queryPageList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryPageList();
    },
        // 删除
    handleDelete(row) {
      if (row.slzt === '审批中') {
        this.$notify({ title: '提示', message: '审批中不可删除', type: 'success', duration: 2000
        });
        return;
      }
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
    ckspxq(slid) {
      this.$router.push({ path: '/process/info', query: { slid } });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    exportList() {
      // this.listQuery.limit = 999;
      page(this.listQuery).then(response => {
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel');
          const tHeader = ['审批编号', '标题', '审批状态', '发起时间', '完成时间'];
          const filterVal = ['slid', 'slmc', 'slzt', 'cjsj', 'gxsj'];
          this.setSlzt(response);
          const data = this.formatJson(filterVal, response.data.rows);
          export_json_to_excel(tHeader, data, '流程历史');
        })
      })
    },
    hanldClick(slid) {
      if (slid) {
        this.$nextTick(() => {
          this.$refs.pageSplimx.init(slid);
        })
      }
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
</style>
