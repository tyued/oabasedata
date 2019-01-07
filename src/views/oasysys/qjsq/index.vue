<template>
<div class="app-container">
    <el-row>
        <el-col :span="24">
            <div class="znxhead">
                <el-button type="primary">请假申请</el-button>
                <div class="znxhead-other fr">
                    <el-input placeholder="请输入内容" v-model="txt1" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>

            <div class="tableControl mt20">
                <el-button type="info" plain size="small">修改</el-button>
                <el-button type="info" plain size="small">删除</el-button>
                <el-button type="info" plain size="small">催办</el-button>
            </div>

            <el-table :data="tableData3" border style="width: 100%" class="mailtable">
                <el-table-column type="selection" width="35">
                </el-table-column>
                <el-table-column prop="qjlx" sortable label="请假类型" width="250">
                </el-table-column>
                <el-table-column prop="qjsc" sortable label="请假时长" width="250">
                </el-table-column>
                <el-table-column prop="sqsj" sortable label="申请时间" width="250">
                </el-table-column>
                <el-table-column prop="jdlc" sortable label="流程进度">
                </el-table-column>
                <el-table-column prop="shr" sortable label="当期审核人">
                </el-table-column>
                <el-table-column prop="sqjg" sortable label="申请结果" :filters="[{ text: '未审核', value: '未审核' }, { text: '审核中', value: '审核中' }, { text: '通过', value: '通过' }]" :filter-method="filterTag" filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag
                        :type="scope.row.sqjg === '未审核' ? 'warning' : scope.row.sqjg === '审核中'? 'danger':'success'"
                        disable-transitions>{{scope.row.sqjg}}</el-tag>
                    </template>
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
            qjlx: '事假',
            qjsc: "1小时",
            sqsj: '2017-12-07 15:45:02',
            jdlc:"第1步/共1步",
            shr:"校管理员",
            sqjg:"审核中"
        },{
            qjlx: '事假',
            qjsc: "1天",
            sqsj: '2017-12-07 15:45:02',
            jdlc:"第1步/共2步",
            shr:"方婷",
            sqjg:"未审核"
        },{
            qjlx: '事假',
            qjsc: "2小时",
            sqsj: '2017-12-07 15:45:02',
            jdlc:"第1步/共1步",
            shr:"袁艳君",
            sqjg:"通过"
        },{
            qjlx: '事假',
            qjsc: "1小时",
            sqsj: '2017-12-07 15:45:02',
            jdlc:"第1步/共1步",
            shr:"校管理员",
            sqjg:"审核中"
        }
        ],
    }
  },
  mounted: function(){
    

  },
  methods: {
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/oasysys.scss";


</style>
