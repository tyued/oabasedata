<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{spsl.slmc}}</span>
        <el-button v-if="spsl.slzt==1" type="primary" size="mini" round disabled style="cursor: move">审批中</el-button>
        <el-button v-else-if="spsl.slzt==2" type="info" size="mini" round disabled style="cursor: move">已撤销</el-button>
        <el-button v-else-if="spsl.slzt==3" type="success" size="mini" round disabled style="cursor: move">审批通过</el-button>
        <el-button v-else-if="spsl.slzt==4" type="danger" size="mini" round disabled style="cursor: move">审批拒绝</el-button>
      </div>
      <div v-for="bdx in spsl.ywxx" :key="bdx.bdxid" class="text item">
        {{bdx.bdxmc}}:{{bdx.ywz}}
      </div>
      <hr>
      <div>
        <div>
          <el-steps direction="vertical" :space="50" :active="currentIndex" finish-status="success" process-status="finish">
            <el-step v-for="(bzs ,index) in spsl.slbzList" :key="bzs.bzid" :title="(bzs.spbzmc+bzs.spsj)" @click.native="cxbzmx(index)"></el-step>
          </el-steps>
        </div>
      </div>
      <hr>
      <el-row v-if="spsl.slzt==1">
        <el-button v-if="pdsfksp()" round type="primary" @click="bcspyj(1)">同意</el-button>
        <el-button v-if="pdsfksp()" round type="info" @click="bcspyj(2)" >拒绝</el-button>
        <el-button v-if="spsl.fqr==userid" round type="warning" @click="cxspsl(spsl.slid)">撤销</el-button>
        <el-button v-if="spsl.fqr==userid" round type="warning" @click="cbspsl(spsl.slid)">催办</el-button>
      </el-row>
    </el-card>
  </div>
</template>
<script>

  import * as api from 'api/audit/mobile/spcx';
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'info',
    data() {
      return {
        slztEnum:{SPZ:1,//审批中
          SPCX:2,//审批撤销
          SPTG:3,//审批通过
          SPJJ:4 //审批拒绝
        },
        bzztEnum:{DSP:1,//待审批
          SPWC:2,//审批完成
          WSP:3,//未审批
          HQWC:4,//或签自动完成
        },
        slid:'',
        spsl:{},
        allbz:[],
        bzmx:[],
        userid:'',
        currentIndex:1,
      };
    },
    created() {
      this.slid = this.$route.query.slid;
      this.userid =window.localStorage.getItem('userid');
      this.cxslxq();
    },
    methods: {
      cxslxq() {
        api.cxspslxx(this.slid).then(response => {
          console.log(response)
          this.spsl = response;
          this.allbz = response.slbzList;
           this.clspbz(response.slbzList);

        });
      },
      hqsqr(){
        let sqrname = '';
        this.spsl.ywxx.forEach(function(item,index){
          if(item.bdbm=='sqr'){
            sqrname = item.ywz;
          }
        })
        return sqrname;
      },
      clspbz(allbz){
        console.log(allbz);
        const slzt = this.spsl.slzt;
        let zsbz = [];
        if(slzt==this.slztEnum.SPZ){
          zsbz = (allbz);
        }else if(slzt==this.slztEnum.SPTG||slzt==this.slztEnum.SPJJ||slzt==this.slztEnum.SPCX){
          zsbz = _.filter(allbz,  ['spzt', this.bzztEnum.SPWC]);
        }
        const zsslbz = [];
        zsslbz.push(this.addstep(this.slztEnum.SPZ));
        if(zsbz){
          zsbz.forEach(function(item,index){
            const bzindex = item.spslbz;
            const bz = _.find(zsslbz,  ['spslbz', bzindex]);
            if (bz) {
              bz.spbzmc = item.mbbzmc;
              bz.spslbz = item.spslbz;
              bz.spbzzt = item.spzt;
              bz.slbz.push(item);
            } else {
              const obj = {};
              obj.spslbz = bzindex;
              obj.spbzzt = item.spzt;
              obj.spbzmc = item.bzmc;
              if(item.gxsj){
                obj.spsj = item.gxsj;
              }else{
                obj.spsj = '';
              }
              obj.slbz = [];
              obj.slbz.push(item);
              zsslbz.push(obj);
            }
          })
        }
        if(slzt==this.slztEnum.SPCX){
          zsslbz.push(this.addstep(this.slztEnum.SPCX));
        }
        this.spsl.slbzList = zsslbz;
        this.hqdqbz();
      },
      hqdqbz(){
        console.log(this.spsl.slbzList);
        let dqbz = this.spsl.slbzList.length;
        const dspbz = _.find(this.spsl.slbzList,  {'spbzzt':this.bzztEnum.DSP});
        if(dspbz){
          dqbz = dspbz.spslbz;
        }
        this.currentIndex = dqbz;
      },
      addstep(slzt){
        const step = {};
        step.slbz = [];
        let sqrname = this.hqsqr();

        if(slzt==this.slztEnum.SPCX){
          step.spslbz = 99;
          step.spbzzt = this.bzztEnum.SPWC;
          step.spsj = this.spsl.gxsj;
          step.spbzmc = sqrname+"撤销了审批";
        }else{
          step.spslbz = 0;
          step.spbzzt = this.bzztEnum.SPWC;
          step.spsj = this.spsl.cjsj;
          step.spbzmc = sqrname+"发起了审批";
        }
        return step
      },
      cxbzmx(index){
        this.bzmx = this.spsl.slbzList[index].slbz;
        console.log(this.bzmx);
      },
      cxspsl(slid){
        MessageBox.confirm('确认撤销申请吗?').then(action => {
          api.cxspsl(slid).then(response=>{
            this.cxslxq();
          })
        });
      },
      bcspyj(type){
        MessageBox.prompt('请输入审批意见').then(({ value, action }) => {
          const dspbz = this.pdsfksp();
          if(dspbz){
            const spyj = {};
            spyj.slbzid = dspbz.slbzid;
            spyj.spnr = value;
            spyj.spyj = type;
            api.clslbz(spyj).then(response=>{
              this.cxslxq();
            })
          }
        });
      },
      pdsfksp(){
        const dspbz = _.find(this.allbz,  {'spr': this.userid,'spzt':this.bzztEnum.DSP});
        return dspbz;
      },
      cbspsl(slid){
        MessageBox.alert("催办通知")
      }
    }
  };
</script>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
