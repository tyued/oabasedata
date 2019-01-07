<template>
<div class="app-container">
    <el-row>
        <el-col :span="24">
            <div class="tableControl mt20">
                <el-button icon="el-icon-search" type="primary" plain size="small">查看</el-button>
                <el-button icon="el-icon-plus" type="primary" plain size="small">增加</el-button>
                <el-button icon="el-icon-edit" type="primary" plain size="small">修改</el-button>
                <el-button icon="el-icon-delete" type="primary" plain size="small">删除</el-button>
                <el-button icon="el-icon-success
" type="primary" plain size="small">启用</el-button>
                <el-button icon="el-icon-error" type="primary" plain size="small">停用</el-button>
            </div>
            <el-table :data="tableData3" border style="width: 100%" class="mailtable">
                <el-table-column type="selection" width="35">
                </el-table-column>
                <el-table-column prop="qmc" sortable label="群名称" width="300">
                </el-table-column>
                <el-table-column prop="qcys" sortable label="群成员数">
                </el-table-column>
                <el-table-column prop="fpdx" sortable label="分配大小">
                </el-table-column>
                <el-table-column prop="yydx" sortable label="已用大小">
                </el-table-column>
                <el-table-column prop="cjr" sortable label="创建人">
                </el-table-column>
                <el-table-column prop="cjsj" sortable label="创建时间">
                </el-table-column>
                <el-table-column prop="kfwwfw" sortable label="可否外网访问">
                </el-table-column>
                <el-table-column prop="sfqy" sortable label="是否启用">
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
            qmc: '数字校园',
            qcys: "3",
            fpdx: '5GB',
            yydx:"1.20MB",
            cjr:"袁艳君",
            cjsj:"2018-05-21",
            kfwwfw:"是",
            sfqy:"是",
        },{
            qmc: '群文件',
            qcys: "78",
            fpdx: '10GB',
            yydx:"0kb",
            cjr:"王慧",
            cjsj:"2018-05-21",
            kfwwfw:"是",
            sfqy:"是",
        },{
            qmc: '数字校园',
            qcys: "3",
            fpdx: '5GB',
            yydx:"1.20MB",
            cjr:"袁艳君",
            cjsj:"2018-05-21",
            kfwwfw:"是",
            sfqy:"是",
        },{
            qmc: '数字校园',
            qcys: "3",
            fpdx: '5GB',
            yydx:"1.20MB",
            cjr:"袁艳君",
            cjsj:"2018-05-21",
            kfwwfw:"是",
            sfqy:"是",
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
