<template>
  <section>
    <div style="padding: 20px">
 <!-- <el-button class="lvrudaike" type="primary" @click="renderlvru">录入代课</el-button>
  <el-button @click="deleteDk" type="danger">删除</el-button>
  <div class="rightHandel">
    <el-select class="optionSel" @change="changeSel" v-model="selValue" placeholder="审批状态">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
     <el-autocomplete
      class="inline-input searchInput"
      v-model="input21"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      :trigger-on-focus="false"
      @select="handleSelect"
      prefix-icon="el-icon-search"
    >
    <template slot-scope="item">
      <div class="name">{{ item.item.xm }}</div>
    </template>
    </el-autocomplete>
  </div>-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select class="optionSel" @change="changeSel" v-model="selValue" placeholder="审批状态" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <!--<el-autocomplete
          class="inline-input searchInput"
          v-model="input21"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          @select="handleSelect"
          prefix-icon="el-icon-search"
        ></el-autocomplete>-->
        <el-select v-model="input21" filterable placeholder="请选择"
                   @change="handleSelect"
                   clearable >
          <el-option
            v-for="item in teacherList"
            :key="item.gh"
            :label="item.xm"
            :value="item.gh">
          </el-option>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="renderlvru">录入代课</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="deleteDk" type="danger">删除</el-button>
      </el-form-item>
    </el-form>
  <el-table
    :v-loading="loading"
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%" border stripe
    @row-click="hanldRowClick"
    @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        width="70"
        type="index"
        >
      </el-table-column>
      <el-table-column
        label="序号"
        width="120"
        prop="jlid"
        v-if="showjlid"
        >
      </el-table-column>
      <el-table-column
        prop="name"
        label="发起人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="bdkr"
        label="被带课人"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="dkkc"
        label="代课课程"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="dkjs"
        label="代课节数"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="dkr"
        label="代课人"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="审批状态"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button v-if="scope.row.spzt == 1" type="primary" size="mini" round  >审批中</el-button>
          <el-button v-else-if="scope.row.spzt == 2" type="info" size="mini" round  >已撤销</el-button>
          <el-button v-else-if="scope.row.spzt == 3" type="success" size="mini" round  >审批通过</el-button>
          <el-button v-else-if="scope.row.spzt == 4" type="danger" size="mini" round  >审批拒绝</el-button>
         <!-- <div v-if="scope.row.spzt == 3" class="indexhandelPass">
            通过
          </div>
          <div v-else-if="scope.row.spzt == 1" class="passing">
            审批中
          </div>
          <div v-else-if="scope.row.spzt == 2" class="noPass">
            撤销
          </div>
         &lt;!&ndash; <div v-else-if="scope.row.spzt == 0" class="noPass">
            未审核
          </div>&ndash;&gt;
           <div v-else-if="scope.row.spzt == 4" class="noPass">
            不通过
          </div>-->
        </template>
      </el-table-column>
      <el-table-column
        prop="clsj"
        label="创建时间"
        show-overflow-tooltip>
      </el-table-column>
  </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="dkxx.query.page" :page-sizes="[10,15,20,25,30]"
                       :page-size="dkxx.query.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
   <!-- <el-date-picker
      v-model="value"
      type="date"
      placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-M-d" @change="changeVal">
    </el-date-picker> -->
   <!--审核界面-->
      <page-splimx ref="pageSplimx"></page-splimx>
  </div>
  </section>
</template>

<script>
import * as api from '@/api/tdk/tk'
import jcsj from '@/api/jcsj'
import pageSplimx from '@/components/shmb/spmx';
export default {
  components: { pageSplimx },
  data() {
    return {
      loading: true,
      tableData: [],
      value: '',
      isToday: false,
      selValue: '',
      options: [{
        value: '1',
        label: '审批中'
      }, {
        value: '2',
        label: '撤销'
      }, {
        value: '3',
        label: '通过'
      }, {
        value: '4',
        label: '不通过'
      }],
      input21: '',
      dkxx: {
        xxdm: '',
        shzt: '',
        zgh: '',
        type: '',
        query: {
          page: 1,
          limit: 10
        }
      },
      xxdm: window.localStorage.getItem('xxdm'),
      username: window.localStorage.getItem('username'),
      teacherList: '',
      total: 0,
      multipleSelection: [],
      restaurants: '',
      dialogForm: false, // 是否显示代课审核弹框------
      slztEnum: { SPZ: 1, // 审批中
        SPCX: 2, // 审批撤销
        SPTG: 3, // 审批通过
        SPJJ: 4 // 审批拒绝
      },
      bzztEnum: { DSP: 1, // 待审批
        SPWC: 2, // 审批完成
        WSP: 3, // 未审批
        HQWC: 4// 或签自动完成
      },
      kcList: '',
      slid: '',
      showjlid: false,
      type: 0
    };
  },
  created() {
    jcsj.remove(jcsj.KC_KEY);
    jcsj.remove(jcsj.JS_KEY);
    /** 初始化当前学校代码和用户名**/
    this.dkxx.xxdm = window.localStorage.getItem('xxdm');
    this.dkxx.username = window.localStorage.getItem('username');
    this.dkxx.type = window.localStorage.getItem('lguserType');
    this.dkxx.sqr = window.localStorage.getItem('usercode');
    this.initData();
  },
  methods: {
    async initData() {
       /** 获取学校所有教师**/
      this.teacherList = await jcsj.hqjslb({ xxdm: this.xxdm });
       /** 获取课程**/
      this.kcList = await jcsj.hqkclb({ xxdm: this.xxdm });
       /** 代课列表**/
      this.queryPageList();
    },
    // changeVal() {
    //   let choose = this.value.split("-"),
    //     now = this.format().split("-");
    //   if (choose[0] == now[0] && choose[1] == now[1] && choose[2] == now[2]) {
    //     this.isToday = true;
    //   } else {
    //     this.isToday = false;
    //   }
    // },
    // format() {
    //   let date = new Date(),
    //     year = date.getFullYear(),
    //     month = date.getMonth(),
    //     day = date.getDate();
    //   return year + "-" + (month + 1) + "-" + day;
    // },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    renderlvru() { // 保存验证流程模板是否创建
      api.validaSplc({ xxdm: this.xxdm }).then(res => {
        if (res.status === 200) { // typeof(res.data) == 'undefined' || res.data == ''
          window.localStorage.setItem('rdkmb', res.data.mbid)
          if (typeof res.data.mbid != 'undefined' && res.data.mbid != '') {
            this.$router.push({ path: '/dkdetail', query: { isgly: res.data.isJwc } })
          } else {
            this.$message({
              message: '警告，您没有创建模板',
              type: 'warning'
            });
          }
        }
      })
    },
    queryPageList() { // 获取列表
      const that = this;
      this.loading = true;
      api.queryPageList(that.dkxx).then(res => {
        this.loading = false;
        if (res.status === 200) {
          const pageData = res.data.rows;
          that.total = res.data.total;
          that.tableData = pageData;
          that.tableData.forEach((item, index) => {
            that.$set(that.tableData, index, {
              name: that.username,
              bdkr: jcsj.hqjsmcByid(that.teacherList, item.yskr),
              dkkc: jcsj.hqkcmcByid(that.kcList, item.dkkc),
              dkjs: item.dkjc,
              dkr: jcsj.hqjsmcByid(that.teacherList, item.dkr),
              clsj: item.clsj,
              spzt: parseInt(item.shzt),
              jlid: item.jlid,
              slid: item.slid
            })
          })
        }
      })
    },
    handleSizeChange(val) {
      this.dkxx.query.limit = val
      this.queryPageList();
    },
    handleCurrentChange(val) {
      this.dkxx.query.page = val
      this.queryPageList();
    },
    deleteDk() { // 删除代课信息
      const arr = [];
      this.multipleSelection.forEach((item, index) => {
        arr.push(item.jlid)
      })
      if (this.multipleSelection.length > 0) {
        /** 删除**/
        this.$confirm('删除后数据不可恢复，确认要删除吗？', '提示', { type: 'warning' }).then(() => {
          api.deleteDk(arr).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.queryPageList();
            } else {
              this.$message.error('删除失败，请重试！');
            }
          })
        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择一条数据',
          type: 'warning'
        });
      }
    },
    changeSel() { // 根据状态搜索
      this.dkxx.shzt = this.selValue;
      this.queryPageList();
    },
    querySearch(queryString, cb) {
      const restaurants = this.teacherList;
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => restaurant.xm.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    },
    handleSelect() {
      this.dkxx.zgh = this.input21;
      this.queryPageList();
    },
    hanldRowClick(row) { // 代课审核
      this.$nextTick(() => {
        this.$refs.pageSplimx.init(row.slid);
      })
    },
    colseDialog() {
      this.dialogForm = false;
    }

  }
};
</script>

<style>
  .lvrudaike{
    margin:1rem;
  }
  .rightHandel{
    width:470px;
    float: right;
    margin-top: 1rem;
  }
  .searchInput{
    width: 250px !important;
  }
  .optionSel{
    width: 200px;
  }
  .indexhandelPass{
    width: 70px;
    height: 30px;
    background-color: #eff9ec;
    border: 1px solid #d3eecc;
    color:#63c249;
    text-align: center;
    line-height: 30px;
    margin: 0 auto;
    border-radius: 5px;
  }

  .passing{
    width: 70px;
    height: 30px;
    background-color: #fcf6ec;
    border: 1px solid #f7e5cb;
    color:#e8ac65;
    text-align: center;
    line-height: 30px;
    margin: 0 auto;
    border-radius: 5px;
  }

  .noPass{
    width: 70px;
    height: 30px;
    background-color: #fef0f0;
    border: 1px solid #fcd5d5;
    color:#f77474;
    text-align: center;
    line-height: 30px;
    margin: 0 auto;
    border-radius: 5px;
  }
  .el-table th>.cell{
    text-align: center !important;
  }
  .el-table .cell{
    text-align: center !important;
  }
  .el-pagination{
    margin-top:20px;
    margin-left:20px;
  }
  .splcModel .el-form-item__label{
    font-size: 12px;
    color: #606266c4;
  }
</style>
