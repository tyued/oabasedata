<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input placeholder="请输入内容" @keyup.enter.native="handleFilter" v-model="listQuery[searchsel]" class="input-with-select"  style="width: 400px;" >
                <el-select v-model="searchsel" slot="prepend" @change="searchChange" placeholder="请选择" style="width:120px; height:38px; margin:0 auto;">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="学号" value="xh"></el-option>
                    <el-option label="姓名" value="xm"></el-option>
                </el-select>
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="学号" width="170">
                <template slot-scope="scope">
                    <span>{{scope.row.xh}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="姓名" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.xm}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="性别" width="100">
                <template slot-scope="scope">
                    <span>{{(scope.row.xbm=='1')?'男':'女'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="年级" width="140">
                <template slot-scope="scope">
                    <span>{{scope.row.njmc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级" width="140">
                <template slot-scope="scope">
                    <span>{{scope.row.bjmc}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="用户名">
                <template slot-scope="scope">
                    <span>{{scope.row.xxdm}}{{scope.row.xh}}</span>
                </template>
            </el-table-column>
          <el-table-column align="center" label="联系方式">
            <template slot-scope="scope">
              <span>{{scope.row.sjhm}},{{scope.row.sjhm2}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="监护人">
            <template slot-scope="scope">
              <span>{{scope.row.jhr}}</span>
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
        <el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" width="700px" >
            <el-form :model="form" ref="form"  label-width="100px" style="padding-right:10%;">
                <el-tabs :tab-position="tabPosition" style="min-height: 560px;">
                    <el-tab-pane label="基本信息">
                        <el-form-item label="姓名" size="small"  prop="xm" :rules="[{ required: true, message: '姓名不能为空'}]">
                            <el-input v-model="form.xm" placeholder="请输入学生姓名" ></el-input>
                        </el-form-item>
                        <el-form-item label="学号" size="small"  prop="xh" :rules="[{ required: true, message: '学号不能为空'}]">
                            <el-input v-model="form.xh"  placeholder="请输入学号" :disabled="(dialogStatus=='create')?false:true"></el-input>
                        </el-form-item>
                        <el-form-item label="学籍号" size="small">
                            <el-input v-model="form.xjh"></el-input>
                        </el-form-item>
                        <el-form-item label="证件名称" size="small">
                            <el-select v-model="form.sfzjlxm" placeholder="请选择" disabled>
                                <el-option v-for="item in dictionary.zjmc" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="证件号码" size="small"  prop="sfzjh">
                            <el-input v-model="form.sfzjh"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" size="small">
                            <el-radio-group v-model="form.xbm">
                                <el-radio label="1">男</el-radio>
                                <el-radio label="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="当前年级" size="small">
                            <el-select v-model="form.njid" placeholder="请选择">
                                <el-option v-for="item in dictionary.grade" :key="item.njdm" :label="item.njmc" :value="item.njdm"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="当前班级" size="small" prop="bjid" :rules="[{ required: true, message: '当前班级不能为空',traggle:'change'}]">
                            <el-select v-model="form.bjid" placeholder="请选择">
                                <el-option v-for="item in dictionary.class" :key="item.uuid" :label="item.bj" :value="item.uuid"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="班内编号" size="small">
                            <el-input v-model="form.bnbh"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" size="small" required>
                            <el-input v-model="form_mm"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="详细信息">
                        <el-form-item label="姓名拼音" size="small">
                            <el-input v-model="form.xmpy"></el-input>
                        </el-form-item>
                        <el-form-item label="英文姓名" size="small">
                            <el-input v-model="form.ywxm"></el-input>
                        </el-form-item>
                        <el-form-item label="曾用名" size="small">
                            <el-input v-model="form.cym"  placeholder="" ></el-input>
                        </el-form-item>
                        <el-form-item label="民族" size="small">
                            <el-select v-model="form.mzm" placeholder="请选择">
                                <el-option v-for="item in dictionary.mz" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出生日期" size="small">
                            <el-date-picker type="date" v-model="form.csrq" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="form_pickerOp"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="出生地" size="small">
                            <el-cascader :options="dictionary.jg" v-model="opation_csdm" :props="form_props"></el-cascader>
                        </el-form-item>
                        <el-form-item label="政治面貌" size="small">
                            <el-select v-model="form.zzmmm" placeholder="请选择">
                                <el-option v-for="item in dictionary.zzmm" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="健康状况" size="small">
                            <el-select v-model="form.jkzkm" placeholder="请选择">
                                <el-option v-for="item in dictionary.jkzk" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="宗教信仰" size="small">
                            <el-select v-model="form.xyzjm" placeholder="请选择">
                                <el-option v-for="item in dictionary.zjxy" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="血型" size="small">
                            <el-select v-model="form.xxm" placeholder="请选择">
                                <el-option v-for="item in dictionary.xuexing" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="学生类别" size="small">
                            <el-select v-model="form.xslbm" placeholder="请选择">
                                <el-option v-for="item in dictionary.xslb" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="卡号信息">
                        <el-form-item label="义教卡号" size="small">
                            <el-input v-model="opation_kp[0]"></el-input>
                        </el-form-item>
                        <el-form-item label="一卡通号1" size="small">
                            <el-input v-model="opation_kp[1]"></el-input>
                        </el-form-item>
                        <el-form-item label="一卡通号2" size="small">
                            <el-input v-model="opation_kp[2]"></el-input>
                        </el-form-item>
                        <el-form-item label="一卡通号3" size="small">
                            <el-input v-model="opation_kp[3]"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="入学信息">
                        <el-form-item label="入学年月" size="small">
                            <el-date-picker type="month" v-model="form.rxny" value-format="yyyy-MM" :picker-options="form_pickerOp" placeholder="选择日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="入学学年" size="small">
                            <el-select v-model="form.rxxn" placeholder="请选择">
                                <el-option v-for="item in dictionary.rxxn" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="入学学期" size="small">
                            <el-select v-model="form.rxxq" placeholder="请选择">
                                <el-option v-for="item in dictionary.term" :key="item.uuid" :label="item.xqmc" :value="item.uuid"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="入学方式" size="small">
                            <el-select v-model="form.rxfsdm" placeholder="请选择">
                                <el-option v-for="item in dictionary.rxfs" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="毕业学校" size="small">
                            <el-input v-model="form.byyey"></el-input>
                        </el-form-item>
                        <el-form-item label="入学成绩" size="small">
                            <el-input v-model="form.rxcj"></el-input>
                        </el-form-item>
                        <el-form-item label="来源地（生源地）" size="small">
                            <el-cascader :options="dictionary.jg" v-model="opation_lyd" :props="form_props"></el-cascader>
                        </el-form-item>
                        <el-form-item label="就读方式" size="small">
                            <el-select v-model="form.jdfs" placeholder="请选择">
                                <el-option label="正常入学" value="01"></el-option>
                                <el-option label="走读" value="02"></el-option>
                                <el-option label="住校" value="03"></el-option>
                                <el-option label="借宿" value="04"></el-option>
                                <el-option label="其他" value="05"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="中招序号" size="small">
                            <el-input v-model="form.zzxh"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="户籍信息">
                        <el-form-item label="籍贯" size="small">
                            <el-cascader :options="dictionary.jg" v-model="opation_jg" :props="form_props"></el-cascader>
                        </el-form-item>
                        <el-form-item label="国籍" size="small">
                            <el-select v-model="form.gjdqm" placeholder="请选择">
                                <el-option v-for="item in dictionary.gj" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="港澳台侨外" size="small">
                            <el-select v-model="form.gatqwm" placeholder="请选择">
                                <el-option v-for="item in dictionary.gatqw" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="户口类别" size="small">
                            <el-radio-group v-model="form.hkxzm">
                                <el-radio label="2">非农户口</el-radio>
                                <el-radio label="1">农业户口</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="户口外省" size="small">
                            <el-radio-group v-model="form.hkws">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="所在地" size="small">
                            <el-cascader :options="dictionary.jg" v-model="opation_szd" :props="form_props"></el-cascader>
                        </el-form-item>
                        <el-form-item label="镇/街道" size="small">
                            <el-input v-model="form.hkjd"></el-input>
                        </el-form-item>
                        <el-form-item label="社区" size="small">
                            <el-input v-model="form.hksq"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" size="small">
                            <el-input type="textarea" v-model="form.hkbz" placeholder="不超过50个字"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="联系方式">
                        <el-form-item label="监护人" size="small">
                            <el-input v-model="form.jhr"></el-input>
                        </el-form-item>
                        <el-form-item label="监护人关系" size="small">
                            <el-select v-model="form.jhrgxdm" placeholder="请选择">
                                <el-option v-for="item in dictionary.jhrgx" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="监护人手机" size="small">
                            <el-input v-model="form.jgrsj"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码" size="small">
                            <el-input v-model="form.sjhm"></el-input>
                        </el-form-item>
                        <el-form-item label="家庭电话" size="small">
                            <el-input v-model="form.lxdh"></el-input>
                        </el-form-item>
                        <el-form-item label="电子邮箱" size="small">
                            <el-input v-model="form.dzxx"></el-input>
                        </el-form-item>
                        <el-form-item label="家庭地址" size="small">
                            <el-input v-model="form.xzz"></el-input>
                        </el-form-item>
                        <el-form-item label="邮政编号" size="small">
                            <el-input v-model="form.yzbm"></el-input>
                        </el-form-item>
                        <el-form-item label="个人主页" size="small">
                            <el-input v-model="form.zydz"></el-input>
                        </el-form-item>
                        <el-form-item label="QQ号码" size="small">
                            <el-input v-model="form.qq"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- <el-tab-pane label="家庭成员">
                        <el-table :key='tableKey' :data="familyList" border fit highlight-current-row style="width: 100%">
                            <el-table-column label="姓名">
                                <template slot-scope="scope">
                                    <span>{{scope.row.bjmc}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column v-for="item in kcList" :key="item.kcid" :label="item.kcmc">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row[item.kcid].rkjsgh" clearable placeholder="" @change="handleChange(item.kcid,scope.row[item.kcid].rkjsgh,scope.$index)">
                                        <el-option v-for="item in jsList" :key="item.gh" :label="item.xm" :value="item.gh"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane> -->
                    <el-tab-pane label="其他信息">
                        <el-row :gutter="15">
                            <el-col :span="12">
                                 <el-form-item label="是否独生子女" size="small">
                                    <el-radio-group v-model="form.dsznbz">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否本地生源" size="small">
                                    <el-radio-group v-model="form.sfbdsy">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="15">
                            <el-col :span="12">
                                <el-form-item label="是否留守儿童" size="small">
                                    <el-radio-group v-model="form.sflset">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否流动人口" size="small">
                                    <el-radio-group v-model="form.sfldrk">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="15">
                            <el-col :span="12">
                                <el-form-item label="是否民工子女" size="small">
                                    <el-radio-group v-model="form.sfmgzn">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="接受学前教育" size="small">
                                    <el-radio-group v-model="form.jsxqjy">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="特长" size="small">
                            <el-input type="textarea" v-model="form.tc" placeholder="不超过50个字"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" size="small">
                            <el-input type="textarea" v-model="form.bz" placeholder="不超过50个字"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-form-item>
                        <el-button @click="cancel('form')">取 消</el-button>
                        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定</el-button>
                        <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
                    </el-form-item>
                </el-tabs>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import {
    studentAll,
    stuXspage,
    getObj,
    putObj,
    addObj,
    delObj
} from 'api/admin/student/index'
import {
    page
} from 'api/admin/acadyear/index'
import {
    termpage
} from 'api/admin/term/index'
import {
    gradepage
} from 'api/admin/grade/index'
import {
    classpage
} from 'api/admin/class/index'
import { mapGetters } from 'vuex';

export default {
    name: 'teach',
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

            dialogFormVisible: false,               //弹层是否显示
            dialogStatus: '',
            textMap: {                              //判断弹层是添加还是编辑
                update: '编辑',
                create: '创建'
            },
            tabPosition:'left',
            form:{},                                 //表单


            dictionary:{                            //通用字典表
                jg:[],mz:[],zjmc:[],zzmm:[],hyzk:[],campusdata:[],gwzw:[],js:[],
                bm:[]                               //部门----为了级联
            },
            form_pickerOp:{                         //出生日期
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            form_props:{
                value:'id',
                label:'text',
                children:'children'
            },
            opation_jg:[],                  //籍贯--传参要求是字符串、所得是数组要转化
            opation_csdm:[],                //出生地
            opation_lyd:[],                 //生源地
            opation_szd:[],                 //所在地
            xn_listQuery: {                 //学年
                page: 1,
                limit: 50,
            },
            familyList:[],                  //家庭成员
            form_mm:'',
            opation_kp:{},

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
        this.getDictJson();
        this.getList();
        this.getacdYear();
    },
    watch:{
        dict(){
            this.getDictJson();
        }
    },
    methods:{
        getList() {
            this.listLoading = true;
            this.listQuery.xxdm = this.xxdm;
            stuXspage(this.listQuery).then(response => {
                this.list = response.data.rows;
                this.total = response.data.total;
                this.listLoading = false;
            })
        },
        getDictJson(){
            this.dictionary.jg = this.$store.getters.dict_jg;           //籍贯
            this.dictionary.mz = this.$store.getters.dict_mz;           //民族
            this.dictionary.zjmc = this.$store.getters.dict_zjmc;       //证件名称
            this.dictionary.zzmm = this.$store.getters.dict_zzmm;       //政治面貌
            this.dictionary.hyzk = this.$store.getters.dict_hyzk;       //婚姻状况
            this.dictionary.gwzw = this.$store.getters.dict_gwzw;       //岗位职务
            this.dictionary.jkzk = this.$store.getters.dict_jkzk;       //健康状况
            this.dictionary.gj = this.$store.getters.dict_gj;           //国籍
            this.dictionary.gatqw = this.$store.getters.dict_gatqw;     //港澳台侨胞
            this.dictionary.zjxy = this.$store.getters.dict_zjxy;       //宗教信仰
            this.dictionary.xuexing = this.$store.getters.dict_xuexing; //血型
            this.dictionary.xslb = this.$store.getters.dict_xslb;       //学生类别
            this.dictionary.rxfs = this.$store.getters.dict_rxfs;       //入学方式
            this.dictionary.jhrgx = this.$store.getters.dict_jhrgx;     //监护人关系
        },
        getacdYear(){                           //学年
            this.xn_listQuery.xxdm = this.xxdm;
            page(this.xn_listQuery).then(response => {
                var year = response.data.rows;
                var rxxn = []
                this.dictionary.term = response.data.rows
                for(var i=0;i<year.length;i++){
                    rxxn[i] =  year[i].xn
                }
                this.dictionary.rxxn = _.uniq(rxxn)
            })
            gradepage(this.xn_listQuery).then(response => {
                this.dictionary.grade = response.data.rows
                console.log(this.dictionary.grade)
            })
            classpage(this.xn_listQuery).then(response => {
                this.dictionary.class = response.data.rows
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
                xbm : "1",
                sfzjlxm :'1',       //默认身份证件为居民身份证
                hkxzm : '2',        //户口
                hkws: '0',          //户口外省
                dsznbz : "1",       //独生子女
                sfbdsy : "1",       //本地生源
                sflset : '0',       //留守儿童
                sfldrk : '0',       //流动人口
                sfmgzn : '0',       //民工子女
                jsxqjy : '1',       //学前教育
            };
            this.form_mm = "888888";
            this.changeSure = false;
        },
        //编辑
        handleUpdate(row) {
            this.changeSure = false;
            getObj(row.uuid).then(response => {
                this.form = response.data;
                this.form.sfzjlxm = '1';
                this.form_mm = "******";
                if(!this.form.xbm) this.form.xbm = "1";
                if(!this.form.sfzjlxm) this.form.sfzjlxm='1';
                if(!this.form.hkxzm) this.form.hkxzm='2';
                if(!this.form.hkws) this.form.hkws='0';
                if(!this.form.dsznbz) this.form.dsznbz='1';
                if(!this.form.sfbdsy) this.form.sfbdsy='1';
                if(!this.form.sflset) this.form.sflset='0';
                if(!this.form.sfldrk) this.form.sfldrk='0';
                if(!this.form.sfmgzn) this.form.sfmgzn='0';
                if(!this.form.jsxqjy) this.form.jsxqjy='1';
                this.opation_csdm=this.form.csdm ? this.form.csdm.split(',') : [];          //出生地
                this.opation_jg = this.form.jg ? this.form.jg.split(',') : [];          //籍贯
                this.opation_lyd = this.form.lyd ? this.form.lyd.split(',') : [];          //生源地
                this.opation_szd = this.form.hkszd ? this.form.hkszd.split(',') : [];          //所在地

                // 卡号
                if(this.form.kp){
                    this.opation_kp[0] = this.form.kp[0] ? this.form.kp[0] : ''
                    this.opation_kp[1] = this.form.kp[1] ? this.form.kp[1] : ''
                    this.opation_kp[2] = this.form.kp[2] ? this.form.kp[2] : ''
                    this.opation_kp[3] = this.form.kp[3] ? this.form.kp[3] : ''
                }else{
                    this.opation_kp[0]='';
                    this.opation_kp[1]='';
                    this.opation_kp[2]='';
                    this.opation_kp[3]='';
                }
                this.dialogFormVisible = true;
                this.dialogStatus = 'update';
                // console.log(this.form)
            });
        },
        // 取消按钮
        cancel(formName) {
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
        },
        // 编辑页面
        update(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.changeSure = true;
                    this.form.xxdm = this.xxdm;
                    this.form.mm = this.form_mm;
                    if (this.opation_csdm.length > 0) this.form.csdm = this.opation_csdm.join();                  //出生地
                    if (this.opation_jg.length > 0) this.form.jg = this.opation_jg.join();                  //籍贯
                    if (this.opation_kp[0].length > 0) this.form.kp[0] = this.opation_kp[0];
                    if (this.opation_kp[1].length > 0) this.form.kp[1] = this.opation_kp[1];
                    if (this.opation_kp[2].length > 0) this.form.kp[2] = this.opation_kp[2];
                    if (this.opation_kp[3].length > 0) this.form.kp[3] = this.opation_kp[3];
                    if (this.opation_lyd.length > 0) this.form.lyd = this.opation_lyd.join();                  //生源地
                    if (this.opation_szd.length > 0) this.form.hkszd = this.opation_szd.join();                  //所在地

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
        // 更新页面
        create(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.changeSure = true;
                    this.form.xxdm = this.xxdm;
                    this.form.mm = this.form_mm;
                    if (this.opation_csdm && this.opation_csdm.length > 0) this.form.csdm = this.opation_csdm.join();                  //出生地
                    if (this.opation_jg && this.opation_jg.length > 0) this.form.jg = this.opation_jg.join();                  //籍贯
                    if (this.opation_kp[0] && this.opation_kp[0].length > 0) this.form.kp[0] = this.opation_kp[0];
                    if (this.opation_kp[1] && this.opation_kp[1].length > 0) this.form.kp[1] = this.opation_kp[1];
                    if (this.opation_kp[2] && this.opation_kp[2].length > 0) this.form.kp[2] = this.opation_kp[2];
                    if (this.opation_kp[3] && this.opation_kp[3].length > 0) this.form.kp[3] = this.opation_kp[3];
                    if (this.opation_lyd && this.opation_lyd.length > 0) this.form.lyd = this.opation_lyd.join();                  //生源地
                    if (this.opation_szd && this.opation_szd.length > 0) this.form.hkszd = this.opation_szd.join();                  //所在地
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
    }
}
</script>
<style>
    .filter-container .filter-item{ vertical-align: inherit;}
    .el-input-group__append, .el-input-group__prepend{ padding: 0 10px;}
    .el-checkbox+.el-checkbox{margin-left: 0;}
    .el-checkbox{ margin-right: 30px;}
</style>
