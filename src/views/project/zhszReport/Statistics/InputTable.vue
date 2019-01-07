<!-- 教师录入信息 -->
<template>
  <div class="">
      <el-form ref="form" :model="formtable" label-width="80px">
        <div class="cqjz box">
          <label for="">出勤记载</label>
          <!-- <el-input v-model="input" placeholder="请输入内容"></el-input> -->
          <div class="cqjz_box">
            应出勤 <el-input size="mini" style="width: 50px;" v-model="formtable.ycqts" placeholder="请输入内容" :maxlength="2"></el-input> 天,
            事假 <el-input size="mini" style="width: 50px;" v-model="formtable.sjts" placeholder="请输入内容" :maxlength="2"></el-input> 天,
            病假 <el-input size="mini" style="width: 50px;" v-model="formtable.bjts" placeholder="请输入内容" :maxlength="2"></el-input> 天,
            旷课 <el-input size="mini" style="width: 50px;" v-model="formtable.kks" placeholder="请输入内容" :maxlength="2"></el-input> 节,
            迟到及早退 <el-input size="mini" style="width: 50px;" v-model="formtable.cdzts" placeholder="请输入内容" :maxlength="2"></el-input> 节
          </div>
        </div>
        <div class="jcjl box info">
          <label for="">奖惩记载</label>
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 9}"
            placeholder="请输入内容"
            :maxlength="200"
            v-model="formtable.jcjz">
          </el-input>
        </div>
        <div class="bzrjy box info">
          <label for="">班主任寄语</label>
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 5}"
            placeholder="请输入内容"
            :maxlength="200"
            v-model="formtable.bzrjy">
          </el-input>
        </div>
        <div class="fy box info">
          <label for="">附言</label>
          <el-input
            @blur="blurs"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 9}"
            placeholder="请输入内容"
            :maxlength="200"
            v-model="formtable.fy">
          </el-input>
        </div>
      </el-form>
  </div>
</template>
<script>
 export default {
   data () {
     return {
      textarea3:'',
      input: '',
      form: {
        // uuid: '',
        // bgdid: '',
        // xh: '',
        // xm: '',
        // bjid: '',
        // bjmc: '',
        // ycqts: 0,
        // sjts: 0,
        // bjts: 0,
        // kks: 0,
        // cdzts: 0,
        // sg: 0,
        // tz: 0,
        // zysl: 0,
        // yysl: 0,
        // jcjz: '',
        // bzrjy: '',
        // fy: ''
      }
     }
   },
   props: {
    formtable: Object
   },
   methods: {
    blurs(){
      
    }
   }
 }
</script>
<style lang="scss" scoped>
  .main_box{
    /* height: 550px; */
    border: 1px solid #eee;
  }
  .box{
    padding: 5px;
  }
  .info{
    /* height: 300px; */
  }
  .cqjz{
    .cqjz_box{
      width: 100%;
      height: 50px;
      font-size: 14px;
      line-height: 50px;
    }
  }
  .jcjl{
    
  }
  .bzrjy{

  }
  .fy{

  }
</style>