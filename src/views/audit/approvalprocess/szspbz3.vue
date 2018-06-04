<template>
  <div class="app-container calendar-list-container">
      <div class="filter-container">
          <h4>默认审批步骤</h4>
          <div class="rowBox">
              <div class="rowlabel"><span>默认审批人</span></div>
              <div class="rowcon clear">
                  <div class="steps-user-box" v-for="item in mrspbz" :key="item.bzid" @click="szlcbz(item,-1)">
                      <div class="steps-user-con">
                          <i class="el-icon-close"></i>
                          <div class="boxcard">
                              <div class="flexboxcard"><span>{{item.bzmc}}</span></div>
                          </div>
                      </div>
                      <i class="el-icon-arrow-right"></i>
                  </div>
                  <div class="approvalAdd" @click="szlcbz('add',-1)"><i class="el-icon-circle-plus-outline"></i></div>
              </div>
          </div>
      </div>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="bcspbztj">保存</el-button>

      <el-dialog title="设置审批人" :visible.sync="dialogzpbzVisible" width="700px">
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
          <div class="sprBox" v-show="sprlx==splxEnum.YJZG||sprlx==splxEnum.DJZG">
              <span class="spanlabel"></span>
              <div class="spancon">
                  <span class="spanconlabel" v-if="sprlx==1">发起人的</span>
                  <span v-if="sprlx==2">审批终点：</span>
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
                      <el-tag v-for="(bspr,bzrindex) in sxbmspr" v-bind:key="bzrindex" closable @close="scbzcsr(bspr)" >{{bspr.name}}</el-tag>
                      <el-button type="primary" @click="xzspr">选择指定成员</el-button>
                  </div>
              </div>
              <div class="spancon" v-if="sprlx==splxEnum.ZDJS">
                  <!--<el-tag v-model="bzjs" v-if="bzjs">{{bzjs}}</el-tag>-->
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
                      <el-radio v-show="sprlx==splxEnum.ZDJS" label="4">发起人从角色成员中自选</el-radio>
                  </el-radio-group>
              </div>
          </div>
          <div class="sprBox" v-if="sprlx==splxEnum.YJZG">
            <span class="spanlabel">主管代审</span>
            <div class="spancon">
              <el-checkbox class="checkblock" v-model="zgds">若有审批人空缺，由其在通讯录中的上级主管代审批</el-checkbox>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button @click="bcspbz">确 定</el-button>
              <el-button @click="qxszbz">取 消</el-button>
          </div>
      </el-dialog>

      <el-dialog width="600px" title="选择" :visible.sync="dialogxzspr" append-to-body>
          <div class="transferBox">
              <div class="transferpar">
                  <div class="title">选择：</div>
                  <div class="con">
                    <el-input placeholder="请输入内容" v-model="searchxzspr" class="input-with-select">
                      <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <div class="ryCon">
                        <div class="cycon">
                            <el-tree  v-if="sprlx==splxEnum.ZDCY"
                                  ref="xzsprtree" :data="bmsj" :filter-node-method="filterNode" accordion
                                  node-key="treeId" @check-change="handleCheckChange"
                                  show-checkbox :render-after-expand="false" :props="props">
                            </el-tree>
                            <el-tree  v-if="sprlx==splxEnum.ZDJS"
                                    ref="xzsprtree" :data="jssj" :filter-node-method="filterNode" accordion
                                    node-key="treeId" @check-change="handleCheckChange"
                                    :render-after-expand="false" :props="props">
                            </el-tree>
                        </div>
                    </div>
                  </div>
              </div>
              <div class="transferpar">
                <div class="title">已选：</div>
                <div class="con">
                  <div class="ryCon">
                    <div>
                      <el-tag v-for="tag in bzspr" :key="tag.name" @close="handleClose_tag(tag)" closable>{{tag.name}}</el-tag>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button @click="czbmspr">确 定</el-button>
          </div>

      </el-dialog>

  </div>

</template>

<script>
  import * as api  from 'api/audit/approvalprocess/szspbz';
  import {fetchTree,getUsers}  from 'api/admin/group/index';
  export default {
    data() {
      return{
        props: {
          label: 'name',
          children: 'children',
          isLeaf: 'leaf'
        },
        splxEnum:{            //审批类型
          YJZG:'1',//一级主管
          DJZG:'2',//多级主管
          ZDCY:'3',//指定成员
          ZDJS:'4' //指定角色
        },
        mrspbz:[],     //默认审批步骤
        dialogzpbzVisible: false,             //设置审批人弹层
        dialogxzspr:false,                    //选择成员弹层
        dialogxzspjs:false,                   //选择角色弹层
        mbid:'',       //模板id
        bdid:'',       //表单id
        bzid:'',       //当前步骤id
        tzfs:'',       //通知抄送人方式
        sprlx:'',      //审批类型  1.主管(指定一级)  2.主管(连续多级)  3.指定成员  4.角色
        zgdj:'',       //主管等级
        spfs:'',       //审批方式
        zgds:true,    //主管代审
        bzspr:[],      //步骤所选审批人
        bzsprall:[],   //步骤所选审批人--包含不同组的相同人
        bzjs :'',      //步骤所选角色
        mrcsr:[],      //默认抄送人
        bztj:[],       //条件步骤
        bzindex:'',    //步骤下标
        bmsj:[],       //部门数据
        jssj:[],       //角色数据
        sxbmspr:[],    //用户所选步骤角色
        digShowdata:[],
        searchxzspr:'',//搜索框
        listQuery: {
          groupType: '',
          name: undefined
        },
        leaderTags:[],  //部门领导
        dynamicTags:[], //部门成员

      }
    },
    created(){
      this.mbid = this.$route.query.mbid;
      this.cxspbztj()
      this.cxbmsj()
    },
    computed:{

    },
    watch:{
      searchxzspr(val){
          this.$refs.xzsprtree.filter(val);
      }
    },
    methods:{
      //初始化
      cxspbztj(){
          api.cxlcbz(this.mbid).then(response =>{
              const allbz = response.data.spbz;           //审批步骤
              const alltj = response.data.sptj;           //审批条件
              this.tzfs = response.data.tzfs;             //通知抄送人方式
              this.bdid = response.data.bdid;
              const mrspbzs = [];
              const spbztj = [];
              let csr =[];
              alltj.forEach(function(item,index){       //按优先级平排列
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
              });
              allbz.forEach(function(item,index){
                const sfmr = item.sfmr;        //是否默认
                if(sfmr==1){
                  mrspbzs.push(item);
                  if(item.csr){                 // 抄送人
                    csr = item.csr.split(',');
                  }
                }else{
                  const yxj = item.spyxj;       //优先级
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
              });
              this.mrspbz = mrspbzs;
              this.mrcsr = csr;
              this.bztj = spbztj;
          })
      },
      //--------------------设置审批人弹层
      szlcbz(bz,index){                 //bz='add'----添加
          this.dialogzpbzVisible = true;
          //添加默认审批人
          if(bz=='add'){
              this.sprlx = this.splxEnum.YJZG;       //默认审批人类别选择一级主管
              this.spfs = '1';                       //    审批方式为依次审批
              this.zgdj = '';                        //    主管等级选项为空
          }else{                  //bz-----item
              this.sprlx =bz.sprlx.toString();
              this.spfs =bz.spfs.toString();
              this.bzid = bz.bzid;
              this.bzindex = bz.spbz-1;            //审批步骤

              if(this.sprlx ==this.splxEnum.YJZG||this.sprlx ==this.splxEnum.DJZG){
                this.zgdj = bz.spr.toString();
              }
              // else if(this.sprlx ==this.splxEnum.ZDCY){
              //   this.bzspr = bz.spr.toStrig().split(',');
              // }else if(this.sprlx ==this.splxEnum.ZDJS){
              //   this.bzjs = bz.spr.toString();
              // }
          }

      },
      // 审批人类别选择
      bgsplx(){
          this.zgdj = '';
          if(this.sprlx==this.splxEnum.YJZG){         //一级主管
              this.spfs = '1'
          }else if(this.sprlx==this.splxEnum.DJZG){         //多级主管
              this.spfs = '1'
          }else if(this.sprlx==this.splxEnum.ZDCY){         //指定成员
              this.spfs = '2'                          //审批方式 为会签
          }else if(this.sprlx==this.splxEnum.ZDJS){         //指定角色
            this.spfs = '4'                          //审批方式 为发起人从角色成员中自选
          }

      },
      //获取部门+部门下的成员
      cxbmsj(){
        this.listQuery.xxdm = window.localStorage.getItem("xxdm");
        var QueryIt1 = this.listQuery
        QueryIt1.groupType = "1"
        fetchTree(QueryIt1).then(data => {
            this.jssj = data;
        });
        var QueryIt2 = this.listQuery
        QueryIt2.groupType = "2"
        fetchTree(QueryIt2).then(data => {
            console.log(data)
            data.forEach(function (item,index) {
              item.children=item.children?item.children:[];
              getUsers(item.id).then(response => {
                var leaderItem = response.data.leaders;
                var memberItem = response.data.members;
                var itdem = leaderItem
                memberItem.forEach(function (itemuser,indexu) {
                  if(_.find(itdem,['username', itemuser.username])){
                    return false
                  }else{
                    itdem.push(itemuser)
                  }
                })
                itdem.forEach(function (dtitem,ind) {
                  dtitem.treeId = index+"+"+ind
                  item.children.push(dtitem)
                })
              })
            })
        });
      },
      filterNode(value, data){
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      // 审批人类别--指定成员--选择指定成员
      xzspr(){
          // this.cxbmsj("2")      //获取部门  2
          this.dialogxzspr=true;
          this.bzspr = this.sxbmspr;
          this.bzsprall=this.bzsprall?this.bzsprall:this.bzspr
          var checkkey=[];
          var that = this
          this.bzsprall.forEach(function (item,index) {
              checkkey.push(item.treeId)
          })
          if(this.$refs.xzsprtree){
            this.$refs.xzsprtree.setCheckedKeys(checkkey);
          }
      },

      handleCheckChange(data, checked){
          var samedt = _.find(this.bzspr,['username', data.username]);        //点击的data在选中的数组里有没有相同的
          if(checked && !data.parentId){          //选中
              this.bzsprall.push(data)
              if(samedt){
                 return false
              }else{
                this.bzspr.push(data)
              }
          }else if(!checked && !data.parentId){
              this.bzsprall=_.without(this.bzsprall,data)
              var specdata = _.find(this.bzsprall,['username', data.username]); //判断该人还有没有重复
              if(!specdata){
                this.bzspr=_.without(this.bzspr,samedt)
              }else{
                  return false
              }
          }
      },
      handleClose_tag(tag) {                  //删除所选成员
        this.bzspr.splice(this.bzspr.indexOf(tag), 1);
        var that = this
        this.bzsprall.forEach(function (item,index) {
            if(item.username==tag.username){
                that.bzsprall = _.without(that.bzsprall,item)
            }
        })
        var checkkey=[];
        this.bzsprall.forEach(function (item,index) {
          checkkey.push(item.treeId)
        })
        this.$refs.xzsprtree.setCheckedKeys(checkkey);
      },
      // 审批人类别--角色--选择指定角色
      xzspjs(){
        // this.cxbmsj("1")      //获取角色    1
        this.dialogxzspr = true
      },
      //  成员选择弹层页确定按钮
      czbmspr(){
        this.dialogxzspr = false;
        if(this.sprlx=='3'){        //指定成员
            this.sxbmspr = this.bzspr;           //指定成员
            // console.log(this.sxbmspr)

        }
        // if(this.sprlx=='4'){       //角色
        //   this.bzjs = this.sxbmspr;
        // }
      },
      //审批页--删除指定成员
      scbzcsr(tag){
          this.sxbmspr.splice(this.sxbmspr.indexOf(tag), 1);
          this.bzsprall=this.bzsprall?this.bzsprall:this.sxbmspr
          var that = this
          this.bzsprall.forEach(function (item,index) {
            if(item.username==tag.username){
              that.bzsprall = _.without(that.bzsprall,item)
            }
          })
      },
      //设置审批人弹层--确定按钮
      bcspbz(){
          var flag= true;
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
            let dqlcbz={};                //表单~~
            dqlcbz.sprlx=this.sprlx;    //审批人类别
            dqlcbz.spfs=this.spfs;      //审批方式
            dqlcbz.mbid=this.mbid;

            console.log(this.zgdj)
            if(this.sprlx ==this.splxEnum.YJZG){        //一级主管
              dqlcbz.bzmc='第'+this.zgdj+"级主管";
              dqlcbz.spr=this.zgdj;
            }else if(this.sprlx ==this.splxEnum.DJZG){
              dqlcbz.bzmc='从直接主管到第'+this.zgdj+"级主管";
              dqlcbz.spr=this.zgdj;
            }
            // else if(this.sprlx ==this.splxEnum.ZDCY){
            //   dqlcbz.bzmc=this.bzspr.length+'人';
            //   dqlcbz.spr=this.bzspr.join(',');
            // }else if(this.sprlx ==this.splxEnum.ZDJS){
            //   dqlcbz.bzmc=this.bzjs;
            //   dqlcbz.spr=this.bzjs;
            // }

            // if(this.bzid!=''){
            //   if(this.yxjindex==-1){
            //     dqlcbz=this.mrspbz[this.bzindex];
            //   }else if(this.yxjindex>=0){
            //     dqlcbz=(this.bztj[this.yxjindex].spbz)[this.bzindex];
            //   }
            // }
            if(this.bzid==''){
              // let zhbz ={};
              // if(this.yxjindex==-1){
              //   zhbz = _.last(this.mrspbz);
              //   if(zhbz){
              //     dqlcbz.spyxj=zhbz.spyxj;
              //     dqlcbz.spbz=zhbz.spbz+1;
              //   }else{
              //     dqlcbz.spyxj=this.yxjindex;
              //     dqlcbz.spbz=1;
              //   }
              //   dqlcbz.sfmr=1;
              //   this.mrspbz.push(dqlcbz);
              // }else if(this.yxjindex>=0){
              //   zhbz=_.last(this.bztj[this.yxjindex].spbz);
              //   if(zhbz){
              //     dqlcbz.spyxj=zhbz.spyxj;
              //     dqlcbz.spbz=zhbz.spbz+1;
              //   }else{
              //     dqlcbz.spyxj=this.yxjindex+1;
              //     dqlcbz.spbz=1;
              //   }
              //   this.bztj[this.yxjindex].spbz.push(dqlcbz);
              // }
            }
            this.dialogzpbzVisible = false;
          }else{
            this.$message({ type: 'warning', message: '请完整填写审批步骤!' });
          }

      },
      //设置审批人弹层--取消按钮
      qxszbz(){
          this.dialogzpbzVisible = false;
      },
      // 流程步骤--保存
      bcspbztj(){

      }
    }
  }
</script>
<style>
  .clear:after{content:"\20";display:block;height:0;clear:both}
  .filter-container{
    min-width: 920px;
  }
  .steps-user-box{
    display: inline-block;
    position: relative;
    margin-bottom: 20px;
  }
  .steps-user-box .el-icon-arrow-right{
    font-size: 30px; line-height: 40px;
  }
  .steps-user-con{
    float: left; position: relative;
  }
  .steps-user-con .el-icon-close{
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 1;
    display: none;
    cursor: pointer;
  }
  .steps-user-con:hover .el-icon-close{
    display: block;
  }
  .steps-user-con:hover .boxcard{
    background: #EDF5FA;
  }
  .steps-user-con .boxcard{
    min-width: 140px;
    padding-left: 16px;
    background: #f8f8f8;
    border-radius: 4px;
    -webkit-transition: all .2s;
    -o-transition: all .2s;
    transition: all .2s;
    cursor: move;
  }
  .steps-user-con .boxcard .flexboxcard{
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    height: 40px;
    font-size: 12px;
    color: #333;
    padding-right: 16px;
  }
  .steps-user-con .boxcard span{
    vertical-align: top;
    line-height: 24px;
    margin-left: 6px;
    white-space: nowrap;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    max-width: 280px;
  }
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
    width: 80%;
    min-width: 800px;

  }
  .approvalAdd{
    display: inline-block;
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
  .transferBox{
    width: 100%;
    overflow: hidden;
  }
  .transferpar{
    width: 50%;
    float: left;
    padding-right: 10px;
  }
  .transferpar:last-child{
    padding-left: 10px;
  }
  .transferpar .title{
    font-size: 16px;
    color: #363636;
    padding: 14px 0px;
  }
  .transferpar .con{
    padding: 10px;
    width: 100%;
    border: 1px solid #dedede;
    border-radius: 4px;
    background: #f4f6f8;
    height: 362px;
  }
  .transferpar .ryCon{
    margin-top: 10px;
  }
  .transferpar .ryCon .list_item{
    width: 100%;
    list-style: none;
    padding: 5px;
    font-size: 14px;
    color: #363636;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    padding-right: 45px;
  }
  .transferpar .ryCon .list_item  i{
    color: #38adff;
    font-size: 14px;
    position: absolute;
    right: 0px;
    cursor: pointer;
    padding-left: 10px;
    border-left: 1px solid #eee;
    -webkit-text-stroke-width: inherit;
    text-stroke-width: inherit;
  }
  .transferpar .ryCon .cycon{
    overflow: auto;
    height: 260px;
  }
  .navbarbox{
    position: relative;
    margin: 5px 0;
  }
  .navbarbox .item{
    max-width: 33%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #38adff;
    float: left;
    position: relative;
    cursor: pointer;
    font-size: 14px;
    padding-left: 22px;
    line-height: 20px;
  }
  .navbarbox .item:last-child{
    color: #333;
    cursor: default;
  }
  .navbarbox .item i{
    position: absolute;
    left: 2px;
    color: #333;
    line-height: 20px;
  }
  .transferpar .ryCon .el-tree{
    background: none;
  }
  .transferpar .ryCon .el-tag{
    margin: 5px 5px 5px 0;
  }
</style>
