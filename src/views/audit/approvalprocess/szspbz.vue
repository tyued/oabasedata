<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <h3 style="margin-top: 0">{{lcmc}}</h3>
      <h4>默认审批步骤</h4>
      <div class="rowBox">
        <div class="rowlabel"><span>默认审批人</span></div>
        <div class="rowcon clear">
          <div class="steps-user-box" v-for="item in mrspbz" :key="item.bzid"
              draggable="true" @dragend="dragend()" @dragstart='dragstart($event,item)' @drop="drop($event,item)"  @dragover='allowDrop($event)'>
            <div class="steps-user-con">
              <i class="el-icon-close" @click="sclcbz(-1,item.spbz)"></i>
              <div class="boxcard" @click="szlcbz(item,-1)">
                <div class="flexboxcard"><span>{{item.bzmc}}</span></div>
              </div>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="approvalAdd" @click="szlcbz('add',-1)"><i class="el-icon-circle-plus-outline"></i></div>
        </div>
      </div>
      <div class="rowBox">
        <div class="rowlabel"><span>默认抄送人</span></div>
        <div class="rowcon clear">
          <div class="tagdiv">
            <el-tag v-for="(item,csrindex) in mrcsr" :key="item.id" closable @close="scmccsr(csrindex,mrcsr)" >{{item.name}}</el-tag>
            <div class="approvalAdd" @click="xzspr('bm','mrcsr',mrcsr)"><i class="el-icon-circle-plus-outline"></i></div>
          </div>
        </div>
      </div>
    </div>
    <div class="filter-container">
      <h4>按条件审批
        <el-button size="mini" @click="addspbztj()">添加</el-button>
      </h4>
      <div class="cardBox" v-for="(item,index) in bztj"  v-bind:key="index"
            draggable="true" @dragend="dragendCard()" @dragstart='dragstartCard($event,item)' @drop="dropCard($event,item)"  @dragover='allowDropCard($event)'>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>优先级{{ item.yxj }}</span>
            <span style="margin-left: 12px;">
            <el-button style=" padding: 3px 0" @click ="bjsptj(index)" type="text">编辑</el-button>
            <el-button style=" padding: 3px 0" @click ="scbztj(index)" type="text">删除</el-button>
            </span>
          </div>
          <div v-for="tj in item.sptj" :key="tj.bds" class="text item">
            <span v-if="tj.splcbdx.bdxlx==1">{{tj.splcbdx.bdmc}}在"{{tj.zffw}}"范围内</span>
            <span v-else-if="tj.splcbdx.bdxlx==3">{{tj.zffw.replace(/,/g, "").replace(/==/g, "=")}} (单位:天)</span>
            <span v-else-if="tj.splcbdx.bdbm=='sqr'">申请人为：{{tj.zffwname}}</span>
          </div>
          <div class="rowBox">
            <div class="rowlabel"><span>审批人</span></div>
            <div class="rowcon clear">
              <div class="steps-user-box" v-for="bz in item.spbz" :key="bz.bzid">
                <div class="steps-user-con" @click ="bjsptj(index)">
                  <div class="boxcard">
                    <div class="flexboxcard"><span>{{bz.bzmc}}</span></div>
                  </div>
                </div>
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
          <div class="rowBox">
            <div class="rowlabel"><span>抄送人</span></div>
            <div class="rowcon clear">
              <div class="tagdiv">
                <el-tag v-for="csr in item.csrData" :key="csr.id" >{{csr.name}}</el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="filter-container">
      <h4>其他设置</h4>
      <div class="rowBox otherSet">
        <div class="rowlabel"><span>通知方式</span></div>
        <div class="rowcon clear">
          <el-select v-model="tzfs" placeholder="请选择">
            <el-option label="不通知" :value="1"></el-option>
            <el-option label="短信通知" :value="2"></el-option>
<!--            <el-option label="微信通知" :value="2"></el-option>
            <el-option label="钉钉通知" :value="3"></el-option>-->
          </el-select>
        </div>
      </div>
    </div>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="bcspbztj">保存</el-button>

    <el-dialog title="设置审批人" :visible.sync="dialogzpbzVisible" width="800px">
      <div class="sprBox">
        <span class="spanlabel">审批人类别</span>
        <div class="spancon">
          <el-radio-group v-model="sprlx" size="mini" @change="bgsplx">
            <el-radio label="1" border style="margin-right: 10px;">主管(指定一级)</el-radio>
            <el-radio label="2" border  style="margin-right: 10px;">主管(连续多级)</el-radio>
            <el-radio label="3" border  style="margin-right: 10px;">指定成员</el-radio>
            <el-radio label="4" border  style="margin-right: 10px;">角色</el-radio>
            <el-radio label="5" border  style="margin-right: 10px;">表单项</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="sprBox" v-show="sprlx==splxEnum.YJZG||sprlx==splxEnum.DJZG">
        <span class="spanlabel"></span>
        <div class="spancon">
          <span class="spanconlabel" v-if="sprlx==splxEnum.YJZG">发起人的</span>
          <span v-if="sprlx==splxEnum.DJZG">审批终点：</span>
          <el-select v-model="zgdj" placeholder="请选择">
            <el-option label="第一级主管" value="1"></el-option>
            <el-option label="第二级主管" value="2"></el-option>
            <el-option label="第三级主管" value="3"></el-option>
            <el-option label="第四级主管" value="4"></el-option>
            <el-option label="第五级主管" value="5"></el-option>
            <el-option label="第六级主管" value="6"></el-option>
            <el-option label="第七级主管" value="7"></el-option>
            <el-option label="第八级主管" value="8"></el-option>
            <el-option label="第九级主管" value="9"></el-option>
            <el-option label="第十级主管" value="10"></el-option>
          </el-select>
        </div>
      </div>
      <div class="sprBox" v-show="sprlx==splxEnum.ZDCY||sprlx==splxEnum.ZDJS">
        <span class="spanlabel"></span>
        <div class="spancon" v-if="sprlx==splxEnum.ZDCY">
          <span class="tjtips">选择指定成员（单个节点审批人不超过10人）</span>
          <div>
            <el-tag v-for="(bspr,bzrindex) in sxbmspr" v-bind:key="bzrindex" closable @close="scbzcsr(bspr)" >{{bspr.name}}</el-tag>
            <el-button type="primary" @click="xzspr('bm','bmjs',sxbmspr)">选择指定成员</el-button>
          </div>
        </div>
        <div class="spancon" v-if="sprlx==splxEnum.ZDJS">
          <el-tag v-for="bjs in sxbmspr" :key="bjs.id">{{bjs.name}}</el-tag>
          <el-button type="primary" @click="xzspr('js','bmjs',sxbmspr)">选择指定成员角色</el-button>
        </div>
      </div>
      <div class="sprBox" v-show="sprlx==splxEnum.BDX">
        <span class="spanlabel"></span>
        <div>
          <el-checkbox-group v-model="sxbmsprid" class="diaggroup">
            <el-checkbox v-for="bdx in bzbdx" :label="bdx.bdbm" :key="bdx.bdxid">{{bdx.bdmc}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="sprBox">
        <span class="spanlabel">审批方式</span>
        <div class="spancon">
          <el-radio-group v-model="spfs" class="radioblock">
            <el-radio v-show="sprlx==splxEnum.YJZG||sprlx==splxEnum.DJZG||sprlx==splxEnum.BDX" label="1" >依次审批（本环节内审批人依次审批）</el-radio>
            <el-radio v-show="sprlx==splxEnum.YJZG||sprlx==splxEnum.ZDCY||sprlx==splxEnum.ZDJS||sprlx==splxEnum.BDX" label="2" >会签（需所有审批人同意）</el-radio>
            <el-radio v-show="sprlx==splxEnum.YJZG||sprlx==splxEnum.ZDCY||sprlx==splxEnum.ZDJS||sprlx==splxEnum.BDX" label="3" >或签（任意一名审批人同意或拒绝）</el-radio>
            <!--<el-radio v-show="sprlx==splxEnum.ZDJS" label="4">发起人从角色成员中自选</el-radio>-->
          </el-radio-group>
        </div>
      </div>
      <div class="sprBox" v-if="sprlx==splxEnum.YJZG">
        <!--<span class="spanlabel">主管代审</span>-->
        <div class="spancon">
          <span style="color: #999;margin-left: 25px;" class="checkblock" >提示：若有审批人空缺，由其在通讯录中的上级主管代审批</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bcspbz">确 定</el-button>
        <el-button @click="qxszbz">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog width="800px" :title="maintitle" :visible.sync="dialogxzspr" append-to-body @close="closeModel">
      <div class="transferBox">
        <div class="transferpar">
          <div class="title">选择：</div>
          <div class="con" style="height: 450px;">
            <el-input placeholder="请输入内容" v-model="searchxzspr" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click.stop="trysearch"></el-button>
            </el-input>
            <el-tabs v-model="activeName">
              <el-tab-pane v-if="sprChoseType=='bm'||sprChoseType=='all'" label="组织架构" name="first">
                <div>
                  <div>
                    <el-button v-for="(label, labindex) in tablist" :key="labindex" type="text" @click.stop="getallstatus(label, labindex)">{{label.label}}</el-button>
                  </div>
                </div>
                <div class="ryCon">
                  <div class="cycon" style="height:250px;">
                    <!-- 选择人员组件 -->
                    <div>
                      <choose-member :sxbmspr="waitmember" :departmentmemberId="departmentmemberId" @checkclick="checkclick" :search="search" :searchmenmberlist="searchmenmberlist" :departmentleader="departmentleader" :departmentmember="departmentmember" :childrendepartment="childrendepartment" @nextpage="nextpage" :isnext="isnext" :dataSource="dapartmentlist"></choose-member>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane v-if="sprChoseType=='js'||sprChoseType=='all'" label="角色列表" name="second">
                <div>
                  <div>
                    <el-button type="text" @click.stop="showAlljs">所有角色</el-button>
                  </div>
                </div>
                <div class="ryCon">
                  <div class="cycon">
                    <el-tree :data="searchjssj" :filter-node-method="filterNode" accordion
                             @node-click="handleNodeClick_jssj" :render-after-expand="false" >
                    </el-tree>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="transferpar">
          <div class="title">已选：</div>
          <div class="con" style="height: 450px;">
            <div class="ryCon">
              <div>
                <el-tag v-for="tag in bzspr" :key="tag.id" @close="handleClose_tag(tag)" closable>{{tag.name}}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="czbmspr">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog class="diagsettj" title="设置审批条件" :visible.sync="dialogzptjVisible" width="940px" @close="closeit">
      <div class="diag-container">
        <h5>当审批同时满足以下条件时</h5>
        <el-checkbox-group v-model="dqbdx" class="diaggroup">
          <el-checkbox @change="xgtjbdx(bdx)" v-for="bdx in tjbdx" :label="bdx.bdxid" :key="bdx.bdxid">{{bdx.bdmc}}</el-checkbox>
        </el-checkbox-group>
        <div class="diagrowBox" v-for="(tj,tjindex) in dqtj" :key="tj.tjid" >
          <div class="rowBox"  v-if="tj.splcbdx.bdxlx==1">
            <div class="rowlabel" style="position:relative;"><span class="tj-bdmc">{{tj.splcbdx.bdmc}}</span></div>
            <div class="rowcon clear">
              <el-checkbox-group v-model="tj.zffwArr" >
                <el-checkbox v-for="lx in tj.splcbdx.selectArr" :label="lx" :key="lx">{{lx}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="rowBox" v-if="tj.splcbdx.bdxlx==3">
            <div class="rowlabel" style="position:relative;"><span class="tj-bdmc">{{tj.splcbdx.bdmc}}</span></div>
            <div style="width: 150px;margin:0;padding-top: 10px;">
              <el-select v-model="value" placeholder="请选择" style="width: 130px;" @change="choosecondition">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div  class="rowcon clear" v-show="!conditionaltype">
                <el-input-number :min="0" v-model="num2" controls-position="right" placeholder="请输入内容"></el-input-number>
            </div>
            <div class="rowcon clear" v-show="conditionaltype">
              <el-input-number :min="0" v-model="num1" controls-position="right" placeholder="请输入内容"></el-input-number>
              <el-select v-model="symbol1">
                <el-option label="<" value="<"></el-option>
                <el-option label="<=" value="<="></el-option>
              </el-select>
              <span v-model="tj.zffwArr[2]">时长(天)</span>
              <el-select v-model="symbol2">
                <el-option label="<" value="<"></el-option>
                <el-option label="<=" value="<="></el-option>
              </el-select>
              <el-input-number :min="0" v-model="num3" controls-position="right" placeholder="请输入内容"></el-input-number>
            </div>
          </div>
          <div class="rowBox"  v-if="tj.splcbdx.bdbm=='sqr'">
            <div class="rowlabel" style="position:relative;"><span class="tj-bdmc">{{tj.splcbdx.bdmc}}</span></div>
            <div class="rowcon clear">
              <el-tag v-for="(fw,fwindex) in tj.zffwArrOnly" :key="fw.id" closable @close="scbdxspr(tj,fw,tjindex)" >{{fw.name}}</el-tag>
              <el-button @click="xzspr('all','tjbmjs',tj.zffwArrOnly)">选择指定成员</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="diag-container diag-sprbox">
        <h5>对应审批步骤</h5>
        <div class="rowBox">
          <div class="rowlabel"><span>审批人</span></div>
          <div class="rowcon clear">
            <div class="steps-user-box" v-for="bz in dqcpr" :key="bz.bzid">
              <div class="steps-user-con">
                <i class="el-icon-close" @click="sclcbz(yxjindex,bz.spbz)"></i>
                <div class="boxcard" @click="szlcbz(bz,yxjindex)">
                  <div class="flexboxcard"><span>{{bz.bzmc}}</span></div>
                </div>
              </div>
              <i class="el-icon-arrow-right"></i>
            </div>
            <div class="approvalAdd" @click="szlcbz('add',yxjindex)"><i class="el-icon-circle-plus-outline"></i></div>
          </div>
        </div>
        <div class="rowBox">
          <div class="rowlabel"><span>抄送人</span></div>
          <div class="rowcon clear">
            <div class="tagdiv">
              <el-tag v-for="(item,csrindex) in dqcsr" v-bind:key="csrindex" closable @close="scmccsr(csrindex,dqcsr)" >{{item.name}}</el-tag>
              <div class="approvalAdd" @click="xzspr('bm','dqcsr',dqcsr)"><i class="el-icon-circle-plus-outline"></i></div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bcsptjbdx">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from 'api/audit/approvalprocess/szspbz'
  import { fetchTree, getUsers, Searchmember, Getallteacher } from 'api/admin/group/index'
  import ChooseMember from './ChooseMember'
  import { setlocal, getlocal, clearlocal } from '../../../utils/local'
  import Vue from 'vue'
  export default {
    components: {
      ChooseMember
    },
    data() {
      return {
        options: [{
          value: 1,
          label: '小于'
        }, {
          value: 2,
          label: '大于'
        }, {
          value: 3,
          label: '小于等于'
        }, {
          value: 4,
          label: '等于'
        }, {
          value: 5,
          label: '大于等于'
        }, {
          value: 6,
          label: '介于(两个数之间)'
        }],
        value: '',

        dapartmentlist: [], // 部门列表
        props: {
          label: 'name',
          children: 'children',
          isLeaf: 'leaf'
        },
        lcmc: '',
        mbid: '',       // 模板id
        mrspbz: [],     // 默认审批流程--默认审批人
        mrcsr: [],      // 默认审批流程--默认抄送人
        bztj: [],       // 分条件审批
        bdid: '',       // 表单id
        tzfs: '',       // 通知抄送人方式
        bzid: '',       // 当前步骤id
        bzindex: '',    // 步骤下标
        yxjindex: '',   // 优先级下标

        dialogzpbzVisible: false,  // 审批人弹层
        splxEnum: {            // 审批类型
          YJZG: '1', // 一级主管
          DJZG: '2', // 多级主管
          ZDCY: '3', // 指定成员
          ZDJS: '4', // 指定角色
          BDX: '5' // 表单项
        },
        sprlx: '',      // //审批人类别  1.主管(指定一级)  2.主管(连续多级)  3.指定成员  4.角色 5 表单项
        zgdj: '',       // 主管等级
        sxbmspr: [],    // 指定成员
        sxbmsprid: [],  // 指定成员id
        spfs: '',       // 审批方式
        dialogxzspr: false,        // 添加成员弹层
        searchxzspr: '', // 搜索
        bmsj: [],       // 部门数据
        bmsjallrem: [],  // 部门里所有人--不包括部门
        bzspr: [],      // 所选审批人
        bzsprall: [],   // 所选审批人--全部包含重复姓名
        jssj: [],       // 角色数据
        searchjssj: [],       // 筛选后的角色
        dialogzptjVisible: false,  // 设置审批条件弹层
        bdxlxEnum: {
          SELECT: 1, // 下拉框
          DATE: 2, // 时间
          NUMBER: 3, // 数字
          TEXT: 4, // 文本
          FILE: 5, // 文件
          IMAGE: 6 // 图片
        },
        dqtj: [],        // 设置审批条件
        tjbdx: [],       // 审批选项
        bzbdx: [],       // 可作为审批步骤的表单项
        dqbdx: [],       // 审批选项--选中的
        dqcpr: [],       // 条件审批人
        dqcsr: [],       // 条件抄送人

        Stepdragging: null,
        Stepdrag: false,
        StepdraggingCard: null,
        StepdragCard: false,

        activeName: '',
        isnext: true, // 部门数据显示
        tablist: [
          { label: '所有部门', id: 1 }
        ], // 上部导航数组暂存
        childrendepartment: [], // 子部门暂存
        departmentmember: [], // 部门成员暂存
        departmentleader: [], // 部门领导暂存
        searchmenmberlist: [], // 搜索数据列表
        search: false, // 是否为搜索
        departmentmemberId: null,
        maintitle: '设置审批人',
        waitmember: [], // 指定成员暂存
        conditionaltype: false, // 条件选取后使用的条件输入框控制
        conditionalid: 0, // 条件选取后用于取值方向判定
        isadd: false, // 是否为新添加条件
        // (绑定时长定义)
        num1: '', // 变量1
        num2: '', // 变量2
        num3: '', // 变量3
        symbol1: '<', // 第一个大小变量
        symbol2: '<', // 第二个大小变量
        sprChoseType: '', // 可选审批人类型 部门/角色/ALL
        sprSetType: ''   // 设置审批人的类型 抄送人 条件 部门角色
      }
    },
    created() {
      this.mbid = this.$route.query.mbid;
      this.cxbmsj();
    },
    mounted() {
      this.cxspbztj();
    },
    methods: {
      closeit() {
        this.dialogzptjVisible = false
        this.num1 = ''
        this.num3 = ''
        this.symbol1 = '<'
        this.symbol2 = '<'
        this.num2 = ''
      },
      // 选择条件方式
      choosecondition(val) {
        this.conditionalid = val
        if (val === 6) {
          this.dqtj.forEach(el => {
            if (el.splcbdx.bdxlx === 3) {
              this.symbol1 = '<'
              this.symbol2 = '<'
              this.num3 = ''
            }
          })
          this.conditionaltype = true
        } else {
          this.dqtj.forEach(el => {
            if (el.splcbdx.bdxlx === 3) {
              this.num1 = ''
              this.symbol1 = ''
              if (val === 1) {
                this.symbol2 = '<'
              }
              if (val === 2) {
                this.symbol2 = '>'
              }
              if (val === 3) {
                this.symbol2 = '<='
              }
              if (val === 4) {
                this.symbol2 = '=='
              }
              if (val === 5) {
                this.symbol2 = '>='
              }
            }
          })
          this.conditionaltype = false
        }
      },
      // 拖拽-----默认
      dragstart(event, item) {
        this.Stepdragging = item
        this.Stepdrag = true
      },
      dragend() {
        this.Stepdragging = null
        this.Stepdrag = false
      },
      allowDrop(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move'  // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
      },
      drop(event, item) {
        event.preventDefault();
        if (this.Stepdrag) {
          event.dataTransfer.effectAllowed = 'move'// 为需要移动的元素设置dragstart事件
          if (item === this.Stepdragging) {
            return
          }
          const newItems = [...this.mrspbz]
          const src = newItems.indexOf(this.Stepdragging)
          const dst = newItems.indexOf(item)

          const dt = this.Stepdragging
          const dd = item
          newItems[src] = dd
          newItems[dst] = dt

          this.mrspbz = newItems
          this.mrspbz.forEach((list, index) => {
            list.spbz = index + 1
          })
        }
      },
      // 拖拽-----按条件
      dragstartCard(event, item) {
        this.StepdraggingCard = item
        this.StepdragCard = true
      },
      dragendCard() {
        this.StepdraggingCard = null
        this.StepdragCard = false
      },
      allowDropCard(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move1'  // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
      },
      dropCard(event, item) {
        event.preventDefault();
        if (this.StepdragCard) {
          event.dataTransfer.effectAllowed = 'move1'// 为需要移动的元素设置dragstart事件
          if (item === this.StepdraggingCard) {
            return
          }
          const newItems = [...this.bztj]
          const src = newItems.indexOf(this.StepdraggingCard)
          const dst = newItems.indexOf(item)

          const dt = this.StepdraggingCard
          const dd = item
          newItems[src] = dd
          newItems[dst] = dt

          this.bztj = newItems
          this.bztj.forEach((list, index) => {
            list.yxj = index + 1
            list.sptj.forEach(sptjli => {
              sptjli.yxj = index + 1
            })
            list.spbz.forEach(spbzli => {
              spbzli.spyxj = index + 1
            })
          })
        }
      },
      // 初始化
      cxspbztj() {
        api.cxlcbz(this.mbid).then(response => {
          this.lcmc = response.data.lcmc;
          this.tzfs = response.data.tzfs;             // 通知抄送人方式
          this.bdid = response.data.bdid;             // 表单id
          const allbz = response.data.spbz;           // 审批步骤
          const alltj = response.data.sptj;           // 审批条件
          const mrspbzs = [];
          const spbztj = [];                          // 分条件审批
          let csr = [];
          alltj.forEach(item => {       // 按优先级平排列--分条件审批
            const yxj = item.yxj;
            const yxjtj = _.find(spbztj, ['yxj', yxj]);
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
          allbz.forEach(item => {         // 按优先级平排列--分条件审批--审批人+抄送人
            const sfmr = item.sfmr;        // 是否默认   为1则为默认审批流程  其余为按优先级排
            if (sfmr === 1) {
              mrspbzs.push(item);          // 默认审批流程--审批人
              if (item.csr || csr === []) {                 // 默认审批流程-- 抄送人
                csr = item.csr.split(',');
              }
            } else {
              const yxj = item.spyxj;       // 优先级
              const yxjbz = _.find(spbztj, ['yxj', yxj]);
              if (yxjbz) {
                yxjbz.spbz.push(item);
                if (item.csr) {
                  yxjbz.csr = item.csr.split(',');
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
          this.mrspbz = mrspbzs;          // 默认审批流程--默认审批人
          this.bztj = spbztj;             // 分条件审批
          let bmsjall = []
          const treeShow = setInterval(() => {
            if (this.bmsjallrem === bmsjall) {
              this.mrcsr = this.matchspr(csr);        // 默认审批流程--默认抄送人

              let cyitem = []
              this.bztj.forEach(item => {
                item.csrData = this.matchspr(item.csr);        // 按条件审批流程--抄送人
                item.sptj.forEach(tj => {
                  if (tj.splcbdx.bdbm === 'sqr') {
                    // 匹配spr
                    tj.zffwArrOnly = this.matchspr(tj.zffwArr);
                    const zffJson = []
                    tj.zffwArrOnly.forEach(zff => {
                      zffJson.push(zff.name)
                    })
                    tj.zffwname = zffJson.join(',')
                  }
                })
              })
              clearInterval(treeShow)
            } else {
              bmsjall = this.bmsjallrem
            }
          }, 100);
          api.cxbzbdx(this.bdid).then(response => {
            this.bzbdx = response;
          });
          api.cxbtbdx(this.bdid).then(response => {
            this.tjbdx = response;
          })
        });
      },
      // 审批人--弹层
      szlcbz(bz, index) {
        this.dialogzpbzVisible = true;
        this.yxjindex = index;
        this.sxbmspr = [];
        this.sxbmsprid = [];
        if (bz === 'add') {            // 新添审批人
          this.sprlx = this.splxEnum.YJZG;       // 默认审批人类别选择一级主管
          this.spfs = '1';                       //    审批方式为依次审批
          this.zgdj = '';                        //    主管等级选项为空
          this.bzid = '';                        // 当前步骤id
        } else {
          this.sprlx = bz.sprlx.toString();
          this.spfs = bz.spfs.toString();
          this.bzid = bz.bzid;
          this.bzindex = bz.spbz - 1;            // 审批步骤
          // YJZG 一级主管 DJZG 多级主管 ZDCY 指定成员 ZDJS 指定角色
          if (this.sprlx === this.splxEnum.YJZG || this.sprlx === this.splxEnum.DJZG) {
            this.zgdj = bz.spr.toString();
          } else if (this.sprlx === this.splxEnum.ZDCY) {
            const name = bz.spr.split(',')           // 成员id
            const matchItem = this.matchspr(name);        // 按成员id匹配
            matchItem.forEach(item => {
              item.IsSelect = true
            })
            this.sxbmspr = matchItem;
            matchItem.forEach(item => {
              this.sxbmsprid.push(item.id)
            })
          } else if (this.sprlx === this.splxEnum.ZDJS) {
            const bjjsxx = _.find(this.jssj, ['id', bz.spr]);
            if (bjjsxx) {
              this.sxbmspr.push(bjjsxx);
            }
          } else if (this.sprlx === this.splxEnum.BDX) {
            const bdxidArr = bz.spr.split(',');
            this.sxbmsprid = bdxidArr;
          }
        }
      },
      // 审批人类别选择
      bgsplx() {
        this.zgdj = '';
        this.sxbmspr = [];
        this.sxbmsprid = [];
        if (this.sprlx === this.splxEnum.YJZG) {         // 一级主管
          this.spfs = '1'
        } else if (this.sprlx === this.splxEnum.DJZG) {         // 多级主管
          this.spfs = '1'
        } else if (this.sprlx === this.splxEnum.ZDCY) {         // 指定成员
          this.spfs = '2'
        } else if (this.sprlx === this.splxEnum.ZDJS) {         // 指定角色
          this.spfs = '2'
        } else if (this.sprlx === this.splxEnum.BDX) {         // 指定角色
          this.spfs = '1'
        }
      },
      // 删除指定成员
      scbzcsr(tag) {
        this.sxbmspr.splice(this.sxbmspr.indexOf(tag), 1);
        this.sxbmsprid.splice(this.sxbmsprid.indexOf(tag.id), 1)
      },
      scbdxspr(list, item, tjindex) {
        const thiszffw = list.zffwArrOnly;
        const index = thiszffw.indexOf(item);
        const thiszffwArr = list.zffwArr;
        const arrindex = thiszffwArr.indexOf(item.id);
        thiszffw.splice(index, 1);
        thiszffwArr.splice(arrindex, 1);
        this.$set(list, 'zffwArrOnly', thiszffw);
        this.$set(list, 'zffwArr', thiszffwArr);
        this.$set(this.dqtj, tjindex, list);
      },
      // 添加成员按钮点击
      xzspr(chooseType, setType, data) {
        this.sprChoseType = chooseType;
        this.sprSetType = setType;
        this.searchxzspr = '';
        this.maintitle = '请选择';
        this.search = false;
        this.isnext = false;
        this.getdepartmentlist();
        if (chooseType === 'js') {
          this.activeName = 'second';
          this.bzspr = data;
        } else {
          this.activeName = 'first';
          if (data) {
            this.bzspr = getlocal('departmentmembers') ? getlocal('departmentmembers') : data.length ? data : [];
          } else {
            this.bzspr = [];
          }
        }
        this.dialogxzspr = true;
      },
      // 按成员id匹配name item
      matchspr(alldata) {
        const returnData = [];
        alldata.forEach(exp => {
          const js = _.find(this.jssj, ['id', exp]);
          const bm = _.find(this.bmsjallrem, ['id', exp]);
          if (js) {
            returnData.push(js);
          }
          if (bm) {
            returnData.push(bm);
          }
        });
        return returnData;
      },
      // 获取部门成员列表
      nextpage(datas) {
        this.isnext = true
        this.tablist.push(datas)
        this.waitmember = this.sxbmspr.length ? this.sxbmspr : this.bzspr.length ? this.bzspr : []
      },
      // 获取部门成员
      getdapartmentmember(id) {
        getUsers(id).then(response => {
          if (response.status === 200) {
            response.data.members.forEach(el => {
              this.$set(el, 'IsSelect', false)
            });
            response.data.leaders.forEach(el => {
              this.$set(el, 'IsSelect', false)
            });
            this.departmentmember = response.data.members
            this.departmentleader = response.data.leaders
          }
        })
      },

      // 搜索部门成员
      trysearch() {
        if (this.activeName === 'first') {
          this.waitmember = this.bzspr
          const params = {
            xxdm: window.localStorage.getItem('xxdm'),
            name: this.searchxzspr
          }
          Searchmember(params).then(data => {
            data.forEach(item => {
              this.$set(item, 'IsSelect', false)
            })
            this.searchmenmberlist = data;
            this.search = true;
          })
        } else if (this.activeName === 'second') {
          this.searchjssj = [];
          if (this.searchxzspr !== '') {
            this.jssj.forEach(js => {
              if (js.name.indexOf(this.searchxzspr) !== -1) {
                this.searchjssj.push(js);
              }
            })
          } else {
            this.searchjssj = this.jssj;
          }
        }
      },
      showAlljs() {
        this.searchxzspr = '';
        this.searchjssj = this.jssj;
      },
      // 选择人员
      checkclick(datas) {
        this.bzspr = datas;
      },
      // 点击获取所有部门/上一级部门成员
      getallstatus(datas, index) { // 通过暂存数据，将路径缓存为tab切换数据源保存，通过点击再次利用部门id获取到该部门成员
        this.search = false
        this.searchxzspr = ''
        const that = this
        if (index === 0) {
          this.waitmember = [] // 将所有已选指定人员暂存清除以待下次子组件对数据监听，避免数据未发生变化造成舰艇失败
          that.tablist.splice(1, that.tablist.length - 1)
          that.getdepartmentlist()
          that.bzspr = getlocal('departmentmembers') ? getlocal('departmentmembers') : this.sxbmspr.length ? this.sxbmspr : []
          that.isnext = false
        } else {
          that.isnext = true
          that.tablist.splice(index + 1, that.tablist.length - index)
          that.childrendepartment = datas.children
          that.getdapartmentmember(datas.id)
        }
      },
      // 获取部门列表
      getdepartmentlist() {
        const xxdm = window.localStorage.getItem('xxdm');
        const QueryIt2 = { xxdm, groupType: '2' };
        fetchTree(QueryIt2).then(data => {
          this.dapartmentlist = data;
        });
      },
      // 获取部门+部门下的成员 -----角色
      cxbmsj() {
        const xxdm = window.localStorage.getItem('xxdm');
        const QueryIt1 = { xxdm, groupType: '1' };
        const QueryIt2 = { xxdm, groupType: '2' };
        const params = {
          page: 1,
          limit: 2000,
          type: 3,
          xxdm
        }
        Getallteacher(params).then(data => {
          data.data.rows.forEach(item => {
            Vue.delete(item, 'updTime')
            Vue.delete(item, 'updName')
            Vue.delete(item, 'password')
            Vue.delete(item, 'updUser')
            Vue.delete(item, 'crtTime')
          })
          // console.log(data)
          this.bmsjallrem = data.data.rows
        })
        fetchTree(QueryIt2).then(data => {
          this.bmsj = data;
        });
        fetchTree(QueryIt1).then(data => {
          this.jssj = data;
          this.searchjssj = data;
        });
      },

      // 所有部门下的成员 tree
      getUserData(id, item) {
        getUsers(id).then(response => {
          // console.log(response)
          const leaderItem = response.data.leaders;
          const memberItem = response.data.members;
          const itdem = leaderItem
          memberItem.forEach(itemuser => {
            if (_.find(itdem, ['id', itemuser.id])) {
              return false
            } else {
              itdem.push(itemuser)
            }
          })
          const child = item.children
          const that = this;
          if (child) {
            child.forEach(exp => {
              itdem.unshift(exp);
            })
          }
          itdem.forEach(dtitem => {
            dtitem.treeId = id + dtitem.id
            dtitem.typeTab = '0'        // 组织架构
            that.bmsjallrem.push(dtitem)
          })
          item.children = itdem
        })
      },
      // 搜索
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      // 指定成员选择
      handleCheckChange(data, checked) {
        if (!data.parentId) {
          if (checked) {
            const samedt = _.find(this.bzspr, ['id', data.id]);
            this.bzsprall.push(data)
            if (samedt) {
              return false
            } else {
              this.bzspr.push(data)
            }
          } else {
            this.bzsprall = _.without(this.bzsprall, data)
            const specdata = _.find(this.bzsprall, ['id', data.id]); // 判断该人还有没有重复
            if (!specdata) {
              this.bzspr = _.without(this.bzspr, data)
            } else {
              return false
            }
          }
        }
      },

      // 所选成员删除
      handleClose_tag(tag) {
        if (this.bzspr.length !== 1) {
          this.bzspr.splice(this.bzspr.indexOf(tag), 1);
          this.waitmember = this.bzspr;
          this.departmentmemberId = tag.id;
          setlocal('departmentmembers', this.bzspr)
        } else {
          this.bzspr.splice(this.bzspr.indexOf(tag), 1);
          this.departmentmemberId = tag.id;
          clearlocal('departmentmembers', 'appoint')
        }
      },
      // 关闭第二弹层
      closeModel() {
        this.tablist.splice(1, this.tablist.length - 1)
        clearlocal('departmentmembers', 'appoint')
      },
      // 所选成员确定
      czbmspr() {
        if (this.bzspr.length > 15) {
          this.$message({ type: 'warning', message: '已选人员数量不能超过15!' });
          return false;
        }
        // 设置类型为默认抄送人
        if (this.sprSetType === 'bmjs') {
          this.sxbmsprid = [];
          this.sxbmspr = [];
          this.bzspr.forEach(item => {
            this.sxbmsprid.push(item.id);
            this.sxbmspr.push(item)
          });
        } else if (this.sprSetType === 'mrcsr') {
          this.mrcsr = this.bzspr;
        } else if (this.sprSetType === 'dqcsr') {
          this.dqcsr = this.bzspr;
        } else if (this.sprSetType === 'tjbmjs') {
          this.dqtj[this.yxjindex].zffwArrOnly = this.bzspr;
          const zffwArr = [];
          this.bzspr.forEach(spr => {
            zffwArr.push(spr.id);
          })
          this.dqtj[this.yxjindex].zffwArr = zffwArr;
        }
        this.dialogxzspr = false;
        // this.dialogcsr = false;
        setTimeout(() => {
          clearlocal('departmentmembers', 'appoint')
        }, 300)
      },
      // 所选指定角色选择
      handleNodeClick_jssj(data) {
        if (this.sprChoseType === 'js') {
          this.bzspr = [];
        }
        if (this.bzspr.indexOf(data) === -1) {
          this.bzspr.push(data);
        }
      },
      // 设置审批人弹层--确定按钮
      bcspbz() {
        let messageStr = '请完整填写审批步骤!';
        let flag = true;
        if (this.sprlx === '' || this.spfs === '') {      // sprlx审批类型    spfs审批方式
          flag = false;
        } else {                                  // YJZG 一级主管 DJZG 多级主管 ZDCY 指定成员 ZDJS 指定角色
          if ((this.sprlx === this.splxEnum.YJZG || this.sprlx === this.splxEnum.DJZG) && this.zgdj === '') {      // 主管等级
            flag = false;
          } else if (this.sprlx === this.splxEnum.ZDCY && this.sxbmspr === '') {
            flag = false;
          } else if (this.sprlx === this.splxEnum.ZDCY && this.sxbmspr.length > 10) {
            messageStr = '单个节点审批人不能超过最大限制!';
            flag = false;
          } else if (this.sprlx === this.splxEnum.ZDJS && this.sxbmspr.length === 0) {
            flag = false;
          } else if (this.sprlx === this.splxEnum.BDX && this.sxbmsprid.length === 0) {
            flag = false;
          }
        }
        if (flag) {
          let dqlcbz = {};                // 表单~~
          if (this.bzid !== '') {            // 编辑
            if (this.yxjindex === -1) {                          // 编辑--默认审批流程
              dqlcbz = this.mrspbz[this.bzindex];            // 默认审批流程--默认审批人
            } else if (this.yxjindex >= 0) {                   // 编辑--分条件审批
              dqlcbz = this.bztj[this.yxjindex].spbz[this.bzindex];     // 分条件审批中的审批人
            }
          }
          dqlcbz.sprlx = this.sprlx;    // 审批人类别
          dqlcbz.spfs = this.spfs;      // 审批方式
          dqlcbz.mbid = this.mbid;

          if (this.sprlx === this.splxEnum.YJZG) {        // 一级主管
            dqlcbz.bzmc = '第' + this.zgdj + '级主管';
            dqlcbz.spr = this.zgdj;
          } else if (this.sprlx === this.splxEnum.DJZG) {  // 多级主管
            dqlcbz.bzmc = '从第1级主管到第' + this.zgdj + '级主管';
            dqlcbz.spr = this.zgdj;
          } else if (this.sprlx === this.splxEnum.ZDCY) { // 指定成员
            const bzcyCount = this.sxbmspr.length;
            dqlcbz.bzmc = '指定成员' + bzcyCount + '人';
            const sprName = [];
            this.sxbmspr.forEach(item => {
              sprName.push(item.id)
            });
            dqlcbz.spr = sprName.join(',');
          } else if (this.sprlx === this.splxEnum.ZDJS) {   // 指定角色
            const sprjsName = [];
            const sprjsid = [];
            this.sxbmspr.forEach(js => {
              sprjsName.push(js.name);
              sprjsid.push(js.id)
            });
            dqlcbz.bzmc = sprjsName.join(',');
            dqlcbz.spr = sprjsid.join(',');
          } else if (this.sprlx === this.splxEnum.BDX) {   // 表单步骤
            const sprName = [];
            this.sxbmsprid.forEach(bdx => {
              const bdxx = _.find(this.bzbdx, ['bdbm', bdx]);
              sprName.push(bdxx.bdmc);
            });
            dqlcbz.bzmc = sprName.join(',');
            dqlcbz.spr = this.sxbmsprid.join(',');
          }
          if (this.bzid === '') {                  // 审批步骤------新添加
            let zhbz = {};
            if (this.yxjindex === -1) {            // 添加--默认审批流程
              zhbz = _.last(this.mrspbz);     // 默认审批流程--默认审批人
              if (zhbz) {
                dqlcbz.spyxj = zhbz.spyxj;
                dqlcbz.spbz = zhbz.spbz + 1;
              } else {
                dqlcbz.spyxj = this.yxjindex;
                dqlcbz.spbz = 1;
              }
              dqlcbz.sfmr = 1;
              this.mrspbz.push(dqlcbz);
            } else if (this.yxjindex >= 0) {     // 添加--分条件审批
              zhbz = _.last(this.bztj[this.yxjindex].spbz);
              if (zhbz) {
                dqlcbz.spyxj = zhbz.spyxj;
                dqlcbz.spbz = zhbz.spbz + 1;
              } else {
                dqlcbz.spyxj = this.yxjindex + 1;
                dqlcbz.spbz = 1;
              }
              this.bztj[this.yxjindex].spbz.push(dqlcbz);
            }
          }
          this.dialogzpbzVisible = false;
        } else {
          this.$message({ type: 'warning', message: messageStr });
        }
      },
      // 设置审批人弹层--取消按钮
      qxszbz() {
        this.dialogzpbzVisible = false;
      },
      // 审批人删除
      sclcbz(yxjindex, bzindex) {
        bzindex = bzindex - 1;
        if (yxjindex === -1) {                 // 默认审批人删除
          this.mrspbz.splice(bzindex, 1);
          this.mrspbz.forEach((mrbz, mbinx) => {
            mrbz.spbz = mbinx + 1;
          })
        } else if (yxjindex >= 0) {          // 条件审批人删除
          this.bztj[yxjindex].spbz.splice(bzindex, 1);
          this.bztj[yxjindex].spbz.forEach((bz, bzinx) => {
            bz.spbz = bzinx + 1;
          })
        }
      },
      // 删除抄送人
      scmccsr(csrindex, data) {
        debugger;
        data.splice(csrindex, 1);
      },
      // 按条件审批添加
      addspbztj() {
        this.num1 = ''
        this.num2 = ''
        this.num3 = ''
        this.isadd = true
        let yxj = 1;
        if (this.bztj.length > 0) {
          yxj = _.last(this.bztj).yxj + 1;
        }
        const obj = {};
        obj.yxj = yxj;
        obj.sptj = [];
        obj.spbz = [];
        obj.csr = [];
        obj.csrData = [];
        this.bztj.push(obj);
        this.bjsptj(this.bztj.length - 1)
      },
      // 按条件审批编辑
      bjsptj(index) {
        this.isadd = false
        this.yxjindex = index;
        const dqtjx = [];
        const dqbd = [];
        this.dqcpr = this.bztj[this.yxjindex].spbz;     // 审批人
        this.dqcsr = this.bztj[this.yxjindex].csrData;     // 抄送人
        this.bztj[this.yxjindex].sptj.forEach(tj => {
          dqtjx.push(tj);
          dqbd.push(tj.bdxid);
        })
        dqtjx.forEach(item => {
          if (item.zffwname) {
            item.zffwArrOnly.forEach(el => {
              el.IsSelect = true
            })
          }
        })
        dqtjx.forEach(el => {
          if (el.splcbdx.bdxlx === 3) {
            if (el.zffwArr[1] && el.zffwArr[3]) {
              this.num1 = el.zffwArr[0]
              this.symbol1 = el.zffwArr[1]
              this.symbol2 = el.zffwArr[3]
              this.num3 = el.zffwArr[4]
              this.value = 6
              this.conditionaltype = true
            } else {
              this.conditionaltype = false
              this.num1 = el.zffwArr[0]
              this.symbol1 = el.zffwArr[1]
              this.symbol2 = el.zffwArr[3]
              this.num2 = el.zffwArr[4]
              if (el.zffwArr[3] === '<') {
                this.value = 1
              }
              if (el.zffwArr[3] === '>') {
                this.value = 2
              }
              if (el.zffwArr[3] === '<=') {
                this.value = 3
              }
              if (el.zffwArr[3] === '==') {
                this.value = 4
              }
              if (el.zffwArr[3] === '>=') {
                this.value = 5
              }
            }
          }
        })
        this.dqtj = dqtjx;
        this.dqbdx = dqbd;
        this.dialogzptjVisible = true;
      },
      // 设置审批条件
      xgtjbdx(bdx) {
        if (this.dqbdx.indexOf(bdx.bdxid) !== -1) {
          const tjbdx = {};
          tjbdx.splcbdx = bdx;
          tjbdx.bdxid = bdx.bdxid;
          if (bdx.bdxlx === this.bdxlxEnum.NUMBER) {
            this.value = 1
            this.conditionaltype = false
            tjbdx.zffwArr = ['', '<', bdx.bdmc, '<', ''];
          } else {
            tjbdx.zffwArr = [];
          }
          tjbdx.yxj = this.yxjindex + 1;
          tjbdx.mbid = this.mbid;
          this.dqtj.push(tjbdx);
        } else {
          _.remove(this.dqtj, n => n.bdxid === bdx.bdxid);
        }
      },
      // 按条件审批--删除
      scbztj(index) {
        this.$confirm('此操作将删除步骤条件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.bztj.splice(index, 1);
          this.bztj.forEach((item, index) => {
            item.yxj = index + 1;
            item.spbz.forEach(bz => {
              bz.spyxj = index + 1;
            })
            item.sptj.forEach(tj => {
              tj.yxj = index + 1;
            })
          })
        });
      },
      // 审批条件弹层--确定
      bcsptjbdx() {
        let szjy = true;
        let seljy = true;
        let tip = true
        const bdlxEnum = this.bdxlxEnum;
        this.dqtj.forEach(tjd => {
          // 数字条件时 拼装表达式
          if (tjd.splcbdx.bdxlx === 3) {
            if (this.conditionaltype) {
              tjd.zffwArr[1] = this.symbol1
              tjd.zffwArr[3] = this.symbol2
              tjd.zffwArr[0] = this.num1
              tjd.zffwArr[4] = this.num3
            } else {
              tjd.zffwArr[1] = this.symbol1
              tjd.zffwArr[3] = this.symbol2
              tjd.zffwArr[0] = ''
              tjd.zffwArr[4] = this.num2
            }
          }
          if ((tjd.splcbdx.bdxlx === bdlxEnum.SELECT || tjd.splcbdx.bdbm === 'sqr') && tjd.zffwArr.length === 0) {
            seljy = false;
          } else if (tjd.splcbdx.bdxlx === bdlxEnum.NUMBER) {
            if (!tjd.zffwArr[0] && !tjd.zffwArr[4]) {
              szjy = false;
            } else if (tjd.zffwArr[0] !== '' && tjd.zffwArr[1] === '') {
              szjy = false;
            } else if (tjd.zffwArr[4] !== '' && tjd.zffwArr[3] === '') {
              szjy = false;
            }
          }
          if (szjy && seljy) {
            if (tjd.splcbdx.bdxlx === bdlxEnum.SELECT || tjd.splcbdx.bdbm === 'sqr') {
              tjd.bds = '\'' + tjd.zffwArr.join(',') + '\'.indexOf(\'' + tjd.splcbdx.bdbm + '\')!=-1';
            } else if (tjd.splcbdx.bdxlx === bdlxEnum.NUMBER) {
              tjd.zffwArr[2] = tjd.splcbdx.bdmc;
              if (!tjd.zffwArr[0]) {
                tjd.zffwArr[0] = ''
                tjd.zffwArr[1] = '';
                tjd.bds = tjd.splcbdx.bdbm + '' + tjd.zffwArr[3] + '' + tjd.zffwArr[4];
              } else if (!tjd.zffwArr[4]) {
                tjd.zffwArr[4] = ''
                tjd.zffwArr[3] = '';
                tjd.bds = tjd.zffwArr[0] + '' + tjd.zffwArr[1] + '' + tjd.splcbdx.bdbm;
              } else if (tjd.splcbdx.bdxlx === 3) {
                if (tjd.zffwArr[0] > tjd.zffwArr[4]) {
                  tip = false
                } else if ((tjd.zffwArr[0] == tjd.zffwArr[4]) && tjd.zffwArr[1] == '<=' && tjd.zffwArr[3] == '<=' || (tjd.zffwArr[0] < tjd.zffwArr[4])) {
                  tip = true
                  tjd.bds = tjd.zffwArr[0] + '' + tjd.zffwArr[1] + '' + tjd.splcbdx.bdbm + '&&' + tjd.splcbdx.bdbm + '' + tjd.zffwArr[3] + '' + tjd.zffwArr[4];
                } else {
                  tip = false
                }
              }
            }
            const nazffw = []

            if (tjd.splcbdx.bdbm === 'sqr') {
              tjd.zffwArrOnly.forEach(item => {
                nazffw.push(item.name)
              })
              tjd.zffw = nazffw.join(',');
              tjd.zffwname = nazffw.join(',');
            } else {
              tjd.zffw = tjd.zffwArr.join(',');
              tjd.zffwname = nazffw.join(',');
            }
          }
        })

        const dqcsrData = []
        if (this.dqcsr) {
          this.dqcsr.forEach(item => {
            dqcsrData.push(item.id)
          })
        }
        this.bztj[this.yxjindex].csr = dqcsrData
        this.bztj[this.yxjindex].csrData = this.dqcsr

        if (szjy && seljy && tip) {
          this.bztj[this.yxjindex].sptj = this.dqtj;
          this.dialogzptjVisible = false;
        } else {
          this.$message({ type: 'warning', message: '您有条件未填写或时长区间设置不合法!' });
        }
      },
      // 设置流程步骤保存
      bcspbztj() {
        if (this.mrspbz.length === 0) {
          this.$message({ type: 'warning', message: '必须设置默认审批步骤!' });
          return false;
        }
        let flag = false;
        this.bztj.forEach(item => {         // 按条件审批
          if (item.spbz.length === 0) {
            flag = true;
          }
          if (item.sptj.length === 0) {
            flag = true;
          }
        })
        if (flag) {
          this.$message({ type: 'warning', message: '请完整设置条件和步骤!' });
          return false;
        }
        const lcmbxx = {};
        lcmbxx.mbid = this.mbid;
        lcmbxx.tzfs = this.tzfs;
        lcmbxx.xxdm = window.localStorage.getItem('xxdm');
        const spbz = [];
        const sptj = [];
        const mrcsrJson = []
        this.mrcsr.forEach(item => {
          mrcsrJson.push(item.id)
        })
        const mrcsrData = mrcsrJson.join(',');

        this.mrspbz.forEach(mrbz => {
          mrbz.csr = mrcsrData
          spbz.push(mrbz);
        })
        this.bztj.forEach(item => {
          item.spbz.forEach(bz => {
            bz.csr = item.csr.join(',')
            spbz.push(bz);
          })
          item.sptj.forEach(tj => {
            if (tj.splcbdx.bdbm === 'sqr') {
              const tjzffwJson = []
              tj.zffwArr.forEach(tjzffw => {
                tjzffwJson.push(tjzffw)
              })
              tj.zffw = tjzffwJson.join(',');
            }
            tj.zffwArr = []
            tj.zffwArrOnly = []
            sptj.push(tj);
          })
        })


        lcmbxx.spbz = spbz;
        lcmbxx.sptj = sptj;
        api.bcspbztj(lcmbxx).then(() => {
          this.$message({ type: 'success', message: '成功' });
          // this.cxspbztj()
          this.$router.push({ name: '审批流程' });
        })
      }
    }
  }
</script>
<style scoped>
  .el-radio.is-bordered+.el-radio.is-bordered {
    margin-left: 0px;
  }
  .tj-bdmc{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
