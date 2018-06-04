<template>
  <div class="app-container calendar-list-container">
      <div class="filter-container">
          <h4>默认审批步骤</h4>
          <div class="rowBox">
              <div class="rowlabel"><span>默认审批人</span></div>
              <div class="rowcon">
                  <div class="approvalList"></div>
                  <div class="approvalAdd" @click="szlcbz('add',-1)"><i class="el-icon-circle-plus-outline"></i></div>
              </div>
          </div>
      </div>

      <span >
          <el-steps  finish-status="success" simple>
            <el-step v-for="item in mrspbz" :key="item.bzid"  :title="item.bzmc" @click.native="szlcbz(item,-1)">xxxxxxxxxxxxxxxxxx</el-step>
          </el-steps>
          <el-button size="mini" round @click="szlcbz('add',-1)">添加默认审批步骤</el-button>
      </span>
    <div class="filter-container">
    <span>抄送人：</span>
    <el-tag v-for="(item,csrindex) in mrcsr" :key="item" closable @close="scmccsr(csrindex)" >
      {{item}}
    </el-tag>
    </div>
    <div class="filter-container">
      <h3>按条件审批
        <el-button size="mini" round @click="addspbztj">添加条件</el-button>
      </h3>
    </div>
    <template v-for="(item,index) in bztj">
        <el-card class="box-card" :key="item.yxj">
          <div slot="header" class="clearfix">
            <span>优先级{{ item.yxj }}</span>
            <el-button style="float: right; padding: 3px 0" @click ="bjsptj(index)" type="text">编辑</el-button>
            <el-button style="float: right; padding: 3px 0" @click ="scbztj(index)" type="text">删除</el-button>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="tj in item.sptj" :key="tj.bds" class="text item">
             <span v-if="tj.splcbdx.bdxlx==1">如果{{tj.splcbdx.bdmc}} 在 {{tj.zffw}} 范围内</span>
             <span v-else-if="tj.splcbdx.bdxlx==3">如果 {{tj.zffw}}</span>
               <span v-else-if="tj.splcbdx.bdbm=='sqr'">如果 申请人在{{tj.zffw}} 范围内</span>
          </div>
          <div>
          <el-steps  finish-status="success" simple space="10%">
            <el-step v-for="bz in item.spbz" :key="bz.bzid"  :title="bz.bzmc" @click.native="szlcbz(bz,index)" ></el-step>
          </el-steps>
          <el-button size="mini" round @click="szlcbz('add',index)">添加审批步骤</el-button>
          </div>
          <span>抄送人：</span>
          <el-tag v-for="(csr,csindex ) in item.csr" :key="csr" closable @close="sctjcsr(csindex,index)" >
            {{csr}}
          </el-tag>
          <el-button size="mini" round @click="xzspr">添加抄送人</el-button>
        </el-card>
    </template>
    <div class="filter-container">
      <h3>其他设置</h3>
    </div>
    <span>通知方式：</span>
    <el-select v-model="tzfs" placeholder="请选择">
      <el-option label="全部同意后通知" value="1"></el-option>
      <el-option label="发起时通知" value="2"></el-option>
      <el-option label="发起和全部同意后通知" value="3"></el-option>
    </el-select>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="bcspbztj">保存</el-button>

    <el-dialog title="设置审批人" :visible.sync="dialogzpbzVisible" width="700px">
      <el-dialog width="600px" title="选择" :visible.sync="dialogxzspr" append-to-body>
          <el-transfer v-model="sxbmspr" :props="{ key: 'value', label: 'desc' }" :data="bmsj"></el-transfer>
          <el-button @click="czbmspr">确 定</el-button>
      </el-dialog>

      <div class="sprBox">
          <span class="spanlabel">审批人类别</span>
          <div class="spancon">
              <el-radio-group v-model="sprlx" size="mini" @change="bgsplx">
                <el-radio label="1" border>主管(指定一级)</el-radio>
                <el-radio label="2" border>主管(连续多级)</el-radio>
                <el-radio label="3" border>指定成员</el-radio>
                <el-radio label="4" border>角色</el-radio>
              </el-radio-group>
          </div>
      </div>
      <div class="sprBox" v-show="sprlx==1||sprlx==2">
          <span class="spanlabel"></span>
          <div class="spancon">
              <span class="spanconlabel" v-if="sprlx==1">发起人的</span>
              <span v-else="sprlx==2">审批终点：</span>
              <el-select v-model="zgdj" placeholder="请选择">
                <el-option label="第一级主管" value="1"></el-option>
                <el-option label="第二级主管" value="2"></el-option>
                <el-option label="第三级主管" value="3"></el-option>
                <el-option label="第四级主管" value="4"></el-option>
                <el-option label="第五级主管" value="5"></el-option>
                <el-option label="第六级主管" value="6"></el-option>
              </el-select>
          </div>
      </div>

      <div class="sprBox" v-show="sprlx==splxEnum.ZDCY||sprlx==splxEnum.ZDJS">
          <span class="spanlabel"></span>
          <div class="spancon" v-if="sprlx==splxEnum.ZDCY">
              <span class="tjtips">选择指定成员（单个节点审批人不超过10人）</span>
              <div>
                  <el-tag v-for="(bspr,bzrindex) in bzspr" :key="bspr" closable @close="scbzcsr(bzrindex)" >{{bspr}}</el-tag>
                  <el-button type="primary"  @click="xzspr">选择指定成员</el-button>
              </div>
          </div>
          <div class="spancon" v-if="sprlx==splxEnum.ZDJS">
              <el-tag v-model="bzjs" v-if="bzjs">{{bzjs}}</el-tag>
              <el-button type="primary" @click="xzspjs">选择指定成员角色</el-button>
          </div>
      </div>
      <div class="sprBox">
          <span class="spanlabel">审批方式</span>
          <div class="spancon">
              <el-radio-group v-model="spfs" class="radioblock">
                <el-radio v-show="sprlx==splxEnum.YJZG||sprlx==splxEnum.DJZG" label="1" >依次审批（本环节内审批人依次审批）</el-radio>
                <el-radio v-show="sprlx==splxEnum.YJZG||sprlx==splxEnum.ZDCY||sprlx==splxEnum.ZDJS" label="2" >会签（需所有审批人同意）</el-radio>
                <el-radio v-show="sprlx==splxEnum.YJZG||sprlx==splxEnum.ZDCY||sprlx==splxEnum.ZDJS" label="3" >或签（任意一名审批人同意或拒绝）</el-radio>
                <el-radio v-show="sprlx==splxEnum.ZDJS" label="4" border>发起人从角色成员中自选</el-radio>
              </el-radio-group>
          </div>
      </div>
      <div class="sprBox" v-if="sprlx==1">
        <span class="spanlabel">主管代审</span>
        <div class="spancon">
            <el-checkbox class="checkblock" v-model="zgds">若有审批人空缺，由其在通讯录中的上级主管代审批</el-checkbox>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="bcspbz">确 定</el-button>
        <el-button @click="qxszbz">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置审批条件" :visible.sync="dialogzptjVisible" width="50%">
      <el-checkbox-group v-model="dqbdx" >
        <el-checkbox @change="xgtjbdx(bdx)" v-for="bdx in tjbdx" :label="bdx.bdxid" :key="bdx.bdxid">{{bdx.bdmc}}</el-checkbox>
      </el-checkbox-group>
      <div v-for="(tj,tjindex) in dqtj" :key="tj.tjid" >
        <span>{{tj.splcbdx.bdmc}}</span>:
        <el-checkbox-group v-model="tj.zffwArr"  v-if="tj.splcbdx.bdxlx==1" >
          <el-checkbox   v-for="lx in tj.splcbdx.selectArr" :label="lx" :key="lx">{{lx}}</el-checkbox>
        </el-checkbox-group>
        <div v-else-if="tj.splcbdx.bdxlx==3">
          <el-input-number v-model="tj.zffwArr[0]" placeholder="请输入内容"></el-input-number>
          <el-select v-model="tj.zffwArr[1]">
            <el-option label="<" value="<"></el-option>
            <el-option label="<=" value="<="></el-option>
          </el-select>
          <span v-model="tj.zffwArr[2]">{{tj.splcbdx.bdmc}}</span>
          <el-select v-model="tj.zffwArr[3]">
            <el-option label="<" value="<"></el-option>
            <el-option label="<=" value="<="></el-option>
          </el-select>
          <el-input-number v-model="tj.zffwArr[4]" placeholder="请输入内容"></el-input-number>
        </div>
        <div v-else-if="tj.splcbdx.bdbm=='sqr'">
          <el-tag v-for="(fw,fwindex) in tj.zffwArr" :key="fw" closable @close="scbdxspr(fwindex,tjindex)" >
            {{fw}}
          </el-tag>
          <el-button size="mini" round @click="xzspr">选择指定成员</el-button>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bcsptjbdx">确 定</el-button>
        <el-button @click="qxsptjbdx">取 消</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>

  import * as api  from 'api/audit/approvalprocess/szspbz';
  export default {
    data() {
      return {
        splxEnum:{YJZG:1,//一级主管
                  DJZG:2,//多级主管
                  ZDCY:3,//指定成员
                  ZDJS:4 //指定角色
        },
        spfsEnum:{YICI:1,//依次
                  HUIQ:2,//会签
                  HUOQ:3,//或签
                  ZDJS:4 //角色自选
        },
        bdxlxEnum:{SELECT:1,//下拉框
                   DATE:2,//时间
                   NUMBER:3,//数字
                   TEXT:4, //文本
                   FILE:5, //文件
                   IMAGE:6 //图片
        },
        mbid:'',//模板id
        bdid:'',//表单id
        mrspbz:[], //默认审批步骤
        mrcsr:[], //默认抄送人
        bztj:[], //条件步骤
        tzfs:'', //通知方式
        dialogzpbzVisible: false,
        dialogxzspr:false,
        bzid:'',//当前步骤id
        yxjindex:'',//优先级下标
        bzindex:'',//步骤下标
        sprlx:'',//审批类型
        spfs:'',//审批方式
        zgdj:'',//主管等级
        bzspr:[],//步骤所选审批人
        bzjs :'',//步骤所选角色
        bmsj:[],//部门数据
        sxbmspr:[], //用户所选步骤角色
        dialogzptjVisible:false,
        dqtj:[],
        tjbdx:[],
        dqbdx:[],
        zgds:true,        //主管代审
      }
    },
    created() {
      this.mbid = this.$route.query.mbid;
      this.cxspbztj();
    },
    computed: {
    },
    methods: {
      cxspbztj() {
        api.cxlcbz(this.mbid).then(response => {
          const allbz = response.data.spbz;
          const alltj = response.data.sptj;
          this.tzfs = response.data.tzfs;
          this.bdid = response.data.bdid;
          const mrspbzs = [];
          const spbztj = [];
          let csr =[];
          alltj.forEach(function(item,index){
            const yxj = item.yxj;
            const yxjtj = _.find(spbztj,  ['yxj', yxj]);
            if (yxjtj) {
              yxjtj.sptj.push(item);
            } else {
              const obj = {};
            obj.yxj = yxj;
            obj.sptj = [];
            obj.spbz = [];
            obj.csr = [];
            obj.sptj.push(item);
            spbztj.push(obj);
          }
          })
          allbz.forEach(function(item,index){
            const  sfmr = item.sfmr;
            if(sfmr==1){
              mrspbzs.push(item);
              if(item.csr){
                csr = item.csr.split(',');
              }

            }else{
              const yxj = item.spyxj;
              const yxjbz = _.find(spbztj,  ['yxj', yxj]);
              if (yxjbz) {
                yxjbz.spbz.push(item);
                if(item.csr){
                  yxjbz.csr= item.csr.split(',');
                }

              } else {
                const obj = {};
                obj.yxj = yxj;
                obj.spbz = [];
                obj.spbz.push(item);
                spbztj.push(obj);

              }
            }
          })
          this.mrspbz = mrspbzs;
          this.mrcsr = csr;
          this.bztj = spbztj;
        })
      },
      szlcbz(bz,index){
        if(bz.sprlx){
          this.sprlx =bz.sprlx.toString();
          this.spfs =bz.spfs.toString();
          this.bzid = bz.bzid;
          this.bzindex = bz.spbz-1;

          if(this.sprlx ==this.splxEnum.YJZG||this.sprlx ==this.splxEnum.DJZG){
            this.zgdj = bz.spr.toString();
          }else if(this.sprlx ==this.splxEnum.ZDCY){
            this.bzspr = bz.spr.toStrig().split(',');
          }else if(this.sprlx ==this.splxEnum.ZDJS){
            this.bzjs = bz.spr.toString();
          }

        }else{
          this.sprlx ='1';
          this.spfs ='1';
          this.bzid = '';
          this.zgdj = '';
          this.bzindex = 0;
        }
        this.dialogzpbzVisible = true;
        this.yxjindex = index;


      },
      scmccsr(csrindex) {
        this.mrcsr.splice(csrindex, 1);
      },
      sctjcsr(csrindex,index){
        this.bztj[index].csr.splice(csrindex,1);
      },
      scbzcsr(bzrindex){
        this.bzspr.splice(bzrindex, 1);
      },
      scbdxspr(sprindex,tjindex){
          this.dqtj[tjindex].zffwArr.splice(sprindex,1);
      },
      bgsplx(){
        this.zgdj = '';
        this.spfs = '';
        if(this.sprlx=='1'){        //主管（指定一级）
          this.spfs='1'
        }
        if(this.sprlx=='3'){        //指定成员

        }
        if(this.sprlx=='4'){       //角色

        }

      },
      qxszbz() {
        this.dialogzpbzVisible = false;
      },
      sclcbz(yxjindex,bzindex){
        if(yxjindex==-1){
          this.mrspbz.splice(bzindex,1);
          this.mrspbz.forEach(function(mrbz,mbinx){
            mrbz.spbz =mbinx+1;
          })
        }else if(yxjindex>=0){
          this.bztj[yxjindex].spbz.splice(bzindex,1);
          this.bztj[yxjindex].spbz.forEach(function(bz,bzinx){
            bz.spbz =bzinx+1;
          })
        }
      },
      bcspbz(){
        let flag= true;
        if(this.sprlx==''||this.spfs==''){
            flag = false;
        }else{
          if((this.sprlx ==this.splxEnum.YJZG||this.sprlx ==this.splxEnum.DJZG)&&this.zgdj==''){
            flag = false;
          }else if(this.sprlx ==this.splxEnum.ZDCY&&this.bzspr==''){
            flag = false;
          }else if(this.sprlx ==this.splxEnum.ZDJS&&this.bzjs==''){
            flag = false;
          }
        }
        if(flag){
          let dqlcbz={};
          if(this.bzid!=''){
            if(this.yxjindex==-1){
              dqlcbz=this.mrspbz[this.bzindex];
            }else if(this.yxjindex>=0){
              dqlcbz=(this.bztj[this.yxjindex].spbz)[this.bzindex];
            }
          }
          dqlcbz.sprlx=this.sprlx;
          dqlcbz.spfs=this.spfs;
          dqlcbz.mbid=this.mbid;
          if(this.sprlx ==this.splxEnum.YJZG){
            dqlcbz.bzmc='第'+this.zgdj+"级主管";
            dqlcbz.spr=this.zgdj;
          }else if(this.sprlx ==this.splxEnum.DJZG){
            dqlcbz.bzmc='从直接主管到第'+this.zgdj+"级主管";
            dqlcbz.spr=this.zgdj;
          }else if(this.sprlx ==this.splxEnum.ZDCY){
            dqlcbz.bzmc=this.bzspr.length+'人';
            dqlcbz.spr=this.bzspr.join(',');
          }else if(this.sprlx ==this.splxEnum.ZDJS){
            dqlcbz.bzmc=this.bzjs;
            dqlcbz.spr=this.bzjs;
          }
          if(this.bzid==''){
            let zhbz ={};
            if(this.yxjindex==-1){
              zhbz = _.last(this.mrspbz);
              if(zhbz){
                dqlcbz.spyxj=zhbz.spyxj;
                dqlcbz.spbz=zhbz.spbz+1;
              }else{
                dqlcbz.spyxj=this.yxjindex;
                dqlcbz.spbz=1;
              }
              dqlcbz.sfmr=1;
              this.mrspbz.push(dqlcbz);
            }else if(this.yxjindex>=0){
              zhbz=_.last(this.bztj[this.yxjindex].spbz);
              if(zhbz){
                dqlcbz.spyxj=zhbz.spyxj;
                dqlcbz.spbz=zhbz.spbz+1;
              }else{
                dqlcbz.spyxj=this.yxjindex+1;
                dqlcbz.spbz=1;
              }
              this.bztj[this.yxjindex].spbz.push(dqlcbz);
            }
          }
          this.dialogzpbzVisible = false;
        }else{
          this.$message({ type: 'warning', message: '请完整填写审批步骤!' });
        }
      },
      //选择指定成员
      xzspr(){
        console.log(this.sxbmspr)
          this.dialogxzspr=true;
          this.sxbmspr = this.bzspr;
          this.bmsj = this.cxbmsj();

      },
      // 选择指定成员角色
      xzspjs(){
        this.dialogxzspr=true;
        this.sxbmspr = this.bzjs;
        this.bmsj = this.cxbmsj();
      },
      cxbmsj(){
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            value: i,
            desc: `用户 ${ i }`
          });
        }
        return data;
      },
      //  成员选择弹层页确定按钮
      czbmspr(){
          this.dialogxzspr = false;
          // this.bzspr = this.sxbmspr;           //指定成员
          if(this.sprlx=='3'){        //指定成员
            this.bzspr = this.sxbmspr;           //指定成员

          }
          if(this.sprlx=='4'){       //角色
            this.bzjs = this.sxbmspr;
          }

      },
      bjsptj(index){
        this.yxjindex = index;
        const dqtjx= [];
        const dqbd= [];
        this.bztj[this.yxjindex].sptj.forEach(function (tj) {
          dqtjx.push(tj);
          dqbd.push(tj.bdxid);
        })
        this.dqtj = dqtjx;
        this.dqbdx = dqbd;
        api.cxbtbdx(this.bdid).then(response => {
          this.tjbdx = response;
        })
        this.dialogzptjVisible = true;
      },
      scbztj(index){
        this.$confirm('此操作将删除步骤条件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.bztj.splice(index,1);
          this.bztj.forEach(function(item,index){
            item.yxj =index+1;
            item.spbz.forEach(function(bz,bzindex){
              bz.spyxj=index+1;
            })
            item.sptj.forEach(function(tj,tjindex){
              tj.yxj=index+1;
            })
          })
        });
      },
      bcspbztj(){
        if(this.mrspbz.length==0){
          this.$message({ type: 'warning', message: '必须设置默认审批步骤!' });
          return false;
        }
        let flag= false;
        this.bztj.forEach(function(item,index){
          if(item.spbz.length==0){
            flag = true;
          }
          if(item.sptj.length ==0){
            flag = true;
          }
        })
        if(flag){
          this.$message({ type: 'warning', message: '请完整设置条件和步骤!' });
          return false;
        }
        const lcmbxx = {};
        lcmbxx.mbid = this.mbid;
        lcmbxx.tzfs = this.tzfs;
        const spbz=[];
        const sptj =[];
        this.mrspbz.forEach(function(mrbz,index){
          spbz.push(mrbz);
        })
        this.bztj.forEach(function(item,index){
          item.spbz.forEach(function(bz,bzindex){
            spbz.push(bz);
          })
          item.sptj.forEach(function(tj,tjindex){
            sptj.push(tj);
          })
        })
        lcmbxx.spbz = spbz;
        lcmbxx.sptj = sptj;
        api.bcspbztj(lcmbxx).then(response => {
          this.$router.push({ name: '审批流程'});
        })
      },
      addspbztj(){
        let yxj = 1;
        if(this.bztj.length>0){
          yxj =_.last(this.bztj).yxj+1;
        }
        const obj = {};
        obj.yxj = yxj;
        obj.sptj = [];
        obj.spbz = [];
        obj.csr = [];
        this.bztj.push(obj);
      },
      bcsptjbdx(){
        let szjy = true;
        let seljy = true;
        const bdlxEnum = this.bdxlxEnum;
        this.dqtj.forEach(function(tjd) {
          if((tjd.splcbdx.bdxlx ==bdlxEnum.SELECT||tjd.splcbdx.bdbm=='sqr')&&tjd.zffwArr.length==0){
            seljy = false;
          }else if(tjd.splcbdx.bdxlx ==bdlxEnum.NUMBER){
            if(!tjd.zffwArr[0]&&!tjd.zffwArr[4]){
              szjy = false;
            }else if(tjd.zffwArr[0]!=''&&tjd.zffwArr[1]==''){
              szjy = false;
            }else if(tjd.zffwArr[4]!=''&&tjd.zffwArr[3]==''){
              szjy = false;
            }
          }
          if(szjy&&seljy){
            if(tjd.splcbdx.bdxlx ==bdlxEnum.SELECT||tjd.splcbdx.bdbm=='sqr'){
              tjd.bds = "var flag= ('"+tjd.zffwArr.join(',')+"'.indexOf('"+tjd.splcbdx.bdbm+"')!=-1)";
            }else if(tjd.splcbdx.bdxlx ==bdlxEnum.NUMBER){
              tjd.zffwArr[2]=tjd.splcbdx.bdmc;
              if(!tjd.zffwArr[0]){
                tjd.zffwArr[0] = ''
                tjd.zffwArr[1] = '';
                tjd.bds = "var flag= ("+tjd.splcbdx.bdbm+""+tjd.zffwArr[3]+""+tjd.zffwArr[4]+")";
              }else if(!tjd.zffwArr[4]){
                tjd.zffwArr[4] = ''
                tjd.zffwArr[3] = '';
                tjd.bds = "var flag= ("+tjd.zffwArr[0]+""+tjd.zffwArr[1]+""+tjd.splcbdx.bdbm+")";
              }else{
                tjd.bds = "var flag= ("+tjd.zffwArr[0]+""+tjd.zffwArr[1]+""+tjd.splcbdx.bdbm+"&&"+tjd.splcbdx.bdbm+""+tjd.zffwArr[3]+""+tjd.zffwArr[4]+")";
              }
            }
            tjd.zffw=tjd.zffwArr.join(',');
            console.log(tjd.bds);
          }
        })
        if(szjy&&seljy){
          this.bztj[this.yxjindex].sptj= this.dqtj;
          this.dialogzptjVisible = false;
        }else{
          this.$message({ type: 'warning', message: '请完整填写条件!' });
        }
      },
      qxsptjbdx(){
        this.dialogzptjVisible = false;
      },
      xgtjbdx(bdx){
          if(this.dqbdx.indexOf(bdx.bdxid)!=-1){
            const tjbdx ={} ;
            tjbdx.splcbdx=bdx;
            tjbdx.bdxid=bdx.bdxid;
            if(bdx.bdxlx == this.bdxlxEnum.NUMBER){
              tjbdx.zffwArr =[,'<',bdx.bdmc,'<',];
            }else{
              tjbdx.zffwArr =[];
            }
            tjbdx.yxj=this.yxjindex+1;
            tjbdx.mbid=this.mbid;
            this.dqtj.push(tjbdx);
          }else{
            _.remove(this.dqtj, function(n) {
              return n.bdxid==bdx.bdxid;
            });
          }
      },
    }
  }
</script>
<style>
.rowBox{
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: row wrap;
  flex-flow: row wrap;
  margin: 20px 0 10px;
}
.rowlabel{
  padding-left: 30px!important;
  display: block;
  float: left;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  width: 120px;
  margin-top: 10px;
}
.rowlabel span{
  color: #999;
}
.rowcon{
  display: block;
  float: left;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;

}
.approvalAdd i{
  cursor: pointer;
  display: inline-block;
  position: relative;
  font-size: 28px;
  color: #999;
  margin-top: 6px;
}
.spanlabel{
  text-align: right;
  width: 16.6666666667%;
  display: block;
  float: left;
  padding-right: 30px;
  color: #999;
  margin-top: 4px;
}
.spancon{
  display: block;
  float: left;
  width: 83.3333333333%;
}
.el-radio.is-bordered+.el-radio.is-bordered{
  margin-left: 0px;
}
.sprBox{
  margin-bottom: 20px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: row wrap;
  flex-flow: row wrap;
}
.sprBox .el-input__inner{
  height: 32px;
  font-size: 12px;
}
.radioblock .el-radio{
  display: block;
  margin: 8px 0;
}
.radioblock .el-radio+.el-radio{
  margin-left: 0;
}
.checkblock{
  margin-top: 5px;
}
.tjtips{
  display: block;
  margin-bottom: 10px;
}
</style>
