<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
                <el-select v-model="searchsel" slot="prepend" placeholder="请选择" @change="searchChange" style="width:120px; height:38px; margin:0 auto;">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="学年" value="xn"></el-option>
                </el-select>  
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="学年" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.xn}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学期" width="140">
                <template slot-scope="scope">
                    <span>{{scope.row.xqmc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="工作时间">
                <template slot-scope="scope">
                    <span>{{workTime(scope.row.gzkssj) + "至" + workTime(scope.row.gzjssj)}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学习时间">
                <template slot-scope="scope">
                    <span>{{workTime(scope.row.xxkssj) + "至" + workTime(scope.row.xxjssj)}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学习周数" width="120">
                <template slot-scope="scope">
                    <span>{{weekNum(scope.row.xxkssj,scope.row.xxjssj)}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="当前学年学期" width="120">
                <template slot-scope="scope">
                    <span>{{(scope.row.dqxnxq=="1")?"是":"否"}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template> 
            </el-table-column> -->
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="700px" >
            <el-form :model="form" ref="form" label-width="110px">
                <el-form-item label="学年" required>
                    <el-col :span="5">
                        <el-input v-model="formxnstart" placeholder="请输入年份"></el-input>
                    </el-col>
                    <el-col class="line" :span="1">-</el-col>
                    <el-col :span="5">
                        <el-input v-model="formxnend" placeholder="请输入年份"></el-input>
                    </el-col>                
                </el-form-item>
                <el-form-item label="学期"  prop="xq" :rules="[{ required: true, message: '学期不能为空'}]">
                    <el-col :span="6">
                        <el-select v-model="form.xq" placeholder="请选择">
                            <el-option v-for="item in termList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>   
                <el-row :gutter="18">
                    <el-col :span="12">
                        <el-form-item label="工作开始时间" prop="gzkssj" :rules="[{ required: true, message: '工作开始时间不能为空'}]">
                            <el-date-picker type="date" v-model="form.gzkssj" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工作结束时间"  prop="gzjssj" :rules="[{ required: true, message: '工作结束时间不能为空'}]">
                            <el-date-picker type="date" v-model="form.gzjssj" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>    
                <el-row :gutter="18">
                    <el-col :span="12">
                        <el-form-item label="学习开始时间"  prop="xxkssj" :rules="[{ required: true, message: '学习开始时间不能为空'}]">
                            <el-date-picker type="date" v-model="form.xxkssj" placeholder="选择日期" @change="xxChange"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学习结束时间"  prop="xxjssj" :rules="[{ required: true, message: '学习结束时间不能为空'}]">
                            <el-date-picker type="date" v-model="form.xxjssj" placeholder="选择日期" @change="xxChange"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-form-item label="当前学年学期">
                    <el-radio-group v-model="form.dqxnxq">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="学习周数">
                    <el-input v-model="xxweek" placeholder="自动计算" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定</el-button>
                <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
            </div>
            
        </el-dialog>
    </div>
</template>
<script>
import {
    page,
    getObj,
    addObj,
    putObj,
    delObj
} from 'api/admin/acadyear/index'
import {termpage} from 'api/admin/term/index' 
import {getXXMess} from 'api/dict'
export default {
    name: 'acadyear',
    data(){
        return{
            xxdm:'',
            listLoading: true,                      //加载
            listQuery: {
                page: 1,
                limit: 20,
                name: undefined
            },
            searchsel:'all',                           //查询条件                    //判断点击弹层是creat（添加）还是update（编辑）

            tableKey: 0,                            //表格
            list: null,
            total: null,
            xxweek:'',                              //学习周数

            dialogFormVisible: false,               //弹层是否显示
            dialogStatus: '',   
            textMap: {                              //判断弹层是添加还是编辑
                update: '编辑',
                create: '创建'
            },          
            tabPosition:'left',
            form:{},                                //表单
            termList:[],                            //学期
            formxnstart:'',
            formxnend:'',

            changeSure:false,                       //防止重复提交

        }
    },
    created(){
        this.xxdm = window.localStorage.getItem("xxdm");
        this.listQuery.xxdm = this.xxdm;
        this.getList();
        this.getTermList();
    },
    methods:{
         getList() {
            this.listLoading = true;
            this.listQuery.xxdm = this.xxdm;
            page(this.listQuery).then(response => {
                this.list = response.data.rows;
                this.total = response.data.total;
                this.listLoading = false;
            })
        },
        getTermList(){          
            getXXMess(this.xxdm).then(response => {
                this.termList = response.data.xqlx;
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
                xxdm:this.xxdm,
                name: undefined
            }
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
        // 添加
        handleCreate() {
            this.resetTemp();
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
        },     
        resetTemp() {
            this.form = {              
                dqxnxq : 1,
            };
            this.yearStr();
            this.xxweek = 0;  
            this.changeSure = false;
        },
        //编辑    
        handleUpdate(row) {
            this.changeSure = false;
            getObj(row.uuid).then(response => {
                this.form = response.data;
                this.dialogFormVisible = true;
                this.dialogStatus = 'update';    
              // 学年
                this.yearStr(this.form.xn)
              // 开始时间、结束时间
                this.form.gzkssj = this.workTime(this.form.gzkssj);
                this.form.gzjssj = this.workTime(this.form.gzjssj);
                this.form.xxkssj = this.workTime(this.form.xxkssj);
                this.form.xxjssj = this.workTime(this.form.xxjssj);
              // 学习周数
                this.xxweek =  this.weekNum(this.form.xxkssj,this.form.xxjssj)
                this.form.dqxnxq ? this.form.dqxnxq : 1;
            });
        }, 
        // 删除
        handleDelete(row) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delObj(row.uuid).then(() => {
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    });
                    const index = this.list.indexOf(row);
                    this.list.splice(index, 1);
                });
            }).catch(e => {
                    // console.log(e)
                });
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
        // 周数
        weekNum(xk,js){
            if(xk&&js){
                var start = new Date(xk);
                var end = new Date(js);
                var diff = parseInt((end - start) / (1000*60*60*24)); 
                var week = '';
                if(diff){
                    week = parseInt(diff/7);
                }else{
                    week = "0";
                } 
            }else{
                week = "0";
            }
            return week
        },
        // 学年
        yearStr(val){
            if(val){   
                var str = val.split("-");
                this.formxnstart=str[0];
                this.formxnend=str[1];     
            }else{
                var time = new Date();
                this.formxnstart= time.getFullYear()-1;
                this.formxnend= time.getFullYear();
            }   
        },
        // 学习时间选择变动
        xxChange(){
            this.xxweek =  this.weekNum(this.form.xxkssj,this.form.xxjssj)
        },       
        // 取消按钮
        cancel(formName) {
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
        },
        // 编辑页面
        create(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {                 
                    this.changeSure = true;
                    this.form.gzkssj = this.formTime(this.form.gzkssj);
                    this.form.gzjssj = this.formTime(this.form.gzjssj);
                    this.form.xxkssj = this.formTime(this.form.xxkssj);
                    this.form.xxjssj = this.formTime(this.form.xxjssj);
                    this.form.xxdm = window.localStorage.getItem("xxdm");
                    this.form.xn = this.formxnstart+"-"+this.formxnend;
                     if(this.form.xq){
                        this.form.xqmc = _.find(this.termList,{"id":this.form.xq}).text
                        
                    }else{
                        this.form.xqmc = ''
                    }
                    this.form.sfpltj = '0';             //是否批量添加
                    addObj(this.form).then((res) => {
                        if(res.status=="200"){
                            this.dialogFormVisible = false;
                            this.getList();
                            this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000});
                        }else{
                            this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
                        }
                        
                    })
                    
                    var that = this;
                    setTimeout(function(){
                        that.changeSure = false;
                    },1500);
                } else {
                    this.$notify({title: '失败', message: '还有未填项', type: 'error', duration: 2000});
                    return false;
                }
            });
        },  
        // 编辑页面
        update(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.changeSure = true;
                    this.form.gzkssj = this.formTime(this.form.gzkssj);
                    this.form.gzjssj = this.formTime(this.form.gzjssj);
                    this.form.xxkssj = this.formTime(this.form.xxkssj);
                    this.form.xxjssj = this.formTime(this.form.xxjssj);
                    this.form.xxdm = window.localStorage.getItem("xxdm");
                    this.form.xn = this.formxnstart+"-"+this.formxnend;
                    this.dialogFormVisible = false;
                    if(this.form.xq){
                        this.form.xqmc = _.find(this.termList,{"id":this.form.xq}).text
                        
                    }else{
                        this.form.xqmc = ''
                    }
                    putObj(this.form.uuid, this.form).then((res) => {
                        if(res.status=="200"){
                            this.dialogFormVisible = false;
                            this.getList();
                            this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000});
                        }else{
                            this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
                        }
                    });
                    var that = this;
                    setTimeout(function(){
                        that.changeSure = false;
                    },1500);
                } else {
                    this.$notify({title: '失败', message: '还有未填项', type: 'error', duration: 2000});
                    return false;
                }
            });
        },  
        // json
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
        }  
    }
}
</script>
<style>
    .filter-container .filter-item{ vertical-align: inherit;}
    .el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
    .el-checkbox+.el-checkbox{margin-left: 0;}
    .el-checkbox{ margin-right: 30px;}

    .line{ text-align: center;}
</style>