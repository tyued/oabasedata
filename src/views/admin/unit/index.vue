<!--admin-系统配置-单位维护-->
<template>
    <div class="app-container">
        <el-container>
            <el-aside width="250px">
                <TreePart class='screenfull' :treeData='admarea' :treeHeader="treeHeader" :defaultProps="defaultProps"></TreePart>
            </el-aside>
            <el-main>
                <div class="container-block">
                    <el-select v-model="searchsel" slot="prepend" placeholder="全部产品" @change="searchChange" style="width:120px; height:38px; margin:0 auto;">
                        <el-option label="全部" value="all"></el-option>
                        <el-option label="学年" value="xn"></el-option>
                    </el-select> 
                    <el-select v-model="searchsel" slot="prepend" placeholder="全部类型" @change="searchChange" style="width:120px; height:38px; margin:0 auto;">
                        <el-option label="全部" value="all"></el-option>
                        <el-option label="学年" value="xn"></el-option>
                    </el-select> 

                    <el-input placeholder="单位名称搜索" @keyup.enter.native="handleFilter" v-model="searchInp" class="input-with-select"  style="width: 200px;" ></el-input>
                    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter" style="margin-right: 30px;">搜索</el-button>
                    <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">新增</el-button>
                    <el-button class="filter-item"  style="margin-left: 10px;" @click="handleImport" type="primary" icon="edit">导入</el-button>
                    <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">授权</el-button>
                </div>
                <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" height="580px" @selection-change="handleSelectionChange">
                    <el-table-column  type="selection"  width="55"> </el-table-column>
                    <el-table-column align="center" label="单位编号" width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row.xn}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="单位名称" width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row.xn}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="单位类型" width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row.xn}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="数据来源">
                        <template slot-scope="scope">
                            <span>{{scope.row.xn}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="开通状态" width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row.xn}}</span>
                        </template>
                    </el-table-column>
                        <el-table-column align="center" label="操作" width="300">
                        <template slot-scope="scope">
                            <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.row)">个性化配置</el-button>
                        </template> 
                    </el-table-column> 
                </el-table>
                <div v-show="!listLoading" class="pagination-container">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
                </div>
            </el-main>
        </el-container>
        <el-dialog title="导入数据" :visible.sync="importFormVisible" width="540px" :before-close="importCancel" class="import_box">
            <el-row>
                <el-col :span="6" style="line-height:32px">文件选择：</el-col>
                <el-col :span="18">
                    <el-upload          
                        :limit="1"
                        name="excelfile"   
                        ref="cjForm"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        action="/api/netcore/smartcredit/v1/Xmcj/ImportExcel"
                        :headers= headers
                        :file-list="fileList"
                        :onError="uploadError"
                        :onSuccess="uploadSuccess"
                        :before-upload="beforeUpload"
                        :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-col>  
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="importSubmit('cjForm')" :loading="importLoading">确 定</el-button>
                <el-button size="medium" @click="importCancel">取 消</el-button> 
                <el-button size="medium" @click="importMb">模版生成<i class="el-icon-download"></i></el-button> 
                <el-row class="import_desc">
                    <el-col :span="6" style="line-height:80px">操作说明：</el-col>
                    <el-col :span="18">
                        <p>1.请使用本页面提供的模版进行导入</p>
                        <p>2.请勿修改模版Excel的表头内容</p>
                        <p>3.模版提供的默认信息，请勿随意修改</p>
                    </el-col>               
                </el-row>
            </div>
        </el-dialog>
        <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="700px" >
            <el-form :model="form" ref="form" label-width="110px">
                <el-row :gutter="18">
                    <el-col :span="11">
                        <el-form-item label="单位代码" prop="xxdm"  :rules="[{ required: true, message: '单位代码不能为空'}]">
                            <el-input v-model="form.xxdm" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="单位名称" prop="name"  :rules="[{ required: true, message: '单位名称不能为空'}]">
                            <el-input v-model="form.name" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>  
                <el-row :gutter="18">
                    <el-col :span="11">
                        <el-form-item label="单位类型" prop="njdm"  :rules="[{ required: true, message: '单位代码不能为空'}]">
                            <el-select v-model="form.njdm" placeholder="请选择">
                                <!--<el-option v-for="item in gradelist" :key="item.njdm" :label="item.njmc" :value="item.njdm"></el-option>-->
                                <el-option label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="所属区划" required>
                            <el-cascader :options="admarea" v-model="opation_jg" :props="form_props"></el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row :gutter="18">
                    <el-col :span="11">
                        <el-form-item label="数据来源" prop="njdm"  :rules="[{ required: true, message: '数据来源不能为空'}]">
                            <el-select v-model="form.njdm" placeholder="请选择">
                                <!--<el-option v-for="item in gradelist" :key="item.njdm" :label="item.njmc" :value="item.njdm"></el-option>-->
                                <el-option label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">  
                        <el-form-item label="显示顺序">
                            <el-input v-model="form.name" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>                
                <el-row :gutter="18">
                    <el-col :span="11">
                        <el-form-item label="城乡类型">
                            <el-input v-model="form.name" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="学校办别">
                            <el-input v-model="form.name" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>  
                <el-form-item label="学校图片">
                    <!--<el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>-->
                </el-form-item>               
                <el-row :gutter="18">
                    <el-col :span="22">
                        <el-form-item label="备注" size="small">
                        <el-input type="textarea" v-model="form.bz" placeholder="不超过50个字" ></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>               
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
import Cookies from 'js-cookie'
import TreePart from 'components/TreePart';

export default {
    name: 'unit',    
    components: {
        TreePart,
    },
    data() {
        return {
            treeHeader:'选择行政区划',
            defaultProps: {
                children: 'children',
                label: 'text'
            },
            admarea:[],                  //行政区域
            listLoading: true,                      //加载
            listQuery: {
                page: 1,
                limit: 20,
                name: undefined
            },
            searchInp:'',             //查询条件       
            searchsel:'',    
            tableKey: 0,                //表格
            list: null,                 //表格数据
            total: null,
                
            multipleSelection:[],

            // 导入数据
            importLoading: false,
            importFormVisible: false,
            fileList: [],

            dialogStatus: '',
            textMap: {                              //判断弹层是添加还是编辑
                update: '编辑',
                create: '新增'
            },
            dialogFormVisible:false,
            form:{},
            form_props:{
                value:'id',
                label:'text',
                children:'children'
            },
            opation_jg:[],                  //籍贯--传参要求是字符串、所得是数组要转化
            
            changeSure:false,                       //防止重复提交
            
        }
    },
    created() {
        this.getDict()
        this.getList()
        
    },
    methods(){
    },
    computed: {
        headers: function() {
            return {Authorization: Cookies.get("Admin-Token"),ReturnResultCode:true}
        },
    },
    methods: {
        getDict(){
            this.admarea = this.$store.getters.dict_jg;         //籍贯
            var that = this
            if(!this.admarea){
                setTimeout(that.getDict(), 200);
            }
        },
        getList() {
            this.list = [{                    //表格数据
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                },{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                },{
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }]
            this.listLoading = false
        },
        // 搜索
        handleFilter() {
            this.listQuery = {
                // page: 1,
                // limit: 20,
                // xxdm:this.xxdm,
                // name: undefined
            }
            this.getList();
        },
        searchChange(){

        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
        handleCreate(){
            this.resetTemp();
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
        },
        resetTemp() {
            this.form = {}; 
            this.changeSure = false;
        },
        handleUpdate(){
            this.changeSure = false;
            // getObj(row.uuid).then(response => {
                // this.form = response.data;
                this.dialogFormVisible = true;
                this.dialogStatus = 'update';    
            // });
        },
        // 删除
        handleDelete(){
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // delObj(row.uuid).then(() => {
                //     this.$notify({
                //         title: '成功',
                //         message: '删除成功',
                //         type: 'success',
                //         duration: 2000
                //     });
                //     const index = this.list.indexOf(row);
                //     this.list.splice(index, 1);
                // });
            }).catch(e => {
                    // console.log(e)
            });
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
                    // addObj(this.form).then((res) => {
                    //     if(res.status=="200"){
                    //         this.dialogFormVisible = false;
                    //         this.getList();
                    //         this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000});
                    //     }else{
                    //         this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
                    //     }
                        
                    // })
                    
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
                    // putObj(this.form.uuid, this.form).then((res) => {
                    //     if(res.status=="200"){
                    //         this.dialogFormVisible = false;
                    //         this.getList();
                    //         this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000});
                    //     }else{
                    //         this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
                    //     }
                    // });
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

        //导入
        handleImport(){
            this.importFormVisible = true;
        },        
        //取消上传
        importCancel() {
            this.importLoading = false;
            this.importFormVisible = false;
            this.fileList = [];
        },      
        // 上传错误
        uploadError (response, file, fileList) {
            this.importLoading = false;
            this.$notify({
                title: '失败',
                message: '上传失败，请重试！',
                type: 'warning',
                duration: 2000
            });
        },
        // 上传成功后的回调
        uploadSuccess (response, file, fileList) {
            if(response.status=="200"){
                this.importLoading = false;
                this.$notify({
                    title: '成功',
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                });
                this.importCjFormVisible = false;
                this.fileList = [];
                this.getList();
            }else{
                this.importLoading = false;
                this.fileList = [];
                this.$notify({
                    title: '失败',
                    message: response.resultMessage,
                    type: 'warning',
                    duration: 2000
                });
            }
        },
        // 上传前对文件的大小的判断
        beforeUpload (file) {
            this.importLoading = true;
            let extension = file.name.split('.')[1] === 'xlsx'
            let isLt2M = file.size / 1024 / 1024 < 10
            if (!extension) {
                this.$notify({
                    title: '提示',
                    message: '上传模版只支持xlsx格式',
                    type: 'info',
                    duration: 2000
                });
                this.importLoading = false;     
            }else if (!isLt2M) {
                this.$notify({
                    title: '提示',
                    message: '上传模板大小不能超过 10MB',
                    type: 'info',
                    duration: 2000
                });
                this.importLoading = false;
            }
            return extension && isLt2M
        },
        //在线导入
        importSubmit(fileName){ 
            this.$refs[fileName].submit();
        },
        // 下载模版
        importMb() {
            exportExcel({
                xxdm: this.listQuery.xxdm,
                xmid: this.listQuery.xmid,
                rwid: this.rwid,
                bjidlist: this.currentRw.bjid,
            }).then(response => {
                var blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
                var downloadElement = document.createElement('a');
            　　var href = window.URL.createObjectURL(blob); //创建下载的链接
            　　downloadElement.href = href;
            　　downloadElement.download = '模版.xlsx'; //下载后文件名
            　　document.body.appendChild(downloadElement);
            　　downloadElement.click(); //点击下载
            　　document.body.removeChild(downloadElement); //下载完成移除元素
            　　window.URL.revokeObjectURL(href); //释放掉blob对象 
            })
        },
    }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .el-aside{
        position: relative;

    }
    .el-main{ 
        padding: 0 20px;
    }
    //在线导入
        .import_box {
            .import_body {
                overflow: hidden;
            }
            .import_desc {
                overflow: hidden;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #ccc;
                text-align: left;
            }
        }
    
</style>

