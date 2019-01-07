<template>
<div class="app-container">
    <el-row>
        <el-col :span="24">
            <div class="znxhead">
                <el-button type="primary">校产登记</el-button>
                <div class="znxhead-other fr">
                    <el-input placeholder="请输入内容" v-model="txt1" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>

            <div class="tableControl mt20">
                <el-button type="info" plain size="small">修改</el-button>
                <el-button type="info" plain size="small">删除</el-button>
            </div>
            <el-table :data="tableData3" border style="width: 100%" class="mailtable">
                <el-table-column type="selection" width="35">
                </el-table-column>
                <el-table-column prop="cphm" sortable label="车牌号码" width="300">
                </el-table-column>
                <el-table-column prop="clxh" sortable label="车辆型号">
                </el-table-column>
                <el-table-column prop="grrq" sortable label="购入日期">
                </el-table-column>
                <el-table-column prop="gmjg" sortable label="购买价格">
                </el-table-column>
                <el-table-column prop="zws" sortable label="座位数">
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
            cphm: '浙A486HH',
            clxh: "大众",
            grrq: '2017-09-26',
            gmjg:"20",
            zws:"4",
            sfqy:"是",
        },{
            cphm: '浙B785KK',
            clxh: "奥迪",
            grrq: '2017-09-26',
            gmjg:"50",
            zws:"4",
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
