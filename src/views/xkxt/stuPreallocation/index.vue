<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
                <el-select v-model="searchsel" slot="prepend" placeholder="请选择" @change="searchChange" style="width:120px; height:38px; margin:0 auto;">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="课程名称" value="kcmc"></el-option>
                    <el-option label="开课人" value="skrxm"></el-option>
                </el-select>  
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="课程名称">
                <template slot-scope="scope">
                    <span>{{scope.row.kcmc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="课程类别">
                <template slot-scope="scope">
                    <span>{{scope.row.lbmc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="授课教师">
                <template slot-scope="scope">
                    <span>{{scope.row.skrxm}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="授课时间">
                <template slot-scope="scope">
                    <span>{{scope.row.sksj}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="已分配人数 / 限制人数">
                <template slot-scope="scope">
                    <span>{{scope.row.yfprs}}/{{scope.row.xzrs}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="success" @click="handlefpxs(scope.row)">分配</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <!--新增界面-->
	    <el-dialog title="分配" :visible.sync="dialogFormVisible" @close="colseDialog">
		  <el-row>
	        <el-button type="primary" @click="bc">保存</el-button>
	      </el-row>
	
	      <el-row style="margin-top:20px;">
	        <span style="padding-right:10px;">筛选条件:</span> <el-button type="primary" @click="show=true" >按班级</el-button> <el-button type="primary" @click="show=false">按特长生类型</el-button>
	      </el-row>
	      <el-form label-width="80px" ref="addForm">
       		<!--已选学生-->
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item title="已选学生:" name="1">
                <div>
                  <el-tag
                    size="small"
                    :key="index"
                    v-for="(xsxx,index) in yfpXsList"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(index,xsxx)">
                    {{xsxx.xm}}
                  </el-tag>
                </div>
              </el-collapse-item>
            </el-collapse>
			<div style="margin-top:10px;" :class="show ? 'xs' : 'yc' ">
              <el-row :gutter="12">
                <el-col :span="6">
                  <el-card shadow="never">
                    <!--年级班级展示-->
                    <el-tree
                      :data="treeData"
                      show-checkbox
                      node-key="id"
                      check-strictly
                      accordion
                      ref="tree"
                      :highlight-current="true"
                      :default-expanded-keys="[defnjid]"
                      @node-click="handleCheckClick"
                      @check-change="handleCheckChange">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span> 
                    <span>({{ node.data.checkCount }}/{{ node.data.count }})</span>
                    </span>
                    </el-tree>
                  </el-card>
                </el-col>
                <el-col :span="18">
                  <el-card shadow="hover">
                    <!--班级学生展示-->
                    <el-checkbox-group v-model="checkboxGroup5" size="small"  >
                      <el-checkbox
                        v-for="(student,index) in studentArry"
                        :key="index"
                        :label="student.xh" :name="student.xm"
                        @change="handleCheckedCitiesChange"
                        size="small"
                        border>{{student.xm}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-card>
                </el-col>

              </el-row>
            </div>
            <div style="margin-top:10px;" :class="show ? 'yc' : 'xs' ">
              <el-tabs tab-position="left" v-model="activetcs" type="card" style="height: 200px;" @tab-click="tabclick" >
                <el-tab-pane 
                    ref="tabs"
                    :key="item.lxid" :name="item.lxmc" 
                    v-for="item in tcsList" >
                    <span slot="label">{{item.lxmc}}({{item.yxktcsrs}}/{{item.tcsrs}})</span>
                    <el-checkbox-group v-model="checkboxGroup5" size="small"  >
                      <el-checkbox
                        v-for="(student,index) in studentArry2"
                        :key="index"
                        :label="student.xh" :name="student.xm"
                        @change="handleCheckedtcsChange"
                        size="small"
                        border>{{student.xm}}
                      </el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane>
              </el-tabs>
            </div>
	      </el-form>
	    </el-dialog>
    </div>
</template>
<script>
import {dqxnxqObj,getBjSdunt,page,xsyfpxq,getIstsdkc,getTcsXs,saveXsxkInfo} from 'api/xkxt/stuPreallocation/index'

export default {
    name: 'stuPreallocation',
    data(){
        return{
        	xxdm:'',
        	dqxn: '',
        	dqxq: '',
            listLoading: true,                      //加载
            listQuery: {
                page: 1,
                limit: 20,
                xxdm: '',
                name: undefined
            },
            searchsel:'',                             //查询条件                    //判断点击弹层是creat（添加）还是update（编辑）
            show: true,
            tableKey: 0,                            //表格
            list: null,
            total: null,
			tcsList: [],
			yfpXsList: [],                         //已分配学生
			treeData: [],
			checkboxGroup5: [],
            dialogFormVisible: false,               //弹层是否显示
            dialogStatus: '',   
            tabPosition:'left',
            form:{},                                //表单
            activeName: '1',  //设置折叠板
            studentArry: [],    
            studentArry2: [],
            treeTemp: [],                    //班级学生
            kcdm: '',
            week: '',
            section: '',
            defnjid: '',
            activetcs: '',
            tcstabindex: 0,
            changeSure:false                      //防止重复提交
        }
    },
    created(){
    	this.xxdm = window.localStorage.getItem("xxdm");
        this.listQuery.xxdm = this.xxdm;
     	dqxnxqObj({xxdm: this.xxdm}).then(response => {
	        this.dqxn = response.xn;
	        this.dqxq = response.xq;
      	})
        this.getList()
    },
    watch:{
        
    },
    methods:{
        getList() {
            this.listLoading = true;
            page(this.listQuery).then(response => {
                this.list = response.data.rows;
                this.total = response.data.total;
                this.listLoading = false;
            })

        },
        // 搜索
        handleFilter() {
            if(this.searchsel=="all"){
                this.listQuery = { page: 1, limit: 20, name: undefined }
                this.listQuery.xxdm = this.xxdm;
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
        // 分页
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getList();
        },        
        //跳转到分配页面    
        handlefpxs(row) {
        	row.xxdm = this.xxdm;
            this.kcdm = row.kcdm;
            this.week = row.week;
            this.section = row.section;
            this.dialogFormVisible = true;//打开新增页面弹框
            this.checkboxGroup5=[];
            this.studentArry= [];
            this.studentArry2= [];
        	xsyfpxq(row).then(response => {
        		this.yfpXsList = response.data.yfpXsList;
                this.treeData = response.data.zNodesList;
                this.defnjid = this.treeData[0].id;
                this.xgtree(this.treeData);
                this.tcsList = response.data.tcsList;
                this.tcsxs(this.tcsList[0].lxid);
                this.activetcs = this.tcsList[0].lxmc;
   
        	})
        },

        xgtree: function (treeData) {        /**@弹框操作方法**/
        /**设置默认第一个班级选中**/
        let [node,bool] = [this.$refs,false];
        if (!bool) {
          setTimeout(() => {
            if (node) { /**渲染未完成继续请求获取对象**/
                bool = true;   
                let [tree,key] = [node.tree,this.treeData[0].children[0].id];   //获取当前树
                    $(tree.$el).find("div[role='treeitem']").each(function (e,i) {
                            if (e==0){
                            $(i).find("div:first label[role='checkbox']").remove();
                            } else {
                            $(i).parents("div[role='treeitem']").siblings().eq(e-1).find("div:first label[role='checkbox']").remove();
                            }
                    });
                tree.setCheckedKeys([key]);//设置选中
        
              
            }
          }, 10);
        }
        this.dialogFormVisible = true;//打开新增页面弹框
      },
      colseDialog: function () {       /**关闭弹框**/
        this.$refs['addForm'].resetFields();
        this.dialogFormVisible = false;
        this.defnjid='';
      },
        handleCheckChange: function (data, checked) {  /**@树形插件勾选触发事件方法**/
        console.log("12345");
            if(checked&&data.level == 2){
                this.$refs.tree.setCheckedKeys([]);
                this.$refs.tree.setCheckedKeys([data.id]);
                let v = {bjid: data.id, xxdm: this.xxdm, xn: this.dqxn};
                /**记录班级id**/
                this.treeTemp = [];
                this.treeTemp.push(data.id);
                getBjSdunt(v).then((res) => {
                /**获取班级学生接口**/
                this.studentArry= res.data;
                /**点击班级设置已选学生在班级选中**/
                let list = this.yfpXsList,xs_yx, xs_bj;
                for (let a of list) {//遍历已选学生
                    xs_yx = a;
                    for (let b of res.data) {//遍历班级学生
                    xs_bj = b;
                    /**已选学生是否存在当前班级中,存在则选中**/
                    if (xs_yx.xh == xs_bj.xh) {
                        this.checkboxGroup5.push(xs_yx.xh);
                    }
                    }
                }
                });

            }
        },
      handleClose: function (index, xsxx) {  /**@已选学生标签删除方法**/
        let num = -1;
        this.yfpXsList.splice(index, 1);//删除已选的学生
        $(this.checkboxGroup5).each(function (i_, e) { //得到删除元素的下标
          if (e == xsxx.xh) {
            num = i_;
            return false;
          }
        });
        if (num >= 0) {//已选元素已经删除，班级学生取消选中
          this.checkboxGroup5.splice(num, 1);
        }
        this.updateTreeStudenCount(false);
      },
      //选择特长生类型后显示相应学生
      tabclick(tab, event) {

          console.log("tab");
          let i = tab.index;
          this.tcstabindex = i;
          this.tcsxs(this.tcsList[i].lxid);
      },
      //特长生学生
      tcsxs(lxid){
          let v = {lxid: lxid, xxdm: this.xxdm};
            console.log(lxid);
          getTcsXs(v).then((res) => {
              /**获取特长生类型学生 **/
              this.studentArry2=res.data;
              console.log(res.data);
              /**点击特长生类型，已选学生在此特长生类型的学生中选中**/
              let list = this.yfpXsList,xs_yx, xs_bj;
            for (let i = 0, j = list.length; i < j; i++) {
            xs_yx = list[i];
            for (let k = 0, g = res.data.length; k < g; k++) {
                xs_bj = res.data[k];
                /**已选学生是否存在当前班级中,存在则选中**/
                if (xs_yx.xh == xs_bj.xh) {
                this.checkboxGroup5.push(xs_yx.xh);
                }
            }
            }
          });
      },
      handleCheckClick: function (data, node, e) {
        /**树形插件班级点击事件**/
        console.log(data);
        if (node.level == 2) {
          let v = {bjid: data.id, xxdm: this.xxdm, xn: this.dqxn};
           /**记录班级id**/
          this.treeTemp = [];
          this.treeTemp.push(data.id);
          getBjSdunt(v).then((res) => {
            /**获取班级学生接口**/
            this.studentArry=res.data;
            /**点击班级设置已选学生在班级选中**/
            let list = this.yfpXsList,xs_yx, xs_bj;
            for (let i = 0, j = list.length; i < j; i++) {
              xs_yx = list[i];
              for (let k = 0, g = res.data.length; k < g; k++) {
                xs_bj = res.data[k];
                /**已选学生是否存在当前班级中,存在则选中**/
                if (xs_yx.xh == xs_bj.xh) {
                  this.checkboxGroup5.push(xs_yx.xh);
                }
              }
            }
          });
    	}
      },//树形插件方法结束\
     
      handleCheckedCitiesChange: function (check, e) {  /**@班级学生点击事件**/
        let json = e.target,
            map = {xh: json.defaultValue, xm: json.name, xxdm: this.xxdm};
            if(check){
                this.checkStudent(map,"tree");
            }else{
                this.qxxs(map,"tree");
            }
      },
      handleInputConfirm: function (v) { /**@班级学生选中增加已选学生方法**/
        if (v.xh) {
          let obj = this.yfpXsList;
          obj.push(v);
        }
        this.inputVisible = false;
      },
      checkStudent:function(v,a){
         let params ={xh:v.xh,kcdm:this.kcdm,week:this.week,section:this.section};
         getIstsdkc(params).then(response => {
            if(response.data.istsdkc=="false"){
                    this.$message({
                    message: '点选学生时，需要判断上课时间冲突，相同开课时间的课程不能分配同一个学生',
                     type: 'warning'
                    });
                }else{
                     /**选中学生**/
                    this.handleInputConfirm(v);
                    if(a=="tree"){
                        this.updateTreeStudenCount(true);
                    }else if(a=="tabs"){
                        this.updateTabsStudenCount(true);
                    }
                    
                }
            }) 
      },

     //取消学生
      qxxs: function(v,a){
          for(let i in this.checkboxGroup5){
                     if(this.checkboxGroup5[i]==v.xh){
                       this.checkboxGroup5.splice(i,1);
                        }
                    } 
                     /**取消选中**/
                    let num = -1;
                    $(this.yfpXsList).each(function (i, e) { //
                        if (e.xh == v.xh) {
                        num = i;
                        return false;
                        }
                    });
                    if (num >= 0) {
                        this.yfpXsList.splice(num, 1);
                    }
                    if(a=="tree"){
                        this.updateTreeStudenCount(false);
                    }else if(a=="tabs"){
                        this.updateTabsStudenCount(false);
                    }
                    
      },
      updateTreeStudenCount: function (v) { /**@更新学生所属班级的树节点数量**/
         let node = this.$refs.tree.getNode(this.treeTemp[0]), /**得到学生所属班级节点数组**/
            t_index = node.data.index, /**当前需要修改班级节点索引**/
            nodeData = node.parent.data;
        /**当前班级节点的父节点数据**/
        /**更新年级班级树学生已选个数**/
        if (v) {
          nodeData.children[t_index].checkCount = nodeData.children[t_index].checkCount + 1;
          nodeData.checkCount = nodeData.checkCount + 1;
          this.treeData.splice(nodeData.index, 1, nodeData);
        } else {
          nodeData.children[t_index].checkCount = nodeData.children[t_index].checkCount - 1;
          nodeData.checkCount = nodeData.checkCount - 1;
          this.treeData.splice(nodeData.index, 1, nodeData);
        }
      },

      handleCheckedtcsChange: function(check, e){
          console.log("000000000000000000");
          //let aa =this.$refs.tabs[tcstabindex];
          let json = e.target,
            map = {xh: json.defaultValue, xm: json.name, xxdm: this.xxdm};
            if(check){
                this.checkStudent(map,"tabs");
            }else{
                this.qxxs(map,"tabs");
            }
      },

     //更新特长生类型label后已选人数
     updateTabsStudenCount: function(v){
         if(v){
              this.tcsList[this.tcstabindex].yxktcsrs+=1;   
         }else{
              this.tcsList[this.tcstabindex].yxktcsrs-=1;   
         }
         
     },

     bc: function () {   /**@保存数据**/
        this.$confirm('确认要保存吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let pram = {xxdm: this.xxdm,kcdm: this.kcdm, yfpXsList: this.yfpXsList}
          saveXsxkInfo(pram).then((res) => {
            this.listLoading = false;
            this.$message({message: res.status > 0 ? '保存成功' : "保存失败", type: 'success'});
            this.$refs['addForm'].resetFields();
            this.dialogFormVisible = false;
            this.getList();
          });
        }).catch(() => {
          this.$message.error('抱歉，系统操作异常请重试！');
        });
      },
    }
}
</script>
<style>
    .filter-container .filter-item{ vertical-align: inherit;}
    .el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
    .el-checkbox+.el-checkbox{margin-left: 0;}
    .el-checkbox{ margin-right: 30px;}
    .yc{display:none};
    .xs{display:block}
    .line{ text-align: center;}
</style>