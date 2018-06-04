<template>
  <div class="app-container calendar-list-container">
     <div class="oarow">
       <div class="searchMain">
      <searchbar :searchTypes="searchTypes" :conditionItems="conditionItems" @searchClick="search"></searchbar>
      </div>
     <!-- <div class="searchMain">
        <div class="searchBox_1">查询条件:</div>
        <div class="searchBox_2 cxtj_sel">
          <el-input class="ssnr" style="display:inline-block; width:550px;"  placeholder="请输入任务名称"></el-input>
        </div>
        <div class="searchBox_3">
          <el-button style="height:42px; width:80px; margin-left:10px;" type="primary" icon="el-icon-search"></el-button>
          <span class="moreseting el-icon-arrow-down" v-bind:class="{active:moreset}" @click="moresetting"> 展开显示更多</span>
        </div>

        <div class="selectSearch">
          <div class="searchBox_1">已选条件:</div>
          <div class="searchBox_4 selSearchList" style="overflow:hidden;">
              <div class="tjbox">学年:<span>2016-2017</span><i class="el-icon-error"></i></div> 
              <div  class="tjbox">学期:<span>上学期</span><i class="el-icon-error"></i></div> 
          </div>
        </div>

        <div class="detailSearch" v-show="moreset">
          <el-form ref="form1" label-width="80px">
            
            <div class="rowline">
                <el-form-item label="所在学年">
                  <el-radio  label="2">2016-2017</el-radio>
                  <el-radio  label="3">2015-2016</el-radio>
                  <el-radio  label="4">2014-2015</el-radio>
                  <el-radio  label="5">2013-2014</el-radio>
                </el-form-item>
            </div>
            <div class="rowline">
                <el-form-item label="所在学期">
                  <el-radio  label="2">上学期</el-radio>
                  <el-radio  label="3">下学期</el-radio>
                </el-form-item>
            </div>
          </el-form>
        </div>
      
    </div>    -->
    </div>
    <div class="oarow">
      <el-row>
        <el-button type="primary"  @click="handleCreate">新增任务</el-button>
        <el-button type="primary" @click="xkgzsz">选课规则设置</el-button>
      </el-row>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="任务名称" >
        <template slot-scope="scope">
          <span>{{scope.row.rwmc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始报名时间" width="280" >
         <template slot-scope="scope">
           <span>{{workTime(scope.row.kssj) }}</span>
        </template> 
      </el-table-column>
      <el-table-column align="center" label="截止报名时间" width="280">
        <template slot-scope="scope">
            <span>{{ workTime(scope.row.jssj)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="280">
        <template slot-scope="scope">
          <span>{{(scope.row.rwzt=="1")?"未开始":"选课中"}}</span>
        </template>
      </el-table-column> 
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button  size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

     <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]"
                     :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="870px" >
        <el-form :model="form" ref="form" label-width="110px" name="myform">
            <el-form-item label="任务名称"  prop="rwmc" :rules="[{ required: true, message: '任务名称不能为空'}]" >
              <el-col :span="18">
                <input type="hidden" v-model.trim="form.xkrwid" />
                <el-input v-model.trim="form.rwmc" placeholder="请输入任务名称" ></el-input>
              </el-col>
            </el-form-item>
            <el-row :gutter="18">
                    <el-col :span="12">
                        <el-form-item label="开始报名时间" prop="kssj" :rules="[{ required: true, message: '开始报名时间不能为空'}]">
                            <el-date-picker type="date" v-model="form.kssj" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="截止报名时间"  prop="jssj" :rules="[{ required: true, message: '截止报名时间不能为空'}]">
                            <el-date-picker type="date" v-model="form.jssj" placeholder="选择日期"></el-date-picker>
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
               <el-transfer v-model="value1" :data="data" :titles="title" @change="handleChange" ></el-transfer>
              </template>
            </div>
          </div>
          </div>
        </el-row> 

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel('form')">取 消</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定</el-button>
            <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 选课规则设置-->
      <el-dialog title="选课规则设置"  :visible.sync="dialogXkgzFormVisible" width="870px" >
      <el-form :model="form" ref="xkgzform" label-width="110px" name="xkgzform">
      <div class="oarow" style="float:left; margin-top:20px;width:100%;">
       <div class="rowmain">
       <el-row>
        <div class="rowcontent">
          <div class="rowLeftBox">每名学生最多选</div>
          <div class="rowRightBox">
            <el-input style="display:inline-block; width:50px;" placeholder=""></el-input> 门课
          </div>
        </div>
       </el-row>
       <el-row>
        <div class="rowcontent">
          <div class="rowLeftBox">不能同时选择的课程</div>
          <div class="rowRightBox">
            <el-button type="primary">添加</el-button>
            <div class="courseList">
              <div class="course">
                <span>钢琴入门,蹭蹭蹭,阿尔甘</span> <i class="el-icon-edit"></i> <i class="el-icon-delete"></i>
              </div>
              <div class="course">
                <span>课外阅读</span> <i class="el-icon-edit"></i> <i class="el-icon-delete"></i>
              </div>
            </div>
          </div>
        </div>
       </el-row>

       <el-row>
        <div class="rowcontent">
          <div class="rowLeftBox">必选的课程类别</div>
          <div class="rowRightBox">
            <el-button type="primary">添加</el-button>
            <div class="courseList">
              <div class="course">
                <span>音乐类 至少选 <el-input style="display:inline-block; width:50px;" placeholder=""></el-input> 门课</span> <i class="el-icon-delete"></i>
              </div>
              <div class="course">
                <span>体育类 至少选 <el-input style="display:inline-block; width:50px;" placeholder=""></el-input> 门课</span> <i class="el-icon-delete"></i>
              </div>
            </div>
          </div>
        </div>
      </el-row>
      </div>
      </div>
      </el-form>
     </el-dialog>

  </div>
</template>
<script>
 
  import { page, get, del, post, put,checkUnique,getKclx,getKcxx,addKcxx,deleteKcxx } from 'api/xkxt/xkrwmanager/index'
  import { getXXMess } from 'api/dict'

  import searchbar from '@/views/components/searchbar'
  export default {
    name: 'xkrwManager',
    components: {
      searchbar
    },
    data() {
      return {
         searchTypes: [
          { value: 'All', label: '全部' },
          { value: 'kcmc', label: '课程名称' },
          { value: 'skr', label: '开课人' }
        ],
        conditionItems: [
          {
            lable: '学年',
            key: 'xndm',
            values: [
              {
                text: '2015-2016',
                value: '2015-2016'
              },
              {
                text: '2016-2017',
                value: '2016-2017'
              },
              {
                text: '2017-2018',
                value: '2017-2018'
              }
            ]
          },
          {
            lable: '学期',
            key: 'xqdm',
            values: [
              {
                text: '上学期',
                value: '01'
              },
              {
                text: '下学期',
                value: '02'
              }
            ]
          },
          {
            lable: '课程类别',
            key: 'courseType',
            values: [
              {
                text: '艺术类',
                value: '01'
              },
              {
                text: '体育类',
                value: '02'
              },
              {
                text: '计算机类',
                value: '03'
              },
              {
                text: '音乐类',
                value: '04'
              }
            ]
          }
        ]
        ,
        xxdm: '',
        tableKey: 0,
        listLoading: false,
        total: 0,
        list: [],
        dictMap: {},
        kclxMap: {},
        title: ['课程名称', '已选课程'],
        form: {},
        listQuery: {              // 分页
          page: 1,
          limit: 20,
          xxdm: ''
        },
        searchsel:'lbmc', 
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogFormVisible: false,
        dialogXkgzFormVisible: false,
        dialogStatus: '',
        changeSure: false,   // 防止重复提交
        moreset:false ,
        data: [],
        kcxxList: [],
        value1: []                 
      }
    },
    created() {
      this.xxdm = window.localStorage.getItem('xxdm');
      this.listQuery.xxdm = this.xxdm;
      this.getList();
      // this.getDictMap();
    },
    methods: {
      search(){

      },
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
      }
      ,
      getList() {
        this.listLoading = true;
        this.listQuery.xxdm = this.xxdm;
        page(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      addXkrwKcxx(kcdms){
        this.form.xxdm = this.xxdm;
        this.form.kcdms = kcdms;
        addKcxx(this.form).then(response => {
        })

      },
       deleteXkrwKcxx(kcdms){
        this.listLoading = true;
        this.listQuery.xxdm = this.xxdm;
        this.listQuery.kcdms = kcdms;
        this.listQuery.xkrwid = this.form.xkrwid;
        deleteKcxx(this.listQuery).then(response => {
         
          this.listLoading = false;
        })

      },
      // 搜索
      handleFilter() {
          if(this.searchsel=="all"){
                this.listQuery = { page: 1, limit: 20, name: undefined }
            }
          this.getList();
      },
      searchChange(val){
            this.listQuery = {
                page: 1,
                limit: 20,
                name: undefined
            }   
            this.listQuery.xxdm = this.xxdm;      
        },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.form = {};
        this.data = [];
        this.changeSure = false;
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.getKclx();
      },
      handleUpdate(row) {
        this.getKclx();
        this.changeSure = false;
        get(row.xkrwid).then(response => {
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
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(row.lbid).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
          });
        });
      },
      cancel() {
        this.dialogFormVisible = false;
      },
      moresetting(){
      if(this.moreset){
        this.moreset = false
      }else{
        this.moreset = true
      }
      },
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.form.xxdm = this.xxdm;
            this.form.kssj = this.formTime(this.form.kssj);
            this.form.jssj = this.formTime(this.form.jssj);
            this.form.kcdms = this.value1;
            //console.log(this.value1);
            post(this.form).then(res => {
              if (res.status == '200') {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({ title: '成功', message: '创建成功', type: 'success', duration: 2000 });
              } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
              }
            })
            const that = this;
            setTimeout(() => {
              that.changeSure = false;
            }, 1500);
          } else {
            this.$notify({ title: '失败', message: '类别名称不能为空', type: 'error', duration: 2000 });
            return false;
          }
        });
      },

      update(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.changeSure = true;
            this.dialogFormVisible = false;
            this.form.xxdm = this.xxdm;
            this.form.kssj = this.formTime(this.form.kssj);
            this.form.jssj = this.formTime(this.form.jssj);
            put(this.form.xkrwid, this.form).then(res => {
              this.dialogFormVisible = false;
              this.getList();
              if (res.status == '200') {
                this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
              } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
              }
            });

            const that = this;
            setTimeout(() => {
              that.changeSure = false;
            }, 1500);
          } else {
            this.$notify({ title: '失败', message: '类别名称不能为空', type: 'error', duration: 2000 });
            return false;
          }
        });
      },
      getValue(type, key) {
        const data = this.dictMap[type];
        return _.find(data, { id: key }).text;
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
      // 格式化日期json
      formTime(val){
            var d = new Date(val);              //时间戳
            var year = d.getFullYear();
            var month = d.getMonth()+1;
            var day = d.getDate();
            var hour = d.getHours();
            var min = d.getMinutes();
            var sec = d.getSeconds();
            if(month<10) month = "0" + month;
            if(day<10) day = "0" + day;
            if(hour<10) hour = "0" + hour;
            if(min<10) min = "0" + min;
            if(sec<10) sec = "0" + sec;
            return year + '-' + month + '-' + day + ' ' + hour + ":" + min + ":" + sec 
        } , 
        //
        handleChange(value, direction, movedKeys) {
        //console.log(value, direction, movedKeys);
        if(this.form.xkrwid){
         //console.log(this.form.xkrwid); 
         if('left' === direction){
        // console.log(movedKeys);
         this.deleteXkrwKcxx(movedKeys);
        }else if('right' === direction){
        // console.log(movedKeys);
         this.addXkrwKcxx(movedKeys);
        }
        } 
      },
      xkgzsz() {
        //this.dialogXkgzFormVisible = true;
        //this.getKclx();
         this.$router.push('/xkxtManager/xkgzsz');
      }

    }
  }
</script>
<style>

  .line {
    text-align: center;
  }

  .sliderRight-enter-active {
    animation-name: fadeInRight;
    animation-duration: .5s;
  }

  .sliderRight-leave-active {
    animation-name: fadeOutRight;
    animation-duration: .5s;
  }

  @-webkit-keyframes fadeInRight {
    from {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  @-webkit-keyframes fadeOutRight {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
  }

  @keyframes fadeOutRight {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
  }

.view{
  width:1000px;
  float: left;
  padding-bottom: 50px;
}
.oarow{
  padding:15px;
}
.padding_transverse_10{
  padding:0 10px;
}
.teachListAZ{
  margin-top:20px;
  height:450px;
  overflow-y:scroll;
  overflow-x:hidden;
}
.collapseItem{
  border-bottom:1px solid #ccc;
}
.collapseItem .el-collapse-item__header{
  font-size:16px;
  padding-left:20px;
}
.collapseItem .el-collapse-item__content{
  padding:10px 20px;
  padding-bottom:10px;
}
.collapseItem:first-child,.el-collapse-item__header{
  background: linear-gradient(#FFF, #f3f3f3) !important; 
}
.selNjStu .collapseItem:first-child,.selNjStu .el-collapse-item__header{
  background: #FFF !important; 
  text-align:center;
  font-size:14px;
  font-weight: bold;
}
.selNjStu .el-collapse{
  border-top:none;
}
.selTeachTime{
  border-collapse: collapse;
  width:100%;
}
.selTeachTime td,.selTeachTime th{
  border:1px solid #e8e8e8;
  font-size:14px;
  text-align:center;
  line-height:35px;
  height:35px;
  width:12.5%;
  transition:.2s all;
}
.selTeachTime th{
  background:#f8f8f8;
}
.selTeachTime td.ck{
  background:#ffce39;
}
.selTeachTime td:hover{
  background:#f8f8f8;
  cursor:pointer;
}
.selTeachTime td.ck:hover{
  background:#ffce39;
}
.el-form-item__content .el-checkbox{
  margin-left:0px !important;
  margin-right:30px;
  line-height:30px;
}
.selectStudent{
  max-height:145px;
  overflow:auto;
}
.selectStudent .selStu{
  width:170px;
  height:36px;
  line-height:36px;
  border:1px solid #e0e0e0;
  border-radius:4px;
  display:inline-block;
  margin-right:10px;
  margin-top:10px;
  text-align:center;
  position:relative;
}
.selectStudent .selStu i{
  position:absolute;
  width:24px;
  height:24px;
  font-size:24px;
  top:7px; 
  right:7px;
  color:#d2d2d2;
  display:none;
}
.selectStudent .selStu:hover i{
  display:block;
  cursor:pointer;
}
.selectStudent .selStu i:hover{
  color:#a2a2a2;
}
.selNjStu{
  border:1px solid #e0e0e0;
  float:left;
  width:100%;
  height:340px;
  margin-top:10px;
}
.selLeft{
  width:200px;
  height:100%;
  float:left;
  overflow:auto;
  overflow-x:hidden;
  border-right:1px solid #e0e0e0;
}
.selRight{
  overflow:hidden;
}
.selBj{
  padding:10px 20px;
  padding-top:0px;
}
.selNjStu .el-collapse-item__content{
  padding-bottom:0px;
}
.selNjStu .el-checkbox{
  display:block;
  margin-left:30px;
  margin-bottom:10px;
}
.bjstuall{
  padding:20px;
}
.bjstuall span{
  padding:5px 15px;
  display:inline-block;
  border-radius:6px;
  margin-bottom:10px;
  cursor:pointer;
  margin-right:10px;
}
.bjstuall span:hover{
  background:#e0e0e0;
}
.bjstuall span.seled{
  background:#409EFF;
  color:#FFF;
}
.searchMain{
  border:1px solid #e0e0e0;
  padding:20px 40px;
  float:left;
  width:100%;
  box-sizing:border-box;
}
.searchBox_1{
  float:left;
  font-size:14px;
  line-height:40px;
  margin-right:10px;
}
.searchBox_2{
  float:left;
  border:1px solid #e0e0e0;
  width:550px;
  height:40px;
}
.cxtj_sel .el-input--suffix .el-input__inner{
  border:none;
  width:110px;
  border-right:1px solid #e0e0e0;
  border-radius:0px;
}
.cxtj_sel .ssnr input{
  border:none;
}
.moreseting{
  line-height:40px;
  margin-left:20px;
  padding-left:25px;
  cursor:pointer;
  transition:.3s all;
  position:relative;
}
.moreseting:hover{
  color:#999;
}
.el-icon-arrow-down.active:before{
  content: "\E605";
}
.detailSearch{
  width:100%;
  margin-top:20px;
}
.rowline{
  border-bottom:1px dotted #e0e0e0;
}
.el-radio{
  margin-right:30px;
}
.el-radio+.el-radio{
  margin-left:0;
  margin-right:30px;
}
.detailSearch .el-form-item{
  margin-bottom:0px;
  padding:10px 0;
}
.selSearchList{
  font-size:12px;
}
.selectSearch{
  padding-top:10px;
}
.searchBox_4{
  height:40px;
  padding:6px 0;
  box-sizing:border-box;
}
.tjbox{
  padding:4px 8px;
  border:1px solid #409EFF;
  display:inline-block;
  margin-right:10px;
  padding-right:30px;
  position:relative;
}
.tjbox span{
  color:#409EFF;
  margin-left:4px;
}
.tjbox .el-icon-error{
  position:absolute;
  color:#409EFF;
  top:6px;
  right:5px;
  cursor:pointer;
}
.tjbox .el-icon-error:hover{
  color:#89d2fb;
}
.rowcontent{
  padding:10px 0;
}
.rowLeftBox{
  float:left;
  width:155px;
  line-height:40px;
  text-align:right;
}
.rowRightBox{
  overflow:hidden;
  padding-left:15px;
}
.courseList{
  width:100%;
}
.course{
  width:100%;
  background:#e0e0e0;
  padding:10px;
  margin-top:10px;
  position:relative;
}
.course .el-icon-delete{
  font-size:24px;
  position:absolute;
  top:50%;
  transform: translateY(-50%);
  right:30px;
}
.course .el-icon-edit{
  font-size:24px;
  position:absolute;
  top:50%;
  transform: translateY(-50%);
  right:70px;
}
.course i{
  transition:.2s all;
  cursor:pointer;
}
.course i:hover{
  color:#ff9600;
}
.courseCheckList{
  padding-bottom:30px;
}

</style>
