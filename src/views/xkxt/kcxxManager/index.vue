<template>
  <section class="content-container">
    <div class="app-container calendar-list-container">
        <div class="filter-container">
           <search-app ref="searchApp" :search-input-select="searchInputSelect"
                :search-placeholder="searchPlaceholder"
                :search-types="searchTypes"
                :condition-items="conditionItems" @searchClick="goSerch">
           </search-app>
        </div>

        <div class="app-container calendar-list-container">
            <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
            <el-button type="primary" @click="tc3">复制课程</el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%"  row-key="kcdm"   >

            <el-table-column align="center" label="课程名称" >
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
                    <span>{{scope.row.skr}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="授课时间">
                <template slot-scope="scope">
                    <span>{{scope.row.skksrq}} 至 {{scope.row.skjsrq}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="人数限制">
                <template slot-scope="scope">
                    <span>{{scope.row.xzrs}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="small" type="danger" @click="handleCkxx(scope.row)">查看</el-button>
                     <span v-if=" scope.row.xndm==dqxn && scope.row.xqdm==dqxq">
                        <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                     </span>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>


      <el-dialog title="复制课程" :visible.sync="dialog_3" width="560px">
      <el-row>
        <el-form ref="form" label-width="100px">
          <el-form-item label="复制" :rules="[{ required: true}]">
              <el-select placeholder="请选择学年" v-model="xndm" @change="selectGetXn" style="display:inline-block; width:150px;">
                <el-option v-for="item in  itemList_2" :key="item.xndm" :label="item.xndm" :value="item.xndm"> </el-option>
              </el-select>

              <el-select placeholder="请选择学期" v-model="xqdm"  @change="selectGetXq" style="display:inline-block; width:150px; margin-left:15px;">
                <el-option v-for="item in  itemList_3" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>

          </el-form-item>
          <el-form-item label="复制至" >
              <span  > {{ dqxnArry.xn}} {{ dqxnArry.xqmc}} </span>
          </el-form-item>
          <el-form-item label="课程名称" :rules="[{ required: true}]" style="line-height:20px;">

               <el-checkbox label="全选" :indeterminate="isIndeterminate" v-model="checkAll"  @change="handleCheckAllChange" ></el-checkbox>
                  <div style="margin: 15px 0;"></div>

               <el-checkbox-group v-model="kcdmArry" @change="handleCheckedCitiesChange">
                 <el-checkbox   v-for="item in  kcxxhistory "  :label="item.kcdm"   :key="item.kcdm">{{item.kcmc}}</el-checkbox>
              </el-checkbox-group>

          </el-form-item>
        </el-form>

      </el-row>

      <el-row>
            <el-button  type="primary" @click="saveKcxx()"  :disabled="changeSure" >确 定</el-button>
            <el-button type="primary"  @click="cancelForm('form')" >取消</el-button>
      </el-row>
    </el-dialog>

    </div>
  </section>
</template>
<script>
import searchApp from '@/views/components/searchbar'
import { getxqList,getxnList,getkclbList} from "api/components/searchbar"
import { page, delObj,getXnlist,getKcxxhistory,copykc} from 'api/xkxt/kcxxManager/index'
import {dqxnxqObj } from 'api/xkxt/specialRaw/index'

export default {
    name: 'kcxxManager',
      components: {
      searchApp
    },
    data(){

        return{

            /***搜索配置开始**/
            searchInputSelect:true,/**显示搜索类型**/
            searchPlaceholder:'',
            searchTypes: [{ /**配置搜索框** 列如：<option value="1">名称</option>**/
            label: "全部",
            value: "all"
            },{
            label:"课程名称",
            value:"kcmc"
            },{
            label:"开课人",
            value:"skr"
            }],
            conditionItems: [{
            key: 'kclbList',/**课程类别 */
            type: 'Checkbox',/**类型 :单选Radio或者多选CheckBox；**/
            label: "课程类别",
            values: []
            },{
            key: 'xnList',/**学年 */
            type: 'Checkbox',
            label: "所在学年",
            selected:{},
            values: []
            },{
            key: 'xqList',/**学期 */
            type: 'Checkbox',
            label: "所在学期",
            selected:{},
            values: []
            },
            {
            key: 'xbxzList',/**性别 */
            type: 'Checkbox',
            label: "性别限制",
            values: []
            }],
            listQuery: {
                query:{
                    page: 1,
                    limit: 10,
                },
                xxdm: "",
                cxlx:'',
                cxmc:'',
                xnGroup:[],
                xqGroup:[],
                kclbGroup:[],
                xbxzGroup:[]

            },
              condition: [],//已选条件
          /***搜索配置end**/

            xxdm:'',
            listLoading: true,                      //加载
            // listQuery: {
            //     page: 1,
            //     limit: 20,
            //     name: undefined
            // },
            searchsel:'all',                           //查询条件                    //判断点击弹层是creat（添加）还是update（编辑）
            tableKey: 0,                            //表格
            list: null,
            total: null,

            dialogFormVisible: false,               //弹层是否显示
            dialogStatus: '',
            textMap: {                              //判断弹层是添加还是编辑
                update: '编辑',
                create: '创建'
            },
            tabPosition:'left',
            form:{},                                //表单
             dialog_3:false,//课程复制弹层
             itemList_3: [{value:'01',label:'上学期'},{value:'02',label:'下学期'}],//学期
             itemList_2: [],//学年
             xndm:'',
             xqdm:'',
             kcxxhistory:[],  //往年课程列表
             dqxn: '',
             dqxq: '',
             dqxnArry:{},

             kcdmArry:[] ,
             checkAll: true,//checkbox 多选
             isIndeterminate:false,
             changeSure:false,  //防止重复提交


        }
    },

    created(){
        this.xxdm = window.localStorage.getItem("xxdm");
        this.listQuery.xxdm = this.xxdm;
    },
    mounted(){
      this.getSearchCriteria();//搜索条件
      dqxnxqObj({xxdm: this.xxdm}).then(response => {
        this.dqxnArry=response;
        this.conditionItems[1].selected.value= response.xn;
        this.conditionItems[1].selected.text= response.xn;
        this.conditionItems[2].selected.value=response.xq;
        this.conditionItems[2].selected.text=response.xqmc;
        this.$refs.searchApp.setChecked();
        this.dqxn = response.xn;
        this.dqxq = response.xq;
        this.listQuery.xnGroup=[response.xn];
        this.listQuery.xqGroup=[response.xq];
        this.getList();
      })
    },
    methods:{
        getList() {
            this.listLoading = true;
            let cxlx=this.listQuery.cxlx;
            if(cxlx==""){
              this.listQuery.cxlx="all";
            }
            page(this.listQuery).then(response => {
                this.list = response.data.rows;
                this.total = response.data.total;
                this.listLoading = false;
            })


        },
        // 搜索
        handleFilter() {
            if(this.searchsel=="all"){
                this.listQuery = { page: 1, limit: 10, name: undefined }
            }
            this.getList();
        },
        searchChange(val){
            this.listQuery = {
                page: 1,
                limit: 10,
                xxdm:this.xxdm,
                name: undefined
            }
        },
        // 分页
        handleSizeChange(val) {
            this.listQuery.query.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.query.page = val;
            this.getList();
        },

          /**高级搜索begin **/
          getSearchCriteria(){ /**搜索条件接口调用方法**/
            /**查询课程类别 */
            getkclbList({xxdm: this.xxdm}).then(response => {
                let model, a;
                for (a of response.data.rows) {
                model = {};
                model.value = a.lbid;
                model.text = a.lbmc;
                this.conditionItems[0].values.push(model);
                }
            });
            /**查询学年列表**/
            getxnList({xxdm: this.xxdm}).then(response => {
               // this.conditionItems[1].selected.value= response.xn;
              //  this.conditionItems[1].selected.text= response.xn;
                let model, a,data = response;
                for (a of data) {
                model = {};
                model.value = a.xn;
                model.text = a.xn;
                this.conditionItems[1].values.push(model);
                }
            });
            /** 查询学期列表 */
            getxqList({xxdm: this.xxdm}).then(response => {
               // this.conditionItems[2].selected.value= response.xq;
               // this.conditionItems[2].selected.text= response.xqmc;
                let model, a,data = response;
                for (a of data) {
                model = {};
                model.value = a.xq;
                model.text = a.xqmc;
                this.conditionItems[2].values.push(model);
                }
            });
             /**查询相别限制列表**/
            this.conditionItems[3].values.push({value:'0',text:'无限制'});
            this.conditionItems[3].values.push({value:'1',text:'男'});
            this.conditionItems[3].values.push({value:'2',text:'女'});
        },
        goSerch(data){
            this.listQuery.cxmc = data.curValue;
            this.listQuery.cxlx = data.type;
            this.listQuery.kclbGroup=data.temp[0];
            this.listQuery.xnGroup=data.temp[1];
            this.listQuery.xqGroup=data.temp[2];
             this.listQuery.xbxzGroup=data.temp[3];
            this.getList();
        },
        /**高级搜索 end*/

        // 添加跳转页面
        handleCreate() {
             this.$router.push('/auditKcxx/addkcxxManager');
        },
        //复制课程点击事件
       tc3(){
         this.dialog_3 = true;
         this.Xnlist();
        },

        //复制课程全选
         handleCheckAllChange(val) {

           if(val){
               for (let index = 0; index < this.kcxxhistory.length; index++) {
                   const element = this.kcxxhistory[index];
                   this.kcdmArry.push(element.kcdm);
               }
           }else{
               this.kcdmArry=[];
           }
           this.isIndeterminate = false;
        },
       //复制课程多选
       handleCheckedCitiesChange(value) {

         let checkedCount = value.length;
         this.checkAll = checkedCount === this.kcxxhistory.length;
         this.isIndeterminate = checkedCount > 0 && checkedCount < this.kcxxhistory.length;
       },

        //获取学年列表
        Xnlist(){
            getXnlist({"xxdm":this.xxdm}).then((res) => {
                this.itemList_2 = res.data;
            });
        },

         //复制课程————学年选择
         selectGetXn(value){
           this.xndm=value;
           let query={
                  xxdm:this.xxdm,
                  xndm:this.xndm,
                  xqdm:this.xqdm
               }
            getKcxxhistory(query).then((res) => {
                this.kcxxhistory = res.data;
            });

         },
         selectGetXq(value){//学期选择 -复制课程
             this.xqdm=value;
              let query={
                  xxdm:this.xxdm,
                  xndm:this.xndm,
                  xqdm:this.xqdm
               }
            getKcxxhistory(query).then((res) => {
                this.kcxxhistory = res.data;
                for (let index = 0; index < this.kcxxhistory.length; index++) {
                   const element = this.kcxxhistory[index];
                   this.kcdmArry.push(element.kcdm);
                }
            });
         },
         //复制课程弹层取消
           cancelForm(){
            this.dialog_3 = false;//复制课程弹层隐藏
           },

       //复制课程保存 确定
          saveKcxx() {
              this.changeSure=true;
              let length=this.kcdmArry.length;
              if(length=='0'){
                     this.changeSure=false;
                     this.$notify({ title: '失败', message: '请选择要复制的课程', type: 'error', duration: 2000 });
               }else{
                     let parm={
                             xxdm: this.xxdm,
                             xndm: this.dqxn,
                             xqdm: this.dqxq,
                             kcdmArry: this.kcdmArry

                        }
                     copykc(parm).then((res) => {

                         if (res.status == '200') {
                                       this.getList();
                                       this.dialog_3 = false;//复制课程弹层隐藏
                                       this.$notify({ title: '成功', message: '课程复制成功', type: 'success', duration: 2000 });
                                      // this.$notify({ title: '复制失败', message: res.message+' 已存在，复制失败', type: 'error', duration: 2000 });
                         }else{
                             this.changeSure=false;
                             this.$notify({ title: '失败', message: res.message+' 已存在，复制失败', type: 'error', duration: 2000 });
                         }

                     })

                }

         },
         //查看
          handleCkxx(row){
                 this.$router.push ({
                      path: '/audit/ckkcxxManager',
                      name:'课程查看',
                      params: {
                      kcdm: row.kcdm
                     }
                 })
          },
          //修改
          handleUpdate(row){
                this.$router.push ({
                      path: '/audit/updatekcxxManager',
                      name:'课程修改',
                      params: {
                      kcdm: row.kcdm
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
                             xxdm: this.xxdm,
                             xndm: this.dqxn,
                             xqdm: this.dqxq,
                             kcdm: row.kcdm

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
        // 取消按钮
        cancel(formName) {
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
        },


    }
}
</script>
<style scope>
  .app-container .filter-container .filter-item{ vertical-align: inherit;}
  .app-container .el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
  .app-container .el-checkbox+.el-checkbox{margin-left: 0;}
  .app-container .el-checkbox{ margin-right: 30px;}

    .line{ text-align: center;}
</style>
