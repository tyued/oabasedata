<template>
<div class="app-container calendar-list-container body"> 

    <!-- 项目详情描述   -->
    <div class="detail">
        <!-- 项目名称 -->
        <div class="detail-box">
            <el-row class="detail-title">
                <el-col :span="12">项目名称：</el-col>
                <el-col :span="12">{{itemDetail.mc}}</el-col>
            </el-row>
            <el-collapse-transition>
                <el-row class="detail-content" v-if="!showPull">
                    <el-col :span="12" class="content-title">学年学期：</el-col>
                    <el-col :span="12">{{xnxq.xn+'年'+xnxq.xqmc}}</el-col>
                </el-row>
            </el-collapse-transition>
            <el-collapse-transition>
                <el-row class="detail-content" v-if="!showPull">
                    <el-col :span="12" class="content-title">适用学科：</el-col>
                    <el-col :span="12">{{xxlm=='007'?(itemDetail.zymc+(itemDetail.kcmc?'/'+itemDetail.kcmc:'')):itemDetail.kcmc}}</el-col>
                </el-row>
            </el-collapse-transition>	
            <el-collapse-transition>
                <el-row class="detail-content" v-if="!showPull">
                    <el-col :span="12" class="content-title">适用年级：</el-col>
                    <el-col :span="12">{{itemDetail.njmc}}</el-col>
                </el-row>
            </el-collapse-transition>
            <el-collapse-transition>
                <el-row class="detail-content" v-if="showPull">
                    <el-col :span="24" class="content-title">
                        目前该项目共有{{itemDetail.allRwCount}}个任务
                    </el-col>
                </el-row>
            </el-collapse-transition>	
        </div>
        <!-- 计分形式 -->
        <div class="detail-box">
            <div class="detail-title">记分形式</div>
            <el-row class="detail-content">
                <el-col :span="12" class="content-title">
                    记分形式：
                </el-col>
                <el-col :span="12">
                    {{jflx[itemDetail.jflx]}}
                </el-col>
            </el-row>
        </div>
        <!-- 权重规则 -->
        <div class="detail-box" v-if="itemDetail.jflx!=3&&itemDetail.jflx!=4&&itemDetail.jflx!=5">
            <div class="detail-title">权重规则</div>
            <el-collapse-transition>
                <el-row class="detail-content" v-if="showPull">
                    <el-col :span="24" class="content-title">
                        <span>详细规则</span>
                    </el-col>
                </el-row>
            </el-collapse-transition>	
            <el-collapse-transition>
                <el-row class="detail-content"  v-if="!showPull">
                    <div class="content-title">{{itemDetail.qzgz}}</div>
                </el-row>
            </el-collapse-transition>
        </div>
    </div>
    <div class="detail-pull">
        <el-button :icon="showPull? 'el-icon-arrow-down':'el-icon-arrow-up'" class="detail-pullbtn"  @click="showPull=!showPull"></el-button>
    </div>

    <!-- 任务 -->
    <el-row :gutter="20"  class="box-table">
        <!-- 任务列表 -->
        <el-col :span="6" class="rw-table">
            <div class="rw-header">
                <span>项目任务</span>
                <el-button type="primary" class="right" @click="handleCreate" v-if="itemDetail.xmlx == 0">新建任务</el-button>
            </div>
            <div class="rw-body">
                <el-table :data="rwList" @row-click="selectBj" :row-class-name="tableRowClassName" v-loading.body="listLoading">
                    <el-table-column width="3"></el-table-column> 
                    <el-table-column width="20"></el-table-column>    
                    <el-table-column label="名称">
                        <template slot-scope="scope">
                            <span v-if="itemDetail.xmlx == 0 || itemDetail.xmlx == 1">{{scope.row.mc}}</span>
                            <span v-if="itemDetail.xmlx == 2">{{scope.row.kssj.substring(0,scope.row.kssj.length-5)+' '+scope.row.mc}}</span>  
                            <span v-if="itemDetail.xmlx == 3">{{scope.row.kssj+' '+scope.row.mc}}</span> 
                        </template>
                    </el-table-column>
                    <el-table-column v-if="itemDetail.xmlx==0" align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button @click.stop="handleUpdate(scope.row)" type="text" class="update-btn" :disabled="scope.row.zt == 1 && scope.row.yxbc == 0">修改</el-button>
                            <el-button @click.stop="handleDelete(scope.row)" type="text" class="delete-btn" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-show="!listLoading" class="pagination-container" v-if="rwList && rwList.length>0">
                    <el-pagination  @current-change="handleCurrentChange" :current-page.sync="listQuery.pageIndex" :page-size="listQuery.pageSize" layout="prev, pager, next" :total="total"> </el-pagination>
                </div>
            </div>
        </el-col>
        <!-- 成绩/结果 列表 -->
        <el-col :span="18" class="cj-table">
            <div class="cj-header" v-if="((bjcj.length>0 && itemDetail.xmlx==0)||(resultData.length>0 && itemDetail.xmlx!=0))">
                <div v-if="itemDetail.jflx != 6">
                    <el-dropdown class="right mright" @command="handleCommand" v-if="itemDetail.jflx != 4">
                        <el-button type="primary">数据导入</el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="xm">按项目导入</el-dropdown-item>
                            <el-dropdown-item command="rw">按任务导入</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" class="right mright" @click="reportCj">成绩上报</el-button>
                </div>
            </div>

            <div v-if="(bjcj.length==0 && itemDetail.xmlx==0)||(resultData.length==0 && itemDetail.xmlx!=0)" class="empty-table">暂无数据</div>

            <div class="cj-body">
                <el-tabs type="border-card" @tab-click="tabClick" v-model="cjIndex" v-if="(bjcj.length>0 && itemDetail.xmlx==0)||(resultData.length>0 && itemDetail.xmlx!=0)">
                    <!-- 成绩录入 -->
                    <el-tab-pane :label="item.bjmc" v-for="(item,index) in bjcj" :key="index">
                        <div class="table-header">
                            <div style="float:left; margin-right:20px;">
                                <el-input placeholder="请输入姓名进行搜索" @keyup.enter.native="handleFilter" v-model="listQuery.username" class="input-with-select"  style="width: 400px;" ></el-input>
                                <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
                            </div>
                            <span>{{item.noEntryCount}}人未录入，共{{item.totalCount}}人</span>
                            <div v-if="itemDetail.jflx == 3">录入说明：1=A等级；2=B等级；3=C等级；4=D等级；</div>
                        </div>
                        <div class="table-body">
                            <el-table class="levelTable" :data="item.data" border style="width: 100%" v-if="itemDetail.jflx != 4">
                                <el-table-column type="index" label="序号" width="80"></el-table-column>
                                <el-table-column prop="xm" label="姓名"></el-table-column>
                                <el-table-column label="分值" v-if="itemDetail.jflx==0||itemDetail.jflx==1">
                                    <template slot-scope="scope">
                                        <div class="inpBSign">
                                            <el-input v-model="scope.row.sz" placeholder="请输入内容" clearable @blur="inpBlur($event,scope.row)"></el-input>
                                            <i class="singico" :class="scope.row.lrsure==0?'':(scope.row.lrsure==1?'el-icon-check':'el-icon-close')"></i>
                                            <span v-if="itemDetail.jflx==1&&scope.row.lrsure==2" class="red">累积量只能为0或1</span>
                                        </div>
                                    </template>
                                </el-table-column>         
                                <el-table-column label="加减值" v-if="itemDetail.jflx==7">
                                    <template slot-scope="scope">
                                        <el-input-number @change="changeXf(scope.row)" v-inputDisabled v-model="scope.row.sz" :precision="1" :step="currentRw.zl" :max="currentRw.xf"></el-input-number>
                                    </template>
                                </el-table-column>         
                                <el-table-column label="等级" v-if="itemDetail.jflx==3">
                                    <template slot-scope="scope">
                                        <el-input :ref="scope.row.ref" maxlength="1" v-model="scope.row.djz" placeholder="请输入内容" 
                                            @keyup.native="down2next($event,scope.row)">
                                        </el-input>
                                    </template>
                                </el-table-column>     
                                <el-table-column label="数值" v-if="itemDetail.jflx==5">
                                    <template slot-scope="scope">
                                        <div class="inpBSign">
                                            <el-input v-model="scope.row.sz" placeholder="请输入内容" clearable @blur="inpBlur($event,scope.row)" @clear="inpClearsz($event,scope.row)"></el-input>
                                            <i class="singico" :class="scope.row.lrsure==0?'':(scope.row.lrsure==1?'el-icon-check':'el-icon-close')"></i>
                                        </div>
                                    </template>
                                </el-table-column> 
                                <el-table-column label="学分" v-if="itemDetail.jflx==5">
                                    <template slot-scope="scope">
                                        <div class="inpBSign">
                                            <el-input v-model="scope.row.xf" placeholder="请输入内容" clearable @blur="inpBlurxf($event,scope.row)" @clear="inpClearxf($event,scope.row)"></el-input>
                                            <i class="singico" :class="scope.row.lrsure_xf==0?'':(scope.row.lrsure_xf==1?'el-icon-check':'el-icon-close')"></i>
                                        </div>
                                    </template>
                                </el-table-column>       
                            </el-table>
                            <el-tabs v-if="itemDetail.jflx == 4"  v-model="activeStuName">
                                <el-tab-pane :label="student.xm" v-for="(student, index2) in item.data" :key="index2" :name="student.index">
                                    <el-row class="twIndRowheader" :gutter="20">
                                        <!-- <el-col :span="2">序号</el-col> -->
                                        <el-col :span="3">分值</el-col>
                                        <el-col :span="9">评语</el-col>
                                        <el-col :span="12">图片</el-col>
                                        <!-- <el-col :span="2">操作</el-col> -->
                                    </el-row>
                                    <el-row class="twIndRow" :gutter="20" v-for="(twinfo, indtw) in student.twInfo" :key="indtw" v-if="indtw == 0">
                                        <!-- <el-col :span="2">
                                            <span class="twIndspan">{{indtw+1}}</span>
                                        </el-col> -->
                                        <el-col :span="3">
                                            <el-input v-model="twinfo.fz" placeholder="0"></el-input>
                                        </el-col>
                                        <el-col :span="9">
                                            <el-input v-model="twinfo.twnr" placeholder="请输入评语"></el-input>
                                        </el-col>
                                        <el-col :span="10">
                                            <div :class="{'on':(twinfo.twlrCurNum==3)}">
                                                <el-upload
                                                    list-type="picture-card"
                                                    action="/api/netcore/smartcredit/v1/Xmcj/UploadPictures"
                                                    :headers= "headers"
                                                    :limit="3"
                                                    :on-preview="handlePictureCardPreview"
                                                    :on-remove="(file,fileList)=>{return handlePictureRemove(file,fileList,twinfo)}"
                                                    :on-exceed="handleExceed"
                                                    :on-success="(res,file,fileList)=>{return uploadSuccessPic(res,file,fileList,twinfo)}"
                                                    :before-upload="BatchbeforeUploadPicture"
                                                    :file-list="twinfo.tpdzList">
                                                    <i class="el-icon-plus"></i>
                                                </el-upload>
                                                <el-dialog :visible.sync="dialogPictureVisible">
                                                    <img width="100%" :src="dialogImageUrl" alt="">
                                                </el-dialog>                                            
                                            </div>
                                        </el-col>
                                        <!-- <el-col :span="2">
                                            <el-button type="text" v-if="indtw!=(student.twInfo.length-1)" @click="twDel(student,index,index2,indtw)">删除</el-button>
                                            <el-button type="text" v-if="indtw==(student.twInfo.length-1)" @click="twAdd(student)">添加</el-button>
                                        </el-col> -->
                                    </el-row>
                                    <el-row class="twIndRow">
                                        <el-button type="primary" @click="twSure(student)" >保 存</el-button>
                                    </el-row>
                                </el-tab-pane>
                            </el-tabs>                            
                            <div v-if="itemDetail.jflx == 6">
                                <div class="empty-table">教师端无权限</div>
                            </div>
                        </div>
                    </el-tab-pane>

                </el-tabs>
            </div>

        </el-col>
    </el-row>

    <!-- 班级选择弹层 -->
    <el-dialog width="440px" :visible.sync="bjDialogVisible" append-to-body :before-close="bjCancel">
        <el-row>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="bjidSelect" class="select-item" style="float:left; margin:0 5px;" @change="handleCheckedChange">
                <el-checkbox v-for="(item,index) in bjList" :label="item.uuid" :key="index" border size="medium">{{item.bj}}</el-checkbox>
            </el-checkbox-group>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="bjSubmit">确 定</el-button>
            <el-button @click="bjReset">重 置</el-button> 
        </div>
    </el-dialog>

    <!-- 新建任务弹层 -->
    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="createFormVisible" width="600px" :before-close="createCancel">
        <!-- 新建任务表单 -->
        <el-form :model="form" ref="createform" label-width="120px" :rules="rules"> 
            <el-form-item label="所属项目">{{itemDetail.mc}}</el-form-item>  
            <el-form-item label="任务名称"  prop="mc">
                <el-input v-model="form.mc"></el-input>
            </el-form-item>
            <el-form-item label="任务最高值" prop="xf" v-if="itemDetail.jflx==0 || itemDetail.jflx==7">
                <el-input v-model="form.xf" :disabled="isChange"></el-input>
            </el-form-item>
            <el-form-item label="加减幅度" v-if="itemDetail.jflx == 7" prop="zl">
                <el-select v-model="zfzl" placeholder="请选择" size="small" @change="zlrsdf(zfzl)"  :disabled="isChange">
                    <el-option v-for="item in zlRange" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>   
            <el-form-item label="执行班级" required>
                <el-tag v-for="(bjItem, index) in bjid" :key="index" :closable="!isChange" @close="delBj(index)" class="mright">
                    {{bjItem.bj}}
                </el-tag>
                <el-button type="text" icon="el-icon-circle-plus-outline" @click="clickBjsel"  :disabled="isChange"></el-button>
            </el-form-item>
            <el-form-item label="录入人员" required>
                <el-checkbox-group v-model="lrrylxList">
                    <el-checkbox label='1' disabled="">教师</el-checkbox>
                    <el-checkbox label='2' v-if="false">学生</el-checkbox>
                    <el-checkbox label='4' v-if="false">家长</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="共有任务" required>
                <el-radio v-model="sfggrw" label='1' :disabled="isChange">是</el-radio>
                <el-radio v-model="sfggrw" label='0' :disabled="isChange">否（不计入项目总分，他人不可见）</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="createSubmit('createform')" :disabled="btnLimt">保 存</el-button>
            <el-button @click="createCancel">取 消</el-button> 
        </div>
    </el-dialog>

    <!-- 任务在线导入 -->
    <el-dialog title="成绩导入" :visible.sync="importCjFormVisible" width="540px" :before-close="importCancel" class="import_box">
        <el-row>
            <el-col :span="6" style="line-height:32px">文件选择：</el-col>
            <el-col :span="18">
                <el-upload          
                    :limit="1"
                    name="excelfile"   
                    ref="cjForm"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    action="/api/netcore/smartcredit/v1/Xmcj/ImportExcel"
                    :headers= "headers"
                    :file-list="fileList"
                    :onError="uploadError"
                    :onSuccess="(res,file,fileList)=>{return uploadSuccess(res,file,fileList,'rw')}"
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
                <el-col :span="6" style="line-height:80px">
                    操作说明：
                </el-col>
                <el-col :span="18">
                    <p>1.请使用本页面提供的模版进行导入</p>
                    <p>2.请勿修改模版Excel的表头内容</p>
                    <p>3.模版提供的默认信息，请勿随意修改</p>
                </el-col>               
            </el-row>
        </div>
        
    </el-dialog>
    

    <!-- 项目在线导入 -->
    <el-dialog width="440px" title="项目导入" :visible.sync="DialogVisibleTips">
        <p>该操作仅限项目导入，导入前需创建好所有任务，确定全部创建完成？</p>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="TipsSure">确 定</el-button>
            <el-button @click="DialogVisibleTips = false">取 消</el-button> 
        </div>
    </el-dialog>
    <el-dialog title="项目导入" :visible.sync="BatchimportCjFormVisible" width="540px" :before-close="BatchimportCancel" class="import_box">        
        <el-row style="margin-bottom:10px;">
            <el-col :span="6" style="line-height:32px">执行班级:</el-col>
            <el-col :span="18">
                <el-select v-model="BatchSelClass" size="small"  placeholder="请选择">
                    <el-option v-for="item in bjList" :key="item.uuid" :label="item.bj" :value="item.uuid"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6" style="line-height:32px">文件选择：</el-col>
            <el-col :span="18">
                <el-upload
                    :limit="1"
                    name="excelfile"   
                    ref="BatchcjForm"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    action="/api/netcore/smartcredit/v1/Xmcj/BatchImportExcel"
                    :headers= "headers"
                    :file-list="fileList"
                    :onError="uploadError"
                    :onSuccess="(res,file,fileList)=>{return uploadSuccess(res,file,fileList,'xm')}"
                    :before-upload="beforeUpload"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
            </el-col>  
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" type="primary" @click="importSubmit('BatchcjForm')" :loading="importLoading">确 定</el-button>
            <el-button size="medium" @click="BatchimportCancel">取 消</el-button> 
            <el-button size="medium" @click="BatchimportMb">模版生成<i class="el-icon-download"></i></el-button> 
            <el-row class="import_desc">
                <el-col :span="6" style="line-height:80px">
                    操作说明：
                </el-col>
                <el-col :span="18">
                    <p>1.请使用本页面提供的模版进行导入</p>
                    <p>2.请勿修改模版Excel的表头内容</p>
                    <p>3.模版提供的默认信息，请勿随意修改</p>
                </el-col>               
            </el-row>
        </div>
        
    </el-dialog>

</div>
</template>


<script>
import Cookies from 'js-cookie'
import { Loading } from 'element-ui';
import { getToken } from "utils/auth";
import { mapGetters } from "vuex";
import {
    page,
    createRw,
    updateRw,
    delRw,
    getRw,
    supplementRw,
    inputCredit,
    getCreditList,
    checkResult,
    scoreReported,
    dealAllowSupplement,
    exportExcel,
    BatchexportExcel,
    getBj,
    GetXmStatistics,
    CheckXtResult, BatchInputValue ,UploadPictures,DeleteCreditValue,CurrencyReport
    // importExcel,
} from 'api/project/projectDetail/index'
import { 
    getItem,
    dqxnxqObj,
} from 'api/project/mainProject/index'


export default {
    name: "projectDetail",
    data() {
        return {
            xxlm: window.localStorage.getItem('xxlm'),                //学校类型   007--职高  
            listLoading: true,
            listQuery: {
                pageIndex: 1,
                pageSize: 10,
                xmid: window.localStorage.getItem('xmid'),
                xxdm: window.localStorage.getItem('xxdm'),
            },
            itemDetail: {},                     //所属项目的信息
            showPull: true,
            xnxq: {},
            jflxsel:['原始数据换算成积分','原始数据换算成等级','保留原始数据，不做换算'],
            jflx: ['成绩分值','累积任务数','学分','等级','图文评语','体育数据','阅读','加减分'], 
            rwList: [],                         //任务List
            total: null,                        //任务的总数
            rwid: null,                         //当前所选任务id
            dataIndex: 0,                       //当前所选任务的index
            form: {},

            // 任务弹层
            textMap: {
                create: '新建任务',
                update: '修改任务',
            },
            dialogStatus: '',
            createFormVisible: false,            
            lrrylxList:['1'],               //录入人员              1-教师    2-学生    3-学生+教师  4-家长
            sfggrw:'1',                     //是否公共任务
            zfzl:'',                        //增量
            isChange:false,                 //任务是否可以修改
            
            bjDialogVisible: false,                    //选择班级的弹层
            isIndeterminate: false,                      //全选           
            checkAll:false,                             //全选  
            bjList: [],                                //所有的班级List
            bjidSelect: [],                            //当前选中班级代码
            bjidArr: [],    //所有班级代码value组成的数组
            bjid: [],       //实时展示的班级代码（uuid + bj）
            bjidBeifen: [], //班级代码备份
            btnLimt: false, //防止重复提交BUG
            
            
            //表单较检规则
            rules: {
                mc: [
                    { required: true, message: '请输入任务名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                xf: [
                    { required: true, message: '请输入任务学分', trigger: 'blur' },
                ],
                zl: [
                    { required: true, message: '请选择增幅', trigger: 'change' },
                ],
                sz: [
                    { required: true, message: '请输入成绩', trigger: 'blur' },
                ],
            },

            /*成绩录入页*/
            bjcj: [],
            cjIndex: '0', //当前展示的成绩的班级序号
            kszt: '0',
            addCjVisible: false,
            cjform: {},
            currentStu: {}, //当前录入成绩的学生
            continueAdd: false, //继续录入学生
            ischangeXf:false,   //录入无增量学分是否有变动

            // 项目在线导入
            DialogVisibleTips:false,
            BatchimportCjFormVisible: false,
            BatchSelClass:'',           //所选的班级

            // 图文录入
            dialogPictureVisible: false,
            dialogImageUrl:'',
            twlrCurList:[],         //当前编辑的图片list
            activeStuName:'0',
            
            //成绩在线导入
            importCjFormVisible: false,
            fileList: [],
            importLoading: false,

            /*结果页*/
            resultData: [],           

        } 
    },  
    created() {
        this.dqXnXqObj();
    },
    directives: {
        inputDisabled: {                                                //加减分数值
            inserted: function (el) {
                el.children[2].children[0].setAttribute("readonly",true)
            }
        }
    },
    computed: {
        ...mapGetters(["elements"]),
        headers: function() {
            return {Authorization: Cookies.get("Admin-Token"),ReturnResultCode:true}
        },
        //当前选中任务
        currentRw: function() {
            return this.rwList[this.dataIndex];
        },
        //加减幅度
        zlRange: function() {
            let zlArr = ['0.1','0.5']

            for(let i = 1; i <= this.form.xf; i++) {
                if(this.form.xf % i == 0) {
                    zlArr.push(i)
                }
            }
            if(this.currentRw && this.currentRw.xf){
                if(this.currentRw.xf!=this.form.xf){
                    this.zfzl = ''
                }
            }
            
            return zlArr;
        },
    },
    watch:{
        dataIndex(){                                                //任务切换
            this.activeStuName = '0'    
        },
        createFormVisible(){                                            //支持回车键保存
            if(this.createFormVisible){
                var that = this
                document.onkeydown=function(e){
                    var theEvent = e || window.event;    
                    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;    
                    if (code == 13) {    
                        that.createSubmit('createform')
                        return false;    
                    }    
                    return true;   
                }
            }
        },        
    },
    methods: {
        //基础信息获取(年级/学年学期/课程)
        dqXnXqObj() {
            dqxnxqObj({
                xxdm: this.listQuery.xxdm,
            }).then(response => {
                this.xnxq = response                
                this.getItemDetail();
            })
        },
        // 获取所属项目的信息
        getItemDetail() {
            getItem({
                id: this.listQuery.xmid
            }).then(response => {
                this.itemDetail = response
                this.getAllBj() //加载所有班级
                this.getList()  //加载所有任务List
            })
        },
        //加载所在年级的所有班级
        getAllBj () {
            getBj({
                page: 1,limit: 500,
                xxdm: this.listQuery.xxdm,
                njdm: this.itemDetail.njdm,
                jbny: this.xnxq.xn,
            }).then(response => { 
                this.bjList = response.data.rows
                let bjidArr = [];  //班级代码value数组
                for(let i = 0; i < this.bjList.length; i++) {
                    bjidArr.push(this.bjList[i].uuid) 
                }
                this.bjidArr = bjidArr
            })
        },     
        // 获取所有任务List
        getList() {
            page(this.listQuery).then(response => {
                this.listLoading = false
                this.rwList = response.list; 
                this.total = response.totalCount;
                this.bjcj = [];   
                if(this.rwList && this.rwList[0] && this.rwList[0].uuid) {                    
                    // this.dataIndex = 0
                    // this.cjIndex = '0'                              //当前展示的成绩的班级序号
                    this.rwid = this.currentRw.uuid
                    this.getBjCj(this.currentRw.uuid)               //获取所选任务的班级信息          
                }             
            })   
        },
        // 分页
        handleCurrentChange(val) {
            this.listQuery.pageIndex = val;
            this.getList();
        },
        //获取所选任务的班级信息   
        getBjCj(rwid) {
            var that = this
            getCreditList({
                xmid: this.listQuery.xmid,
                xxdm: this.listQuery.xxdm,
                searchbjid:this.listQuery.searchbjid,
                username:this.listQuery.username,
                rwid: rwid,
            }).then(response => {
                this.bjcj = response
                for(let i = 0; i < this.bjcj.length; i++) {
                    for(let j = 0; j < response[i].data.length-1; j++) {
                        response[i].data[j].next = j+1;
                        response[i].data[j].numAll = response[i].data.length; 
                    }
                    for(let j = 0; j < this.bjcj[i].data.length; j++) { 
                        that.$set(that.bjcj[i].data[j],'lrsure', 0)
                        if(that.itemDetail.jflx==5){
                            that.$set(that.bjcj[i].data[j],'lrsure_xf', 0)
                        }
                        response[i].data[j].curData = i;
                        response[i].data[j].ref = "input"+i+j;
                        response[i].data[j].index = j+""
                        if(that.itemDetail.jflx == 4){ 
                            if(!response[i].data[j].twInfo || response[i].data[j].twInfo.length<1){
                                response[i].data[j].twInfo =[]
                                response[i].data[j].twInfo.push({twnr:'',tpdz:'',tpdzList:[],twlrCurNum:0})
                            }else{
                                response[i].data[j].twInfo.forEach(function(twLt,twind){
                                    var imgList = twLt.tpdz?twLt.tpdz.split('|'):[]
                                    twLt.tpdzList = []
                                    if(imgList.length>0){
                                        imgList.forEach(function(imgli,imgindex){
                                            twLt.tpdzList.push({url:imgli})
                                        })
                                    }
                                    that.$set(twLt,'twlrCurNum', twLt.tpdzList.length)
                                })

                            }
                        }
                    }
                }
                // console.log(this.bjcj)
            })
        },
        //提示信息
        tipsXX(data,xxtype,tit){
            this.$notify({
                title: tit,
                message: data,
                type: xxtype,
                duration: 2000
            });
        },     
        
        /********选择班级弹层***********/ 
        clickBjsel(){
            this.bjDialogVisible = true
            switch(this.dialogStatus) {
                //更新
                case 'update':
                    let checkedCount = this.bjid.length 
                    this.checkAll = checkedCount === this.bjList.length
                    this.isIndeterminate = checkedCount > 0 && checkedCount < this.bjList.length;
                    break;
                //创建    
                case 'create':
                    this.checkAll = false
                    this.isIndeterminate = false
                    break;
            }
        },
        //取消选择班级弹层
        bjCancel() {
            this.bjDialogVisible = false
            this.bjidSelect = this.bjidBeifen;
        },  
        //控制选择的变量
        handleCheckedChange(value){
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.bjList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.bjList.length;
        },       
        //确定按钮
        bjSubmit() {
            this.bjDialogVisible = false
            let bjid = [];
            for(let i = 0; i < this.bjidSelect.length; i++) {
                let index = this.bjidArr.indexOf(this.bjidSelect[i])
                if(index>=0) {
                    bjid.push(this.bjList[index])
                }                
            }
            this.bjid = bjid;
            this.bjidBeifen = this.bjidSelect
        },
        //全选
        handleCheckAllChange(val){
            this.bjidSelect = val ? this.bjidArr : [];
            this.isIndeterminate = false;
        },
        //重置按钮
        bjReset() {
            this.bjidSelect = [];
            this.checkAll = false
            this.isIndeterminate = false;
        }, 

        /********任务弹层***********/        
        //新建按钮
        handleCreate() {
            this.btnLimt = false
            this.dialogStatus = 'create';
            this.isChange = false
            this.createFormVisible = true;
        }, 
        //取消按钮            
        createCancel() {
            this.createFormVisible = false
            this.dataInit();           
        },
        //表单内容初始化
        dataInit() {
            this.$refs['createform'].resetFields();
            this.form = {};
            this.lrrylxList = ['1']                 //默认录入人员为老师
            this.sfggrw = '1'                       //默认共有任务为是
            this.zfzl = ''                          //默认加减幅度为空
            this.bjid = [];
            this.bjidBeifen = [];
            this.bjidSelect = [];
        },
        //删除所选班级
        delBj(index) {
            this.bjid.splice(index, 1);
            this.bjidBeifen.splice(index, 1);
            this.bjidSelect = this.bjidBeifen;
        },
        // 加减幅度选择
        zlrsdf(val){
            // this.$set(this.form,'zl',val)
            this.form.zl = val
        },
        //提交按钮
        createSubmit(formName) {
            let _this = this
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.btnLimt = true
                    this.form.xmid = this.listQuery.xmid
                    this.form.xxdm = this.listQuery.xxdm
                    this.form.sfggrw = Number(_this.sfggrw)        //是否公共任务
                    if(this.bjidBeifen.length == 0) {                                    
                        this.btnLimt = false;
                        this.tipsXX("请选择执行班级",'warning','提示');
                    }
                    this.form.bjid = this.bjidBeifen.join(',')                  //2018175510101
                    if(this.form.xf<0 || this.form.xf>500){
                        this.btnLimt = false;
                        this.tipsXX("学分为0~500之间",'warning','提示');
                        return false
                    }else{
                        if(this.form.xf<1 && !(/^([0-9]*)+(.[0-9]{1,2})?$/.test(this.form.xf))){
                            this.btnLimt = false;
                            this.tipsXX("学分只能有两位小数",'warning','提示');
                            return false
                        }
                        if(this.form.xf>0 && !(/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(this.form.xf))){
                            this.btnLimt = false;
                            this.tipsXX("学分只能有两位小数且不能以0开始",'warning','提示');                            
                            return false
                        }
                    }

                    var lrrynum = 0
                    if(this.lrrylxList && this.lrrylxList.length>0){
                        this.lrrylxList.forEach(function(item,index){
                            lrrynum = lrrynum+Number(item)
                        })
                    }else{
                        this.btnLimt = false;
                        this.tipsXX("有未填项",'warning','提示');
                        return false
                    }
                    this.form.lrrylx = lrrynum

                    //表单提交
                    switch(this.dialogStatus) {
                        //更新
                        case 'update':
                            updateRw(this.form).then(() => {
                                this.createFormVisible = false;
                                this.dataInit();
                                this.getList();
                                this.getItemDetail();
                                this.tipsXX("修改成功",'success','成功');
                                this.btnLimt = false;
                            }).catch(()=>{
                                setTimeout(function(){
                                    _this.btnLimt = false;
                                },1500);
                            })
                            break;
                        //创建    
                        case 'create':
                            createRw(this.form).then(() => {
                                this.createFormVisible = false;
                                this.dataInit();
                                this.getList();
                                this.getItemDetail();
                                this.tipsXX("创建成功",'success','成功');
                                this.btnLimt = false;
                            }).catch(()=>{
                                setTimeout(function(){
                                    _this.btnLimt = false;
                                },1500);
                            })
                            break;    
                    }
                } else {
                    return false;
                }
            });
        },
        //修改
        handleUpdate(item) {
            getRw({id:item.uuid}).then(res => {      
                this.btnLimt = false
                this.dialogStatus = 'update';
                this.form.uuid = res.uuid;
                this.form.bjid = res.bjid;
                this.form.mc = res.mc;
                this.isChange = res.rwyssjCount>0?true:false;       //任务是否能被修改
                this.$set(this.form,'xf',res.xf);
                this.form.zl = this.zfzl = res.zl;
                this.sfggrw = String(res.sfggrw)               //是否公共任务
                this.bjidSelect = this.form.bjid.split(',');
                this.bjidBeifen = this.bjidSelect;
                let bjid = [];
                for(let i = 0; i < this.bjidSelect.length; i++) {
                    let index = this.bjidArr.indexOf(this.bjidSelect[i])
                    if(index>=0) {
                        bjid.push(this.bjList[index])
                    }           
                }
                this.bjid = bjid;
                // 录入人员
                if(res.lrrylx==1){
                    this.lrrylxList = ['1']
                }else if(res.lrrylx==2){               
                    this.lrrylxList = ['2']
                }else if(res.lrrylx==4){               
                    this.lrrylxList = ['4']
                }
                if(res.lrrylx==3){               
                    this.lrrylxList = ['1','2']
                }else if(res.lrrylx==5){               
                    this.lrrylxList = ['1','4']
                }else if(res.lrrylx==6){               
                    this.lrrylxList = ['2','4']
                }else if(res.lrrylx==7){               
                    this.lrrylxList = ['1','2','4']
                }
                this.createFormVisible = true;
            })
        },
        //删除任务
        handleDelete(item) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delRw({id: item.uuid}).then(() => {
                    this.tipsXX("删除成功",'success','成功');
                    const index = this.rwList.indexOf(item);
                    this.rwList.splice(index, 1);
                    this.listQuery.pageIndex=1
                    this.listQuery.pageSize=10
                    this.getList();                    
                    this.getItemDetail();
                }).catch((error)=>{
                    this.$confirm('该任务已录入了成绩，请联系管理员进行删除操作。', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                });
            });
        },

        /************录入部分*************/
        // 搜索
        handleFilter(){
            this.listQuery.searchbjid = this.bjcj[this.cjIndex].bjid;            
            this.getBjCj(this.currentRw.uuid);
        },
        //班级-标签页切换事件
        tabClick(item) {
            this.cjIndex = item.index;
            if(this.listQuery.username){
                this.listQuery.username = '';
                this.getBjCj(this.currentRw.uuid);
            }
        },
        //任务列表项选中事件
        selectBj(row, event, column) {
            this.rwid = row.uuid;
            let rwidArr = [];
            for(let i = 0; i < this.rwList.length; i++) {
                rwidArr.push(this.rwList[i].uuid)
            }
            this.dataIndex = rwidArr.indexOf(row.uuid);
            this.cjIndex = "0"

            this.listQuery.username = ''
            
            if(this.itemDetail.xmlx == 0) {
                this.getBjCj(row.uuid)
            }
        },
        //任务列表选中样式切换
        tableRowClassName({row, rowIndex}) {
            if (rowIndex == this.dataIndex) {
                return 'selectedRow';
            }
            return '';
        },
        // 录入--积分
        inpBlur(ev,row){
            if(row.sz){
                row.sz = Number(row.sz)
                if(!Number(row.sz) && row.sz!=0){
                    row.lrsure = 2
                    return false
                }

                if(this.itemDetail.jflx==1){                //累积量
                    if(row.sz!=0 && row.sz!=1){
                        row.lrsure = 2
                        return false
                    }
                }
                // if(this.itemDetail.jflx==5){                //体育健康
                //     if(!row.xf){
                //         row.lrsure_xf = 2
                //         return false
                //     }
                // }
                if(row.sz<0){
                    row.lrsure = 2
                    this.tipsXX("分值不能小于0",'error','失败');
                    return false
                }
                if((row.sz>this.currentRw.xf && this.itemDetail.jflx!=1 && this.itemDetail.jflx!=5)){
                    row.lrsure = 2
                    this.tipsXX("分值不能大于"+this.currentRw.xf,'error','失败');
                    return false
                }
                if(row.sz<1){
                    if(!(/^([0-9]*)+(.[0-9]{1,2})?$/.test(row.sz))){
                        row.lrsure = 2
                        return false                    
                    }
                }else{
                    if(!(/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(row.sz))){
                        row.lrsure = 2
                        return false                    
                    }
                }
                var batchList = []
                batchList.push(row)
                this.tBatchInputValue(batchList)            
            }else{
                row.lrsure = 0
            }     
        },
        inpClearsz(ev,row){
            row.lrsure = 0
        },
        // 录入--学分
        inpBlurxf(ev,row){
            if(row.xf){
                console.log("1")
                row.xf = Number(row.xf)
                if(!Number(row.xf) && row.xf!=0){
                    row.lrsure_xf = 2
                    return false
                }
                if( row.xf<0){
                    row.lrsure_xf = 2
                    this.tipsXX("学分不能小于0",'error','失败');
                    return false
                }
                if(row.xf<1){
                    if(!(/^([0-9]*)+(.[0-9]{1,2})?$/.test(row.xf))){
                        row.lrsure_xf = 2
                        return false                    
                    }
                }else{
                    if(!(/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(row.xf))){
                        row.lrsure_xf = 2
                        return false                    
                    }
                }
                if(this.itemDetail.jflx==5){                //体育健康
                    if(!row.sz){
                        row.lrsure = 2
                        return false
                    }
                }
                var batchList = []
                batchList.push(row)
                BatchInputValue(batchList).then((res) => {  
                    batchList[0].lrsure_xf=1
                }).catch(()=>{
                    batchList[0].lrsure_xf=2
                })
            }else{
                row.lrsure_xf = 0
            }     
        },
        inpClearxf(ev,row){
            row.lrsure_xf = 0
        },
        // 录入--等级
        down2next(event,raw){
            var e = raw.next
            var curData = raw.curData
            var all = raw.numAll
            var code = event.keyCode || event.which || event.charCode;   

            let input
            input = 'input'+curData+e
            var batchList = []

            if(code==49 || code==97 || code==65){               
                raw.djz ='A'
                batchList.push(raw)
                this.tBatchInputValue(batchList)
                if(e==all) return false;
                else this.$refs[input][0].select();
            }else if(code==50 || code==98 || code==66){
                raw.djz ='B'
                batchList.push(raw)
                this.tBatchInputValue(batchList)
                if(e==all) return false;
                else this.$refs[input][0].select();
            }else if(code==51 || code==99 || code==67){
                raw.djz ='C'
                batchList.push(raw)
                this.tBatchInputValue(batchList)
                if(e==all) return false;
                else this.$refs[input][0].select();
            }else if(code==52 || code==100 || code==68){
                raw.djz ='D'
                batchList.push(raw)
                this.tBatchInputValue(batchList)
                if(e==all) return false;
                else this.$refs[input][0].select();
            }else{
                raw.djz =''
            }
        },
        // 批量录入--通用
        tBatchInputValue(data){
            BatchInputValue(data).then((res) => {  
                data[0].lrsure=1
                if(res.errorCount>0){
                    this.tipsXX(res.errorList[0],'error','失败');
                }else{
                    if(this.itemDetail.jflx==4){                   //录入图文
                        this.tipsXX('录入成功','success','成功');
                    }
                }
            }).catch(()=>{
                data[0].lrsure=2
            })
        },
        //加减分增减
        changeXf(row) {
            var batchList = []
            batchList.push(row)
            this.tBatchInputValue(batchList)   
        },   
        // 图文录入--上传前对文件的大小的判断
        BatchbeforeUploadPicture(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            let isLt2M = file.size / 1024 / 1024 < 1
            if (!isJPG && !isPNG) {
                this.tipsXX('上传模版只支持图片格式','info','提示');
            }else if (!isLt2M) {
                this.tipsXX('上传模板大小不能超过 1MB','info','提示');
            }
            
            return (isJPG || isPNG) && isLt2M
        },  
        // 图文录入--上传成功后的回调
        uploadSuccessPic(res, file,fileList,twinfo) {
            if(res.status=="200"){
                this.twlrCurList= fileList
                var allImgL = []
                if(fileList&&fileList.length>0){
                    fileList.forEach(function(item,ind){
                        if(item.response){
                            allImgL.push(item.response.value[0])
                        }else{
                            allImgL.push(item.url)
                        }
                    })
                }
                this.$set(twinfo,'tpdz',allImgL.join("|"))
                this.$set(twinfo,'twlrCurNum',fileList.length)
            }else{
                this.tipsXX(response.resultMessage,'error','失败');
            }
        },
        // 图文录入--上传删除的回调
        handlePictureRemove(file,fileList,twinfo){
            var allImgL = []
            if(fileList&&fileList.length>0){
                fileList.forEach(function(item,ind){
                    if(item.response){
                        allImgL.push(item.response.value[0])
                    }else{
                        allImgL.push(item.url)
                    }
                })
            }
            this.$set(twinfo,'tpdz',allImgL.join("|"))
            this.$set(twinfo,'twlrCurNum',fileList.length)
        },
        // 图文录入--上传个数的限制
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件`);
        },
        // 图文录入--上传图片的放大
        handlePictureCardPreview(file){ 
            this.dialogImageUrl = file.url;
            this.dialogPictureVisible = true;
        },
        //图文保存
        twSure(student){
            var isGserr = false
            if(student.twInfo&&student.twInfo.length>0){
                student.twInfo.forEach(function(item,ind){
                    if(item.fz){
                        if(item.fz<0 || item.fz>500){
                            isGserr = true
                        }
                        if(item.fz<1){
                            if(!(/^([0-9]*)+(.[0-9]{1,2})?$/.test(item.fz))){        
                                isGserr = true
                            }
                        }else{
                            if(!(/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(item.fz))){        
                                isGserr = true
                            }
                        }
                    }
                })
            }
            if(isGserr){
                this.tipsXX('分值不能大于500或小于0,且只能有两位小数','error','失败');
                return false
            } 

            var submdata = []
            submdata.push(student)
            this.tBatchInputValue(submdata)
        },
        //图文添加
        twAdd(item){
            item.twInfo.push({twnr:'',tpdz:'',tpdzList:[]})
        },
        //图文删除
        twDel(item,index,index2,indtw){
            if(item.twInfo[indtw].twuuid){            
                var delData = {
                    xxdm:item.xxdm,
                    xmcjid: item.twInfo[indtw].xmcjid,
                    xh:item.xh,
                    twid: item.twInfo[indtw].twuuid
                }
                DeleteCreditValue(delData).then(() => {                  
                    item.twInfo.splice(indtw, 1);
                    this.tipsXX('删除成功','success','成功');
                }).catch(()=>{})
            }else{
                item.twInfo.splice(indtw, 1);
            }
        },
        //成绩上报（逻辑）
        reportCj() {
            let notReportNum = 0; //未录入的人员总数
            GetXmStatistics({
                xxdm: this.listQuery.xxdm,
                xmid: this.listQuery.xmid,
            }).then((response) => {
                notReportNum = response.noEntryCount
                if(notReportNum > 0) {
                    this.$confirm('还有未录入的学生，是否将未录入的学生标记为缺考', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.reportCjAction()
                    });
                    return false
                }else{
                    this.reportCjAction()
                }
            })            
        },
        //成绩上报（动作）
        reportCjAction() {
            CurrencyReport({
                xmid: this.listQuery.xmid,
                xxdm: this.listQuery.xxdm,
                rwid: this.rwid,                                  
            }).then(response => {
                this.tipsXX("上报成功",'success','成功');
                this.getList()
            })
        },
        
        //数据导入选择
        handleCommand(command){
            if(command=='xm'){                  //按项目导入
                this.DialogVisibleTips = true
            }
            if(command=='rw'){                  //按任务导入
                this.importCjFormVisible = true;
            }
        },
        /************数据导入*************/
        // 上传成功后的回调
        uploadSuccess (response, file, fileList, type) { 
            var isfilename = [];                   //正确的文件名
            var that = this
            if(type =='rw'){                    //任务导入
                isfilename.push(this.itemDetail.mc+this.currentRw.mc+'.xlsx')
            }
            if(type =='xm'){                    //项目导入
                if(this.bjList && this.bjList.length>0){
                    this.bjList.forEach(function(item,index){
                        isfilename.push(that.itemDetail.mc+item.bj+'.xlsx')
                    })
                }
            }
            var isSure = false;             //判断上传的文件名是否正确
            isfilename.forEach(item => {
                if(item==file.name){
                    isSure = true
                }
            })
            if(isSure){
                if(response.status=="200"){
                    this.importLoading = false;
                    this.tipsXX("上传成功",'success','成功');
                    if(type=='rw')                           //任务导入
                        this.importCjFormVisible = false;                  
                    if(type=='xm')                           //项目导入
                        this.BatchimportCjFormVisible = false;    
                    this.fileList = [];
                    this.getList();
                }else{
                    this.importLoading = false;
                    this.fileList = [];
                    this.tipsXX(response.resultMessage,'error','失败');
                }
            }else{
                this.importLoading = false;
                this.fileList = [];
                this.tipsXX("上传文件名不一致",'error','失败');
            }
        },
        // 上传错误
        uploadError (response, file, fileList) {
            this.importLoading = false;
            this.tipsXX('上传失败，请重试！','error','失败');
        },
        // 上传前对文件的大小的判断
        beforeUpload (file) {
            this.importLoading = true;
            let extension = file.name.split('.')[1] === 'xlsx'
            let isLt2M = file.size / 1024 / 1024 < 10
            if (!extension) {
                this.tipsXX('上传模版只支持xlsx格式！','info','提示');
                this.importLoading = false;     
            }else if (!isLt2M) {
                this.tipsXX('上传模板大小不能超过 10MB','info','提示');
                this.importLoading = false;
            }
            return extension && isLt2M
        },
        //在线导入
        importSubmit(fileName){ 
            if(!this.$refs[fileName].uploadFiles || this.$refs[fileName].uploadFiles.length<1){
                this.tipsXX("请选择文件",'error','失败');
                return false
            }
            this.$refs[fileName].submit();
        },
        /************按项目导入*************/
        // 提示确定
        TipsSure(){
            this.BatchSelClass = '';
            this.BatchimportCjFormVisible = true;
            var that = this
            setTimeout(function(){
                that.DialogVisibleTips = false;
            },100)
        },
        //取消上传
        BatchimportCancel() {
            this.importLoading = false;
            this.BatchimportCjFormVisible = false;
        },
        // 下载模版
        BatchimportMb(){
            var that = this
            var className = ''
            if(this.BatchSelClass>0){                   
                if(this.bjList && this.bjList.length>0){
                    this.bjList.forEach(function(item,index){
                        if(item.uuid==that.BatchSelClass){
                            className = item.bj
                        }
                    })
                }
                BatchexportExcel({
                    xxdm: this.listQuery.xxdm,
                    xmid: this.listQuery.xmid,
                    bjid: this.BatchSelClass,
                }).then(response => {
                    var blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); 
                    var downloadElement = document.createElement('a');
                　　var href = window.URL.createObjectURL(blob); //创建下载的链接
                　　downloadElement.href = href;
                　　downloadElement.download = this.itemDetail.mc+className+'.xlsx'; //下载后文件名
                　　document.body.appendChild(downloadElement);
                　　downloadElement.click(); //点击下载
                　　document.body.removeChild(downloadElement); //下载完成移除元素
                　　window.URL.revokeObjectURL(href); //释放掉blob对象 
                })
            }else{
                this.tipsXX("请选择执行班级",'warning','提示');
            }
        },
    
        /************按任务导入*************/
        //取消上传
        importCancel() {
            this.importLoading = false;
            this.importCjFormVisible = false;
            this.fileList = [];
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
            　　downloadElement.download = this.itemDetail.mc+this.currentRw.mc+'.xlsx'; //下载后文件名
            　　document.body.appendChild(downloadElement);
            　　downloadElement.click(); //点击下载
            　　document.body.removeChild(downloadElement); //下载完成移除元素
            　　window.URL.revokeObjectURL(href); //释放掉blob对象 
            })
        },          
    }
};
</script>



<style lang="scss">
    // 通用样式
    .el-radio-group label{
        margin-bottom: 0;
    }
    .left {
        float: left;
    }
    .right {
        float: right;
    }
    .mright {
        margin-right: 15px;
    }
    .selectedRow {
        background-color: #ecf3fe !important;
        td:nth-child(1) {
            background: #4787f1 !important;
        }
    }
    .blue {
        color: blue;
    }

    //ui框架部分样式修改
    .el-input-number .el-input__inner {
        padding: 0 !important;
    }
    .el-input-number__decrease, .el-input-number__increase {
        width: 30% !important;
    }

    .body {
        background: #eceff1;
        // 项目详情描
        .detail {
            background: #fff;
            display: flex;
            .detail-box {
                width: 0;
                flex-grow: 1;
                &:nth-child(n+2) {
                    margin-left: -1px;
                }
                line-height: 40px;
                border: 1px solid #eceff1;
                border-bottom: none; 
                .detail-title {
                    padding-left: 20px;
                    font-weight: 500;  
                    border-bottom: 1px dashed #eceff1; 
                }
                .detail-content {
                    padding-left: 20px;
                    .content-title {
                        color: #758a9d;
                    }
                }
            }
        }
        .detail-pull {
            margin-bottom: 30px;
            .detail-pullbtn {
                background: #f7f8fa;
                width: 100%;
            } 
        }

        .box-table{
            min-width: 940px;
        }
        // 任务列表
        .rw-table {
            .rw-header {
                margin-bottom: 10px;
                height: 40px;
                line-height: 40px;
            }
            .rw-body { 
                background: #fff;
                .update-btn {
                    color: #ff9703;
                }
                .delete-btn {
                    color: #4cb04e;
                }
            }
        }

        // 成绩|结果 列表
        .cj-table {
            .empty-table {
                height: 172px;
                margin-top: 50px;
                line-height: 172px;
                text-align: center;
                background: #fbfbfd;
                font-size: 20px; 
            }

            .cj-header {
                position: relative;
                margin-bottom: 10px;
                height: 40px;
                .yxbc-style {
                    position: absolute;
                    right: 28px;
                    bottom: -46px;
                    z-index: 9;
                }
            }

            .cj-body {
                .table-notice {
                    background-color: rgb(255, 236, 129);
                    padding: 0 10px;
                    border-radius: 10px; 
                    .notice-icon {
                        padding: 8px 0;
                        border: none;
                        font-size: 24px;
                    }
                    height: 40px;
                    overflow: hidden;
                    .notice-msg {
                        overflow: hidden;
                        line-height: 40px;
                        width: 697px;
                        transition: width 1s;
                    }
                }
                .table-header {
                    min-height: 40px;
                    line-height: 40px;
                    margin-bottom: 15px;
                    .xmfilter {
                        width: 250px;
                    }
                }
                .table-body{
                    .stu-card {
                        &:hover .stu-btn {
                            display: block;
                        }
                        &:hover {
                            background: #dde8f7; 
                        }
                        cursor: pointer;

                        float: left;
                        position: relative;
                        box-sizing: border-box; 
                        height: 220px;
                        width: calc((100% - 90px)/7);
                        font-size: 16px;  
                        text-align: center;  
                        background: #f5f7fa; 
                        margin-bottom: 15px;          
                        margin-right: 15px;
                        &:nth-child(7n) {
                            margin-right: 0;
                        }
        
                        .stu-icon {
                            padding: 15px 5px 5px 5px;
                            img {
                                width: 75%;
                                height: 75%;
                            }
                        }
                        .stu-desc {
                            line-height: 40px;
                        }
                        .stu-btn-block{
                            width: 100%;
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            
                            border-radius: 0;
                            input{
                                text-align:center
                            }
                        }
                        .stu-btn {
                            width: 100%;
                            position: absolute;
                            bottom: 0;
                            
                            border-radius: 0;
                            display: none;
                            
                        }   
                    }
                }
            }
        }

        // 新建任务-班级选择项
        .select-item {
            margin-bottom: 10px; 
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

    }

    .twIndRow{
        min-height:80px;
        // line-height: 80px;
        margin-bottom: 10px;
        .el-col-2{
            line-height: 80px;
        }
        .el-col-8{
            line-height: 80px;
        }
        .twIndspan{
            line-height: 80px;
            width:100%;
            display:block;
            text-align:center;
        }
        .el-upload--picture-card{
            width: 80px;
            height: 80px;
            line-height:78px;
            i{
                font-size:18px;
            }
            &.imgupshow{
                float: left;
                margin: 0 8px 8px 0;
                img{
                    display: block;
                    width:100%;
                    height:100%;
                }
            }
        }


        .el-upload-list--picture-card{
            .el-upload-list__item{
                width: 80px;
                height: 80px;
            }
        } 
        .el-dialog__headerbtn{
            line-height:1;
        }
        .el-dialog__wrapper{
            z-index: 2555!important;
        }
        button{ 
            margin: 0 auto;
            display: block;
        }

        .twimg{

        }
        .twimgList{
            width: 80px;
            height: 80px;
            line-height: 78px;
            display: inline-block;
            text-align: center;
            cursor: pointer;
            outline: 0;
            vertical-align: top;
            background-color: #fbfdff;
            border: 1px dashed #c0ccda;
            border-radius: 6px;
            box-sizing: border-box;
            margin: 0 8px 8px 0;
            float:left;
            img{
                display: block;
                width: 100%;
                height:100%;
            }
        }
        .addimg{
            width: 80px;
            height: 80px;
            line-height: 78px;
            display: inline-block;
            float:left;
            text-align: center;
            cursor: pointer;
            outline: 0;
            vertical-align: top;
            background-color: #fbfdff;
            border: 1px dashed #c0ccda;
            border-radius: 6px;
            box-sizing: border-box;
            margin: 0 8px 8px 0;
            position: relative;
            cursor: pointer;
            input{
                line-height: normal;
                width:100%;
                height:100%;
                opacity:0;
                position: absolute;
                left:0; top:0;
            }
            i{
                font-size: 18px;
                color: #8c939d;
            }
        }
        div{
            &.on{
                .el-upload--picture-card{
                    display:none;
                }
            }
        }
    }

    .v-modal{
        z-index:500!important;
    }
    
    .red{
        color:#F56C6C;font-size: 14px;
    }

</style>
<style lang="scss">
    .inpBSign{
        .el-input{
            width: 150px;
            margin-right: 10px;
        }
        .singico{
            font-size: 18px;
        }
        .el-icon-close{
            color:#F56C6C;
        }
        .el-icon-check{
            color: #67C23A;
        }
    }
    .select-item .el-checkbox{
        margin-right:10px;
    }
    .select-item .el-checkbox.is-bordered+.el-checkbox.is-bordered{
        margin-left:0
    }
    
    .twIndRowheader{
        .el-col{
            line-height: 40px;
            display:block;
            text-align:center;
        }
    }
</style>
