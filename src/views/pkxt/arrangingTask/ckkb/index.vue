<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
  <el-tab-pane label="班级课表" name="0">
    <page-bjkb ref="pageBjkb"
               v-bind:nj-list="njList"
               v-bind:bj-list="bjList"
               v-bind:kc-list="kcList"
               v-bind:js-list="jsList">
    </page-bjkb>
  </el-tab-pane>
  <el-tab-pane label="教师课表" name="1">
    <page-jskb ref="pageJskb"
               v-bind:nj-list="njList"
               v-bind:bj-list="bjList"
               v-bind:kc-list="kcList"
               v-bind:js-list="jsList"
               v-bind:jsz-list="jszList">
    </page-jskb>
  </el-tab-pane>
  <el-tab-pane label="总课表" name="2">
    <page-zjskb ref="pagezbjkb"
                v-bind:nj-list="njList"
                v-bind:bj-list="bjList"
                v-bind:kc-list="kcList"
                v-bind:js-list="jsList">
    </page-zjskb>
  </el-tab-pane>
  <el-tab-pane label="总任课表" name="3">
    <page-zjskb ref="pagezjskb"
                v-bind:nj-list="njList"
                v-bind:bj-list="bjList"
                v-bind:kc-list="kcList"
                v-bind:js-list="jsList">
    </page-zjskb>
  </el-tab-pane>
  <el-tab-pane label="课表质量" name="4">
    <page-kbzl ref="pagekbzl"
                v-bind:nj-list="njList"
                v-bind:bj-list="bjList"
                v-bind:kc-list="kcList"
                v-bind:js-list="jsList">
    </page-kbzl>
  </el-tab-pane>
  <el-tab-pane label="课时分布" name="5">
    <page-ksfb ref="pageKsfb" v-bind:js-list="jsList" >
    </page-ksfb>
  </el-tab-pane>
  </el-tabs>
</template>


<script>
  import pageKbzl from '@/views/pkxt/arrangingTask/ckkb/kbzl';
  import pageZjskb from '@/views/pkxt/arrangingTask/ckkb/zjskb';
  import pageJskb from '@/views/pkxt/arrangingTask/ckkb/jskb';
  import pageBjkb from '@/views/pkxt/arrangingTask/ckkb/bjkb';
  import pageKsfb from '@/views/pkxt/arrangingTask/ckkb/ksfb';

  export default {
    components: { pageZjskb, pageKbzl, pageJskb, pageBjkb, pageKsfb },
    data() {
      return {
        activeName: '0'
      }
    },
    methods: {
      handleClick() {
        if (this.activeName === '0') {
          this.$refs.pageBjkb.getKbtable();
        } else if (this.activeName === '1') {
          this.$refs.pageJskb.loadTree();
        } else if (this.activeName === '2') {
          this.$refs.pagezbjkb.getKbtable('bjdm');
        } else if (this.activeName === '3') {
          this.$refs.pagezjskb.getKbtable('zgh');
        } else if (this.activeName === '4') {
          this.$refs.pagekbzl.hqpkzl();
        } else if (this.activeName === '5') {
          this.$refs.pageKsfb.getKsfb();
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
  }
</script>

