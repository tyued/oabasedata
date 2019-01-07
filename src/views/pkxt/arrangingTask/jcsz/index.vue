<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="课时设置" name="0">
      <page-kssz ref="pageKssz"
                 v-bind:nj-list="njList"
                 v-bind:bj-list="bjList"
                 v-bind:kc-list="kcList"
                 v-bind:js-list="jsList"></page-kssz>  <!--调用课时设置页面-->
    </el-tab-pane>
    <el-tab-pane label="课程设置" name="1">
      <page-kcsz ref="pageKcsz"
                 v-bind:nj-list="njList"
                 v-bind:bj-list="bjList"
                 v-bind:kc-list="kcList"
                 v-bind:js-list="jsList"></page-kcsz>
    </el-tab-pane>
    <el-tab-pane label="教师设置" name="2">
      <page-jssz ref="pageJssz"
                 v-bind:nj-list="njList"
                 v-bind:bj-list="bjList"
                 v-bind:kc-list="kcList"
                 v-bind:js-list="jsList"
                 v-bind:jsz-list="jszList"></page-jssz> <!--调用教师设置页面-->
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import pageKssz from '@/views/pkxt/arrangingTask/jcsz/kssz';
  import pageKcsz from '@/views/pkxt/arrangingTask/jcsz/kcsz';
  import pageJssz from '@/views/pkxt/arrangingTask/jcsz/jssz';

  export default {
    components: { pageKcsz, pageKssz, pageJssz },
    data() {
      return {
        curComponent: 'pageJssz',
        module: 0,
        activeName: '0',
        xxdm: window.localStorage.getItem('xxdm')
      }
    },
    methods: {
      handleClick() {
        if (this.activeName === '0') {
          this.$refs.pageKssz.initKssz();
          this.$refs.pageKssz.checkHxsz();
        } else if (this.activeName === '1') {
          this.$refs.pageKcsz.loadnjBjData();
          this.$refs.pageKcsz.getZxs();
        } else if (this.activeName === '2') {
          this.$refs.pageJssz.handLoadJssz();
        }
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

