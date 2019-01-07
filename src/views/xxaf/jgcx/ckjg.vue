<template>
  <div id="app">

    <div class="view">

      <div class="oarow">
        <el-row>
          <el-button type="primary" @click="handleGoback" >返回</el-button>
        </el-row>
      </div>
      <el-form :model="form"  ref="form" label-width="150px">

        <el-form-item label="巡查地点/类别"   >

          {{lbmc}}
        </el-form-item>

        <el-form-item label="巡查人员"     >
          {{cjrxm}}
        </el-form-item>

        <el-form-item label="巡查内容"  >
          {{xcnr}}
        </el-form-item>

        <el-form-item label="巡查结果"  style="width:500px">
          {{xcjg}}
        </el-form-item>

        <el-form-item label="巡查时间"   >
          {{cjsj}}
        </el-form-item>

        <el-form-item label="情况说明"    >
          {{qksm}}
        </el-form-item>

        <el-form-item label="相关图片">

          <div >
            <ul class="el-upload-list el-upload-list--picture-card">
              <li tabindex="0" class="el-upload-list__item is-success"  v-for="(item,index) in submitImgArr" :key="index" >
                <img :src="imgsrc(item.path)"  alt="" class="el-upload-list__item-thumbnail">
                <a class="el-upload-list__item-name"><i class="el-icon-document"></i>63d9f2d3572c11df78dfc7d0692762d0f703c233.jpg</a>
                <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i></label>
                <i class="el-icon-close"></i><i class="el-icon-close-tip">按 delete 键可删除</i>
                <!----><span class="el-upload-list__item-actions" @click="preview(item.path)">
                                  <span class="el-upload-list__item-preview"><!--<i class="el-icon-zoom-in" @click="preview(item.path)"></i>--></span>
                                  <span class="el-upload-list__item-delete"><!-- <i class="el-icon-delete"></i>--></span>
                              </span>
              </li>
            </ul>
          </div>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

      </el-form>

    </div><!--view结尾-->


  </div>
</template>

<script>
  import $ from 'jquery'
  import { getCkxx} from 'api/xxaf/aqsb/jgcx/index'
  export default {
    data() {
      return {
        form:{},
        xxdm:'',
        list: [],
        lbmc:'',
        cjrxm:"",
        xcnr:"",
        xcjg:"",
        cjsj:"",
        qksm:"",
        submitImgArr:[],
        tplj:"",
        dialogVisible:false,
        dialogImageUrl:"",
      }
    },
    filters: {
      //页面数据处理
      capitalize: function (value) {
        const arr = ["","一","二","三","四","五","六","日"];
        return arr[value];
      }

    },
    mounted: function(){

    },

    created(){

      this.xxdm = window.localStorage.getItem("xxdm");
      this.getParams();

    },
    methods:{

      imgsrc(data){
        let path=this.tplj+data;
        return path;

      },
      getParams () {  //获取传过来的jlid
        // 取到路由带过来的参数
        let jlid = this.$route.params.jlid;
        // 将数据放在当前组件的数据内
        let param={
          xxdm:this.xxdm,
          jlid:jlid
        }
        getCkxx(param).then(response => {//获取所有列表信息

          this.list = response.xcjglist;//（巡查结果信息）
          this.submitImgArr = response.fjlist;//附件
          this.tplj = response.imgpath;


          for (var j = 0; j < this.list.length; j++) {

            let map = this.list[j];
            this.lbmc = map.lbmc;
            this.cjrxm = map.cjrxm;
            this.xcnr = map.xcnr;
            this.cjsj = map.cjsj;
            this.qksm = map.qksm;
            let xcjg = map.xcjg;
            if (xcjg == "0") {
              this.xcjg = "异常";
            } else {
              this.xcjg = "正常"
            }

          }
        })

      },
      //预览图片
      preview(data){
        this.dialogImageUrl="";
        this.dialogImageUrl=this.tplj+data;
        this.dialogVisible=true;

      },

      // 返回
      handleGoback(){
        this.$router.push ({
          path: '/auditAqsb/jgcxManager',
          name:'结果查询'
        })
      },

      moresetting(){
        if(this.moreset){
          this.moreset = false
        }else{
          this.moreset = true
        }
      },
    }
  }
</script>

