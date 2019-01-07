<template>
  <div class="classinfo">
    <el-table :data="studentInfo" style="width: 90%;" max-height="300" class="bjinfo">
      <!-- @selection-change="handleSelectionChange1" -->
      <!-- <el-table-column type="selection" width="50"></el-table-column> -->
      <el-table-column type="index" label="序号" width="70"></el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="sex" :formatter="formatRole" label="性别" width="70"> </el-table-column>
      <el-table-column prop="idCard" label="身份证" width="200"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="160"></el-table-column>
      <el-table-column prop="totalScore" label="成绩" width="140"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: 'ClassInfo',
    data () {
      return {
        
      }
    },
    props: {
      studentInfo: Array,
      // studentclass: String
    },
    methods: {
      // 转换男女性别数字
      formatRole (row, column) {
        return row.sex === 1 ? '男' : '女'
      },
      handleSelectionChange1 (val) {
        this.$emit('handleSelectionChange1', val)
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.classinfo{
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  /* .bjinfo{ */
    /* min-height: 200px; */
    /* max-height: 200px;
    overflow-x: auto;
    overflow-y: scroll; */
  /* } */
}
</style>