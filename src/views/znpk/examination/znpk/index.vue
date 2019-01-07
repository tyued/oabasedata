<template>
  <div class="view">
    <div class="autoPkMain" v-show="step=='step1'" style="text-align: center;height: 500px;padding-top: 250px">
      <el-button class="autoPkBtn" type="primary" size="large" @click="autopk">智能排考</el-button>
    </div>
    <div class="autoPkIng" v-show="step=='step2'">
      <i class="el-icon-loading"></i><br>
      正在排考中...
    </div>
    <div class="mask" v-show="step=='step2'"></div>
    <div class="autoPkResult" v-show="step=='step3'">
      <div class="autoResultInfo"><i class="el-icon-circle-check"></i> 排完啦！</div>
      <div class="autoResultCondition" style="text-align: center">
        <el-button type="success" size="large" style="margin-top: 30px" @click="ckpkjg">查看排考结果</el-button>
        <el-button @click="autopk"  size="large" style="margin-top: 30px">再排一次</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { kczdpk } from '@/api/znpk/examination/znpk/index';
  import { getKcxsxxByKskcid } from '@/api/znpk/examination/pktz/index';
  export default {
    name: 'zdpk',
    data() {
      return {
        xxdm: this.$route.query.xxdm,
        ksid: this.$route.query.ksid,
        step: 'step1'
      }
    },
    created() {
      this.checkStep();
    },
    methods: {
      autopk() {
        this.step = 'step2'
        kczdpk(this.ksid).then(res => {
          if (parseInt(res.status) === 200) {
            this.$notify({
              title: '成功',
              message: '排考成功',
              type: 'success',
              duration: 2000
            });
          } else {
            this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
          }
          this.checkStep();
        });
      },
      checkStep() {
        getKcxsxxByKskcid({ ksid: this.ksid }).then(res => {
          if (res.data.length > 0) {
            this.step = 'step3';
          } else {
            this.step = 'step1';
          }
        });
      },
      ckpkjg() {
        this.$emit('ee', 6)
      }
    },
    props: {
      bjList: {
        /** 班级级类型列表数据**/
        type: Array,
        required: true
      },
      kcList: {
        /** 课程级类型列表数据**/
        type: Array,
        required: true
      }
    }
  }
</script>
<style scope>
  .view{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
