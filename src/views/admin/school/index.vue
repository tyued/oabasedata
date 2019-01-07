<!--admin-系统配置-单位维护-->
<template>
  <div class="app-container">
    <el-container>
      <el-aside width="250px">
        <TreePart class='screenfull' :treeData='admarea' :treeHeader="treeHeader" :defaultProps="defaultProps"  :treemrexpand="mrexpand"
                  @treeCClick="treeCClick"></TreePart>
      </el-aside>
      <el-main>
        <div class="container-block">
          <el-select v-if="unitCode == 1?true:false" v-model="searchsel_sjly" slot="prepend" placeholder="全部来源" clearable @change="handleFilter"
                    style="width:120px; height:38px; margin:0 auto;">
            <el-option v-for="item in dict.sjly" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="searchsel_xxbxlx" slot="prepend" placeholder="全部类型" clearable @change="handleFilter"
                    style="width:120px; height:38px; margin:0 auto;">
            <el-option v-for="item in dict.xzlx" :key="item.id" :label="item.text" :value="item.id"></el-option>
          </el-select>

          <el-input placeholder="单位名称搜索" @keyup.enter.native="handleFilter" v-model="searchInp"
                    class="input-with-select" style="width: 200px;"></el-input>
          <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter"
                    style="margin-right: 30px;">搜索
          </el-button>
          <el-button v-if="unitCode == 1?true:false"  class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">
            新增
          </el-button>
          <!--<el-button class="filter-item"  style="margin-left: 10px;" @click="handleImport" type="primary" icon="edit">导入</el-button>-->
          <!--<el-button class="filter-item"  style="margin-left: 10px;" @click="handleAuthorize" type="primary" icon="edit">授权</el-button>-->
        </div>
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" height="580px">
          <el-table-column align="center" prop="xxdm" label="单位代码" width="120"></el-table-column>
          <el-table-column align="center" prop="xxmc" label="单位名称" width="220"></el-table-column>
          <el-table-column align="center" label="单位类型" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.xxbxlx}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop='sjlymc' label="数据来源" width="150"></el-table-column>
          <el-table-column align="center" label="开通状态" width="150">
            <template slot-scope="scope">
              <span>{{scope.row.ktzt=='0'?'未开通':(scope.row.ktzt=='1'?'开通':(''))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="small" v-if="unitCode == 1?true:false"  type="danger" @click="handleDelete(scope.row)">删除</el-button>
              <el-button size="small" v-if="unitCode == 1?true:false"  type="danger" @click="handleSetting(scope.row)">个性化配置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page.sync="listQuery.query.page" :page-sizes="[10,20,30, 50]"
                         :page-size="listQuery.query.limit" layout="total, sizes, prev, pager, next, jumper"
                         :total="total"></el-pagination>
        </div>
      </el-main>
    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px" @close="cancel('form')">
      <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <el-row :gutter="18">
          <el-col :span="11">
            <el-form-item label="单位代码" prop="xxdm">
              <el-input :maxlength="20" v-model="form.xxdm" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="单位名称" prop="xxmc">
              <el-input :maxlength="20" v-model="form.xxmc" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="18">
          <el-col :span="11">
            <el-form-item label="单位类型" prop="xxbxlxm" :rules="[{ required: true, message: '单位代码不能为空'}]">
              <el-select v-model="form.xxbxlxm" placeholder="全部类型">
                <el-option v-for="item in dict.xzlx" :key="item.id" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="所属区划" prop='xzqhm' :rules="[{ required: true, message: '所属区划不能为空'}]">
              <el-cascader :options="admarea" v-model="opation_jg" :props="form_props"  change-on-select
                           @change="xzqhChange"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="18">
          <el-col :span="11">
            <el-form-item label="数据来源" prop="sjly" :rules="[{ required: true, message: '数据来源不能为空'}]">
              <el-select v-model="form.sjly" placeholder="请选择">
                <el-option v-for="item in dict.sjly" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="开通状态">
              <el-radio-group v-model="form.ktzt">
                <el-radio label="0">否</el-radio>
                <el-radio label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="学校图片">
          <el-upload
            class="avatar-uploader"
            action="/api/base/jcXxjbsj/sctps"
            accept=".jpg,.png"
            :headers="headers"
            :show-file-list="false"
            :onSuccess="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="schimageUrl" :src="schimageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-row :gutter="18">
          <el-col :span="22">
            <el-form-item label="备注" size="small" prop="bz" :rules="[{ message: '备注不超过50个字',max:50}]">
              <el-input type="textarea" :maxlength="50"  v-model.trim="form.bz"  placeholder="不超过50个字"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :disabled="changeSure">确 定
        </el-button>
        <el-button v-else type="primary" @click="update('form')" :disabled="changeSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="setCheckDiag" title="个性化配置" :visible.sync="settingFormVisible" width="500px"
              @close="cancel('setform')">
       <span style="font-size: 20px; font-weight: 600;vertical-align: middle">阅读考级</span>

      <el-form style="width:400px;margin-left: 50px;margin-top: 40px; label-position:left;"  :model="setform"  :rules="rulessetform"  ref="setform" label-width="110px">
        &nbsp;&nbsp;是否开启&nbsp;
        <el-switch v-model="setform.sfkq==1" @change="setStateValue($event,0,setform.xxdm)" ></el-switch>
        <div>
          <el-form-item label="单位代码" prop="xxdm">
            <el-input class="inputchange" :maxlength="10" v-model="setform.xxdm"  readonly ></el-input>
          </el-form-item>
          <el-form-item label="校管理员账号" prop="value1" :rules="[{ required: true, message: '校管理员账号不能为空'}]">
            <el-input :maxlength="20" v-model="setform.value1" placeholder="" ></el-input>
          </el-form-item>
          <el-form-item label="校管理员密码" prop="value2" :rules="[{ required: true, message: '校管理员密码不能为空'}]">
            <el-input type="password" :maxlength="20"  v-model="setform.value2"  placeholder="" ></el-input>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('setform')">取 消</el-button>
        <el-button type="primary" @click="settingSure('setform')" :disabled="changeSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="授权" :visible.sync="dialogAuthorityVisible" width="800px">
      <group-authority :groupId="currentId" :xxdm="xxdm" @closeauthoritydialog="closeAuthorityDialog"
                      ref="groupAuthority"></group-authority>
    </el-dialog>
  </div>
</template>

<script>
  import {getDict} from 'api/dict';
  import {mapGetters} from 'vuex';
  import Cookies from 'js-cookie'
  import TreePart from 'components/TreePart';
  import {
    getPageSchool,
    getSave,
    getUpdate,
    getDelete,
    getValidaXxdm,
    getValidaXxmc,
    getSetListpage,
    updateSetList,
    saveyuduSet,
    getObj
  } from '@/api/admin/school/index'
  import groupAuthority from '@/views/admin/group/components/groupAuthority';

  export default {
    name: 'unit',
    components: {
      TreePart,
      groupAuthority
    },
    data() {
      /** 验证学校代码**/
      const validaXxdm = (rule, value, callback) => {
        if (/^[0-9]*$/.test(value)) {
          if (this.dialogStatus === 'update' && value === this.form.xxdm) {
            callback();
          } else {
            getValidaXxdm({xxdm: value}).then(res => {
              if (res.data > 0) {
                callback(new Error('学校代码不能重复'));
              } else {
                callback();
              }
            })
          }
        } else {
          callback(new Error('学校代码必须数字组成'));
        }
      };
      /** 验证学校名称**/
      const validaXxmc = (rule, value, callback) => {
          if (this.dialogStatus === 'update' && value === this.form.xxmc) {
            callback();
          } else {
            getValidaXxmc({xxmc: value}).then(res => {
              if (res.data > 0) {
                callback(new Error('学校名称不能重复'));
              } else {
                callback();
              }
            })
          }
      };
      /** 验证阅读考级开启是否**/
      const validyduvalue1= (rule, value, callback) =>{
        console.log('value1'+this.setform.sfkq);
        if(this.setform.sfkq ==='1'){
          callback();
        } else {
          if(this.setform.value1==='') {
            callback(new Error('管理员账号不能为空'));
          } else{
            callback();
          }
        }
      } ;
      const validyduvalue2= (rule, value, callback) =>{
        console.log('value2'+this.setform.sfkq);
        if(this.setform.sfkq ==='1'){
          callback();
        } else {
          if(this.setform.value2==='') {
            callback(new Error('管理员密码不能为空'));
          }else{
            callback();
          }
        }
      } ;
      return {
        treeHeader: '选择行政区划',
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        treeCCdata: '',
        admarea: [],                  //行政区域
        mrexpand:[],                  //树形默认展开的节点
        listLoading: true,                      //加载
        listQuery: {
          xxmc: '',
          xxdm: window.localStorage.getItem("xxdm"),
          query: {
            page: 1,
            limit: 20
          }
        },
        searchInp: '',             //查询条件
        unitCode: '', // 学校类型
        searchsel_sjly: '',
        searchsel_xxbxlx: '',
        tableKey: 0,                //表格
        list: null,                 //表格数据
        total: null,
        dict: {                      //字典表
          sjly: [
            {label: '本地', value: '1'},
            {label: '校讯通', value: '2'},
            {label: '第三方', value: '3'}
          ]
        },

        // 导入数据
        importLoading: false,
        importFormVisible: false,
        fileList: [],

        dialogStatus: '',
        textMap: {                              //判断弹层是添加还是编辑
          update: '编辑',
          create: '新增'
        },
        dialogFormVisible: false,
        form: {
          ktzt: '1',                       //开通状态 0未开通 1开通
          submitImgArr: []
        },
        rules: {
          xxmc: [
            {required: true, message: '请输入学校名称', trigger: 'change'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change'},
            {validator: validaXxmc, trigger: 'change'}],
          xxdm: [
            {required: true, message: '请输入学校代码', trigger: 'change'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change'},
            {validator: validaXxdm, trigger: 'change'}]
        },
        rulessetform: {
           value1: [{validator: validyduvalue1, trigger: 'change'}],
           value2: [{validator: validyduvalue2, trigger: 'change'}]
        },
        form_props: {
          value: 'id',
          label: 'text',
          children: 'children'
        },
        schimageUrl: '',                 //上传图片的地址
        opation_jg: [],                  //籍贯--传参要求是字符串、所得是数组要转化
        findopa_jg: [],                  //籍贯
        curopa_jg: {},                  //籍贯

        changeSure: false,                       //防止重复提交

        // 个性化配置
        settingFormVisible: false,
        setform: {
          xxdm: '',
          sfkq: '',          // 阅读考级是否开启
          value1: '',        // 管理员账号
          value2: ''         //管理员密码
        },
        setList: [],
        setListupdate: [],
        setChildList: [],
        checkAll: false,

        // 授权
        dialogAuthorityVisible: false,
        currentId: -1,
        xxdm: '',
        ids: [],  //个性化设置 key
        values: [] //个性化设置  value

      }
    },
    computed: {
      ...mapGetters([
        'dict',
      ]),
    },
    watch: {
      dict() {
        this.getDict();
      }
    },
    created() {
      this.dict.xzlx = this.$store.getters.dict_xzlx     //单位类型
    },
    mounted() {
      // unitCode (1:系统管理员 2:学校管理员 3:普通老师 4,学生, 5:教育局管理员)'
      this.unitCode = sessionStorage.getItem('unitCode');
      this.getDict()
    },
    computed: {
      headers: function () {
        return {Authorization: Cookies.get("Admin-Token"), ReturnResultCode: true}
      },
    },
    methods: {
      getDict() {
        getDict().then(response => {
          this.admarea = response.data['JY/T 1001－2012'];         //籍贯
          this.dict.xzlx = response.data['XZLX'];     //单位类型
          this.mrexpand = [];
          if(this.admarea && this.admarea.length>0){
            this.mrexpand.push(this.admarea[0].id);
            this.listQuery.xzqh = this.admarea[0].children[0].id;

          }
          this.getList()
        }).catch(error => {
          console.log(error);
        });

      },
      treeCClick(value) {
        this.treeCCdata = value.id;
        this.handleFilter()
        // if (value.children && value.children.length > 0) {
        //   return false;
        // } else {
        //   this.treeCCdata = value.id
        //   this.handleFilter()
        // }
      },
      getList() {
        getPageSchool(this.listQuery).then(res => {
          this.total = res.data.total;
          this.list = res.data.rows;
          this.listLoading = false;
          var that = this;
          this.list.forEach(function (item, index) {
            that.dict.xzlx.forEach(function (dictItem, dictIndex) {
              if (item.xxbxlxm == dictItem.id) {
                item.xxbxlx = dictItem.text
              }
            });
            that.dict.sjly.forEach(function (dictItem, dictIndex) {
              if (item.sjly == dictItem.value) {
                item.sjlymc = dictItem.label
              }
            })
          })

        })
      },
      // 搜索
      handleFilter() {
        var that = this;
        this.listQuery.xxmc = this.searchInp;
        this.listQuery.sjly = this.searchsel_sjly;
        this.listQuery.xxbxlxm = this.searchsel_xxbxlx;
        this.listQuery.xzqhm = this.treeCCdata;
        this.listQuery.query = {
          page: 1,
          limit: 20
        };
        this.getList();
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
      xzqhChange(val) {
        this.form.xzqhm = this.opation_jg.join()
      },

      // 添加
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      resetTemp() {
        this.form = {
          ktzt: '1',                       //开通状态 0未开通 1开通
        };
        this.opation_jg = [];
        this.schimageUrl = '';
        this.changeSure = false;
      },
      // 编辑
      handleUpdate(row) {
        this.changeSure = false;
        this.xxdm = row.xxdm;
        getObj(row.uuid).then(response => {
          this.form = response.data;
          this.form.dqxnxq ? this.form.dqxnxq : 1;
          this.findcurXZQHL(this.form.xzqhm, this.admarea);
          var that = this;
          this.opation_jg = this.findopa_jg.reverse();
          this.schimageUrl = response.data.path;

          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
      },
      findcurXZQHL(val, data) {
        var that = this;
        data.forEach(function (item, index) {
          if (item.id == val) {
            that.curopa_jg = item;
            that.findopa_jg.push(item.id);
            that.findXZQHL(item, that.admarea)
          }
          if (item.children && item.children.length > 0) {
            that.findcurXZQHL(val, item.children)
          }
        })

      },
      findXZQHL(val, data) {
        var that = this;
        if (val.parentId != null) {
          data.forEach(function (item, index) {
            if (item.id == val.parentId) {
              that.findopa_jg.push(item.id);
              that.findXZQHL(item, that.admarea)
            }
            if (item.children && item.children.length > 0) {
              that.findXZQHL(val, item.children)
            }
          })
        }

      },
      // 删除
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getDelete(row.uuid).then(() => {
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
          console.log(e)
        });
      },
      // 图片上传成功
      handleAvatarSuccess(res, file) {
        this.form.submitImgArr = [];
        this.schimageUrl = URL.createObjectURL(file.raw);
        let path_ = res.data[0].path;
        let parm = {
          fjid: file.uid,
          path: path_,
          xxdm: this.xxdm
        };
        this.form.submitImgArr.push(parm);
      },
      // 上传前对文件的大小的判断
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG 格式或 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return (isJPG || isPNG) && isLt2M;
      },
      // 取消按钮
      cancel(formName) {
        if (formName == 'form') this.dialogFormVisible = false;
        if (formName == 'setform') this.settingFormVisible = false;
        this.$refs[formName].resetFields();
      },
      // 新增页面
      create(formName) {
        this.form.xzqhm = this.opation_jg[this.opation_jg.length - 1];
        const tempData = Object.assign({}, this.form);
        this.$refs[formName].validate(valid => {
          if (valid) {
            getSave(tempData).then((res) => {
              if (res.status == "200") {
                this.dialogFormVisible = false;
                this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000});
                this.$refs[formName].resetFields();
                this.getList();
              } else {
                this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
              }

            });

            var that = this;
            setTimeout(function () {
              that.changeSure = false;
            }, 1500);
          } else {
            this.$notify({title: '失败', message: '还有未填项', type: 'error', duration: 2000});
            return false;
          }
        });
      },
      // 编辑页面
      update(formName) {
        this.form.xzqhm = this.opation_jg[this.opation_jg.length - 1];
        const tempData = Object.assign({}, this.form);
        this.$refs[formName].validate(valid => {
          if (valid) {
            getUpdate(tempData.uuid, tempData).then((res) => {
              if (res.status == "200") {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({title: '成功', message: '创建成功', type: 'success', duration: 2000});
                this.$refs[formName].resetFields();
              } else {
                this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
              }
            });
            var that = this;
            setTimeout(function () {
              that.changeSure = false;
            }, 1500);
          } else {
            this.$notify({title: '失败', message: '还有未填项', type: 'error', duration: 2000});
            return false;
          }
        });
      },

      //导入
      handleImport() {
        this.importFormVisible = true;
      },
      //取消上传
      importCancel() {
        this.importLoading = false;
        this.importFormVisible = false;
        this.fileList = [];
      },
      // 上传错误
      uploadError(response, file, fileList) {
        this.importLoading = false;
        this.$notify({
          title: '失败',
          message: '上传失败，请重试！',
          type: 'warning',
          duration: 2000
        });
      },
      // 上传成功后的回调
      uploadSuccess(response, file, fileList) {

        if (response.status == "200") {
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
        } else {
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
      beforeUpload(file) {
        this.importLoading = true;
        let extension = file.name.split('.')[1] === 'xlsx';
        let isLt2M = file.size / 1024 / 1024 < 10;
        if (!extension) {
          this.$notify({
            title: '提示',
            message: '上传模版只支持xlsx格式',
            type: 'info',
            duration: 2000
          });
          this.importLoading = false;
        } else if (!isLt2M) {
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
      // 各性化配置
      handleSetting(row) {
        this.settingFormVisible = true;
        this.setform.xxdm = row.xxdm;
        getSetListpage(row.xxdm).then(res => {
          if (res.status == "200"){
            this.setform = res.data;
            this.setform.sfkq = res.data.value;
            console.log(res.data) ;
          }

        })
      },
      // 全选
      handleCheckAllChange(val, index) {
        this.setList[index].check = val ? this.setChildList[index] : [];
        this.setList[index].value = val ? '1' : '0';
        this.setList[index].isIndeterminate = false;
        var curChild = this.setList[index].children;

          if (curChild && curChild.length > 0) {
            curChild.forEach(function (curItem, ind) {
              if (val) {
                curItem.value = '1'
              }else {
                curItem.value = '0'
              }
            })
          }

      },
      handleCheckedCitiesChange(val, index) {
        let checkedCount = val.length;
        this.setList[index].checkAll = checkedCount === this.setChildList[index].length;
        this.setList[index].value = this.setList[index].checkAll ? '1' : '0';
        this.setList[index].isIndeterminate = checkedCount > 0 && checkedCount < this.setChildList[index].length;
        var curChild = this.setList[index].children;
        if (val && val.length > 0) {
          if (curChild && curChild.length > 0) {
            curChild.forEach(function (curItem, ind) {
              curItem.value = '0';
              val.forEach(function (item, index) {
                if (item == curItem.id) {
                  curItem.value = '1'
                }
              })
            })
          }
        } else {
          if (curChild && curChild.length > 0) {
            curChild.forEach(function (curItem, ind) {
              curItem.value = '0'
            })
          }
        }
      },
      eachCZJn(data) {
        var that = this;
        if (data && data.length > 0) {
          data.forEach(function (item, index) {
            that.ids.push(item.id);
            that.values.push(item.value);
            if (item.children) {
              that.eachCZJn(item.children)
            }
          })
        }
      },
      setStateValue(v, e, id) {
        const value = { jlid: id };
        if (e === 0) {
          value.sfkq = v ? 1 : 0;
          this.setform.sfkq=v ? 1 : 0;
        } else {
          this.setform.sfkq=v ? 0 : 1;
        }
        console.log(this.setform.sfkq);
      },
      // 各性化配置--确定
      settingSure(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
              saveyuduSet(this.setform).then((res) => {
                if (res.status == "200") {
                  this.settingFormVisible = false;
                  this.$notify({title: '成功', message: res.message, type: 'success', duration: 2000});
                  this.$refs[formName].resetFields();
                  this.getList();
                } else {
                  this.$notify({title: '失败', message: res.message, type: 'error', duration: 2000});
                }
              });
            }
          })
      },
      // 授权
      handleAuthorize() {
        if (this.currentId == -1) {
          this.$notify({title: '提示', message: '请选择记录', type: 'warning', duration: 2000});
        } else {
          this.dialogAuthorityVisible = true;
          if (this.$refs.groupAuthority !== undefined) {
            this.$refs.groupAuthority.groupId = this.currentId;
            this.$refs.groupAuthority.initAuthoritys();
          }

        }

      },
      closeAuthorityDialog() {
        this.dialogAuthorityVisible = false;
      },

    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-aside {
    position: relative;

  }

  .el-main {
    padding: 0 20px;
  }

</style>

<style>
  .inputchange input{
    border: none !important;
  }
</style>
