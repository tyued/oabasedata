<template>
  <div id="app">

    <div class="view">

    <div class="oarow">
      <el-row>
        <el-button type="primary" @click="handleGoback" >返回</el-button>
      </el-row>
    </div>
    <el-form :model="form"  ref="form" label-width="150px">
      <el-form-item label="学年学期"     >
        {{ckxndm}}  {{ckxqmc}}
      </el-form-item>
      <el-form-item label="课程名称"  >
              {{kcmc}}
      </el-form-item>

      <el-form-item label="课程类别"  style="width:500px">
            {{lbmc}}
      </el-form-item>

      <el-form-item label="授课教师"   >
        {{skr}}
      </el-form-item>

      <el-form-item label="授课日期"    >
          {{skksrq}} <span class='padding_transverse_10'>至</span> {{skjsrq}}
      </el-form-item>


      <el-form-item label="授课时间/地点"   >

          <div class="oarow" >

              <div class="skTit">
                   <div class="skLeft">授课时间(星期/节次)</div>
                   <div class="skRight">授课地点</div>
                </div>
              <div class="skCont">
              <div class="skLine"   v-for="(item,index) in sksjlist" :key="index" >
                 <div class="skLeft">星期{{item.week|capitalize}}第{{item.section}}节</div>
                             {{item.cdmc}}
                 <div class="skRight">
                 </div>
               </div>
            </div>
          </div>

      </el-form-item>

      <el-form-item label="授课对象">
          <div class="oarow skdxmain" >
              <div class="skLine"    v-for="(item,index) in njSet"  v-if="item.checkedArr.length>0"    :key="index" >
                    <div class="skLeft skdx">{{item.title}}:</div>
                    <div class="skRight skdx" >
                         <span v-for=" bj  in  item.checkedArr "   :key="bj.bjdm" class='padding_transverse_10'>{{bj.bjmc}}</span>
                    </div>
              </div>
          </div>
      </el-form-item>

      <el-form-item label="限制人数"    :rules="[{ required: true, message: '限制人数不能为空'}]">
          <el-input  v-model="xzrs"         style="width:55px;margin:0 5px;"></el-input><span style="padding-right:20px;">人</span>
          <span>最低人数</span><el-input  readonly=""  v-model="zdrs"   maxlength="9"  style="width:55px;margin:0 5px;"></el-input><span style="padding-right:20px;">人</span>
          <span>每个年级限报人数</span><el-input readonly="" v-model="njxbrs" maxlength="8" style="width:55px;margin:0 5px;"></el-input><span style="padding-right:20px;">人</span>
          <span>每个班级限报人数</span><el-input readonly=""  v-model="bjxbrs" maxlength="7" style="width:55px;margin:0 5px;"></el-input><span>人</span>
      </el-form-item>

      <el-form-item label="性别限制">
           <span  >{{xbxz}}</span>
      </el-form-item>
            <el-form-item label="课程简介">
              <el-input
                maxlength="450"
                type="textarea"
                :rows="5"
                placeholder=""
                v-model="kcjj" readonly>
              </el-input>
          </el-form-item>

      <el-form-item label="相关图片">
           <div >
               <ul class="el-upload-list el-upload-list--picture-card">
                 <li tabindex="0" class="el-upload-list__item is-success"  v-for="(item,index) in submitImgArr" :key="index" >
                        <img :src="imgsrc(item.path)"  alt="" class="el-upload-list__item-thumbnail">
                        <a class="el-upload-list__item-name"><i class="el-icon-document"></i>63d9f2d3572c11df78dfc7d0692762d0f703c233.jpg</a>
                        <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i></label>
                        <i class="el-icon-close"></i><i class="el-icon-close-tip">按 delete 键可删除</i>
                        <!----><span class="el-upload-list__item-actions">
                                  <span class="el-upload-list__item-preview"><i class="el-icon-zoom-in" @click="preview(item.path)"></i></span>
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
import { quillEditor } from 'vue-quill-editor'
import { getAll,ck } from 'api/xkxt/kcxxManager/index'
import {dqxnxqObj} from 'api/xkxt/specialRaw/index'
export default {
  name: 'App',
   components: {
        quillEditor
   },
   data() {
    return {
         form:{},//表单
        dataSet:[],
        njSet:[],
        teaxm:'',//教师姓名筛选
        bjmc:'',//班级筛选
        itemList_1: [],//课程类别
        jsxxlist:[],//教师列表
        cdxxlist:[],//场地信息
        njxxlist:[],//年级列表
        bjxxlist:[],//班级列表
        textarea_1:"",
        dialog_1:false,
        dialog_2:false,
        dialog_3:false,
        moreset:false,
        changeSure:false,   //防止重复提交
        xndm:'',
        xqdm:'',
        xxdm:'',
        sksjlist: [],//授课时间
        skdxlist: [],//授课时间
        skrlist:[],//授课人
        kcdm:'',
        skr:"",//授课教师名字
        kcmc:"",
        skksrq:"",//授课开始时间
        skjsrq:"",//授课结束时间
        xzrs:"",
        zdrs:"",
        njxbrs:"",
        bjxbrs:"",
        xbxz:"0",
        kcjj:"",
        kclb:"",
        lbmc:"",
        submitImgArr:[],
        tplj:"",
        dialogVisible:false,
        dialogImageUrl:"",
        ckxndm:"",//查看学年代码
        ckxqmc:"",//查看学期名称

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
         dqxnxqObj({xxdm: this.xxdm}).then(response => {
              this.xndm = response.xn;//当前学年
              this.xqdm = response.xq;//当前学期
              this.getParams();

         })
    },
  methods:{

   imgsrc(data){
         let path=this.tplj+data;
         return path;

   },
   getParams () {  //获取传过来的kcdm
        // 取到路由带过来的参数
         let kcdm_ = this.$route.params.kcdm;
        // 将数据放在当前组件的数据内
          this.kcdm = kcdm_;
          let param={
                  xxdm:this.xxdm,
                  kcdm:this.kcdm,
                  xndm:this.xndm
             }
           this.njSet=[];
          ck(param).then(response => {//获取所有列表信息
              this.skdxlist=response.skdxlist;
              this.skrlist=response.skrlist;
              this.sksjlist=response.sksjddlist;
              let  kcxx=response.kcxx;
              this.njxxlist=response.njxxlist;//年级列表
              this.submitImgArr=response.fjxxlist;//附件
              this.tplj=response.tplj;
              //课程内容
              for (var j = 0; j <  kcxx.length ;j++) {
                  let map=kcxx[j];
                  this.skr=map.skr;//?????????????
                  this.kcmc=map.kcmc;
                  this.lbmc=map.lbmc;

                  this.skksrq=map.skksrq;
                  this.skjsrq=map.skjsrq;
                  this.xzrs=map.xzrs;
                  this.zdrs=map.zdrs;
                  this.njxbrs=map.njxbrs;
                  this.bjxbrs=map.bjxbrs;
                  this.kcjj=map.kcjj;
                  this.lbmc=map.lbmc;
                  let xbxz=map.xbxz;
                  if(xbxz=="0"){
                    this.xbxz="无限制"
                  } else if(xbxz=="1"){
                    this.xbxz="男"
                  }else{
                    this.xbxz="女"
                  }
                 this.ckxndm=map.xndm;
                 let xqmc=map.xqdm;
                 if( xqmc=="01"){
                   this.ckxqmc="上学期";
                 }else{
                   this.ckxqmc="下学期";
                 }
              }
              //授课人
               let skr_="";
               for (var j = 0; j <  this.skrlist.length ;j++) {
                      skr_+=" "+this.skrlist[j].xm;
               }
               this.skr=skr_;
               //班级授课对象处理
                  for (var j = 0; j <  this.njxxlist.length ;j++) {
                            let map=response.njxxlist[j];
                            let params_={};
                            params_.title=map.njmc;
                            params_.njdm=map.njdm;
                            params_.checkedArr=[];

                            for (var k = 0; k < this.skdxlist.length ;k++) {

                                      let bjmap=this.skdxlist[k];
                                      let  bjdm_=bjmap.bjdm;
                                      let  njdm_=bjmap.njdm;
                                      let  bjmc_=bjmap.bjmc;

                                      if(njdm_==map.njdm){
                                              params_.checkedArr.push({bjdm:bjdm_,bjmc:bjmc_,njdm:njdm_});
                                       }
                             }
                            this.njSet.push(params_);
                   }

           })
       },
      //预览图片
     preview(data){
       this.dialogImageUrl="";
       this.dialogImageUrl=this.tplj+data;
       this.dialogVisible=true;
     },
    //筛选老师
    getTea(param){
           this.dataSet=[];
           this.njSet=[];
        getAll(param).then(response => {//获取所有列表信息

                    this.jsxxlist=response.jsxxlist;//教师列表
                    this.itemList_1=response.kclblist;//课程类别
                    this.cdxxlist=response.cdxxlist//场地信息
                    this.njxxlist=response.njxxlist//年级列表
                    this.bjxxlist=response.bjxxlist//班级列表
                   //教师页面
                   for (var index = 0; index <  response.jsxxtitle.length ;index++) {
                            let map=response.jsxxtitle[index];
                            let params={};
                            params.title=map.ename;
                            params.total=map.name;
                            params.checkedArr=[];
                            params.teachers=[];

                            for (var i = 0; i <  this.jsxxlist.length ;i++) {
                                      let tea=this.jsxxlist[i];
                                      let zgh_=tea.ename;
                                      let xm_=tea.name;

                                      if(tea.fdm==map.ename){
                                              params.teachers.push({zgh:zgh_,xm:xm_});
                                       }
                             }
                            this.dataSet.push(params);
                   }
                   //班级页面处理
                  for (var j = 0; j <  this.njxxlist.length ;j++) {
                            let map=response.njxxlist[j];
                            let params_={};
                            params_.title=map.njmc;
                            params_.njdm=map.njdm;
                            params_.checkedArr=[];
                            params_.bjxx=[];
                            for (var k = 0; k < this.bjxxlist.length ;k++) {
                                      let bjmap=this.bjxxlist[k];
                                      let  bjdm_=bjmap.bjdm;
                                      let  njdm_=bjmap.njdm;
                                      let  bjmc_=bjmap.bjmc;
                                      if(njdm_==map.njdm){
                                              params_.bjxx.push({bjdm:bjdm_,bjmc:bjmc_,njdm:njdm_});
                                       }
                             }
                            this.njSet.push(params_);
                   }

        })
    },
    // 返回
     handleGoback(){
          this.$router.push ({
              path: '/auditKcxx/kcxxManager',
              name:'课程开设'
          })
    },
    //选择教师
    selTeacher(){
      this.dialog_1 = true;
    },
    //取消 选泽老师
    cancelTea(){
      this.dialog_1 = false;
      this.dialog_3 = false;
    } ,
    S4(){
             return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
       },
     guid() {
         return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
     },
    //确定 选择老师
     qdTea(){
            this.dialog_1 = false;
            this.skr="";
            for (var j = 0; j <  this.dataSet.length ;j++) {
                     let map=this.dataSet[j];
                     let jsmap=map.teachers;
                     let check_skr=map.checkedArr;//选中的授课人的zgh;
                     if(check_skr.length>0){

                        for (var k = 0; k <  jsmap.length ;k++) {
                             for (var i = 0; i <  check_skr.length ;i++) {
                                    let param={};
                                    param.xxdm=this.xxdm;
                                    param.kcdm=this.kcdm;
                                    param.skr=check_skr[i];
                                    if(jsmap[k].zgh==check_skr[i]){
                                        this.skr+=jsmap[k].xm+",";
                                        this.skrlist.push(param);
                                    }
                             }
                        }

                     }
            }
    } ,
    //确定班级
    qdBj(){
            this.dialog_3 = false;
            for (var j = 0; j <  this.njSet.length ;j++) {
                     let njmap=this.njSet[j];
                     let njdm=njmap.njdm;
                     let njmc=njmap.title;
                     let checkbj=njmap.checkedArr;
                     let bjxx=njmap.bjxx;
                     if(checkbj.length>0){
                          for (var i = 0; i <  checkbj.length ;i++) {
                                let param={};
                                param.njmc=njmc;
                                param.njdm=njdm;
                                param.bjdm=checkbj[i];
                                param.kcdm=this.kcdm;
                                 param.xxdm=this.xxdm;

                                for (var k = 0; k <  bjxx.length ;k++) {
                                    if(checkbj[i]==bjxx[k].bjdm){
                                         param.bjmc= bjxx[k].bjmc;
                                         this.skdxlist.push(param);
                                    }
                                }
                          }
                      }
            }
    },
    setbj(){
      this.dialog_3 = true;
    },
    //搜索
    searchBj(){
        let param={
                  xxdm:this.xxdm,
                  xndm:this.xndm,
                  name:this.teaxm,
                  bjmc:this.bjmc
         }
        this.getTea(param);
    },
    settime(){
      this.dialog_2 = true;
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

