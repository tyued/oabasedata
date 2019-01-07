<template>
  <div  class="app-container calendar-list-container">
    <div class="fcwrapper">

      <div class="fcwrdiv">
        <label style="display:inline">巡查地点/类别</label>
        <el-select v-model="lbid"  @change="gosearch">

          <el-option
            v-for="item in lblist"
            :key="item.lbid"
            :label="item.lbmc"
            :value="item.lbid">
          </el-option>

        </el-select>
      </div>
      <div class="fcwrdiv">
        <label style="display:inline">巡查结果</label>
        <el-select v-model="xcjg" placeholder="请选择"  @change="gosearch">
          <el-option
            v-for="item in jglist"
            :key="item.lbid"
            :label="item.lbmc"
            :value="item.lbid">
          </el-option>
        </el-select>
      </div>
      <div class="fcwrdiv">
        <el-input v-model="search" style="width: 60%;" placeholder="请输入名字"></el-input>
        <el-button class="filter-item" style="width: 30%;"  type="primary"  @click="gosearch()" >查询</el-button>
      </div>
      <div class="fcwrdiv">
        <label style="display:inline">日期范围</label>
        <el-date-picker
          @change="gosearch"
          v-model="ksrq"
          type="date"
          placeholder="选择开始日期">
        </el-date-picker>
      </div>
      <div class="fcwrdiv">
        <el-date-picker
          @change="gosearch"
          v-model="jsrq"
          type="date"
          placeholder="选择结束日期">
        </el-date-picker>
      </div>
      <el-button type="primary"  @click="dcPart" >批量导出</el-button>
      <el-button type="primary"  @click="dcAll" >全部导出</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="cjrxm"
        label="巡查人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="cjsj"
        label="巡查时间"
        width="150">
      </el-table-column>
      <el-table-column
        prop="lbmc"
        label="巡查地点/类别"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="xcnr"
        label="巡查内容"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        label="巡查结果"
        show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if=" scope.row.xcjg==1">正常</span>
            <span v-if=" scope.row.xcjg==0"  style="color: red">异常</span>
         </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleCkxx(scope.row)" >详情</el-button>
             <el-button size="small" type="danger" @click="handleDelete(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <!--导出-->
    <table ref="dcTable"  style="display:none" >
      <tr>
        <th>巡查人</th>
        <th>巡查时间</th>
        <th>巡查地点类别</th>
        <th>巡查内容</th>
        <th>巡查结果 </th>
        <th>情况说明</th>
      </tr>

      <tr  v-for="item of dcjglist">
        <td>{{item.cjrxm}}</td>
        <td>{{item.cjsj}}</td>
        <td>{{item.lbmc}}</td>
        <td>{{item.xcnr}}</td>
        <td>{{(item.xcjg == 0) ? "异常":"正常"}}</td>
        <td>{{item.qksm}}</td>
      </tr>


    </table>


  </div>

</template>
<script>
  import { pagelist, delObj,getCkxx,getDclist,getLblist} from 'api/xxaf/aqsb/jgcx/index';
  import jcsj from '@/api/jcsj.js';

  export default {
    data() {
      return {
        listQuery: {
          query:{
            page: 1,
            limit: 10,
          },
          xxdm: "",
          lbid:"",
          xcjg:"",
          ksrq:"",
          jsrq:"",
          search:""//搜索框内容
        },
        search:"",
        total: null,
        listLoading: true,
        ksrq: '',
        jsrq: '',
        lblist: [{
          lbid: '1',
          lbmc: '地点1'
        }, {
          lbid: '2',
          lbmc: '地点2'
        }],
        jglist: [{
          lbid: '',
          lbmc: '全部'
        },{
          lbid: '1',
          lbmc: '正常'
        }, {
          lbid: '0',
          lbmc: '异常'
        }],
        lbid: '',
        xcjg:'',//巡查结果
        tableData3: [{
          id:"1" ,
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        list:null,
        jlidlist:[],//批量导出选中的jlid
        multipleSelection: [],
        cjr:"",
        dcjglist:null

      }
    },
    created(){
      this.ksrq="";
      this.jsrq="";
      this.xxdm = window.localStorage.getItem("xxdm");
      this.listQuery.xxdm = this.xxdm;
      this.cjr=window.localStorage.getItem("userid");

      this.getlblist();
      this.getList();
    },
    methods: {
      // 分页
      handleSizeChange(val) {
        this.listQuery.query.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.query.page = val;
        this.getList();
      },
      //类别列表
      getlblist(){
        let param={
          xxdm:this.xxdm
        }
        getLblist(param).then(response => {//获取所有列表信息
           let list = response.lblist;
           console.log(list);
           let lball=[];
           lball.push({lbid:"0",lbmc:"全部"});
           for (var j = 0; j < list.length; j++) {
             lball.push({lbid:list[j].lbid,lbmc:list[j].lbmc});
           }
           this.lblist=lball;


        })
      },
      // 表格中日期2000-01-01
      workTime(val){
        var d = new Date(val);              //时间戳
        var year = d.getFullYear();
        var month = d.getMonth()+1;
        var day = d.getDate();
        if(month<10) month = "0" + month;
        if(day<10) day = "0" + day
        return year + '-' + month + '-' + day
      },
      //选择开始日期
      gosearch(){
        this.getList();
      },
      //结果列表
      getList(){
        this.listLoading = true;
        if(this.lbid=="0"){
          this.listQuery.lbid="";
        }else{
          this.listQuery.lbid=this.lbid;
        }
        this.listQuery.xcjg=this.xcjg;
        this.listQuery.search=this.search;
        if(this.ksrq!=null&&this.ksrq!=""){
          this.ksrq=this.workTime(this.ksrq);
        }
        if(this.jsrq!=null&&this.jsrq!=""){
          this.jsrq=this.workTime(this.jsrq);
        }
        this.listQuery.ksrq=this.ksrq;
        this.listQuery.jsrq=this.jsrq;

        pagelist(this.listQuery).then(response => {

          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      //查看
      handleCkxx(row){
        this.$router.push ({
          path: '/auditAqsb/ckJgManager',
          name:'结果详情',
          params: {
            jlid: row.jlid
          }
        })
      },
      // 删除
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let parm={
            jlid: row.jlid,
          }
          delObj(parm).then((res) => {
            // console.log(res.status);
            if(res.status=="200"){
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({title: '成功', message: '清空成功', type: 'success', duration: 2000});
            }else{
              this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
            }
          });
        }).catch(e => {
          // console.log(e)
        });
      },
      //批量导出
      dcPart(){

        this.jlidlist=[];

        for (var j = 0; j <  this.multipleSelection.length; j++) {
             let map=this.multipleSelection[j];
             let jlid=map.jlid;
             this.jlidlist.push(jlid);
        }

        if(this.jlidlist.length===0){
          this.$notify({title: '', message:"请选择记录", type: 'error', duration: 2000});
          return ;
        }
        let parm={
          xxdm:this.xxdm,
          jlidlist: this.jlidlist
        }
        getDclist(parm).then(response => {//获取所有列表信息
             this.dcjglist=response;
              const oHtml =this.creatHtml();
             jcsj.exportTable2Excel(oHtml, '巡查结果表');
        })
      },
      //全部导出
      dcAll(){
        let parm={
           xxdm:this.xxdm,
          jlidlist: null
        }
        getDclist(parm).then(response => {//获取所有列表信息
          this.dcjglist=response;
          const oHtml =this.creatHtml();
          jcsj.exportTable2Excel(oHtml, '巡查结果表');
        })
      },
      creatHtml(){
        let  html="<table>";
             html+="<tr> ";
             html+="<th>巡查人</th><th>巡查时间</th><th>巡查地点类别</th> <th>巡查内容</th> <th>巡查结果 </th><th>情况说明</th></tr>";
        for (var j = 0; j <  this.dcjglist.length; j++) {
          let map=this.dcjglist[j];
          let xcjg=(map.xcjg=="0"?"异常":"正常");

          let xclb=(map.lbmc==undefined?"":map.lbmc);
           html+="<tr> ";
           html+="<td>"+map.cjrxm+"</td><td>"+map.cjsj+"</td><td>"+xclb+"</td> <td>"+map.xcnr+"</td> <td>"+xcjg+" </td><td>"+map.qksm+"</td>";
           html+="</tr> ";
        }
        html+="</table>"
        return html;
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>
<style scope>
  .fcwrapper{
    padding: 24px 30px;
    border: 1px  solid #e4e7ed;
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
</style>
