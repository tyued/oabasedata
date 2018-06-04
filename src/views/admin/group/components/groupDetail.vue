<template>
<el-row>
  <el-col :span="24">
    <el-button-group>
      <el-button type="primary" v-if="groupManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
      <!-- <el-button type="primary" v-if="showbtn.edit" icon="edit" @click="handlerEdit">编辑</el-button> -->
      <el-button type="primary" icon="edit" @click="handlerEdit">编辑</el-button>

      <el-button type="primary" v-if="showbtn.del" icon="delete" @click="handleDelete">删除</el-button>
      <el-button type="primary" v-if="showbtn.qxfp" @click="handlerAuthority">
        <icon-svg icon-class="quanxian1"></icon-svg>权限分配</el-button>
      <!-- <el-button type="primary" v-if="groupManager_btn_userManager" @click="handlerUser">
        <icon-svg icon-class="27"></icon-svg>关联用户</el-button> -->

    </el-button-group>
  </el-col>
  <el-col :span="8" style='margin-top:15px;'>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>

    <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="groupTree" @node-click="getNodeData" default-expand-all> </el-tree>


  </el-col>
  <el-col :span="16" style='margin-top:15px;'>
    <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
      <el-form-item label="名称" required>
        <el-input v-model="form.name" :disabled="formEdit"></el-input>
      </el-form-item>

      <el-form-item label="校区" v-if="type==2" prop="xqh" :rules="[{ required: true, message: '校区不能为空'}]">
        <el-select v-model="form.xqh" :disabled="formEdit" placeholder="请选择">
          <el-option v-for="item in campus" :key="item.uuid" :label="item.xqmc" :value="item.uuid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="form.code" :disabled="formEdit"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" :disabled="formEdit"></el-input>
      </el-form-item>


      <el-form-item label="关联用户" v-if="showbtn.teacher">
        <el-radio-group v-model="formsel_teach" @change="selrole_teach(formsel_teach)" :disabled="formEdit_with">
          <el-radio-button :label="1">全体教师</el-radio-button>
          <el-radio-button :label="0">自选教师</el-radio-button>
        </el-radio-group>
        <el-row v-if="formsel_teach=='1'">
            <p class="selptips">已选中全体教师</p>
        </el-row>
        <el-row v-if="formsel_teach=='0'">
          <el-tag :key="tag.id" v-for="tag in dynamicTags" :disable-transitions="false" @close="handleClose(tag)" :closable="tagclose">{{tag.name}}</el-tag>
          <el-button class="button-new-tag" size="small" @click="showaddteach" :disabled="formEdit_with">添加教师</el-button>
        </el-row>
      </el-form-item>
      <el-form-item label="关联用户" v-if="showbtn.student">
        <el-radio-group v-model="formsel_student" :disabled="formEdit_with">
          <el-radio-button :label="1">全体学生</el-radio-button>
        </el-radio-group>
        <el-row v-if="formsel_student=='1'">
            <p class="selptips">已选中全体学生</p>
        </el-row>
      </el-form-item>

      <el-form-item label="关联领导" v-if="type==2">
        <el-row>
          <el-tag :key="tag.id" v-for="tag in leaderTags" :disable-transitions="false" @close="handleCloseLeader(tag)" :closable="tagclose">{{tag.name}}</el-tag>
          <el-button class="button-new-tag" size="small" @click="showaddleader" :disabled="formEdit_with">添加领导</el-button>
        </el-row>
      </el-form-item>
      <el-form-item v-if="formStatus == 'update'">
        <el-button type="primary" v-if="groupManager_btn_edit" @click="update('form')" :disabled="changeSure">更新</el-button>
        <el-button @click="onCancel('form')">取消</el-button>
      </el-form-item>
      <el-form-item v-if="formStatus == 'create'">
        <el-button type="primary" v-if="groupManager_btn_add" @click="create('form')" :disabled="changeSure">保存</el-button>
        <el-button @click="onCancel('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-col>
  <el-dialog :title="dialogUserName" :visible.sync="dialogUserVisible">
    <group-user :groupId="currentId" @closeUserDialog="closeUserDialog" ref="groupUser"></group-user>
  </el-dialog>
  <el-dialog :title="dialogAuthorityName" :visible.sync="dialogAuthorityVisible" width="800px">
    <group-authority :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" ref="groupAuthority"></group-authority>
  </el-dialog>
  <el-dialog :title="dialogUserName" :visible.sync="dialogUserVisible_with" width="560px">
      <group-userwith :groupId="currentId" :seltype="type" :alreadyMem="dynamicTags" @closeUserWithDialog="closeUserWithDialog" ref="groupUserWith"></group-userwith>
  </el-dialog>
  <el-dialog :title="dialogUserName" :visible.sync="dialogUserVisible_withleader" width="560px">
    <group-leaderwith :groupId="currentId" :seltype="type" :alreadyMem="leaderTags" :allremmber="dynamicTagschange" @closeUserWithLeaderDialog="closeUserWithLeaderDialog" ref="groupUserWith"></group-leaderwith>
  </el-dialog>

</el-row>
</template>

<script>
import {
  fetchTree,
  getObj,
  addObj,
  delObj,
  putObj,
  getUsers,
  modifyUsers,modifyLeaders
} from 'api/admin/group/index';
import {
    userAllpage
} from 'api/admin/user/index'
import { getCampus,getxxdmCampus } from 'api/admin/campus/index';
import { mapGetters } from 'vuex';
export default {
  name: 'groupDetail',
  components: {
    'group-user': () => import('./groupUser'),
    'group-authority': () => import('./groupAuthority'),
    'group-userwith': () => import('./groupUserWith'),
    'group-leaderwith': () => import('./groupLeaderWith')
  },
  props: {
    type: {
      default: '1'
    }
  },
  data() {
    return {
      dynamicTagschange:[],
      xxdm:'',
      filterText: '',
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      dialogUserVisible: false,
      dialogUserName: '关联用户',
      dialogAuthorityVisible: false,
      dialogAuthorityName: '关联资源',
      listQuery: {
        groupType: this.type,
        name: undefined
      },
      alllistQuery:{
          page: 1,
          limit: 2000,
          type:3,
          name: undefined
      },
      alluserlist:[],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'right',
      groupManager_btn_edit: false,
      groupManager_btn_del: false,
      groupManager_btn_add: false,
      groupManager_btn_userManager: false,
      groupManager_btn_resourceManager: false,
      form: {
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type
      },
      currentId: -1,
      campus:[],  //校区
      selectCampus:"",   //所选校区


      dialogUserVisible_with:false,       //关联用户

      dynamicTags: [],                  //已经关联的用户
      inputVisible: false,
      inputValue: '',
      formsel_teach:'',               //判断选择全选老师还是自选老师
      formsel_student:'',             //判断选择全选学生

      showbtn:[],                     //按钮
      type_teacher:[],                //教师json
      type_student:[],                //学生json
      formEdit_with: true,            //关联用户是否能编辑
      tagclose:false,                 //关联用户里的标签


      changeSure:false,                       //防止重复提交
      leaderTags:[],                  //领导
      dialogUserVisible_withleader:false,
      withTags:{},
    }
  },
  watch: {
    filterText(val) {
      this.$refs.groupTree.filter(val);
    },
    dynamicTags(){
      this.$store.dispatch('get_dynamicTagschange',this.dynamicTags);
      this.dynamicTagschange = this.dynamicTags;
      var that = this
      var sucDate=[];
        this.leaderTags.forEach(function (item,index) {

          const sfst = _.find(that.dynamicTags,  ['username', item.username]);
          if(sfst){
            sucDate.push(item)
          }

        })
      this.leaderTags = sucDate
      // console.log(sucDate)
    }
  },
  mounted:function(){
      this.xxdm = window.localStorage.getItem("xxdm");
      this.listQuery.xxdm = this.xxdm;
  },
  created() {
    this.xxdm = window.localStorage.getItem("xxdm");
    this.listQuery.xxdm = this.xxdm;
    this.getList();
    if(this.$props.type==2){
      this.getCampus();
    }
    if(this.$props.type==2 || this.$props.type==3){
       this.showbtn.teacher = true;
    }
    if(this.$props.type==1){
      this.showbtn.qxfp = true;
    }
    this.groupManager_btn_edit = this.elements['groupManager:btn_edit'];
    this.groupManager_btn_del = this.elements['groupManager:btn_del'];
    this.groupManager_btn_add = this.elements['groupManager:btn_add'];
    this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager'];
    this.groupManager_btn_resourceManager = this.elements['groupManager:btn_resourceManager'];
    this.init()

  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    init(){
        this.alllistQuery.xxdm = this.xxdm;
        userAllpage(this.alllistQuery).then(response => {
            this.alluserlist = response.data.rows;
        })
    },
    getCampus(){
      getxxdmCampus(this.xxdm).then(data =>{
        this.campus = data;
      })
    },
    getList() {
      this.listQuery.xxdm = this.xxdm;
      fetchTree(this.listQuery).then(data => {
        this.treeData = data;
        this.type_teacher = _.find(this.treeData,{"name":"教师"})
        this.type_student = _.find(this.treeData,{"name":"学生"})
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update';
      }
      //点击的type 为一级时不能编辑不能删除
        if(data.type!=1){
            this.showbtn.edit = true;
            this.showbtn.del = true;
        }else{
            this.showbtn.edit = false;
            this.showbtn.del = false;
        }
      //当选中老师时  可以关联教师
        if(data.name=="教师" || this.$props.type==2 || this.$props.type==3){
            this.showbtn.teacher = true;
        }else{
            this.showbtn.teacher = false;
        }
        if(this.type_teacher){
            if(data.parentId == this.type_teacher.id){
                this.showbtn.teacher = true;
            }
        }
        if(data.name=="学生"){
            this.showbtn.student = true;
        }else{
            this.showbtn.student = false;
        }
        if(this.type_student){
            if(data.parentId == this.type_student.id){
                this.showbtn.student = true;
            }
        }
      // 当处于编辑状态  判断所点击type是否为1  为1时formEdit不能编辑formEdit_with能编辑 不为1时全部都能编辑
        if(this.formStatus=='update'){
            if(data.type!=1){
              this.formEdit = false;
              this.formEdit_with = false;
              this.tagclose = true;
            }else{
              this.formEdit = true;
              this.formEdit_with = false;
              this.tagclose = true;
            }
        }

      getObj(data.id).then(response => {
        this.form = response.data;
      });
      this.currentId = data.id;

      getUsers(this.currentId).then(response => {
        this.leaderTags = response.data.leaders;
        this.dynamicTags=response.data.members;
        if(this.dynamicTags[0]){
          this.formsel_teach = 0;
        }else{
          this.formsel_teach = '';
        }

      });
    },
  // 关联用户
    handleClose(val){
      this.dynamicTags.splice(this.dynamicTags.indexOf(val), 1);

      var teach_member=[];
      var allMember = {};
      allMember.xxdm = this.xxdm;
      for(var i in this.dynamicTags){
        teach_member.push(this.dynamicTags[i].id)
      }
      if (teach_member.length > 0) allMember.members  = teach_member.join();

      modifyUsers(this.currentId,allMember).then(() => {
      })
    },
    handleCloseLeader(val){
      this.leaderTags.splice(this.leaderTags.indexOf(val), 1);

      var teach_member=[];
      var allMember = {};
      allMember.xxdm = this.xxdm;
      for(var i in this.leaderTags){
        teach_member.push(this.leaderTags[i].id)
      }
      if (teach_member.length > 0) allMember.leaders  = teach_member.join();

      modifyLeaders(this.currentId,allMember).then(() => {
      })

    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    showaddteach() {
        this.dialogUserVisible_with = true;
    },
    showaddleader(){
      this.dialogUserVisible_withleader = true;
    },
  // 自选老师
    selrole_teach(type){
        // console.log(type)

    } ,
  // 编辑
    handlerEdit() {
      if (this.form.id) {
        if(this.form.type==1){
          this.formEdit = true;
          this.formEdit_with = false;
          this.tagclose = true;
        }else{
          this.formEdit = false;
          this.formEdit_with = false;
          this.tagclose = true;
        }
        this.formStatus = 'update';
      }
      this.changeSure = false;

    },
    handlerAdd() {
      this.resetForm();
      this.formEdit = false;
      this.formEdit_with = false;
      this.tagclose = true;
      this.formStatus = 'create';
    },
    handleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.currentId).then(() => {
          this.getList();
          this.resetForm();
          // this.onCancel();
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        });
      });
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeSure = true;
          putObj(this.form.id, this.form).then(() => {
            this.getList();
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          });

          var that = this;
          setTimeout(function(){
              that.changeSure = false;
          },1500);
          // 选择了全体教师
          if(this.formsel_teach==1){
              var teach_member=[];
              var allMember = {};
              allMember.xxdm = this.xxdm;
              for(var i in this.dynamicTags){
                if(this.dynamicTags[i].type!=3){
                    teach_member.push(this.dynamicTags[i].id)
                }
              }
              for(var j in this.alluserlist){
                   teach_member.push(this.alluserlist[j].id)
              }
              if (teach_member.length > 0) allMember.members  = teach_member.join();
              modifyUsers(this.currentId,allMember).then(() => {
                  this.closeUserWithDialog();
                  this.$notify({
                      title: '成功',
                      message: '创建成功',
                      type: 'success',
                      duration: 2000
                  });
              })
              // var allMember = {};
              // allMember.xxdm = this.xxdm;
              // allMember.members = "AllTeacher";
              // modifyUsers(this.currentId,allMember).then(() => {
              //     this.$notify({
              //         title: '成功',
              //         message: '创建成功',
              //         type: 'success',
              //         duration: 2000
              //     });
              // })
          }
          // 选择了全体学生
          if(this.formsel_student==1){
              var allMember = {};
              allMember.xxdm = this.xxdm;
              allMember.members = "AllStudent";
              modifyUsers(this.currentId,allMember).then(() => {
                  this.$notify({
                      title: '成功',
                      message: '创建成功',
                      type: 'success',
                      duration: 2000
                  });
              })
          }
        }else{
          this.$notify({title: '失败', message: '还有未填项', type: 'error', duration: 2000});
          return false;
        }
      })
    },
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.changeSure = true;
            this.form.xxdm = this.xxdm;
            addObj(this.form).then(() => {
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            });

            var that = this;
            setTimeout(function(){
                that.changeSure = false;
            },1500);
            // 选择了全体教师
            if(this.formsel_teach==1){
                var allMember = {};
                allMember.xxdm = this.xxdm;
                allMember.members = "AllTeacher";
                modifyUsers(this.currentId,allMember).then(() => {
                    this.$notify({
                        title: '成功',
                        message: '创建成功',
                        type: 'success',
                        duration: 2000
                    });
                })
            };
            // 选择了全体学生
            if(this.formsel_student==1){
                var allMember = {};
                allMember.xxdm = this.xxdm;
                allMember.members = "AllStudent";
                modifyUsers(this.currentId,allMember).then(() => {
                    this.$notify({
                        title: '成功',
                        message: '关联成功',
                        type: 'success',
                        duration: 2000
                    });
                })
            }
        }else{
          this.$notify({title: '失败', message: '还有未填项', type: 'error', duration: 2000});
          return false;
        }
      })
    },
    onCancel(formName) {
      this.formEdit = true;
      this.formEdit_with = true;
      this.tagclose = false;
      this.formStatus = '';
      this.$refs[formName].resetFields();
    },
    resetForm() {
      this.form = {
        parentId: this.currentId,
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type
      };
      this.changeSure = false;
    },
    handlerUser() {
      this.dialogUserVisible = true;
      if (this.$refs.groupUser !== undefined) {
        this.$refs.groupUser.groupId = this.currentId;
        this.$refs.groupUser.initUsers();
      }
    },
    handlerUser_with(){
        if (this.form.id) {
            this.dialogUserVisible_with = true;
        }
    },



    handlerAuthority() {
      this.dialogAuthorityVisible = true;
      if (this.$refs.groupAuthority !== undefined) {
        this.$refs.groupAuthority.groupId = this.currentId;
        this.$refs.groupAuthority.initAuthoritys();
      }
    },
    closeUserDialog() {
      this.dialogUserVisible = false;
    },
    closeAuthorityDialog() {
      this.dialogAuthorityVisible = false;
    },
    closeUserWithDialog() {
      this.dialogUserVisible_with = false;
      getUsers(this.currentId).then(response => {
        this.dynamicTags=response.data.members;
        if(this.dynamicTags[0]){
          this.formsel_teach = 0;
        }else{
          this.formsel_teach = '';
        }
      });
    },
    closeUserWithLeaderDialog(){
      this.dialogUserVisible_withleader = false;
      getUsers(this.currentId).then(response => {
        this.leaderTags=response.data.leaders;
      });
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.el-tree-node__content{
  height:36px;
  line-height:36px;
}
.el-tree{
  cursor: default;
  background: #fff;
  border: 1px solid #d1dbe5;
}
.input-new-tag{ margin-left: 10px;}
.input-new-tag{ margin-left: 10px;}
// .el-tag + .el-tag{ margin-left: 10px;}
.selptips{ line-height: 26px; height: 26px; color: #666;}

</style>
