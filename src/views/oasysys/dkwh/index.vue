<template>
<div class="app-container">
    <el-row>
        <el-col :span="24">
            <div class="znxhead">
                <el-button type="primary">代课申请</el-button>
                <div class="znxhead-other fr">
                    <el-input placeholder="请输入内容" v-model="txt1" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>

            <div class="tableControl mt20">
                <el-button type="info" plain size="small">删除</el-button>
                <el-button type="info" plain size="small">导出</el-button>
            </div>
            <el-table :data="tableData3" border style="width: 100%" class="mailtable">
                <el-table-column type="selection" width="35">
                </el-table-column>
                <el-table-column prop="dksj" sortable label="代课时间" width="300">
                </el-table-column>
                <el-table-column prop="dkkc" sortable label="代课课程">
                </el-table-column>
                <el-table-column prop="yskr" sortable label="原上课人">
                </el-table-column>
                <el-table-column prop="dkr" sortable label="代课人">
                </el-table-column>
                <el-table-column prop="clsj" sortable label="处理时间" width="300">
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
            dksj: '2018-06-11 下午 第一节',
            dkkc: "数学",
            yskr: '袁艳君',
            dkr:"高梦瑶",
            clsj:"2018-06-07 10:38:28",
        },{
            dksj: '2018-06-11 上午 第三节',
            dkkc: "数英语学",
            yskr: '李宝峰',
            dkr:"杜权",
            clsj:"2017-06-07 10:38:28",
        },{
            dksj: '2018-06-11 下午 第一节',
            dkkc: "数学",
            yskr: '袁艳君',
            dkr:"高梦瑶",
            clsj:"2018-06-07 10:38:28",
        },{
            dksj: '2018-06-11 上午 第三节',
            dkkc: "数英语学",
            yskr: '李宝峰',
            dkr:"杜权",
            clsj:"2017-06-07 10:38:28",
        },{
            dksj: '2018-06-11 下午 第一节',
            dkkc: "数学",
            yskr: '袁艳君',
            dkr:"高梦瑶",
            clsj:"2018-06-07 10:38:28",
        },{
            dksj: '2018-06-11 上午 第三节',
            dkkc: "数英语学",
            yskr: '李宝峰',
            dkr:"杜权",
            clsj:"2017-06-07 10:38:28",
        },
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
