<template>
    <el-table border :data="TableData"  :style="{width:width}" class='tPopBoxTable' :span-method="arraySpanMethod" >
        <el-table-column show-overflow-tooltip class-name='colsty1' property="xm" label="评价项目" align="center" ></el-table-column>
        <el-table-column show-overflow-tooltip class-name='colsty2' property="fx" label="评价分项" align="center"></el-table-column>
        <el-table-column width="80" class-name='colsty3' property="pjz" label="评价" align="center" ></el-table-column>
        <el-table-column width="135" class-name='colsty4' property="bjzt" label="班级整体" align="center" :render-header="renderHeader" v-if='bjzt'>
            <template slot-scope="scope">
                <div class='blockcol'>
                    <span :class="'clpt'+djind" v-for="(dj,djind) in scope.row.bjzt" :key="djind" :style="'width:'+dj.djW"></span>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    props: {
        TableData: {
            type: Array
        },
        width: {
            type: String,
        },
        bjzt:{                          //是否展示班级整体
            type: Boolean
        }
    },
    data() {
        return {
            colspanArr:[],
            colpos:'',
            rowspanArr:[],


        };
    },
    mounted() {
        this.getSpanArr()
    },
    beforeDestroy() {
    },
    methods: {
        renderHeader (h, { column, $index }) {
            return [
                h('div',{ class: 'tbtit' }, column.label),
                h('div', { class: 'remarks' },[
                    h('div',{class: 'clpt'}, [
                        h('span',{ class: 'clpt0' }),'A'
                    ]),
                    h('div',{class: 'clpt'}, [
                        h('span',{ class: 'clpt1' }),'B'
                    ]),
                    h('div',{class: 'clpt'}, [
                        h('span',{ class: 'clpt2' }),'C'
                    ]),
                    h('div',{class: 'clpt'}, [
                        h('span',{ class: 'clpt3' }),'D'
                    ])
                ])
            ]
        },

        arraySpanMethod({ row, column, rowIndex, columnIndex }){  
            if (rowIndex === this.rowspanArr[rowIndex].row && !this.rowspanArr[rowIndex].fx && !this.rowspanArr[rowIndex].isysz) {            //保留原始数据且无子项
                if (columnIndex === 1) {
                    return [1, 3];
                } else if (columnIndex === 2 || columnIndex === 3) {
                    return [0, 0];
                }
            }          
            if (rowIndex === this.rowspanArr[rowIndex].row && this.rowspanArr[rowIndex].fx && !this.rowspanArr[rowIndex].isysz) {             //非保留原始数据且有子项
                if (columnIndex === 2) {
                    return [1, 2];
                } else if (columnIndex === 3) {
                    return [0, 0];
                }
            }
            if (rowIndex === this.rowspanArr[rowIndex].row && !this.rowspanArr[rowIndex].fx) {               //保留原始数据且无子项
                if (columnIndex === 0) {
                    return [1, 2];
                } else if (columnIndex === 1) {
                    return [0, 0];
                }
            }
            

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
            var data = this.TableData
            this.colspanArr = []
            this.rowspanArr = []
            // jflx计分类型 0成绩换算 1累积量 2学分 3等级 4图文 5健康 6阅读 7加减分
            if(data && data.length>0){
                for(var i = 0; i < data.length; i++){
                    if(i === 0){
                        this.colspanArr.push(1);
                        this.colpos = 0
                    }else{                // 判断当前元素与上一个元素是否相同
                        if(data[i].xm === data[i - 1].xm){
                            this.colspanArr[this.colpos] += 1;
                            this.colspanArr.push(0);
                        }else{
                            this.colspanArr.push(1);
                            this.colpos = i;
                        }
                    }
                    
                    this.rowspanArr.push({row:-1,fx:false,isysz:false});  
                    if(data[i].jflx == 4 || data[i].jflx == 5 || data[i].jflx == 6){               //保留原始数据
                        this.rowspanArr[i].row = i;  
                        if(data[i].fx){       
                            this.rowspanArr[i].fx = true;      //有子项               
                        }
                        
                    }else{   
                        this.rowspanArr[i].isysz = true;      //非保留原始数据  
                        this.rowspanArr[i].row = i;      //有子项  
                        if(data[i].fx){                                   
                            this.rowspanArr[i].fx = true;      //有子项            
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
    
</style>
<style lang="scss">
    .tPopBoxTable table{ display: block; width:100%!important;}
    .tPopBoxTable{
        td{ padding: 10px 0;}
        .tbtit{
            display: block;
        }
        .gutter{
            display: none;
        }
        .cell{
            min-width:100%!important;
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
            }
        }
                .clpt0{ background:#409EFF; }
                .clpt1{ background:#ff8c00; }
                .clpt2{ background:#ccc; }
                .clpt3{ background:#ffd700; }
    }
    .el-popover{ border:none;}
    .tPopBoxTable{
        // .colsty1{width:25%;}
        // .colsty2{width:25%;}
        // .colsty3{width:12.5%;}
        // .colsty4{width:37.5%;}
    }
</style>