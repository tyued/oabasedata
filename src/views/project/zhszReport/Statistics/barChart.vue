<template>
    <div :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts 主题
const animationDuration = 3000;
export default {
    props: {
        chartData:{
            type: Array
        },
        width: {
            type: String,
        },
        height: {
            type: String,
        },
    },
    data() {
        return {
            chart: null
        };
    },
    mounted() {
        this.initChart();
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose();
        this.chart = null;
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$el, 'macarons');
            var dataAxis= [],dataList = [], lineList = []
            if(this.chartData && this.chartData.length>0){
                this.chartData.forEach(item => {
                    dataAxis.push(item.xm)
                    dataList.push({name:item.xm,type:'bar',data:item.score, animationDuration})
            
                });
            }
            this.chart.setOption({
                legend: {
                    data: dataAxis
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: dataList
            })
        }
    }
}
</script>
