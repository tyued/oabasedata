<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <h3>审批流程
        <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">创建新审批</el-button>
        <el-button class="filter-item" @click="handleIndex" type="primary" icon="el-icon-plus">审批首页(开发调试用)</el-button>
      </h3>
    </div>
    <hr>

    <template v-for="(item,index) in list">
        <div :key="index">
          <div class="type-detail">
            <span>{{ item.lcdlmc }}({{ item.count }})</span>
          </div>

          <el-table :show-header="false" :data="item.children" v-loading.body="listLoading"  fit highlight-current-row style="width: 100%">
            <el-table-column label="假期名称" width="280">
              <template slot-scope="scope">
                  <div class="circle-ico" :class="scope.row.lczt==1?'info':'primary'"><i class="el-icon-news" circle></i></div>
                  <span class="type-conname">{{scope.row.lcmc}}</span>
              </template>
            </el-table-column>

            <el-table-column label="请假单位" width="240">
              <template slot-scope="scope">
                  <div>可见范围</div>
                  <div>全部可见</div>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="success" @click="editForm(scope.row)">编辑表单</el-button>
                <el-button size="small" type="danger" @click="szspbz(scope.row)">审批流程</el-button>
                <el-button v-if="scope.row.lczt==0" size="small" type="danger" @click="szmbzt(scope.row)">停用</el-button>
                <el-button v-else-if="scope.row.lczt==1" size="small" type="success" @click="szmbzt(scope.row)">启用</el-button>
                <el-button v-if="scope.row.lczt==1" size="small" type="danger" @click="scsplcmb(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
    </template>
  </div>
</template>
<script>

import * as api from 'api/audit/approvalprocess/splcmbxx';
export default {
  name: 'holidayManager',
  data() {
    return {
      xxdm: '',
      listLoading: false,
      list: []
    };
  },

  created() {
    this.xxdm = window.localStorage.getItem('xxdm');
    this.getList();
  },

  methods: {
    handleData(list) {
      const dataSet = list;
      const result = [];
      dataSet.forEach(item => {
        const lcdl = item.lcdl;
        const arr = _.find(result, { lcdl });
        if (arr) {
          arr.children.push(item);
          arr.count = arr.count + 1;
        } else {
          const obj = {};
          obj.lcdl = lcdl;
          obj.lcdlmc = item.lcdlmc;
          obj.count = 1;
          obj.children = [];
          obj.children.push(item);
          result.push(obj);
        }
      });
      return result;
    },

    getList() {
      api.mbxxAll({ xxdm: this.xxdm }).then(response => {
        this.list = this.handleData(response);
      });
    },

    handleCreate() {
      this.$router.push('/audit/auditTemplate');
    },
    handleIndex() {
      this.$router.push('/process/index');
    },
    editForm(data) {
      const mbid = data.mbid;
      this.$router.push({ name: '选择表单', query: { mbid } });
    },
    szspbz(data) {
      const mbid = data.mbid;
      this.$router.push({ name: '设置流程步骤', query: { mbid } });
    },
    scsplcmb(mbxx) {
      if (mbxx.lczt === 1) {
        this.$confirm('此操作将删除流程模板?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.del(mbxx.mbid).then(() => {
            this.getList();
          });
        });
      }
    },
    szmbzt(mb) {
      const mbxx = {};
      if (mb.lczt === 1) {
        mbxx.lczt = 0;
      } else {
        mbxx.lczt = 1;
      }
      mbxx.mbid = mb.mbid;
      api.put(mb.mbid, mbxx).then(() => {
        this.getList();
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

.line {
  text-align: center;
}

.type-detail {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #323334;
  padding: 0 9px;
  text-align: left;
  background: #f8f8f8;
}
.type-conname{
  margin-left: 10px;
}
.circle-ico{
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  /*cursor: pointer;*/
  color: #fff;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: .1s;
  transition: .1s;
  background-color: #909399;
  border: 1px solid #909399;
  border-radius: 50%;
  padding: 12px;
  -ms-user-select: none;
  font-weight: 500;
}
.circle-ico.primary{
  background-color: #409EFF;
  border: 1px solid #409EFF;
}
.circle-ico.info{
  background-color: #909399;
  border: 1px solid #909399;
}
</style>
