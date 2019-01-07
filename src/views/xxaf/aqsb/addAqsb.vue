<template>
  <div id="app">

    <div class="view">
      <div class="oarow">
        <el-row>

        </el-row>
      </div>

      <el-form :model="form"  ref="form"   label-width="150px">

        <el-form-item label="巡查地点/类别"     >
          <el-input   v-model="lbmc"  placeholder=""  maxlength="10" style="width:50%"></el-input>
        </el-form-item>


        <el-form-item label="指定巡查人员"    >
          <el-input placeholder="请选择"   v-model="skr"   @focus="selTeacher" style="width:50%; "><i slot="suffix" class="el-input__icon el-icon-more"></i></el-input>
          <span>一共{{rysm}}个对象</span>
        </el-form-item>

        <el-form-item label="巡查总负责人"    >
          <el-input placeholder="请选择"   v-model="zfzrxm"   @focus="selTeacher" style="width:50%; "><i slot="suffix" class="el-input__icon el-icon-more"></i></el-input>
        </el-form-item>

      </el-form>
      <div class="oarow">
        <el-row>
          <el-button type="primary" :disabled="changeSure"  @click="save" >保存</el-button>
          <el-button type="primary" @click="handleGoback" >返回</el-button>
        </el-row>
      </div>

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



  </div>
</template>

<script>
  import { getToken } from 'utils/auth';
  import $ from 'jquery';
  import  { pagelist, getXcry,getTea,saveAqsb,delAqsb } from '@/api/xxaf/aqsb/sbsz/index'
  export default {
    name: 'App',
    components: {
    },
    data: function () {
      return {
        form: {},//表单
        dataSet: [],
        jsxxlist: [],//教师列表
        lbmc: "",
        lbid:"",
        teaxm:'',//教师姓名筛选
        zfzr:"",
        zfzrxm:"",
        cjr:"",
        rysm:"0",
        xcrylist:[],
        skr:"",
        dialog_1: false,
        dialog_2: false,
        checkedList_1: [],//选中的老师职工号数组
        moreset: false,
        changeSure: false,   //防止重复提交
        xxdm: '',
        importHeaders: {
          enctype: 'multipart/form-data',
          Authorization: getToken()
        },

      }
    },
    created(){

      this.cjr= window.localStorage.getItem("userid");
      this.lbid=this.guid();
      this.xxdm = window.localStorage.getItem("xxdm");
      let param={
        xxdm:this.xxdm, //学校代码
        name:""//搜索里的数据
      }
      this.getTeacher(param);
    },
    methods:{
      //保存
      save(){
        this.changeSure=true;
        let parm={
          lbid: this.lbid,//类别id
          lbmc: this.lbmc,//类别名称
          rysm: this.rysm,//人员数目
          zfzr: this.zfzr,//总负责人
          zfzrxm:this.zfzrxm,//总负责人姓名
          cjr:this.cjr,//创建人
          xxdm: this.xxdm,
          xcrylist: this.xcrylist

        }
        if(this.checksave()) {
          saveAqsb(parm).then((res) => {
            if (res.status == '200') {
              this.$notify({ title: '添加成功', message: '课程添加成功', type: 'success', duration: 2000 });
              this.$router.push('/auditAqsb/aqsbManager');
            }else{
              this.changeSure=true;
              this.$notify({ title: '添加失败', message: res.message, type: 'error', duration: 2000 });
            }
          })
        }

      },
      checksave(){
        if( this.lbmc==""||this.lbmc==null){
          this.$message.error("巡查地点类别不能为空");
          this.changeSure=false;
          return false;
        }
        if(this.zfzr===""){
          this.$message.error("请选择总负责人");
          this.changeSure=false;
          return false;
        }
        if( this.xcrylist.length===0){
          this.$message.error("请选择巡查人员");
          this.changeSure=false;
          return false;
        }
        return true;
      },
      message(message) {
        this.$message.error(message);
      },
      //搜索老师
      searchTea(){
        let param={
          xxdm:this.xxdm,
          name:this.teaxm
        }
        this.getTeacher(param);
      },
      //老师弹层
      getTeacher(param){
        this.dataSet=[];
        getTea(param).then(response => {//获取所有列表信息
          this.jsxxlist = response.jsxxlist;//教师列表
          for (var index = 0; index < response.jsxxtitle.length; index++) {
            let map = response.jsxxtitle[index];
            let params = {};
            params.title = map.ename;
            params.total = map.name;
            params.checkedArr = [];
            params.teachers = [];

            for (var i = 0; i < this.jsxxlist.length; i++) {
              let tea = this.jsxxlist[i];
              let zgh_ = tea.ename;
              let xm_ = tea.name;
              if (tea.fdm == map.ename) {
                params.teachers.push({zgh: zgh_, xm: xm_});
              }
            }
            this.dataSet.push(params);
          }

        })
      },
      S4(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      },
      guid() {
        return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
      },
      // 返回
      handleGoback(){
        this.$router.push ({
          path: '/auditAqsb/aqsbManager'
        })
      },
      //选择教师
      selTeacher(){
        this.dialog_1 = true;
      },
      //取消 选泽老师
      cancelTea(){
        this.dialog_1 = false;
      } ,
      //确定 选择老师
      qdTea(){
        this.dialog_1 = false;
        this.skr="";
        this.xcrylist=[];
        for (var j = 0; j <  this.dataSet.length ;j++) {
          let map=this.dataSet[j];
          let jsmap=map.teachers;
          let check_skr=map.checkedArr;//选中的授课人的zgh;
          if(check_skr.length>0){
            for (var k = 0; k <  jsmap.length ;k++) {
              for (var i = 0; i <  check_skr.length ;i++) {
                let param={};
                param.xxdm=this.xxdm;
                param.ryzgh=check_skr[i];
                param.lbid=this.lbid;
                param.jlid=this.guid();
                if(jsmap[k].zgh==check_skr[i]){
                  this.skr+=jsmap[k].xm+"  ";
                  this.xcrylist.push(param);
                }
              }
            }
          }
        }
        this.rysm= this.xcrylist.length;
      } ,
      /*moresetting(){
        if(this.moreset){
          this.moreset = false
        }else{
          this.moreset = true
        }
      }*/

    }
  }
</script>

