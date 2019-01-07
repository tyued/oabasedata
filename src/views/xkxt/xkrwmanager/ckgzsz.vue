<template>
  <div class="oarow" style="float:left; margin-top:20px;width:100%;">
    <el-row>
      <el-button type="primary" @click="xkgoback">返回</el-button>
    </el-row>
    <div class="rowmain">

      <el-form :model="form" ref="form"  label-width="110px" name="myform">
        <el-row>
          <el-form-item  label="每名学生最多选">
            　　{{form.zxks}}门课
          </el-form-item>
        </el-row>
        <el-row>
          <div class="rowcontent">
            <div class="rowLeftBox">不能同时选择的课程</div>
            <div class="rowRightBox">
              <div class="courseList">
                <div class="course"  v-for="hckc in hckclist" :label="hckc.kcdms" :key="hckc.zhid">
                  <span>{{hckc.kcmcs}}</span>
                </div>
              </div>
            </div>
          </div>
        </el-row>

        <el-row>
          <div class="rowcontent">
            <div class="rowLeftBox">必选的课程类别</div>
            <div class="rowRightBox">
              <div class="courseList">
                <el-form-item>
                  <div class="course" v-for="(lbkc, index) in lbkclist" :label="lbkc.lbid" :key="index">
                    <span>{{lbkc.lbmc}} 至少选 {{lbkclist[index].zdxks}} 门课</span>
                  </div>
                </el-form-item>

              </div>
            </div>
          </div>
        </el-row>
      </el-form>

    </div>
  </div>
</template>

<script>
  import {dqxnxqObj} from 'api/components/searchbar'
  import { addGzszHckc,getGzszXkkc,getHckcList,deleteHckc,getGzszXklb,addGzszBxkc,getBxkcList,saveGzsz,deleteBxkc,getXktjzdks } from 'api/xkxt/xkrwmanager/index'
  export default {
    name: 'xkgzsz',

    data(){

      return{
        dqxn:"", //当前学年
        dqxq:"", //当前学期
        checkkcxx : [],
        checkkclb : [],
        xkkclist : [],
        hckclist : [],
        kclblist : [],
        lbkclist : [],
        zdksmap : [],
        changeSure : false,
        form: {
          uuid :'',
          zxks :''
        },
        kcform: {},
        lbform: {},
        listQuery: {
          xxdm: ''
        },
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogStatus: '',
        dialogXkFormVisible : false,
        dialogLbFormVisible : false,
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      let xndm = this.$route.query.row.xndm ;
      let xqdm = this.$route.query.row.xqdm ;
      this.dqxn=xndm;
      this.dqxq=xqdm;
      this.listQuery.xndm=  xndm;
      this.listQuery.xqdm=  xqdm;
      this.listQuery.xxdm = this.xxdm;
      this.getHckcList();
      this.getBxkcList();
      this.getXktjzdks();

    },
    methods:{
      getHckcList(){ //查询互斥课程列表
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.xndm =this.dqxn;
        this.listQuery.xqdm =this.dqxq;
        getHckcList(this.listQuery).then(response => {
          this.hckclist = response.data;
        })
      },
      getBxkcList(){//查询课程类别
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.xndm = this.dqxn;
        this.listQuery.xqdm = this.dqxq;
        getBxkcList(this.listQuery).then(response => {
          this.lbkclist = response.data;
        })
      },
      getXktjzdks(){//查询最多选
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.xndm = this.dqxn;
        this.listQuery.xqdm = this.dqxq;
        getXktjzdks(this.listQuery).then(response => {
          if(response.data) {
            this.form.zxks = response.data.zdxks;
            this.form.uuid = response.data.uuid;
          }

        })
      },
      xkgoback(){//返回
        this.$router.push('/xkxtManager/xkrw');
      },


    }
  }
</script>


