<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="按课程查询" name="0">
      <page-kcxx v-if="activeName == 0" ref="pageKcxx"></page-kcxx>  <!--调用课时设置页面-->
    </el-tab-pane>
    <el-tab-pane label="按学生查询" name="1">
      <page-xsxx v-if="activeName == 1" ref="pageXsxx"></page-xsxx>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import pageKcxx from '@/views/xkxt/xkjgmanager/kcxx';
  import pageXsxx from '@/views/xkxt/xkjgmanager/xsxx';
  export default {
    components: { pageKcxx, pageXsxx },
    data() {
      return {
        curComponent: 'pageXsxx',
        activeName: '0'
      }
    },
    methods: {
      handleClick() {
        if (this.activeName === '0') {
         /* this.$refs.pageKcxx.getList();*/
        } else if (this.activeName === '1') {
          this.$refs.pageXsxx.getXsxxList();
        }
      }
    }
  };
</script>

