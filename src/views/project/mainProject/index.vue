<template>
<div class="app-container calendar-list-container">
    <div v-if="!xmqzFormVisible">
        <div>
            <el-form :model="formSearch" ref="Searchform" label-position="left">
                <el-row style="min-width:680px; padding-left:20px;">
                    <el-col :span="11">
                        <el-form-item label="年级">
                            <el-select v-model="formSearch.njdm" clearable placeholder="请选择" @change="searchFn">
                                <el-option v-for="(item,index) in njList" :key="index" :label="item.njmc" :value="item.njdm"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="专业/科目" v-if="xxlm=='007'">                        
                            <el-cascader :options="zyList" v-model="formSearch.zykc" change-on-select :props="zyprops" @change="searchFn" clearable></el-cascader>
                        </el-form-item>
                        <el-form-item label="学科" v-else>
                            <el-select v-model="formSearch.kcid" clearable placeholder="请选择" @change="searchFn">
                                <el-option v-for="(item,index) in kcList" :key="index" :label="item.kcmc" :value="item.uuid"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <div style="overflow:hidden;"  v-loading.body="listLoading">
            <el-card class="partbox-card" shadow="hover" v-for="(item,index) in xmKindpage" :key="index">
                <div class="partkn">
                    <div class="card-kcmc">{{xxlm=='007'?(item.zymc+(item.kcmc?'/'+item.kcmc:'')):item.kcmc}}</div>
                    <el-tag size="mini">{{item.njmc}}</el-tag>
                </div>
                <div class="partcon">
                    <el-card class="box-card" shadow="hover"  v-for="(list,ind) in item.list" :key="ind">
                        <div class="card-mask">
                            <div><el-button type="primary" class="kzbtn" size="mini" plain @click.native="handleView(list)">查看项目</el-button></div>
                            <div v-if="list.jflx!=3 && list.jflx!=4 && list.jflx!=5">
                                <el-button type="primary" class="kzbtn" size="mini" plain @click.stop="handleSetqz(list)">权重设置</el-button>
                            </div>
                            <div>
                                <el-button type="primary" class="kzbtn-cen" size="mini" plain @click.stop ="handleUpdate(list)">修 改</el-button>
                                <el-button type="primary" class="kzbtn-cen" size="mini" plain @click.stop="handleDelete(list)" v-if="list.xmlx == 0">删 除</el-button>
                            </div>
                            <div>
                                <el-button type="primary" class="kzbtn-cen" size="mini" @click.stop="handleCopy(list)" plain>创建副本</el-button>
                                <el-button type="primary" class="kzbtn-cen" size="mini" @click.stop="handleSetpfbz(list)" plain>评分标准</el-button>
                            </div>
                        </div>
                        <div class="card-title">{{list.mc}}</div>
                        <div class="card-desc">
                            <span>总任务 {{list.rwsl}}</span><span v-if="list.ywzx == 1" class="desc-son"> ( 子项目 {{list.zxmsl}})</span>
                        </div>
                        <div class="card-progress">
                            <el-progress v-textDesc="{ysbsl:list.ysbsl}" :text-inside="true" :stroke-width="18" :percentage="0" v-if="list.ysbsl == 0"></el-progress>
                            <el-progress v-textDesc="{ysbsl:list.ysbsl}" :text-inside="true" :stroke-width="18" :status="list.ysbsl==list.rwsl?'success':''" :percentage="Math.floor(100 * list.ysbsl/list.rwsl)" v-if="list.ysbsl > 0"></el-progress>
                        </div>
                    </el-card>
                </div>     
            </el-card>
        </div>
        <div class="menu-btn">
            <div>
                <el-button circle type="primary" icon="el-icon-plus" @click="handleCreate" class="create-btn"></el-button>
            </div>
        </div>
        
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="xmpageQuery.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="xmpageQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
    </div>
    <!-- 设置权重 -->
    <div class="contain-setqz" v-if="xmqzFormVisible">
        <div class="setqzTop clear">
            <span class="name">设置权重</span>
            <div class="exptips">示例说明：语文总积分=第一次月考×15%+第二次月考×15%+期中考试×25%+第三次月考×15%+期末考试×30%</div> 
        </div>
        <el-form :model="setXmqzform" ref="setXmqzform" label-width="80px">
            <div class="partkn">
                <div class="card-kcmc">{{xxlm=='007'?(XmqzRes.zymc+(XmqzRes.kcmc?'/'+XmqzRes.kcmc:'')):XmqzRes.kcmc}}</div>
                <el-tag size="mini">{{XmqzRes.njmc}}</el-tag>
            </div>            
            <div v-if="XmqzList.length<1" class="empty">暂无数据</div>
            <div v-if="XmqzList.length>0" class="layXmqz_setLi clear">
                <div class="Xmqz_setTit">
                    <div class='xmmc'>{{XmqzRes.mc}}</div>
                    <div class='xmtype'>(项目)</div>
                </div>
                <span class="signalg">=</span>
                <div class="part">
                    <div class="Xmqz_setItem" v-for="(item,index) in alreadysetqz" :key="index">
                        <div class="border">
                            <i class="el-icon-close" @click="closesetqz(alreadysetqz,item)"></i>
                            <div class="rowsel">
                                <el-select v-model="item.uuid" placeholder="请选择">
                                    <el-option v-for="data in XmqzList" :key="data.uuid" :label="data.mc" :value="data.uuid"></el-option>
                                </el-select>
                            </div> 
                            <div class="rowsign">
                                <el-select v-model="item.jsfsbm" placeholder="请选择" class="ysfh-jsfs" size="small">
                                    <el-option label="×" :value="1">×</el-option>
                                    <el-option label="÷" :value="2">÷</el-option>
                                </el-select>                        
                            </div>
                            <div class="rowinpapp">
                                <el-input v-model="item.qzbfb" placeholder="100" class="hsInput"><template slot="append">%</template></el-input>
                            </div>
                            <span class="signalg">×</span>
                            <div class="rowinp">
                                <el-input v-model="item.qzcs" placeholder="1" class="hsInput"></el-input>
                            </div>
                        </div>
                        <span class="signalg">+</span>
                    </div>
                    <div class="Xmqz_setAdd" @click="xmqzAdd(alreadysetqz)">
                        <div class="border">
                            <i class="el-icon-circle-plus-outline"></i>
                            <span>添加加数</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layXmqz_setLi clear" v-if="XmqzList.length>0 && XmqzRes.ywzx" v-for="(item,index) in XmqzList" :key="index">
                <div class="Xmqz_setTit">
                    <div class='xmmc'>{{item.mc}}</div>
                    <div class='xmtype'>(子项目)</div>
                </div>
                <span class="signalg">=</span>
                <div class="part">
                    <div v-if="item.ysRwQzSettingList.length<1" class="empty" style="height:62px; line-height:62px; text-align:left;">暂无数据</div>
                    <div class="Xmqz_setItem" v-if="item.ysRwQzSettingList.length>0" v-for="(setIt,ind) in item.ysRwQzSettingList" :key="ind">
                        <div class="border">
                            <i class="el-icon-close" @click="closesetqz(item.ysRwQzSettingList,setIt)"></i>
                            <div class="rowsel">
                                <el-select v-model="setIt.uuid" placeholder="请选择">
                                    <el-option v-for="data in item.rwQzSettingList" :key="data.uuid" :label="data.mc" :value="data.uuid"></el-option>
                                </el-select>
                            </div> 
                            <div class="rowsign">
                                <el-select v-model="setIt.jsfsbm" placeholder="请选择" class="ysfh-jsfs" size="small">
                                    <el-option label="×" :value="1">×</el-option>
                                    <el-option label="÷" :value="2">÷</el-option>
                                </el-select>                        
                            </div>
                            <div class="rowinpapp">
                                <el-input v-model="setIt.qzbfb" placeholder="100" class="hsInput"><template slot="append">%</template></el-input>
                            </div>
                            <span class="signalg">×</span>
                            <div class="rowinp">
                                <el-input v-model="setIt.qzcs" placeholder="1" class="hsInput"></el-input>
                            </div>
                        </div>
                        <span class="signalg">+</span>
                    </div>
                    <div class="Xmqz_setAdd" v-if="item.ysRwQzSettingList.length>0" @click="xmqzAdd(item.ysRwQzSettingList)">
                        <div class="border">
                            <i class="el-icon-circle-plus-outline"></i>
                            <span>添加加数</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-form>
        <div slot="footer" class="center-footer">
            <el-button type="primary" :disabled="btnLimt" @click="setXmqzSure"  v-if="XmqzList.length>0">保 存</el-button>
            <el-button @click="setXmqzCancel">取 消</el-button>
        </div>
    </div>
    <!-- 新建项目弹层 -->
    <el-dialog :title="textMap[dialogStatus]"  :visible.sync="createFormVisible" width="850px" :before-close="createCancel" class="dialogprog">
        <el-form :model="form" ref="createform" label-width="110px" :rules="rules">
            <el-form-item label="学年学期" required>
                <el-row>
                    <el-col :span="9"><el-input disabled :value="xnxq.xn+'年'"></el-input></el-col>
                    <el-col :span="9" :offset="1"><el-input disabled :value="xnxq.xqmc"></el-input></el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="项目名称" prop="mc">
                <el-input v-model="form.mc" placeholder="请输入项目名称" :disabled="form.xmlx != 0"></el-input>
            </el-form-item>
            <el-form-item label="适用年级" prop="njdm">
                <el-radio-group v-model="form.njdm" :disabled='!isCanUpdata'>
                    <el-radio v-for="(item,index) in njList" :key="index" :label="item.njdm" border :disabled='form.xmlx != 0'>{{item.njmc}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="适用专业" prop="zykc" v-if="xxlm=='007'">
                <el-cascader :disabled='form.xmlx != 0 || !isCanUpdata' :options="zyList" v-model="form.zykc" change-on-select :props="zyprops" clearable ></el-cascader>
            </el-form-item>
            <el-form-item label="适用学科" prop="kcid" v-if="xxlm!='007'">
                <el-select v-model="form.kcid" placeholder="请选择" :disabled='!isCanUpdata'>
                    <el-option :disabled='form.xmlx != 0'
                        v-for="(item,index) in kcList" :key="index" :label="item.kcmc" :value="item.uuid">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="有无子项" required>
                <el-radio v-model="ywzx" label='0' :disabled="form.xmlx != 0 || !isCanUpdata" @change="ywzxChange">无</el-radio>
                <el-radio v-model="ywzx" label='1' :disabled="form.xmlx != 0 || !isCanUpdata" @change="ywzxChange">有</el-radio>
            </el-form-item>
            <div v-if="ywzx == 0">
                <el-form-item label="计分类型" required>
                    <el-radio v-model="jflxsel" label="0" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxselChange">原始数据换算成积分</el-radio>
                    <el-radio v-model="jflxsel" label="1" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxselChange">原始数据换算成等级</el-radio>                    
                    <el-radio v-model="jflxsel" label="2" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxselChange">保留原始数据，不做换算</el-radio>
                    <div class="dashdiv">
                        原始数据：
                        <el-radio v-model="jflx" label="0" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=2">成绩分值</el-radio>
                        <el-radio v-model="jflx" label="1" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=2">累积任务数</el-radio>                    
                        <el-radio v-model="jflx" label="7" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel!=2">加减分</el-radio>  
                        <el-radio v-model="jflx" label="3" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel==2">等级</el-radio>   
                        <el-radio v-model="jflx" label="5" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel==2">体育数据</el-radio>                    
                        <el-radio v-model="jflx" label="4" :disabled="form.xmlx != 0 || !isCanUpdata" @change="jflxChange" v-if="jflxsel==2">图文评语</el-radio>                           
                    </div>
                </el-form-item>
                <el-form-item required v-if="jflx != 1 && jflxsel!=2">
                    <div class='exptips'>{{expObj[jflxsel+jflx]}}</div>
                    <div class="baseval" v-if="jflx == 7">基准值为
                        <el-input-number v-model="form.jzz" :min="0" :max="500" :disabled='!isCanUpdata'></el-input-number>
                    </div>
                    <div class="hsItem" v-for="(item,index) in HsRange" :key="index">
                        <div class="dashed">
                            最小值
                            <el-input v-model="item.zxz" placeholder="0.00~500.00" class="hsInputmini" size="small" :disabled='!isCanUpdata'></el-input>
                            <span>至</span>
                            最大值
                            <el-input v-model="item.zdz" placeholder="0.00~500.00" class="hsInputmini" size="small" :disabled='!isCanUpdata'></el-input>
                            区间
                        </div>
                        换算为
                            <el-input v-model="item.sz" :placeholder="jflxsel==0?'0.00~999.00':'请输入ABCD'" class="hsInput" size="small" :disabled='!isCanUpdata'></el-input>
                        <span>{{jflxsel==0?'学分':'等级'}}</span>
                        <el-button type="text" icon="el-icon-minus" @click="deletedj(index)" v-if="index!=0" :disabled='!isCanUpdata'></el-button>
                    </div>                       
                    <el-button icon="el-icon-plus" @click="adddj" :disabled='!isCanUpdata'>区间<span class="tipsbtn">(注意事项：设定的区间不能有重叠)</span></el-button> 
                </el-form-item>
                <el-form-item required v-if="jflx == 1 && jflxsel!=2">
                    <div class='exptips'>{{expObj[jflxsel+jflx]}}</div>
                    <div class="hsItem" v-for="(item,index) in HsRange" :key="index">
                        累计完成
                        <el-input v-model="item.zxz" placeholder="0~500" class="hsInputmini" size="small" v-if="item.type != 2" :disabled='!isCanUpdata'></el-input>
                        <span v-if="item.type == 1">至</span>
                        <el-input v-model="item.zdz" placeholder="0~500" class="hsInputmini" size="small" v-if="item.type != 0" :disabled='!isCanUpdata'></el-input>
                        <span v-if="item.type == 0">及以上任务获得</span>
                        <span v-if="item.type == 2">及以下任务获得</span>
                        <span v-if="item.type == 1">任务获得</span>
                            <el-input v-model="item.sz" :placeholder="jflxsel==0?'0.00~999.00':'请输入ABCD'" class="hsInput" size="small" :disabled='!isCanUpdata'></el-input>
                        <span>{{jflxsel==0?'学分':'等级'}}</span>
                        <el-button type="text" icon="el-icon-minus" @click="deletedj(index)" v-if="item.type == 1" :disabled='!isCanUpdata'></el-button>
                    </div> 
                    <el-button icon="el-icon-plus" @click="adddj" :disabled='!isCanUpdata'>区间<span class="tipsbtn">(注意事项：设定的区间不能有重叠)</span></el-button> 
                </el-form-item>
            </div>
            <div v-if="ywzx == 1">
                <el-form-item label="转化等级" required>
                    <el-radio v-model="zhdj" label='0' :disabled="form.xmlx != 0 || !isCanUpdata" >否</el-radio>
                    <el-radio v-model="zhdj" label='1' :disabled="form.xmlx != 0 || !isCanUpdata">是</el-radio>
                </el-form-item>
                <el-form-item label="换算规则" required v-if="zhdj == 1">
                    <div class="hsItem" v-for="(item,index) in HsRange" :key="index">
                        <div class="dashed">
                            最小值
                            <el-input v-model="item.zxz" placeholder="0.00~500.00" class="hsInputmini" size="small" :disabled='!isCanUpdata'></el-input>
                            <span>至</span>
                            最大值
                            <el-input v-model="item.zdz" placeholder="0.00~500.00" class="hsInputmini" size="small" :disabled='!isCanUpdata'></el-input>
                            区间
                        </div>
                        换算为
                            <el-input v-model="item.sz" placeholder="请输入ABCD" class="hsInput" size="small" :disabled='!isCanUpdata'></el-input>
                        <span>等级</span>
                        <el-button type="text" icon="el-icon-minus" @click="deletedj(index)" v-if="index!=0" :disabled='!isCanUpdata'></el-button>
                    </div>                       
                    <el-button icon="el-icon-plus" @click="adddj" :disabled='!isCanUpdata'>区间<span class="tipsbtn">(注意事项：设定的区间不能有重叠)</span></el-button> 
                </el-form-item>
            </div>
            
            <div style="color:red;margin-left: 20px;"><span>注意事项</span> : 项目创建后如果各子项之间和各任务之间有计算规则的，请不要忘记设置权重规则
                <span class="setqz" v-if="dialogStatus=='update'" @click="handleSetqz(form)">权重设置</span>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="createSubmit('createform')" :disabled="btnLimt">保 存</el-button>
            <el-button @click="createCancel">取 消</el-button> 
        </div>
    </el-dialog>
    
    <!-- 评分标准弹层 -->
    <el-dialog title='评分标准' width="440px" :visible.sync="pfbzDialogVisible" append-to-body :before-close="pfbzCancel">
        <el-form label-width="110px" label-position="top">
            <el-form-item>
                <el-input type="textarea" :rows="12" placeholder="请输入内容" v-model="pfbz"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="pfbzSubmit">确 定</el-button>
            <el-button @click="pfbzCancel">取消</el-button> 
        </div>
    </el-dialog>
    
</div>
</template>

<script>
import { Loading } from 'element-ui';
import { getToken } from "utils/auth";
import { mapGetters } from "vuex";
import {
    page,getAllList,
    createItem,
    updateItem,
    delItem,
    getItem,
    getNj,
    getXk,
    dqxnxqObj ,getjcZysjlx,getQzInfo,GetQzListByxmId,AddBatchQz,getCopy,putBz
} from 'api/project/mainProject/index'
import {getXxdmInfo} from 'api/admin/school/index'
import {getCourseList} from 'api/admin/major/index'

export default {
    name: "mainProject",
    data() {
        return {
            xxdm:'',
            uuid: null, 
            listLoading: true, // 加载
            xmInfoList:[],                  //项目列表
            xmKindList:[],                  //按年级与科目排列的项目列表
            xmKindpage:[],                  //分页后每页的项目列表
            total: null,                    //分页
            xmpageQuery:{
                pageIndex: 1,
                pageSize: 20,
            },
            listQuery: {
                xxdm: window.localStorage.getItem('xxdm'),
                kcIds: null,
                njdms: null,
                zyIds: null,
            },
            njList: [],                     //所有年级
            kcList: [],                     //所有学科
            zyList:[],                      //所有专业
            xnxq: {},                       //当前学年学期信息  
            xxlm:'',                        //007--职高技校
            formSearch:{},                  //条件搜索
            zyprops: {                      //配置选项
                value: 'uuid',
                label:'mc',
                children: 'kcList'
            },

            isCanUpdata: true,              //是否可以修改
            dialogStatus: '',
            createFormVisible: false,
            textMap: {                              //判断弹层是添加还是编辑
                update: '编辑项目',
                create: '新建项目'
            },
            btnLimt: false,                 //防止重复点击BUG
            form: {},                       //项目编辑form
            ywzx: '0',                      //默认无子项 
            zhdj:'0',                       //转化等级
            //表单较检规则
            rules: {
                mc: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' },
                    { min: 1, max: 12, message: '长度不得超过12个字符', trigger: 'blur' }
                ],
                njdm: [
                    { required: true, message: '请选择适用年级', trigger: 'change' },
                ],
                kcid: [
                    { required: true, message: '请选择适用学科', trigger: 'change' },
                ],
                zykc: [
                    { required: true, message: '请选择适用专业', trigger: 'change' },
                ],
            },
            HsRange:[                       //转化     type: 1--区间
                {type: 1},{type: 1},{type: 1}
            ],
            zhdjHsRange:[                   //转化等级换算规则  type: 1--区间
                {type: 1},{type: 1},{type: 1}
            ],    
            jflxsel:'0',                     //计分类型       0 原始数据换算成积分  1 原始数据换算成等级   2 保留原始数据，不做换算   
            jflx: '0',                      //计分形式 
            expObj:{                        //示例
                '00':'示例：A同学该项目根据一定的权重计算后总分为82，换算成最终学分为10学分',           //积分--成绩分值
                '01':'示例：A同学该项目累计完成了6个任务，换算成最终学分为8学分',                      //积分--累积量
                '07':'示例：A同学在基准值60分的基础上额外获得了8分，最终得分为68，转化后得8积分',       //积分--加减分
                '10':'示例：A同学该项目根据一定的权重计算后总分为82，最终换算成等级为A',               //等级--成绩分值
                '11':'示例：A同学该项目累计完成了6个任务，最终换算成等级为B',                         //等级--累积量
                '17':'示例：A同学在基准值60分的基础上额外获得了8分，最终得分为68，最终换算成等级为B',   //等级--加减分
            },     
                
            lrrylxList:['1'],                       //录入人员 录入人员类型 1:教师 2：学生 1+2=3:教师+学生
            xmqzFormVisible:false,          //设置权重页面
            setXmqzform:{},                 //权重
            XmqzRes:{},                     //权重res
            XmqzList:[],                    //权重list
            alreadysetqz:[],                //已经设置过的权重
            alreadysetqzZX:[],              //已经设置过的权重--子项目

            // 评分标准
            pfbzDialogVisible:false,
            pfbz:'',                        //评分标准
        } 
    },  
    created() {        
        this.xxdm = window.localStorage.getItem('xxdm');
        this.getDicy()
        this.getList();
        window.localStorage.setItem('fjxmId','')
    },
    computed: {
        ...mapGetters(["elements"])
    },
    directives: {
        textDesc: {
            inserted: function (el, params) {
                let progressDom = el.children[0].children[0].children[0].children[0];
                let percentageText = progressDom.innerText;
                let descText = '已完成 '+params.value.ysbsl;
                progressDom.innerText = descText + ' (' + percentageText + ')'
            }
        }
    },
    methods: {
        // 项目列表
        getList() {
            this.listLoading = true;
            var query={
                xxdm: this.xxdm
            }
            getAllList(this.listQuery).then(response => {
                var that = this
                this.xmInfoList = response.xmInfoList
                this.total = this.xmInfoList.length;
                this.xmKindList = [];            //按年级与科目排列的项目列表

                if(this.xmInfoList && this.xmInfoList.length>0){
                    this.xmInfoList.forEach(function(item,index){
                        var isSame = false
                        that.xmKindList.forEach(function(nj,njind){
                            if(item.njdm == nj.njdm && item.njmc == nj.njmc && item.kcid == nj.kcid && item.kcmc == nj.kcmc && item.zyid == nj.zyid && item.zymc == nj.zymc){
                                isSame = true
                                nj.list.push(item)                                
                            }
                        })
                        if(!isSame){
                            var exp = []
                            exp.push(item)
                            that.xmKindList.push({'njmc':item.njmc,'njdm':item.njdm,'kcid':item.kcid,'kcmc':item.kcmc,'zyid':item.zyid,'zymc':item.zymc,'list':exp})
                        } 
                    })
                }
                this.xmPageChange(this.xmpageQuery.pageSize,this.xmpageQuery.pageIndex)
                this.listLoading = false;
            })
        },
        // 分页后每页的项目列表
        xmPageChange(size,index){
            var that = this
            this.xmKindpage = [];
            var num = 0;
            var allsize = size*index
            var othersize = size*(index-1)
            if(this.xmKindList && this.xmKindList.length>0){
                var pagesize = null;
                this.xmKindList.forEach(function(item,inditem){                    
                    var listdata = [];
                    if(item.list && item.list.length>0){
                        item.list.forEach(function(list,ind){
                            if(allsize>num){
                                num++         
                                if(num>othersize){
                                    pagesize = inditem         
                                    listdata.push(list)    
                                } 
                            }
                        })
                        if(inditem==pagesize){
                            that.xmKindpage.push({'njmc':item.njmc,'njdm':item.njdm,'kcid':item.kcid,'kcmc':item.kcmc,'zyid':item.zyid,'zymc':item.zymc,'list':listdata})
                        } 
                    }
                })
            }
        },        
        // 分页
        handleSizeChange(val) {
            this.xmpageQuery.pageSize = val
            this.xmPageChange(val,this.xmpageQuery.pageIndex)
        },
        handleCurrentChange(val) {
            this.xmpageQuery.pageIndex = val
            this.xmPageChange(this.xmpageQuery.pageSize,val)
        },
        //  条件搜索 
        searchFn() {

            this.listQuery.zyIds =  this.formSearch.zykc?this.formSearch.zykc[0]:undefined;
            this.listQuery.kcIds =  this.formSearch.zykc?this.formSearch.zykc[1]:this.formSearch.kcid;
            this.listQuery.njdms = this.formSearch.njdm;
            this.getList()
        },
        //基础信息获取(学年学期/学校信息(专业)/年级/学科)
        getDicy(){
            var that = this
            this.getXk()
            dqxnxqObj({xxdm: this.xxdm,}).then(response => {
                this.xnxq = response
            })
            getXxdmInfo({xxdm: this.xxdm,}).then(response => {
                this.xxlm = response.data.xxbxlxm               //学校类型--判别是专业还是学科
                if(this.xxlm == '007'){   //职高
                    getjcZysjlx({xxdm: this.xxdm}).then(response => {   //专业  
                        var zyresList = response
                        this.zyList = []
                        if(zyresList && zyresList.length>0){
                            zyresList.forEach(function(item,index){
                                that.zyList.push({uuid:item.uuid,mc:item.zymc})
                                if(item.kcList && item.kcList.length>0){
                                    that.zyList[index].kcList=[]                                
                                    item.kcList.forEach(function(kc,ind){
                                        if(that.kcList && that.kcList.length>0){        //学科列表
                                            that.kcList.forEach(function(kcall,indall){
                                                if(kc.kcid==kcall.uuid){
                                                    that.zyList[index].kcList.push({uuid:kcall.uuid,mc:kcall.kcmc})
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
            getNj({
                xxdm: this.xxdm, page: 1,limit: 50,
            }).then(response => {
                this.njList = response.data.rows
            })
        },
        getXk(){                            //学科  
            getXk({                                             
                xxdm: this.xxdm, page: 1, limit: 50,
            }).then(response => {
                this.kcList = response.data.rows
            })
        },
        // 新建项目
        handleCreate() {
            this.btnLimt = false
            this.dialogStatus = 'create';
            this.isCanUpdata = true
            this.createFormVisible = true;
            this.form.xmlx = '0';
        },  
        // 修改项目
        handleUpdate(item) {
            let _this = this;
            _this.btnLimt = false;
            _this.uuid = item.uuid;
            _this.dialogStatus = 'update';
            getItem({id: item.uuid,}).then(response => {            
                _this.form = response
                if(_this.xxlm=='007'){                              //职校    
                    _this.form.zykc = []                            //专业
                    _this.form.zykc.push( _this.form.zyid,_this.form.kcid)
                }
                _this.ywzx = _this.form.ywzx ? '1':'0'
                _this.zhdj = String(_this.form.zhdj)
                _this.jflx = String(_this.form.jflx)

                
                if(_this.zhdj=='1'){                     //转化等级0--转化为积分或者是不做换算   1--转化为等级
                    this.jflxsel = '1'
                }else if(_this.zhdj=='0'){
                    if(_this.jflx=='4' || _this.jflx=='5' || _this.jflx=='3'){
                        this.jflxsel = '2'
                    }else{
                        this.jflxsel = '0'
                    }
                }

                if(_this.form.hs && _this.form.hs.length>0){
                    _this.HsRange = []
                    _this.form.hs.forEach(function(item,index){
                        _this.HsRange.push({type:item.type,zdz:item.zdz,zxz:item.zxz,sz:item.xf})
                    })
                }
                if(_this.form.djHs && _this.form.djHs.length>0){
                    _this.HsRange = []
                    _this.form.djHs.forEach(function(item,index){
                        _this.HsRange.push({type:item.type,zdz:item.zdz,zxz:item.zxz,sz:item.djz})
                    })
                }
                _this.createFormVisible = true; 

                if(_this.form.allRwCount>0 || _this.form.childXmCount>0){
                    _this.isCanUpdata = false
                }else{
                    _this.isCanUpdata = true
                }
            }) 
        },
        //表单内容初始化
        dataInit() {
            this.$refs['createform'].resetFields();
            this.uuid = null;
            this.form = {};
            this.ywzx = '0';
            this.jflxsel = '0';
            this.jflx = '0';
            this.isCanUpdata = true
            this.HsRange = [
                {type: 1},{type: 1},{type: 1}
            ]
        },   
        //转化--添加区间
        adddj(){
            let len = this.HsRange.length;
            
            if(this.jflx=='1'){
                this.HsRange.splice(len-1, 0, {
                    type: 1
                });
            }else{
                this.HsRange.splice(len, 0, {
                    type: 1
                });
            }
        },
        //转化--删除区间
        deletedj(index) {
            this.HsRange.splice(index, 1);
        },     
        //转化等级-换算规则添加区间
        addzhdj(){
            let len = this.zhdjHsRange.length;
            this.zhdjHsRange.splice(len, 0, {
                type: 1
            });
        },
        //转化等级-换算规则删除区间
        deletezhdj(index) {
            this.zhdjHsRange.splice(index, 1);
        },
        //有无子项  选择
        ywzxChange(val){
            this.jflxsel = '0';
            this.jflx = '0';
            this.HsRange = [
                {type: 1},{type: 1},{type: 1}
            ]
        },
        // 计分类型 选择
        jflxselChange(val){
            if(val==2){
                this.jflx = '3';
                this.zhdj = '0'
            }else{                
                this.form.hs = null;
                this.form.djHs = null;
                this.jflx = '0'
                if(val == 0) this.zhdj = '0'
                if(val == 1) this.zhdj = '1'
            }  
            this.HsRange=[
                {type: 1},{type: 1},{type: 1}
            ]          
        },
        // 成绩换算change
        jflxChange(val){
            if(val=='1'){             //累积任务数
                this.HsRange=[
                    {type: 0},{type: 1},{type: 2}
                ]
            }else{
                this.HsRange=[
                    {type: 1},{type: 1},{type: 1}
                ]
            }
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
        // 提交按钮
        createSubmit(formName) {
            let _this = this 
            _this.$refs[formName].validate(valid => {
                if (valid) {
                    let unfilled = false                          //提示有未填项
                    let iszhdjbz = false                          //提示请按标准填写等级
                    let isoverlap = false                         //设定的区间有重叠
                    let isoverlapdj = false                       //设定的等级不能相同

                    _this.btnLimt = true
                    _this.form.xn = _this.xnxq.xn 
                    _this.form.xq = _this.xnxq.xq
                    _this.form.xxdm = _this.xxdm
                    _this.form.uuid = _this.uuid
                    _this.form.ywzx = _this.ywzx == 0 ? false : true
                    _this.form.zhdj = Number(_this.zhdj)        //转化等级
                    _this.form.jflx = Number(_this.jflx)        //记分类型 0 成绩换算 1 累计量换算 2 学分 3 等级 4 图文 5 健康   6 阅读   7 加减分                                  

                    //form---njmc+kcmc+zymc 转化   
                    for(let i = 0; i < _this.njList.length; i++) {
                        if(_this.form.njdm == _this.njList[i].njdm) {
                            _this.form.njmc = _this.njList[i].njmc
                            break
                        }
                    }
                    _this.form.kcid =  _this.form.zykc?_this.form.zykc[1]:this.form.kcid;
                    _this.form.zyid =  _this.form.zykc?_this.form.zykc[0]:undefined;

                    for(let j = 0; j < _this.kcList.length; j++) {
                        if(_this.form.kcid == _this.kcList[j].uuid) {
                            _this.form.kcmc = _this.kcList[j].kcmc
                            break
                        }
                    }
                    for(let i = 0; i < _this.zyList.length; i++) {
                        if(_this.form.zyid == _this.zyList[i].uuid) {
                            _this.form.zymc = _this.zyList[i].mc
                            break
                        }
                    }

                    if(_this.form.jflx == 7){       //加减分--规则基准值
                        if(_this.form.jzz==undefined){
                            unfilled = true
                        }
                        if(!(/^([0-9]*)?$/.test(_this.form.jzz))){
                            _this.btnLimt = false;
                            _this.tipsXX("基准值是在0~500之间的整数",'warning');
                            return false
                        } 
                    }

                    if(_this.jflxsel!=2 && ((_this.form.ywzx && _this.form.zhdj==1) || !_this.form.ywzx)){           //非保留原始数据 + 有子项且转化等级
                        _this.HsRange.forEach(function(item, index){                       //先判断有没有为空的
                            if(!item.sz){
                                if(item.type==1&&(!item.zxz || !item.zdz)){
                                    unfilled = true
                                }
                                if(item.type==0&&!item.zxz){
                                    unfilled = true
                                }
                                if(item.type==2&&!item.zdz){
                                    unfilled = true
                                }                            
                            }
                        })
                        if(!unfilled){
                            var szmax= 0
                            _this.HsRange.forEach(function(item, index){     
                                if(szmax<Number(item.zdz)){
                                    szmax = Number(item.zdz)
                                }                                
                                if( _this.form.zhdj==0 && (!(/^([0-9]*)+(.[0-9]{1,2})?$/.test(item.sz)) || Number(item.sz)>999)){
                                    console.log("33")
                                    iszhdjbz = true
                                    return false
                                } 
                                if( _this.form.zhdj==1 && (item.sz != 'A' && item.sz != 'B' && item.sz != 'C' && item.sz != 'D')){
                                    console.log("44")
                                    iszhdjbz = true
                                    return false
                                } 
                                if(_this.jflx!=1){              //非累积量
                                    if(!(/^([0-9]*)+(.[0-9]{1,2})?$/.test(item.zdz)) || !(/^([0-9]*)+(.[0-9]{1,2})?$/.test(item.zxz))){ //区间是否为数字且两位小数点
                                        console.log("22")   
                                        iszhdjbz = true
                                        return false
                                    }
                                    if(Number(item.zdz)<=Number(item.zxz) || Number(item.zdz)>500 || Number(item.zxz)>500){ //最小值<最大值  且值在1-100
                                        console.log("00") 
                                        iszhdjbz = true
                                        return false
                                    }
                                }  
                                if(_this.jflx==1){              //累积量
                                    if(item.type==0){           //以上
                                        item.zdz = 99999
                                        if(!(/^([0-9]*)?$/.test(item.zxz)) || Number(item.zxz)>500){
                                            iszhdjbz = true
                                            return false
                                        }
                                    }
                                    if(item.type==1){           //区间
                                        if((!(/^([0-9]*)?$/.test(item.zxz)) && !(/^([0-9]*)?$/.test(item.zdz))) || Number(item.zdz)<=Number(item.zxz) || Number(item.zdz)>500 || Number(item.zxz)>500){
                                            iszhdjbz = true
                                            return false
                                        }
                                    }
                                    if(item.type==2){           //以下
                                        item.zxz = 0
                                        if(!(/^([0-9]*)?$/.test(item.zdz)) || Number(item.zdz)>500){
                                            iszhdjbz = true
                                            return false
                                        }
                                    }
                                }
                                
                            })
                            _this.HsRange.forEach(function(item, index){
                                _this.HsRange.forEach(function(over, ind){
                                    if(ind != index){
                                        if(Number(item.zxz)>=Number(over.zxz) && Number(item.zxz)<=Number(over.zdz)){ //区间不能有重叠
                                            isoverlap = true
                                            return false
                                        }
                                        if(_this.jflxsel==1 && item.sz==over.sz){               //等级不能相同
                                            isoverlapdj = true
                                            return false
                                        }
                                    }
                                })

                            })
                            if(_this.form.jflx == 7){       //加减分--规则基准值
                                if(_this.form.jzz>szmax){
                                    _this.btnLimt = false;
                                    _this.tipsXX("基准值大于最高值"+szmax,'warning','提示');
                                    return false
                                }

                            }
                        }
                        if(_this.form.zhdj==0){       //原始数据换算成积分
                            _this.form.hs = []
                            _this.HsRange.forEach(function(item, index){ 
                                if(item.type==0) _this.form.hs.push({type:item.type,zxz:Number(item.zxz),xf:Number(item.sz)})
                                if(item.type==1) _this.form.hs.push({type:item.type,zxz:Number(item.zxz),zdz:Number(item.zdz),xf:Number(item.sz)})
                                if(item.type==2) _this.form.hs.push({type:item.type,zdz:Number(item.zdz),xf:Number(item.sz)})
                            })
                        }
                        if(_this.form.zhdj==1){       //原始数据换算成等级
                            _this.form.djHs = []
                            _this.HsRange.forEach(function(item, index){
                                if(item.type==0) _this.form.djHs.push({type:item.type,zxz:Number(item.zxz),djz:item.sz})
                                if(item.type==1) _this.form.djHs.push({type:item.type,zxz:Number(item.zxz),zdz:Number(item.zdz),djz:item.sz})
                                if(item.type==2) _this.form.djHs.push({type:item.type,zdz:Number(item.zdz),djz:item.sz})
                            })
                        }
                        
                    }

                    //提示信息
                    if(unfilled){                               //未填项
                        _this.btnLimt = false;
                        _this.tipsXX("有未填项",'warning','提示');
                        return false
                    }
                    if(iszhdjbz){                               //按标准填写等级--转化等级的换算规则
                        _this.btnLimt = false;
                        _this.tipsXX("请按标准填写换算规则",'warning','提示');
                        return false
                    }
                    if(isoverlap){                               //设定的区间有重叠
                        _this.btnLimt = false;
                        _this.tipsXX("设定的区间有重叠",'warning','提示');
                        return false
                    }
                    if(isoverlapdj){                               //等级不能相同
                        _this.btnLimt = false;
                        _this.tipsXX("等级不能相同",'warning','提示');
                        return false
                    }             
                    //表单提交
                    switch(_this.dialogStatus) {
                        //更新
                        case 'update':
                            updateItem({
                                id: _this.uuid,info: _this.form,
                            }).then(() => {
                                _this.createFormVisible = false;
                                _this.dataInit();
                                _this.getList();
                                _this.tipsXX("修改成功",'success','成功');
                            }).catch(()=>{
                                setTimeout(function(){
                                    _this.btnLimt = false;
                                },1500);
                            })
                            break;
                        //创建    
                        case 'create':
                            createItem(_this.form).then(() => {
                                _this.createFormVisible = false;
                                _this.dataInit();
                                _this.formSearch={}
                                this.listQuery.zyIds =  '';
                                this.listQuery.kcIds =  '';
                                this.listQuery.njdms = '';
                                _this.getList();
                                _this.tipsXX("创建成功",'success','成功');
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
        // 取消按钮
        createCancel() {
            this.createFormVisible = false;
            this.dataInit();
        },        
        //进入子项目 或是 项目详情
        handleView(item) {
            window.localStorage.setItem('xmlx',item.xmlx);
            window.localStorage.setItem('xxlm',this.xxlm);
            if(item.ywzx == true) {
                window.localStorage.setItem('fjxmId',item.uuid);
                window.localStorage.setItem('fjzhdj',item.zhdj);
                this.$router.push({
                    path: '/projectManager/sonProject', 
                })
            }else {
                window.localStorage.setItem('xmid',item.uuid);
                this.$router.push({
                    path: '/projectManager/projectDetail', 
                })
            }            
        },
        //删除项目
        handleDelete(item) {
            let tishiMessage = undefined
            if(item.zxmsl > 0) {
                tishiMessage = '该项目包含子项目，请先删除子项目'
            }else if(item.rwsl > 0) {
                tishiMessage = '该项目包含任务，请先删除任务'
            }
            if(tishiMessage) {
                this.$confirm(tishiMessage, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })  
            }else {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delItem({
                        id: item.uuid,
                    }).then(() => {
                        this.tipsXX("删除成功",'success','成功');
                        this.getList()
                    });
                });
            } 
        },
        //  创建副本
        handleCopy(item){
            const h = this.$createElement;
            this.$msgbox({
                title: '创建副本',
                message: h('div', null, [
                    h('div', { style: 'padding: 10px 0; text-align: center;' } , '你确定要复制项目【'+item.mc+'】吗?'),
                    h('div', { style: 'color: #E51C23; text-align: center; padding: 10px 0;' }, '注意事项：副本所有的设置保持不变，但数据会清零')
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '创建中...';
                        getCopy({id: item.uuid}).then(response => { 
                            done();
                            instance.confirmButtonLoading = false;
                            this.tipsXX("创建副本成功",'success','成功');
                            this.getList()
                        })
                    } else {
                        done();
                    }
                }
            }).then(action => {});
            
        },
        // 设置权重取消按钮
        qzCancel(){
            this.xmqzFormVisible = false
        },
        // 设置权重
        handleSetqz(item){
            this.createFormVisible = false 
            var that = this
            this.xmqzFormVisible = true
            getQzInfo({id: item.uuid}).then(response => { 
                this.XmqzRes = response
                var newobj = []                
                this.alreadysetqz = []                                  //已设置过的权重
                if(item.ywzx){              //有无子项
                    this.XmqzList = response.childXmQzSettingList;
                    newobj = response.ysChildXmQzSettingList
                    if(this.XmqzList && this.XmqzList.length>0){     
                        this.XmqzList.forEach(function(list,ind){
                            if(list.ysRwQzSettingList && list.ysRwQzSettingList.length>0){
                                list.ysRwQzSettingList.forEach(function(rw,indrw){
                                    that.$set(rw,'jsfsbm',rw.jsfs)
                                    if(rw.jsfs=='0'){
                                        rw.jsfsbm =''
                                    }
                                })
                            }else{
                                if(list.rwQzSettingList && list.rwQzSettingList.length>0){
                                    var pushitem = list.rwQzSettingList[0]
                                    list.ysRwQzSettingList.push(pushitem)
                                }
                            }
                        })
                    }
                }else{
                    this.XmqzList = response.rwQzSettingList;
                    newobj =  response.ysRwQzSettingList                     
                }
                if(newobj && newobj.length>0){
                    newobj.forEach(function(list,ind){
                        that.$set(list,'jsfsbm',list.jsfs)
                        if(list.jsfs=='0'){
                            list.jsfsbm =''
                        }
                        that.alreadysetqz.push(list)
                    })
                }else{
                    if(this.XmqzList && this.XmqzList.length>0){
                        that.alreadysetqz.push(this.XmqzList[0])
                    }
                }
            })
        },
        //保存权重
        setXmqzSure(){
            var data = this.alreadysetqz
            var query = []
            var that = this
            var isZero = false    
            var isbfb = false      
            var isqzcs = false  
            var isSame = false        //名称相同
            var sameName = ''
            this.btnLimt = true
            query.push({uuid:this.XmqzRes.uuid,mc:this.XmqzRes.mc,qzList:[]})

            if(data && data.length>0){
                data.forEach(function(item,index){
                    if(that.XmqzRes.ywzx){                  //有子项
                        item.qzlx = 0
                    }else{
                        item.qzlx = 1
                    }
                    item.jsfs = item.jsfsbm==''? 0 : item.jsfsbm

                    that.XmqzList.forEach(function(xmit,ind){
                        if(item.uuid == xmit.uuid){
                            item.mc = xmit.mc
                        }
                    })
                    
                    data.forEach(function(same,indsame){
                        if(index != indsame && item.uuid == same.uuid){
                            isSame = true
                            sameName = that.XmqzRes.mc
                        }                        
                    })
                    if(item.jsfs==2 && item.qzbfb==0){           //除以--不能为 0 
                        isZero = true
                    }
                    if(item.qzbfb<0 || item.qzbfb>100 || !(/^([0-9]*)+(.[0-9]{1,2})?$/.test(item.qzbfb))){
                        isbfb = true
                    }
                    if(item.qzcs<0 || item.qzcs>100 || !(/^([0-9]*)?$/.test(item.qzcs))){
                        isqzcs = true
                    }

                    query[0].qzList.push(item)
                })
            }   
            if(this.XmqzRes.ywzx){
                if(this.XmqzList && this.XmqzList.length>0){
                    this.XmqzList.forEach(function(item,index){
                        var allrw = item.rwQzSettingList
                        var surerw = item.ysRwQzSettingList
                        query.push({uuid:item.uuid,mc:item.mc,qzList:[]})
                        if(allrw && allrw.length>0){
                            if(surerw && surerw.length>0){                            
                                surerw.forEach(function(rw,ind){
                                    rw.jsfs = rw.jsfsbm==''? 0 : rw.jsfsbm
                                    rw.qzlx = 1
                                    allrw.forEach(function(al,indal){
                                        if(rw.uuid == al.uuid){
                                            rw.mc = al.mc
                                        }
                                    })
                                    surerw.forEach(function(same,indsame){
                                        if(ind != indsame && rw.uuid == same.uuid){
                                            isSame = true
                                            sameName = item.mc
                                        }                        
                                    })
                                    if(rw.jsfs==2 && rw.qzbfb==0){           //除以--不能为 0 
                                        isZero = true
                                    }
                                    if(rw.qzbfb<0 || rw.qzbfb>100 || !(/^([0-9]*)+(.[0-9]{1,2})?$/.test(rw.qzbfb))){
                                        isbfb = true
                                    }
                                    if(rw.qzcs<0 || rw.qzcs>100 || !(/^([0-9]*)?$/.test(rw.qzcs))){
                                        isqzcs = true
                                    }
                                    query[index+1].qzList.push(rw)
                                })
                            }
                        }
                    })
                }
            }

            if(isZero){
                this.btnLimt = false;
                this.tipsXX("除数不能为0",'warning','提示');
                return false
            }
            if(isbfb){
                this.btnLimt = false;
                this.tipsXX("百分比范围为0-100%，允许两位小数",'warning','提示');
                return false
            }
            if(isqzcs){
                this.btnLimt = false;
                this.tipsXX("权重系数范围为0-100整数",'warning','提示');
                return false
            }
            if(isSame){
                this.btnLimt = false;
                this.tipsXX("【"+sameName+"】设置了重复权重",'error','错误');
                return false
            }

            AddBatchQz(query).then(response => {             
                this.btnLimt = false           
                this.tipsXX("保存成功",'success','成功');
                this.xmqzFormVisible = false
            })
        },
        // 取消权重
        setXmqzCancel(){
            this.btnLimt = false         
            this.xmqzFormVisible = false

        },
        // 添加加数
        xmqzAdd(data){
            data.push({})
        },
        // 删除加数        
        closesetqz(data,item){
            const index = data.indexOf(item);
            data.splice(index, 1);
        },

        // 评分标准
        handleSetpfbz(item){
            let _this = this;
            _this.btnLimt = false;
            _this.uuid = item.uuid
            getItem({id: item.uuid}).then(response => {   
                this.pfbz = response.bz
                _this.pfbzDialogVisible = true; 
                
            })
        },
        pfbzSubmit(){
            var data={
                xmId:this.uuid,
                bz:this.pfbz
            }
            this.btnLimt = true
            if(!this.pfbz){
                this.tipsXX("请填写内容",'error','错误');
                this.btnLimt = false
                return false
            }
            if(this.pfbz.length>1000){
                this.tipsXX("评分标准不得超过1000个字",'error','错误');
                this.btnLimt = false
                return false
            }

            putBz(data).then(response => {   
                this.btnLimt = false
                this.tipsXX("修改成功",'success','成功');
                this.pfbzDialogVisible = false; 
                
            })
        },
        pfbzCancel(){
            this.pfbz = ''
            this.pfbzDialogVisible = false; 
        },


    }
};
</script>

<style scoped lang="scss">
    .right {
        float: right;
    }
    .partbox-card{
        position: relative;
        margin-bottom: 20px; 
        width: 80%;
        min-width: 680px;
    }   
    .partkn{
        height: 40px;
        .card-kcmc{ 
            float: left;
            margin-right: 10px;
        }
    }
    .partcon{
        margin: 0 -10px;
    }
    .box-card {
        position: relative;
        cursor: pointer;
        width: 300px;
        height: 165px;
        float: left;
        margin: 0 10px 20px;
        
        .card-mask{
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background: rgba(255, 255, 255, .95);
            z-index: 1;
            padding: 0 20px;
            div{
                margin: 10px 0;
                .kzbtn{ width: 100%;}
                .kzbtn-cen{
                    width: 122px;
                }
            }
        }
        :hover .card-mask {
            display: block;
        }
        :hover .card-btn {
            display: block;
        }
        .card-btn {
            display: none;
            .delete-btn {
                margin-left: 10px; 
            }
        }
        .card-title {
            font-size: 20px;
            margin-bottom: 20px;   
        }
        .card-tag {
            margin-bottom: 16px;     
        }
        .card-desc {
            color: #606266;
            font-size: 16px;
            margin-bottom: 25px;  
            .desc-son {

                color: #909399;
            }
        }
    }

    .menu-btn {
        position: fixed;
        bottom: 60px;
        right: 52px;
        width: 70px;
        z-index: 2;
        .create-btn {
            width: 70px;
            height: 70px;
            font-size: 30px;
        }
        .search-btn {
            width: 70px;
            height: 70px;
            margin-top: 20px;
            font-size: 30px;
            &.search-btn-setpjqz{
                font-size:12px;
                line-height: 16px;
                white-space: initial;
                padding: 0 10px;
            }
        }
        
    }

    .searchWrapper {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: 0;
        z-index: 2001;
        background: rgba(33,33,33,0.5);
        .searchKeyBox {
            overflow-y: scroll;
            overflow-x: hidden;
            height: 100%;
            width: 300px;
            background: white;
            float: right;
            .searchKey {
                line-height: 40px;
            }
            .searchKeyDetail {
                .searchKeyItem {
                    padding: none;
                    // margin-bottom: 5px;
                    .select-item{
                        border: none;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                    }
                }
                
            }
        }
    }
    
    .hsItem {
        margin-bottom: 10px;
        .dashed{
            float: left;
            border: 1px dashed #ccc;
            padding: 0 10px;
            margin-right: 10px;
        }
        .hsInput {
            width: 120px;
            margin: 0 10px;
        }
        .hsInputmini {
            width: 105px;
            margin: 0 10px;
        }
    }
    .dashdiv{
        border: 1px dashed #ccc;
        padding: 0 10px;
        width: 600px;
    }
    .tipsbtn{
        color: red; margin-left: 5px;
    }
    .exptips{
        margin-bottom: 11px;
        line-height: 40px;
        color: #999;
    }
    .setqz{
        color: #3F51B5;
        margin-left: 10px;
        cursor: pointer;
    }
    .baseval{
        margin-bottom: 11px;
    }    
    .empty{
        font-size: 16px;
        color: #666;
        text-align: center;
    }
    .dialogprog{
        .exptips{
            border-bottom: 1px solid #ccc;
            width: 600px;
        }
    }
    .layXmqz_setLi{
        min-width: 880px;
        color: #101010;
        .Xmqz_setTit{
            float: left;
            width: 150px;
            .xmmc{
                text-align: center;
                font-size: 24px; line-height: 40px; padding-top: 11px;
            }
            .xmtype{
                font-size: 14px;
                text-align: center;
            }
        }
        .signalg{
            float: left; line-height: 40px; width: 30px; text-align: center; padding-top: 11px;
        }
        .part{ 
            position: relative;
            margin-left: 180px
        }
        .border{ 
            border: 1px dashed #bbb;
            height: 62px; padding: 10px;
            float: left;
        }
        .Xmqz_setItem{
            display: inline-block;
            .border{
                cursor: pointer;
                width: 430px;
                position: relative;
                .signalg{
                    padding-top: 0;
                }
                .el-icon-close{
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    font-size: 20px;
                    display: none;
                }
            }
            .border:hover{
                .el-icon-close{
                    display: block;
                } 
            }
            .rowsel{
                float: left; width: 110px;
            }
            .rowsign{
                float: left; width: 100px;
            }
            .rowinpapp{
                float: left; width: 92px;
            }
            .rowinp{
                float: left; width: 72px;
            }
        }
        .Xmqz_setAdd{
            display: inline-block;
            cursor: pointer;
            .border{
                width: 120px;
                i{
                    font-size: 28px;  line-height: 40px; float: left;
                }
                span{                    
                    line-height: 40px; float: left; margin-left: 10px;
                } 
            }
        }
        .ysfh-jsfs{
            width: 88px;
            margin: 0 auto;
            display: block;
            margin-top: 4px;
        }
    }
    .setqzTop{
        .name{
            float: left; margin-right: 10px; line-height: 40px; font-size: 18px;
        }
        .exptips{
            float: left; color: #5C97CA;
        }
    }
    .contain-setqz{
        .center-footer{
            text-align: center; padding: 20px 0;
        }
    }
</style>
<style>
    .dialogprog .el-radio-group label{
        margin: 0 10px 10px 0;
    }    
    .el-radio.is-bordered+.el-radio.is-bordered{ 
        margin-left: 0;
    }
    .rowinpapp .el-input-group__append{ padding: 0 5px;}

</style>



