<template>
    <div>
        <div style="font-size:18px;font-weight:600;height: 40px;line-height: 40px;">{{TableData.zymc?(TableData.zymc + '/'):''}}{{TableData.kcmc}}<span style="display:inline-block;float: right;" v-if="TableData.ewmUrl"><img style="height: 40px;" :src="TableData.ewmUrl" alt=""></span></div>
        <el-table border :data="TableData.tabledata"  :style="{width:width}" class='tPopBoxTable' :span-method="arraySpanMethod">
            <!-- :span-method="arraySpanMethod" -->
            <el-table-column v-if="label.isshows" :prop="label.id" class-name='colsty3' :label="label.labels" align="center" v-for="(label, index) in TableData.tablehead" :key="index"></el-table-column>
            <el-table-column width="135" v-if="label.isshow&&!label.isshows" :prop="label.bjzt" class-name='colsty4' :label="label.labels" align="center" v-for="(label, index) in TableData.tablehead" :key="index" :render-header="renderHeader">
                <template slot-scope="scope">
                    <div class='blockcol'>
                        <span v-if="dj.num !== 0" :class="'col'+dj.dj" v-for="(dj,djind) in scope.row.bjzt" :key="djind" :style="{width:dj.djW}">{{dj.num}}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
    
<script>
export default {
    props: {
        TableData: {
            type: Object
        },
        width: {
            type: String,
        },
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

        
        /** 合并行列判断条件添加
         * spanTwoArr 第二列判定条件
         * concatOne 第一列下标返回值
         * concatTwo 第二列下标返回值
         * **/
        setTable() {
            // this.rowspanArr = []
            let spanOneArr = [],
            spanTwoArr = [],
            concatOne = 0,
            concatTwo = 0;
            this.TableData.tabledata.forEach((item,index)=>{
                // console.log(item)
                if(index === 0){
                    spanOneArr.push(1);
                    spanTwoArr.push(1);
                }else{
                    if(item.xm === this.TableData.tabledata[index - 1].xm){ //第一列需合并相同内容的判断条件
                        spanOneArr[concatOne] += 1;
                        spanOneArr.push(0);
                    }else{
                        spanOneArr.push(1);
                        concatOne = index;
                    };
                    // if (item.xm === this.TableData.tabledata[index - 1].xm && (item.jflx === 7 || item.jflx === 1) && item.dj === item.hjz) {
                    //     spanTwoArr[concatTwo] += 1;
                    //     spanTwoArr.push(0);
                    // }else{
                    //     spanOneArr.push(1);
                    //     concatOne = index;
                    // }
                    // if(item.fx === this.TableData.tabledata[index - 1].fx){//第二列需合并相同内容的判断条件
                    //     spanTwoArr[concatTwo] += 1;
                    //     spanTwoArr.push(0);
                    // }else{
                    //     spanTwoArr.push(1);
                    //     concatTwo = index;
                    // };
                }
            });
            return  {
                one: spanOneArr,
                two: spanTwoArr,
            }

        },
        getSpanArr(){
            var that = this
            this.colspanArr = []
            this.rowspanArr = []
            // this.TableData.tabledata.forEach((item,index)=>{
            //     that.rowspanArr.push(-1)
            //     if (item.jflx === 7 || item.jflx === 1) {
            //         that.rowspanArr[index] = index
            //     }
            // })
            var data = this.TableData.tabledata
            for (var i=0; i< data.length; i++) {
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
                that.rowspanArr.push(-1)
                if (data[i].jflx === 7 || data[i].jflx === 1 || data[i].jflx === 5) {
                    that.rowspanArr[i] = i
                }
                
            }
        },
        /** 合并列行
         *  根究相同项目名和并列
         * **/
        arraySpanMethod({ row, column, rowIndex, columnIndex }){
            // console.log(row,rowIndex,columnIndex,this.colspanArr[rowIndex])
            // console.log(rowIndex)
            // console.log(this.rowspanArr[rowIndex])
            
            // if (rowIndex === this.rowspanArr[rowIndex]) {           //保留原始数据且无子项
            //     if (columnIndex === 0) {
            //         return [1, 2];
            //     } else if (columnIndex === 1) {
            //         return [0, 0];
            //     }
            // }
        
            if (columnIndex === 0) {
                var _row = this.colspanArr[rowIndex];
                var _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
            if (columnIndex === 2 && (row.jflx === 7 || row.jflx === 1)) {
                var _row = this.colspanArr[rowIndex];
                var _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
            

        },
        // 表头等级格式
        renderHeader (h, { column, $index }) {
            return [
                h('div',{ class: 'tbtit' }, column.label),
                h('div', { class: 'remarks' },[
                    h('div',{class: 'clpt'}, [
                        h('span',{ class: 'clpta' }),'A'
                    ]),
                    h('div',{class: 'clpt'}, [
                        h('span',{ class: 'clptb' }),'B'
                    ]),
                    h('div',{class: 'clpt'}, [
                        h('span',{ class: 'clptc' }),'C'
                    ]),
                    h('div',{class: 'clpt'}, [
                        h('span',{ class: 'clptd' }),'D'
                    ])
                ])
            ]
        },
    }
}
</script>
<style scoped lang="scss">
    .tPopBoxTable{
        margin: 0;
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
            display: block; height: 20px; line-height: 20px;margin: auto;
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