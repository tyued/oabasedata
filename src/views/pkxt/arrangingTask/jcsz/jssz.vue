<template>
  <div>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item>
            <el-button  type="primary" icon="icon-el-icon-yhsz">导入</el-button>
            <el-button  type="primary" icon="icon-el-icon-yhsz">下载导入模板</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="tableData" v-loading="listLoading" highlight-current-row style="width: 100%;">
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="xh" label="学号" width="300"></el-table-column>
        <el-table-column prop="xm" label="姓名" width="300"></el-table-column>
        <el-table-column prop="njmc" label="年级名称" width="300"></el-table-column>
        <el-table-column prop="bj" label="班级名称" width="300"></el-table-column>
        <el-table-column prop="lxmc" label="类型名称" min-width="300"></el-table-column>
      </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableData:[],
        activeName2: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
<style>
  .content-container {
    padding: 20px;
  }

  .toolbar {
    background: #fff;
    padding: 10px;
  //border:1px solid #dfe6ec;
    margin: 10px 0px;
  .el-form-item {
    margin-bottom: 10px;
  }
  }

  .el-table {
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    background-color: #fff;
    border: 1px solid #dfe6ec;
    font-size: 14px;
    color: #1f2d3d;
  }

  .el-table, .el-table td, .el-table th {
    box-sizing: border-box;
    position: relative;
  }

  .el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #dfe6ec;
  }

  .el-table th {
    overflow: hidden;
    background-color: #eef1f6;
    text-align: left;
  }

  .el-table td, .el-table th {
    height: 40px;
    min-width: 0;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .el-dialog__body {
    padding: 10px 20px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #e5e5e5;
  }

  .el-select .el-input {
    width: 80px;
  }

  .el-input-group {
    width: 42%;
  }

  .el-collapse-item__content {
    padding-bottom: 0px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .el-border-button {
    margin: 10px 10px 10px 20px;
    padding: 5px;
  }
  .border-y {
    border-bottom: 1px solid #ebeef5;
  }

</style>
