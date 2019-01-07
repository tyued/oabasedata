<template>
  <div class="app-container calendar-list-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/ksglManager/kswh' }">我的考试</el-breadcrumb-item>
      <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <el-card shadow="hover">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="考试设置" name="0">
          <page-kssz ref="pageKssz"
                     v-bind:bj-list="bjList"
                     v-bind:kc-list="kcList"></page-kssz>
        </el-tab-pane>
        <el-tab-pane label="科目分项设置" name="1">
          <page-kmfx v-if="activeName == 1" ref="pageKmfx"
                     v-bind:bj-list="bjList"
                     v-bind:nj-list="njList"
                     v-bind:kc-list="kcList"></page-kmfx>
        </el-tab-pane>
        <el-tab-pane label="人数统计" name="2">
          <page-kstj v-if="activeName == 2" ref="pageKstj"  v-bind:nj-list="njList"></page-kstj>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
  import jcsj from '@/api/jcsj';
  import { dqxnxqObj } from '@/api/pkxt/arrangingTask/index';
  import pageKssz from '@/views/ksgl/kswh/kssz/kssz';
  import pageKmfx from '@/views/ksgl/kswh/ksfxwh/kskmfx';
  import pageKstj from '@/views/ksgl/kswh/kstj/kstjsz';
  export default {
    components: { pageKssz, pageKmfx, pageKstj },
    data() {
      return {
        name: this.$route.query.name,
        curComponent: 'pageKssz',
        activeName: 0,
        njList: [],
        bjList: [],
        kcList: [],
        jsList: [],
        jszList: []
      }
    },
    created() {
      /** 初始化基础数据**/
      jcsj.remove(jcsj.BJ_KEY);
      jcsj.remove(jcsj.NJ_KEY);
      jcsj.remove(jcsj.KC_KEY);
      jcsj.remove(jcsj.JS_KEY);
      jcsj.remove(jcsj.JSZ_KEY);
      this.xxdm = window.localStorage.getItem('xxdm');
      this.abc();
    },
    methods: {
      handleClick() {
        if (this.activeName === '0') {
          this.$refs.pageKssz.initKsszMian();
        } else if (this.activeName === '1') {
          //
        }
      },
      async abc() {
        await dqxnxqObj({ xxdm: this.xxdm }).then(response => {
          this.dqxn = response.xn;
          this.dqxq = response.xq;
        })
        const parm = { xxdm: this.xxdm, xn: this.dqxn }
        /** 获取年级**/
        jcsj.hqnjlb(parm).then(res => {
          this.njList = res;
        })
        /** 获取班级**/
        jcsj.hqbjlb(parm).then(res => {
          this.bjList = res;
        })
        /** 获取课程**/
        jcsj.hqkclb(parm).then(res => {
          this.kcList = res;
        })
        /** 获取教师**/
        jcsj.hqjslb(parm).then(res => {
          this.jsList = res;
        })
        /** 获取教师组**/
        const v = { xxdm: this.xxdm };
        jcsj.hqjszlb(v).then(res => {
          this.jszList = res;
        })
        this.handleClick(this.index);
      }
    }
  }
</script>
