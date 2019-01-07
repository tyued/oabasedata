<template>
<div class="app-container">
    <el-row>
        <el-col :span="24">
            <div class="znxhead">
                <el-button type="primary">写邮件</el-button>
                <div class="znxhead-other fr">
                    <el-input placeholder="请输入内容" v-model="txt1" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>

            <div class="tableControl mt20">
                <el-button type="info" plain size="small">回复</el-button>
                <el-button type="info" plain size="small">转发</el-button>
                <el-button type="info" plain size="small">删除</el-button>
                <el-button type="info" plain size="small">已阅</el-button>
                <el-button type="info" plain size="small">未阅</el-button>
                <div class="znxinfo fr">
                    收件箱(共 <span class="f-red">1</span> 封,其中未读邮件 <span class="f-red">0</span> 封)
                </div>
            </div>

            <el-table :data="tableData3" border style="width: 100%" class="mailtable">
                <el-table-column type="selection" width="50">
                </el-table-column>
                <el-table-column prop="fjr" sortable label="发件人" width="200">
                </el-table-column>
                <el-table-column prop="zt" sortable label="主题" width="450">
                </el-table-column>
                <el-table-column prop="rq" sortable label="日期" width="150">
                </el-table-column>
                <el-table-column prop="ck" sortable label="是否查看">
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
          rq: '2016-05-03',
          fjr: "王小虎",
          ck: '是',
          zt: '项目总结会议',
        },
        {
          rq: '2018-05-03',
          fjr: "管理员",
          ck: '否',
          zt: '会议通知',
        }],
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
