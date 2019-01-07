<template>
  <div>
      <el-col :span="24" class="toolbar" style="padding-bottom: 15px;">
       规则类型：
        <el-select size="small" v-model="dqgz" @change="cxpkgzBylx(dqgz)" style="vertical-align: top;">
          <el-option v-for="lx in gzlx_select" :key="lx.lxid" :label="lx.lxmc" :value="lx.lxid"> </el-option>
        </el-select>
        <el-tag type="info">{{gzlbtjxx}}</el-tag>
      </el-col>
    <el-table :data="tableData"  border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="规则类型">
        <template slot-scope="scope">
          <span>{{scope.row.gzlxmc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="规则单位">
        <template slot-scope="scope">
          <span>{{scope.row.gzdwmc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="规则明细">
        <template slot-scope="scope">
          <span>{{scope.row.gzmx}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="重要性">
        <template slot-scope="scope">
          <span>{{scope.row.gzdj}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { getGzlb, scgzBylx } from '@/api/pkxt/arrangingTask/gztj/pkgz';
  import jcsj from '@/api/jcsj';
  export default {
    data() {
      return {
        dqgz: 0,
        rwid: '',
        gzlx: { All: { lxid: 0, lxmc: '所有规则', gztm: 100, gzdj: '' },
          KCGDP: { lxid: 1, lxmc: '课程固定排', gztm: 0, gzdj: '必须满足' },
          KCGDBP: { lxid: 2, lxmc: '课程固定不排', gztm: 0, gzdj: '必须满足' },
          JSGDP: { lxid: 3, lxmc: '教师固定排', gztm: 0, gzdj: '必须满足' },
          JSGDBP: { lxid: 4, lxmc: '教师固定不排', gztm: 0, gzdj: '必须满足' },
          HB: { lxid: 5, lxmc: '合班', gztm: 0, gzdj: '必须满足' },
          DSZ: { lxid: 6, lxmc: '单双周', gztm: 0, gzdj: '必须满足' },
          KCHC: { lxid: 7, lxmc: '课程互斥', gztm: 0, gzdj: '优先满足' },
          JCLP: { lxid: 8, lxmc: '节次连排', gztm: 0, gzdj: '优先满足' },
          KCLP: { lxid: 9, lxmc: '课程连排', gztm: 0, gzdj: '优先满足' },
          JSHC: { lxid: 10, lxmc: '教师互斥', gztm: 0, gzdj: '优先满足' },
          JSLP: { lxid: 11, lxmc: '教师连排', gztm: 0, gzdj: '优先满足' },
          KSSD: { lxid: 12, lxmc: '课程时段', gztm: 0, gzdj: '一般' },
          JAQP: { lxid: 13, lxmc: '教案齐平', gztm: 0, gzdj: '一般' },
          ZRK: { lxid: 14, lxmc: '周任课分布', gztm: 0, gzdj: '一般' },
          TRK: { lxid: 15, lxmc: '天任课分布', gztm: 0, gzdj: '一般' }
        },
        sygz: [],
        tableData: [],
        gzlx_select: [],
        gzlbtjxx: '',
        gztm_zy: 0,
        gztm_yb: 0
      };
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
      // this.cxgzlb();
    },
    methods: {
      cxgzlb() {
        const rwid = this.$route.query.rwid;
        this.rwid = rwid;
        getGzlb({ rwid }).then(res => {
          this.dqgz = 0;
          this.gztm_zy = 0;
          this.gztm_yb = 0;
          this.sygz = [];
          this.gzlx_select = [];
          this.gzlx_select.push(this.gzlx.All);
          this.handelData(res.data);
          this.cxpkgzBylx();
        });
      },
      cxpkgzBylx(gzlxid) {
        if (gzlxid) {
          this.tableData = _.filter(this.sygz, { lxid: gzlxid });
        } else {
          this.tableData = this.sygz;
        }
      },
      handelData(sygz) {
        const bjgdp = _.filter(sygz.bjgdpk, { sfpk: 1 });
        const bjgdbp = _.filter(sygz.bjgdpk, { sfpk: 2 });
        const bjhclp = sygz.bjhc;
        const dsz = sygz.dsz;
        const jsgdp = _.filter(sygz.jsgdpk, { sfpk: 1 });
        const jsgdbp = _.filter(sygz.jsgdpk, { sfpk: 2 });
        const jshb = sygz.jshb;
        const jshclp = sygz.jshc;
        const jskcsd = sygz.jskcsd;
        const jaqp = sygz.jaqp;
        const jszrk = sygz.jszrk;
        const jstrk = sygz.jstrk;
        // 处理课程固定排
        this.clkcpkgz(bjgdp, this.gzlx.KCGDP);
        // 处理课程固定不排
        this.clkcpkgz(bjgdbp, this.gzlx.KCGDBP);
        // 处理教师固定排
        this.cljspkgz(jsgdp, this.gzlx.JSGDP, 'zgh');
        // 处理教师固定不排
        this.cljspkgz(jsgdbp, this.gzlx.JSGDBP, 'zgh');
        // 处理合班规则
        this.cljspkgz(jshb, this.gzlx.HB, 'hbkc');
        // 处理 班级互斥
        const kchc = _.filter(bjhclp, item => item.hckc && item.hckc !== '' && item.hckc != null);
        this.clkcgz(kchc, this.gzlx.KCHC);
        // 处理班级课程联排
        const kclp = _.filter(bjhclp, item => item.kclp && item.kclp !== '' && item.kclp != null);
        this.clkcgz(kclp, this.gzlx.KCLP);
        // 处理课程节次联排
        const jclp = _.filter(bjhclp, item => item.sfls === 1);
        this.clkcgz(jclp, this.gzlx.JCLP);
        // 处理单双周
        this.clkcgz(dsz, this.gzlx.DSZ);
        // 处理教师互斥
        const jshc = _.filter(jshclp, item => item.hcjs && item.hcjs !== '' && item.hcjs != null);
        this.cljspkgz(jshc, this.gzlx.JSHC, 'zgh');
        // 处理教师联排
        const jslp = _.filter(jshclp, item => item.lsjs === '2');
        this.cljspkgz(jslp, this.gzlx.JSLP, 'zgh');
        // 处理课程时段
        const kssd = _.filter(jskcsd, item => item.kssd !== 1);
        this.clqtgz(kssd, this.gzlx.KSSD, 'njdm');
        // 处理教案齐平
        this.clqtgz(jaqp, this.gzlx.JAQP, 'njdm');
        // 周任课分布
        this.clqtgz(jszrk, this.gzlx.ZRK, 'njdm');
        // 天任课分布
        this.clqtgz(jstrk, this.gzlx.TRK, 'njdm');
        const tm_bxmz = this.gzlx.KCGDP.gztm + this.gzlx.KCGDBP.gztm + this.gzlx.JSGDP.gztm + this.gzlx.JSGDBP.gztm
                      + this.gzlx.HB.gztm + this.gzlx.DSZ.gztm;
        const tm_yxmz = this.gzlx.KCHC.gztm + this.gzlx.JCLP.gztm + this.gzlx.KCLP.gztm + this.gzlx.JSHC.gztm + this.gzlx.JSLP.gztm;
        const ztm = tm_bxmz + tm_yxmz + this.gztm_zy + this.gztm_yb;
        this.gzlbtjxx = '总计:' + ztm + '条规则,其中' + tm_bxmz + '条必须满足,' + tm_yxmz + '条优先满足,' + this.gztm_zy + '条重要,' + this.gztm_yb + '条一般';
      },
      // 处理课程节数规则
      clkcpkgz(gzlb, gzlx) {
        const that = this;
        if (gzlb.length > 0) {
          let gzCount = 0;
          jcsj.sjfz(gzlb, 'bjdm').forEach(item => {
            const pkgz = {};
            let gzmx = '';
            pkgz.gzlxmc = gzlx.lxmc;
            pkgz.lxid = gzlx.lxid;
            pkgz.gzdj = gzlx.gzdj;
            pkgz.gzdw = item.bjdm;
            pkgz.gzdwmc = jcsj.hqbjmcByid(that.bjList, item.bjdm);
            jcsj.sjfz(item.children, 'kcdm').forEach(ite => {
              gzmx += jcsj.hqkcmcByid(that.kcList, ite.kcdm);
              ite.children.forEach(pkmx => {
                gzmx += '周' + pkmx.pkzs + '第' + pkmx.pkjs + '节-';
                gzCount++;
              })
            })
            pkgz.gzmx = gzmx;
            this.sygz.push(pkgz);
          })
          gzlx.gztm = gzCount;
          this.gzlx_select.push(gzlx);
        }
      },
      // 处理教师排课规则
      cljspkgz(gzlb, gzlx, zdm) {
        if (gzlb.length > 0) {
          let gzCount = 0;
          const that = this;
          jcsj.sjfz(gzlb, zdm).forEach(item => {
            const pkgz = {};
            let gzmx = '';
            pkgz.gzlxmc = gzlx.lxmc;
            pkgz.lxid = gzlx.lxid;
            pkgz.gzdj = gzlx.gzdj;
            pkgz.gzdw = item[zdm];
            if (zdm === 'hbkc') {
              pkgz.gzdwmc = jcsj.hqkcmcByid(that.kcList, item.hbkc);
            } else if (zdm === 'zgh') {
              pkgz.gzdwmc = jcsj.hqjsmcByid(that.jsList, item.zgh);
            } else if (zdm === 'bjdm') {
              pkgz.gzdwmc = jcsj.hqbjmcByid(that.bjList, item.bjdm);
            } else if (zdm === 'njdm') {
              pkgz.gzdwmc = jcsj.hqnjmcByid(that.njList, item.njdm);
            }
            item.children.forEach(ite => {
              if (gzlx.lxid === that.gzlx.JSGDP.lxid || gzlx.lxid === that.gzlx.JSGDBP.lxid) {
                gzmx += jcsj.hqkcmcByid(that.kcList, ite.kcdm) + '周' + ite.pkzs + '第' + ite.pkjs + '节-';
              } else if (gzlx.lxid === that.gzlx.JSHC.lxid) {
                gzmx += jcsj.hqjsmcByid(that.jsList, ite.zgh) + '和' + jcsj.hqjsmcByid(that.jsList, ite.hcjs) + '互斥-';
              } else if (gzlx.lxid === that.gzlx.JSLP.lxid) {
                gzmx += jcsj.hqjsmcByid(that.jsList, ite.zgh) + jcsj.hqkcmcByid(that.kcList, ite.lskc) + '连上2节-';
              } else if (gzlx.lxid === that.gzlx.HB.lxid) {
                const hbbj = ite.hbbj.split(',');
                hbbj.forEach(bjdm => {
                  gzmx += jcsj.hqbjmcByid(that.bjList, bjdm) + ',';
                })
              } else if (gzlx.lxid === that.gzlx.JAQP.lxid) {
                gzmx += jcsj.hqjsmcByid(that.jsList, ite.zgh) + '-';
              } else if (gzlx.lxid === that.gzlx.ZRK.lxid) {
                gzmx += jcsj.hqjsmcByid(that.jsList, ite.zgh) + (ite.znfb === 1 ? '周内分散' : '周内集中') + '-';
              } else if (gzlx.lxid === that.gzlx.TRK.lxid) {
                gzmx += jcsj.hqjsmcByid(that.jsList, ite.zgh) + (ite.tnfb === 1 ? '天内分散' : '天内集中') + '-';
              } else if (gzlx.lxid === that.gzlx.KSSD.lxid) {
                gzmx += jcsj.hqjsmcByid(that.jsList, ite.zgh) + jcsj.hqkcmcByid(that.kcList, ite.kcdm) + '课时时段为' + (ite.kssd === 2 ? '上午,' : '下午-');
              }
              gzCount++;
            })
            pkgz.gzmx = gzmx;
            that.sygz.push(pkgz);
          })
          gzlx.gztm = gzCount;
          if (!_.includes(this.gzlx_select, gzlx)) {
            this.gzlx_select.push(gzlx);
          }
        }
      },
      // 处理课程互斥规则
      clkcgz(gzlb, gzlx) {
        if (gzlb.length > 0) {
          let gzCount = 0;
          const that = this;
          jcsj.sjfz(gzlb, 'bjdm').forEach(item => {
            console.log(1111);
            const pkgz = {};
            let gzmx = '';
            pkgz.gzlxmc = gzlx.lxmc;
            pkgz.lxid = gzlx.lxid;
            pkgz.gzdj = gzlx.gzdj;
            pkgz.gzdw = item.bjdm;
            pkgz.gzdwmc = jcsj.hqbjmcByid(that.bjList, item.bjdm);
            item.children.forEach(ite => {
              if (gzlx.lxid === that.gzlx.KCHC.lxid) {
                if (ite.hckc) {
                  gzmx += jcsj.hqkcmcByid(that.kcList, ite.kcdm) + '和'
                    + jcsj.hqkcmcByid(that.kcList, ite.hckc) + '在 ' + (ite.hcfs === 1 ? '半天' : '一天') + '内互斥-';
                }
              } else if (gzlx.lxid === that.gzlx.JCLP.lxid) {
                if (ite.sfls) {
                  gzmx += jcsj.hqkcmcByid(that.kcList, ite.kcdm) + '连上2节-';
                }
              } else if (gzlx.lxid === that.gzlx.KCLP.lxid) {
                if (ite.kclp) {
                  gzmx += jcsj.hqkcmcByid(that.kcList, ite.kcdm) + '和' + jcsj.hqkcmcByid(that.kcList, ite.kclp) + '连上-';
                }
              } else if (gzlx === that.gzlx.DSZ) {
                gzmx += '单周课程' + jcsj.hqkcmcByid(that.kcList, ite.dzkc) + '，双周课程' + jcsj.hqkcmcByid(that.kcList, ite.szkc) + '-';
              }
              gzCount++;
            })
            pkgz.gzmx = gzmx;
            that.sygz.push(pkgz);
          })
          gzlx.gztm = gzCount;
          if (gzCount > 0) {
            this.gzlx_select.push(gzlx);
          }
        }
      },
      clqtgz(gzlb, gzlx, zdm) {
        jcsj.sjfz(gzlb, 'zycd').forEach(item => {
          if (item.zycd === 1) {
            gzlx.gzdj = '重要';
            this.gztm_zy += item.children.length;
          } else {
            gzlx.gzdj = '一般';
            this.gztm_yb += item.children.length;
          }
          this.cljspkgz(item.children, gzlx, zdm);
        })
      },
      handleDelete(row) {
        const param = 'rwid=' + this.rwid + '&gzlx=' + row.lxid + '&gzdm=' + row.gzdw;
        scgzBylx(param).then(() => {
          this.cxgzlb();
        })
      }
    }
  };
</script>
