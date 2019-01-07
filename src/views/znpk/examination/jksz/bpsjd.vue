<template>
  <div class="pk-container smallscroll bpsjd">
<!--    <el-row>
      <el-radio-group  v-for="item in cknjlist" v-model="dqnj" :key="item.njdm" @change="cxkclskmByNj">
        <el-radio-button :label="item.njdm">{{item.label}}</el-radio-button>
      </el-radio-group >
    </el-row>-->
    <el-row>
      <table cellpadding="0" cellspacing="0" class="zkbtable" style="width: 100%;margin-left:0;" >
        <thead style="background-color: #f5f7fa;">
        <tr>
          <th>选择</th>
          <th>姓名</th>
          <th v-for="kmxx in kskmList" :key="kmxx.kcdm" >{{kmxx.ksrq}}<br>{{kmxx.kmkssj}}~{{kmxx.kmjssj}}<br>{{kmxx.kcmc}}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(ls,rowIndex) in kslsList" :key="ls.zgh">
          <td width="5%"><el-checkbox v-model="lsArr[rowIndex]" @change="sfqxls"></el-checkbox></td>
          <td width="6%">{{ls.jsmc}}</td>
          <td v-for="(km,colIndex) in kskmList" :key="km.kcdm">
            <el-checkbox v-model="kcjkgz[rowIndex][colIndex]" @change="changepkgz($event,ls,km.jlid,rowIndex)"></el-checkbox>
          </td>
        </tr>
        </tbody>

      </table>
      <el-checkbox label="全选" v-model="sfqx" border @change="changeqxsz()"></el-checkbox>
      <el-button style="vertical-align: middle;" type="danger" @click="showplsz">批量设置</el-button>
    </el-row>
    <el-dialog
      title="选择不排时间段"
      :visible.sync="centerDialogVisible"
      center width="20%" :before-close="canclePlsz">
      <table cellpadding="0" cellspacing="0" class="zkbtable" style="margin-left:0;">
        <tbody>
        <tr v-for="(kskm,colIndex) in kskmList" :key="kskm.kcdm">
          <td><el-checkbox v-model="kmArr[colIndex]" @change="plszjsgz($event,colIndex)"></el-checkbox>{{kskm.ksrq}}  {{kskm.kmkssj}}~{{kskm.kmjssj}}  {{kskm.kcmc}}</td>
        </tr>
        </tbody>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canclePlsz">取 消</el-button>
        <el-button type="primary" @click="plpdpkgz">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getKskmxx } from '@/api/znpk/examination/kssz/index';
  import { getJklsBynjksid, getJktjBynjksid, addJktj, delJktj, plxgJktj } from '@/api/znpk/examination/jksz/index';
  import jcsj from '@/api/jcsj';
  export default {
    data() {
      return {
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid,  // 当前考试代码
        cknjlist: [],
        kslsList: [],
        kskmList: [],
        kcjkgz: [],
        sfqx: false,
        lsArr: [],
        kmArr: [],
        centerDialogVisible: false
      };
    },
    methods: {
      async cxkclskmByNj() {
        const kskmlist = [];
        let kslslist = [];
        let ksjktj = [];
        await getKskmxx({ ksdxid: this.ksid, njdm: this.dqNjdm }).then(res => {
          // 封装考试科目信息(查询科目名称)
          for (const kskmxx of res.data.rows) {
            const kcmc = jcsj.hqkcmcByid(this.kcList, kskmxx.kcdm);
            kskmxx.kcmc = kcmc;
            kskmlist.push(kskmxx);
          }
        });
        await getJklsBynjksid({ ksid: this.ksid, njdm: this.dqNjdm }).then(res => {
          kslslist = _.sortBy(res.data, item => item.zgh);
          kslslist.forEach(ls => {
            ls.jsmc = jcsj.hqjsmcByid(this.jsList, ls.zgh);
          })
          // this.kslsList = sort_kcls;
        })
        await getJktjBynjksid({ ksid: this.ksid, njdm: this.dqNjdm }).then(res => {
          ksjktj = res.data;
        })
        this.handelData(kskmlist, kslslist, ksjktj);
        this.changeqxsz();
      },
      handelData(kskmlist, kslslist, ksjktj) {
        // 展示排考规则
        const initArr = this.initkbTable(kskmlist, kslslist);
        ksjktj.forEach(item => {
          const ls = _.find(kslslist, ['zgh', item.zgh]);
          const km = _.find(kskmlist, ['jlid', item.kskmid]);
          const rowIndex = kslslist.indexOf(ls);
          const colIndex = kskmlist.indexOf(km);
          try {
            initArr[rowIndex][colIndex] = true;
          } catch (e) {
            console.log('colIndex' + colIndex + 'rowIndex' + rowIndex);
          }
        })
        this.kcjkgz = initArr;
        this.kslsList = kslslist;
        this.kskmList = kskmlist;
      },
      // 初始化 监考条件
      initkbTable(kskmlist, kslslist) {
        this.lsArr = [];
        this.kmArr = [];
        const result = [];
        kslslist.forEach(() => {
          this.lsArr.push(false);
          const rowData = [];
          kskmlist.forEach(() => {
            rowData.push(false);
          })
          result.push(rowData);
        })
        kskmlist.forEach(() => {
          this.kmArr.push(false);
        })
        return result;
      },
      changepkgz(e, ls, kskmid, rowIndex) {
        let kjkcz = 0; // 可监考场次 = 最大监考场数
        this.kskmList.forEach((km, colindex) => {
          const jkgz = this.kcjkgz[rowIndex][colindex];
          if (!jkgz) { kjkcz++; }
        })
        const param = { ksid: this.ksid, njdm: this.dqNjdm, kskmid, zgh: ls.zgh, zdjkcs: kjkcz };
        if (e) {
          // 新增规则时，需满足最少监考数
          if (ls.zscs && kjkcz < ls.zscs) {
            this.$notify({ title: '提示', message: '该老师最少需监考' + ls.zscs + '场', type: 'warning', duration: 2000 });
            this.cxkclskmByNj();
            return false;
          }
          addJktj(param).then(() => {
            this.cxkclskmByNj();
          })
        } else {
          delJktj(param).then(() => {
            this.cxkclskmByNj();
          })
        }
      },
      sfqxls() {
        let count = 0;
        this.lsArr.forEach(ls => {
          if (ls) {
            count++;
          }
        })
        if (count === this.lsArr.length) {
          this.sfqx = true;
        } else {
          this.sfqx = false;
        }
      },
      changeqxsz() {
        const arr = [];
        this.lsArr.forEach(() => {
          arr.push(this.sfqx);
        })
        this.lsArr = arr;
      },
      showplsz() {
        this.sfqxls();
        if (this.lsArr.includes(true)) {
          this.kmArr.forEach((km, colindex) => {
            let count = 0;
            this.lsArr.forEach((ls, rowindex) => {
              const flag = this.kcjkgz[rowindex][colindex];
              if (flag) {
                count++;
              }
            })
            console.log(count);
            if (count === this.kslsList.length) {
              this.kmArr[colindex] = true;
            } else {
              this.kmArr[colindex] = false;
            }
          })
          this.centerDialogVisible = true;
        } else {
          this.$notify({ title: '提示', message: '请选择老师', type: 'warning', duration: 2000 });
        }
      },
      canclePlsz() {
        this.cxkclskmByNj();
        this.centerDialogVisible = false;
      },
      // 批量设置教师规则
      plszjsgz(e, colindex) {
        this.lsArr.forEach((ls, rowindex) => {
          if (ls) {
            this.kcjkgz[rowindex][colindex] = e;
          }
        })
      },
      // 批量判断监考规则是否满足最小监考节数
      plpdpkgz() {
        let lsmc = '';
        this.lsArr.forEach((ls, rowindex) => {
          if (ls) {
            let kjkcount = 0;
            this.kmArr.forEach((km, colindex) => {
              const flag = this.kcjkgz[rowindex][colindex];
              if (!flag) {
                kjkcount++;
              }
            })
            const ls = this.kslsList[rowindex];
            if (kjkcount < ls.zscs) {
              lsmc = lsmc + ls.jsmc + ',';
            }
          }
        })
        if (lsmc !== '') {
          this.$notify({ title: '提示', message: lsmc + '最少场次未满足', type: 'warning', duration: 2000 });
          this.canclePlsz();
        } else {
          const Jktj = { ksid: this.ksid, njdm: this.dqNjdm, jktjList: [] };
          this.kslsList.forEach((ls, rowIndex) => {
            this.kskmList.forEach((km, colIndex) => {
              const flag = this.kcjkgz[rowIndex][colIndex];
              if (flag) {
                const tj = { ksid: this.ksid, njdm: this.dqNjdm, kskmid: km.jlid, zgh: ls.zgh }
                Jktj.jktjList.push(tj)
              }
            })
          })
          plxgJktj(Jktj).then(() => {
            this.canclePlsz();
          })
        }
      }
    },
    props: {
      dqNjdm: {
        /** 年级类型列表数据**/
        type: String,
        required: true
      },
      njList: {
        /** 年级类型列表数据**/
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

<style>
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    padding: 1px 0;
    list-style: none;
  }
  .pk-container {
    width: 100%;
    overflow-x: auto;
  }
  .pk-btns {
    text-align: center;
  }
  .pk-table {
    margin: 15px 0;
  }
  .bpsjd .el-checkbox__inner {
    border-radius: 50%;
    width: 18px;
    height: 18px;
  }
  .bpsjd .el-checkbox__inner::after {
    height: 9px;
    left: 6px;
    top: 2px;
  }
</style>
