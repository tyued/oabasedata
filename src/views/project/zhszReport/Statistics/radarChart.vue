<template>
    <div :style="{width:width}">
        <div ref='chartbox' :style="{height:height,width:width}"></div>
        <ul>
            <li v-if='type==0'>注解：得A率雷达图展示各个科目的得A率。例如，语文共有5个等级评价项目，其中3个项目得A，那么语文的得A率为60%</li>
            <li v-if='type==1'>注解：积分雷达图展示各个科目的积分。例如，语文共有5个评价项目，其中3个项目得5分，那么语文的积分率为60%</li>
        </ul>
    </div>
    
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
            type: String
        },
        height: {
            type: String
        },
        type:{
            type:Number
        }
    },
    data() {
        return {
            chart: null
        };
    },
    mounted() {
        //type 0得A率雷达图   1积分雷达图
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
            this.chart = echarts.init(this.$refs['chartbox'], 'macarons');
            var indicator= [],dataList1 = [],dataList2 = []
            if(this.chartData && this.chartData.length>0){
                this.chartData.forEach(item => {
                    indicator.push({name:item.xm,max:item.max})
                    dataList1.push(item.score[0])
                    dataList2.push(item.score[1])
            
                });
            }
            this.chart.setOption({
                tooltip: {},
                legend: {
                    data: ['您的成绩'],
                    orient:'vertical',
                    right: '0%',
                    bottom:'5%',
                    itemHeight: 1
                },
                radar: {
                    // center: ['50%', '40%'],
                    // radius: '50%',
                    indicator: indicator
                },
                series: [{
                    type: 'radar',
                    data : [
                        {
                            value : dataList1,
                            name : '您的成绩'
                        },
                    ]
                }]
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    ul{
        border-top: 1px solid #eee; margin-top: 10px;
        li{
            list-style:circle;
            margin: 5px 20px;
            span{
                color: #4787f1 ;
            }
        }
    }
</style>
