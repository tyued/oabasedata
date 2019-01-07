<template>
    <div :style="{width:width}">
        <el-table border :data="kcTableData"  :style="{width:width}" class='tPopBoxTable' :span-method="arraySpanMethod">
            <el-table-column class-name='colsty1' property="kc" label="学科" align="center"></el-table-column>
            <el-table-column class-name='colsty2' property="xm" label="评价项目" align="center" ></el-table-column>
            <el-table-column class-name='colsty3' property="pjz" label="评定" align="center" ></el-table-column>            
        </el-table>
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
    //name:'总评'
    props: {
        TableData: {
            type: Array
        },
        width: {
            type: String,
        },
    },
    data() {
        return {
            kcTableData:[],
            totilData:[],
            colspanArr:[],
            colpos:'',
            rowspanArr:[],
        };
    },
    mounted() {
        var that = this
        this.kcTableData = []
        this.totilData = []
        if(this.TableData && this.TableData.length>0){
            this.TableData.forEach(a => {
                if(a.lx == 0){
                    that.kcTableData.push(a)
                }else{
                    that.totilData.push(a)
                }
            });
        }

        
        this.getSpanArr()

    },
    beforeDestroy() {
    },
    methods: {
        arraySpanMethod({ row, column, rowIndex, columnIndex }){ 
            if (columnIndex === 0) {
                var _row = this.colspanArr[rowIndex];
                var _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
        getSpanArr() {
            var data = this.kcTableData
            this.colspanArr = []
            this.rowspanArr = []
            if(data && data.length>0){
                for(var i = 0; i < data.length; i++){
                    if(i === 0){
                        this.colspanArr.push(1);
                        this.colpos = 0
                    }else{                // 判断当前元素与上一个元素是否相同
                        if(data[i].kc === data[i - 1].kc && data[i].kc){
                            this.colspanArr[this.colpos] += 1;
                            this.colspanArr.push(0);
                        }else{
                            this.colspanArr.push(1);
                            this.colpos = i;
                        }
                    }
                }
            }
        },
    }
}
</script>
<style scoped lang="scss">
    .tPopBoxTable{
        .blockcol{
            width: 100%; height: 24px; 
            span{ 
                float: left; height: 24px; color: #fff; font-size: 12px;
            }
            .colA{ background:#409EFF; }
            .colB{ background:#ff8c00; }
            .colC{ background:#ccc; }
            .colD{ background:#ffd700; }
        }
    }
    .totilbox{
        margin-top: 15px;
        border: 1px solid #ebeef5;    
        .zprow{
            width: 100%; height: 120px; 
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
                border-right:  1px solid #ebeef5; height:120px; 
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
                    }
                    span{
                        width: 60px; text-align: left;
                    }
                }
            }
        }
    }
    
</style>
<style lang="scss">
    .tPopBoxTable table{ width: 100%!important; display: block;}
    .tPopBoxTable{
        .tbtit{
            display: block;
        }
        .gutter{
            display: none;
        }
        .cell{
            div{
                padding:0;
                white-space: initial;
            }
        }
        .remarks{
            display: block; height: 20px; line-height: 20px;
            .clpt{
                float: left;height: 20px; line-height: 20px; padding:0; margin: 0 3px;
                span{
                    width: 10px; height:10px; float: left; margin: 5px 2px 5px 0;
                }
                .clpta{ background:#409EFF; }
                .clptb{ background:#ff8c00; }
                .clptc{ background:#ccc; }
                .clptd{ background:#ffd700; }
            }
        }
    }
    .el-popover{ border:none;}
    
</style>

