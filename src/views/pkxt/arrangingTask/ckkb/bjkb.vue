<template>
    <div>
      <el-row>
        <div class="selgroup fl">
            <el-select v-model="selectNj" placeholder="请选择年级" style="width:150px;margin:0 5px;" @change="hqbjList">
                  <el-option label="请选择年级" value=""></el-option>
                <el-option v-for="item in njList" :key="item.njdm" :label="item.njmc" :value="item.njdm"></el-option>
            </el-select>
            <el-select v-model="selectBj" placeholder="请选择班级" style="width:150px;margin:0 5px;" @change="getBjkb">
                <el-option label="请选择班级" value=""></el-option>
                <el-option v-for="item in classList" :key="item.value" :label="item.bj" :value="item.uuid"></el-option>
            </el-select>
        </div>
        <div class="fr">
          <el-button type="primary" icon="el-icon-upload2" @click="exportTable">导出</el-button>
          <el-button type="primary" icon="el-icon-upload2" @click="exportAlltable">全部导出</el-button>
        </div>
      </el-row>

      <el-row class="sumKBBox mt20 smallscroll">
          <div class="KbBoxScroll smallscroll" style="width: 100%;">
            <table ref="bjkb_table_ref" cellpadding="0" cellspacing="0" class="zkbtable fl" style="width: 100%;">
              <thead>
              <tr>
                <th>星期/节次</th>
                <th v-for="zs in pkzs" >星期{{zs}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(js,rowIndex) in zpkjs">
                <td v-if="js.sfgs==2"><div>{{js.jcmc}}</div><div class="kbtime">{{js.qzsj}}</div></td>
                <th v-else-if="js.sfgs==1"class="publicTime" :colspan="pkzs.length+1">{{js.jcmc}}<span class="kbtime">{{js.qzsj}}</span></th>
                <td v-if="js.sfgs==2" v-for="(zss,colIndex) in pkzs"><span v-html="bjkb[rowIndex][colIndex]"></span></td>
              </tr>
              </tbody>

            </table>

            <table ref="zbjkb_table_ref" cellpadding="0" cellspacing="0" class="zkbtable fl" style=" display: none;" >
              <div v-for="kbItem of zbjkb" >
                <thead >
                <tr >
                  <th align="center" style="font-family: 	KaiTi;font-size: large" :colspan="pkzs.length + 1">{{kbItem.bjmc}}的课表</th>
                </tr>
                <tr>
                  <th style="width: 5%">星期/节次</th>
                  <th v-for="zs in pkzs" style="width: 16%">星期{{zs}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(js,rowIndex) in zpkjs">
                  <td v-if="js.sfgs==2">{{js.jcmc}}</td>
                  <th v-else-if="js.sfgs==1"class="publicTime" :colspan="pkzs.length+1">{{js.jcmc}}<span class="kbtime">{{js.qzsj}}</span></th>
                  <td v-if="js.sfgs==2" v-for="(zss,colIndex) in pkzs">{{(kbItem.bjkb[rowIndex][colIndex])}}</td>
                </tr>
                </tbody>
                <tr></tr>
              </div>
            </table>
          </div>
      </el-row>
    </div>
</template>

<script>
import { timeTableInfo, coursePlanList } from '@/api/pkxt/arrangingTask/pktz/index';
import { cxjcsj } from 'api/pkxt/arrangingTask/jcsz/kssz';
import jcsj from '@/api/jcsj.js';
export default {
  data() {
    return {
      classList: [],
      selectNj: '', // 当前选中年级
      selectBj: '', // 当前选中班级
      pkzs: [],
      zpkjs: [],
      pkjg: [],
      bjkb: [],
      zbjkb: []
    }
  },
  created() {
    // this.getKbtable();
  },
  methods: {
    // 根据年级筛选班级
    hqbjList() {
      this.selectBj = '';
      // this.bjkb = this.initkbTable();
      this.classList = _.filter(this.bjList, ['njdm', this.selectNj])
    },
    // 根据课时获取课表结构
    getKbtable() {
      const rwid = this.$route.query.rwid;
      const xxdm = window.localStorage.getItem('xxdm');
      cxjcsj({ rwid, xxdm }).then(res => {
        this.zpkjs = res.data;
      })
      timeTableInfo(rwid).then(res => {
        this.pkzs = res.data.weekdayList;
        this.getpkjg();
      })
    },
    // 查询总排课结果
    getpkjg() {
      const rwid = this.$route.query.rwid;
      coursePlanList(rwid).then(res => {
        this.pkjg =  _.filter(res.data, { ctype: '0' });
        this.getBjkb(this.selectBj);
      })
    },
    // 获取班级课表
    getBjkb(dqbj) {
      let bjpkjg = [];
      if (dqbj !== '') {
        bjpkjg = _.filter(this.pkjg, { bjdm: dqbj })
      }
      this.bjkb = this.clzkb(bjpkjg);
    },
    // 初始化 空课表
    initkbTable() {
      const result = [];
      this.zpkjs.forEach(() => {
        const rowData = [];
        this.pkzs.forEach(() => {
          rowData.push([]);
        })
        result.push(rowData);
      })
      return result;
    },
    // 将课程放入课表中
    clzkb(pkjg) {
      const initbjkb = this.initkbTable();
      pkjg.forEach(item => {
        const pkzs = this.pkzs.indexOf(item.pkzs);
        const jcxx = _.find(this.zpkjs, ['jcdm', item.pkjs]);
        const pkjs = this.zpkjs.indexOf(jcxx);
        try {
          initbjkb[pkjs][pkzs].push(item);
        } catch (e) {
          console.error('周' + pkzs + '行' + pkjs) + e;
        }
      })
      // 处理单双周，多老师的课表显示
      this.zpkjs.forEach((js, jsindex) => {
        this.pkzs.forEach((zs, zsindex) => {
          let xsmc = '';
          const pkjg = initbjkb[jsindex][zsindex];
          const onePkjg = pkjg[0];
          if (pkjg.length === 0) {
            initbjkb[jsindex][zsindex] = '';
          } else if (pkjg.length === 1) {
            const kcmc = jcsj.hqkcmcByid(this.kcList, onePkjg.kcdm);
            const xm = jcsj.hqjsmcByid(this.jsList, onePkjg.zgh);
            xsmc = (kcmc ? kcmc : '') + '-' + (xm ? xm : '');
            if (onePkjg.ishb === '1') {
              xsmc += '(合)';
            }
          } else if (pkjg.length > 1) {
            if (onePkjg.isdsz !== '0') {
              const dzpk = [];
              const szpk = [];
              pkjg.forEach(itm => {
                if (itm.isdsz === '1') {
                  dzpk.push(itm);
                } else if (itm.isdsz === '2') {
                  szpk.push(itm);
                }
              })
              let dzpkmc = '';
              let dzxm = '';
              const dzkcmc = jcsj.hqkcmcByid(this.kcList, dzpk[0].kcdm) + '(单)';
              console.log(dzkcmc);
              if (dzpk.length > 0) {
                dzpk.forEach(jg => {
                  const xm = jcsj.hqjsmcByid(this.jsList, jg.zgh);
                  dzxm += (xm ? xm : '') + ',';
                })
                dzpkmc = dzkcmc + dzxm;
              } else {
                dzxm = jcsj.hqjsmcByid(this.jsList, dzpk[0].zgh);
                dzpkmc = dzkcmc + (dzxm ? dzxm : '');
              }
              let szpkmc = '';
              let szxm = '';
              const szkcmc = jcsj.hqkcmcByid(this.kcList, szpk[0].kcdm) + '(双)';
              if (szpk.length > 0) {
                szpk.forEach(jg => {
                  const xm = jcsj.hqjsmcByid(this.jsList, jg.zgh);
                  szxm += (xm ? xm : '') + ',';
                })
                szpkmc = szkcmc + szxm;
              } else {
                szxm = jcsj.hqjsmcByid(this.jsList, szpk[0].zgh);
                szpkmc = szkcmc + (szxm ? szxm : '');
              }
              xsmc = dzpkmc + '<br>' + szpkmc;
            } else {
              const kcmc = jcsj.hqkcmcByid(this.kcList, onePkjg.kcdm);
              let xm = '';
              pkjg.forEach(jg => {
                const xsxm = jcsj.hqjsmcByid(this.jsList, jg.zgh);
                xm += (xsxm ? xsxm : '') + '/';
              })
              xsmc = (kcmc ? kcmc : '') + '-' + xm;
            }
            if (onePkjg.ishb === '1') {
              xsmc += '(合)';
            }
          }
          initbjkb[jsindex][zsindex] = xsmc;
        })
      })
      return initbjkb;
    },
    exportTable() {
      const bjxx = _.find(this.bjList, ['uuid', this.selectBj]);
      if (bjxx) {
        const oHtml = this.$refs.bjkb_table_ref.outerHTML;
        jcsj.exportTable2Excel(oHtml, bjxx.bj);
      } else {
        this.$message.warning('请选择班级');
      }
    },
    exportAlltable() {
      this.zbjkb = [];
      const sort_njList = _.sortBy(this.njList, item => item.njdm);
      const sort_bjList = jcsj.sortObjectByStr(this.bjList, 'bj');
      sort_njList.forEach(nj => {
        const nj_bjdm = _.filter(sort_bjList, ['njdm', nj.njdm]);
        nj_bjdm.forEach(bj => {
          const bjpkjg = _.filter(this.pkjg, ['bjdm', bj.uuid]);
          if (bjpkjg.length > 0) {
            const bjkbxx = this.clzkb(bjpkjg);
            this.zbjkb.push({ bjmc: bj.bj, bjkb: bjkbxx });
          }
        })
      })
      this.$nextTick(() => {
        const oHtml = this.$refs.zbjkb_table_ref.outerHTML;
        jcsj.exportTable2Excel(oHtml, '班级课表');
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
}
</script>
