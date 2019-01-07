<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="BookName" label="书名" width="180">
      </el-table-column>
      <el-table-column prop="className" label="所属年级">
      </el-table-column>
      <el-table-column v-if="HaveTerm == 0" prop="gradeName" label="所属学期">
      </el-table-column>
      <el-table-column prop="states" label="是否已经设置">
      </el-table-column>
      <el-table-column prop="done" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="goToEchart(scope.row)">设置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-row>
      <PageBar :currentpage="CurrentPage" @handlePageSize="handleCurrentPageSize" @handlePage="handleCurrentPage" :total="TotalPage"></PageBar>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import * as api from "api/publicLibManager";
import PageBar from "views/readgrade/publicLibManager/PageBar/index";
import { getGradeState, getSchoolCode } from "utils/getNjBjXq.js";
export default {
  props: ["ClassIdx", "BookId"],
  components: {
    PageBar
  },
  async created() {
    this.xxdm = getSchoolCode()
    this.HaveTerm = await getGradeState(this.xxdm);
    this.getTable();
  },
  data() {
    return {
      xxdm: null,
      HaveTerm: 2,
      tableData: [],
      CurrentPage: 0,
      TotalPage: 0,
      size: 10
    };
  },
  methods: {
    handleCurrentPage(number) {
      this.getTable(number);
      this.CurrentPage = number;
    },
    handleCurrentPageSize(number) {
      this.size = number
      this.getTable(1, number);
      this.CurrentPage = 1;
    },
    goToEchart(item) {
      // console.log(item)
      // this.$emit('handlePush', item)
      this.$router.push({
        path: "/testManager/paperSetting/echart",
        query: {
          BookId: item.ID,
          Class: item.Class
        }
      });
    },
    getTable(Page = 1, PageSize = this.size) {
      let list;
      api
        .getBookId({
          SchoolCode: this.xxdm,
          Page,
          PageSize,
          Class: this.ClassIdx
        })
        .then(res => {
          if (res.State == 1 && res.Value) {
            this.CurrentPage = res.Value.CurrentPage;
            this.TotalPage = res.Value.TotalItemCount;
            list = res.Value.List;
            list.forEach(item => {
              switch (item.Class) {
                case 1:
                  item.className = "一年级";
                  break;
                case 2:
                  item.className = "二年级";
                  break;
                case 3:
                  item.className = "三年级";
                  break;
                case 4:
                  item.className = "四年级";
                  break;
                case 5:
                  item.className = "五年级";
                  break;
                case 6:
                  item.className = "六年级";
                  break;
              }
              switch (item.Grade) {
                case 1:
                  item.gradeName = "上学期";
                  break;
                case 2:
                  item.gradeName = "下学期";
                  break;
              }
            });
            this.tableData = list;
            this.tableData.forEach(item => {
              api
                .getRuleInfo({
                  BookID: item.ID
                })
                .then(res => {
                  if (res.Value.IsSave == 0) {
                    this.$set(item, "states", "否");
                  } else if (res.Value.IsSave == 1) {
                    this.$set(item, "states", "是");
                  }
                });
            });
          }
        });
    }
  }
};
</script>

