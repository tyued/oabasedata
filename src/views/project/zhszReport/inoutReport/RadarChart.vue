<template>
  <div id="myChart" ref="myChart" :style="mainstyle"></div>
</template>
<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons');
  export default {
    data () {
      return {
        pieChart: null,
        mainstyle: {
          width: '450px',
          height: '380px',
          margin: 'auto'
        }
      }
    },
    props: {
      h: Number,
      w: Number,
      dataN: Array,
      dataV: Array,
      danwei: String
    },
    mounted() {
      this.mainstyle.width =  this.w + 'px'
      this.mainstyle.height =  this.h + 'px'
      setTimeout(() => {
        this.initchart(this.dataN,this.dataV)
      }, 300)
    },
    // beforeDestroy(){
    //   if (!this.dataV) {
    //     return
    //   }
    //   this.pieChart.dispose()
    //   this.pieChart = null
    // },
    methods: {
      initchart(dataN,dataV) {
        this.pieChart= echarts.init(this.$refs.myChart)
        var indicators = []
        indicators = dataN
        var datas = []
        datas = dataV[0].value
        console.log(datas)
        this.pieChart.setOption({
          title: {
            text: '个人发展' + '(' + this.danwei + ')'
          },
          tooltip: {},
          legend: {
            // data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
          },
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: indicators
            // indicator: [
            //   // { name: '语文', max: 100},
            //   // { name: '数学', max: 100},
            //   // { name: '英语', max: 100},
            //   // { name: '物理', max: 100},
            //   // { name: '政治', max: 100},
            //   // { name: '历史', max: 100}
            // ]
          },
          series: [{
            name: '',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: [
              {
                value: datas,
                name:''
              }
            ]
            // data : [
            //   {
            //     value : [43, 100, 28, 35, 50, 19],
            //     name : ''
            //   },
            //   // {
            //   //   value : [5000, 14000, 28000, 31000, 42000, 21000],
            //   //   name : ''
            //   // }
            // ]
          }]
        }, true, true)
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>