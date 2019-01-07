<template>
  <div class="tab">
    <el-table :data="dataSource" style="width: 100%;" class="bjinfo" @expand-change="expendrow">
        <el-table-column type="expand" width="50" height='40'>
          <class-info :studentInfo="studentInfo"></class-info>
        </el-table-column>
        <el-table-column prop="name" label="班级编号" width="150"></el-table-column>
        <el-table-column prop="totalNum" label="班级人数" width="150"></el-table-column>
        <el-table-column prop="boyNum" label="男生数" width="100"> </el-table-column>
        <el-table-column prop="girlNum" label="女生数" width="100"> </el-table-column>
        <el-table-column prop="maleFemaleRatio" label="男女比例" width="200"></el-table-column>
        <el-table-column prop="averageScore" label="成绩平均分" width="150"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { GetClassStudentInfo } from '../../../api/admin/division/index'
  import ClassInfo from './ClassInfo'
  export default {
    name: 'TableList',
    components: {
      ClassInfo
    },
    data () {
      return {
        studentInfo: []
      }
    },
    props: {
      dataSource: Array
    },
    mounted () {
      
    },
    methods: {
      expendrow (row, expandedRows) {
        let params = {
            schoolCode: localStorage.getItem('xxdm'),
            classId: row.id
        }
        this.getcalssInfo(params)
      },
      getcalssInfo (params) {
        GetClassStudentInfo(params).then(data => {
          this.studentInfo = data
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
.tab{
  width: 100%;
}
</style>