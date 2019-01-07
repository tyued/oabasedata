<template>
  <div>
  <el-tabs v-model="activeName" @tab-click="handleClick">
  <el-tab-pane label="课程设置" name="0">
    <page-kcsz ref="pageKcszgz" :nj-list="njList"
               v-bind:bj-list="bjList"
               v-bind:kc-list="kcList"
               v-bind:js-list="jsList"
               v-bind:jsz-list="jszList"> </page-kcsz>
  </el-tab-pane>
  <el-tab-pane label="教师设置" name="1">
   <page-jssz ref="pageJsszgz" :nj-list="njList"
              v-bind:bj-list="bjList"
              v-bind:kc-list="kcList"
              v-bind:js-list="jsList"
              v-bind:jsz-list="jszList"> </page-jssz>
  </el-tab-pane>
  <el-tab-pane label="其他设置" name="2">
    <page-qtsz ref="pageQtsz" :nj-list="njList"
               v-bind:bj-list="bjList"
               v-bind:kc-list="kcList"
               v-bind:js-list="jsList"></page-qtsz>
  </el-tab-pane>
  <el-tab-pane label="规则列表" name="3">
    <page-gzlb ref="pageGzlb"
               v-bind:nj-list="njList"
               v-bind:bj-list="bjList"
               v-bind:kc-list="kcList"
               v-bind:js-list="jsList"></page-gzlb>
  </el-tab-pane>
</el-tabs>
  </div>
</template>

<script>
  import pageKcsz from '@/views/pkxt/arrangingTask/gztj/kcsz';
  import pageJssz from '@/views/pkxt/arrangingTask/gztj/jssz';
  import pageGzlb from '@/views/pkxt/arrangingTask/gztj/gzlb';
  import pageQtsz from '@/views/pkxt/arrangingTask/gztj/qtsz';

  export default {
    components: { pageKcsz, pageJssz, pageGzlb, pageQtsz },
    data() {
      return {
        activeName: '0'
      }
    },
    methods: {
      handleClick() {
        if (this.activeName === '0') {
          sessionStorage.setItem('isFirst', true);
          this.$refs.pageKcszgz.loadnjBjData();
        } else if (this.activeName === '1') {
          sessionStorage.setItem('isFirst', true)
          this.$refs.pageJsszgz.childMethod();
        } else if (this.activeName === '2') {
          this.$refs.pageQtsz.loadMain();
        } else if (this.activeName === '3') {
          this.$refs.pageGzlb.cxgzlb();
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

