<template>
<div class="app-container">
    <el-row>
        <el-col :span="24">
            <div class="znxhead">
                <el-button type="primary">报修申请</el-button>
                <div class="znxhead-other fr">
                    <el-input placeholder="请输入内容" v-model="txt1" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>

            <div class="tableControl mt20">
                <el-button type="info" plain size="small">修改</el-button>
                <el-button type="info" plain size="small">删除</el-button>
                <el-button type="info" plain size="small">评价</el-button>
            </div>
            <el-table :data="tableData3" border style="width: 100%" class="mailtable">
                <el-table-column type="selection" width="35">
                </el-table-column>
                <el-table-column prop="bxwp" sortable label="报修物品" width="150">
                </el-table-column>
                <el-table-column prop="bxdd" sortable label="报修地点">
                </el-table-column>
                <el-table-column prop="yysj" sortable label="预约时间" width="250">
                </el-table-column>
                <el-table-column prop="fzr" sortable label="负责人">
                </el-table-column>
                <el-table-column prop="clsj" sortable label="处理时间">
                </el-table-column>
                <el-table-column prop="sfpj" sortable label="是否评价">
                </el-table-column>
                <el-table-column prop="clzt" sortable label="处理状态" :filters="[{ text: '尚未处理', value: '尚未处理' }, { text: '无法维修', value: '无法维修' }, { text: '正在维修', value: '正在维修' }, { text: '维修完成', value: '维修完成' }]" :filter-method="filterTag" filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag
                        :type="scope.row.clzt === '维修完成' ? 'success' : scope.row.clzt === '正在维修'? '':scope.row.clzt === '尚未处理'? 'info':'danger'"
                        disable-transitions>{{scope.row.clzt}}</el-tag>
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
            bxwp: '电脑',
            bxdd: "七年(15)班",
            yysj: '2017-09-26 14：21',
            fzr:"刘影",
            clsj:"",
            sfpj:"否",
            clzt:"尚未处理",
        },{
            bxwp: '桌子',
            bxdd: "302教室",
            yysj: '2017-09-26 14：21',
            fzr:"袁艳君",
            clsj:"",
            sfpj:"否",
            clzt:"无法维修",
        },{
            bxwp: '笔记本',
            bxdd: "教务处",
            yysj: '2017-09-26 14：21',
            fzr:"刘影",
            clsj:"",
            sfpj:"否",
            clzt:"正在维修",
        },{
            bxwp: '桌子',
            bxdd: "三年级(3)班",
            yysj: '2017-09-26 14：21',
            fzr:"袁艳君",
            clsj:"",
            sfpj:"否",
            clzt:"维修完成",
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
