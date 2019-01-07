<template>
  <div class="view">
    <el-tabs class="mt30">
        <el-row>
          <div class="kbzl_mzl">规则满足率：<span >{{kbmzl}}</span></div>
        </el-row>
        <el-row>
          <div class="kbzl_mz_info mt10">在排课规则中，
            <span class='mz'>{{mz_gzlcmc}}</span>规则的满足率为100%。
            <span v-if="gzlx_select.length>1">仍有以下规则不满足。</span></div>
        </el-row>
        <el-row class="mt20">
          <el-select v-if="gzlx_select.length>1" v-model="dqgzlx" @change="cxkbzlBylx">
            <el-option v-for="lx in gzlx_select" :key="lx.lxid" :label="lx.lxmc" :value="lx.lxid"> </el-option>
          </el-select>
        </el-row>
      <el-collapse v-model="activeNames" class="mt30">
        <el-collapse-item v-for="(kbzl,index) in kbzlShow" :title="kbzl.gzmc" :name="index" :key="index">
          <div class="kbExplain_cont" v-for="fzgz in kbzl.fzgzArr">
            <span v-if="fzgz.zycd==1">重要</span>
            <span v-if="fzgz.zycd==2">一般</span>满足率：{{fzgz.mzl}}<br>
            <div v-for="mx in fzgz.gzxx"><span>{{mx}}</span></div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-tabs>
  </div>
</template>

<script>
  import * as api from '@/api/pkxt/arrangingTask/pktz/index';
  import jcsj from '@/api/jcsj';
  export default {
    name: 'kbzl',
    data() {
      return {
        activeNames: ['1'],
        dqgzlx: 0,
        gzlx: {
          KCGDP: { lxid: 1, lxmc: '课程固定排', lxdm: 'bjgdpk', gzdj: '必须满足' },
          KCGDBP: { lxid: 2, lxmc: '课程固定不排', lxdm: 'bjgdpk', gzdj: '必须满足' },
          JSGDP: { lxid: 3, lxmc: '教师固定排', lxdm: 'jsgdpk', gzdj: '必须满足' },
          JSGDBP: { lxid: 4, lxmc: '教师固定不排', lxdm: 'jsgdpk', gzdj: '必须满足' },
          HB: { lxid: 5, lxmc: '合班', lxdm: 'jshb', gzdj: '必须满足' },
          DSZ: { lxid: 6, lxmc: '单双周', lxdm: 'dsz', gzdj: '必须满足' },
          KCHC: { lxid: 7, lxmc: '课程互斥', lxdm: 'bjhc', gzdj: '优先满足' },
          JCLP: { lxid: 8, lxmc: '节次连排', lxdm: 'bjhc', gzdj: '优先满足' },
          KCLP: { lxid: 9, lxmc: '课程连排', lxdm: 'bjhc', gzdj: '优先满足' },
          JSHC: { lxid: 10, lxmc: '教师互斥', lxdm: 'jshc', gzdj: '优先满足' },
          JSLP: { lxid: 11, lxmc: '教师连排', lxdm: 'jshc', gzdj: '优先满足' },
          KSSD: { lxid: 12, lxmc: '课程时段', lxdm: 'jskcsd', gzdj: '一般' },
          JAQP: { lxid: 13, lxmc: '教案齐平', lxdm: 'jaqp', gzdj: '一般' },
          ZRK: { lxid: 14, lxmc: '周任课分布', lxdm: 'jszrk', gzdj: '一般' },
          TRK: { lxid: 15, lxmc: '天任课分布', lxdm: 'jstrk', gzdj: '一般' },
          BJGDBP: { lxid: 16, lxmc: '班级固定不排', lxdm: 'bjbpk', gzdj: '一般' }
        },
        zycdxx: { YB: { cddm: 1, cdmc: '重要' },
          ZY: { cddm: 2, cdmc: '一般' }
        },
        coursePlanDataSet: [], // 排课结果列表
        pkJxjhList: [], // 排课教学计划列表
        timeTable: {},
        gzlx_select: [],
        kbzlArr: [],
        kbzlShow: [],
        mz_gzlcmc: '',
        kbmzl: ''
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
    },
    created() {
      // this.hqpkzl();
    },
    methods: {
      // 获取全部规则，全部课表数据
      hqpkzl() {
        const taskId = this.$route.query.rwid;
        api.ruleList(taskId).then(res => {
          const pkgz = res.data;
          api.coursePlanList(taskId).then(res => {
            this.coursePlanDataSet = res.data;
            api.timeTableInfo(taskId).then(res => {
              this.timeTable = res.data;
              api.pkJxjhList(taskId).then(res => {
                this.pkJxjhList = res.data;
                this.pdgzByKb(pkgz);
              });
            });
          })
        })
      },
      // 遍历规则，根据课表判断规则是否满足
      pdgzByKb(pkgz) {
        this.gzlx_select = [];
        this.kbzlArr = [];
        this.mz_gzlcmc = '';
        this.gzlx_select.push({ lxid: 0, lxmc: '所有规则' });
        _.forEach(this.gzlx, (value, key) => {
          const kbzl = this.clgzbykb(pkgz[value.lxdm], value);
          if (kbzl.gzzs !== 0) {
            this.kbzlArr.push(kbzl);
          }
          if (kbzl.mzl === '100%') {
            this.mz_gzlcmc += kbzl.gzmc + ',';
          }
          if (kbzl.gzzs !== 0 && kbzl.mzl !== '100%') {
            this.gzlx_select.push(value);
          }
        })
        this.jskbmzl();
        this.cxkbzlBylx();
      },
      clgzbykb(gzList, gzlx) {
        const gztm = gzList.length;
        const lxid = gzlx.lxid;
        const kbzl = { gzlx: lxid, gzmc: gzlx.lxmc, gzzs: 0, mzl: '', fzgzArr: [] };
        if (gztm > 0) {
          let fzgz = [];
          switch (lxid) {
            case this.gzlx.BJGDBP.lxid:
              fzgz = this.clbjbpk(gzList);
              break;
            case this.gzlx.KCGDP.lxid:
              fzgz = this.clbjkcgdp(gzList);
              break;
            case this.gzlx.KCGDBP.lxid:
              fzgz = this.clbjkcgdbp(gzList);
              break;
            case this.gzlx.JSGDP.lxid:
              fzgz = this.cljsgdp(gzList);
              break;
            case this.gzlx.JSGDBP.lxid:
              fzgz = this.cljsgdbp(gzList);
              break;
            case this.gzlx.HB.lxid:
              fzgz = this.cljshb(gzList);
              break;
            case this.gzlx.DSZ.lxid:
              fzgz = this.cldsz(gzList);
              break;
            case this.gzlx.KCHC.lxid:
              fzgz = this.clkchc(gzList);
              break;
            case this.gzlx.KCLP.lxid:
              fzgz = this.clkclp(gzList);
              break;
            case this.gzlx.JCLP.lxid:
              fzgz = this.cljclp(gzList);
              break;
            case this.gzlx.JSHC.lxid:
              fzgz = this.cljshc(gzList);
              break;
            case this.gzlx.JSLP.lxid:
              fzgz = this.cljslp(gzList);
              break;
            case this.gzlx.KSSD.lxid:
              fzgz = this.clkcsd(gzList);
              break;
            case this.gzlx.JAQP.lxid:
              fzgz = this.cljaqp(gzList);
              break;
            case this.gzlx.ZRK.lxid:
              fzgz = this.clzrk(gzList);
              break;
            case this.gzlx.TRK.lxid:
              fzgz = this.cltrk(gzList);
              break;
            default:
              console.error('xxxx');
          }
          // 计算分组规则真实规则数量和满足率
          let gzzs = 0;
          let bmzzs = 0;
          fzgz.forEach(fz => {
            const fzzs = fz.fzzs;
            if (fzzs > 0) {
              fz.mzl = ((fzzs - fz.gzxx.length) / fzzs * 100).toFixed(0) + '%';
            }
            gzzs += fz.fzzs;
            bmzzs += fz.gzxx.length;
          })
          kbzl.gzzs = gzzs;
          if (gzzs > 0) {
            console.log(gzlx.lxmc + '总数=' + gzzs + '不满足=' + bmzzs);
            kbzl.mzl = ((gzzs - bmzzs) / gzzs * 100).toFixed(0) + '%';
          }
          kbzl.fzgzArr = fzgz;
        }
        return kbzl;
      },
      // 判断班级固定不排课规则
      clbjbpk(gzList) {
        // 重要程度列表
        const fzgz = [{ zycd: '', fzzs: gzList.length, mzl: '', gzxx: [] }];
        gzList.forEach(gz => {
          const bjdm = gz.bjdm;
          const pkzs = gz.bpkzs;
          const pkjs = gz.bpkjs;
          const pkjg = _.find(this.coursePlanDataSet, { bjdm, pkzs, pkjs });
          if (pkjg) {
            const gz_bjmc = jcsj.hqbjmcByid(this.bjList, bjdm);
            fzgz[0].gzxx.push(gz_bjmc + '周' + pkzs + '第' + pkjs + '固定不排课未满足');
          }
        })
        return fzgz;
      },
      // 判断班级课程固定排
      clbjkcgdp(gzList) {
        const bjgdpList = _.filter(gzList, ['sfpk', 1]);
        const fzgz = [{ zycd: '', fzzs: bjgdpList.length, mzl: '', gzxx: [] }];
        bjgdpList.forEach(gz => {
          const bjdm = gz.bjdm;
          const kcdm = gz.kcdm;
          const pkzs = gz.pkzs;
          const pkjs = gz.pkjs;
          const pkjg = _.find(this.coursePlanDataSet, { bjdm, kcdm, pkzs, pkjs });
          if (!pkjg) {
            const gz_bjmc = jcsj.hqbjmcByid(this.bjList, bjdm);
            const gz_kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
            fzgz[0].gzxx.push(gz_bjmc + '周' + pkzs + '第' + pkjs + '节固定排' + gz_kcmc + '未满足');
          }
        })
        return fzgz;
      },
      // 判断班级课程固定不排
      clbjkcgdbp(gzList) {
        const gdbpgzList = _.filter(gzList, ['sfpk', 2]);
        const fzgz = [{ zycd: '', fzzs: gdbpgzList.length, mzl: '', gzxx: [] }];
        gdbpgzList.forEach(gz => {
          const bjdm = gz.bjdm;
          const kcdm = gz.kcdm;
          const pkzs = gz.pkzs;
          const pkjs = gz.pkjs;
          const bpk = _.find(this.coursePlanDataSet, { bjdm, pkzs, pkjs, kcdm });
          if (bpk) {
            const gz_bjmc = jcsj.hqbjmcByid(this.bjList, bjdm);
            const gz_kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
            fzgz[0].gzxx.push(gz_bjmc + '周' + pkzs + '第' + pkjs + '节' + gz_kcmc + '固定不排课未满足');
          }
        })
        return fzgz;
      },
      // 判断教师固定排
      cljsgdp(gzList) {
        const jsgdpList = _.filter(gzList, ['sfpk', 1]);
        const fzgz = [{ zycd: '', fzzs: jsgdpList.length, mzl: '', gzxx: [] }];
        jsgdpList.forEach(gz => {
          const zgh = gz.zgh;
          const pkzs = gz.pkzs;
          const pkjs = gz.pkjs;
          const kcdm = gz.kcdm;
          const pkjg = _.find(this.coursePlanDataSet, { zgh, pkzs, pkjs, kcdm });
          if (!pkjg) {
            const gz_jsmc = jcsj.hqjsmcByid(this.jsList, zgh);
            const gz_kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
            fzgz[0].gzxx.push(gz_jsmc + '周' + pkzs + '第' + pkjs + '节固定排' + gz_kcmc + '未满足');
          }
        })
        return fzgz;
      },
      // 判断教师固定不排
      cljsgdbp(gzList) {
        const jsgdbpList = _.filter(gzList, ['sfpk', 2]);
        const fzgz = [{ zycd: '', fzzs: jsgdbpList.length, mzl: '', gzxx: [] }];
        jsgdbpList.forEach(gz => {
          const zgh = gz.zgh;
          const pkzs = gz.pkzs;
          const pkjs = gz.pkjs;
          const kcdm = gz.kcdm;
          const pkjg = _.find(this.coursePlanDataSet, { zgh, pkzs, pkjs, kcdm });
          if (pkjg) {
            const gz_jsmc = jcsj.hqjsmcByid(this.jsList, zgh);
            const gz_kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
            fzgz[0].gzxx.push(gz_jsmc + '周' + pkzs + '第' + pkjs + '节固定不不排' + gz_kcmc + '未满足');
          }
        })
        return fzgz;
      },
      // 判断教师合班
      cljshb(gzList) {
        const fzgz = [{ zycd: '', fzzs: gzList.length, mzl: '', gzxx: [] }];
        gzList.forEach(gz => {
          const hbkc = gz.hbkc;
          const hbbj = gz.hbbj;
          if (hbbj) {
            const bjdmArr = hbbj.split(',');
            const onepkjg = _.find(this.coursePlanDataSet, { bjdm: bjdmArr[0], kcdm: hbkc, ishb: '1' });
            const twopkjg = _.find(this.coursePlanDataSet, { bjdm: bjdmArr[1], kcdm: hbkc, ishb: '1' });
            if (!(onepkjg && twopkjg)) {
              const one_bjmc = jcsj.hqbjmcByid(this.bjList, bjdmArr[0]);
              const two_bjmc = jcsj.hqbjmcByid(this.bjList, bjdmArr[1]);
              const hb_kcmc = jcsj.hqkcmcByid(this.kcList, hbkc);
              fzgz[0].gzxx.push(one_bjmc + two_bjmc + hb_kcmc + '合班未满足');
            }
          }
        })
        return fzgz;
      },
      // 判断班级单双周
      cldsz(gzList) {
        const fzgz = [{ zycd: '', fzzs: gzList.length, mzl: '', gzxx: [] }];
        gzList.forEach(gz => {
          const bjdm = gz.bjdm;
          const dzkc = gz.dzkc;
          const szkc = gz.szkc;
          const dzpkjg = _.find(this.coursePlanDataSet, { bjdm, kcdm: dzkc, isdsz: '1' });
          const szpkjg = _.find(this.coursePlanDataSet, { bjdm, kcdm: szkc, isdsz: '2' });
          if (!(dzpkjg && szpkjg)) {
            const gz_bjmc = jcsj.hqbjmcByid(this.bjList, bjdm);
            const dz_kcmc = jcsj.hqkcmcByid(this.kcList, dzkc);
            const sz_kcmc = jcsj.hqkcmcByid(this.kcList, szkc);
            fzgz[0].gzxx.push(gz_bjmc + '单周课程' + dz_kcmc + '双周课程' + sz_kcmc + '未满足');
          }
        })
        return fzgz;
      },
      // 判断课程互斥
      clkchc(gzList) {
        const bjhcList = _.filter(gzList, item => item.hckc && item.hckc !== null && item.hckc !== '');
        const fzgz = [{ zycd: '', fzzs: bjhcList.length, mzl: '', gzxx: [] }];
        bjhcList.forEach(gz => {
          const bjdm = gz.bjdm;
          const kcdm = gz.kcdm;
          const hckc = gz.hckc;
          const hcfs = gz.hcfs;
          const gz_hcfsmc = hcfs === '1' ? '半天' : '全天';
          const gz_bjmc = jcsj.hqbjmcByid(this.bjList, bjdm);
          const gz_kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
          const gz_hckcmc = jcsj.hqkcmcByid(this.kcList, hckc);
          // 找出所有互斥课程的排课结果
          const kclb = _.filter(this.coursePlanDataSet, { bjdm, kcdm });
          for (let i = 0, size = kclb.length; i < size; i++) {
            const kc = kclb[i];
            const pkzs = kc.pkzs;
            const pkjs = kc.pkjs;
            if (hcfs === '2') { // 天内互斥
              const hckclb = _.find(this.coursePlanDataSet, item => item.bjdm === bjdm && item.kcdm === hckc && item.pkzs === pkzs && item.isdsz === '0');
              if (hckclb) {
                fzgz[0].gzxx.push(gz_bjmc + gz_kcmc + '与' + gz_hckcmc + gz_hcfsmc + '互斥未满足');
                return;
              }
            } else { // 半天互斥:上午互斥、下午互斥、晚上互斥
              const jsfw = this.hqpkjsfw(parseInt(pkjs, 10));
              const hckclb = _.find(this.coursePlanDataSet, item => item.bjdm === bjdm && item.kcdm === hckc
            && item.pkzs === pkzs && item.pkjs >= jsfw.startjs && item.pkjs <= jsfw.endjs && item.isdsz === '0');
              if (hckclb) {
                fzgz[0].gzxx.push(gz_bjmc + gz_kcmc + '与' + gz_hckcmc + gz_hcfsmc + '互斥未满足');
                return;
              }
            }
          }
        });
        return fzgz;
      },
      hqpkjsfw(dqjs) {
        let startjs = 0, endjs = 0;
        if (dqjs > 0 && dqjs <= this.timeTable.amLessonCount) {
          startjs = 1;
          endjs = this.timeTable.amLessonCount;
        }
        if (dqjs > this.timeTable.amLessonCount && dqjs <= this.timeTable.amLessonCount + this.timeTable.pmLessonCount) {
          startjs = this.timeTable.amLessonCount + 1;
          endjs = this.timeTable.amLessonCount + this.timeTable.pmLessonCount;
        }
        if (dqjs > this.timeTable.amLessonCount + this.timeTable.pmLessonCount
          && dqjs <= this.timeTable.amLessonCount + this.timeTable.pmLessonCount + this.timeTable.eveLessonCount) {
          startjs = this.timeTable.amLessonCount + this.timeTable.pmLessonCount + 1;
          endjs = this.timeTable.amLessonCount + this.timeTable.pmLessonCount + this.timeTable.eveLessonCount;
        }
        return { startjs, endjs };
      },
      // 判断班级课程联排
      clkclp(gzList) {
        const kclpgzList = _.filter(gzList, item => item.kclp && item.kclp !== null && item.kclp !== '');
        const fzgz = [{ zycd: '', fzzs: kclpgzList.length, mzl: '', gzxx: [] }];
        kclpgzList.forEach(gz => {
          const kcdm = gz.kcdm;
          const lpkc = gz.kclp;
          const bjdm = gz.bjdm;
/*          const sfls = gz.sfls; // 1 是  2 否
          const kcObj = _.find(this.pkJxjhList, { bjdm, kcdm });
          const lpkcObj = _.find(this.pkJxjhList, { bjdm, kcdm: lpkc });
          const kcsks = sfls === '1' ? parseInt(kcObj.zxs, 10) / 2 : parseInt(kcObj.zxs, 10);
          const lpkcsks = parseInt(lpkcObj.zxs, 10);
          const matchCount = kcsks <= lpkcsks ? kcsks : lpkcsks;*/
          const lpkclb = _.filter(this.coursePlanDataSet, { bjdm, kcdm: lpkc });
          let totalMatch = 0;
          lpkclb.forEach(kc => {
            const pkjs = parseInt(kc.pkjs, 10);
            if (pkjs !== 1) {
              const temp = _.find(this.coursePlanDataSet, { bjdm, kcdm, pkjs: pkjs - 1 });
              if (temp) {
                totalMatch = totalMatch + 1;
              }
            }
          })
          if (totalMatch < 1) {
            const gz_bjmc = jcsj.hqbjmcByid(this.bjList, bjdm);
            const gz_kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
            const gz_lpkcmc = jcsj.hqkcmcByid(this.kcList, lpkc);
            fzgz[0].gzxx.push(gz_bjmc + gz_kcmc + '与' + gz_lpkcmc + '课程连排未满足');
          }
        });
        return fzgz;
      },
      // 判断班级节次联排
      cljclp(gzList) {
        const jclsList = _.filter(gzList, item => item.sfls && item.sfls === 1);
        const fzgz = [{ zycd: '', fzzs: jclsList.length, mzl: '', gzxx: [] }];
        jclsList.forEach(gz => {
          const bjdm = gz.bjdm;
          const kcdm = gz.kcdm;
          const bjkckb = _.filter(this.coursePlanDataSet, { bjdm, kcdm });
          // 查找班级内该课程前后节 是否为同一个课程
          let flag = false;
          bjkckb.forEach(kb => {
            const be_pkjs = kb.pkjs - 1;
            const af_pkjs = kb.pkjs + 1;
            const pkzs = kb.pkzs;
            const bjdm = kb.bjdm;
            const kcdm = kb.kcdm;
            const be_pjjg = _.find(this.coursePlanDataSet, { pkjs: be_pkjs, pkzs, kcdm, bjdm });
            const af_pjjg = _.find(this.coursePlanDataSet, { pkjs: af_pkjs, pkzs, kcdm, bjdm });
            if (be_pjjg || af_pjjg) {
              flag = true;
              return;
            }
          })
          if (!flag) {
            const gz_bjmc = jcsj.hqbjmcByid(this.bjList, bjdm);
            const gz_kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
            fzgz[0].gzxx.push(gz_bjmc + '-' + gz_kcmc + '连上未满足');
          }
        })
        return fzgz;
      },
      // 判断教师互斥
      cljshc(gzList) {
        const jshcList = _.filter(gzList, item => item.hcjs && item.hcjs !== null && item.hcjs !== '');
        const fzgz = [{ zycd: '', fzzs: jshcList.length, mzl: '', gzxx: [] }];
        jshcList.forEach(gz => {
          const zgh = gz.zgh;
          const hcjs = gz.hcjs;
          const jskclb = _.filter(this.coursePlanDataSet, ['zgh', zgh]);
          const hcjskclb = _.filter(this.coursePlanDataSet, ['zgh', hcjs]);
          for (let i = 0, size = jskclb.length; i < size; i++) {
            const jskc = jskclb[i];
            for (let j = 0, len = hcjskclb.length; j < len; j++) {
              const hcjskc = hcjskclb[j];
              if (jskc.pkzs === hcjskc.pkzs && jskc.pkjs === hcjskc.pkjs) {
                const gz_jsmc = jcsj.hqjsmcByid(this.jsList, zgh);
                const gz_hcjsmc = jcsj.hqjsmcByid(this.jsList, hcjs);
                fzgz[0].gzxx.push(gz_jsmc + '与' + gz_hcjsmc + '互斥未满足');
                return;
              }
            }
          }
        });
        return fzgz;
      },
      // 判断教师联排
      cljslp(gzList) {
        const jslsList = _.filter(gzList, item => item.lsjs && item.lsjs !== '0' && item.lskc);
        const fzgz = [{ zycd: '', fzzs: jslsList.length, mzl: '', gzxx: [] }];
        jslsList.forEach(gz => {
          const zgh = gz.zgh;
          const lskc = gz.lskc;
          const jskclb = _.filter(this.coursePlanDataSet, { zgh, kcdm: lskc });
          // 查找老师课表前后节数是否是该老师课程，不能单独存在
          let flag = false;
          jskclb.forEach(kb => {
            const be_pkjs = kb.pkjs - 1;
            const af_pkjs = kb.pkjs + 1;
            const pkzs = kb.pkzs;
            const kcdm = kb.kcdm;
            const zgh = kb.zgh;
            const be_pjjg = _.find(this.coursePlanDataSet, { pkjs: be_pkjs, pkzs, kcdm, zgh });
            const af_pjjg = _.find(this.coursePlanDataSet, { pkjs: af_pkjs, pkzs, kcdm, zgh });
            if (be_pjjg || af_pjjg) {
              flag = true;
              return;
            }
          })
          if (!flag) {
            const gz_jsmc = jcsj.hqjsmcByid(this.jsList, zgh);
            const gz_lskc = jcsj.hqkcmcByid(this.kcList, lskc);
            fzgz[0].gzxx.push(gz_jsmc + '-' + gz_lskc + '连上未满足');
          }
        })
        return fzgz;
      },
      // 判断课程时段
      clkcsd(gzList) {
        const fzgz = [];
        const kssdList = _.filter(gzList, item => item.kssd !== 1);
        // 根据规则重要程度分组
        const gzfz = jcsj.sjfz(kssdList, 'zycd');
        // 获取上午节数 区间
        const ampkjs = this.timeTable.amLessonCount;
        const pmpkjs = ampkjs + this.timeTable.pmLessonCount;
        // 获取下午节数区间
        gzfz.forEach(fz => {
          const fzxx = { zycd: fz.zycd, fzzs: fz.children.length, mzl: '', gzxx: [] };
          fz.children.forEach(gz => {
            let flag = true;
            const zgh = gz.zgh;
            const kcdm = gz.kcdm;
            // 将当前老师课表按天分组
            const jskclb = _.filter(this.coursePlanDataSet, { zgh, kcdm });
            const jskb_zs = jcsj.sjfz(jskclb, 'pkzs');
            jskb_zs.forEach(kb_zs => {
              // 课时时段为上午
              if (gz.kssd === 2) {
                const pk_xw = _.find(kb_zs.children, item => item.pkjs >= (ampkjs + 1) && item.pkjs <= pmpkjs);
                if (pk_xw) {
                  flag = false;
                  return;
                }
              } else if (gz.kssd === 3) { // 下午
                const pk_sw = _.find(kb_zs.children, item => item.pkjs >= 1 && item.pkjs <= ampkjs);
                if (pk_sw) {
                  flag = false;
                  return;
                }
              }
            })
            if (!flag) {
              let kcsd = '';
              if (gz.kssd === 2) {
                kcsd = '上午';
              } else if (gz.kssd === 3) {
                kcsd = '下午';
              }
              const gz_jsmc = jcsj.hqjsmcByid(this.jsList, zgh);
              const gz_kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
              fzxx.gzxx.push(gz_jsmc + gz_kcmc + '课程时段分配为' + kcsd + '不满足');
            }
          })
          fzgz.push(fzxx);
        })
        return fzgz;
      },
      // 判断教案齐平
      cljaqp(gzList) {
        const fzgz = [];
        // 根据规则重要程度分组
        const gzfz = jcsj.sjfz(gzList, 'zycd');
        gzfz.forEach(fz => {
          const fzxx = { zycd: fz.zycd, fzzs: fz.children.length, mzl: '', gzxx: [] };
          fz.children.forEach(gz => {
            let flag = true;
            const zgh = gz.zgh;
            const kcdm = gz.kcdm;
            const pkjg = _.filter(this.coursePlanDataSet, { zgh, kcdm });
            // 查询老师代课班级
            const jsrkxx = _.filter(this.pkJxjhList, { zgh, kcdm });
            // 如果教师带多个班才判断规则
            const bjcount = jsrkxx.length;
            const fz_jsrkxx = jcsj.sjfz(jsrkxx, 'zxs');
            if (bjcount > 1 && fz_jsrkxx.length === 1) {
              // 班级课程数量
              // const bj_kc_num = fz_jsrkxx[0].zxs;
              // 将教师课表按周数节数去重排序，
              const uniq_pkjg = _.unionWith(pkjg, (o1, o2) => o1.pkzs === o2.pkzs && o1.pkjs === o2.pkjs);
              const order_pkjg = _.orderBy(uniq_pkjg, ['pkzs', 'pkjs'], ['asc', 'asc']);
              const all_bjkb = [];
              let fz_bjkb = [];
              // 以班级个数为单位进行分隔，判断排课班级是否重复
              order_pkjg.forEach((pk, index) => {
                fz_bjkb.push(pk.bjdm);
                if ((index + 1) % bjcount === 0) {
                  all_bjkb.push(fz_bjkb);
                  fz_bjkb = [];
                }
              })
              all_bjkb.forEach(bj => {
                const uniq_bj = _.uniq(bj);
                if (uniq_bj.length !== bjcount) {
                  flag = false;
                  return;
                }
              })
            }
            if (!flag) {
              const gz_jsmc = jcsj.hqjsmcByid(this.jsList, zgh);
              const gz_kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
              fzxx.gzxx.push(gz_jsmc + gz_kcmc + '教案齐平不满足');
            }
          })
          fzgz.push(fzxx);
        })
        return fzgz;
      },
      // 判断周任课
      clzrk(gzList) {
        const fzgz = [];
        // 根据规则重要程度分组
        const gzfz = jcsj.sjfz(gzList, 'zycd');
        gzfz.forEach(fz => {
          const fzxx = { zycd: fz.zycd, fzzs: fz.children.length, mzl: '', gzxx: [] };
          fz.children.forEach(gz => {
            let flag = true;
            const zgh = gz.zgh;
            const kcdm = gz.kcdm;
            const pkjg = _.filter(this.coursePlanDataSet, { zgh, kcdm });
            if (pkjg.length > 0) {
              // 为周数排序，取得最小周数和最大周数
              const sort_zs_gz = _.sortBy(pkjg, item => item.pkzs);
              const first_zs = sort_zs_gz[0].pkjs;
              const last_zs_gz = sort_zs_gz[sort_zs_gz.length - 1].pkjs;
              // 查找连续周数的排课结果，如不存在则不是周内连续排课
              for (let zs = first_zs; zs <= last_zs_gz; zs++) {
                const pkjg_zs = _.find(pkjg, ['pkzs', zs]);
                if (!pkjg_zs) {
                  flag = false;
                  break;
                }
              }
            }
            if (!flag) {
              const gz_jsmc = jcsj.hqjsmcByid(this.jsList, zgh);
              const gz_kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
              fzxx.gzxx.push(gz_jsmc + gz_kcmc + '周内集中不满足');
            }
          })
          fzgz.push(fzxx);
        })
        return fzgz;
      },
      // 判断天任课
      cltrk(gzList) {
        const fzgz = [];
        // 根据规则重要程度分组
        const gzfz = jcsj.sjfz(gzList, 'zycd');
        gzfz.forEach(fz => {
          const fzxx = { zycd: fz.zycd, fzzs: fz.children.length, mzl: '', gzxx: [] };
          fz.children.forEach(gz => {
            let flag = true;
            const zgh = gz.zgh;
            const kcdm = gz.kcdm;
            const pkjg = _.filter(this.coursePlanDataSet, { zgh, kcdm });
            // 根据天分组
            const pkjg_zs_fz = jcsj.sjfz(pkjg, 'pkzs');
            pkjg_zs_fz.forEach(pkjg_zs => {
              pkjg_zs.children.forEach(zs_gz => {
                if (zs_gz.length > 0) {
                  // 为天内的排课按节数排序，取得最小节数和最大节数
                  const sort_js_gz = _.sortBy(zs_gz, item => item.pkjs);
                  const first_js = sort_js_gz[0].pkjs;
                  const last_js_gz = sort_js_gz[sort_js_gz.length - 1].pkjs;
                  // 查找连续节数的排课结果，如不存在则不是天内连续排课
                  for (let js = first_js; js <= last_js_gz; js++) {
                    const pkjg_js = _.find(zs_gz, ['pkjs', js]);
                    if (!pkjg_js) {
                      flag = false;
                      break;
                    }
                  }
                }
              })
            })
            if (!flag) {
              const gz_jsmc = jcsj.hqjsmcByid(this.jsList, zgh);
              const gz_kcmc = jcsj.hqkcmcByid(this.kcList, kcdm);
              fzxx.gzxx.push(gz_jsmc + gz_kcmc + '天内集中不满足');
            }
          })
          fzgz.push(fzxx);
        })
        return fzgz;
      },
      // 计算总排课满足率
      jskbmzl() {
        let zgz_count = 0;
        let bmz_count = 0;
        this.kbzlArr.forEach(kbzl => {
          zgz_count += kbzl.gzzs;
          kbzl.fzgzArr.forEach(fzgz => {
            bmz_count += fzgz.gzxx.length;
          })
        })
        if (zgz_count > 0) {
          this.kbmzl = ((zgz_count - bmz_count) / zgz_count * 100).toFixed(0) + '%';
        }
      },
      // 切换规则条件类型
      cxkbzlBylx() {
        this.kbzlShow = [];
        const gzlxid = this.dqgzlx;
        if (gzlxid !== 0) {
          this.kbzlShow = _.filter(this.kbzlArr, kbzl => kbzl.gzlx === gzlxid && kbzl.mzl !== '100%');
        } else {
          this.kbzlShow = _.filter(this.kbzlArr, kbzl => kbzl.mzl !== '100%');
        }
      }
    }
  }
</script>
