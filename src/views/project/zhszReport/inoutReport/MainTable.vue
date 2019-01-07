<template>
  <div>
    <ul class="tableWrap">
      <li class="td" style="background-color: #eee;height: 40px;line-height:30px;">学科</li>
      <li class="td" style="background-color: #eee;border-left:1px solid #e5e5e5;border-right:1px solid #e5e5e5;height: 40px;line-height:30px;">评价项目</li>
      <li class="td"style="background-color: #eee;height: 40px;line-height:30px;">评定</li>
    </ul>
    <ul class="tableWrap" v-for="(item , index) in pageData" :key="index">
      <li class="td tdxk">{{item.xk}}</li>
      <li class="td tdxm">
        {{(item.pjxm.length !== 1 && item.pjxm.length !== 0) ? '':item.pjxm[0].mc}}
        <span class="tds" :key="indexa" v-for="(itema, indexa) in item.pjxm" v-if="item.pjxm.length !== 1 && item.pjxm.length !== 0">
          {{itema.mc}}
        </span>
      </li>
      <li class="td tdxm">
        {{(item.pjxm.length !== 1 && item.pjxm.length !== 0) ? '':item.pjxm[0].dj}}
        <span class="tds" :key="indexb" v-for="(itema, indexb) in item.pjxm" v-if="item.pjxm.length !== 1 && item.pjxm.length !== 0">
          {{itema.dj}}
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        // pageDatas:[],
      }
    },
    props: {
      pageData: Array
    },
    mounted () {
      // this.pageDatas = this.pageData
      // console.log(this.pageData)
    },
    methods: {
      
    }
  }
</script>
<style lang="scss" scoped>
    .tableWrap{
      width: 100%;
      display: flex;
      align-items: center;
      border-left:1px solid #e5e5e5;
      border-right:1px solid #e5e5e5;
      border-bottom:1px solid #e5e5e5;
      .td{
        flex: 1;
        width: 33%;
        height: 100%;
        text-align: center;
        box-sizing: border-box;
        padding: 5px 0;
        .tds{
          display: block;
          width: 100%;
          height: 100%;
          border-bottom: 1px solid #e5e5e5;
          padding: 10px 0;
        }
        .tds:nth-last-of-type(1){
          border-bottom: none;
        }
        .tds:nth-of-type(1){
          border-top: none;
        }
      }
      .tdxm{
        border-left:1px solid #e5e5e5;
      }
      .tdxk{
        border: none;
      }
    }
    .tableWrap:nth-of-type(1){
      border-top:1px solid #e5e5e5;
    }
    ol, ul {
      margin-top: 0;
      margin-bottom: 0px;
    }
</style>