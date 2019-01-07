<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <h3>创建新审批
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus">自定义模板</el-button>
      </h3>
    </div>

    <el-tabs>
      <el-tab-pane label="复制已有模板">
        <template v-for="(item,index) in list">
          <div class="boxborder" :key="index" @click="selectForm(item.lxid)">
            <div class="circle-ico primary"><i class="el-icon-news" circle></i></div>
            <span>{{item.lxmc}}</span>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="使用经典模板">
        <span>使用经典模板</span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import * as api from 'api/audit/approvalprocess/splcbd';
export default {
  name: 'audittemplate',
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
    getList() {
      api.bdxx(this.xxdm).then(response => {
        this.list = response;
      });
    },

    selectForm(id) {
      const mbxl = id;
      this.$router.push({ name: '选择表单', query: { mbxl } }
      );
    }
  }
};
</script>
<style scoped>
  .circle-ico{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
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
  .boxborder{
    display: inline-block;
    border: 1px solid #e4e4e4;
    margin-left: 22px;
    margin-bottom: 10px;
    width: 166px;
    cursor: pointer;
    height: 72px;
    border-radius: 4px;
  }
  .boxborder .circle-ico{
    margin: 15px;
    display: inline-block;
  }
</style>
