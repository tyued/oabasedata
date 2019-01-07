<template>
  <div class="box">
    <div v-if='totilData&&totilData.length>0' class='totilbox'>
        <div class="zprow" :class='{"cqjz":item.lx==3}' v-for="(item,index) in totilData" :key="index">
            <div class='zpcolname'><span>{{item.name}}</span></div>
            <div class="zpcolcon">
                <div class='partBox ycq' v-if='item.lx==3'>
                    应出勤<span>{{item.ycq}}</span>天，事假<span>{{item.sj}}</span>天，病假<span>{{item.bj}}</span>天，旷课<span>{{item.kk}}</span>节，迟到及早退<span>{{item.cdzt}}</span>节。
                </div>
                <div class='partBox write' v-if='item.lx==4'>{{item.jcjl}}</div>
                <div class='partBox write bzrjy' v-if='item.lx==5'>
                    <p>{{item.bzrjy}}</p>
                    <div class='right'>班主任签字：<span>{{item.bzrname}}</span></div>
                </div>
                <div class='partBox write' v-if='item.lx==6'>{{item.fy}}</div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        
      }
    },
    props: {
      totilData: Array
    }
  }
</script>
<style lang="scss" scoped>
  .box{
    width: 100%;
  }
  .totilbox{
    //   margin-top: 15px;
      border: 1px solid #ebeef5;    
      .zprow{
          width: 100%; height: 180px; 
          border-bottom: 1px solid #ebeef5; position: relative;
          &:last-child{
              border-bottom: none;
          }
          &.cqjz{
              height: 56px;
              .zpcolname{
                  height: 56px;
              }
          }
          .zpcolname{
              border-right:  1px solid #ebeef5; height:180px; 
              padding: 10px; 
              width: 80px; text-align: center;
              vertical-align: middle; display: table-cell;
          }
          .zpcolcon{
              position: absolute; left: 80px; right: 0;
              top: 0; bottom: 0; padding: 10px;
              .ycq{
                  height: 36px;
                  vertical-align: middle; display: table-cell;
              }
              span{
                  width: 20px; display: inline-block; text-align: center; color: #000;
              }
              .bzrjy{
                  p{
                      height: 64px;
                  }
                  .right{
                      float: right;
                      margin-top: 65px;
                  }
                  span{
                      width: 60px; text-align: left;
                  }
              }
              .write{
                height: 100%;
                overflow: hidden;
                /* text-overflow:ellipsis;
                white-space: nowrap; */
              }
          }
      }
  }
</style>