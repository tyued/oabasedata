<template>
  <div class="tab">
    <ul class="tablistcon">
      <li @click.stop="openclassinfo(dataSource.id)" :class="{active: open}">
        <span>{{dataSource.name}}</span>
        <span>{{dataSource.totalNum}}</span>
        <span>{{dataSource.boyNum}}</span>
        <span>{{dataSource.girlNum}}</span>
        <span>{{dataSource.maleFemaleRatio}}</span>
        <span>{{dataSource.averageScore}}</span>
      </li>
      <class-info v-if="show" :studentInfo="studentInfo"></class-info>
      <!--  @handleSelectionChange1='handleSelectionChange1' -->
    </ul>
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
        open: false,
        show: false,
        studentInfo: [],
        params: {},
        studentclass: ''
      }
    },
    props: {
      dataSource: Object
    },
    mounted () {
      this.studentclass = this.dataSource.name
    },
    methods: {
      handleSelectionChange1 (val, studentclass) {
        this.$emit('handleSelectionChange1', val, studentclass)
      },
      openclassinfo (id) {
        this.open = !this.open
        this.show = !this.show
        this.params.schoolCode = localStorage.getItem('xxdm')
        this.params.classId = id
        this.getcalssInfo(this.params)
      },
      getcalssInfo (params) {
        GetClassStudentInfo(params).then(data => {
          this.studentInfo = data
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.tab{
  width: 100%;
  .tablistcon{
    width: 100%;
    margin: 0;
    padding: 0;
    li{
      list-style: none;
      padding-left: 40px;
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      border-bottom: 1px solid #eee;
      border-top: 1px solid #eee;
      position: relative;
      cursor: pointer;
      span{
        width: 100px;
        display: inline-block;
        height: 100%;
        line-height: 50px;
        font-size: 14px;
        color: #333;
      }
    }
    li::before{
      content: '';
      width: 10px;
      height: 10px;
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
      /* transform: rotate(-45deg); */
      position: absolute;
      left: 15px;
      top: 20px;
      transform: rotate(-45deg);
      transition: all .3s ease-in-out;
    }
    .active::before{
        transform: rotate(45deg)
      }
    li:hover{
      background-color: rgb(232, 250, 250);
    }
  }
}
</style>