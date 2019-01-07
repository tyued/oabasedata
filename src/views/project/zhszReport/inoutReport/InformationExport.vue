<!-- 信息导出 -->
<template>
  <div class="app-container calendar-list-container" style="float:left;">
    <div class="filter-container">
      <el-form ref="form" :model="form">
        <el-row>
            <el-form-item label="" style="min-width:600px;">
              <el-autocomplete
                v-model="state4"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入学生姓名"
                @select="handleSelect"
              ></el-autocomplete>
              <el-button @click.stop="getstastic">导出全校</el-button>
              <el-button type="primary" @click.stop="entry">导出</el-button>
              <!-- <el-button type="success" @click.stop="submit">提交</el-button> -->
            </el-form-item>
        </el-row>
      </el-form>
      <p class="tip"><span>注：</span>此页面用于班主任录入或导入【出勤记载】【奖惩记载】【班主任寄语】【附言】，其他数据在【学分项目】中录入或导入。</p>
    </div>
    <div class="table-container" style="max-width:1500px; min-width:1100px;">
      <div class="content_left">
        <!-- 班级，学生 -->
        <tree-comn v-for="(item, index) in datatree" :key="index" :dataSource="item" @checkdetail="checkdetail" @open="opentr" :treeOpen="treeOpen" :treeid="treeid"></tree-comn>
      </div>
      <!-- 表格信息beg -->
      <div class="content_right" style="border: 1px solid #eee;padding: 10px;">
          <div style="width: 100%;min-height: 300px;" v-if="tableshow">
            <div style="padding: 5px 20px;float:left;"><p style="font-size: 18px; font-weight: 600;">{{bgdxx.xn}}{{bgdxx.xq===01?'上学期':'下学期'}}学生综合评价改革学科分项等级制评价单</p></div>
            <div style="padding: 5px 20px;float:right;font-size: 18px; font-weight: 500;"><span>班级</span><span style="width: 150px;margin-right: 20px; display: inline-block;border-bottom: 1px solid;padding: 2px 20px">{{bdtxx.bj}}</span><span>姓名</span><span style="width: 100px;display: inline-block;border-bottom: 1px solid;padding: 2px 20px">{{bdtxx.xm}}</span></div>
            <div style="display:block;float: left;">
              <table-line class="table_box" :table-data="item" width='450px' v-for="(item, index) in tableData" :key="index"></table-line>
            </div>
            <div style="display:block;width: 100%;float:left;border: 1px solid #eee;padding: 20px 4px;margin-bottom: 10px;">
              <div style="display:block;width: 450px;float:left;margin-left:10px;border: 1px solid #eee;">
                <radar-chart :dataN="radarchartN" v-if="rader" :dataV="radarchartvalue" :danwei="danwei1"></radar-chart>
                <radar-chart :dataN="jfldN" v-if="rader2" :dataV="jfldV" :danwei="danwei"></radar-chart>
                <p  style="padding: 5px 10px;">注解：得A率雷达图展示各个科目的得A率。例如，语文共有5个等级评价项目，其中3个项目得A，那么语文的得A率为60%</p>
              </div>
              <div style="display:block;width:450px;float: left;margin-left: 50px;border: 1px solid #eee;">
                <p style="padding: 4px 10px;font-size: 18px; font-weight: 600">身体素质曲线图</p>
                <tiao-xing width='100%' height='400px' :chartData='chartData' :tixingdate="tixingdate" v-if="chartData.length"></tiao-xing>
              </div>
            </div>
            <div style="display:block;width: 100%;float:left;border: 1px solid #eee;padding: 20px 4px;margin-bottom: 10px;">
              <input-table :formtable="formtable"></input-table>
            </div>
            <div style="display:block;width: 100%;float:left;border: 1px solid #eee;padding: 20px 4px;margin-bottom: 10px;">
              <div style="width:45%;display: block;float:left;padding: 10px;">
                <main-table :pageData="pageData"></main-table>
              </div>
              <div style="width:53%;display: block;float:left;">
                <show-table :totilData="reporttable"></show-table>
              </div>
            </div>
          </div>
        </div>
      <!-- 表格信息end -->
    </div>
    <!-- 导入学生名单beg -->
    <el-dialog title="项目导入" :visible.sync="importXSFormVisible" width="540px" :before-close="importCancel" class="import_box">
      <el-row style="padding: 10px 0;">
        <el-col :span="6" style="line-height:32px">
          执行班级：
        </el-col>
        <el-col :span="6">
          <el-select  class="schoolYear" v-model="bjmc" @change="getbjxx" placeholder="请选择" size="small">
            <el-option
              v-for="(item, index) in datatree"
              :key="index"
              :label="item.bjmc"
              :value="item">
            </el-option>
          </el-select>
          <!-- <select name="" id="" @click.stop="choose">
            <option :value="item" v-for="(item, index) in datatree">{{item.bjmc}}</option>
          </select> -->
        </el-col>
      </el-row>
      <el-row>
          <el-col :span="6" style="line-height:32px">
            文件选择：
          </el-col>
          <!-- http://192.168.0.193:6162 -->
          <el-col :span="18">
              <el-upload
              :data="dataw"
              :limit="1"
              name="excelfile"   
              ref="cjForm"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              action="/api/netcore/smartcredit/v1/Bgd/ImportExcelBgdxx"
              :headers= headers
              :file-list="fileList"
              :onError="uploadError"
              :onSuccess="uploadSuccess"
              :before-upload="beforeUpload"
              :on-change="onchange"
              :on-remove="onremove"
              :auto-upload="false">
              <!-- :on-progress="onprogress" -->
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </el-upload>
          </el-col>  
      </el-row>
      <div slot="footer" class="dialog-footer">
          <el-button size="medium" type="primary" @click="importSubmit('cjForm')" :loading="importLoading">{{isSuccess === '上传中'?'数据处理中...':'确定'}}</el-button>
          <!-- isSuccess=== '上传中' ? '数据处理中...' :  -->
          <el-button size="medium" @click="importCancel">取 消</el-button> 
          <el-button size="medium" @click="importMb" :loading="downloads">模版生成<i class="el-icon-download"></i></el-button> 

          <el-row class="import_desc">
              <el-col :span="6" style="line-height:80px">
                  操作说明：
              </el-col>
              <el-col :span="18" style="margin-top: 30px;">
                  <div class="tip">1.请使用本页面提供的模版进行导入</div>
                  <div class="tip">2.请勿修改模版Excel的表头内容</div>
                  <div class="tip">3.模版提供的默认信息，请勿随意修改</div>
                  <div class="tip">4.具有星号（*）的条目为必填项</div>
              </el-col>               
          </el-row>
      </div>
    </el-dialog>
    <!-- 导入学生end -->
  </div>
</template>
<script>
import TableLine from '../Statistics/TableLine'
import RadarChart from './RadarChart'
import { getToken } from '../../../../utils/auth'
import TreeComn from './TreeComn'
import TiaoXing from './TiaoXing'
import InputTable from '../Statistics/InputTable'
import MainTable from './MainTable'
import ShowTable from './ShowTable'
import {
    school_page,
    getXn,
    getXq,
    getNj,
    getXk,
    dqxnxqObj,
    getBj,
    GetCredit,
    Getreportstatistics,
    ImportTemplateDownload,
    Getstastick,
    Savereport
} from 'api/project/creditInquiry/index'
export default {
  components: {
    TableLine,TreeComn,
    RadarChart,TiaoXing,
    InputTable, MainTable,
    ShowTable
  },
  data () {
    return {
      chartData:[
          // {xm:'50米',score:[79, 32, 200],color:'#ff9900'},
          // {xm:'仰卧起坐',score:[29, 52, 20],color:'#991acc'},
          // {xm:'坐位体前屈',score:[39, 152, 100],color:'#666fff'},
          // {xm:'跳绳',score:[74, 122, 150],color:'#009933'},
      ],
      importXSFormVisible: false, // 弹层控制
      importLoading: false, // 加载
      fileList: [], // 文件列表
      datas: {
        Xxdm: '',
        BgdId: '',
        Njdm: '',
        Bjdm: ''
      },
      bdtxx: { // 表单头信息
        bj: '',
        xm: ''
      },
      dataw: {},
      isSuccess: '', // 提示文字
      tableData: [
      ], // 表格数据
      tableheader: { //表头数据
        tableheader:[
          {label: '评价项目', sz: 1},{label:'评价分项', sz: 1},{label: '评价等级', sz: 1},{label: '班级整体', sz: 1}
        ]
      },
      curriculumIndex: 0, // 课程列表下标
      schoolyearlist: [],// 学年列表
      semesterlist: [], // 学期列表
      gradelist: [], // 年级列表
      classlist: [], // 班级列表
      curriculumlist: [], // 课程列表
      searchInfo: '', // 搜索信息
      classidArr: [], // 班级id列表

      form: {},
      bgdId: JSON.parse(window.localStorage.getItem('bgdsj')).uuid, // 报告单编号
      bgdxx: JSON.parse(window.localStorage.getItem('bgdsj')),
      njbj:{
        njdm: '',
        bjdm: ''
      }, // 年级班级代码
      bjmc: '',
      listQuery:{ // 基础信息
        xxdm: window.localStorage.getItem('xxdm'),
        xn: '',
        xq: '',
        njdm: '',
        xm: '',
        pageSize: 100,
        pageIndex: 1,
        total: 20,
      },
      state4: '',
      datatree: JSON.parse(window.localStorage.getItem('newclasslist')),
      defaultProps: {
        children: 'students',
        label: 'xm'
      },
      spanArr: [],
      position: 0,
      downloads: false, // 下载按钮加载动画判定
      radarchartN: [], // 雷达图课程名称及最大值
      radarchartvalue: [], // 雷达图主要数据
      jfldN: [], // 积分雷达名称及最大值
      jfldV: [], // 积分雷达数据
      pageData: [], // 总评表格数据
      reporttable: [
        {name: '出勤记录', ycq: '', sj: '', bj: '', kk: '', cdzt: '', lx: 3},
        {name:'奖惩记录', jcjl: '', lx: 4},
        {name:'班主任寄语', bzrjy: '', lx: 5},
        {name:'附言', fy: '', lx: 6},
      ],
      formtable: {
        // uuid: '', // （修改必填）
        bgdid: '', // 报告单id（必填）
        xh: '', // 学号（必填）
        xm: '', // 姓名（必填）
        bjid: '', // 班级代码（必填）
        bjmc: '', // 班级名称（必填）
        ycqts: 0, // 应出勤天数
        sjts: 0, // 事假数
        bjts: 0, // 病假数
        kks: 0, // 旷课数
        cdzts: 0, // 迟到早退数
        sg: 0, // 身高
        tz: 0, // 体重
        zysl: 0, // 左眼视力
        yysl: 0, // 右眼视力
        jcjz: '', // 奖惩记录
        bzrjy: '', // 班主任寄语
        fy: '' // 附言
      }, // 奖惩记录健康数据出勤记录等信息表
      istrue: true, // 判定条件
      studentcode: '', // 学号暂存
      rader: false, // 
      rader2: false, // 
      tableshow: false,
      tixingdate: [], // 柱状图日期
      danwei: '', // 雷达图单位
      danwei1: '',
      treeOpen: false, // 是否打开班级
      treeid: '', // 班级是否打开依据
      
    }
  },
  computed: {
    headers () {
      return {
        Authorization: getToken()
      }
    }
  },
  mounted () {
    // console.log(JSON.parse(window.localStorage.getItem('bgdsj')))
    // console.log(this.$route.query)
    // JSON.parse(this.$route.query.datas).uuid
    // JSON.parse(this.$route.query.dataSource)
    // this.bgdId = JSON.parse(window.localStorage.getItem('bgdsj'))
    // this.datatree = JSON.parse(window.localStorage.getItem('newclasslist'))
    this.njbj.njdm = this.datatree[this.datatree.length-1].njdm
    this.njbj.bjdm = this.datatree[this.datatree.length-1].bjdm
    // console.log(this.datatree)
    this.studentcode = this.datatree[0].students[0].xh
    this.formtable.bgdid = JSON.parse(window.localStorage.getItem('bgdsj')).uuid
    this.formtable.bjid = this.datatree[this.datatree.length-1].bjdm
    this.formtable.bjmc = this.datatree[this.datatree.length-1].bjmc
    this.formtable.xh = this.datatree[0].students[0].xh
    this.formtable.xm = this.datatree[0].students[0].xm
    this.checkdetail(this.datatree[0].students[0], this.datatree[0])

  },
  methods: {
    opentr(datas){
      console.log('22222')
      console.log(datas)
      this.treeid = datas
      this.treeOpen = !this.treeOpen
    },
    // 获取学分数据
    getstastic () {
      this.checkdetail(this.datatree[0].students[0], this.datatree[0])
    },
    // 根据报告单id学生信息等提交报告单
    submit () {
      // console.log(this.formtable)
      // var that = this
      // var judgestudent = /^[0-9]\d*$/
      // if (judgestudent.test(that.formtable.ycqts)) {
      //   that.istrue = true
      //   if (judgestudent.test(that.formtable.sjts)) {
      //     that.istrue = true
      //     if (judgestudent.test(that.formtable.kks)) {
      //       that.istrue = true
      //       if (judgestudent.test(that.formtable.bjts)) {
      //         that.istrue = true
      //         if (judgestudent.test(that.formtable.cdzts)) {
      //           that.istrue = true
      //           Savereport(that.formtable).then(data => {
      //             // console.log(data)
      //             that.istrue = true
      //             // this.$notify({title: '提示', message: data, type: 'success', duration: 2000})
      //           })
      //         } else {
      //           that.istrue = false
      //         }
      //       } else {
      //         that.istrue = false
      //       }
      //     } else {
      //       that.istrue = false
      //     }
      //   } else {
      //     that.istrue = false
      //   }
      // } else {
      //   that.istrue = false
      // }
      // if (!this.istrue) {
      //   this.$notify({title: '提示', message: '请输入正确数值', type: 'error', duration: 2000})
      // }
    },
    /**
     * 选择班级
     * **/
    getbjxx(item) {
      // console.log(item)
      this.njbj.njdm = item.njdm
      this.njbj.bjdm = item.bjdm
    },

    /** 根据学生年级代码，报告单id等相关信息获取学生报告单  
     *  xxdm 学校代码
     *  bgdid 报告单id
     *  njdm 年级代码
     *  bjdm 班级代码
     *  arr3 数据处理暂存数组
     * **/
    checkdetail(item, datas){
      // console.log(item)
      this.bdtxx.bj = datas.bjmc
      this.bdtxx.xm = item.xm
      let params = {
        xxdm: this.listQuery.xxdm,
        bgdId: this.bgdId,
        njdm: datas.njdm,
        bjdm: datas.bjdm,
        xh: item.xh
      }
      if (this.studentcode !== item.xh) {
        // this.submit()
      }
      this.tixingdate = []
      this.pageData = []
      this.tableshow = false
      this.rader = false
      this.chartData = [] // 
      var scorelist = [] // 
      var chartData = [] // 
      this.jfldV = []
      this.jfldN = []
      var that = this
      var arr4 = []
      let zpList = [] // 总评
      var tablehead = [] // 表头数据暂存
      Getreportstatistics(params).then(data => {
        console.log(data)
        // 雷达图数据
        Getstastick({xn: data.bgd.xn,xq:data.bgd.xq ,xxdm:data.bgd.xxdm ,xh:item.xh }).then(datast => {
          console.log(datast)
          this.radarchartN = []
          this.radarchartvalue = []
          // var that = this
          var radvalue = {
            value: [],
            name: ''
          }
          var radvalue2 = {
            value: [],
            name: ''
          }
          datast.kcXmScores.forEach(els => {
            els.zddj = els.aRatingCount + els.bRatingCount + els.cRatingCount + els.dRatingCount
          })
          var arr = JSON.parse(JSON.stringify(datast.kcXmScores))
          var arr3 = JSON.parse(JSON.stringify(datast.kcXmScores))
          var arr1 = []
          var arr2 = []
          console.log(arr)
          data.bgdItemlist.forEach(itemm => {
            if (itemm.lx === 2) {
              if (itemm.zsjf) {
                arr1 = _.sortBy(arr, [function(o) { return o.score; }])
              } else {
                arr1 = []
              }
              if (itemm.zsdj) {
                arr2 = _.sortBy(arr3, [function(o) { return o.zddj; }])
                console.log(arr2)
              } else {

              }
            }
          })
          // var arr1 = _.sortBy(arr, [function(o) { return o.score; }])
          // console.log(arr1)
          if (arr1.length) {
            arr1.forEach((item, index) => {
              that.radarchartN.push({name:item.mc, max: 100})
              radvalue.value.push(item.score)
            })
            this.radarchartvalue.push(radvalue)
            this.danwei1 = ''
            this.rader = true
          } else {
            radvalue.value = []
            that.radarchartN = []
            this.radarchartvalue = []
            this.danwei1 = ''
            this.rader = false
          }
          if (arr2.length) {
            arr2.forEach((item, index) => {
              that.jfldN.push({name:item.mc, max: 100})
              radvalue2.value.push(item.zddj?(item.aRatingCount/item.zddj).toFixed(2)*100:0)
            })
            this.jfldV.push(radvalue2)
            this.danwei = '单位：百分比'
            this.rader2 = true
          } else {
            radvalue2.value = []
            that.jfldN = []
            this.jfldV = []
            this.danwei = '单位：百分比'
            this.rader2 = false
          }
          console.log(this.jfldV)
        })

        /**
         * @lx
         *  0（课程）， 1（身体素质曲线）
         *  2（个人发展--即雷达图数据）， 3（出勤记录），4（奖惩记录）
         *  5（班主任寄语）， 6（附言），7（总评）
         *  @jflx 0（成绩换算）， 1（累积量换算）， 2（学分）， 3（等级），4（图文）， 5（健康）， 6（阅读）， 7（加减分）
         *  @zhdj 0(不转换)  1(转换)
         **/
        // console.log(data)
        if (data.bgdItemlist.length) {
          data.bgdItemlist.forEach(el => {
            if (el.lx === 0) { // 课程
              // 表格数据暂存
              var arr3 = []
              // 表格总数据
              var tabledata = {
                zymc: el.zymc, // 专业名称
                kcmc: el.kcmc, // 课程名称
                ewmUrl: el.ewmUrl, // 二维码
                tabledata: [], // 表数据
                tablehead: [{labels: '评价项目', id: 'xm',isshows: true}, {labels: '评价分项', id: 'fx', isshows: true}, {labels: '评价值', id: 'dj', isshows: true}, {labels: '班级整体', id: 'bjzt',isshows: false, isshow: el.bjzt}] // 表头
              }
              if (el.xmReportList) {
                
                if (el.xmReportList.length) {
                  // 总评数据表格处理
                  
                  if (el.kcmc) {
                    zpList.push(el);
                  } else {
                    zpList = []
                  }

                  // 普通表格数据处理
                  for (var i=0; i<el.xmReportList.length; i++) {
                    // 根据有无子项目采集数据 ywzx（有无子项布尔值）
                    if (!el.xmReportList[i].ywzx) { // 无子项
                      if (el.xmReportList[i].jflx === 0) {
                        
                      }
                      el.xmReportList[i].rwList.forEach(rw => {
                        if (el.xmReportList[i].uuid === rw.xmid) {
                          tabledata.tabledata.push(
                            {
                              isbjzt: el.bjzt, // 班级总体
                              zssz: el.zssz, // 展示数值
                              zsjf: el.zsjf, // 展示积分
                              zsdj: el.zsdj, // 展示等级
                              sfzs: el.sfzs, // 是否展示
                              xm: el.xmReportList[i].mc, // 项目名称
                              jflx: el.xmReportList[i].jflx, // 积分类型
                              fx: rw.mc,
                              zhdj: el.xmReportList[i].zhdj, //转换等级
                              hjz: ((el.xmReportList[i].zhdj === 1 && rw.djz)?rw.djz:el.xmReportList[i].xf),
                              dj: (el.xmReportList[i].zhdj === 1 && rw.djz)?rw.djz:(((el.xmReportList[i].jflx === 7 || el.xmReportList[i].jflx === 1) && rw.zhdj === 0)?el.xmReportList[i].xf:(el.xmReportList[i].jflx === 3)?rw.djz:rw.cjXF),
                              bjzt: [
                              {
                                  dj:'A',
                                  num:rw.bjadjsl,
                                  djW:(rw.bjadjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%'
                                },
                                {
                                  dj:'B',
                                  num:rw.bjbdjsl,
                                  djW:(rw.bjbdjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%' 
                                },
                                {
                                  dj:'C',
                                  num:rw.bjcdjsl,
                                  djW:(rw.bjcdjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%'
                                },
                                {
                                  dj:'D',
                                  num:rw.bjddjsl,
                                  djW:(rw.bjddjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%' 
                                }
                              ]
                            }
                          )
                        }
                      })
                    } else if (el.xmReportList[i].ywzx) { // 有子项
                      // if (el.xmReportList[i].jflx === 0) {
                        
                      // }
                      el.xmReportList[i].zxmList.forEach(rw => {
                        // console.log(el.xmReportList[i])
                          if (el.xmReportList[i].uuid === rw.fjxmid) {
                            tabledata.tabledata.push(
                              {
                                isbjzt: el.bjzt, // 班级总体
                                zssz: el.zssz, // 展示数值
                                zsjf: el.zsjf, // 展示积分
                                zsdj: el.zsdj, // 展示等级
                                sfzs: el.sfzs, // 是否展示
                                xm: el.xmReportList[i].mc, // 项目名称
                                jflx: el.xmReportList[i].jflx, // 积分类型
                                fx: rw.mc,
                                zhdj: el.xmReportList[i].zhdj, //转换等级
                                hjz: ((el.xmReportList[i].zhdj === 1 && rw.djz)?rw.djz:el.xmReportList[i].xf),
                                dj: ((el.xmReportList[i].zhdj === 1 || rw.zhdj === 1) && rw.djz)?rw.djz:((el.xmReportList[i].jflx === 7 || el.xmReportList[i].jflx === 1)?el.xmReportList[i].xf:(el.xmReportList[i].jflx === 3)?rw.djz:rw.xf),
                                bjzt: [
                                {
                                    dj:'A',
                                    num:rw.bjadjsl,
                                    djW:(rw.bjadjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%'
                                  },
                                  {
                                    dj:'B',
                                    num:rw.bjbdjsl,
                                    djW:(rw.bjbdjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%' 
                                  },
                                  {
                                    dj:'C',
                                    num:rw.bjcdjsl,
                                    djW:(rw.bjcdjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%'
                                  },
                                  {
                                    dj:'D',
                                    num:rw.bjddjsl,
                                    djW:(rw.bjddjsl/(rw.bjbdjsl+rw.bjadjsl+rw.bjcdjsl+rw.bjddjsl))*100 + '%' 
                                  }
                                ]
                              }
                            )
                          }
                      })
                    }
                  }
                } else {
                  that.pageData = []
                }
              }
              arr4.push(tabledata)
            } else if (el.lx === 1) { // 身体素质曲线
              // console.log(el.physicalFitnessInfo.xqPhysicalFitnessList)

              el.physicalFitnessInfo.physicalFitnessList.forEach(itemm =>{
                var serie = {xm: itemm.rwMc, score:[], color: '#ff9900', id: itemm.rwId, xm: itemm.rwMc};
                el.physicalFitnessInfo.xqPhysicalFitnessList.forEach(items => {
                  var physicalFitnessInfo = _.find(items.physicalFitnessItemList,function (physicalFitnessItem) { return physicalFitnessItem.dyRwId == itemm.rwId;});
                  if(physicalFitnessInfo == undefined){
                    serie.score.push(0);
                  }else{
                    if(el.zssz){
                      // this.tixingdate.push(items.xn)
                      serie.score.push(physicalFitnessInfo.sz);
                    }else if(el.zsjf){
                      serie.score.push(physicalFitnessInfo.xf);
                    }
                  }
                })

                chartData.push(serie);
              });
              el.physicalFitnessInfo.xqPhysicalFitnessList.forEach(item3 => {
                this.tixingdate.push(item3.xn)
              })
              // console.log(chartData)
              
            }
          });
          // 总评数据处理
          if (zpList.length) {
            zpList.forEach(itemzp => {
              let obj = {};
              obj.xk = itemzp.kcmc;
              obj.pjxm = [];
              let itemzpXmReportList = itemzp.xmReportList;
              // for (let i = 0; i < itemzpXmReportList.length; i++) {
              //   if (itemzpXmReportList[i].jflx === 0 ||
              //     itemzpXmReportList[i].jflx === 1 ||
              //     itemzpXmReportList[i].jflx === 7
              //   ) {
              //     // console.log(5555)
              //     // console.log(itemzpXmReportList[i])
              //     obj.pjxm.push({
              //       mc: itemzpXmReportList[i].mc,
              //       dj: itemzpXmReportList[i].zhdj ? itemzpXmReportList[i].djz || '/' : itemzpXmReportList[i].xf
              //     });
              //   }
              // }
              for (let i = 0; i < itemzpXmReportList.length; i++) {
                if (itemzpXmReportList[i].jflx === 0 ||
                  itemzpXmReportList[i].jflx === 1 ||
                  itemzpXmReportList[i].jflx === 3 ||
                  itemzpXmReportList[i].jflx === 7
                ) {
                      if(itemzpXmReportList[i].jflx === 3){
                        obj.pjxm.push({
                          mc: itemzpXmReportList[i].mc,
                          dj: itemzpXmReportList[i].djz || '/'
                        });
                        continue;
                      }
                      obj.pjxm.push({
                        mc: itemzpXmReportList[i].mc,
                        dj: itemzpXmReportList[i].zhdj ? itemzpXmReportList[i].djz || '/' : itemzpXmReportList[i].xf
                      });
                      console.log('obj.pjxm')
                      console.log(obj.pjxm);

                }
              }

              var arr = []
              arr.push(obj);
              arr.forEach(item => {
                if (item.pjxm.length) {
                  this.pageData.push(item)
                }
              })
            });
          } else {
            this.pageData = []
          }
        }
        // {name: '出勤记录', ycq: '', sj: '', bj: '', kk: '', cdzt: '', lx: 3},
        // {name:'奖惩记录', jcjl: '', lx: 4},
        // {name:'班主任寄语', bzrjy: '', lx: 5},
        // {name:'附言', fy: '', lx: 6},
        if (data.bgdxx) {
          this.reporttable.forEach(item => {
            if (item.lx === 3) {
              item.ycq = data.bgdxx.ycqts
              item.sj = data.bgdxx.sjts
              item.bj = data.bgdxx.bjts
              item.kk = data.bgdxx.kks
              item.cdzt = data.bgdxx.cdzts
            }
            if (item.lx === 4) {
              item.jcjl = data.bgdxx.jcjz
            }
            if (item.lx === 5) {
              item.bzrjy = data.bgdxx.bzrjy
            }
            if (item.lx === 6) {
              item.fy = data.bgdxx.fy
            }
          })
          this.formtable = data.bgdxx
        } else {
          this.reporttable = [
            {name: '出勤记录', ycq: '', sj: '', bj: '', kk: '', cdzt: '', lx: 3},
            {name:'奖惩记录', jcjl: '', lx: 4},
            {name:'班主任寄语', bzrjy: '', lx: 5},
            {name:'附言', fy: '', lx: 6},
          ]
          this.formtable = {
            // uuid: '',
            bgdid: this.bgdId,
            xh: item.xh,
            xm: item.xm,
            bjid: datas.bjdm,
            bjmc: datas.bjmc,
            ycqts: 0,
            sjts: 0,
            bjts: 0,
            kks: 0,
            cdzts: 0,
            sg: 0,
            tz: 0,
            zysl: 0,
            yysl: 0,
            jcjz: '',
            bzrjy: '',
            fy: ''
          }
        }
        
        if (arr4.length) {
          that.tableData = JSON.parse(JSON.stringify(arr4))
        } else {
          that.tableData = []
          // that.$notify({title: '提示', message: '项目内容等信息未设置', type: 'error', duration: 1000})
        }
        that.chartData = chartData
        setTimeout(() => {
          this.tableshow = true
        }, 100)
        // console.log(that.chartData)
        // that.tableData = arr3
      }).catch(error => {
        console.log(error)
      })
    },
    splicearr2 (arr) {
        var result = []
        for(var i=0;i<arr.length;i++) {
            for (var j=i+1;j<arr.length;j++) {
                if (arr[i].jflx === arr[j].jflx && arr[i].hjz === arr[j].hjz && arr[i].xm === arr[j].xm) {
                  j = ++i
                // } else if (arr[i].uuid === arr[j].uuid && arr[i].rwList.length <= arr[j].rwList.length) {
                //     arr[j] = arr[j]
                //     j = ++i
                }
            }
            result.push(arr[i])
        }
        return result
    },
    // 在线导入
    entry () {
      this.importXSFormVisible = true;
    },
    importSubmit(fileName){
      if (this.ready) {
        // 
        // 
        this.$refs[fileName].submit();
        this.ready = false
        this.isSuccess = '上传中'
      } else {
        this.$notify({title: '提示', message: '没有要导入的文件', type: 'error', duration: 2000})
      }

    },
    // 文件列表移除文件钩子
    onremove (file, fileList) {
      if (!fileList.length) {
        this.ready = false
      }
    },
    // 文件状态改变函数
    onchange (file, fileList) {
      if (fileList.length) {
        this.ready = true
      } else {
        this.ready = false
      }
    },
    //取消上传
    importCancel() {
        this.importLoading = false;
        this.importXSFormVisible = false;
        this.fileList = [];
    },
    // 上传成功后的回调
    uploadSuccess (response, file, fileList) {
      if (response.result.length) {
        if (response.errorCount === 0) {
          // this.callbackStatus = response
          this.isSuccess = ''
          this.importLoading = false;
          // 
          // 
          this.$notify({
              title: '成功',
              message: response.message,
              type: 'success',
              duration: 2000
          });
          this.importXSFormVisible = false;
          this.fileList = [];
          // 
        } else {
          this.callbackStatus = response.result
          this.importLoading = false;
          // 
          // 
          this.importXSFormVisible = false;
          this.fileList = [];
          // 
        }
      } else {
        this.importLoading = false;
        this.$notify({
          title: '提示',
          message: '上传成功,但您上传了空数据',
          type: 'warning',
          duration: 2500
        });
        this.importXSFormVisible = false;
        this.fileList = [];
      }
    },
    // 上传错误
    uploadError (response, file, fileList) {
      this.importLoading = false;
      this.$notify({
        title: '失败',
        message: '上传失败，请重试！',
        type: 'warning',
        duration: 2000
      });
    },
    // 上传前对文件的大小的判断
    beforeUpload (file) {
      this.importLoading = true;
      let extension = file.name.split('.')[1] === 'xlsx'
      let isLt2M = file.size / 1024 / 1024 < 10
      if (!extension) {
        this.$notify({
          title: '提示',
          message: '上传模版只支持xlsx格式',
          type: 'info',
          duration: 2000
        });
        this.importLoading = false;     
      }else if (!isLt2M) {
        this.$notify({
          title: '提示',
          message: '上传模板大小不能超过 10MB',
          type: 'info',
          duration: 2000
        });
          this.importLoading = false;
      }
      return extension && isLt2M
    },
    
    // 学生报告单统计
    getreportstastick () {
      let params = {
        // xxdm:
        // bgdId:
        // njdm:
        // bjdm:
        // xh:
      }
    },
    // 下载excel模板
    importMb () {
      this.downloads = true
      let params = {
        Xxdm: this.listQuery.xxdm,
        BgdId: this.bgdId,
        Njdm: this.njbj.njdm,
        Bjdm: this.njbj.bjdm
      }
      ImportTemplateDownload(params).then(data => {
        // console.log(data)
        var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
        var downloadElement = document.createElement('a');
    　　var href = window.URL.createObjectURL(blob); //创建下载的链接
    　　downloadElement.href = href;
    　　downloadElement.download = '模版.xlsx'; //下载后文件名
    　　document.body.appendChild(downloadElement);
    　　downloadElement.click(); //点击下载
    　　document.body.removeChild(downloadElement); //下载完成移除元素
    　　window.URL.revokeObjectURL(href); //释放掉blob对象
        this.downloads = false
      }).catch(error => {
        setTimeout(() => {
          this.downloads = false
        }, 1000)
        console.log(error)
      })
    },
    loadAll() {
      return [
        { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
      ];
    },
    querySearchAsync(queryString, cb) { // 搜索
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      // console.log(item)
    }
  },
  
}
</script>
<style lang="scss" scoped>
  .filter-container{
    float: left;
  }
  .table-container{
    float: left;
    .content_left{
      float: left;
      width: 15%;
      max-height: 600px; 
    }
    .content_right{
      float: left;
      width: 85%;
      .table_box{
        float: left;
        margin: 10px;
      }
    }
  }
</style>
<style lang="scss">
  .box-card {
    width: 100%;
  }
</style>
  