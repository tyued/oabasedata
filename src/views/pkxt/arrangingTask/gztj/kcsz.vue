<!--规则条件 课程设置 -->
<template>
  <div class="gz-kcsz">
    <el-row>
      <el-radio-group v-model="setKc" @change="radiochange">
        <el-radio-button label="1">固定排/不排设置</el-radio-button>
        <el-radio-button label="2">互斥/连排</el-radio-button>
        <el-radio-button label="3">单双周</el-radio-button>
      </el-radio-group>
    </el-row>


    <el-row class="mt20">
      <div class="pkleftmenu">
        <div class="tit">选择班级</div>

        <el-tree class='pkbjtree'
                 :highlight-current="true"
                 :data="data1"
                 node-key="id"
                 @node-click="checkbj"
                 :default-expanded-keys="[2, 3]"
                 :default-checked-keys="[5]">
        </el-tree>

      </div>
      <!-- ========================================================固定排开始==================================================== -->
      <div v-show="setKc=='1'" class="pkrightmenu">
        <div class="setKCtime">
          <div class="tit">设置课程</div>
          <div class="cont">
            <!-- <el-radio-group v-model="checkKc"> -->
              <!-- :autofocus="index === 0" -->
              <el-button
              style="margin-top: 4px;"
              type="primary"
              v-for="(item,index) in classCourseList"
              :key="index"
              @click="classTabChange(item.kcdm,index)"
              :plain="item.zzclass">{{item.eachClass}}</el-button>

            <!-- </el-radio-group> -->
          </div>
        </div>
        <!--<el-alert
          title="温馨提示，鼠标移入空白表格设置当前课程，点击课程标签设置为“不排课”，点击不排课标签设置为空"
          type="warning" show-icon></el-alert>  -->
        <div class="KbMain smallscroll">
          <el-table
            :cell-class-name="handleTableItemClass"
            :data="tableDataClass"
            :span-method="handleClassTable"
            border
            style="width: 100%;"
            :row-class-name="tableRowClassName">
            <el-table-column
              align="center"
              header-align="center"
              prop="title.jcmc"
              label="星期/节次切换"
              width="180">
              <template slot-scope="scope">
                <span :class="{'span-top': scope.row.title.qzsj}">{{ scope.row.title.jcmc }}</span>
                <span :class="{'span-bottom': scope.row.title.qzsj}">&nbsp;{{ scope.row.title.qzsj }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in weekGroup"
              :key="index"
              align="center"
              header-align="center"
              :prop="['amount' + item].name"
              :label="'星期'+formatWeek(item)">
              <template slot-scope="scope">
                <div
                :class="{isforbidden: scope.row['amount' + item].gray, isgood: scope.row['amount' + item].green, isbad: scope.row['amount' + item].red}"
                @click="handleChange(scope.row['amount' + item])">{{scope.row['amount' + item].name}}</div>
                <div
                @click="handleX(scope.row['amount' + item])"
                v-if="scope.row['amount' + item].sfpk == 1 || scope.row['amount' + item].sfpk == 2"
                id="close"
                ><i class="el-icon-close"></i></div>
                <!-- :class="[{ isgood: scope.row.amount1.green, isbad: scope.row.amount1.sfpk == 2, isforbidden: scope.row.amount1.sfpk == 0 }]" -->
              </template>
            </el-table-column>
            <!-- <el-table-column
              align="center"
              header-align="center"
              prop="amount2.name"
              label="星期二">
              <template slot-scope="scope">
                <div
                :class="{isforbidden: scope.row.amount2.gray, isgood: scope.row.amount2.green, isbad: scope.row.amount2.red}"
                @click="handleChange(scope.row.amount2)">{{scope.row.amount2.name}}</div>
                <div
                @click="handleX(scope.row.amount2)"
                v-if="scope.row.amount2.sfpk == 1 || scope.row.amount2.sfpk == 2"
                id="close"
                ><i class="el-icon-close"></i></div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              prop="amount3.name"
              label="星期三">
              <template slot-scope="scope">
                <div
                :class="{isforbidden: scope.row.amount3.gray, isgood: scope.row.amount3.green, isbad: scope.row.amount3.red}"
                @click="handleChange(scope.row.amount3)">{{scope.row.amount3.name}}</div>
                <div
                @click="handleX(scope.row.amount3)"
                v-if="scope.row.amount3.sfpk == 1 || scope.row.amount3.sfpk == 2"
                id="close"
                ><i class="el-icon-close"></i></div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              prop="amount4.name"
              label="星期四">
              <template slot-scope="scope">
                <div
                :class="{isforbidden: scope.row.amount4.gray, isgood: scope.row.amount4.green, isbad: scope.row.amount4.red}"
                @click="handleChange(scope.row.amount4)">{{scope.row.amount4.name}}</div>
                <div
                @click="handleX(scope.row.amount4)"
                v-if="scope.row.amount4.sfpk == 1 || scope.row.amount4.sfpk == 2"
                id="close"
                ><i class="el-icon-close"></i></div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              prop="amount5.name"
              label="星期五">
              <template slot-scope="scope">
                <div
                :class="{isforbidden: scope.row.amount5.gray, isgood: scope.row.amount5.green, isbad: scope.row.amount5.red}"
                @click="handleChange(scope.row.amount5)">{{scope.row.amount5.name}}</div>
                <div
                @click="handleX(scope.row.amount5)"
                v-if="scope.row.amount5.sfpk == 1 || scope.row.amount5.sfpk == 2"
                id="close"
                ><i class="el-icon-close"></i></div>
              </template>
            </el-table-column> -->
          </el-table>
        </div>

      </div>
      <!--        =================================================互斥连排=======================================================-->
      <div v-show="setKc=='2'" class="pkrightmenu">
        <el-alert
          title="温馨提示，设置的条件条数过多，会大大降低排课的概率，请优先设置最重要的"
          type="warning" show-icon></el-alert>
        <table cellpadding="0" cellspacing="0" class="gentable fl mt10">
          <tr>
            <th class="xh">序号</th>
            <th>课程名称</th>
            <th>互斥/时间段</th>
            <th>节次连排</th>
            <th>课程连排</th>
          </tr>

          <tr  v-for="(item,index) of bjchlplist"  :key="index" >
            <td class="xh">{{index+1}}</td>
            <td>{{item.kcmc}}</td>
            <td>

              <el-select v-model="item.hckc" placeholder="请选择"  @change="checklp(item.hckc,index)"   style="width:100px;margin:0 5px;">
                <el-option
                  v-for="(a,i) of item.hckclist"
                  v-if="a.uuid!=item.kcdm "
                  :label="a.kcmc"
                  :value="a.uuid"
                  :key="a.uuid" >
                </el-option>
              </el-select>
              <el-select v-model="item.hcfs" placeholder="请选择"   @change="checkHcfs(item.hckc,index)" style="width:100px;margin:0 5px;">
                <el-option
                  v-for="(b,j) of hcfslx"
                  :label="b.label"
                  :value="b.value"
                  :key ="b.label">
                </el-option>
              </el-select>

            </td>
            <td>

              <el-radio v-model="item.sfls" disabled  v-if="item.zxs == '1' " label="1"   @change="jclpChange" >是</el-radio>
              <el-radio v-model="item.sfls"   v-if="item.zxs != '1' " label="1"  @change="jclpChange">是</el-radio>
              <el-radio v-model="item.sfls" label="2"  @change="jclpChange">否</el-radio>
            </td>
            <td>
              <el-select v-model="item.kclp"    placeholder="请选择"  @change="checkLpkc()">

                <el-option
                  v-for="(c,e) of item.kclplist"
                  v-if="c.uuid!=item.kcdm &&c.uuid!=item.hckc "
                  :label="c.kcmc"
                  :value="c.uuid"
                  :key="c.kcmc" >
                </el-option>
              </el-select>
            </td>
          </tr>

        </table>
      </div>



      <!--//========================================================================单双周========================================================================-->
      <div v-show="setKc=='3'" class="pkrightmenu">
        <div class="oarow">
          <el-button type="primary" @click="addDsz" icon="el-icon-plus" size="medium" plain>新增</el-button>
        </div>

        <table cellpadding="0" cellspacing="0" class="gentable fl mt10">
          <tr>
            <th>班级名称</th>
            <th>单周</th>
            <th>双周课程</th>
            <th>周上课节数</th>
            <th>操作</th>
          </tr>

          <tr v-for="(item,index) in dszlist" :key="index">
            <td >{{item.bjmc}}</td>
            <td >{{item.dzkcmc}}</td>
            <td>{{item.szkcmc}}</td>
            <td>{{item.zxs}}</td>
            <td><span class="delRecord el-icon-delete" @click="delDsz(item.id)"> 删除</span></td>
          </tr>




        </table>
      </div>
    </el-row>

    <!--以下都是弹层页面-->
    <el-dialog title="添加单双周课程" :visible.sync="singledoubleKc" width="500px">
      <el-form :model="sdform" ref="sdform" label-width="90px">
        <el-form-item prop="dzkc" resetField label="单周课程" :rules="[{required: true,message: '单周课程不能为空'}]">
          <el-select v-model="sdform.dzkc" placeholder="请选择"  @change="getszkc">
            <el-option
              v-for="item in dzkclist"
              :key="item.uuid"
              :label="item.kcmc"
              :value="item.uuid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="szkc" resetField label="双周课程" :rules="[{required: true,message: '双周课程不能为空'}]">
          <el-select v-model="sdform.szkc" placeholder="请选择"  >
            <el-option
              v-for="item in szkclist"
              :key="item.uuid"
              :label="item.kcmc"
              :value="item.uuid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item  resetField label="备注">

          <el-input
            type="textarea"
            readonly="true"
            :rows="5"
            placeholder="请输入内容"
            v-model="sdform.bz">
          </el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
                <el-button @click="singledoubleKc = false">取 消</el-button>
                <el-button type="primary"  @click="submitForm('sdform')" :disabled="changeSure">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
  import { saveadd, delbyid, getdszkc, getpage, getbjhclist, savebjhc, getbjClasslist, getDetailClassTable, saveDetailClassTable, deleteDetailClass } from '@/api/pkxt/arrangingTask/gztj/kcsz';
  import jcsj from '@/api/jcsj';
  export default {
    data() {
      return {
        jxjhAllList:[],//教学计划所有班级的
        zzclass: [],
        dqlx: '1', // 当前所处模块类型 1：固定拍不排 2：互斥连排 3：单双周
        bjchlplist: [], // 班级互斥列表
        jxjhlist: [], // 一个班的课程
        dzjs: '', // 单周上课节数(单双周)
        szjs: '', // 双上课节数(单双周)
        dszlist: [], // (单双周)
        kcdm: '', // select切换时候传过来的kcdm（单双周)
        dialogFormVisible: false, // (单双周)
        changeSure: false, // (单双周)
        rwid: 1,
        xxdm: '',
        bjdm: '', // 当前选择的班级的班级代码
        bjmc: '', // 当前选择的班级的班级名称
        njdm:'',//当前选的班级所属年级
        setKc: '1',
        singledoubleKc: false,      // 设置单双周课程弹层

        checkKc: '语文',
        radio: [],
        sdform: { dzkc: '', szkc: '', bz: '1、两门课程的周上课节数相同 2.、单双周计划设置完成后，两门课将会被安排在同一个时间点。3、单双周计划设置完成后，两门课将会以周为单位，交替排课' },
        hcfslx: [{
          label: '请选择',
          value: '0'
        }, {
          label: '半天',
          value: '1'
        }, {
          label: '全天',
          value: '2'
        }],
        dzkclist:[],
        szkclist: [],
        data1: [],//班级树
        tableDataClass: [], // 固定排表格
        classCourseList: [],
        selectedClass: '',
        spanArr: [],
        n1: 0,
        n2: 1,
        weekGroup: []
      }
    },

    created() {
      this.rwid = this.$route.query.rwid;
      const xndm = this.$route.query.rwxn;
      this.xxdm = window.localStorage.getItem('xxdm');
      this.bjdm = "";
      this.njdm="";
      // this.loadnjBjData();
      this.weekGroup = JSON.parse(window.localStorage.getItem('weekGroup'))
    },
    methods: {
      //节次连排change事件
      jclpChange(){
        //保存连排互斥
        this.savebjhc();
      },
      //课程里连排change事件
      checkLpkc(){
        //保存连排互斥
        this.savebjhc();
      },
      // 互斥方式改变事件
      checkHcfs(hckc, index) {
            let hcfs= this.bjchlplist[index].hcfs;
            if(hckc=="hc"){
              this.bjchlplist[index].hcfs="0";
            }
            for (let j = 0; j < this.bjchlplist.length; j++) {
              const kcdm = this.bjchlplist[j].kcdm;
              if (kcdm == hckc) {
                 this.bjchlplist[j].hcfs = this.bjchlplist[index].hcfs;
                 if(hcfs==="0"){
                  this.bjchlplist[index].hckc="hc";
                  this.bjchlplist[j].hckc = "hc";
                }
              }
            }
            //保存连排互斥
            this.savebjhc();
      },
      // 互斥课程改变事件
      checklp(hckc, index) {
            const lpkc = this.bjchlplist[index].kclp;
            if (hckc == lpkc) {
              this.$set(this.bjchlplist[index], 'kclp', 'lp');
            }
            const dqkcdm = this.bjchlplist[index].kcdm;
            // 清空
            for (var j = 0; j < this.bjchlplist.length; j++) {
              const kcdm_ = this.bjchlplist[j].kcdm;
              const hckc_ = this.bjchlplist[j].hckc;
              if (hckc_ == hckc) {
                this.$set(this.bjchlplist[j], 'hckc', 'hc');
                this.$set(this.bjchlplist[j], 'hcfs', '0');
              }
              if (dqkcdm == hckc_) {
                this.$set(this.bjchlplist[j], 'hckc', 'hc');
                this.$set(this.bjchlplist[j], 'hcfs', '0');
              }
            }
            // 结果
            this.bjchlplist[index].hckc = hckc;
            for (var j = 0; j < this.bjchlplist.length; j++) {
              const kcdm = this.bjchlplist[j].kcdm;
              const hckc_ = this.bjchlplist[j].hckc;

              if (kcdm == hckc) {
                this.bjchlplist[j].hckc = this.bjchlplist[index].kcdm;
                const temphcfs_j = this.bjchlplist[j].hcfs;
                const temphxjs_index = this.bjchlplist[index].hcfs;
                if (temphcfs_j != '0') {
                  this.bjchlplist[index].hcfs = this.bjchlplist[j].hcfs;
                } else if (temphxjs_index != '0') {
                  this.bjchlplist[j].hcfs = this.bjchlplist[index].hcfs;
                } else {
                  this.bjchlplist[j].hcfs = '1';
                  this.bjchlplist[index].hcfs = '1';
                }
              }
            }
           //保存连排互斥
           this.savebjhc();
      },
      radiochange(value) {
        this.dqlx = value;
        if (value === '1') {
          // 固定排tab选项
          // 重置课程nav和table
          this.classCourseList = []
          this.tableDataClass = []
          this.loadnjBjData();
          this.bjdm = '';
        }
        if (value === '2') {
          // 互斥连排
          this.loadnjBjData();
          // 获取互斥连排信息
          this.bjdm = '';
         // this.loadbjhc();
        }
        if (value === '3') {
            this.loadnjBjData();
            // 单双周
            this.bjdm = "";
            this.njdm="";
            const param = {
              xxdm: this.xxdm,
              bjdm: this.bjdm,
              rwid: this.rwid
            }
            this.dszlist = [];
            getpage(param).then(response => { // 获取所有列表信息
              this.jxjhAllList = response.data.jxjhlist;//所有教育计划
              let alldszlist=response.data.dszlist;//所有单双周
              for (let j = 0; j < alldszlist.length; j++) {
                const map = alldszlist[j];
                const dzkc = map.dzkc;
                const szkc = map.szkc;
                const dzkcmc = jcsj.hqkcmcByid(this.kcList, dzkc);
                const szkcmc = jcsj.hqkcmcByid(this.kcList, szkc);
                const bjmc = jcsj.hqbjmcByid(this.bjList, map.bjdm);
                const getjslist = _.filter(this.jxjhAllList, { kcdm: dzkc, bjdm: map.bjdm });// 获取上课节数
                map.dzkcmc = dzkcmc;
                map.szkcmc = szkcmc;
                map.zxs = getjslist[0].zxs;
                map.bjmc = bjmc;
                this.dszlist.push(map);
              }

            });

        }
      },
      savebjhc() {
        const final_bjhc = [];

        for (let j = 0; j < this.bjchlplist.length; j++) {
          const map = this.bjchlplist[j];
          let hckc_temp = map.hckc;
          let hcfs_temp = map.hcfs;
          if (hckc_temp != 'hc') {
            if (hcfs_temp == '0') {
              hcfs_temp = '1';
            }
          } else {
            hckc_temp = '';
            hcfs_temp = '';
          }

          const param = {
            rwid: this.rwid,
            bjdm: this.bjdm,
            kcdm: map.kcdm,
            hckc: hckc_temp,
            hcfs: hcfs_temp,
            sfls: map.sfls,
            kclp: map.kclp === 'lp' ? '' : map.kclp,
            xxdm: this.xxdm
          }
         /* if(hckc_temp===""&&hcfs_temp===""&&map.sfls==="2"&&map.kclp=="lp"){
          }else{
          }*/
          final_bjhc.push(param);
        }
        const param = { bjhclist: final_bjhc, bjdm: this.bjdm, rwid: this.rwid };
        if (this.bjdm != 'undefined' && this.bjdm != null && this.bjdm != '') {
          savebjhc(param).then(res => {
            if (res.status == '200') {
               this.$notify({title: '成功', message: '保存成功', type: 'success', duration: 2000});
            } else {
              this.$notify({ title: '课程设置失败', message: res.message, type: 'error', duration: 2000 });
            }
          })
        }
      },
      loadbjhc() {
        const param = {
          xxdm: this.xxdm,
          bjdm: this.bjdm,
          rwid: this.rwid
        }
        if (this.bjdm != '' && this.bjdm != 'undefined' && this.bjdm != null) {
          this.bjchlplist = [];
          getbjhclist(param).then(response => {
            const bjhclist_data = response.data.bjhclist;
            const jzjhlist_data = response.data.jxjhlist;// 课程节数
            const oneclassKc = _.filter(jzjhlist_data, { bjdm: this.bjdm });// 课程节数
            this.jxjhlist = [];// 处理后的一个班的所有课程
            const hclist = [];
            const lplist = [];
            hclist.push({ uuid: 'hc', kcmc: '请选择' });
            lplist.push({ uuid: 'lp', kcmc: '请选择' });

            for (var j = 0; j < oneclassKc.length; j++) {
              const js = oneclassKc[j].zxs;
              if (js != '0') {
                const kcmc = jcsj.hqkcmcByid(this.kcList, oneclassKc[j].kcdm);
                const kcdm = oneclassKc[j].kcdm;
                this.jxjhlist.push({ uuid: kcdm, kcmc:kcmc,zxs:js });
                hclist.push({ uuid: kcdm, kcmc:kcmc });
                lplist.push({ uuid: kcdm, kcmc:kcmc });
              }
            }

            if (bjhclist_data.length === 0) {
              for (var i = 0; i < this.jxjhlist.length; i++) {
                const kcmc = this.jxjhlist[i].kcmc;
                const kcdm = this.jxjhlist[i].uuid;
                const zxs=this.jxjhlist[i].zxs;//上课节数

                const param = {
                  kcmc:kcmc,
                  kcdm:kcdm,
                  zxs:zxs,
                  hckc: 'hc',
                  hckclist: hclist,
                  hcfs: '0',
                  sfls: '2',
                  kclp: 'lp',
                  kclplist: lplist
                }
                this.bjchlplist.push(param);
              }
            } else {//有数据
                this.bjchlplist = [];
                for (var i = 0; i < bjhclist_data.length; i++) {
                  const kcmc = jcsj.hqkcmcByid(this.kcList, bjhclist_data[i].kcdm);
                  const kcdm = bjhclist_data[i].kcdm;
                  let hckc_tmep = bjhclist_data[i].hckc;
                  const sfls_temp = bjhclist_data[i].sfls;
                  let hcfs_temp = bjhclist_data[i].hcfs;
                  let kclp_temp = bjhclist_data[i].kclp;
                  let  zxs_temp="";

                  for (let j = 0; j < this.jxjhlist.length; j++) { //
                        const kcmc_jxjh = this.jxjhlist[j].kcmc;
                        const kcdm_jxjh = this.jxjhlist[j].uuid;
                        const zxs=this.jxjhlist[j].zxs;//上课节数
                        if(kcdm_jxjh===kcdm){
                          zxs_temp=zxs;
                          break;
                        }
                  }

                  if (hcfs_temp != '1' && hcfs_temp != '2') {
                    hcfs_temp = '0';
                  } else {
                    hcfs_temp = hcfs_temp + '';
                  }
                  if (hckc_tmep == '' || hckc_tmep == null || hckc_tmep == 'undefined') {
                    hckc_tmep = 'hc';
                  }
                  if (kclp_temp == '' || kclp_temp == null || kclp_temp == 'undefined') {
                    kclp_temp = 'lp';
                  }

                  const param = {
                    kcmc:kcmc,
                    kcdm:kcdm,
                    zxs:zxs_temp,
                    hckc: hckc_tmep,
                    hckclist: hclist,
                    hcfs: hcfs_temp,
                    sfls: sfls_temp + '',
                    kclp: kclp_temp,
                    kclplist: lplist
                  }
                  this.bjchlplist.push(param);
                }
                // 有班级互斥列表;(与教学计划表对比重新组装数据)
                for (var i = 0; i < this.jxjhlist.length; i++) { //
                  const kcmc_jxjh = this.jxjhlist[i].kcmc;
                  const kcdm_jxjh = this.jxjhlist[i].uuid;
                  const zxs=this.jxjhlist[i].zxs;//上课节数
                  let isExist = false;
                  const param_jxjh = {
                    kcmc: kcmc_jxjh,
                    kcdm: kcdm_jxjh,
                    hckc: 'hc',
                    hckclist: hclist,
                    hcfs: '0',
                    sfls: '2',
                    kclp: 'lp',
                    kclplist: lplist
                  }
                  // debugger;
                  for (var j = 0; j < bjhclist_data.length; j++) {
                    const kcmc = jcsj.hqkcmcByid(this.kcList, bjhclist_data[j].kcdm);
                    const kcdm = bjhclist_data[j].kcdm;
                    if (kcdm_jxjh == kcdm) {
                      isExist = true;
                    }
                  }
                  if (!isExist) {
                    this.bjchlplist.push(param_jxjh);
                  }
                }

            }
          })
        } else {
          this.bjchlplist = [];
        }
      },
      // 点击班级  ：单个班级的单双周
      checkbj(a, b, c) {

        this.njdm=a.njdm;
        this.bjdm = a.bjdm;
        this.bjmc = a.label;// 当前班级名称
        if (this.dqlx == '1') {
          if (b.level == 1) { // 阻止 请求
            // 重置课程nav和table
            this.classCourseList = []
            this.tableDataClass = []
          } else if (b.level == 2) {
            this.tableDataClass = [] // 清空表格

            getbjClasslist({
              rwid: this.rwid,
              bjdm: this.bjdm
            }).then(res => {
              console.log(res, 'sdsdfdsfsd')
              if (res.status == 200) {
                let jxjhlist = res.data.jxjhlist;
                jxjhlist = jxjhlist.filter(item => item.zxs != 0)
                const oneClassCourse = _.filter(jxjhlist, { bjdm: this.bjdm });
                // console.log(oneClassCourse)
                const tmpArr = []
                oneClassCourse.forEach(item => {
                  const eachClass = jcsj.hqkcmcByid(this.kcList, item.kcdm)
                  tmpArr.push({
                    eachClass,
                    kcdm: item.kcdm
                  })
                })
                tmpArr.forEach(res => {
                  res.zzclass = true;
                });
                this.classCourseList = tmpArr
              }
            })
          }
        }
        if (this.dqlx == '2') {
          // 互斥连排
          this.loadbjhc();
        }
        if (this.dqlx == '3') {
          // 单双周
          this.dzkclist = [];
          this.szkclist = [];
          if (this.bjdm === 'undefined' || this.bjdm == null) {
            //说明点的是年级
            this.bjdm = '';
          }
          this.loadpage();
        }
      },
      // 单双周列表
      loadpage() {

        const param = {
          xxdm: this.xxdm,
          bjdm: this.bjdm,
          rwid: this.rwid
        }
        this.dszlist = [];
        getpage(param).then(response => { // 获取所有列表信息
          const jzjhlist = response.data.jxjhlist;
          let alldszlist=response.data.dszlist;
          //debugger;
          if(this.bjdm===""&&this.njdm!=""){
            alldszlist=_.filter(alldszlist, { njdm: this.njdm });
          }
          // 新增弹层页面课程处理satart
          const oneclassKc = _.filter(jzjhlist, { bjdm: this.bjdm });// 一个班所有课程
          this.jxjhlist = [];
          this.sdform.dzkc="";
          this.sdform.szkc="";
          for (let i = 0; i < oneclassKc.length; i++) {
            const js = oneclassKc[i].zxs;
            const kcmc = jcsj.hqkcmcByid(this.kcList, oneclassKc[i].kcdm);
            if (js != '0') {
              this.jxjhlist.push({ uuid: oneclassKc[i].kcdm, kcmc:kcmc,zxs:js });
            }
          }
          this.dzkclist = this.jxjhlist;
          this.szkclist=[];
          // 新增弹层页面课程处理end

          for (let j = 0; j < alldszlist.length; j++) {
            const map = alldszlist[j];
            const dzkc = map.dzkc;
            const szkc = map.szkc;
            const dzkcmc = jcsj.hqkcmcByid(this.kcList, dzkc);
            const szkcmc = jcsj.hqkcmcByid(this.kcList, szkc);
            const bjmc = jcsj.hqbjmcByid(this.bjList, map.bjdm);
            const getjslist = _.filter(jzjhlist, { kcdm: dzkc, bjdm: map.bjdm });// 获取上课节数
            map.dzkcmc = dzkcmc;
            map.szkcmc = szkcmc;
            map.zxs = getjslist[0].zxs;
            map.bjmc = bjmc;
            this.dszlist.push(map);
          }
        })
      },
      loadnjBjData() { // 处理年级和班级树结构
        this.data1 = [];
        for (let j = 0; j < this.njList.length; j++) {
          const njdata = this.njList[j];
          const njmap = {};
          njmap.label = njdata.njmc;
          njmap.njdm = njdata.njdm;
          njmap.disabled = true;
          njmap.children = [];
          const bjdata = _.filter(this.bjList, { njdm: njdata.njdm });
          for (let i = 0; i < bjdata.length; i++) {
            njmap.children.push({ label: bjdata[i].bj, bjdm: bjdata[i].uuid,njdm: njdata.njdm });
          }
          this.data1.push(njmap);
        }
      },
      // 动态获取双周课程
      getszkc(data) {
       // console.log(data);
        const kcdm = data;
        const param = {
          xxdm: this.xxdm,
          bjdm: this.bjdm,
          kcdm:kcdm,
          rwid: this.rwid
        }
        getdszkc(param).then(response => { // 获取所有列表信息
          const datas = response.data;
          if (datas.length > 0) {
            this.dzjs = datas[0].zxs;
            if (this.szjs != this.dzjs) {
              this.sdform.szkc = '';
            }
          } else {
            this.sdform.szkc = '';
          }
          this.szkclist = [];
          for (let i = 0; i < datas.length; i++) {
            const kcmc = jcsj.hqkcmcByid(this.kcList, datas[i].kcdm);
            this.szkclist.push({ uuid: datas[i].kcdm, kcmc:kcmc });
          }
        })
      },
      // 动态获取单周课程
      getdzkc(data) {
        const kcdm = data;
        const param = {
          xxdm: this.xxdm,
          bjdm: this.bjdm,
          kcdm,
          rwid: this.rwid
        }
        getdszkc(param).then(response => { // 获取所有列表信息
          const datas = response.data;

          this.dzkclist = [];
          if (datas.length > 0) {
            this.szjs = datas[0].zxs;
            if (this.szjs != this.dzjs) {
              this.sdform.dzkc = '';
            }
          } else {
            this.sdform.dzkc = '';
          }
          for (let i = 0; i < datas.length; i++) {
            const kcmc = jcsj.hqkcmcByid(this.kcList, datas[i].kcdm);
            this.dzkclist.push({ uuid: datas[i].kcdm, kcmc });
          }
        })
      },
      // 删除
      delDsz(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            id
          }
          delbyid(param).then(res => {
            if (res.status == '200') {
              // this.dialogFormVisible = false;

              this.$notify({ title: '成功', message: '清空成功', type: 'success', duration: 2000 });
              this.loadpage();
            } else {
              this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
            }
          });
        }).catch(e => {
          // console.log(e)
        });
      },
      addDsz() {
        if (this.bjdm != 'undefined' && this.bjdm != null && this.bjdm != '') {
          this.singledoubleKc = true;
        } else {
          this.$notify({ title: '温馨提示', message: '请选择班级', type: 'warning', duration: 2000 });
        }
      },
      // 保存单双周
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.sdform.xxdm = this.xxdm;
            this.sdform.rwid = this.rwid;
            this.sdform.bjdm = this.bjdm;
            this.sdform.njdm = this.njdm;

            saveadd(this.sdform).then(res => {
              if (res.status == '200') {
                this.$notify({ title: '成功', message: '保存成功', type: 'success', duration: 2000 });
                this.singledoubleKc = false;
                this.changeSure = false;
                this.dzkclist = this.kcList;

                this.loadpage();
              } else {
                this.changeSure = false;
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
              }
            })
          } else {
            this.$notify({ title: '失败', message: '课程不能为空', type: 'error', duration: 2000 });
            return false;
          }
        });
      },

      toSim(tab, event) {
        alert();
        console.log(tab);
        // this.tabView =  `page${tab}`;
      },
      tableRowClassName({ row, rowIndex }) {
        // 表格行样式
        for (let i = 0; i < this.spanArr.length; i++) {
          if (row.title.idx === this.spanArr[i]) {
            return 'span-item';
          }
        }
        if (rowIndex == this.n1 || rowIndex == this.n2) {
          return 'bar-item';
        }
      },
      handleClassTable({ row, column, rowIndex, columnIndex }) { // 合并表格
        // 合并表格 设置bar
        if (columnIndex === 0) {
          // console.log(row.title.idx, this.spanArr)
          for (let i = 0; i < this.spanArr.length; i++) {
            if (row.title.idx == this.spanArr[i]) {
              // row.itemClass = true;
              // 早读7:48~7:48     午休
              return {
                rowspan: 1,
                colspan: 6
              };
            }
          }
          if (rowIndex == this.n1 || rowIndex == this.n2) {
            return {
              rowspan: 1,
              colspan: 6
            };
          }
        }
      },
      handleTableItemClass({ row, column, rowIndex, columnIndex }) {
        if (columnIndex !== 0) {
          return 'mouse-style'
        }
      },
      handleX(obj) {
        let { pkjs, pkzs, sfpk } = obj
        switch (sfpk) {
          case -1:
            return
            break;
          case 1:
            sfpk = 0
            // 删除班级排课
            deleteDetailClass({
              bjdm: this.bjdm,
              kcdm: this.selectedClass,
              pkjs,
              pkzs,
              rwid: this.rwid,
              sfpk,
              xxdm: this.xxdm
            }).then(res => {
              if (res.status == 200) {
                // 每次点击都获取一遍表格!!!!!!!
                this.handleShowTable(this.selectedClass)
                this.$notify({
                  title: '成功',
                  message: '课程保存成功',
                  type: 'success'
                });
              }
            })
            return
            break;
          case 2:
            sfpk = 0
            // 删除班级排课
            deleteDetailClass({
              bjdm: this.bjdm,
              kcdm: this.selectedClass,
              pkjs,
              pkzs,
              rwid: this.rwid,
              sfpk,
              xxdm: this.xxdm
            }).then(res => {
              if (res.status == 200) {
                // 每次点击都获取一遍表格!!!!!!!
                this.handleShowTable(this.selectedClass)
                this.$notify({
                  title: '成功',
                  message: '课程保存成功',
                  type: 'success'
                });
              }
            })
            return
            break;
          default:
            this.$notify({
              title: '警告',
              message: '该处已设置其他课程',
              type: 'warning'
            });
            return
            break
        }
      },
      handleChange(obj) {    // 点击表格，保存列表
        let { pkjs, pkzs, sfpk } = obj
        switch (sfpk) {
          case -1:
            sfpk = 2
            break;
          case 1:
            sfpk = 0
            // 删除班级排课
            deleteDetailClass({
              bjdm: this.bjdm,
              kcdm: this.selectedClass,
              pkjs,
              pkzs,
              rwid: this.rwid,
              sfpk,
              xxdm: this.xxdm
            }).then(res => {
              if (res.status == 200) {
                // 每次点击都获取一遍表格!!!!!!!
                this.handleShowTable(this.selectedClass)
                this.$notify({
                  title: '成功',
                  message: '课程保存成功',
                  type: 'success'
                });
              }
            })
            return
            break;
          case 2:
            sfpk = 1
            break;
          default:
            this.$notify({
              title: '警告',
              message: '该处已设置其他课程',
              type: 'warning'
            });
            return
            break
        }

        saveDetailClassTable({
          bjdm: this.bjdm,
          kcdm: this.selectedClass,
          pkjs,
          pkzs,
          rwid: this.rwid,
          sfpk,
          xxdm: this.xxdm
        }).then(res => {

          if (res.status === 200) {
            // 每次点击都获取一遍表格!!!!!!!
            this.handleShowTable(this.selectedClass)
            this.$notify({
              title: '成功',
              message: '课程保存成功',
              type: 'success'
            });
          }else if(res.status === 2){
            this.$notify({
              title: '警告',
              message: res.message,
              type: 'warning'
            });
          }
        })
      },

      classTabChange(kcdm) {   // 点击课程按钮 获取具体表格
        const newClassCourseList = [];
        for (const kcclass of this.classCourseList) {
          if (kcdm == kcclass.kcdm) {
            kcclass.zzclass = false;
          } else {
            kcclass.zzclass = true;
          }
          newClassCourseList.push(kcclass);
        }
        this.classCourseList = newClassCourseList;
        this.selectedClass = kcdm;
        this.handleShowTable(kcdm);
      },
      // handleX(obj) {

      // },
      handleShowTable(kcdm) {
        // this.tableDataClass = []
        getDetailClassTable({
          rwid: this.rwid,
          bjdm: this.bjdm,
          kcdm,
          xxdm: this.xxdm
        }).then(res => {
          console.log(res)
          if (res.status == 200) {
            const { bjgdbpkList, jcsjList, bjbpkszlist } = res.data

            if (bjgdbpkList) {
              const { kcdm } = bjgdbpkList
              // 请求课程中文名
              bjgdbpkList.forEach(item => {
                const eachClass = jcsj.hqkcmcByid(this.kcList, item.kcdm)
                item.name = eachClass
                switch (item.sfpk) {  // sfpk:   1 success   2 no   4 所有课程不排课  5 互斥的课程
                  case 1:
                    item.green = true
                    break;
                  case 2:
                    item.red = true
                    item.name = item.name + '不排课'
                    break;
                  case 5:
                    item.gray = true
                    break;
                }
              })
            }
            // console.log(bjgdbpkList)
            // 组装对象
            const table_Arr = []
            if (jcsjList) {
              jcsjList.forEach((item, index) => {
                const { jcdm, jcwz } = item
                if (jcdm) {
                  item.idx = jcdm
                } else if (jcwz) {
                  if (parseInt(jcwz) > 0) {
                    item.idx = Math.abs(parseInt(jcwz)) - 0.1
                  } else if (parseInt(jcwz) < 0) {
                    item.idx = Math.abs(parseInt(jcwz)) + 0.1
                  }
                }
                if (!jcdm) {
                  item.content = item.jcmc + item.qzsj
                  // this.spanArr.push(index)
                }

                const tmp_obj = {
                  title: item
                }

                // 如果节数存在，定义进去
                const pkjs = item.jcdm || -1
                this.weekGroup.forEach((item, index) => {
                  tmp_obj['amount' + item] = {
                    // 自定义对象 为了获取 点击时当前行数，列数
                    pkjs,
                    pkzs: item,
                    sfpk: -1
                  }
                })

                if (bjgdbpkList) {
                  bjgdbpkList.forEach(item => {
                    const { pkjs, pkzs, sfpk } = item
                    if (pkjs == jcdm) {
                      // console.log(pkjs, jcdm)
                      tmp_obj['amount' + pkzs] = item
                    }
                  })
                  table_Arr.push(tmp_obj)
                }
              })
              // console.log(table_Arr)
              // 遍历所有课程不排课list，阻止数据
              if (bjbpkszlist && jcsjList) {
                bjbpkszlist.forEach(item => {
                  const { bpkzs, bpkjs } = item
                  const _amount = 'amount' + bpkzs

                  jcsjList.forEach((item, index) => {
                    const { jcdm } = item
                    if (bpkjs == jcdm) {
                      table_Arr[index][_amount].gray = true
                      table_Arr[index][_amount].red = false
                      table_Arr[index][_amount].green = false
                      table_Arr[index][_amount].name = '所有课程不排课'
                      table_Arr[index][_amount].sfpk = 4
                    }
                  })
                })
              }
            }


            table_Arr.sort((idx => (a, b) => {
              const value1 = a.title[idx]
              const value2 = b.title[idx]
              if (value1 > value2) {
                return 1
              } else if (value1 < value2) {
                return -1
              } else {
                return 0
              }
            })('idx'))

            const numberArr = JSON.parse(window.localStorage.getItem('numberArr') || '[]')
            let n1 = 0, n2 = 1;
            if (numberArr.length !== 0) {
              table_Arr.forEach((item, index) => {
                if (item.title.idx < (numberArr[0] + 0.5)) {
                  n1 = n1 + 1
                }
                if (item.title.idx < (numberArr[0] + numberArr[1] + 0.5)) {
                  n2 = n2 + 1
                }
              })
            }

            table_Arr.forEach((item, index) => {
              if (!item.title.jcdm) {
                item.title.close = true
                this.spanArr.push(item.title.idx)
              }
            })

            if (numberArr.length !== 0) {
              const bar_obj1 = {
                title: {},
                amount1: {},
                amount2: {},
                amount3: {},
                amount4: {},
                amount5: {},
                amount6: {},
                amount7: {}
              }
              const bar_obj2 = {
                title: {},
                amount1: {},
                amount2: {},
                amount3: {},
                amount4: {},
                amount5: {},
                amount6: {},
                amount7: {}
              }
              bar_obj1.title.idx = n1
              bar_obj2.title.idx = n2
              table_Arr.splice(n1, 0, bar_obj1)
              table_Arr.splice(n2, 0, bar_obj2)
            }
            this.n1 = n1
            this.n2 = n2
            this.tableDataClass = table_Arr
          }
        })
      },
      formatWeek(key) {
        let arr = ["一", "二", "三", "四", "五", "六", "日"];
        return arr[--key];
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
      }
//      ,
//      jsList: {
//        /**教师级类型列表数据**/
//        type: Array,
//        required: true
//      }
    }
  };

</script>


<style scope>
/*  覆盖样式让表格完整显示！！！！！！！！*/
/* .KbMain {
  height: 547px;
  overflow-y: auto;
} */
/* 清除element-ui默认样式 */
.gz-kcsz .smallscroll .el-table__row td {
  padding: 0;
  /* height: 47px; */

}
.gz-kcsz .smallscroll .el-table__row {
  height: 47px;

}
.gz-kcsz .smallscroll .el-table .cell {
  width: 100%;
  /* height: 100%; */
  height: 47px;
  padding: 0;
  line-height: 47px;
  /* color: rgb(144, 147, 153); */
}
.gz-kcsz .smallscroll .el-table .cell>div {
  height: 100%;
  width: 100%;
}

.gz-kcsz .smallscroll .bar-item {
  height: 10px;
  /* line-height: 2px; */
  background-color: #eee;
}

.gz-kcsz .smallscroll .bar-item div {
  display: none;
}


.gz-kcsz .smallscroll .cell {
  position: relative;
}

.gz-kcsz .smallscroll #close {
  position: absolute;
  top: 0;
  right: 0;
  width: 16px;
  height: 16px;
  color: #fff;
}

.gz-kcsz .smallscroll #close i {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 16px;
}



.mouse-style {
  cursor: pointer;
}
.isforbidden {
  background-color: #959a9d;
  color: #fff;
}
.isgood {
  background-color: #67c23a;
  color: #fff;
}
.isbad {
  background-color: #f66b6b;
  color: #fff;
}
.isnull {
  background-color: #fff;
}

.ffftxt {
  color: #fff;
}


/* 表格样式 */
.gz-kcsz .el-table .span-item {
  color: #e6a23c;
  background-color: #fdf6ec;
}
.gz-kcsz .bluetxt {
  color: #449afc;
  font-size: 13px;
}

.gz-kcsz .table-bar:after {
  content: '';
  display: block;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background-color: #cccccc;
  border: 1px solid #959a9d;
}
</style>

