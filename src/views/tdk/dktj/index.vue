<template>
  <section>
    <div style="padding: 20px">
      <el-form :inline="true" :model="dkxx" class="demo-form-inline">
        <el-form-item>
          <el-date-picker
            v-model="dkxx.dkrq"
            type="month"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dkxx.dkr" filterable placeholder="请选择"
                     @change="handleChangeSel"
                     clearable >
            <el-option
              v-for="item in jslist"
              :key="item.gh"
              :label="item.xm"
              :value="item.gh">
            </el-option>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-button type="primary" icon="el-icon-download" @click="handleDownload" >
          导出
        </el-button>
      </el-form>
      <el-table
        :data="tableData"
        @row-click="hanldRowClick"
        border
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="60">
        </el-table-column>
        <el-table-column
          prop="gh"
          label="教职工号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="xm"
          label="代课人">
        </el-table-column>
        <el-table-column
          prop="jc"
          label="代课节次">
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" style="margin-top: 2px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="dkxx.query.page" :page-sizes="[8,12,16,20]"
                       :page-size="dkxx.query.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-col>
      <!--新增界面-->
      <el-dialog title="代课详细" :visible.sync="dialogForm" width="25%" @close="colseDialog" center>
        <el-form label-width="80px" class="demo-ruleForm">
          <el-form-item label="教职工号" prop="ksmc">
                <span>{{temp.gh}}</span>
          </el-form-item>
          <el-form-item label="代课人" prop="ksxn">
                <span>{{temp.xm}}</span>
          </el-form-item>
          <el-form-item label="节次" prop="ksxq">
                <span>{{temp.jc}}</span>
          </el-form-item>
          <el-form-item label="代课日期" prop="ksxq">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template v-if="dksjList.length>0" v-for="(item,index) in dksjList" >
                  <div>{{item.dkrq}}&nbsp;&nbsp;{{item.dkzc|getToDkmc}}&nbsp;&nbsp;第{{item.dkjc}}节&nbsp;&nbsp;{{item.dkkc}}课</div>
                </template>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
        </el-form>

      </el-dialog>
    </div>
  </section>
</template>
<script>
  import * as api from 'api/tdk/dktj/index';
  import jcsj from '@/api/jcsj'
  import UploadExcelComponent from '@/components/UploadExcel/index'
  export default {
    name: 'uploadExcel',
    components: { UploadExcelComponent },
    data() {
      return {
        xxdm: window.localStorage.getItem('xxdm'),
        usercode: window.localStorage.getItem('usercode'),
        dialogForm: false,
        total: 0,
        dkxx: {
          dkr: '',
          dkrq: '',
          xxdm: '',
          zgh: '',
          shzt: '0',
          query: {
            page: 1,
            limit: 12
          }
        },
        formInline: {
          user: '',
          region: ''
        },
        tableData: [],
        value14: '',
        options: [],
        value8: '',
        jslist: [],
        multipleLimit: 5,
        temp: {
          gh: '',
          xm: '',
          jc: ''
        },
        activeNames: '1',
        dksjList: [],
        kcList: []
      }
    },
    filters: {
      getToDkmc(v) {
        let value = '';
        switch (v) {
          case '1':
            value = '星期一'
            break;
          case '2':
            value = '星期二'
            break;
          case '3':
            value = '星期三'
            break;
          case '4':
            value = '星期四'
            break;
          case '5':
            value = '星期五'
            break;
          case '6':
            value = '星期六'
            break;
          case '7':
            value = '星期日'
            break;
          default:
            value = '无效参数'
        }
        return value;
      }
    },
    created() {
      this.init();
      /** 初始化统计列表 **/
      this.dkxx.xxdm = this.xxdm;
      this.dkxx.zgh = this.usercode;
      this.list(this.dkxx);
      /** 获取课程**/
      jcsj.hqkclb({ xxdm: this.xxdm }).then(res => {
        this.kcList = res;
      })
    },
    methods: {
      async init() {
        /** 获取教师**/
        this.jslist = await jcsj.hqjslb({ xxdm: this.xxdm });
      },
      list() {
        api.queryPageList(this.dkxx).then(res => {
          this.total = res.data.total;
          const list = res.data.rows.map(e => ({
            jlid: e.jlid,
            gh: e.dkr,
            xm: jcsj.hqjsmcByid(this.jslist, e.dkr),
            jc: e.dkjc
          }))
          this.tableData = list;
        })
      },
      onSubmit() {
        this.list(this.dkxx);
      },
      handleChangeSel() {
        this.list();
      },
      handleSizeChange(val) {
        /** 跳转到某页**/
        this.dkxx.query.limit = val;
        this.list();
      },
      handleCurrentChange(val) {
        /** 跳转到某页**/
        this.dkxx.query.page = val;
        this.list();
      },
      handleDownload() { /** @下载Excel数据 **/
        /** 下载excel**/
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['教职工号', '代课人', '代课节数'];
          const filterVal = ['gh', 'xm', 'jc'];
          const data = this.formatJson(filterVal, this.tableData)
          excel.export_json_to_excel(tHeader, data, this.dkxx.dkrq !== '' ? this.dkxx.dkrq + '代课统计表格' : '全校代课统计表格')
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      hanldRowClick(row) {
        this.temp.gh = row.gh;
        this.temp.xm = row.xm;
        this.temp.jc = row.jc;
        api.getDkInfo({ xxdm: this.xxdm, jlid: row.jlid, dkr: row.gh, dkrq: this.dkxx.dkrq }).then(res => {
          this.dksjList = res.data.map(item => ({
            dkrq: item.dkrq,
            dkzc: item.dkzc,
            dkjc: item.dkjc,
            dkkc: jcsj.hqkcmcByid(this.kcList, item.dkkc)
          }))
        })
        this.dialogForm = true;
      },
      colseDialog() {
        this.dialogForm = false;
      },
      handleChange(val) {
        console.log(val);
      }
    }
  }
</script>
