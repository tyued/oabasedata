<template>
<div class="app-container">
    <el-row>
        <el-col :span="24">
            <div class="znxhead">
                <el-button type="primary">写公文</el-button>
                <div class="znxhead-other fr">
                    <el-input placeholder="请输入内容" v-model="txt1" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>

            <el-table :data="tableData3" border style="width: 100%" class="mailtable mt20">
                <el-table-column type="selection" width="35">
                </el-table-column>
                <el-table-column prop="jsr" sortable label="接收人" width="200">
                </el-table-column>
                <el-table-column prop="fbsj" sortable label="发布时间" width="350">
                </el-table-column>
                <el-table-column prop="ck" sortable label="已查看/未查看">
                </el-table-column>
                <el-table-column prop="fbzt" sortable label="发布状态">
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
            jsr: '校管理员',
            fbsj: "2017-12-07 15:45:02",
            ck: '1/70',
            fbzt:"已发送",
        },{
            jsr: '袁艳君',
            fbsj: "2017-11-07 15:45:02",
            ck: '11/70',
            fbzt:"草稿",
        },{
            jsr: '校管理员、邓启明',
            fbsj: "2018-2-07 15:45:02",
            ck: '1/70',
            fbzt:"已发送",
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
