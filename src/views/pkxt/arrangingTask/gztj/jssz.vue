<!--规则条件 课程设置 -->
<template>
  <div class="jssz">
    <el-row>
      <el-radio-group
        @change="tbBtn"
        v-model="setTc">
        <el-radio-button label="固定排/不排设置"></el-radio-button>
        <el-radio-button label="互斥/连排"></el-radio-button>
        <el-radio-button label="合班设置"></el-radio-button>
      </el-radio-group>
    </el-row>

    <el-row class="mt20">
      <div class="pkleftmenu" v-show="setTc!='合班设置'">
        <div class="tit">选择排课教师</div>
        <div class="tcfilter">
          <el-input size="small"
                    prefix-icon="el-icon-search"
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
          </el-input>
        </div>
        <el-tree class='pkjstree'
                 :data="data2"
                 node-key="id"
                 accordion
                 @node-click="tree3Click"
                 :highlight-current="true"
                 :default-expanded-keys="showall"
                 :filter-node-method="filterNode"
                 ref="tree3">
        </el-tree>
      </div>

      <div v-show="setTc=='固定排/不排设置'" class="pkrightmenu">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>已设置过的老师</span>
          </div>
          <div>
            <div class="cont setcompletion">
            <span v-for="(item, index) in settingVal"
                  :key="index"
                  class="stat_1"
                  :class="resultNum1 === index?'changeClickItem':''"
                  @click="lookDetail1( item, index)"
                  style="margin-right: 10px;margin-bottom: 4px;">{{item.name}}</span>
            </div>
          </div>
        </el-card>
        <el-card shadow="never" style="margin-bottom: 5px;">
          <div slot="header" class="clearfix">
            <span>设置过的课程</span>
          </div>
          <div>
            <div class="cont setcompletion">
            <span v-for="(item, index) in jxjhbykcdm"
                  :key="index"
                  class="stat_1"
                  :class="resultNum === index?'changeClickItem':''"
                  @click="lookClassDetail( item, index)"
                  style="margin-right: 10px;margin-bottom: 4px;">{{item.label}}</span>
            </div>
          </div>
        </el-card>

        <div class="KbMain smallscroll" style="margin-bottom: 5px;">
          <el-alert
          title="温馨提示：鼠标移入空白表格点击设置当前课程排课相关状态！"
          type="warning" show-icon
           style="margin: 4px 0 !important;">
          </el-alert>
          <el-table :key='tableKey'
                    :row-class-name="tableRowClassName"
                    v-loading.body="listLoading"
                    :data="contentList" border fit highlight-current-row
                    :span-method="arraySpanMethod"
                    style="width: 100%">
            <el-table-column label="星期/节次" align="center">
              <template slot-scope="scope">
                <span :class="{'span-top': scope.row.qzsj}">{{scope.row.jcmc}}</span>
                <span :class="{'span-bottom': scope.row.qzsj}">{{scope.row.qzsj}}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="item in xqList"
              :key="item"
              :label="item | weekdayFormat"
            >
              <template slot-scope="scope">
                <div class="selBox">
                  <div class="selBox-input" style="position: relative;">
                    <input autocomplete="off"
                           v-if="scope.row[item]"
                           style="cursor:pointer;color: #fff;border:none;border-radius:0 !important;"
                           :class="[{
                          'kcChangeStat-nop': scope.row[item].nop,
                          'kcChangeStat-bcgrey': scope.row[item].bpkzs,
                          'kcChangeStat-bpk': typeof scope.row == 'object' ? scope.row[item].bpk : '',
                          'kcChangeStat-gdp': scope.row[item].gdp,
                          'kcChangeStat-kcp': scope.row[item].kcp
                          }]"
                           placeholder="" size=""
                           readonly="readonly" type="text"
                           @click="clickChange(scope.row[item], scope.$index)"
                           :title="scope.row[item].xspk"
                           v-model="scope.row[item].xspk"
                           rows="2" class="el-input__inner"/>
                    <i v-if="scope.row[item].bpk || scope.row[item].gdp"
                       @click="delIt(scope.row[item])"
                       style="position: absolute; top: 0px;right: 0px;cursor:pointer;color: #fff;"
                       class="el-icon-close"></i>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div v-show="setTc=='互斥/连排'" class="pkrightmenu">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>已设置过的老师</span>
          </div>
          <div>
            <div class="cont setcompletion">
            <span v-for="(item, index) in settingVal"
                  :key="index"
                  class="stat_1"
                  :class="resultNum2 === index?'changeClickItem':''"
                  @click="lookDetail2(item, index)"
                  style="margin-right: 10px;">{{item.name}}</span>
            </div>
          </div>
        </el-card>
        <el-alert style="margin-bottom:5px;" title="温馨提示：设置的条件条数过多，会大大降低排课的概率，请优先设置最重要的！" type="warning" show-icon>
        </el-alert>
        <table cellpadding="0" cellspacing="0" class="gentable fl mt10">
          <tr>
            <th>姓名</th>
            <th>互斥</th>
            <th colspan="2">连续上课</th>
          </tr>
          <tr>
            <td>{{hcName}}</td>
            <td>
              <el-cascader
                filterable
                clearable
                :options="dataHCa"
                :show-all-levels="false"
                v-model="selectedOptions2"
                @change="handleChange">
              </el-cascader>
            </td>
            <td>
              已设置课程
              <el-select v-model="hasSetUpVal"
                         clearable
                         @change="lskcEve"
                         placeholder="请选择"
                         style="width:100px;margin:0 5px;">
                <el-option
                  v-for="item in hasSetUpClassData"
                  :key="item.kcdm"
                  :label="item.label"
                  :value="item.kcdm">
                </el-option>
              </el-select>
            </td>
            <td>
              连上节数
              <el-select v-model="selval5"
                         clearable
                         class="lsjs"
                         @change="lsjsEve"
                         placeholder="请选择"
                         style="width:100px;margin:0 5px;">
                <el-option
                  v-for="item in seldata3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
          </tr>

        </table>
      </div>

      <div v-show="setTc=='合班设置'" class="pkrightmenu" style="margin-left:0px;">

        <div class="stepHBbox">
          <div class="tit">第一步:选择课程</div>
          <div class="stepCont smallscroll">
            <el-tree class='pkjstree'
                     :highlight-current="true"
                     :data="seldata2"
                     node-key="value"
                     @node-click="curriculumFindClassTeacherEven"
                     ref="tree4">
            </el-tree>
          </div>
        </div>
        <div class="arrowLeft">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="stepHBbox">
          <div class="tit">第二步:选择班级</div>
          <div class="stepCont smallscroll">

            <el-checkbox-group v-model="checkboxGroup2"
                               @change="getClassChange"
                               size="medium">
              <el-checkbox-button v-for="(item, index) in classTeachNameArr"
                                  class="handleCheckGroup"
                                  :key= index
                                  :label="item"
              >{{item.bjjsmc}}
              </el-checkbox-button>
            </el-checkbox-group>

          </div>
        </div>
        <div class="handleHBbox">
          <div class="Hbopt">
            <el-button icon="el-icon-arrow-right"
                       @click="mergeEve"
                       round>合班
            </el-button>
            <el-button
              @click="breakEve"
              icon="el-icon-arrow-left"
              round>拆班
            </el-button>
          </div>
        </div>

        <div class="HbResultBox" style="width: 500px;
    position: relative;">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>已存在的合班课程</span>
            </div>
            <div v-for="(item, index) in threeData"
                 @click="clickClassTeach(item, index)"
                 :key="item.kcdm"
                 class="thp nodeP">
              {{ item.xsbz }}
            </div>
          </el-card>
        </div>

      </div>

    </el-row>
  </div>
</template>

<script>
  import {
    curriculumFindClassTeacher,
    getHadSettingHCMethod,
    findHaveSetCurriculum,
    toFindCommonClassList,
    getJszjsgxList,
    deleteTeacherpk,
    getHadSetting,
    saveTeacherpk,
    getHeherHCjs,
    saveLxSkNum,
    deleteKCpk,
    mergeClass,
    breakClass,
    saveHcJs,
    getClass,
    getJspk
  } from '@/api/pkxt/arrangingTask/gztj/jssz';
  import { pkjsList } from '@/api/pkxt/arrangingTask/pktz/index';
  import jcsj from '@/api/jcsj';


  export default {
    components: {
      // Abovenext
    },
    computed: {
      resultNum() {
        return this.num;
      },
      resultNum1() {
        return this.num1;
      },
      resultNum2() {
        return this.num2;
      }
    },
    data() {
      return {
        count: 1,
        lskc: '',
        lsjs: '',
        hasSetUpVal: '',
        kcdmtemp: '',
        isEnd: true,
        isErr: false,
        temObja: {},
        temObjb: null,
        threeData: [],
        mergeNum: 0,
        checkdisable: false,
        abovenextDataa: {
          isEnd: '下一步',
          aboveShow: false
        },
        abovenextDatab: {
          isEnd: '下一步',
          aboveShow: true
        },
        abovenextDatac: {
          isEnd: '上一步',
          aboveShow: false
        },
        hcName: '',
        maxlengtdd: 0,
        tableKey: 0,
        tabPosition: 'top',
        tabView: 'pageGdpbpk',
        checked: [],
        settedClass: [],
        settingVal: [],
        classTeachNameArr: [],
        jxjhbykcdm: [],
        checkboxGroup2: [],
        checked1: '',
        checked2: '',
        checked3: '',
        checked4: '',
        kcdm: '',
        num: '',
        num1: '',
        num2: '',
        knowShow: true,
        bpk: false,
        gdp: false,
        kcp: false,
        ishowRight: false,
        showall: [],
        mergeBefArr: [],

        selectedOptions2: [],
        selval2: [],
        tableTwoShow: [],
        selval3: [],
        selval5: '',
        kcdm_: '',
        setTc: '固定排/不排设置',
        filterText: '',
        rwid: this.$route.query.rwid,
        xxdm: this.$route.query.xxdm,
        zgh: '',
        listLoading: false, // 加载
        bjbpkszlist: [], // 加载
        dataHCa: [], // 加载
        contentList: [],
        jsgdbpkList: [],
        bjgdbpklist: [],
        sjPkjcList: [],
        jcsjList: [],
        pkzs: '',
        pkjs: 0,
        swjs: 0,
        xwjs: 0,
        wsjs: 0,
        xqList: [], // 星期列表
        jszjsgxList: [],
        data1: [],
        mrzk1: '',
        kcdmMerge: '',
        mrxz1: '',
        rowIndextemArr: [],
        data2: [],
        allTrue: true,
        allowClick: false,
        seldata2: [],
        classNameTreeData: [],
        hasSetUpClassData: [],
        seldata3: [
          {
            label: '0',
            value: '0'
          },
          {
            label: '2',
            value: '2'
          }
        ]
      };
    },
    /* created() {
      this.getHadSettingMethod();
      this.loadTree();
    },*/
    watch: {
      filterText(val) {
        if (!val) {
          this.$refs.tree3.store._getAllNodes().forEach(item => {
            item.expanded = false;
          });
          this.midDataClear();
          $('.el-tree-node').removeClass('is-current');
        }
        this.$refs.tree3.filter(val);
      }
    },
    methods: {
      /**
       * 选择班级时判断
       */
      getClassChange(a) {
        this.mergeBefArr = a;
        this.mergeNum = a.length;
        if (this.mergeBefArr[0]) {
          if (
            typeof this.mergeBefArr[0].zgh == 'undefined' ||
            this.mergeBefArr[0].zgh === ''
          ) {
            this.$message.warning(
              '选中的班级中至少有一个没有教师，请选择有教师的班级！'
            );
            this.allowClick = false;
          } else {
            this.allowClick = true;
          }
        }
        if (this.mergeBefArr[0] && this.mergeBefArr[1]) {
          if (
            typeof this.mergeBefArr[0].zgh == 'undefined' ||
            typeof this.mergeBefArr[1].zgh == 'undefined' ||
            this.mergeBefArr[0].zgh === '' ||
            this.mergeBefArr[1].zgh === ''
          ) {
            this.$message.warning(
              '选中的班级中至少有一个没有教师，请选择有教师的班级！'
            );
            this.allowClick = false;
          } else {
            this.allowClick = true;
          }
        }
        if (this.mergeBefArr[1]) {
          if (this.mergeBefArr[0].zxs !== this.mergeBefArr[1].zxs) {
            this.$message.warning('选中班级的课程节数不一致！');
            this.allowClick = false;
          }
        }
      },
      // 父组件触发
      childMethod() {
        this.num1 = '';
        this.num2 = '';
        this.setTc = '固定排/不排设置';
        this.getHadSettingMethod();
        this.loadTree();
        this.contentList = [];
        this.jxjhbykcdm = [];
      },
      // 表格处理
      arraySpanMethod({ row }) {
        if (!row.jcdm) {
          return [1, this.xqList.length + 1];
        }
      },
      // 初始化
      loadTree(a, b) {
        this.listLoading = false;
        getJszjsgxList({ xxdm: this.xxdm }).then(response => {
          this.jszjsgxList = response;
          // 拼装教师组树数据
          this.pzJszTreeData(this.jszjsgxList, b, a);
        });
      },
      // 切换事件
      tbBtn(a) {
        this.xqList = [];
        this.nuData();
        this.num1 = '';
        this.num2 = '';
        this.listLoading = false;
        this.settingVal = [];
        this.loadTree();
        if (a === '固定排/不排设置') {
          this.jxjhbykcdm = [];
          this.getHadSettingMethod();
        } else if (a === '互斥/连排') {
          this.hasSetUpVal = '';
          this.selval5 = '';
          this.zghNode = '';
          this.hcName = '';
          this.zgh = '';
          this.hasSetUpClassData = [];
          this.selectedOptions2 = [];
          this.dataHCa = [];
          this.getHadSettingHCMethod();
        } else if (a === '合班设置') {
          this.hbList();
          this.classTeachNameArr = [];
          this.getHaveSetCurriculum();
        }
      },
      // 查看设置过课程
      lookClassDetail(item, index) {
        this.num = index;
        this.kcdmtemp = item.kcdm;
        this.getList(this.zgh);
      },
      getClassa() {
        this.hasSetUpVal = '';
        this.jxjhbykcdm = [];
        this.hasSetUpClassData = [];
        const param = { xxdm: this.xxdm, rwid: this.rwid, zgh: this.zgh };
        getClass(param).then(response => {
          const responseData = response;
          for (let a = 0; a < responseData.length; a++) {
            const obj = {};
            obj.label = jcsj.hqkcmcByid(this.kcList, responseData[a].kcdm);
            obj.kcdm = responseData[a].kcdm;
            this.jxjhbykcdm.push(obj);
            this.hasSetUpClassData.push(obj);
          }
        });
      },
      // 列表信息
      getList(a) {
        const sef = this;
        this.contentList = [];
        const tempContentList = [];
        const param = { xxdm: this.xxdm, rwid: this.rwid, zgh: a };
        getJspk(param).then(response => {
          if (response.status !== 200) {
            this.$message.error(response.message);
            this.listLoading = false;
            return 0;
          }
          this.jsgdbpkList = response.data.jsgdbpkList; // 教师固定不排课
          this.bjgdbpklist = response.data.bjgdbpklist; // 课程固定不排课
          this.bjbpkszlist = response.data.bjbpkszlist; // 所有不排课固定不排课
          this.jcsjList = response.data.jcsjList;
          this.sjPkjcList = response.data.sjPkjcList;
          this.pkzs = response.data.pkzs; //
          this.pkjs = response.data.pkjs; //
          this.swjs = response.data.swjs; //
          this.xwjs = response.data.xwjs; //
          this.wsjs = response.data.wsjs; //
          this.xqList = this.pkzs.split(',');

          for (let i = 0; i < this.sjPkjcList.length; i++) {
            const course = {};
            if (this.sjPkjcList[i].sfgs === 1) {
              course.jcmc = this.sjPkjcList[i].jcmc;
              course.qzsj = this.sjPkjcList[i].qzsj;
              course.isMid = true;

              for (let j = 0; j < this.xqList.length; j++) {
                course.bpk = false;
                course.isRed = true;
                course[this.xqList[j]] = course;
              }
            } else if (this.sjPkjcList[i].sfgs === 2) {
              for (let n = 0; n < this.jcsjList.length; n++) {
                if (this.sjPkjcList[i].jcdm === this.jcsjList[n].jcdm) {
                  course.jcmc = this.jcsjList[n].jcmc;
                  course.jcdm = this.sjPkjcList[i].jcdm;
                  course.qzsj = this.sjPkjcList[i].qzsj;
                }
              }
              for (let j = 0; j < this.xqList.length; j++) {
                const conlist = {};
                conlist.pkzs = this.xqList[j];
                conlist.kcdm = '';
                conlist.bjdm = '';
                conlist.pkjs = this.sjPkjcList[i].jcdm;

                conlist.nop = false;
                conlist.bpk = false;
                conlist.gdp = false;
                conlist.kcp = false;

                conlist.zgh = '';
                conlist.sfpk = '';
                conlist.xspk = '';
                conlist.bpkzs = false;
                course[this.xqList[j]] = conlist;
              }
              for (let h = 0; h < this.bjgdbpklist.length; h++) {
                // console.log(this.bjgdbpklist);
                if (
                  this.bjgdbpklist[h].pkjs === this.sjPkjcList[i].jcdm &&
                  this.xqList.length > 0
                ) {
                  let pkzt = '';
                  let temval = '';
                  if (this.bjgdbpklist[h].sfpk === 1) {
                    course[this.bjgdbpklist[h].pkzs].kcdm = this.bjgdbpklist[
                      h
                      ].kcdm;
                    course[this.bjgdbpklist[h].pkzs].bjdm = this.bjgdbpklist[
                      h
                      ].bjdm;
                    pkzt = '固定排';
                    this.handlerone(
                      course[this.bjgdbpklist[h].pkzs],
                      true,
                      false,
                      false,
                      false,
                      false,
                      pkzt,
                      '固定排'
                    );
                    temval =
                      jcsj.hqkcmcByid(this.kcList, this.bjgdbpklist[h].kcdm) +
                      ' ' +
                      jcsj.hqbjmcByid(this.bjList, this.bjgdbpklist[h].bjdm) +
                      ',' +
                      pkzt;
                    this.commonChange(
                      course[this.bjgdbpklist[h].pkzs],
                      temval,
                      false,
                      false,
                      true,
                      false
                    );
                  } else if (this.bjgdbpklist[h].sfpk === 2 && this.kcdmtemp === this.bjgdbpklist[h].kcdm) {
                    course[this.bjgdbpklist[h].pkzs].kcdm = this.bjgdbpklist[
                      h
                      ].kcdm;
                    course[this.bjgdbpklist[h].pkzs].bjdm = this.bjgdbpklist[
                      h
                      ].bjdm;
                    pkzt = '不排课';
                    this.handlerone(
                      course[this.bjgdbpklist[h].pkzs],
                      true,
                      false,
                      false,
                      false,
                      false,
                      pkzt,
                      '不排课'
                    );
                    temval =
                      jcsj.hqkcmcByid(this.kcList, this.bjgdbpklist[h].kcdm) +
                      ' ' +
                      jcsj.hqbjmcByid(this.bjList, this.bjgdbpklist[h].bjdm) +
                      ',' +
                      pkzt;
                    this.commonChange(
                      course[this.bjgdbpklist[h].pkzs],
                      temval,
                      false,
                      false,
                      true,
                      false
                    );
                  }
                }
              }
              for (let m = 0; m < this.jsgdbpkList.length; m++) {
                if (
                  this.jsgdbpkList[m].pkjs === this.sjPkjcList[i].jcdm &&
                  this.xqList.length > 0
                ) {
                  const sfpk = this.jsgdbpkList[m].sfpk;
                  course[this.jsgdbpkList[m].pkzs].pkjs = this.sjPkjcList[i].jcdm;
                  course[this.jsgdbpkList[m].pkzs].zgh = this.jsgdbpkList[m].zgh;
                  course[this.jsgdbpkList[m].pkzs].sfpk = sfpk;
                  if (this.kcdmtemp !== this.jsgdbpkList[m].kcdm) {
                    if (sfpk === 1) {
                      const ss = jcsj.hqkcmcByid(
                        this.kcList,
                        this.jsgdbpkList[m].kcdm
                      );
                      this.commonChange(
                        course[this.jsgdbpkList[m].pkzs],
                        ss,
                        false,
                        false,
                        true,
                        false
                      );
                      break;
                    }
                  } else {
                    if (sfpk === 1) {
                      this.commonChange(
                        course[this.jsgdbpkList[m].pkzs],
                        '固定排',
                        false,
                        true,
                        false,
                        false,
                        false
                      );
                    } else if (sfpk === 2) {
                      this.commonChange(
                        course[this.jsgdbpkList[m].pkzs],
                        '不排课',
                        true,
                        false,
                        false,
                        false,
                        false
                      );
                    }
                  }
                }
              }
              for (let ma = 0; ma < this.bjbpkszlist.length; ma++) {
                if (
                  parseInt(this.bjbpkszlist[ma].bpkjs) === this.sjPkjcList[i].jcdm &&
                  this.xqList.length > 0
                ) {
                  course[this.bjbpkszlist[ma].bpkzs].xspk = '所有课程不排课';
                  course[this.bjbpkszlist[ma].bpkzs].bpkzs = true;
                }
                // }
              }
            }
            tempContentList.push(course);
          }

          tempContentList.forEach((item, index) => {
            const course = {};
            for (let j = 0; j < this.xqList.length; j++) {
              course.blank = true;
              course[this.xqList[j]] = course;
            }

            if (item.jcdm) {
              switch (item.jcdm) {
                // 判断上午
                case this.swjs:
                  tempContentList.splice(index + 1, 0, course);
                  break;
                // 判断下午
                case this.xwjs + this.swjs:
                  tempContentList.splice(index + 1, 0, course);
                  break;
                // 判断晚上
                case this.xwjs + this.swjs + this.wsjs:
                  tempContentList.splice(index + 1, 0, course);
                  break;
                default:
                  console.log('BackError');
                  break;
              }
            }
          });
          this.contentList = tempContentList;
          sef.listLoading = false;
        });
      },

      commonChange(item, a, b, c, d, e, f) {
        item.xspk = a;
        item.bpk = b;
        item.gdp = c;
        item.kcp = d;
        item.nop = e;
        item.bpkzs = f;
      },

      async colorChange(message, a, a1, b, c, d, text, pkParam, func1) {
        a.pkParam = pkParam;
        await func1().then(r => {
          if (!r) {
            if (text !== 1) a.xspk = text;
           /* if (0) {
              console.log(message);
            }*/
            a.bpk = a1;
            a.gdp = b;
            a.kcp = c;
            a.nop = d;
          }
        });
      },
      unique(a) {
        return Array.from(new Set(a));
      },
      // 节点单击事件
      tree3Click(a, b) {
        if (!b.parent.parent) {
          this.ishowRight = false;
          return 0;
        }
        this.num = '';
        this.num1 = '';
        this.num2 = '';
        this.jxjhbykcdm = []; // 设置过的课程 / 固定
        this.settingVal = []; // 设置过的老师 / 固定

        this.zghNode = a.value; // value -> 职工号
        this.zgh = a.value; // value -> 职工号

        if (this.setTc === '固定排/不排设置') {
          this.contentList = [];
          this.ishowRight = true;
          this.getHadSettingMethod();
          this.getClassa();
        } else if (this.setTc === '互斥/连排') {
          this.getHadSettingHCMethod();
          this.getListHC();
          this.hcName = a.label; // nameVal
          this.getClassa();
          const temArray = this.dcop(this.data2);
          temArray.forEach(item => {
            item.parent = 1;
          });
          this.handlertwo(temArray);
          this.dataHCa = temArray;
        }
      },
      dcop(source) {
        let result;
        source instanceof Array ? result = [] : result = {};

        for (const key in source) {
          result[key] =
            typeof source[key] === 'object'
              ? this.dcop(source[key])
              : source[key];
        }
        return result;
      },
      handlerone(item, a, b, c, d, e, f, text) {
        f = text;
        item.gdp = a;
        item.nop = b;
        item.bpk = c;
        item.kcp = d;
        item.bpkzs = e;
      },
      // 连上课程事件
      lskcEve() {
        if (this.selval5 && this.hasSetUpVal) {
          const param = {
            xxdm: this.xxdm,
            rwid: this.rwid,
            zgh: this.zgh,
            lsjs: this.selval5,
            lskc: this.hasSetUpVal
          };
          saveLxSkNum(param).then(response => {
            if (response.status !== 200) {
              this.$message.error(response.message);
            }
          });
        } else {
          return 0;
        }
      },
      // 连上节数事件
      lsjsEve() {
        if (this.selval5 && this.hasSetUpVal) {
          const param = {
            xxdm: this.xxdm,
            rwid: this.rwid,
            zgh: this.zgh,
            lsjs: this.selval5,
            lskc: this.hasSetUpVal
          };
          saveLxSkNum(param).then(response => {
            if (response.status !== 200) {
              this.$message.error(response.message);
            }
          });
        } else {
          return 0;
        }
      },
      // 互斥列表
      getListHC() {
        this.selectedOptions2 = [];
        const param = {
          rwid: this.rwid,
          xxdm: this.xxdm,
          zgh: this.zgh
        };
        getHeherHCjs(param).then(response => {
          this.selval5 = '';
          this.hasSetUpVal = '';
          let aval = '';
          if (response.status === 200) {
            if (typeof response.data == 'undefined') {
              this.selectedOptions2 = [];
              this.selval5 = '';
              this.hasSetUpVal = '';
            } else {
              this.selval5 = response.data.lsjs;
              this.hasSetUpVal = response.data.lskc;
              if (response.data.hcjs === '') {
                this.selectedOptions2 = [];
              } else {
                this.jszjsgxList.forEach(itemaa => {
                  if (itemaa.zgh === response.data.hcjs) {
                    aval = itemaa.zdm;
                  }
                });
                this.selectedOptions2 = [aval, response.data.hcjs];
              }
            }
          } else {
            this.$message.error(response.message);
          }
        });
      },
     /* closeKown() {
        this.knowShow = false;
      },*/
      clickChange(a) {
        const self = this;
        if (this.num == 0 || this.num !== '') {
          async function saveTeacher() {
            let isErr;
            const param = {
              rwid: self.rwid,
              zgh: self.zghNode,
              pkzs: a.pkzs,
              pkjs: a.pkjs,
              xxdm: self.xxdm,
              sfpk: a.pkParam,
              kcdm: self.kcdmtemp
            };
            return new Promise(resolve => {
              resolve(
                saveTeacherpk(param).then(response => {
                  if (response.status !== 200) {
                    isErr = true;
                    self.$message.warning(response.message);
                  } else {
                    isErr = false;
                  }
                  return isErr;
                })
              );
            });
          }

          async function deleCurriculum() {
            if (self.kcdmtemp === a.kcdm) {
              self
                .$confirm('此操作将永久删除该课程固定排, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                .then(() => {
                  let isErr;
                  const param = {
                    rwid: self.rwid,
                    bjdm: a.bjdm,
                    kcdm: a.kcdm,
                    pkzs: a.pkzs,
                    pkjs: a.pkjs,
                    xxdm: self.xxdm
                  };

                  deleteKCpk(param).then(response => {
                    if (response.status === 200) {
                      // self.getList(self.zgh)
                      self.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                      self.getList(self.zgh);
                      isErr = false;
                    } else {
                      isErr = true;
                      self.$message.warning(response.message);
                      self.colorChange(
                        '白色-> 绿色',
                        a,
                        false,
                        true,
                        false,
                        false,
                        '固定排',
                        1
                      );
                    }
                    return Promise.resolve(isErr);
                  });
                });
              return 0;
            }
            self.$message.warning('请选择正确课程进行编辑');
          }

          async function deleTeacher() {
            let isErr;
            const param = {
              rwid: self.rwid,
              zgh: self.zghNode,
              pkzs: a.pkzs,
              pkjs: a.pkjs,
              xxdm: self.xxdm,
              kcdm: self.kcdmtemp
            };

            return new Promise(resolve => {
              resolve(
                deleteTeacherpk(param).then(response => {
                  if (response.status !== 200) {
                    isErr = true;
                    self.$message.warning(response.message);
                    self.colorChange(
                      '白色-> 绿色',
                      a,
                      false,
                      true,
                      false,
                      false,
                      '固定排',
                      1
                    );
                  } else {
                    isErr = false;
                  }
                  return isErr;
                })
              );
            });
          }

          if (a.bpkzs) return 0;

          // yellow -> white
          if (a.bjdm !== '' && a.sfpk.toString() === '') {
            this.colorChange(
              null,
              a,
              false,
              false,
              true,
              false,
              1,
              3,
              deleCurriculum
            );
          } else if (a.bjdm === '' && a.sfpk.toString() === '' && !a.bpk && !a.gdp && !a.nop) {
            // white -> red
            this.colorChange(
              null,
              a,
              true,
              false,
              false,
              false,
              '不排课',
              2,
              saveTeacher
            );
          } else if (a.bjdm === '' && a.sfpk.toString() === '' && a.bpk && !a.gdp && !a.nop) {
            // red -> green
            this.colorChange(
              null,
              a,
              false,
              true,
              false,
              false,
              '固定排',
              1,
              saveTeacher
            );
          } else if (a.bjdm === '' && a.sfpk.toString() === '' && !a.bpk && a.gdp) {
            // green -> white
            this.colorChange(
              null,
              a,
              false,
              false,
              false,
              true,
              '',
              3,
              deleTeacher
            );
          } else if (a.bjdm === '' && a.xspk === '不排课' && a.bpk) {
            this.colorChange(
              null,
              a,
              false,
              true,
              false,
              false,
              '固定排',
              1,
              saveTeacher
            );
          } else if (a.bjdm === '' && a.xspk === '固定排' && !a.bpk) {
            this.colorChange(
              null,
              a,
              false,
              false,
              false,
              true,
              '',
              3,
              deleTeacher
            );
          } else if (a.bjdm === '' && a.xspk === '' && a.nop) {
            this.colorChange(
              null,
              a,
              true,
              false,
              false,
              false,
              '不排课',
              2,
              saveTeacher
            );
          } else if (!a.bpk && !a.bpkzs && !a.gdp && !a.kcp && !a.nop) {
            this.colorChange(
              null,
              a,
              true,
              false,
              false,
              false,
              '不排课',
              2,
              saveTeacher
            );
          } else if (!a.bpk && !a.bpkzs && !a.gdp && a.kcp && !a.nop) {
            self.$message.warning('请选择正确课程进行编辑');
          } else {
            console.log('HasBackError......');
          }
        } else {
          self.$message.warning('请选择一门已设置课程! ');
        }
      },

      pzJszTreeData(jszjsgxList, b, a) {
        if (a) {
          b();
        }
        this.data2 = [];
        const data2 = [];
        pkjsList({ xxdm: this.xxdm, rwid: this.rwid }).then(res => {
          for (const item of this.jszList) {
            const exp = {};
            exp.value = item.zmd;
            exp.label = item.zmc;
            exp.children = [];
            for (const obj of jszjsgxList) {
              if (item.zdm === obj.zdm) {
                const objexp = {};
                if (res.data.rows.indexOf(obj.zgh) > -1) {
                  objexp.value = obj.zgh;
                  objexp.label = jcsj.hqjsmcByid(this.jsList, obj.zgh);
                  objexp.zdm = obj.zdm;
                  exp.children.push(objexp);
                }
              }
            }
            data2.push(exp);
          }
        });
        this.data2 = data2;
      },

      handlertwo(arr) {
        arr.forEach(item => {
          if (item.parent === 1) {
            if (item.children && item.children.length > 0) {
              item.value = item.children[0].zdm;
              item.children.forEach((itema, indexa) => {
                if (itema.value === this.zghNode) {
                  item.children.splice(indexa, 1);
                }
                this.handlertwo(item.children);
              });
            } else {
              item.value = this.count++;
            }
          }
        });
        return arr;
      },
      mrzk(jszjsgxList) {
        this.mrzk1 = this.jszList[0].zdm;
        for (const obj of jszjsgxList) {
          if (this.jszList[0].zdm === obj.zdm) {
            this.mrxz1 = obj.zgh;
            this.zgh = obj.zgh;
            return false;
          }
        }
      },
      mergeEve() {
        if (this.allowClick) {
          const self = this;
          if (this.mergeNum !== 2) {
            this.$message.warning('请选择正确数量的班级');
            return 0;
          }
          const postParam = [];
          // let kcdmd = '';
          this.mergeBefArr.forEach(item => {
            const obj = {};
            obj.rwid = self.rwid;
            obj.xxdm = self.xxdm;
            obj.bjdm = item.bjdm;
            // obj.kcdm = kcdmd = item.kcdm;
            obj.kcdm = item.kcdm;
            obj.zgh = item.zgh;
            postParam.push(obj);
          });
          const param = { pkJxjhList: postParam };
          mergeClass(param).then(response => {
            if (response.status !== 200) {
              if (response.message) {
                self.$message.error(response.message);
              } else {
                self.$message.error('系统异常');
              }
              return 0;
            }
            const param = {
              xxdm: self.xxdm,
              rwid: self.rwid
            };
            toFindCommonClassList(param).then(response => {
              const tempArr = [];
              let d = [];
              let b = [];

              response.forEach(item => {
                const a = {};
                a.hbid = item.hbid;
                a.hbbj = item.hbbj;
                d = item.hbbj.split(',');
                a.hbbjmc =
                  jcsj.hqbjmcByid(self.bjList, d[0]) +
                  '，' +
                  jcsj.hqbjmcByid(self.bjList, d[1]);
                a.hbkc = item.hbkc;
                a.hbkcmc = jcsj.hqkcmcByid(self.kcList, item.hbkc);
                a.zgh = item.zgh;

                if (item.zgh) {
                  if (item.zgh.indexOf(',') !== -1) {
                    b = item.zgh.split(',');
                    if (b[0] === b[1]) {
                      a.jsmc = jcsj.hqjsmcByid(self.jsList, b[0]);
                    } else {
                      a.jsmc =
                        jcsj.hqjsmcByid(self.jsList, b[0]) +
                        ' , ' +
                        jcsj.hqjsmcByid(self.jsList, b[1]);
                    }
                  } else {
                    a.jsmc = jcsj.hqjsmcByid(self.jsList, item.zgh);
                  }
                }

                a.xsbz = a.hbkcmc + '：' + a.jsmc + '（' + a.hbbjmc + '）';
                tempArr.push(a);
              });
              this.curriculumFindClassTeacherEven(this.temObja);
              this.checkboxGroup2 = [];
              this.threeData = tempArr;
            });
          });
          this.allowClick = false;
        }
      },
      tableRowClassName({ row }) {
        if (row.isRed) {
          return 'commonStyle';
        } else if (row.blank) {
          return 'commonblank';
        }
        return '';
      },
      breakEve() {
        if (!this.isEnd) {
          const param = {
            hbid: this.temObjb.hbid,
            rwid: this.rwid,
            xxdm: this.xxdm,
            zgh: this.temObjb.zgh,
            hbkc: this.temObjb.hbkc,
            hbbj: this.temObjb.hbbj
          };
          breakClass(param).then(response => {
            this.checkboxGroup2 = [];
            this.curriculumFindClassTeacherEven(this.temObja);
            $('.nodeP').each((index, el) => {
              $(el).removeClass('highBackg');
            });
            this.hbList();
            this.isEnd = true;
          });
        }
      },
      hbList() {
        const self = this;
        const param = {
          kcdm: self.kcdm_,
          xxdm: self.xxdm,
          rwid: self.rwid
        };
        toFindCommonClassList(param).then(response => {
          const tempArr = [];
          let d = [];
          let b = [];
          response.forEach(item => {
            const a = {};
            a.hbid = item.hbid;
            a.hbbj = item.hbbj;
            d = item.hbbj.split(',');
            a.hbbjmc =
              jcsj.hqbjmcByid(self.bjList, d[0]) +
              '，' +
              jcsj.hqbjmcByid(self.bjList, d[1]);
            a.hbkc = item.hbkc;
            a.hbkcmc = jcsj.hqkcmcByid(self.kcList, item.hbkc);
            a.zgh = item.zgh;

            if (item.zgh) {
              if (item.zgh.indexOf(',') !== -1) {
                b = item.zgh.split(',');
                if (b[0] === b[1]) {
                  a.jsmc = jcsj.hqjsmcByid(self.jsList, b[0]);
                } else {
                  a.jsmc =
                    jcsj.hqjsmcByid(self.jsList, b[0]) +
                    ' , ' +
                    jcsj.hqjsmcByid(self.jsList, b[1]);
                }
              } else {
                a.jsmc = jcsj.hqjsmcByid(self.jsList, item.zgh);
              }
            }

            a.xsbz = a.hbkcmc + '：' + a.jsmc + '（' + a.hbbjmc + '）';
            tempArr.push(a);
          });
          // this.curriculumFindClassTeacherEven(this.temObja)
          this.checkboxGroup2 = [];
          this.threeData = tempArr;
        });
      },
      nuData() {
        this.loadTree();
        this.contentList = []; // 排不排课M
        this.filterText = '';
      },
      midDataClear() {
        this.xqList = [];
        this.contentList = [];
      },
      filterNode(value, data) {
        if (!value) {
          return true;
        }
        return data.label.indexOf(value) !== -1;
      },
      delIt(a) {
        const self = this;

        async function deleTeacher() {
          let isErr;
          const param = {
            rwid: self.rwid,
            zgh: self.zghNode,
            pkzs: a.pkzs,
            pkjs: a.pkjs,
            xxdm: self.xxdm,
            kcdm: self.kcdmtemp
          };

          return new Promise(resolve => {
            resolve(
              deleteTeacherpk(param).then(response => {
                if (response.status !== 200) {
                  isErr = true;
                  self.$message.warning(response.message);
                  return 0;
                } else {
                  isErr = false;
                }
                return isErr;
              })
            );
          });
        }

        this.colorChange(
          '绿色 -> 白色',
          a,
          false,
          false,
          false,
          true,
          '',
          3,
          deleTeacher
        );
      },
      handleChange(a) {
        if (a.length > 0) {
          this.tableTwoShow = a;
        }
        const self = this;
        const param = {
          rwid: self.rwid,
          xxdm: self.xxdm,
          zgh: self.zgh,
          hcjs: a[1] || ''
        };
        saveHcJs(param).then(response => {
          if (response.status !== 200) {
            this.$message.error(response.message);
          } else {
            self.getHadSettingHCMethod();
          }
        });
      },
      getHadSettingMethod() {
        const self = this;
        const param = {
          rwid: self.rwid,
          xxdm: self.xxdm
        };
        getHadSetting(param).then(response => {
          self.settingVal = [];
          for (let i = 0; i < response.length; i++) {
            const c = {};
            c.id = response[i].zgh;
            c.name = jcsj.hqjsmcByid(self.jsList, response[i].zgh);
            self.settingVal.push(c);
          }
        });
      },
      // 已设置过的老师 查看详情
      async lookDetail1(item, index) {
        this.num1 = index;
        this.contentList = [];
        this.jxjhbykcdm = [];
        await this.loadTree();
        this.zghNode = item.id;
        this.zgh = item.id;
        await this.getClassa();
        this.num = '';
      },
      // 设置过的课程查看详情
      lookDetail2(item, index) {
        this.num2 = index;
        this.loadTree(this.asnycDa(item), 1);
      },

      asnycDa(a) {
        this.zghNode = a.id;
        this.zgh = a.id;
        this.hcName = a.name;
        this.getListHC();
        this.getClassa();
        const temArray = this.dcop(this.data2);
        temArray.forEach(item => {
          item.parent = 1;
        });
        this.handlertwo(temArray);
        this.dataHCa = temArray;
      },
      /**
       * 查询课程
       */
      getHaveSetCurriculum() {
        const self = this;
        const param = {
          rwid: self.rwid,
          xxdm: self.xxdm
        };
        findHaveSetCurriculum(param).then(response => {
          const settingVal = [];
          response.forEach(item => {
            const a = {};
            a.label = jcsj.hqkcmcByid(this.kcList, item);
            a.value = item;
            settingVal.push(a);
          });
          this.seldata2 = settingVal;
        });
      },
      /**
       * 查询班级
       */
      curriculumFindClassTeacherEven(a) {
        this.temObja = a;
        this.kcdm_ = a.value;
        const self = this;
        self.classTeachNameArr = [];
        self.checkboxGroup2 = [];
        const param = {
          rwid: self.rwid,
          xxdm: self.xxdm,
          kcdm: a.value
        };
        curriculumFindClassTeacher(param).then(response => {
          const settingVal = [];
          const temRes = this.dcop(response);
          const temResa = this.dcop(response);
          temRes.forEach(item => {
            const a = {};
            let b = [];
            const c = '';
            a.bjmc = jcsj.hqbjmcByid(self.bjList, item.bjdm);
            if (item.zgh) {
              if (item.zgh.indexOf(',') !== -1) {
                b = item.zgh.split(',');
                a.jsmc =
                  jcsj.hqjsmcByid(self.jsList, b[0]) +
                  ' , ' +
                  jcsj.hqjsmcByid(self.jsList, b[1]);
              } else {
                a.jsmc = jcsj.hqjsmcByid(self.jsList, item.zgh);
              }
            }
            if (typeof a.jsmc == 'undefined') a.jsmc = '';
            self.classTeachNameArr.push(a.bjmc + ' ' + a.jsmc || c);
            settingVal.push(a);
          });

          for (let dd = 0; dd < temResa.length; dd++) {
            settingVal[dd].bjdm = temResa[dd].bjdm;
            settingVal[dd].kcdm = temResa[dd].kcdm;
            settingVal[dd].zgh = temResa[dd].zgh;
            settingVal[dd].zxs = temResa[dd].zxs;
            settingVal[dd].bjjsmc =
              settingVal[dd].bjmc +
              (settingVal[dd].jsmc === '' ? '' : '：' + settingVal[dd].jsmc);
          }
          self.classTeachNameArr = settingVal;
        });
      },
      clickClassTeach(a, b) {
        this.temObjb = null;
        this.isEnd = false;
        $('.nodeP')
          .eq(b)
          .addClass('highBackg')
          .siblings()
          .removeClass('highBackg');
        this.temObjb = this.threeData[b];
      },
      getHadSettingHCMethod() {
        const self = this;
        const param = {
          rwid: self.rwid,
          xxdm: self.xxdm
        };
        getHadSettingHCMethod(param).then(response => {
          self.settingVal = [];
          for (let i = 0; i < response.length; i++) {
            const c = {};
            c.id = response[i];
            c.name = jcsj.hqjsmcByid(self.jsList, response[i]);
            self.settingVal.push(c);
          }
        });
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
      },
      jszList: {
        /** 教师组列表数据**/
        type: Array,
        required: true
      }
    }
  };
</script>


<style scoped>
  .jssz .kcChangeStat-bpk {
    background-color: #f66b6b;
  }

  .jssz .kcChangeStat-gdp {
    background-color: #67c23a;
  }

  .jssz .kcChangeStat-kcp {
    background-color: #ffb542;
  }

  .jssz .kcChangeStat-nop {
    background-color: white;
  }

  .jssz .kcChangeStat-bcgrey {
    background-color: #959a9d;
    color: white;
  }

  .jsszKown {
    color: #777777a3;
    font-size: 14px;
    display: inline-block;
    height: 32px;
    line-height: 32px;
    opacity: 1;
  }

  .selBox-input input {
    text-align: center;
  }

  .jssz .highBackg {
    background-color: #efefef;
  }

  .jssz .thp {
    text-align: left;
    padding: 5px;
    color: grey;
    cursor: pointer;
  }

  .jssz .handleCheckGroup,
  .handleCheckGroup > span {
    width: 100%;
  }
</style>
<style>
  .jssz .el-loading-mask {
    top: 465px !important;
  }
  .jssz .el-checkbox-button:first-child .el-checkbox-button__inner {
    margin-top: 10px !important;
  }

  .jssz .stat_aa:hover {
    background: #eff9ec;
  }

  .jssz .el-checkbox-button--medium .el-checkbox-button__inner {
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 0;
    width: 153px;
  }

  .jssz .el-card__header {
    background: #f5f7fa;
    padding: 9px 20px !important;
  }

  .jssz .el-table td {
    padding: 0;
    height: 47px;
  }

  .jssz .el-table .cell {
    padding: 0;
    height: 47px;
    line-height: 47px;
    text-align: center;
  }

  .jssz .el-table .cell > div {
    height: 100%;
    width: 100%;
  }
  .jssz .changeClickItem {
    background: #409EFF !important;
    color: #ffffff;
  }
  .jssz .chageClickItemBefore {
    background: #eff9ec !important;
  }
  .jssz .el-table .commonStyle {
    color: #e6a23c;
    background-color: #fdf6ec;
  }
  .jssz .el-table .commonblank,
  .jssz .el-table .commonblank td,
  .jssz .el-table .commonblank td .cell {
    height: 10px;
    background-color: #eee;
  }
  .jssz .el-table td,
  .jssz .el-table th {
    padding: 0 !important;
  }
  .jssz .el-table .cell .el-input__inner {
    height: 47px;
    line-height: 47px;
    border-radius: 0 !important;

  }
  .jssz .el-card {
    margin-bottom: 20px;
  }
  .jssz .el-scrollbar .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
  }
</style>
