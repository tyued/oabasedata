<template>
  <div  class="app-container calendar-list-container">
    <div class="fcwrapper">
      <!-- <el-input style="width:250px"  v-model="search"></el-input>
      <el-button type="primary"  @click="Search" >搜索</el-button> -->
      <el-button type="primary"  @click="add">添加</el-button>
      <el-button type="primary" @click="delall" >批量删除</el-button>

    </div>
    <!-- 添加 -->
    <el-dialog :title="titlemsg"  :visible.sync="outerVisible" width="600px" class="tag-dia">
      <el-form :model="list" ref="list" label-width="120px"> 
          <el-form-item label="巡查地点/类别：">
            <el-input style="width:100px" v-model="list.lbmc"></el-input>
          </el-form-item>  
          <el-form-item label="指定巡查人员：">
            <el-tag v-for="(sel, index) in selxcperList" :key="index" closable @close="delselperson(index)" class="mright">
                {{sel.name}}
            </el-tag>
            <el-button type="text" icon="el-icon-circle-plus-outline" @click="selxcperson('Inspector')"></el-button>
          </el-form-item>  
          <el-form-item label="巡查总负责人：">
            <el-tag class="mright" v-if="list.zfzrxm" closable @close="delselcharge">{{list.zfzrxm}}</el-tag>
            <el-button type="text" icon="el-icon-circle-plus-outline" @click="selxcperson('charge')" :disabled="selxcperList.length<1"></el-button>
          </el-form-item>  
      </el-form>
      <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save()">保 存</el-button>
            <el-button @click="outerVisible = false">取 消</el-button> 
        </div>
    </el-dialog>
    <!-- 选择人员弹层 -->
    <el-dialog title="添加巡查人员" width="560px" :visible.sync="innerVisible" append-to-body :before-close="selCancel" class="persondialog">
          <el-header v-if="seltype=='Inspector'">
              <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="addpersonQuery.name"  style="width: 400px;" ></el-input>
              <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
          </el-header>
          <el-main>
              <el-form label-width="110px" style="height:300px;">
                  <el-checkbox-group v-model="members" size="small" v-if="seltype=='Inspector'">
                      <el-checkbox v-for="(item,index) in selList" :key="index" :label="item.ename" border>{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                  <el-radio-group v-model="member" size="small" v-if="seltype=='charge'">
                    <el-radio v-for="(item,index) in selList" :key="index" :label="item.ename" border>{{item.name}}</el-radio>
                  </el-radio-group>
              </el-form>
          </el-main>
          
          <div class="dialog-footer" slot="footer">
              <el-button @click="personcancel">取 消</el-button>
              <el-button type="primary" @click="personcreate(seltype)">确 定</el-button>
          </div>
    </el-dialog>
    <el-table
      :key='tableKey'
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        width="200"
        type="index"
        label="编号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="lbmc"
        label="巡查的地点/类别">
      </el-table-column>
      <template >
        <el-table-column
          prop="rysm"
          label="指定巡查人数"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" @show="isshow(scope.row)">
              <p v-for="(item, index) in departmentlist" :key="index">姓名: {{item.xm}}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium"> {{scope.row.rysm}}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        prop="zfzrxm"
        label="巡查总负责人"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button  type="primary" @click="handleClick(scope.row, 'change')">编辑</el-button>
          <!--  -->
          <el-button type="danger" @click="deldel(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="listLoading" class="pagination-container">

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total= total>
      </el-pagination>
    </div>

  </div>

</template>
<script>
  //  import searchApp from '@/views/components/searchbar'
  import  { pagelist, getXcry,getTea,saveAqsb,delAqsb,getUpdateAll,bcxg } from '@/api/xxaf/aqsb/sbsz/index'
  export default {
    data() {
      return {
        ischange: false,
        titlemsg: '添加巡查人员',
        listQuery: {
          query:{
            page: 1,
            limit: 10,
          },
          xxdm: "", //学校代码
          search:"", //搜索里的数据
        },
        outerVisible: false,
        innerVisible: false,
        site:'',//地点
        currentPage4: 4,
        listLoading: true,
        total: 0,
        jsxxtitle:"",
        jsxxlist:"",
        tableKey: 0,
        tableData: [],
        multipleSelection: [],
        Securitypersonnel: [],
        search:"",//搜索
        list: {
          lbid: '',//类别id
          lbmc: '',//类别名称
          rysm: '',//人员数目
          zfzr: '',//总负责人
          zfzrxm: '',//总负责人姓名
          cjr: '',//创建人
          cjsj: '',//创建时间
          xxdm: '',
          xcrylist: []
        },
        lbid: '',
        usercode: '',
        name: '',
        str: '',
        lbidlist: [],
        departmentlist: [],
        rylist: [],


        addpersonQuery:{
          xxdm: localStorage.getItem('xxdm'), //学校代码
        },
        allxcPerson:[], //全部人员
        allxcPersonArr:[],
        personform:{},
        members:[],
        member:'',
        selxcperList:[],    //所选指定巡查人员
        selList:[],
        seltype:'',         //判断所选的是指定人员还是指定总负责人
        selInspector:[],
        selCharge:'',
      }

    },
    mounted () {
      this.xxdm = localStorage.getItem('xxdm')
      this.name = localStorage.getItem('name')
      this.usercode = localStorage.getItem('usercode')
      this.pagelist()
      this.searchuser()

      this.lbid = this.guid()
    },

    methods: {
      //
      add () {      
        this.titlemsg = '添加巡查人员'  
        this.list.lbmc = ''
        this.lbid = ''
        this.list.lbid=''
        this.list.zfzr=''
        this.selCharge = ''
        this.list.xcrylist = []
        this.selInspector = []
        this.selxcperList = []
        this.list.zfzrxm = ''
        this.list.rysm = 0
        this.ischange = false
        this.outerVisible = true
      },
      // 弹框人员
      isshow (datas) {
        getXcry({lbid: datas.lbid}).then(res=>{
          this.departmentlist = res.rylist
        })
      },
      //搜索
      Search(){
        this.pagelist();
      },
      // 生成类别id
      S4(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      },
      guid() {
        return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
      },


      // 分页
      handleSizeChange(val) {
        this.listQuery.query.limit = val;
        this.pagelist();
      },
      handleCurrentChange(val) {
        this.listQuery.query.page = val;
        this.pagelist();
      },
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },
      // 页面列表
      pagelist(){
        this.listQuery.xxdm=localStorage.getItem('xxdm');
        this.listQuery.search=this.search;
        pagelist(this.listQuery).then(res=>{
          this.tableData = res.data.rows
          this.total = res.data.total
        })
      },
      // 获取老师信息
      searchuser () {
        getTea(this.addpersonQuery).then(res=>{          
          this.allxcPerson = res.jsxxlist
          this.allxcPersonArr = []
          res.jsxxlist.forEach(item => {
            this.allxcPersonArr.push(item.ename)
          })
          res.jsxxtitle.forEach(items => {
            items.Securitypersonnel = []
            res.jsxxlist.forEach(item => {
              if (items.ename === item.fdm) {
                items.Securitypersonnel.push(item)
              }
            })
          })
          this.Securitypersonnel = res.jsxxtitle

        })
      },

      //删除
      delall () {
        this.lbidlist = []
        this.multipleSelection.forEach(item => {
          this.lbidlist.push(item.lbid)
        })
        this.deleteit(this.lbidlist)
      },

      //删除巡查人员
      deldel(val){
        this.lbidlist = []
        this.lbidlist.push(val.lbid)
        console.log(val.lbid)
        this.deleteit(this.lbidlist)
      },
      deleteit (datas) {
        delAqsb({lbidlist:datas}).then(res=>{
          console.log(res)
          if(res.status == 200){
            this.pagelist()
            this.$notify({ title: '成功',message: '删除成功',type: 'success'});
          }else{
            this.$notify({ title: '失败',message: res.message,type: 'error'});
          }
        })
      },
      // ------------------------------------------------------------------------------
      //关闭选择弹层
      selCancel(){
        this.addpersonQuery.name=''
        this.innerVisible = false 
      },
      //搜索
      handleFilter(){
        this.searchuser();
      },
      personcancel(val){
          this.innerVisible = false;
          this.addpersonQuery.name=''
      },
      // 确定选择人员
      personcreate(val){
        if(val=='Inspector'){               //选择巡逻人员
          let selxcperList = [];
          for(let i = 0; i < this.members.length; i++) {
              let index = this.allxcPersonArr.indexOf(this.members[i])
              if(index>=0) {
                  selxcperList.push(this.allxcPerson[index])
              }                
          }
          this.selxcperList = selxcperList   
          if(this.selInspector!=this.members){
            var diff = this.members.indexOf(this.selCharge)
            if(diff<0){
              this.selCharge = ''
              this.list.zfzrxm = ''
            }
            this.selInspector = this.members;
          }
        }else if(val == 'charge'){      //选择总巡逻人员
          let zfzrxm = '';
          let index = this.allxcPersonArr.indexOf(this.member)
          if(index>=0) {
            zfzrxm = this.allxcPerson[index]
          }
          this.list.zfzrxm = zfzrxm?zfzrxm.name:''
          this.selCharge = this.member;
        }        
        this.innerVisible = false;   
      },
      //删除巡查人员
      delselperson(index){
        console.log(this.selxcperList[index])
        if(this.selInspector[index]==this.selCharge){
          console.log("11111")
          this.selCharge = ''
          this.list.zfzrxm = ''

        }        
        this.selxcperList.splice(index, 1);
        this.selInspector.splice(index, 1);
        this.members = this.selInspector
      },
      //删除总巡逻人员
      delselcharge(){
        this.list.zfzrxm = ''
        this.selCharge = ''
      },
      selxcperson(val){
        this.seltype = val
        if(val == 'Inspector'){         //选择巡逻人员
          this.selList = this.allxcPerson;
          this.members = this.selInspector
        }else if(val == 'charge'){      //选择总巡逻人员
          this.selList = this.selxcperList;
          this.member = this.selCharge
        }        
        this.innerVisible = true

      },
      //修改巡查人员信息
      handleClick(val, msg){
        var that = this
        if (msg === "change") {
          this.ischange = true
          this.titlemsg = '修改巡查人员'
        }
        this.outerVisible = true
        getUpdateAll({lbid:val.lbid}).then(res=>{
          this.list = res.aqsblist[0]
          this.lbid = res.aqsblist[0].lbid
          this.list.xcrylist = []
          this.selInspector = []
          this.selxcperList = []
          this.selCharge = res.aqsblist[0].zfzr
          var rylist = res.rylist
          if(rylist.length>0){
            rylist.forEach(item=>{
              that.selInspector.push(item.ryzgh)
              that.selxcperList.push({ename:item.ryzgh,name:item.xm})
            })
          }
        })
      },
      //添加修改巡查人员
      save(){
        var that = this
        if (this.ischange) {
          this.list.zfzr = this.selCharge
          this.list.xcrylist = []
          if(this.selInspector.length>0){
            this.selInspector.forEach(item => {
                that.list.xcrylist.push({lbid:that.lbid,ryzgh:item,xxdm:that.xxdm})
            })
          }          
          this.list.rysm = this.list.xcrylist.length
          if(this.list.rysm<1 || !this.list.zfzr || !this.list.lbmc){
            this.$notify({
                title: '失败', message: '有未填项', type: 'error'
              });
          }else{
                bcxg(this.list).then(data=>{
                  if(data.status == 200){
                    this.outerVisible = false
                    this.$notify({title: '成功', message: '修改巡查信息成功', type: 'success'   });
                    this.pagelist()
                  }
                })
          }
        } else {
          this.list.xxdm = this.xxdm
          this.list.lbid = this.lbid
          this.list.cjr = this.name?this.name:this.usercode
          this.list.zfzr = this.selCharge
          this.list.xcrylist = []
          if(this.selInspector.length>0){
            this.selInspector.forEach(item => {
                that.list.xcrylist.push({lbid:that.lbid,ryzgh:item,xxdm:that.xxdm})
            })
          }          
          this.list.rysm = this.list.xcrylist.length

          if(this.list.rysm<1 || !this.list.zfzr || !this.list.lbmc){
            this.$notify({
                title: '失败', message: '有未填项', type: 'error'
              });
          }else{
            saveAqsb(this.list).then(data => {
              if(data.status == 200){
                this.outerVisible = false
                this.pagelist()
                this.$notify({
                  title: '成功', message: '添加巡查成功', type: 'success'
                });
                this.lbid = this.guid()
                this.list = {}
              }else if(data.status == -1){
                this.$notify.error({
                  title: '错误',
                  message: data.message
                });
              }
            })
          }
        }

      },
    }
  }
</script>
<style>
  .fcwrapper{
    padding: 24px 30px;
    border: 1px solid rgba(157, 157, 157, 0.07);
    border-radius: 5px;
  }
  .fcwrdiv{
    display: inline-block;
    margin: 0 15px 15px 0;
  }
  .fcwrdiv label{
    font-size: 14px;
    font-weight: 400;
    width: 70px;
    text-align: left;
  }
  .persondialog .el-checkbox.is-bordered+.el-checkbox.is-bordered{
    margin-left: 0;
  }
  .persondialog .el-radio.is-bordered+.el-radio.is-bordered{
    margin-left: 0;
  }
  .persondialog .el-checkbox,.persondialog .el-radio{
    margin-right: 10px; margin-bottom: 10px;
  }
  .persondialog .el-main{
    padding: 0 20px 20px;
  }
  .tag-dia .el-tag{
    margin-right: 10px;
  }
</style>
