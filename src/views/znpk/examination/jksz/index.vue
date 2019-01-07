<template>
  <div class="pk-jksz">
    <div>
      <el-radio-group v-model="currentNjmc"  @change="handleClick(0,$event)">
        <el-radio-button v-for="item in njArr" :label="item.njdm" :key="item.njdm" >{{item.njmc}}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="smallscroll" style="margin-top: 10px">
      <el-tabs v-model="activeName" @tab-click="handleClick(1,$event)" >
        <el-tab-pane name="0">
          <span slot="label"><i class="el-icon-sort"></i>巡考设置</span>
          <page-xksz ref="pageXksz"
                     v-bind:dq-njdm="currentNjmc"
                     v-bind:nj-list="njList"
                     v-bind:kc-list="kcList"
                     v-bind:js-list="jsList"
          ></page-xksz>
        </el-tab-pane>
        <el-tab-pane name="1">
          <span slot="label"><i class="el-icon-view"></i>监考条件设置</span>
          <pageJktjsz ref="pageJktjsz"
                      v-bind:dq-njdm="currentNjmc"
                      v-bind:nj-list="njList"
                      v-bind:kc-list="kcList"
                      v-bind:js-list="jsList"
                      v-bind:jsz-list="jszList"></pageJktjsz>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label"><i class="el-icon-bell"></i>不排时间段</span>
          <page-bpsjd ref="pageBpsjd"
                      v-bind:dq-njdm="currentNjmc"
                      v-bind:nj-list="njList"
                      v-bind:kc-list="kcList"
                      v-bind:js-list="jsList"
          ></page-bpsjd>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import pageXksz from '@/views/znpk/examination/jksz/xksz';
  import pageJktjsz from '@/views/znpk/examination/jksz/jktjsz';
  import pageBpsjd from '@/views/znpk/examination/jksz/bpsjd';
  import { getCknj } from '@/api/znpk/examination/ckpk/index';
  import jcsj from '@/api/jcsj'

  export default {
    components: { pageXksz, pageJktjsz, pageBpsjd },
    data() {
      return {
        curComponent: 'pageXksz',
        activeName: '0',
        njArr: [],
        currentNjmc: '',
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid  // 当前考试代码
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.ksnjList();
    },
    methods: {
      handleClick(e) {
        if (e === 0) { this.activeName = '0'; }
        if (this.activeName === '0') {
          this.$refs.pageXksz.initXksz();
        } else if (this.activeName === '1') {
          this.$refs.pageJktjsz.initJktjsz();
        } else if (this.activeName === '2') {
          this.$refs.pageBpsjd.cxkclskmByNj();
        }
      },
      ksnjList() {
        getCknj({ ksdxid: this.ksid }).then(res => {
          if (res.length > 0) {
            const $this = this, nj_arry = [];
            res.forEach(njdm => {
              const obj = {};
              obj.njdm = njdm;
              obj.njmc = jcsj.hqnjmcByid($this.njList, njdm);
              nj_arry.push(obj);
            });
            // 初始化默认选中年级
            this.njArr = nj_arry;
            this.currentNjmc = this.njArr[0].njdm;
          }
        })
      }
    },
    props: {
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
      },
      jszList: {
        /** 教师级类型列表数据**/
        type: Array,
        required: true
      }
    }
  };
</script>
<style>
</style>
