<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
                <el-select v-model="searchsel" slot="prepend" placeholder="请选择" @change="searchChange" style="width:120px; height:38px; margin:0 auto;">
                    <el-option label="全部" value="all"></el-option>
                    <!-- <el-option label="课程名称" value="kcmc"></el-option>
                    <el-option label="课程简称" value="kcbm"></el-option> -->
                </el-select>  
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="课程名称">
                <template slot-scope="scope">
                    <span>{{scope.row.kcmc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="课程简称">
                <template slot-scope="scope">
                    <span>{{scope.row.kcbm}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="课程类型">
                <template slot-scope="scope">
                    <span>{{(scope.row.kclx=="0")?"选修课":"必修课"}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="600px" >
            <el-form :model="form" ref="form" label-width="110px">
                <el-form-item label="课程名称"  prop="kcmc" :rules="[{ required: true, message: '课程名称不能为空'}]">
                    <el-input v-model="form.kcmc" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="课程简称"  prop="kcbm" :rules="[{ required: true, message: '课程简称不能为空'}]">
                    <el-input v-model="form.kcbm" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="课程类型">
                    <el-select v-model="formsel_kclx" placeholder="请选择活动区域">
                        <el-option label="必修课" value="1"></el-option>
                        <el-option label="选修课" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="bz">
                    <el-input type="textarea" v-model="form.bz" placeholder="不超过50个字"></el-input>
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
} from 'api/admin/course/index'
import {dqxnxqObj} from 'api/admin/acadyear/index'
export default {
    name: 'course',
    data(){
        return{
            xxdm:'',
            dqxn:'',            //当前学年
            dqxq:'',            //当前学期

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
            formsel_kclx: "1",                        //是否选修课
            

            dialogFormVisible: false,               //弹层是否显示
            dialogStatus: '',   
            textMap: {                              //判断弹层是添加还是编辑
                update: '编辑',
                create: '创建'
            },          
            tabPosition:'left',
            form:{},                                //表单

            changeSure:false,                       //防止重复提交
        }
    },
    created(){
        this.xxdm = window.localStorage.getItem("xxdm");
        this.listQuery.xxdm = this.xxdm;
        
        dqxnxqObj({"xxdm":this.xxdm}).then(response => {
            this.dqxn = response.xn;
            this.dqxq = response.xq;
            this.getList();
        })
    },
    watch:{
        
    },
    methods:{
        getList() {
            this.listLoading = true;
            this.listQuery.xxdm = this.xxdm;
            this.listQuery.ssxn = this.dqxn;
            this.listQuery.ssxq = this.dqxq;
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
            this.form = {};
            this.formsel_kclx = "1";
            this.changeSure = false;
        },
        //编辑    
        handleUpdate(row) {
            this.changeSure = false;
            getObj(row.uuid).then(response => {
                this.form = response.data;
                this.formsel_kclx = this.form.kclx;
                this.dialogFormVisible = true;
                this.dialogStatus = 'update';             
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
        // 取消按钮
        cancel(formName) {
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
        },
        // 添加页面
        create(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {  
                    this.changeSure = true;
                    this.form.xxdm = window.localStorage.getItem("xxdm");
                    this.form.kch = '';                 //课程号
                    this.form.kclx =  this.formsel_kclx;
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
                    this.dialogFormVisible = false;      
                    this.form.kclx =  this.formsel_kclx;
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