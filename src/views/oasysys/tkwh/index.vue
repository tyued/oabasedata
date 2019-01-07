<template>
<div class="app-container">
    <el-row>
        <el-col :span="24">
            <div class="znxhead">
                <el-button type="primary">调课申请</el-button>
                <div class="znxhead-other fr">
                    <el-input placeholder="请输入内容" v-model="txt1" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>

            <div class="tableControl mt20">
                <el-button type="info" plain size="small">删除</el-button>
            </div>
            <el-table :data="tableData3" border style="width: 100%" class="mailtable">
                <el-table-column type="selection" width="35">
                </el-table-column>
                <el-table-column prop="xn" sortable label="学年" width="150">
                </el-table-column>
                <el-table-column prop="xq" sortable label="学期" width="150">
                </el-table-column>
                <el-table-column prop="tkr" sortable label="调课人" width="150">
                </el-table-column>
                <el-table-column prop="btkr" sortable label="被调课人" width="150">
                </el-table-column>
                <el-table-column prop="nj" sortable label="年级" width="150">
                </el-table-column>
                <el-table-column prop="bj" sortable label="班级">
                </el-table-column>
                <el-table-column prop="clsj" sortable label="处理时间">
                </el-table-column>
                
            </el-table>

        </el-col>
    </el-row>
</div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
       txt1:"",
       tableData3: [{
            xn: '2017-2018',
            xq: "下学期",
            tkr: '夏小雪',
            btkr:"李宝峰",
            nj:"一年级",
            bj:"一年级(2)班",
            clsj:"2017-12-07 15:45:02",
        },{
            xn: '2017-2018',
            xq: "上学期",
            tkr: '周文权',
            btkr:"袁艳君",
            nj:"",
            bj:"",
            clsj:"2017-12-07 15:45:02",
        },{
            xn: '2017-2018',
            xq: "下学期",
            tkr: '夏小雪',
            btkr:"李宝峰",
            nj:"一年级",
            bj:"一年级(2)班",
            clsj:"2017-12-07 15:45:02",
        },{
            xn: '2017-2018',
            xq: "下学期",
            tkr: '夏小雪',
            btkr:"李宝峰",
            nj:"",
            bj:"",
            clsj:"2017-12-07 15:45:02",
        },{
            xn: '2017-2018',
            xq: "下学期",
            tkr: '夏小雪',
            btkr:"李宝峰",
            nj:"",
            bj:"",
            clsj:"2017-12-07 15:45:02",
        },{
            xn: '2017-2018',
            xq: "下学期",
            tkr: '夏小雪',
            btkr:"李宝峰",
            nj:"一年级",
            bj:"一年级(2)班",
            clsj:"2017-12-07 15:45:02",
        }
        ],
    }
  },
  mounted: function(){
    

  },
  methods: {
    
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/oasysys.scss";


</style>
