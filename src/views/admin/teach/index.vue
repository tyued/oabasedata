<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
                <el-select v-model="searchsel" @change="searchChange" slot="prepend" placeholder="请选择" style="width:120px; height:38px; margin:0 auto;">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="职工号" value="gh"></el-option>
                    <el-option label="姓名" value="xm"></el-option>
                </el-select>
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="职工号" width="170">
                <template slot-scope="scope">
                    <span>{{scope.row.gh}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="姓名" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.xm}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="性别" width="100">
                <template slot-scope="scope">
                    <span>{{(scope.row.xbm=='2')?'女':'男'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="证件号码" width="170">
                <template slot-scope="scope">
                    <span>{{scope.row.sfzjh}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="出生日期" width="120">
                <template slot-scope="scope">
                    <span>{{judgeData(scope.row.csrq)}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="所在部门">
                <template slot-scope="scope">
                    <span>{{judgeszbm(scope.row.szbm,scope.row.szbm)}}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="民族" width="120">
                <template slot-scope="scope">
                    <span>{{judgemz(scope.row.mzm)}}</span>
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

        <el-dialog  :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="700px" >
            <el-form :model="form" ref="form" :rules="rules" label-width="100px" style="padding-right:20%;">
                <el-tabs :tab-position="tabPosition" style="min-height: 500px;">
                    <el-tab-pane label="基本信息">
                        <el-form-item label="职工号" size="small" prop="gh" :rules="[{ required: true, message: '职工号不能为空'}]">
                            <el-input v-model="form.gh" placeholder="请输入职工号" :disabled="(dialogStatus=='create')?false:true"></el-input>
                        </el-form-item>
                        <el-form-item label="职工姓名" size="small" prop="xm" :rules="[{ required: true, message: '职工姓名不能为空'}]">
                            <el-input v-model="form.xm"  placeholder="请输入职工姓名" ></el-input>
                        </el-form-item>
                        <el-form-item label="曾用名" size="small">
                            <el-input v-model="form.cym"  placeholder="" ></el-input>
                        </el-form-item>
                        <el-form-item label="性别" size="small">
                            <el-radio-group v-model="form.xbm">
                                <el-radio label="1">男</el-radio>
                                <el-radio label="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="出生日期" size="small">
                            <el-date-picker type="date" v-model="form.csrq" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="form_pickerOp" @change="handleChange_csrq"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="年龄" size="small" style="width:200px">
                            <el-input v-model="form_nl"  placeholder="自动计算"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="籍贯" size="small">
                            <el-cascader :options="dictionary.jg" v-model="opation_jg" :props="form_props"  @change="handleChange"></el-cascader>
                        </el-form-item>
                        <el-form-item label="户口类别" size="small">
                            <el-radio-group v-model="form.hkxzm">
                            <el-radio label="2">非农户口</el-radio>
                            <el-radio label="1">农业户口</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="民族" size="small">
                            <el-select v-model="form.mzm" placeholder="请选择">
                                <el-option v-for="item in dictionary.mz" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="详细信息">
                        <el-form-item label="证件名称" size="small">
                            <el-select v-model="form.sfzjlxm" placeholder="请选择">
                                <el-option v-for="item in dictionary.zjmc" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="证件号码" size="small" prop="sfzjh">
                            <el-input v-model="form.sfzjh"  placeholder="" ></el-input>
                        </el-form-item>
                        <el-form-item label="户口所在地" size="small">
                            <el-input v-model="form.hkszd"  placeholder="" ></el-input>
                        </el-form-item>
                        <el-form-item label="现住址" size="small">
                            <el-input v-model="form.xzz"  placeholder="" ></el-input>
                        </el-form-item>
                        <el-form-item label="政治面貌" size="small">
                            <el-select v-model="form.zzmmm" placeholder="请选择">
                                <el-option v-for="item in dictionary.zzmm" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="婚姻状况" size="small">
                            <el-cascader :options="dictionary.hyzk" v-model="opation_hyzk" :props="form_props"  @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="工作信息">
                        <el-form-item label="所属校区" size="small" prop="xqh" :rules="[{ required: true, message: '所属校区不能为空',trigger: 'change'}]">
                            <el-select v-model="form.xqh" placeholder="请选择" @change="handleChange_xq">
                                <el-option v-for="item in dictionary.campusdata" :key="item.uuid" :label="item.xqmc" :value="item.uuid"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所在部门" size="small" required>
                            <el-select v-model="form_bm" multiple placeholder="请选择">
                                <el-option v-for="item in dictionary.bm" :key="item.id" :label="item.name" :value="item.id" :props="form_props_bm"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="档案号" size="small">
                            <el-input v-model="form.dabh"  placeholder="" ></el-input>
                        </el-form-item>
                        <el-form-item label="参加工作年月" size="small">
                            <el-date-picker type="month" v-model="form.gzny" value-format="yyyy-MM" :picker-options="form_pickerOp" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="进入本校年月" size="small">
                            <el-date-picker type="month" v-model="form.lxny" value-format="yyyy-MM" :picker-options="form_pickerOp" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="从事教育年月" size="small">
                            <el-date-picker type="month" v-model="form.cjny" value-format="yyyy-MM" :picker-options="form_pickerOp" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="行政职务" size="small">
                            <el-cascader :options="dictionary.gwzw" v-model="opation_gwzym" :props="form_props" @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="用户信息">
                        <el-form-item label="密码" size="small" required>
                            <el-input v-model="form_mm"  placeholder="" ></el-input>
                        </el-form-item>
                        <el-form-item label="角色" size="small" required>
                            <el-select v-model="form_role" multiple placeholder="请选择">
                                <el-option v-for="item in dictionary.js" :key="item.id" :label="item.name" :value="item.id" :props="form_props_bm"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
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
    teacherAll,
    teacherpage,
    getObj,
    addObj,
    delObj,
    putObj
} from 'api/admin/teach/index'
import { getxxdmCampus } from 'api/admin/campus/index'
import { mapGetters } from 'vuex';
import { fetchTree, fetchlistgroup} from 'api/admin/group/index';

import _ from 'lodash'
export default {
    name: 'teach',
    data(){
        var validateNum = (rule, value, callback) => {
            if(value){
                if (!/^[0-9]+.?[0-9]*$/.test(value)) {
                    return callback(new Error('必须为数字'));
                } else {
                    callback();
                }
            }else{
                callback();
            }
        };
        return{
            xxdm:'',                                //学校代码
            listLoading: true,                      //加载
            listQuery: {
                page: 1,
                limit: 20,
                xxdm: '',
                name: undefined
            },
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

            form:{},                                  //表单

            form_nl:'',                             //年龄
            dictionary:{                            //通用字典表
                jg:[],mz:[],zjmc:[],zzmm:[],hyzk:[],campusdata:[],gwzw:[],js:[],
                bm:[]                               //部门----为了级联
            },
            form_props:{
                value:'id',
                label:'text',
                children:'children'
            },
            bm_listQuery: {                         //所属校区下的所在部门
                page: 1,
                limit: 50,
                groupType: 2,
                xxdm:'',
                xqh:'',
                name: undefined
            },
            allbm_listQuery: {                         //所属校区下的所在部门
                page: 1,
                limit: 50,
                groupType: 2,
                name: undefined
            },
            allCampusbm:[],                          //所有部门
            js_listQuery: {
                page: 1,
                groupType: 1,
                limit: 50,
                xxdm: '',
                name: undefined
            },
            form_props_bm:{                         //所属校区下的所在部门
                value:'id',
                label:'label',
                children:'children'
            },
            form_pickerOp:{                         //出生日期
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            form_role:[],   //角色
            form_bm:[],     //部门
            form_mm:'',
            rules:{
                gh:[{ validator:validateNum,trigger: 'blur' }],
                sfzjh:[{ validator:validateNum,trigger: 'blur' }],
                mm:[{ validator:validateNum,trigger: 'blur'}],
            },
            opation_jg:[],                  //籍贯--传参要求是字符串、所得是数组要转化
            opation_hyzk:[],
            opation_gwzym:[],

            changeSure:false,                       //防止重复提交
        }
    },
    computed: {
	    ...mapGetters([
	      'dict'
        ])
    },
    created(){
        this.xxdm = window.localStorage.getItem("xxdm");
        this.listQuery.xxdm = this.xxdm;
        this.bm_listQuery.xxdm = this.xxdm;
        this.getDictJson();
        this.getList();
        this.getAllbm();
    },
    watch:{
        searchsel(){                                   //每当查询条件改变时，先将搜索传参清除
            this.listQuery = { page: 1, limit: 20, name: undefined };
            this.listQuery.xxdm = this.xxdm;
        },
        dict(){
            this.getDictJson();
        }
    },
    methods:{
        getList() {
            this.listLoading = true;
            this.listQuery.xxdm = this.xxdm;
            teacherpage(this.listQuery).then(response => {
                this.list = response.data.rows;
                this.total = response.data.total;
                this.listLoading = false;
            })
            // 所选校区
            getxxdmCampus(this.xxdm).then(response => {
                this.dictionary.campusdata = response;
            })
            // 角色类型
            this.js_listQuery.xxdm = this.xxdm
            fetchlistgroup(this.js_listQuery).then(data => {
                this.dictionary.js = data.data.rows;
                _.remove(this.dictionary.js ,{'name':'校管理员'})
            });
        },
        getDictJson(){
            this.dictionary.jg = this.$store.getters.dict_jg;           //籍贯
            this.dictionary.mz = this.$store.getters.dict_mz;           //民族
            this.dictionary.zjmc = this.$store.getters.dict_zjmc;       //证件名称
            this.dictionary.zzmm = this.$store.getters.dict_zzmm;       //政治面貌
            this.dictionary.hyzk = this.$store.getters.dict_hyzk;       //婚姻状况
            this.dictionary.gwzw = this.$store.getters.dict_gwzw;       //岗位职务
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
    // 分页
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.listQuery.xxdm = this.xxdm;
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
                xbm: "1",hkxzm:'2'
            };
            this.form_mm = "888888";
            this.form_role = [];
            this.form_bm = [];
            this.changeSure = false;
        },
    // 编辑
        handleUpdate(row) {
            this.changeSure = false;
            getObj(row.uuid).then(response => {
                this.form = response.data;
                this.opation_jg=this.form.jg ? this.form.jg.split(',') : [];
                this.opation_gwzym=this.form.gwzym ? this.form.gwzym.split(',') : [];
                this.opation_hyzk=this.form.hyzkm ? this.form.hyzkm.split(',') : [];
                this.form_mm = "******";

                if(!this.form.xbm){
                    this.form.xbm = "1";
                }
                if(!this.form.hkxzm){
                    this.form.hkxzm = "2";
                }
                this.age(this.form.csrq);           //年龄
                this.form.szbm=[];        //部门----
                this.form_role = this.form.ssjs;
                this.dialogFormVisible = true;
                this.dialogStatus = 'update';
            });
        },
        judgeData(value){                            //表格-----出生日期
            var DATE_FORMAT = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/;
            if(!DATE_FORMAT.test(value)){
                value = undefined;
            }
            return value
        },
        judgemz(value){                                                 //表格-----民族
            if(value){
                var matchmz = _.find(this.dictionary.mz,{'id':value});
                if(matchmz) return matchmz.text;
            }else{
                return ''
            }
        },
        judgeszbm(value){                                                 //表格-----所在部门
            if(value){
                var matchmz = _.find(this.allCampusbm,{'id':value});
                if(matchmz) return matchmz.label;
            }else{
                return ''
            }
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
            });
        },
    // 通过校区选择部门
        handleChange_xq(val){
            this.bm_listQuery.xqh = val;
            // 所选校区下的部门
            fetchlistgroup(this.bm_listQuery).then(data => {
                this.dictionary.bm = data.data.rows;
            });
        },
        getAllbm(){
            fetchlistgroup(this.allbm_listQuery).then(res => {
                this.allCampusbm = res.data.rows;
            });
        },
    // 出生年月变化改变年龄
        handleChange_csrq(val){
            this.age(val)
        },
    // 计算年龄
        age(val){
            if(val){
                var year = new Date(val).getFullYear();
                var data = new Date();
                var newyear = data.getFullYear()
                this.form_nl = newyear - year
            }else{
                this.form_nl = 0;
            }
        },

    // 弹层
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
                    this.form.xxdm = this.xxdm;
                    this.form.ssbm = this.form_bm;
                    this.form.ssjs = this.form_role;
                    this.form.mm = this.form_mm;
                    if (this.opation_jg.length > 0) this.form.jg = this.opation_jg.join();                  //籍贯要为对象
                    if (this.opation_hyzk.length > 0) this.form.hyzkm = this.opation_hyzk.join();
                    if (this.opation_gwzym.length > 0) this.form.gwzym = this.opation_gwzym.join();
                    if(this.form.ssjs.length>0){
                        addObj(this.form).then((res) => {
                            if(res.status=="200"){
                                this.dialogFormVisible = false;
                                this.getList();
                                this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000});
                            }else{
                                this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
                            }
                        })
                    }else{
                        this.$notify({title: '失败', message: '还有未填项', type: 'error', duration: 2000});
                    }

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
                    this.form.xxdm = this.xxdm;
                    this.form.ssbm = this.form_bm;
                    this.form.ssjs = this.form_role;
                    this.form.mm = this.form_mm;
                    if (this.opation_jg.length > 0) this.form.jg = this.opation_jg.join();                  //籍贯要为对象
                    if (this.opation_hyzk.length > 0) this.form.hyzkm = this.opation_hyzk.join();
                    if (this.opation_gwzym.length > 0) this.form.gwzym = this.opation_gwzym.join();
                    // console.log(this.form)
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
        handleChange(value){

        },




    }
}
</script>
<style>
    .filter-container .filter-item{ vertical-align: inherit;}
    .el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
    .el-checkbox+.el-checkbox{margin-left: 0;}
    .el-checkbox{ margin-right: 30px;}
</style>

