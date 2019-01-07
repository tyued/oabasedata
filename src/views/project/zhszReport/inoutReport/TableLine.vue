<template>
    <div>
      <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%" height="700">
        
        </el-table>
    </div>
  </template>
  <script>
    export default {
      data () {
        return {
          t: 2,
        }
      },
      props: {
        dataSource: Array,
      }
    }
  </script>
  <style lang="scss" scoped>
 
  </style>