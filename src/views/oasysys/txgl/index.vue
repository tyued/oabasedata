<template>
<div class="app-container">
    <el-row>
        <el-col :span="24">
            <div class="znxhead">
                <el-button type="info" plain size="small">设置</el-button>
                <el-button type="info" plain size="small">时间折算</el-button>
                <el-button type="info" plain size="small">批量添加</el-button>
                <div class="znxhead-other fr">
                    <el-input size="small" placeholder="请输入内容" v-model="txt1" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>

            <el-table :data="tableData3" border style="width: 100%" class="mailtable">
                <el-table-column type="selection" width="35">
                </el-table-column>
                <el-table-column prop="zgh" sortable label="职工号" width="200">
                </el-table-column>
                <el-table-column prop="xm" sortable label="姓名">
                </el-table-column>
                <el-table-column prop="xb" sortable label="性别">
                </el-table-column>
                <el-table-column prop="bm" sortable label="部门">
                </el-table-column>
                <el-table-column prop="kytx" sortable label="可用调休">
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
            zgh: '101',
            xm: "方婷",
            xb: '女',
            bm:"教导处",
            kytx:"0小时",
        },{
            zgh: '102',
            xm: "金一凡",
            xb: '女',
            bm:"教务处",
            kytx:"0小时",
        },{
            zgh: '103',
            xm: "刘怀",
            xb: '女',
            bm:"教务处",
            kytx:"0小时",
        },{
            zgh: '104',
            xm: "刘影",
            xb: '女',
            bm:"教务处",
            kytx:"0小时",
        },{
            zgh: '105',
            xm: "胡洪兵",
            xb: '女',
            bm:"教务处",
            kytx:"0小时",
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
