<template>
  <div id="app">

    <div class="view">

    <div class="oarow">
      <el-row>
        <el-button type="primary" :disabled="changeSure"  @click="save" >保存</el-button>
        <el-button type="primary" :disabled="changeSure"  >保存并添加</el-button>
        <el-button type="primary" @click="handleGoback" >返回</el-button>
      </el-row>
    </div>
    <el-form :model="form"  ref="form" label-width="150px">

      <el-form-item label="课程名称" prop="kcmc" resetField :rules="[{ required: true, message: '课程名称不能为空'}]">
        <el-input   v-model="form.kcmc"  placeholder="请输入课程名称" ></el-input>
      </el-form-item>

      <el-form-item label="课程类别" prop="kclb"  style="width:500px">
        <el-select placeholder="请选择" v-model="form.kclb">
          <el-option v-for="item in  itemList_1" :key="item.lbid" :label="item.lbid" :value="item.lbmc"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="授课教师"  prop="skr"  :rules="[{ required: true, message: '授课教师不能为空'}]">
        <el-input placeholder="请选择老师" v-model="skr"   @focus="selTeacher"><i slot="suffix" class="el-input__icon el-icon-more"></i></el-input>
      </el-form-item>

      <el-form-item label="授课日期"    prop="skksrq|skjsrq"     :rules="[{ required: true, message: '授课日期不能为空'}]">
          <el-date-picker v-model="form.skksrq" type="date" placeholder="选择日期"  :rules="[{ required: true, message: '授课开始日期不能为空'}]" ></el-date-picker>
          <span class='padding_transverse_10'>至</span>
          <el-date-picker v-model="form.skjsrq" type="date" placeholder="选择日期"  :rules="[{ required: true, message: '授课结束日期不能为空'}]" ></el-date-picker>
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
                              <div v-for=" bjdmitem  in  item.checkedArr "  :key="bjdmitem" style=" white-space:nowrap;">
                                <p   v-for=" bj  in  item.bjxx "   v-if="bj.bjdm==bjdmitem "    :key="bj.bjdm">{{bj.bjmc}} ,</p>
                             </div>
                         </div>
            </div>
            

            <div class="skLine">
              <div class="skLeft skdx">测试：一年级:</div>
              <div class="skRight skdx">测试：1班、2班</div>
            </div>

          

            
            
          </div>
      </el-form-item>

      <el-form-item label="限制人数"    :rules="[{ required: true, message: '限制人数不能为空'}]">
          <el-input  v-model="form.xzrs"         style="width:55px;margin:0 5px;"></el-input><span style="padding-right:20px;">人</span>  
          <span>最低人数</span><el-input   v-model="form.zdrs"     style="width:55px;margin:0 5px;"></el-input><span style="padding-right:20px;">人</span> 
          <span>每个年级限报人数</span><el-input  v-model="form.njxbrs"  style="width:55px;margin:0 5px;"></el-input><span style="padding-right:20px;">人</span> 
          <span>每个班级限报人数</span><el-input  v-model="form.bjxbrs" style="width:55px;margin:0 5px;"></el-input><span>人</span> 
      </el-form-item>

      <el-form-item label="性别限制">
          <el-radio v-model="form.xbxz" label="0">无限制</el-radio>
          <el-radio v-model="form.xbxz" label="1">男</el-radio>
          <el-radio v-model="form.xbxz" label="2">女</el-radio>
      </el-form-item>

      <el-form-item label="课程简介">
	    <div class="oaeditor">
          <quill-editor ref="myTextEditor"  
          :content="content"
          :options = "editorOption"  
          @change="onEditorChange($event)">
         </quill-editor>  
         </div>
         
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
                <el-checkbox-group v-model="item.checkedArr" @change="handleCheckedChange">
                  <el-checkbox v-for="(teacher,i) in item.teachers" :key="(index + i)" :label="teacher.zgh">{{teacher.xm}}</el-checkbox>
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
      <table class='selTeachTime' id='selTeachTime' cellpadding="0" cellspacing="0">
        <tr>
          <th></th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th><th>周日</th>
        </tr>
        <tr section='1'>
          <th>
            第一节
          </th>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr section='2'>
          <th>
            第二节
          </th>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr section='3'>
          <th>
            第三节
          </th>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr section='4'>
          <th>
            第四节
          </th>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr section='5'>
          <th>
            第五节
          </th>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr section='6'>
          <th>
            第六节
          </th>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr section='7'>
          <th>
            第七节
          </th>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr section='1'>
          <th>
            第八节
          </th>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <th>
            第九节
          </th>
          <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
      </table>
    </el-dialog>
  

  </div>
</template>

<script>
import $ from 'jquery'
import { quillEditor } from 'vue-quill-editor'
import { getAll,saveaddkcxx  } from 'api/xkxt/kcxxManager/index'
import {dqxnxqObj } from 'api/xkxt/specialRaw/index'
import { getXXMess } from 'api/dict'
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
    
     let sksj =[];
     var that = this;
     $(document).on("click",".selTeachTime td",function(){
     
       sksj =[];
       if($(this).hasClass("ck")){
         $(this).removeClass("ck");

       }else{
         $(this).addClass("ck");

       }

        $(".selTeachTime .ck").each(function(){
          //$(document).on("click",".selTeachTime .ck",function(){
          var section_s= $(this).closest("tr").index() ;
          var week_s= $(this).index();   
          sksj.push({week:week_s,section:section_s,xxdm:this.xxdm,kcdm:this.kcdm});
        })
        that.sksjlist = sksj;
      
     })
  },
  created(){

        this.kcdm=this.guid();
        this.xxdm = window.localStorage.getItem("xxdm");
        dqxnxqObj({xxdm: this.xxdm}).then(response => {
             this.xndm = response.xn;//当前学年
             this.xqdm = response.xq;//当前学期
             let param={
                  xxdm:this.xxdm,
                  xndm:this.xndm,
                  name:this.teaxm,
                  bjmc:this.bjmc
             }
            this.getTea(param);
            
        })
      


        
    },
  methods:{

  //保存
  save(){//??????????????????????????????/
     this.changeSure=true;

              let parm={
                             kcdm: this.kcdm,
                             kclb:this.kclb,
                             kcmc:this.kcmc,
                             skr:this.skr,
                             skksrq:this.skksrq,
                             skjsrq:this.skjsrq,
                             xzrs:this.xzrs,
                             zdrs:this.zdrs,
                             njxbrs:this.njxbrs,
                             bjxbrs:this.bjxbrs,
                             xbxz:this.xbxz,
                             kcjj:this.kcjj,
                             xndm: this.dqxn,
                             xqdm: this.dqxq,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                             xxdm: this.xxdm
                            
                        }
                       
                     copykc(parm).then((res) => {
                      
                      
                         if (res.status == '200') {
                                       this.getList();
                                       this.dialog_3 = false;//复制课程弹层隐藏
                                       this.$notify({ title: '成功', message: '课程复制成功', type: 'success', duration: 2000 });
                                      // this.$notify({ title: '复制失败', message: res.message+' 已存在，复制失败', type: 'error', duration: 2000 });
                         }else{
                             this.$notify({ title: '复制失败', message: res.message+' 已存在，复制失败', type: 'error', duration: 2000 });
                         }

                     })
      





    console.log(this.sksjlist);
    console.log(this.skdxlist);
    console.log(this.skrlist);
  









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
              path: '/baseManager/kcxxManager',
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
    handleCheckedChange(value) {
         
        // this.checkedList_1.push(value);//选中的老师职工号数组?????????????????????/

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
      this.dialog_1 = false;//???????????????????????????????????//

            for (var j = 0; j <  this.dataSet.length ;j++) {
                   
                     let map=this.dataSet[j];
                    
                     let check_skr=map.checkedArr;//选中的授课人的zgh;


                     if(check_skr.length>0){
                          for (var i = 0; i <  check_skr.length ;i++) {
                               let param={};
                               param.xxdm=this.xxdm;
                               param.kcdm=this.kcdm;
                               param.skr=check_skr[i];
                               this.skrlist.push(param);
                          }

                      }
            }
            console.log(this.skrlist);
             console.log(this.guid());

    } ,
    //确定班级
    qdBj(){//???????????????????????????
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
                                for (var k = 0; k <  bjxx.length ;k++) {
                                    if(checkbj[i]==bjxx[k].bjdm){
                                         param.bjmc= bjxx[k].bjmc;
                                    }
                                }
                                this.skdxlist.push(param);

                          }

                      }


            }
    },
    setbj(){
      this.dialog_3 = true;
    },
    //搜索
    searchBj(){//????????????
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

