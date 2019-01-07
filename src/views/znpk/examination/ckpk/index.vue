<template>
  <div class="ksxt_ckpk">
    <el-row style="margin-bottom: 10px;">
      <el-radio-group v-model="radio3" @change="changeNj">
        <el-radio-button :label="item.njdm" :key="item.njdm" v-for="(item, index) in cknjlist">{{item.label}}</el-radio-button>
      </el-radio-group>
      <div style="float: right;">
        <el-button type="primary" size="medium" icon="el-icon-download" @click="exportKcTable">导出考场表</el-button>
        <el-button type="primary" size="medium" icon="el-icon-download" @click="exportBjTable">导出班级表</el-button>
        <el-button type="primary" size="medium" icon="el-icon-download" @click="exportXszkzTable">导出准考证</el-button>
        <el-button type="primary" size="medium" icon="el-icon-download" @click="exportJkTable">导出监考表</el-button>
      </div>
    </el-row>
    <el-row class="ksxt_ckpk-main smallscroll" :gutter="10">
      <el-col :span="3">
        <el-card style="height:100%;" shadow="never">
          <div slot="header" class="clearfix">
            <span>选择考场</span>
          </div>
          <div class="pk-title-down smallscroll">
            <el-tabs tab-position="right"  v-model="activetcs" style="height: auto;" @tab-click="handleKcClick">
              <el-tab-pane :name="item.uuid" v-for="(item, index) in kskclist" :key="index">
                <span slot="label">{{item.kskcmc}}({{item.kchm}})</span>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
      <el-col class="smallscroll pk-ckpk-box" :span="13">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>{{xznjmc}}{{xzkc.kcmc}} 考场号：{{xzkc.kchm}}</span>
          </div>
          <el-row class="pk-title-down smallscroll" >
            <div class="pkbox" v-for="(item, index) in kcxslist">
              <div class="idbox">
                <span>{{item.zwh}}</span>
              </div>
              <template v-if="item.xszt === '0'">
                <div class="classbox">
                  <span>{{item.bjmc}}</span>
                </div>
                <div class="contentbox">
                  <p>{{item.xsxm}}</p>
                  <!--<p>{{item.xh}}</p>-->
                  <p>{{item.kh}}</p>
                </div>
              </template>
            </div>
          </el-row>
        </el-card>
      </el-col>
      <el-col class="smallscroll ckpk-content pk-down" :span="8">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>考试时间</span>
          </div>
          <div>
            <el-table :data="tableData" border style="width: 100%" :key='tableKey'>
              <el-table-column prop="rq" label="日期"></el-table-column>
              <!--<el-table-column prop="sw" label="上午"></el-table-column>-->
              <!--<el-table-column prop="xw" label="下午"></el-table-column>-->
              <el-table-column label="上午">
                <template slot-scope="scope">
                  <span v-html="scope.row.sw"></span>
                </template>
              </el-table-column>
              <el-table-column label="下午">
                <template slot-scope="scope">
                  <span v-html="scope.row.xw"></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card shadow="never" style="margin-top: 10px;">
          <div slot="header" class="clearfix">
            <span>监考老师</span>
          </div>
          <div class="smallscroll">
            <el-table ref="jklsTable" :data="tableData2" :span-method="arraySpanMethod">
              <el-table-column  label="日期" min-width="140" align="center">
                <el-table-column label="考场" min-width="70" align="center">
                  <template slot-scope="scope">
                  {{scope.row.kskcmc}}
                </template>
                </el-table-column>
                <el-table-column label="考场号" min-width="70" align="center">
                  <template slot-scope="scope">
                    {{scope.row.kchm}}
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column min-width="160" align="center"  v-for='(item,index) in tableData' :key='index' :label="item.rq">

                <template v-if="item.sw && item.sw.length > 0">
                  <el-table-column v-for='(km,index) in item.swkm' :label="km.sj" :key="index+'sw'" align="center" min-width="120">
                    <el-table-column :label="km.km" align="center" min-width="120">
                      <template slot-scope="scope">
                        {{scope.row[km.kskmid] ? scope.row[km.kskmid].kclsxm:''}}
                      </template>
                    </el-table-column>
                  </el-table-column>
                </template>
                <template v-if="item.xw && item.xw.length > 0">
                  <el-table-column v-for='(km,index) in item.xwkm' :label="km.sj" :key="index+'xw'" align="center" min-width="120">
                    <el-table-column :label="km.km" align="center" min-width="120">
                      <template slot-scope="scope">
                        {{scope.row[km.kskmid] ? scope.row[km.kskmid].kclsxm:''}}
                      </template>
                    </el-table-column>
                  </el-table-column>
                </template>
              </el-table-column>
           </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <table ref="kcbTable" cellpadding="0" cellspacing="0" class="zkbtable fl" style="display: none; width: 100%;height:500px" >
      <div v-for="xsItem of kcxszb" >
        <thead >
        <tr >
          <th align="center" style="font-family: 	KaiTi;font-size: large" :colspan="6">{{ksxx.ksmc}}{{xsItem.kcmc}}</th>
        </tr>
        <tr >
          <td colspan="6">
            <el-row style="font-size:16px;text-align:left;">考试时间</el-row>
            <el-row style="text-align:left;" v-for="(item,index) in tableData"　:key='index'>
              <span style="padding-right: 2rem;">{{item.rq}}     </span><span v-if="item.sw && item.sw.toString()">上午：{{item.sw.toString()}}     </span><span v-if="item.xw && item.xw.toString()">下午：{{item.xw.toString()}}</span>
            </el-row>
          </td>
        </tr>
        <tr>
          <th align="center">考场</th>
          <th align="center">班级</th>
          <th align="center">姓名</th>
          <th align="center">考场号</th>
          <th align="center">座位号</th>
          <th align="center">考号</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in xsItem.kcnjxslist"　:key='index'>
          <td>{{item.kskcmc}}</td>
          <td>{{item.bjmc}}</td>
          <td>{{item.xsxm}}</td>
          <td>&nbsp;{{item.kchm}}</td>
          <td>&nbsp;{{item.zwh}}</td>
          <td>&nbsp;{{item.kh}}</td>
        </tr>
        </tbody>
        <tr style="height: 180px"/>
      </div>
    </table>

    <table ref="njxszb_table_ref" cellpadding="0" cellspacing="0" class="zkbtable fl" style="display: none; width: 100%;height:500px" >
      <div v-for="xsItem of njxszb" >
        <thead >
        <tr >
          <th align="center" style="font-family: 	KaiTi;font-size: large" :colspan="7">{{ksxx.ksmc}}{{xsItem.bjmc}}</th>
        </tr>
        <tr>
          <th align="center">序号</th>
          <th align="center">考场</th>
          <th align="center">班级</th>
          <th align="center">姓名</th>
          <th align="center">考场号</th>
          <th align="center">座位号</th>
          <th align="center">考号</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in xsItem.bjxslist"　:key='index'>
            <td>{{index+1}}</td>
            <td>{{item.kskcmc}}</td>
            <td>{{item.bjmc}}</td>
            <td>{{item.xsxm}}</td>
            <td>&nbsp;{{item.kchm}}</td>
            <td>&nbsp;{{item.zwh}}</td>
            <td>&nbsp;{{item.kh}}</td>
          </tr>
        </tbody>
        <tr style="height: 180px"/>
      </div>
    </table>

    <div v-for="xsItem of xszkzb" 　:key='index'　ref="xszkzb_table_ref" style="display:none;">
      <table  cellpadding="0" cellspacing="0" class="zkbtable fl" style="width: 100%;height:80px;" >
          <thead >
          <tr >
            <th align="center" style="font-family: 	KaiTi;font-size: large" :colspan="4">{{ksxx.ksmc}}</th>
          </tr>
          <tr>
            <th align="center">姓名</th>
            <th align="center">考场号</th>
            <th align="center">座位号</th>
            <th align="center">考号</th>
          </tr>
          </thead>
          <tbody>
           <tr>
              <td>{{xsItem.xsxm}}</td>
              <td>&nbsp;{{xsItem.kchm}}</td>
              <td>&nbsp;{{xsItem.zwh}}</td>
              <td>&nbsp;{{xsItem.kh}}</td>
            </tr>
          </tbody>
      </table>
      <div>
        <template v-for="(item,index) in tableData">
          <el-row style="text-align:left;">
            <span style="padding-right: 2rem;">{{item.rq}}     </span><span v-if="item.sw.toString()">上午：{{item.sw.toString()}}     </span><span v-if="item.xw.toString()">下午：{{item.xw.toString()}}</span>
          </el-row>
        </template>
      </div>
      <table>
        <tr style="height: 180px"/>
      </table>
    </div>
  </div>
</template>
<script>
  import { getKsxx, getCknj, getKskc, getKcxsxx, getKsrq, getKskmsj, getXklsxxByKsid } from '@/api/znpk/examination/ckpk/index';
  import { getKclsxxByKsid } from '@/api/znpk/examination/pktz/index';
  import jcsj from '@/api/jcsj';

  export default {
    data() {
      return {
        jlid: this.$route.query.ksid,  // 当前考试代码
        xxdm: this.$route.query.xxdm,
        ksxx: {
          ksmc: ''
        },
        xznjmc: '',
        xzkc: {
          kcmc: '',
          kchm: ''
        },
        tempa: null,
        cknjlist: [],
        kskclist: [],
        kcxslist: [],
        njxslist: [],
        radio3: '',
        activetcs: '',
        kskmList: [],
        tableData: [],
        kcjkxx: [],
        all_kclsxx: [],
        all_xklsxx: [],
        tableData2: [],
        len: 0,
        tableKey: 0, // 表格
        njxszb: [],
        kcxszb: [],
        xszkzb: []
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      getKsxx(this.jlid).then(res => {
        this.ksxx = res;
      })
    },
    methods: {
      handleClick() {
        this.cknjlist = [];
        getCknj({ ksdxid: this.jlid }).then(res => {
          for (let a = 0; a < res.length; a++) {
            const obj = {};
            obj.label = jcsj.hqnjmcByid(this.njList, res[a]);
            obj.njdm = res[a];
            this.cknjlist.push(obj);
          }
          this.radio3 = res[0];
          this.xznjmc = jcsj.hqnjmcByid(this.njList, res[0]);
          /** 根据年级代码查询考场信息*/
          this.changeNj(res[0]);
        })
      },
      arraySpanMethod({ rowIndex, columnIndex }) {
        if (rowIndex === (this.len - 1)) {
          if (columnIndex === 0) {
            return [1, 2];
          } else if (columnIndex === 1) {
            return [0, 0];
          }
        }
      },
      async cxkclsByNj(njdm) {
        await getXklsxxByKsid({ ksid: this.jlid, njdm }).then(res => {
          if (res.status === 200) {
            this.all_xklsxx = res.data;
          }
        })
        getKclsxxByKsid({ ksid: this.jlid, njdm }).then(res => {
          if (res.status === 200) {
            this.all_kclsxx = res.data;
            const kskm = _.unionWith(this.all_kclsxx, (o1, o2) => o1.kskmid === o2.kskmid);
            this.kskmList = _.sortBy(kskm, item => item.kskmid);
            this.handelData();
          }
        })
      },
      handelData() {
        // 展示考场监考老师信息
        this.tableData2 = this.kskclist.map(item => {
          const map = { kskcmc: item.kskcmc, kchm: item.kchm };
          /** 获取考场对应信息**/
          const kclsxx_list = _.filter(this.all_kclsxx, e => e.kskcid === item.uuid);
          /** 遍历课程信息**/
          this.kmlsxx(map, kclsxx_list);
          return map;
        })
        const xklsxx = { kskcmc: '科目巡视', kchm: '科目巡视' };
        this.kmlsxx(xklsxx, this.all_xklsxx);
        this.tableData2.push(xklsxx);
        this.len = this.tableData2.length;
      },
      kmlsxx(map, lsxxlist) {
        for (const a of this.kskmList) {
          let xm = '';
          for (const o of lsxxlist) {
            if (a.kskmid === o.kskmid && o.zgh) {
              if (xm.length > 0) {
                xm += ',';
              }
              xm += jcsj.hqjsmcByid(this.jsList, o.zgh);
            }
          }
          map[a.kskmid] = { kclsxm: xm };
        }
      },
      handleKcClick(tab) {
        const a = this.kskclist[tab.index];
        this.xznjmc = jcsj.hqnjmcByid(this.njList, a.njdm);
        this.xzkc.kcmc = a.kskcmc;
        this.xzkc.kchm = a.kchm;
        this.activetcs = a.uuid;
        this.getKcxsxx(a.njdm, a.uuid);
        this.cxkclsByNj(a.njdm);
      },
      changeNj(njdm) {
        this.radio3 = njdm;
        const param = { ksid: this.jlid, njdm };
        getKskc(param).then(res => {
          if (res.length > 0) {
            this.kskclist = res;
            this.activetcs = res[0].uuid;
            this.xznjmc = jcsj.hqnjmcByid(this.njList, njdm);
            this.xzkc.kcmc = res[0].kskcmc;
            this.xzkc.kchm = res[0].kchm;
            this.getKcxsxx(njdm, this.activetcs);
          } else {
            this.xznjmc = jcsj.hqnjmcByid(this.njList, njdm);
            this.xzkc.kcmc = '';
            this.xzkc.kchm = '';
            this.activetcs = '';
            this.kskclist = [];
            this.kcxslist = [];
            this.njxslist = [];
          }
        })
        /** 考试时间 */
        this.getKssj(njdm);
      },
      /** 考试时间 */
      async getKssj(njdm) {
        /** 查询年级下考场监考老师信息 */
        this.cxkclsByNj(njdm);
        let ksrqlist = [];
        // 拼装考试时间
        const pzkssj = [];
        const param = { ksdxid: this.jlid, njdm };
        await getKsrq(param).then(res => {
          if (res.length > 0) {
            ksrqlist = res;
          }
        })
        if (ksrqlist.length > 0) {
          getKskmsj(param).then(res => {
            if (res.length > 0) {
              for (let i = 0; i < ksrqlist.length; i++) {
                const kssjdx = {};
                const swkmsj = [], xwkmsj = [], swkm = [], xwkm = [];
                for (let j = 0; j < res.length; j++) {
                  if (ksrqlist[i] === res[j].ksrq) {
                    const swkmdx = {}, xwkmdx = {};
                    kssjdx.rq = res[j].ksrq;
                    if (_.parseInt(_.split(res[j].kmkssj, ':', 1)) < 12) {
                      swkmdx.kskmid = res[j].jlid;
                      swkmdx.km = jcsj.hqkcmcByid(this.kcList, res[j].kcdm);
                      swkmdx.sj = res[j].kmkssj + ' - ' + res[j].kmjssj;
                      swkm.push(swkmdx);
                      if (swkmsj.length > 0) {
                        swkmsj.push('<br>');
                      }
                      swkmsj.push(swkmdx.km + ': ' + swkmdx.sj);
                    } else {
                      xwkmdx.kskmid = res[j].jlid;
                      xwkmdx.km = jcsj.hqkcmcByid(this.kcList, res[j].kcdm);
                      xwkmdx.sj = res[j].kmkssj + ' - ' + res[j].kmjssj;
                      xwkm.push(xwkmdx);
                      if (xwkmsj.length > 0) {
                        xwkmsj.push('<br>');
                      }
                      xwkmsj.push(xwkmdx.km + ': ' + xwkmdx.sj);
                    }
                    kssjdx.sw = swkmsj.toString();
                    if (swkmsj.length > 0) {
                      kssjdx.sw = swkmsj.toString().replace(/,/g, '');
                    }
                    kssjdx.xw = xwkmsj.toString();
                    if (xwkmsj.length > 0) {
                      kssjdx.xw = xwkmsj.toString().replace(/,/g, '');
                    }
                    kssjdx.swkm = swkm;
                    kssjdx.xwkm = xwkm;
                  }
                }
                pzkssj.push(kssjdx);
              }
              this.tableData = pzkssj;
            }
          })
        }
      },
      getKcxsxx(njdm, kskcid) {
        const param = { ksid: this.jlid, njdm };
        getKcxsxx(param).then(res => {
          for (let a = 0; a < res.length; a++) {
            res[a].bjmc = jcsj.hqbjmcByid(this.bjList, res[a].bjdm);
          }
          this.njxslist = res;
          const xslist = _.filter(res, ['kskcid', kskcid]);
          this.kcxslist = _.sortBy(xslist, item => item.zwh);
        })
      },
      exportJkTable() {
        let oHtml = this.$refs.jklsTable.$el.outerHTML;
        this.rep(oHtml);
        oHtml = '<h2 align=\'center\'>' + this.ksxx.ksmc + '</h2>' + this.tempa;
        jcsj.exportTable2Excel(oHtml, this.xznjmc + '监考老师模板表');
      },
      rep(a) {
        if (a.indexOf('<th class="gutter"') !== -1) {
          a = a.replace('<th class="gutter" style="width: 0px; display: none;"></th>', '').replace('<th class="gutter"></th>', '');
          this.rep(a);
          return;
        }
        this.tempa = a;
      },
      exportKcTable() {
        this.kcxszb = [];
        console.log(this.kskclist);
        if (this.radio3 === '' || this.radio3.trim() === '') {
          this.$message.warning('请选择年级');
          return;
        }
        this.kskclist.forEach(kc => {
          let xslist = _.filter(this.njxslist, ['kskcid', kc.uuid]);
          if (xslist.length > 0) {
            xslist = _.sortBy(xslist, item => item.zwh);
            this.kcxszb.push({ kcmc: kc.kskcmc, kcnjxslist: xslist });
          }
        })
        this.$nextTick(() => {
          const oHtml = this.$refs.kcbTable.outerHTML;
          jcsj.exportTable2Excel(oHtml, this.xznjmc + '考场模板表');
        })
      },
      exportBjTable() {
        if (this.radio3 === '' || this.radio3.trim() === '') {
          this.$message.warning('请选择年级');
          return;
        }
        this.njxszb = [];
        if (this.njxslist.length === 0) {
          this.$message.warning('考场里还未设置学生排位');
          return;
        }
        const bjlist = _.sortBy(this.bjList, item => item.bj);
        bjlist.forEach(bj => {
          let xslist = _.filter(this.njxslist, ['bjdm', bj.uuid]);
          if (xslist.length > 0) {
            xslist = _.sortBy(xslist, item => item.kskcmc.length);
            this.njxszb.push({ bjmc: bj.bj, bjxslist: xslist });
          }
        })
        this.$nextTick(() => {
          const oHtml = this.$refs.njxszb_table_ref.outerHTML;
          jcsj.exportTable2Excel(oHtml, this.xznjmc + '班级模板表');
        })
      },
      exportXszkzTable() {
        this.xszkzb = _.sortBy(this.njxslist, item => item.bjmc);
        this.$nextTick(() => {
          let oHtml = '';
          for (let i = 0; i < this.xszkzb.length; i++) {
            oHtml += this.$refs.xszkzb_table_ref[i].outerHTML;
          }
          jcsj.exportTable2Excel(oHtml, this.xznjmc + '学生准考证模板表');
        })
      }
    },
    props: {
      njList: {
        /** 年级类型列表数据**/
        type: Array,
        required: true
      },
      bjList: {
        /** 班级级类型列表数据**/
        type: Array,
        required: true
      },
      kcList: {
        /** 课程级类型列表数据**/
        type: Array,
        required: true
      },
      jsList: {
        /** 教师级类型列表数据**/
        type: Array,
        required: true
      }
    }
  };
</script>
<style scoped>

  .pk-ckpk-box {
    /* max-width: 824px; */
  }
  .ksxt_ckpk .pkbox {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    width: 120px;
    height: 120px;
    border: 1px dashed #ebeef5;
    border-radius: 6px;
    overflow: hidden;
    color: #666666;
    font-weight: bold;
    text-align: center;
    font-size: 14px;
    margin-top: 10px;
    margin-left: 10px;
  }

  .ksxt_ckpk .idbox {
    position: absolute;
    top: 0;
    left: 0;
    width: 25%;
    padding: 2px;
    border-bottom-right-radius: 6px;
    background-color: #f5f7fa;
  }

  .ksxt_ckpk .classbox {
    position: absolute;
    top: 0;
    right: 0;
    padding: 2px;
    font-weight: normal;
  }

  .ksxt_ckpk .contentbox {
    position: absolute;
    width: 100%;
    top: 72px;
    left: 0;
    transform: translateY(-50%);
    line-height: 1.0em;
  }
  .ksxt_ckpk .contentbox p {
    word-wrap:break-word;
  }
  .ksxt_ckpk .contentbox p:last-child {
    margin-bottom: 0;
  }
  .ksxt_ckpk .pk-title-down {
    padding: 10px;
    height: 695px;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .ksxt_ckpk .pk-down {
    height: 758px;
    overflow-y: auto;
    box-sizing: border-box;
  }
</style>
<style>
  .ksxt_ckpk .el-table thead.is-group th {
    background: #fff;
  }
</style>
