<template>
  <div class="view">
  <el-row :gutter="12">
    <el-card shadow="always" style="height:auto" >
      <el-autocomplete
        popper-class="my-autocomplete"
        v-model="this.currentLabel"
        :fetch-suggestions="querySearch"
        placeholder="输入教师姓名进行查询"
        @select="handleSelect">
        <i
          class="el-icon-edit el-input__icon"
          slot="suffix"
          @click="handleIconClick">
        </i>
      </el-autocomplete>
    </el-card>
      <el-card shadow="never" style="height:auto">
          <div class="KbBoxScroll-ksfb smallscroll">
            <table  ref="kb_table_ref" cellpadding="0" cellspacing="0" class="zkbtable fl" style="width: 100%;height:auto" >
              <thead >
              <tr >
                <th align="center"  v-if="this.currentLabel != ''" style="font-family: 	KaiTi;font-size: large" :colspan="pkzs.length + 2">{{this.currentLabel}}的周课时分布</th>
              </tr>
              <tr>
                <th style="width: 15%">教师/周次</th>
                <th v-for="zs in pkzs" style="width: 14%">星期{{zs}}</th>
                <th style="width: 15%">总课时数</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(js,rowIndex) in pkjs" style="height:60px">
                <td>{{js.value}}</td>
                <td v-for="(jc,colIndex) in pkzs">{{(zzkb[rowIndex][colIndex])}}</td>
                <td>{{(zzkb[rowIndex][pkzs.length])}}</td>
              </tr>
              </tbody>
            </table>
          </div>
      </el-card>
  </el-row>
  </div>
</template>
<script>
  import { timeTableInfo, getJskbByZgh, getAlljs } from '@/api/pkxt/arrangingTask/pktz/index';
  import jcsj from '@/api/jcsj.js';
  export default {
    name: 'ksfb',
    data() {
      return {
        rwid: this.$route.query.rwid,
        xxdm: this.$route.query.xxdm,
        treeData: [],
        jsxxList: [],
        pkzs: [],
        pkjs: [],
        zzkb: [],
        allZzkb: [],
        allJskb: [],
        jsksfbArr: [],
        currentZgh: 'init', // 当前所选教师职工号
        currentLabel: '', // 当前教师姓名
        tempCurrentLabel: [], // 导出全部课表时表头教师姓名数据
        queryJs: 'noClick', // 输入框输入教师姓名
        isShow: false, // 隐藏所有教师课表table
        defalutArr: []
      }
    },
    mounted() {
      getAlljs({ rwid: this.rwid }).then(res => {
        const jsxxList = [];
        for (const o of res.data) {
          const jsxm = jcsj.hqjsmcByid(this.jsList, o);
          const jsxx = { value: jsxm, zgh: o };
          jsxxList.push(jsxx);
        }
        this.restaurants = jsxxList;
      });
      this.getKsfb();
    },
    methods: {
      // 刷新课表
      freshTableChage() {
        timeTableInfo(this.rwid).then(timeTableRes => {
          const jsArr = [];
          const initKb = [];
          this.pkzs = timeTableRes.data.weekdayList;
          for (const jsxx of this.jsxxList) {
            if (!$.isEmptyObject(jsxx.value)) {
              jsArr.push(jsxx);
            }
          }
          this.pkjs = jsArr;
          jsArr.forEach(js => {
            const rowData = [];
            for (let i = 1; i <= this.pkzs.length; i++) {
              const ksfbArr = _.filter(this.jsksfbArr, { zgh: js.zgh, pkzs: i });
              if (!$.isEmptyObject(ksfbArr)) {
                rowData.push(ksfbArr.length);
              } else {
                rowData.push('');
              }
            }
            rowData.push(_.filter(this.jsksfbArr, { zgh: js.zgh }).length);
            initKb.push(rowData);
          });
          this.zzkb = initKb;
        });
      },
      // 输入框
      querySearch(queryString, cb) {
        this.queryJs = queryString;
        const restaurants = this.restaurants;
        const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      // 输入框
      createFilter(queryString) {
        return restaurant => restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      },
      // 选中建议词条时触发事件
      handleSelect(item) {
        this.currentLabel = item.value;
        this.currentZgh = item.zgh;
        this.queryJs = item.value;
        this.getJsksfb(item);
      },
      handleIconClick() {
        if (this.queryJs !== 'noClick') {
          if (this.queryJs === '') {
            this.currentLabel = '';
            this.currentZgh = '';
            this.getKsfb();
          } else {
            const jsdm = jcsj.hqjsdmBymc(this.jsList, this.queryJs);
            if (jsdm !== this.queryJs) {
              this.freshTableChage();
            } else {
              this.$notify({ title: '提示', message: '该教师不存在', type: 'warning' });
            }
          }
        }
      },
      getKsfb() {
        getJskbByZgh({ rwid: this.rwid }).then(res => {
          this.jsksfbArr = res.data;
          this.jsxxList = _.orderBy(this.restaurants, ['zgh'], ['desc']);
          // this.jsxxList = this.restaurants;
          this.freshTableChage();
        });
      },
      getJsksfb(item) {
        getJskbByZgh({ rwid: this.rwid, zgh: item.zgh }).then(res => {
          this.jsksfbArr = res.data;
          const jsxx = [{ value: item.value, zgh: item.zgh }];
          this.jsxxList = jsxx;
          this.freshTableChage();
        });
      }
    },
    props: {
      jsList: {
        /** 教师级类型列表数据**/
        type: Array,
        required: true
      }
    }
  }
</script>
