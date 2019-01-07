<template>
  <section class="content-container">

    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary"  @click="xkgoback">返回</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-form :model="form" ref="form" label-width="110px" name="myform" >
        <el-form-item label="任务名称"  prop="rwmc" >
          <el-col :span="18">
            {{form.rwmc}}
          </el-col>
        </el-form-item>
        <el-row :gutter="18">
          <el-col :span="12">
            <el-form-item label="开始报名时间" prop="kssj" >
              {{form.kssj}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止报名时间"  prop="jssj">
              {{form.jssj}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="selNjStu">
            <div class="selLeft">
              <el-collapse accordion >
                <div v-for="item in kclxMap" @click="details_kcxx(item.lbid)"  :key="item.lbid">
                  <el-collapse-item >
                    <template slot="title">
                      {{ item.lbmc}}
                    </template>
                  </el-collapse-item>
                </div>
              </el-collapse>

            </div>

            <div class="selRight">
              <div class="bjstuall">
                <template>
                  <el-transfer v-model="value1" :data="data" :titles="title"  ></el-transfer>
                </template>
              </div>
            </div>
          </div>
        </el-row>

      </el-form>


  </section>
</template>
<script>

  import { page, get, del, post, put,checkUnique,getKclx,getKcxx,addKcxx,deleteKcxx,getxnList,getxqList,sendXktz } from 'api/xkxt/xkrwmanager/index'
  import {dqxnxqObj} from 'api/components/searchbar'
  export default {
    name: 'xkrwManager',
    data() {
      return {
        xxdm : '',
        usercode:"", //当前用户
        dqxn:"", //当前学年
        dqxq:"", //当前学期

        tableKey: 0,
        listLoading: false,
        total: 0,
        list: [],
        dictMap: {},
        kclxMap: {},
        title: ['课程名称', '已选课程'],
        form: {
          rwmc:'',
          kssj:'',
          jssj:'',
          checkedTzdx: [],
          checkedTzfs: []
        },
        listQuery: {  // 分页
          xnGroup : [],
          xqGroup : [],
          query: {
            page: 1,
            limit: 10
          },
          xxdm: ''
        },
        searchsel:'lbmc',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        data: [],
        kcxxList: [],
        value1: []
      }
    },
    filters:{
      formatXkzt:function (value) {

       if(value=='0'){
         return "未开始";
       }else if(value=='1'){
         return "已开始";
       }else if(value=='2'){
         return "已结束";
       }else{
         return "未开始";
       }
      }
      },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      this.usercode = window.localStorage.getItem("usercode");
      this.getKclx();
      let xkrwid = this.$route.query.row.xkrwid ;
      get(xkrwid).then(response => {
        this.form = response.data;
        let kcdms = response.data.kcdms;
        let kcmcs = response.data.kcmcs;
        if(kcmcs){
          let arrStr = JSON.stringify(this.data);
          for (let i = 0; i < kcmcs.length; i++) {
            if(arrStr.indexOf(kcdms[i])==-1){
              this.data.push({
                key: kcdms[i],
                label: kcmcs[i]
              });
            }
          }
        }
        this.value1=response.data.kcdms;
      });
    },
    mounted(){

    },
    methods: {
      //查询课程
      details_kcxx(lbid){
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.lbid = lbid;
        getKcxx(this.listQuery).then(response => {
          this.kcxxList = response.data.rows;
          let arrStr = JSON.stringify(this.data);
          for (let i = 0; i < this.kcxxList.length; i++) {
            let temp = this.kcxxList[i];
            if(arrStr.indexOf(temp.kcdm)==-1){ //判断是否重复加
              this.data.push({
                key: temp.kcdm,
                label: temp.kcmc
              });
            }
          }

        })

      },
      //查询课程类型
      getKclx(){
        this.listQuery.xxdm = this.xxdm;
        getKclx(this.listQuery).then(response => {
          this.kclxMap = response.data.rows;
        })
      } ,
      xkgoback(){//返回
        this.$router.push('/xkxtManager/xkrw');
      },


    }
  }
</script>

