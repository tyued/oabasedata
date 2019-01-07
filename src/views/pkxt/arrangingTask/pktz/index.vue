<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">

    <el-tab-pane label="按班级调整" name="0">
      <!--调用课程设置页面-->
      <page-bjtz ref="pageBjtz" :grade-data-list="njList" :class-data-list="bjList"
                 :course-data-list="kcList" :teacher-data-list="jsList">
      </page-bjtz>
    </el-tab-pane>

    <el-tab-pane label="按教师调整" name="1">
      <page-kctz ref="pageKctz" :grade-data-list="njList" :class-data-list="bjList"
                 :course-data-list="kcList" :teacher-data-list="jsList">
      </page-kctz>
    </el-tab-pane>


    <el-tab-pane label="临时调课" name="2">
      <page-lstz ref="pageLstz" :grade-data-list="njList" :class-data-list="bjList"
                 :course-data-list="kcList" :teacher-data-list="jsList">
      </page-lstz>
    </el-tab-pane>


  </el-tabs>
</template>

<script>
  import pageBjtz from '@/views/pkxt/arrangingTask/pktz/bjtz.vue';
  import pageKctz from '@/views/pkxt/arrangingTask/pktz/kctz.vue';
  import pageLstz from '@/views/pkxt/arrangingTask/pktz/lstz.vue';
  export default {
    components: { pageBjtz, pageKctz, pageLstz },
    data() {
      return {
        activeName: this.$route.query.activeName
      }
    },
    methods: {
      handleClick() {
        if (this.activeName === '0') {
          this.$refs.pageBjtz.loadData();
        } else if (this.activeName === '1') {
          this.$refs.pageKctz.loadData();
        } else if (this.activeName === '2') {
          this.$refs.pageLstz.loadData();
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
      }
    }
  };
</script>
