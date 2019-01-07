<template>
<div class="app-container">
    <el-row>
        <el-col :span="24">
            <div class="znxhead">
                <el-button type="info" plain size="small">回执</el-button>
                <el-button type="info" plain size="small">催办</el-button>
                <div class="znxhead-other fr">
                    <el-input size="small" placeholder="请输入内容" v-model="txt1" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>
            <el-table :data="tableData3" border style="width: 100%" class="mailtable">
                <el-table-column type="selection" width="35">
                </el-table-column>
                <el-table-column prop="sqmc" sortable label="申请名称" width="150">
                </el-table-column>
                <el-table-column prop="wpmc" sortable label="物品名称">
                </el-table-column>
                <el-table-column prop="sl" sortable label="数量">
                </el-table-column>
                <el-table-column prop="gj" sortable label="估价(元)">
                </el-table-column>
                <el-table-column prop="sqr" sortable label="申请人">
                </el-table-column>
                <el-table-column prop="sqsj" sortable label="申请时间">
                </el-table-column>
                <el-table-column prop="sqjg" sortable label="申请结果" :filters="[{ text: '审核中', value: '审核中' }, { text: '未审核', value: '未审核' }, { text: '通过', value: '通过' }, { text: '不通过', value: '不通过' }]" :filter-method="filterTag" filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag
                        :type="scope.row.sqjg === '审核中' ? 'danger' : scope.row.sqjg === '未审核'? '':scope.row.sqjg === '通过'? 'success':'info'"
                        disable-transitions>{{scope.row.sqjg}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="mqzk" sortable label="目前状况">
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
            sqmc: '笔记本电脑',
            wpmc: "笔记本电脑",
            sl: '3',
            gj:"4500",
            sqr:"袁艳君",
            sqsj:"2017-12-01 15:25:14",
            sqjg:"审核中",
            mqzk:"",
        },{
            sqmc: '笔记本',
            wpmc: "笔记本",
            sl: '10',
            gj:"20",
            sqr:"测试",
            sqsj:"2017-12-01 15:25:14",
            sqjg:"未审核",
            mqzk:"",
        },{
            sqmc: '档案夹',
            wpmc: "档案夹",
            sl: '10',
            gj:"60",
            sqr:"徐武",
            sqsj:"2017-12-01 15:25:14",
            sqjg:"通过",
            mqzk:"采购中",
        },{
            sqmc: '圆珠笔',
            wpmc: "圆珠笔",
            sl: '3',
            gj:"15",
            sqr:"陆克县",
            sqsj:"2017-12-01 15:25:14",
            sqjg:"不通过",
            mqzk:"",
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
