<template>
  <div class="app-container calendar-list-container">

    <div class="mbottom">
      <el-select v-model="listQuery.xn" class="mright" @change="getList">
        <el-option
          v-for="(item,index) in xnList"
          :key="index"
          :value="item">
          {{item+'年'}}
        </el-option>
      </el-select> 
      <el-select v-model="listQuery.xq" class="mright" @change="getList">
        <el-option
          v-for="(item,index) in xqList"
          :key="index"
          :label="item.xqmc"
          :value="item.xq">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.njdm" class="mright" @change="getList">
        <el-option
          v-for="(item,index) in njList"
          :key="index"
          :label="item.njmc"
          :value="item.njdm">
        </el-option>
      </el-select>
      <el-select v-model="kcIndex" @change="getList">
        <el-option
          v-for="(item,index) in kcList"
          :key="index"
          :label="item.kcmc"
          :value="index">
        </el-option>
      </el-select> 
    </div>  

    <div id="myChart" class="chart-style"></div>  
  
  </div>
</template>

<style scoped lang="scss">
  .mright {
    margin-right: 10px; 
  }
  .mbottom {
    margin-bottom: 20px; 
  }
  .chart-style {
    height: 600px;
    //图标宽度自适应要调用resize方法
  }
   
</style>

<script>
// 引入echarts
import echarts from 'echarts'

import { getToken } from "utils/auth";
import { mapGetters } from "vuex";
import {
    bj_page,
    getXn,
    getXq,
    getNj,
    getXk,
    dqxnxqObj,
} from 'api/project/scoreMonitor/index'

export default {
  name: "bjScore",
  components: {
    
  },
  data() {
    return {
      listQuery:{
        xxdm: window.localStorage.getItem('xxdm'),
        xn: '',
        xq: '',
        njdm: '',
        kcmc: '',
        kcId: '',
      },
      kcIndex: 0,
      xnList: [],
      xqList: [],
      njList: [],
      kcList: [],
      dataList: [],
      xmList: [],
      chart: null,
    }
  },  
  created() {
    this.init()
  },
  mounted() {
   
  },
  computed: {
    xAxisData() {
      let xData = [];
      for(let i = 0; i < this.dataList.length; i++) {
        xData.push(this.dataList[i].bjmc)
      }
      return xData
    },
    legendData() {
      let lData = [];
      for(let i = 0; i < this.xmList.length; i++) {
        lData.push(this.xmList[i].xmmc)
      }
      return lData
    },
    seriesData() {
      let sData = [];
      for(let k = 0; k < this.xmList.length; k++) {
        let data = [];
        for(let i = 0; i < this.dataList.length; i++) {
          let hasScore = false;
          for(let j = 0; j < this.dataList[i].xmScores.length; j++) {
            if(this.dataList[i].xmScores[j].xmId == this.xmList[k].xmId) {
              hasScore = true;
              data.push(this.dataList[i].xmScores[j].score)
            }
          }
          if(!hasScore) {
            data.push(0)
          }
        }

        let obj = {
          name: this.xmList[k].xmmc,
          type: 'bar',
          stack: '学分',
          data: data,
          barWidth: '50%',//柱图宽
          barMaxWidth: 130, 
        }
        sData.push(obj)
      }
      return sData
    },

  },
  directives: {

  },
  filters: {

  },
  methods: {
    init() {
      let _this = this;
      Promise.all([
        dqxnxqObj({
            xxdm: _this.listQuery.xxdm,
        }), 
        getXn({
            xxdm: _this.listQuery.xxdm,
            page: 1,
            limit: 50,
        }), 
        getXq({
            xxdm: _this.listQuery.xxdm,
            page: 1,
            limit: 50,
        }), 
        getNj({
            xxdm: _this.listQuery.xxdm,
            page: 1,
            limit: 50,
        }),
        getXk({
            xxdm: _this.listQuery.xxdm,
            page: 1,
            limit: 50,
        })])
      .then(function (res) {
        let res0 = res[0];
        let res1 = res[1].data.rows;
        let res2 = res[2].data.rows;
        let res3 = res[3].data.rows;
        let res4 = res[4].data.rows;

        // 学年
        let xnList = [];
        if(res1) {
          for(let i = 0; i < res1.length; i++) {
            if(xnList.indexOf(res1[i].xn) < 0) {
              xnList.push(res1[i].xn)
            }
          }
        }  
        _this.xnList = xnList;

        // 学期
        _this.xqList = res2;

        // 年级
        _this.njList = res3;

        // 课程
        _this.kcList = res4;

        //初始化请求数据

        let xnIndex = xnList.indexOf(res0.xn);
        if(xnIndex<0) {xnIndex = 0}

        let xqIndex = 0 ;
        for(let i = 0; i < res2.length; i++) {
          if(res0.xq == res2[i].xq) {
            xqIndex = i;
            break
          }
        }
  
        _this.listQuery.xn = xnList[xnIndex];
        _this.listQuery.xq = res2[xqIndex].xq;
        _this.listQuery.njdm = res3[0].njdm;
        _this.kcIndex = 0;

        _this.getList()
        
      });
    },
    getList() {
      let _this = this
      // console.log(_this.listQuery)
      this.listQuery.kcId = this.kcList[this.kcIndex].uuid;   //记得打开备注
      // _this.listQuery.kcId = 'd9742200-2814-11e8-88b0-b82a72dc4c4d';  //测试数据 
      
      _this.listQuery.kcmc = _this.kcList[_this.kcIndex].kcmc;


      //初始化echarts之前销毁之前的echarts实例
      if(_this.chart != null) {
        _this.chart.dispose()
      }
      // 基于准备好的dom，初始化echarts实例
      _this.chart = echarts.init(document.getElementById('myChart'))
      //echarts加载动画
      _this.chart.showLoading()

      //获取数据
      bj_page(_this.listQuery).then((response)=>{
        console.log(response)
        _this.dataList = response.classList;
        _this.xmList = response.xmInfos;

        setTimeout(()=>{ 
          _this.chart.hideLoading()
          _this.drawLine()     
        }, 1200)
      })
      
    },
    drawLine(){
      let _this = this;
      
      // 绘制图表
      _this.chart.setOption({
        title: {
          show: true,
          text: '年级'+_this.listQuery.kcmc+'对比图',
          left:'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // color:['#409EFF','#E6A23C','#909399'],
        legend: {
          bottom: 0,
          data: _this.legendData
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: [{
          type : 'category',
          data : _this.xAxisData,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        }],
        yAxis: [{
          type : 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
          },
        }],
        series: _this.seriesData
      });   
    },    
  }
};
</script>


