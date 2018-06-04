<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">清空</el-button>
        </div>
        
        <el-table :key='tableKey' v-loading.body="listLoading" :data="contentList" border fit highlight-current-row style="width: 100%" height="750">
            <el-table-column label="课程名称" fixed width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.bjmc}}</span>
                </template>
            </el-table-column>
            <el-table-column v-for="item in kcList" :key="item.uuid" :label="item.kcmc" width="150">
                <template slot-scope="scope">
                    <div class="selBox">
                        <div class="selBox-input">
                            <input autocomplete="off" v-model="scope.row[item.uuid].rkjs" placeholder="" size="" readonly="readonly" type="text" rows="2" class="el-input__inner" @click="handerCilck(item.uuid,scope.$index,scope.row[item.uuid])">
                        </div>
                    </div>
                    <!-- <el-select v-model="scope.row[item.uuid].rkjs" filterable clearable placeholder="" @click="handerCilck(item.uuid,scope.$index)"></el-select> -->
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="请选择教师" :visible.sync="dialogFormVisible" width="50%">   
            <el-select v-model="mp" multiple filterable clearable placeholder="" @change="handleChangeSel(mp)">
                <el-option v-for="item in jsList" :key="item.gh" :label="item.xm" :value="item.gh"></el-option>
            </el-select>
        </el-dialog>    
    </div>
</template>
<script>
import {
    teachclassAll,
    addObj,
    delObj,
    delAllObj
} from 'api/admin/teachclass/index'
import {dqxnxqObj} from 'api/admin/acadyear/index'
export default {
    name: 'teachclass',
    data(){
        return{
            mp:[],
            mpindex:'',
            mpkcid:'',
            mplist:[],


            xxdm:'',
            dqxn:'',            //当前学年
            dqxq:'',            //当前学期
            listLoading: true,                      //加载
            listQuery: {
                page: 1,
                limit: 20,
                name: undefined
            },

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
            bjList:[],
            kcList:[],
            jsList:[],
            jskcbjList:[],
            contentList:[],
            createform:[],

            selallGh:[],

        }
    },
    mounted(){
        this.xxdm = window.localStorage.getItem("xxdm");

        this.getList()
    },
    watch:{
        
    },
    methods:{
        getList() {
            this.contentList = [];
            this.listLoading = true;           
            teachclassAll({"xxdm":this.xxdm}).then(response => {
                this.list = response.data;
                this.bjList = response.data.bjList;
                this.kcList = response.data.kcList; 
                this.jsList = response.data.jsList;
                this.jskcbjList = response.data.jskcbjList; 
                this.jsMap = response.data.jsMap;

                for(var i=0;i<this.bjList.length;i++){
                    var course = {};
                    course["bjmc"] = this.bjList[i].bj;
                    course["bjid"] = this.bjList[i].uuid;

                    for(var j=0;j<this.kcList.length;j++){
                        var conlist = {};
                        conlist["kcid"] = this.kcList[j].uuid;
                        conlist["kcmc"] = this.kcList[j].kcmc;
                        conlist["rkjs"] = '';
                        conlist["rkjsgh"] = '';
                        course[this.kcList[j].uuid] = conlist;
                    }
                    for(var h=0;h<this.jskcbjList.length;h++){
                        var tslist = {}
                        if(this.jskcbjList[h].bjid==this.bjList[i].uuid && this.kcList.length>0){
                            course[this.jskcbjList[h].kcid].rkjsgh = this.jskcbjList[h].gh
                            course[this.jskcbjList[h].kcid].rkjs = this.jskcbjList[h].rkjsxm
                        }
                        
                    }               
                    this.contentList.push(course);
                }
                // console.log(this.contentList)
                this.listLoading = false;
            })

        },
        handleChange(kcid,gh,ind){
            this.createform = {};
            this.createform.kcid = kcid;
            this.createform.kcmc = this.contentList[ind][kcid].kcmc;
            this.createform.bjid = this.contentList[ind].bjid;
            this.createform.bjmc = this.contentList[ind].bjmc;
            this.createform.gh = gh;
            this.createform.xxdm = this.xxdm;
            this.createform.rkjsxm = this.jsMap[gh];

            if(gh){
                addObj(this.createform).then((res) => {
                    if(res.status=="200"){
                        // this.getList();
                        this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000});
                    }else{
                        this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
                    }
                });         
            }
            
        },
        handleChangeDel(kcid,gh,ind){
            this.createform = {};
            this.createform.kcid = kcid;
            this.createform.kcmc = this.contentList[ind][kcid].kcmc;
            this.createform.bjid = this.contentList[ind].bjid;
            this.createform.bjmc = this.contentList[ind].bjmc;
            this.createform.gh = gh;
            this.createform.xxdm = this.xxdm;
            this.createform.rkjsxm = this.jsMap[gh];

            if(gh){
                // console.log(this.createform)
                delObj(this.createform).then((res) => {
                    if(res.status=="200"){
                        // this.getList();
                        this.$notify({title: '成功', message: '删除成功', type: 'success', duration: 2000});
                    }else{
                        this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
                    }
                });   
            }
        },
        handleCreate(){     
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delAllObj({"xxdm":this.xxdm}).then((res) => {
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
        handerCilck(kcid,index,item){  
            this.mp=item.rkjsgh ? item.rkjsgh.split(',') : [];
            this.mplist = item.rkjsgh ? item.rkjsgh.split(',') : [];
            // this.mp = item.rkjs;
            //  this.contentList[index].bjid;   //班级id
            this.dialogFormVisible = true
            // this.contentList[index][kcid].rkjs
            this.mpindex=index;
            this.mpkcid=kcid;
        },
        delclick(kcid,index){
            
            this.contentList[index][kcid].rkjsgh="";
            this.contentList[index][kcid].rkjs="";
            this.handleChange(kcid,"",index)
        },
        handleChangeSel(gh){
            var diffgh=[];
            if(this.mplist.length<gh.length){           //增加
               diffgh = _.differenceWith(gh, this.mplist, _.isEqual)  
               this.handleChange(this.mpkcid,diffgh[0],this.mpindex) 
            }
            else if(this.mplist.length>gh.length){
                diffgh = _.differenceWith(this.mplist, gh, _.isEqual)
                this.handleChangeDel(this.mpkcid,diffgh[0],this.mpindex)
            }
            
            var ghxm = [];
            if (gh.length > 0) this.contentList[this.mpindex][this.mpkcid].rkjsgh = gh.join();
            for(var i in gh){
                ghxm.push(this.jsMap[gh[i]])
            }
            if (gh.length > 0) this.contentList[this.mpindex][this.mpkcid].rkjs = ghxm.join();

            if(gh==0){
                this.contentList[this.mpindex][this.mpkcid].rkjsgh = "";
                this.contentList[this.mpindex][this.mpkcid].rkjs = "";
            }
            
           
            if(this.mplist!=gh){
                this.mplist = gh
            }

            


            
            this.selallGh = gh
        },
        cancel(){

        },
        create(){
            var selalljsxm=[]; 
            var selalljsxmobj = '';
            var selallGhobj = '';

            
            for(var j in this.selallGh){
                selalljsxm.push(this.jsMap[this.selallGh[j]])
                // this.handleChange(this.mpkcid,this.selallGh[j],this.mpindex)
            }          
            if (this.selallGh.length > 0) selalljsxmobj = selalljsxm.join(); 
            if (this.selallGh.length > 0) selallGhobj = this.selallGh.join();

            this.contentList[this.mpindex][this.mpkcid].rkjsgh=selallGhobj;
            this.contentList[this.mpindex][this.mpkcid].rkjs=selalljsxmobj;

        },
        
       
    }
}
</script>
<style scoped>
    .filter-container .filter-item{ vertical-align: inherit;}
    .el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
    .el-checkbox+.el-checkbox{margin-left: 0;}
    .el-checkbox{ margin-right: 30px;}

    .line{ text-align: center;}

    .selBox{display: inline-block; position: relative;}
    .selBox-input{position: relative; font-size: 14px;display: block;width: 100%;}
    .selBox .el-input__inner{ cursor: pointer;}
    .selBox .el-input__icon{ display: none;}
    .selBox:hover .el-input__icon{ display: block;}
    

    .keyspan{ height: 40px; line-height: 40px; width: 100%; display: block; border: 1px solid #c0c4cc;}
    .el-dialog__body .el-select{ display: block; margin-right: 100px}
</style>