<template>
  <div id="app">

    <div class="view">

    <div class="oarow">
      <el-row>
        <el-button type="primary" :disabled="changeSure"  @click="save" >保存</el-button>
        <el-button type="primary" @click="handleGoback" >返回</el-button>
      </el-row>
    </div>
    <el-form :model="form"  ref="form" label-width="150px">
      <el-form-item label="学年学期"     >
        {{xndm}}  {{xqmc}}
      </el-form-item>

      <el-form-item label="课程名称"  resetField :rules="[{ required: true, message: '课程名称不能为空'}]">
        <el-input   v-model="kcmc"  maxlength="35" placeholder="请输入课程名称" ></el-input>
      </el-form-item>

      <el-form-item label="课程类别"  style="width:500px">
        <el-select placeholder="请选择" v-model="kclb">
          <el-option v-for="item in  itemList_1" :key="item.lbid" :label="item.lbmc" :value="item.lbid">{{item.lbmc}} </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="授课教师"   :rules="[{ required: true, message: '授课教师不能为空'}]">
        <el-input placeholder="请选择老师" v-model="skr" :readonly="true"  @focus="selTeacher"><i slot="suffix" class="el-input__icon el-icon-more"></i></el-input>
      </el-form-item>

      <el-form-item label="授课日期"    >
          <el-date-picker v-model="skksrq" type="date" placeholder="选择日期"  ></el-date-picker>
          <span class='padding_transverse_10'>至</span>
          <el-date-picker v-model="skjsrq" type="date" placeholder="选择日期"   ></el-date-picker>

      </el-form-item>


      <el-form-item label="授课时间/地点"  prop="sksjlist" >
          <el-button icon="el-icon-setting" type="primary" @click="settime" round>设置</el-button>

          <div class="oarow" >

              <div class="skTit">
                   <div class="skLeft">授课时间(星期/节次)</div>
                   <div class="skRight">授课地点</div>
                </div>
              <div class="skCont">


              <div class="skLine"   v-for="(item,index) in sksjlist" :key="index" >

                <div class="skLeft">星期{{item.week|capitalize}}第{{item.section}}节</div>

                <div class="skRight">
                  <el-select v-model="item.cdid" placeholder="请选择授课地点">
                    <el-option
                      v-for="index in cdxxlist"
                      :key="index.cdid"
                      :label="index.cdmc"
                      :value="index.cdid">
                    {{index.cdmc}}
                    </el-option>
                  </el-select>
                </div>
              </div>




            </div>
          </div>

      </el-form-item>


      <el-form-item label="授课对象">
          <el-button icon="el-icon-setting" type="primary" round  @click="setbj" >设置</el-button>
          <div class="oarow skdxmain" >


            <div class="skLine"    v-for="(item,index) in njSet"  v-if="item.checkedArr.length>0"    :key="index" >
              <div class="skLeft skdx">{{item.title}}:</div>
                          <div class="skRight skdx" >
                             <span v-for=" bjdmitem  in  item.checkedArr "  :key="bjdmitem" class='padding_transverse_10'>
                                <span v-for=" bj  in  item.bjxx "   v-if="bj.bjdm==bjdmitem "    :key="bj.bjdm"  class='padding_transverse_10'>{{bj.bjmc}}</span>
                              </span>
                         </div>
            </div>

          </div>
      </el-form-item>

      <el-form-item label="限制人数"    :rules="[{ required: true, message: '限制人数不能为空'}]">
          <el-input  v-model="xzrs"   maxlength="6"      style="width:55px;margin:0 5px;"></el-input><span style="padding-right:20px;">人</span>
          <span>最低人数</span><el-input   v-model="zdrs"  maxlength="6"   style="width:55px;margin:0 5px;"></el-input><span style="padding-right:20px;">人</span>
          <span>每个年级限报人数</span><el-input  v-model="njxbrs" maxlength="6"  style="width:55px;margin:0 5px;"></el-input><span style="padding-right:20px;">人</span>
          <span>每个班级限报人数</span><el-input  v-model="bjxbrs"  maxlength="6" style="width:55px;margin:0 5px;"></el-input><span>人</span>
      </el-form-item>

      <el-form-item label="性别限制">
          <el-radio v-model="xbxz" label="0" >无限制</el-radio>
          <el-radio v-model="xbxz" label="1">男</el-radio>
          <el-radio v-model="xbxz" label="2">女</el-radio>
      </el-form-item>

      <!--编辑器begin  -->
         <el-form-item label="课程简介">
              <el-input
                maxlength="450"
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model="kcjj">
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
                                        <span class="el-upload-list__item-delete"> <i class="el-icon-delete" @click="remove(item.fjid)" ></i></span>
                                    </span>
                        </li>
                    </ul>
              </div>
              <el-dialog :visible.sync="dialogVisibleS">
                    <img width="100%" :src="dialogImageUrlS" alt="">
              </el-dialog>

                <el-upload
                    name="file"

                    ref="newupload"
                    :on-change="beforeUpload"
                    :on-success="handleSuccess"
                    :headers="importHeaders"
                    accept=".jpg,.png"
                    action="/api/admin/kcxx/sctpS"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                 </el-upload>
                 <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
        </el-form-item>

    </el-form>

    </div><!--view结尾-->


    <el-dialog title="教师名单" :visible.sync="dialog_1" width="870px">
      <el-row>
        <el-button type="primary" @click="qdTea">确定</el-button>
        <el-button type="primary" @click="cancelTea">取消</el-button>

        <el-input placeholder="查询老师" style="float:right; width:200px;"  v-model="teaxm"  ><i slot="suffix" class="el-input__icon el-icon-search" @click="searchTea" ></i></el-input>
       </el-row>
        <div class="teachListAZ">
          <el-collapse v-model="activeName">
            <el-collapse-item v-for="(item,index) in dataSet" :key="index" :name="index" class="collapseItem">
              <template slot="title">
                {{item.title}}({{item.checkedArr.length}}/{{item.total}})
              </template>
              <div class="teachcheckList">
                <el-checkbox-group v-model="item.checkedArr" >
                  <el-checkbox v-for="(teacher,i) in item.teachers" :key="(index + i)"  :jsxm="teacher.xm"   :label="teacher.zgh">{{teacher.xm}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
    </el-dialog>



    <el-dialog title="班级名单" :visible.sync="dialog_3" width="870px">
      <el-row>
        <el-button type="primary" @click="qdBj">确定</el-button>
        <el-button type="primary" @click="cancelTea">取消</el-button>

        <el-input placeholder="请输入班级名称" style="float:right; width:200px;"  v-model="bjmc"  ><i slot="suffix" class="el-input__icon el-icon-search" @click="searchBj" ></i></el-input>
      </el-row>

        <div class="teachListAZ">
          <el-collapse v-model="activeName">
            <el-collapse-item v-for="(item,index) in njSet"  v-if="item.bjxx.length>0"   :key="index" :name="index" class="collapseItem">
              <template slot="title">
                {{item.title}}({{item.checkedArr.length}}/{{item.bjxx.length}})
              </template>
              <div class="teachcheckList">
                <el-checkbox-group v-model="item.checkedArr" @change="handleCheckedChange">
                  <el-checkbox v-for="(bj ) in item.bjxx "       :key="bj.bjdm" :label="bj.bjdm">{{bj.bjmc}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
    </el-dialog>


    <el-dialog title="选择时间" :visible.sync="dialog_2" width="870px">
      <table class='selTeachTime' ref="selteachtime" id='selTeachTime' cellpadding="0" cellspacing="0">

        <tr>
          <th></th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th><th>周日</th>
        </tr>
        <tr v-for="i in 9"  :key="i" >
          <th>
            第{{i|capitalize2}}节
          </th>
          <td v-for="index in 7"  :key="index"    v-on:click="addClassFun(i,index,$event)"  class=""  ></td>
        </tr>
      </table>
    </el-dialog>


  </div>
</template>

<script>
  import { getToken } from 'utils/auth';
import $ from 'jquery'
import { quillEditor } from 'vue-quill-editor'
import { getAll,saveaddkcxx ,ck ,savexg} from 'api/xkxt/kcxxManager/index'
import {dqxnxqObj } from 'api/xkxt/specialRaw/index'
export default {
  name: 'App',
   components: {
        quillEditor
   },
   data() {
    return {
         userid:"",
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
        kclb:"",
        textarea_1:"",
        dialog_1:false,
        dialog_2:false,
        dialog_3:false,
        dialog_4:false,
        dialog_5:false,
        activeName:1,
        checklist_1:['张老师', '王老师', '沈老师', '吴老师'],
        checklist_2:[],
        checklist_3:[],
        checklist_4:['选中且禁用'],
        checkedList_1:[],//选中的老师职工号数组
        moreset:false,
        content: '<h2>I am Example</h2>',
        editorOption: {},
        changeSure:false,   //防止重复提交
        xndm:'',
        xqdm:'',
        xqmc:"",
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
        xbxz:"",
        kcjj:"",
        tempfjid:"",//临时附件id
        dataImgArr: [],
        submitImgArr: [],
        tplj:"",
        dialogVisibleS: false,//自定义
        dialogImageUrlS:"",//自定义
        dialogImageUrl: '',  //图片上预览自带
        dialogVisible: false,//图片上传自带
       importHeaders:{
        enctype:'multipart/form-data',
        Authorization : getToken()
       },


    }
  },
  filters: {
    //页面数据处理
  capitalize: function (value) {
    const arr = ["","一","二","三","四","五","六","日"];
    return arr[value];
  },
    capitalize2: function (value) {
      const arr = ["","一","二","三","四","五","六","七","八","九"];
      return arr[value];
    }

},
  mounted: function(){


  },

  created(){
              this.userid= window.localStorage.getItem("userid");
              this.kcdm = this.$route.params.kcdm; // 取到路由带过来的参数
              this.xxdm = window.localStorage.getItem("xxdm");
              dqxnxqObj({xxdm: this.xxdm}).then(response => {
                  this.xndm = response.xn;//当前学年
                  this.xqdm = response.xq;//当前学期
                   this.xqmc= response.xqmc;
                  let param={
                    kcdm:this.kcdm,
                    xxdm:this.xxdm,
                    xndm:this.xndm,
                    name:this.teaxm,
                    bjmc:this.bjmc
                    }
                this.getTea(param);

              })

    },

 methods:{
       imgsrc(data){
         let path=this.tplj+data;
         return path;

        },
   addClassFun: function(section_s,weeks_s,e) {

     let classname= e.target.getAttribute("class");
     if(classname===""||classname==null){
       e.target.setAttribute("class","ck");
       this.sksjlist.push({week:weeks_s,section:section_s,xxdm:this.xxdm,kcdm:this.kcdm});
     }else{
       e.target.setAttribute("class","");
       let sksj =[];
       for (var i = 0; i <  this.sksjlist.length ;i++) {
         let map= this.sksjlist[i];
         let week=parseInt(map.week);
         let section=parseInt(map.section);

         if(weeks_s==week&&section_s==section){

         }else{
           sksj.push(map);
         }
       }
       this.sksjlist= sksj;
     }

   },
      //上传图片成功
       handleSuccess: function (response, file, fileList) {
               // console.log(response.data[0].path);
                let path_=response.data[0].path;
                let parm={
                  fjid:this.tempfjid,
                  path:path_,
                  kcdm:this.kcdm,
                  xxdm:this.xxdm
                }
                this.submitImgArr.push(parm);
                this.$refs.newupload.clearFiles();//清空图片


      },

      beforeUpload (file) {
        //console.log(file);
        //console.log(file.uid);
        this.tempfjid=file.uid;
      },
     //===================================
      handleRemove(file, fileList) {//删除图片
        console.log(file.uid);
        console.log(fileList);
        let del_id=file.uid;

        this.dataImgArr=[];
        for (var i = 0; i <  this.submitImgArr.length ;i++) {
               let map= this.submitImgArr[i];
               let fjid=map.fjid;
               if(fjid!=del_id){
                  dataImgArr.push(map);
               }
         }
         this.submitImgArr= this.dataImgArr;


      },
      handlePictureCardPreview(file) {//预览
        console.log( file.url);
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //删除图片（）
      remove(data){
        let del_id=data;
         this.dataImgArr=[];
        for (var i = 0; i <  this.submitImgArr.length ;i++) {
               let map= this.submitImgArr[i];
               let fjid=map.fjid;
               if(fjid!=del_id){
                  this.dataImgArr.push(map);
               }
         }
         this.submitImgArr= this.dataImgArr;


      },
     //预览图片(原有的)
     preview(data){
       this.dialogImageUrlS="";
       this.dialogImageUrlS=this.tplj+data;
       this.dialogVisibleS=true;
     },
     //表单验证
      checksave(){

         if( this.kcmc==""||this.kcmc==null){
             this.$message.error("课程名称不能为空");
             this.changeSure=false;
             return false;
         }
         if( this.kclb==""){
             this.$message.error("请选择课程类别");
             this.changeSure=false;
             return false;
         }
          if(this.skr==""){
             this.$message.error("请选择授课教师");
              this.changeSure=false;
             return false;
         }
          if( this.skksrq==""){
              this.$message.error("请选择授课开始日期");
               this.changeSure=false;
              return false;
         }
          if( this.skjsrq==""){
             this.$message.error("请选择授课结束日期");
             this.changeSure=false;
             return false;
          }
            let startime=this.workTime(this.skksrq);
            let endtime=this.workTime(this.skjsrq);

            // let beginDate=new Date(startime.replace(/-/g,"/"));
            // let endDate=new Date(endtime.replace(/-/g,"/"));
            if(startime>=endtime){
              this.$message.error("授课结束日期需大于开始日期");
              this.changeSure=false;
              return false;
            }
           if( this.sksjlist.length==0){
             this.$message.error("请选择授课时间");
              this.changeSure=false;
             return false;
           }
           if( this.skdxlist.length==0){
             this.$message.error("请选择授课对象");
              this.changeSure=false;
             return false;
          }
          var reg=/^-?[1-9]+[0-9]*$/;


         if (!reg.test(this.xzrs)) {
             this.$message.error("限制人数只能为大于0的整数");
              this.changeSure=false;
             return false;
          }


          if(this.zdrs!=""&&this.zdrs!=undefined&&!reg.test(this.zdrs)){
             this.$message.error("最低人数只能为空或大于0的整数");
              this.changeSure=false;
              this.changeSure=true;
             return false;
          }

          if(this.njxbrs!=""&&this.njxbrs!=undefined&&!reg.test(this.njxbrs)){
             this.$message.error("年级限报人数只能为空或大于0的整数");
              this.changeSure=false;
             return false;
          }

          if( this.bjxbrs!=""&&this.bjxbrs!=undefined&&!reg.test(this.bjxbrs)){
             this.$message.error("班级限报人数只能为空或大于0的整数");
              this.changeSure=false;
             return false;
          }

          var xzrs=parseInt(this.xzrs);
          var zdrs=parseInt(this.zdrs);
          var njxbrs=parseInt(this.njxbrs);
          var bjxbrs=parseInt( this.bjxbrs);


          if(this.zdrs!=""&&this.zdrs!=undefined&&zdrs-xzrs>0){
             this.$message.error("最低人数人数不能大于限制人数");
              this.changeSure=false;
             return false;
          }
          if(this.njxbrs!=""&&this.njxbrs!=undefined&&njxbrs-xzrs>0){
             this.$message.error("年级限报人数不能大于限制人数");
              this.changeSure=false;
             return false;
          }
           if(this.bjxbrs!=""&&this.bjxbrs!=undefined&&bjxbrs-xzrs>0){
             this.$message.error("班级限报人数不能大于限制人数");
              this.changeSure=false;
             return false;
          }
          if(this.njxbrs!=""&&this.njxbrs!=undefined&&njxbrs-bjxbrs<0){
            this.$message.error("年级限报人数不能小于班级限报人数");
             this.changeSure=false;
             return false;
          }
        return true;

      },
    //保存
      save(){
             this.changeSure=true;
             this.skrlist_demo();//数据组装处理
             this.skdxlist_demo();//数据组装处理
              let parm={
                             cjr:this.userid,
                             kcdm: this.kcdm,
                             kclb:this.kclb,
                             kcmc:this.kcmc,
                             skr:this.skr,
                             xzrs:this.xzrs,
                             zdrs:this.zdrs,
                             njxbrs:this.njxbrs,
                             bjxbrs:this.bjxbrs,
                             xbxz:this.xbxz,
                             kcjj:this.kcjj,
                             xndm: this.xndm,
                             xqdm: this.xqdm,
                             xxdm: this.xxdm,
                             sksjlist:this.sksjlist,
                             skdxlist:this.skdxlist,
                             skrlist:this.skrlist,
                             submitImgArr:this.submitImgArr,

                        }
                        parm.skksrq = this.workTime(this.skksrq);
                        parm.skjsrq = this.workTime(this.skjsrq);
                      if(this.checksave()) {

                            savexg(parm).then((res) => {
                                if (res.status == '200') {
                                              this.$notify({ title: '修改成功', message: '修改成功', type: 'success', duration: 2000 });
                                              this.$router.push('/auditKcxx/kcxxManager');
                                }else{
                                    this.changeSure=false;
                                    this.$notify({ title: '修改失败', message: res.message, type: 'error', duration: 2000 });
                                }

                            })
                      }

  },
   // 表格中日期2000-01-01
        workTime(val){
            var d = new Date(val);              //时间戳
            var year = d.getFullYear();
            var month = d.getMonth()+1;
            var day = d.getDate();
            if(month<10) month = "0" + month;
            if(day<10) day = "0" + day
            return year + '-' + month + '-' + day
        },
    //搜索老师
    searchTea(){

           let param={
                  xxdm:this.xxdm,
                  xndm:this.xndm,
                  name:this.teaxm,
                  bjmc:this.bjmc
             }
        this.getTea(param);


    },
    //筛选老师
    getTea(param){
           this.dataSet=[];
           this.njSet=[];
         ck(param).then(response => {//获取所有列表信息



                    this.skdxlist=response.skdxlist;
                    this.skrlist=response.skrlist;
                    this.sksjlist=response.sksjddlist;
                    let  kcxx=response.kcxx;
                    this.submitImgArr=response.fjxxlist;//附件
                    this.tplj=response.tplj;
                    //授课时间地点选中

                    //课程内容
                    for (var j = 0; j <  kcxx.length ;j++) {
                        let map=kcxx[j];
                        this.skr=map.skr;
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
                        this.kclb=map.kclb;
                        this.xbxz=map.xbxz;
                        this.kcjj=map.kcjj;

                    }

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

                            //教师信息
                            for (var i = 0; i <  this.jsxxlist.length ;i++) {
                                      let tea=this.jsxxlist[i];
                                      let zgh_=tea.ename;
                                      let xm_=tea.name;

                                      if(tea.fdm==map.ename){
                                              params.teachers.push({zgh:zgh_,xm:xm_});
                                              //授课人选中
                                              for (var j = 0; j <  this.skrlist.length ;j++) {
                                                let check_skr=this.skrlist[j].skr;
                                                if(zgh_==check_skr){
                                                    params.checkedArr.push(check_skr);
                                                  }

                                               }
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
                            //授课对象选中
                            for (var k = 0; k < this.skdxlist.length ;k++) {

                                      let bjmap=this.skdxlist[k];
                                      let  bjdm_=bjmap.bjdm;
                                      let  njdm_=bjmap.njdm;
                                      let  bjmc_=bjmap.bjmc;

                                      if(njdm_==map.njdm){
                                              params_.checkedArr.push(bjdm_);
                                       }
                             }
                            // 年级下班级信息
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


    onEditorBlur(editor) {
      console.log('editor blur!', editor)
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor)
    },
    onEditorReady(editor) {
      console.log('editor ready!', editor)
    },
    onEditorChange({ editor, html, text }) {

      console.log('editor change!', editor, html, text)
      this.content = html

    },
    tc1(){
      this.dialog_1 = true;
    },
    tc2(){
      this.dialog_2 = true;
    },
    tc3(){
      this.dialog_3 = true;
    },
    tc4(){
      this.dialog_4 = true;
    },
    tc5(){
      this.dialog_5 = true;
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
      this.skrlist_demo();//授课教师数据处理
    } ,
    skrlist_demo (){
       this.skr="";
       this.skrlist=[];
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
                                        this.skr+=jsmap[k].xm+" ";
                                        this.skrlist.push(param);
                                    }


                                }

                        }

                  }
            }
    },
    //确定班级
    qdBj(){
        this.dialog_3 = false;
        this.skdxlist_demo();

    },
    //授课对象数据处理
    skdxlist_demo(){
       this.skdxlist=[];
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
    //
    settime(){
      this.dialog_2 = true;
        //默认选中
        this.$nextTick(function(){

             let that=this;
            $(".selTeachTime td").each(function(){

              let section_s= $(this).closest("tr").index() ;
              let week_s= $(this).index();
              //授课时间地点选中
              for (var i = 0; i <  that.sksjlist.length ;i++) {
                  let sjddmap=that.sksjlist[i];
                  let week=parseInt(sjddmap.week);
                  let section=parseInt(sjddmap.section);
                  if(section_s==section && week_s==week){
                    $(this).addClass("ck");
                  }
              }
            })
      });
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

<style scope>
  .teachListAZ{
    margin-top:20px;
    height:450px;
    overflow-y:scroll;
    overflow-x:hidden;
  }
  .collapseItem{
    border-bottom:1px solid #ccc;
  }
  .collapseItem .el-collapse-item__header{
    font-size:16px;
    padding-left:20px;
  }
  .collapseItem .el-collapse-item__content{
    padding:10px 20px;
    padding-bottom:10px;
  }
  .collapseItem:first-child,.el-collapse-item__header{
    background: linear-gradient(#FFF, #f3f3f3) !important;
  }
  .selNjStu .collapseItem:first-child,.selNjStu .el-collapse-item__header{
    background: #FFF !important;
    text-align:center;
    font-size:14px;
    font-weight: bold;
  }
  .selNjStu .el-collapse{
    border-top:none;
  }
  .selTeachTime{
    border-collapse: collapse;
    width:100%;
  }
  .selTeachTime td,.selTeachTime th{
    border:1px solid #e8e8e8;
    font-size:14px;
    text-align:center;
    line-height:35px;
    height:35px;
    width:12.5%;
    transition:.2s all;
  }
  .selTeachTime th{
    background:#f8f8f8;
  }
  .selTeachTime td.ck{
    background:#ffce39;
  }
  .selTeachTime td:hover{
    background:#f8f8f8;
    cursor:pointer;
  }
  .selTeachTime td.ck:hover{
    background:#ffce39;
  }

</style>
