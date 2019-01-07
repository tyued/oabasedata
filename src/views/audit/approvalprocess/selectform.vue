<template>
  <div class="app-container calendar-list-container">

    <el-button class="filter-item" style="margin-left: 10px;" type="primary"  @click="bcspmb(1)" :disabled="changeSure">保存</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="bcspmb(0)" :disabled="changeSure">保存并启用</el-button>

    <div class="container-main">
        <div class="container-mleft">
            <h3>表单模板</h3>
            <el-tabs :tab-position="tabPosition" v-model="activeName">
                <el-tab-pane v-for="(item,index) in list" :key="index" :label="item.bdmc" :name="item.bdid" >
                  <div class="phoneBox">
                    <div class="phoneBoxCon">
                      <div class="formborder-view" v-for="(element,i) in item.bdxList" :key="index + i" v-show="element.bdbm!='sqr'">
                        <label>{{element.bdmc}}</label>
                        <span class="span-input" v-if="element.bdxlx==1||element.bdxlx==2||element.bdxlx==3">{{element.bdxlx==3?"":"请选择（必填）"}}</span>
                        <span class="span-textarea" v-if="element.bdxlx==4">请选择（必填）</span>
                        <i class="el-icon-arrow-right" v-if="element.bdxlx==1||element.bdxlx==2"></i>
                        <span class="span-file" v-if="element.bdxlx==5"><i class="el-icon-document"></i></span>
                        <span class="span-file" v-if="element.bdxlx==6"><i class="el-icon-picture-outline"></i></span>
                        <!--<el-select v-model ="element.bdxywz" v-if="element.bdxlx==1">-->
                          <!--<el-option-->
                            <!--v-for="item in element.selectArr"-->
                            <!--:key="item"-->
                            <!--:label="item"-->
                            <!--:value="item">-->
                          <!--</el-option>-->
                        <!--</el-select>-->
                        <!--<el-date-picker v-else-if="element.bdxlx==2" type="datetime" placeholder="选择日期时间"> </el-date-picker>-->
                        <!--<el-input-number v-else-if="element.bdxlx==3" placeholder="选择日期时间"></el-input-number>-->
                        <!--<el-input v-else-if="element.bdbm=='sqr'" placeholder="请输入内容"></el-input>-->

                        <!-- - {{element.bdbm}} - {{element.bdxlx}}<br>-->
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="container-mright">
            <h3>表单设置</h3>
            <el-form ref="form" label-width="100px">
              <el-form-item label="审批名称">
                <el-input placeholder="请填写审批名称" maxLength="20" style="width: 190px;" v-model="lcmc"></el-input>
                <span>{{ wordcount }}/20</span>
              </el-form-item>

              <el-form-item label="选择分组">
                <el-select placeholder="请选择分组" v-model="lcdl">
                  <el-option label="出勤休假" value="lx1"></el-option>
                  <el-option label="人事管理" value="lx2"></el-option>
                  <el-option label="财务管理" value="lx6"></el-option>
                  <el-option label="教务管理" value="lx7"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          <div v-if="showqjlx">
            <hr>
            <h3>
              当前请假类型包括:
              <el-button class="filter-item" @click="holidayConfig" style="margin-left: 10px;" type="primary">前往修改</el-button>
            </h3>
            <el-table :data="tableList" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="假期名称">
        <template slot-scope="scope">
          <span>{{scope.row.jqmc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="请假单位">
        <template slot-scope="scope">
          <span>{{getValue('qjdw', scope.row.qjdw)}}</span>
        </template>
      </el-table-column>
    </el-table>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import * as bdxxApi from 'api/audit/approvalprocess/splcbd';
import * as mbxxApi from 'api/audit/approvalprocess/splcmbxx';
import { page } from 'api/audit/holidaymanager/index'
export default {
  name: 'audittemplate',
  data() {
    return {
      activeName: '',
      tabPosition: 'left',
      listLoading: false,
      dictMap: { qjdw: [{ id: '1', text: '按天请假' }, { id: '3', text: '按小时请假' }]},
      mbxl: '',
      mbid: '',
      xxdm: '',
      list: [],
      lcmc: '',
      lcdl: '',
      bdxlx: '',
      wordcount: 0,
      tableList: [],
      listQuery: {              // 分页
        page: 1,
        limit: 20,
        xxdm: ''
      },
      changeSure: false, // 防止重复提交
      showqjlx: false
    }
  },

  created() {
    this.xxdm = window.localStorage.getItem('xxdm');
    this.getParams();
    this.getTemplateInfoByLx();
    this.getTemplateInfoById();
    this.getList();
  },

  methods: {
    getTemplateInfoByLx() {
      if (this.mbxl) {
        bdxxApi.fzbd({ mbxl: this.mbxl, xxdm: this.xxdm }).then(response => {
          this.list = this.handleData(response);
          this.activeName = this.list[0].bdid;
        });
      }
    },

    getTemplateInfoById() {
      console.log(this.mbid);
      if (this.mbid) {
        mbxxApi.mbbd(this.mbid).then(response => {
          this.list = this.handleData(response);
          this.lcmc = response.mbxx.lcmc;
          this.lcdl = response.mbxx.lcdl;
          this.mbxl = response.mbxx.lcxl;
          this.activeName = response.mbxx.bdid;
        });
      }
    },

    getParams() {
      // 取到路由带过来的参数放在当前组件的数据内
      this.mbxl = this.$route.query.mbxl;
      this.mbid = this.$route.query.mbid;
    },

    handleData(list) {
      const bdList = list.bdList;
      const bdxList = list.bdxList;
      bdList.forEach(bdItem => {
        const bdid = bdItem.bdid;
        bdItem.bdxList = [];
        bdxList.forEach(bdxItem => {
          const id = bdxItem.bdid;
          if (bdid === id) {
            bdItem.bdxList.push(bdxItem);
          }
        });
      });
      this.checksfqj(bdxList);
      return bdList;
    },

    getList() {
      this.listLoading = true;
      this.listQuery.xxdm = this.xxdm;
      page(this.listQuery).then(response => {
        this.tableList = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },

    getValue(type, key) {
      const data = this.dictMap[type];
      return _.find(data, { id: key }).text;
    },

    holidayConfig() {
      this.$router.push('/auditManager/holidayManager');
    },

    watchWordcount() {
      this.wordcount = this.lcmc.length;
    },
    bcspmb(mbzt) {
      const mbxx = {};
      mbxx.lcmc = this.lcmc;
      mbxx.lcdl = this.lcdl;
      mbxx.lcxl = this.mbxl;
      mbxx.bdid = this.activeName;
      mbxx.xxdm = this.xxdm;
      mbxx.lczt = mbzt;
      if (mbxx.lcmc === '' || mbxx.lcdl === '' || mbxx.bdid === '') {
        this.$message({ type: 'warning', message: '请完整填写模板表单信息!' });
        return false;
      }
      if (this.mbid) {
        this.changeSure = true;
        mbxx.mbid = this.mbid;
        mbxxApi.updateLcmb(mbxx).then(res => {
          if (res.status === 200) {
            this.$router.push({ name: '审批流程' });
          } else {
            this.$message({ type: 'warning', message: res.message });
          }
        });
        const that = this;
        setTimeout(() => {
          that.changeSure = false;
        }, 1500);
      } else {
        this.changeSure = true;
        mbxxApi.addLcmb(mbxx).then(res => {
          if (res.status === 200) {
            this.$router.push({ name: '审批流程' });
          } else {
            this.$message({ type: 'warning', message: res.message });
          }
        });
        const that = this;
        setTimeout(() => {
          that.changeSure = false;
        }, 1500);
      }
    },
    checksfqj(bdxList) {
      const bdxx = _.find(bdxList, { bdbm: 'qjlx' });
      if (bdxx) {
        this.showqjlx = true;
      }
    }
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: 'getParams',
    lcmc: 'watchWordcount'
  }
}
</script>
<style scoped>
.phoneBox{
  background: url("/static/img/phonebg.png") no-repeat top center;
  height: 766px;
  width: 421px;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  position: relative;
}
.phoneBoxCon{
  position: absolute;
  left: 38px;
  top: 84px;
  right: 38px;
  bottom: 0;
  max-height: 548px;
  background: #f0eff4;
  overflow-x: hidden;
  overflow-y: auto;
}
.el-tabs--left .el-tabs__header.is-left{
  margin-top: 80px;
}
.formborder-view{
  position: relative;
  border-width: 1px 0;
  border-style: solid;
  border-color: #c8c8ca transparent;
  background: #fff;
  padding: 15px;
  white-space: nowrap;
  margin-bottom: 12px;
}
.formborder-view:first-child{
  margin-top: 12px;
}
.formborder-view label{
  display: inline-block;
  width: 5.5em;
  padding: 0 8px 0 0;
  color: #222;
  font-size: 16px;
  white-space: normal;
  word-break: break-word;
  vertical-align: top;
  font-weight: normal;
}
.formborder-view span{
  color: #ccc;
  font-size: 15px;
  vertical-align: top;
}
.formborder-view span.span-input{
  position: absolute;
  right: 50px;
  top: 16px;
}
.formborder-view span.span-textarea{
  height: 50px;
  display: inline-block;
}
.formborder-view i{
  position: absolute;
  right: 15px;
  top: 15px;
  color: #e0e0e0;
  font-size: 24px;
}
.container-main{
  position: relative;
}
.container-mleft{
  float: left;
  width: 580px;
}
.container-mright{
  position: absolute;
  float: left;
  width: 100%;
  padding-left: 580px;
  min-width: 950px;
  max-width: 1200px;
}
</style>
