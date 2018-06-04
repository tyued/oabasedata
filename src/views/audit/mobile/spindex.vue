<template>
  <div>
  <mt-navbar v-model="moduleid">
    <mt-tab-item id="1" >发起审批</mt-tab-item>
    <mt-tab-item id="2" @click.native="myfqsl">我发起的</mt-tab-item>
    <mt-tab-item id="3" @click.native="myspsl">待我审批的</mt-tab-item>
    <mt-tab-item id="4" @click.native="mywcsl">我已审批的</mt-tab-item>
    <mt-tab-item id="5" @click.native="mycssl">抄送我的</mt-tab-item>
  </mt-navbar>

  <!-- tab-container -->
  <mt-tab-container v-model="moduleid">
    <mt-tab-container-item id="1">
      <template v-for="(item,index) in list">
        <div :key="index">
          <div class="type-detail">
            <span>{{ item.lcdlmc }}({{ item.count }})</span>
          </div>
          <el-button v-for="mb in item.children" :key="mb.mbid" type="primary" icon="el-icon-edit-outline" @click="spsq(mb.mbid)">{{mb.lcmc}}</el-button>
        </div>
      </template>
    </mt-tab-container-item>
    <mt-tab-container-item id="2">
      <mt-cell v-for="sl in fqsp" :key="sl.slid" :title="sl.slmc" @click.native="spslmx(sl.slid)">
        <span>{{ sl.cjsj }}</span>
        <el-button v-if="sl.slzt==1" type="primary" size="mini" round>审批中</el-button>
        <el-button v-else-if="sl.slzt==2" type="info" size="mini" round>已撤销</el-button>
        <el-button v-else-if="sl.slzt==3" type="success" size="mini" round>审批通过</el-button>
        <el-button v-else-if="sl.slzt==4" type="danger" size="mini" round>审批拒绝</el-button>
        <span v-for="bdx in sl.ywxx" :key="bdx.bdxid">{{bdx.bdxmc}}:{{bdx.ywz}}</span>
      </mt-cell>
    </mt-tab-container-item>
    <mt-tab-container-item id="3">
      <mt-cell v-for="sl in ddsp" :key="sl.slid" :title="sl.slmc" @click.native="spslmx(sl.slid)">
        <span>{{ sl.cjsj }}</span>
        <el-button v-if="sl.slzt==1" type="primary" size="mini" round>审批中</el-button>
        <el-button v-else-if="sl.slzt==2" type="info" size="mini" round>已撤销</el-button>
        <el-button v-else-if="sl.slzt==3" type="success" size="mini" round>审批通过</el-button>
        <el-button v-else-if="sl.slzt==4" type="danger" size="mini" round>审批拒绝</el-button>
        <span v-for="bdx in sl.ywxx" :key="bdx.bdxid">{{bdx.bdxmc}}:{{bdx.ywz}}</span>
      </mt-cell>
    </mt-tab-container-item>
    <mt-tab-container-item id="4">
      <mt-cell v-for="sl in wcsp" :key="sl.slid" :title="sl.slmc" @click.native="spslmx(sl.slid)">
        <span>{{ sl.cjsj }}</span>
        <el-button v-if="sl.slzt==1" type="primary" size="mini" round>审批中</el-button>
        <el-button v-else-if="sl.slzt==2" type="info" size="mini" round>已撤销</el-button>
        <el-button v-else-if="sl.slzt==3" type="success" size="mini" round>审批通过</el-button>
        <el-button v-else-if="sl.slzt==4" type="danger" size="mini" round>审批拒绝</el-button>
        <span v-for="bdx in sl.ywxx" :key="bdx.bdxid">{{bdx.bdxmc}}:{{bdx.ywz}}</span>
      </mt-cell>
    </mt-tab-container-item>
    <mt-tab-container-item id="5">
      <mt-cell v-for="sl in cssp" :key="sl.slid" :title="sl.slmc" @click.native="spslmx(sl.slid)">
        <span>{{ sl.cjsj }}</span>
        <el-button v-if="sl.slzt==1" type="primary" size="mini" round>审批中</el-button>
        <el-button v-else-if="sl.slzt==2" type="info" size="mini" round>已撤销</el-button>
        <el-button v-else-if="sl.slzt==3" type="success" size="mini" round>审批通过</el-button>
        <el-button v-else-if="sl.slzt==4" type="danger" size="mini" round>审批拒绝</el-button>
        <span v-for="bdx in sl.ywxx" :key="bdx.bdxid">{{bdx.bdxmc}}:{{bdx.ywz}}</span>
      </mt-cell>
    </mt-tab-container-item>
  </mt-tab-container>
  </div>
</template>
<script>

import * as api from 'api/audit/mobile/spcx';
export default {
  name: 'indexPage',
  data() {
    return {
      xxdm:'',
      list: [],
      moduleid:'1',
      userid :'',
      fqsp:[],
      ddsp:[],
      wcsp:[],
      cssp:[]
    };
  },

  created() {
    this.userid = window.localStorage.getItem('userid');
    this.xxdm = window.localStorage.getItem('xxdm');
    this.getList();
  },

  methods: {
    handleData(list) {
      const dataSet = list;
      const result = [];
      dataSet.forEach(item => {
        const lcdl = item.lcdl;
        const arr = _.find(result, { lcdl });
        if (arr) {
          arr.children.push(item);
          arr.count = arr.count + 1;
        } else {
          const obj = {};
          obj.lcdl = lcdl;
          obj.lcdlmc = item.lcdlmc;
          obj.count = 1;
          obj.children = [];
          obj.children.push(item);
          result.push(obj);
        }
      });
      return result;
    },

    getList() {
      api.mbxx({ xxdm: this.xxdm}).then(response => {
        this.list = this.handleData(response);
      });
    },
    spsq(mbid) {
      this.$router.push({ path: '/process/apply', query: { mbid:mbid} });
    },
    myfqsl(){
      api.myfqsl(this.userid).then(respponse=>{
        this.fqsp = respponse;
      })
    },
    myspsl(){
      api.myspsl(this.userid).then(respponse=>{
        this.ddsp = respponse;
      })
    },
    mywcsl(){
      api.mywcsl(this.userid).then(respponse=>{
        this.wcsp = respponse;
      })
    },
    mycssl(){
      api.mycssl(this.userid).then(respponse=>{
        this.cssp = respponse;
      })
    },
    spslmx(slid) {
      this.$router.push({ path: '/process/info', query: {slid:slid}});
    },
  }
};
</script>
