<!-- 表格组件 -->
<template>
  <div>
      <table>
          <tr>
              <th style="width:80px;">
                  <div class="out">
                      <b>名次</b>
                      <em>班级</em>
                  </div>
              </th>
              <th style="background-color: #eee;" v-for="(item, index) in ranklist" :key="index">{{item.name}}</th>
          </tr>
          <tr v-for="(items, index) in tablelist" :key="index">
              <td class="t1">{{items.name}}</td>
              <td v-for="(item, itemindex) in items.rankingCounts" :key="itemindex">{{item.count}}</td>
          </tr>
      </table>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        tablelist: [],
        ranklist: []
      }
    },
    mounted () {
      this.tablelist = this.dataSource
      this.ranklist = this.dataSource[0].rankingCounts
    },
    props: {
      dataSource: Array,
    }
  }
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
  *{padding:0;margin:0;}
      caption{font-size:14px;font-weight:bold;}
      table{ border-collapse:collapse;border:1px #525152 solid;width:100%;margin:0 auto;margin-top:100px;}
      th,td{border:1px #525152 solid;text-align:center;font-size:12px;line-height:30px;}

      /*模拟对角线*/
      .out{
          border-top:40px #D6D3D6 solid;/*上边框宽度等于表格第一行行高*/
          width:0px;/*让容器宽度为0*/
          height:0px;/*让容器高度为0*/
          border-left:80px #BDBABD solid;/*左边框宽度等于表格第一行第一格宽度*/
          position:relative;/*让里面的两个子容器绝对定位*/
      }
      b{font-style:normal;display:block;position:absolute;top:-40px;left:-40px;width:35px;}
      em{font-style:normal;display:block;position:absolute;top:-25px;left:-70px;width:55x;}
</style>