<template>
  <div>
    <span>{{mbxx.lcmc}}</span>
    <hr>
    <div v-show="bdx.bdbm!='sqr'" v-for="(bdx,index) in mbxx.bdxList" :key="bdx.bdxid">

      <span>{{bdx.bdmc}}：</span>
      <el-select v-if="bdx.bdxlx==1" v-model ="bdx.bdxywz" @change="cxlcbzBySelect(bdx.bdbm,bdx.bdxywz)">
        <el-option v-for="item in bdx.selectArr" :key="item" :label="item" :value="item"> </el-option>
      </el-select>
      <el-date-picker v-else-if="bdx.bdxlx==2" v-model ="bdx.bdxywz" type="datetime" @blur="cxlcbz"> </el-date-picker>
      <el-input-number v-else-if="bdx.bdxlx==3" v-model ="bdx.bdxywz"  @blur="cxlcbz"></el-input-number>
      <el-input type="textarea" v-else-if="bdx.bdxlx==4" v-model="bdx.bdxywz" @blur="cxlcbz" :rows="2"  >
      </el-input>
      <div v-else-if="bdx.bdxlx==5">
          <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="bdx.bdxywz" alt="">
          </el-dialog>
      </div>
    </div>
    <hr>
    <div>
      <span>所属部门：</span>
      <el-select v-model ="bmid" @change="cxlcbz">
        <el-option v-for="group in mbxx.groupList" :key="group.id" :label="group.name" :value="group.id"> </el-option>
      </el-select>
    </div>
    <hr>
    <div>
    <span>审批步骤</span>

      <div>
        <el-steps simple>
          <el-step v-for="(bzs ,index) in slbzs" :key="bzs.bzid" :title="bzs.spbzmc" @click.native="cxbzmx(index)"></el-step>
        </el-steps>
      </div>
      <div v-for="bzs in slbzs" :key="bzs.spslbz"><el-button>{{bzs.spbzmc}}</el-button>
        <span v-for="bz in bzs.slbz" :key="bz.slbzid" closable>{{bz.bzmc}},</span>
      </div>
    </div>
    <el-button type="primary" @click="tjsq">提交申请</el-button>
  </div>
</template>
<script>

import * as api from 'api/audit/mobile/spsq';
import { MessageBox } from 'mint-ui';
export default {
  name: 'LeaveManager',
  data() {
    return {
      dialogVisible: false,
      xxdm:'',
      mbid:'',
      userid:'',
      username:'',
      bmid:'',
      mbxx:{},
      spsl:{},
      slbzs:[],
      bzmx :[],
      bdxmc:''

    };
  },
  created() {
    this.mbid = this.$route.query.mbid;
    this.userid = window.localStorage.getItem('userid');
    this.username = window.localStorage.getItem('name');
    //this.mbid = "99896a4c6e1a417aa74d5b65a63eb807";
    //this.userid = "e80fcbc237ce11e8b5b6479016ccf5a6";
    this.xxdm = window.localStorage.getItem('xxdm');
    this.cxqjxxbymbid();
  },

  methods: {
    cxqjxxbymbid(){
      api.cxspxxBymb(this.mbid, this.userid).then(response => {
        this.mbxx= response;
/*        try{
          this.bmid = response.groupList[0].id;
        }catch (e) {
          console.error(e+"请先设置部门！")
        }*/
        const bdx = _.find(this.mbxx.bdxList,  ['bdbm', 'qjsc']);
        if(bdx){
          this.bdxmc = bdx.bdmc;
        }
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
    },
    cxlcbzBySelect(bdbm,bdywz){
      if(bdbm=='qjlx'){
        const bdx = _.find(this.mbxx.bdxList,  ['bdbm', 'qjsc']);
        api.cxjqxx(bdywz,this.xxdm).then(response=>{
          console.log(response)
          let  sjdw = '(天)';
          try{
            //按小时请假
            if(response[0].qjdw==3){
              sjdw = '(小时)';
            }else if(response[0].qjdw==2) {
              sjdw = '(半天)';
            }
            bdx.bdmc = this.bdxmc+sjdw;
          }catch (e) {
            console.error(e+"请假表单项配置有误")
          }
        })

      }
      this.cxlcbz();
    },
    cxlcbz(){
      if(this.jybdx()){
        const bdxx = {};
        this.mbxx.bdxList.forEach(function(bdx,index){
          bdxx[bdx.bdbm] =bdx.bdxywz;
        })
        bdxx.mbid = this.mbid;
        bdxx.sqr = this.userid;
        bdxx.bmid = this.bmid;
        api.cxlcbzbybdxx(bdxx).then(response=>{
          this.spsl = response.data;
          const zsslbz = [];
          this.spsl.slbzList.forEach(function(item,index){
            const bzindex = item.spslbz;
            const bz = _.find(zsslbz,  ['spslbz', bzindex]);
            if (bz) {
              bz.spbzmc = item.mbbzmc;
              bz.slbz.push(item);
            } else {
              const obj = {};
              obj.spslbz = bzindex;
              obj.spbzmc = item.bzmc;
              obj.slbz = [];
              obj.slbz.push(item);
              zsslbz.push(obj);
            }
          })
          this.slbzs = zsslbz;
          console.log(this.slbzs);
        });
      }
    },
    jybdx(){
      let flag = true;
      const usname = this.username;
      this.mbxx.bdxList.forEach(function(bdx,index){
        if(bdx.bdbm=='sqr'){
          bdx.bdxywz = usname;
        }
        if(bdx.sfbt ==1&&!bdx.bdxywz){
          flag = false;
        }
      })
/*      if(this.bmid==''){
        flag = false;
      }*/
      return flag;
    },
    tjsq(){
      if(!this.jybdx()){
        MessageBox('提示', '请完整填写表单');
        return false;
      }
      if(this.slbzs.length==0){
        MessageBox('提示', '请设置审批步骤');
        return false;
      }
      MessageBox.confirm('确定执行此操作?').then(action => {
        const slbz = [];
        this.slbzs.forEach(function(bz,bzinx){
          bz.slbz.forEach(function(zbz,zinx){
            slbz.push(zbz);
          })
        })
        this.spsl.bdxList = this.mbxx.bdxList;
        this.spsl.slbzList = slbz;
        this.spsl.slmc = this.username+'的'+this.mbxx.lcmc;
        api.bcxlbz(this.spsl).then(response=>{
          this.$router.push('/process/index');

        });
      });
    },
    cxbzmx(index){
        this.bzmx = this.slbzs[index].slbz;
    }
  }
};
</script>
