<template>
  <div class="pk-container jktz">
    <el-row style="margin-top:10px;">
      <table cellpadding="0" cellspacing="0" class="zkbtable fl" style="width: 100%" >
        <thead>
        <tr>
          <th>考场</th>
          <th v-for="kmxx in kskmList" :key="kmxx.kskmid" >{{kmxx.kcdm}}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(kc,rowIndex) in kskcList" :key="kc.kskcid">
          <td v-if="!kc.kskcmc">科目巡考</td>
          <td v-else>{{kc.kskcmc}}</td>
          <td v-for="(km,colIndex) in kskmList" :key="km.kskmid" style="padding: 0 10px;">
            <el-select v-model="kcjkxx[rowIndex][colIndex]"
                        filterable multiple
                       @visible-change="editJkls($event,kc.kskcid,km.kskmid,rowIndex,colIndex)"
                       @remove-tag="editJkls(false,kc.kskcid,km.kskmid,rowIndex,colIndex)">
              <el-option
                v-for="item in jsList"
                :key="item.gh"
                :label="item.xm"
                :value="item.gh">
              </el-option>
            </el-select>
          </td>
        </tr>
        </tbody>

      </table>
    </el-row>
  </div>
</template>

<script>
  import { getKclsxxByKsid, saveKclsxx } from '@/api/znpk/examination/pktz/index';
  import jcsj from '@/api/jcsj';
  export default {
    data() {
      return {
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid,  // 当前考试代码
        cknjlist: [],
        kskcList: [],
        kskmList: [],
        all_kclsxx: [],
        kcjkxx: [],
        dq_jklsxx: []
      };
    },
    methods: {
      cxkclsByNj() {
        getKclsxxByKsid({ ksid: this.ksid, njdm: this.dqNjdm }).then(res => {
          if (res.status === 200) {
            this.all_kclsxx = res.data;
            const kskc = _.uniqBy(this.all_kclsxx, 'kskcid');
            const kskm = _.uniqBy(this.all_kclsxx, 'kskmid');
            this.kskcList = _.sortBy(kskc, item => item.kskcmc);
            this.kskmList = _.sortBy(kskm, item => item.kskmid);
            this.handelData();
          }
        })
      },
      handelData() {
        // 展示考场监考老师信息
        const initArr = this.initkbTable();
        this.all_kclsxx.forEach(item => {
          const kc = _.find(this.kskcList, ['kskcid', item.kskcid]);
          const km = _.find(this.kskmList, ['kskmid', item.kskmid]);
          const kmIndex = this.kskmList.indexOf(km);
          const kcIndex = this.kskcList.indexOf(kc);
          try {
            if (item.zgh) {
              initArr[kcIndex][kmIndex].push(item.zgh);
            }
          } catch (e) {
            console.log('kmIndex' + kmIndex + 'kcIndex' + kcIndex);
          }
        })
        this.kcjkxx = initArr;
      },
      // 初始化 考场监考
      initkbTable() {
        const result = [];
        this.kskcList.forEach(() => {
          const rowData = [];
          this.kskmList.forEach(km => {
            km.kcdm = jcsj.hqkcmcByid(this.kcList, km.kcdm);
            rowData.push([]);
          })
          result.push(rowData);
        })
        return result;
      },
      editJkls(e, kskcid, kskmid, rowIndex, colIndex) {
        if (!e) {
          let flag = true;
          const lsList = this.kcjkxx[rowIndex][colIndex];
          // 判断 一个科目内不能出现重复老师
          const kmjkls = [];
          this.kskcList.forEach((kc, index) => {
            const kmkcls = this.kcjkxx[index][colIndex];
            kmkcls.forEach(zgh => {
              kmjkls.push(zgh);
            })
          })
          const uniqcount = _.uniq(kmjkls).length;
          if (kmjkls.length !== uniqcount) {
            this.$notify({ title: '提示', message: '同一科目出现重复老师', type: 'warning', duration: 2000 });
            flag = false;
          }
          if (lsList.length === 0) {
            this.$notify({ title: '提示', message: '此考场最少需设置1个监考老师', type: 'warning', duration: 2000 });
            flag = false;
          }
          if (flag) {
            const jklsArr = [];
            lsList.forEach(ls => {
              const jkls = { ksid: this.ksid, njdm: this.dqNjdm, kskcid, kskmid, zgh: ls };
              jklsArr.push(jkls)
            })
            saveKclsxx(jklsArr).then(() => {
              console.log(111);
            })
          } else {
            this.cxkclsByNj();
          }
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
      bjList: {
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

<style scoped>
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;
  }
  .pk-container {
    width: 100%;
  }
  .pk-btns {
    text-align: center;
  }
  .pk-table {
    margin: 15px 0;
  }
</style>
