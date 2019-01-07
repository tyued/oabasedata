<template>

  <el-row class="headerbardialog">
    <div class='hdlg ' style="min-width:210px;float:left;">
      <div class="logo"><img :src="avatar"/></div>
      <div class="schoolname">{{infoxxmc}}</div>
    </div>
    <div style="float:left; position: absolute; left:230px; right:230px; min-width:250px;">
      <div class="header-menu" :class="{on:moreClick}">
        <div class='submenu' v-for="(item,index) in permissionMenus" :index="item.title" :key="index"
            :class="{on:(sidebarcurMenuId==item.id)}" @click="submenuClick(item)">
          <div class="submenu-img"><i :class="item.icon"></i></div>
          <div class='submenu-title'>{{item.title}}</div>
        </div>
      </div>
      <div class="menu-more" @click="moreClick=!moreClick">
        <div class="submenu-img"><i class="el-icon-more"></i></div>
        <div class='submenu-title'>更多</div>
      </div>
    </div>
    <div style="min-width:210px;float:right;">
      <el-dropdown class="avatar-container" trigger="click">
        <!-- <div class="avatar-wrapper"> <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'"> <i class="el-icon-caret-bottom"></i> </div> -->
        <div class="avatar-wrapper">
          <screenfull class='screenfull'></screenfull>
          <span class="Topusername">{{username}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link class='inlineBlock' to="/">
            <el-dropdown-item> 首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided><span @click="grzl" style="display:block;">个人资料</span></el-dropdown-item>
          <el-dropdown-item divided><span @click="xgmm" style="display:block;">修改密码</span></el-dropdown-item>
          <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="avatar-line"></div>
      <div class="avatar-help"><i class="el-icon-question"></i></div>
      <!--个人资料-->
      <el-dialog class="headerdilog"
                :visible.sync="dialogFormGrzl"
                append-to-body
                title="个人资料"
                width="29%" @close="colseDialog">
        <el-form label-width="120px" style="">
          <el-form-item label="当前学年学期">
            <span>{{dqxn}}{{dqxq}}</span>
          </el-form-item>
          <el-form-item label="用户名">
            <span>{{yhm}}</span>
          </el-form-item>
          <el-form-item label="姓名">
            <span>{{username}}</span>
          </el-form-item>
          <el-form-item label="所在学校">
            <span>{{xxmc}}</span>
          </el-form-item>
          <el-form-item label="用户类型">
            <span>{{type}}</span>
          </el-form-item>
          <el-form-item label="用户角色">
            <span>{{jsmc}}</span>
          </el-form-item>
          <el-form-item label="所在部门">
            <span>{{szbmmc}}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="colseDialog">关闭</el-button>
        </div>
      </el-dialog>

      <!--修改密码-->
      <el-dialog :visible.sync="dialogFormXgmm"
                 width="29%"
                 append-to-body
                 title="密码修改"
                 @close="colseDialog">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="80px">
          <el-form-item label="用户名">
            <span>{{yhm}}</span>
          </el-form-item>
          <el-form-item label="密 码" placeholder="请输入密码" prop="oldmm">
            <el-input type="password" v-model="dataForm.oldmm" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item required label="新密码" placeholder="请输入密码" prop="newmm">
            <el-input type="password" v-model="dataForm.newmm" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item required label="确认密码" placeholder="请输入密码" prop="confirm_mm">
            <el-input type="password" v-model="dataForm.confirm_mm" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('dataForm')">重置</el-button>
          <!--保存-->
          <el-button type="primary" @click="updateData('dataForm')">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </el-row>

</template>
<script>
  import { mapGetters } from 'vuex';
  import Screenfull from 'components/Screenfull';
  import { dqxnxqObj } from '@/api/pkxt/arrangingTask/index';
  import { getJsBm } from '@/api/admin/group/index';
  import { updateMM } from '@/api/admin/user/index';

  export default {
    name: 'Headerbar',
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'infoxxmc',
        'sidebar',
        'permissionMenus',
        'sidebarcurMenuId'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    components: {
      Screenfull
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 5 || value.length > 20) {
          callback(new Error('长度在 5 到 20 个字符'));
        } else {
          if (this.dataForm.confirm_mm !== '') {
            this.$refs.dataForm.validateField('confirm_mm');
          }
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 5 || value.length > 20) {
          callback(new Error('长度在 5 到 20 个字符'));
        } else if (value !== this.dataForm.newmm) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        userid: '',
        username: '',
        xxdm: '',
        xxmc: '',
        yhm: '',
        type: '',
        jsmc: '',
        szbmmc: '',
        curCode: '',
        pathChange: '',
        moreClick: false,
        avatarImg: '',
        dialogFormGrzl: false,
        dialogFormXgmm: false,
        dqxn: '',
        dqxq: '',
        typeObject: [
          { typeid: '1', typemc: '系统管理员' },
          { typeid: '2', typemc: '学校管理员' },
          { typeid: '3', typemc: '普通老师' },
          { typeid: '4', typemc: '学生' }
        ],
        dataForm: {
          oldmm: '',
          newmm: '',
          confirm_mm: ''
        },
        rules: {
          oldmm: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
          ],
          newmm: [
            { validator: validatePass, trigger: 'blur' }
          ],
          confirm_mm: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    watch: {},
    created() {
      this.username = this.$store.getters.name;
      this.xxdm = window.localStorage.getItem('xxdm');
      this.xxmc = window.localStorage.getItem('xxmc');
      this.yhm = window.localStorage.getItem('username');
      this.userid = window.localStorage.getItem('userid');
      const lx = window.localStorage.getItem('lguserType');
      this.type = _.find(this.typeObject, { typeid: lx }).typemc;
      // this.avatarImg = this.$store.getters.avatar
      // this.$store.dispatch('SetCurMenu',this.curCode)
      // var that = this
      // this.permissionMenus.forEach(function(item,index){
      //     if(item.code==that.curCode){
      //         that.$store.dispatch('SetCurMenuId',item.id)
      //     }
      // })
    },
    methods: {
      submenuClick(item) {
        this.$store.dispatch('ToggleSideBar', { curMenu: item.code })
        this.$store.dispatch('SetCurMenu', item.code)
        this.$store.dispatch('SetCurMenuId', item.id)
        const that = this
        this.pathChild(item)
        this.$router.push({ path: that.pathChange });
        // var curCodeList =this.$route.path.split("/")
        // this.curCode = curCodeList[1];
        this.moreClick = false
      },
      pathChild(item) {
        if (item.children && item.children.length > 0) {
          this.pathChange = '/' + item.code
          this.pathChild(item.children[0])
        } else {
          this.pathChange = this.pathChange + '/' + item.code
        }
      },
      grzl() {
        this.dialogFormGrzl = true;
        dqxnxqObj({ xxdm: this.xxdm }).then(response => {
          this.dqxn = response.xn + '学年';
          this.dqxq = response.xq === '01' ? '上学期' : '下学期';
        })
        this.jsmc = '';
        this.szbmmc = '';
        // 获取角色
        this.getJsBm('js');
        // 获取所在部门
        this.getJsBm('bm');
      },
      getJsBm(val) {
        if (val === 'js') {
          getJsBm({ userid: this.userid, groupType: '1' }).then(response => {
            if (response.length > 0) {
              for (let i = 0; i < response.length; i++) {
                if (i > 0) {
                  this.jsmc += '，';
                }
                this.jsmc += response[i].name;
              }
            }
          })
        } else {
          getJsBm({ userid: this.userid, groupType: '2' }).then(response => {
            if (response.length > 0) {
              for (let i = 0; i < response.length; i++) {
                if (i > 0) {
                  this.szbmmc += '，';
                }
                this.szbmmc += response[i].name;
              }
            }
          })
        }
      },
      xgmm() {
        this.dialogFormXgmm = true;
      },
      colseDialog() {
        this.dialogFormGrzl = false;
        this.dialogFormXgmm = false;
      },
      updateData(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.dataForm.id = this.userid;
            updateMM(this.dataForm).then(res => {
              if (res.status === 200) {
                this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
                setTimeout(() => {
                  this.dialogFormXgmm = false;
                }, 1500);
              } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
                return false;
              }
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      logout() {
        this.$store.dispatch('SetCurMenuId', 'dashboard')
        this.$store.dispatch('LogOut').then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
      position: relative;
    }
  }

  .header-menu {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;
    height: 100px;
    background: rgb(31, 45, 61);
    border-bottom: none;
    color: #fff;
    overflow: hidden;
    // white-space: nowrap;
    position: relative;
    margin-right: 120px;
    &.on {
      height: auto;
    }
    .submenu {
      cursor: pointer;
      width: 120px;
      height: 100px;
      padding-top: 25px;
      float: left;
      box-sizing: border-box;
      // display:inline-block;
      cursor: pointer;
      &.on {
        border-bottom: 3px solid #409eff;
        .submenu-title {
          color: #fff;
        }
      }
    }
  }

  .submenu-img {
    width: 30px;
    height: 30px;
    margin: 0 auto;
    text-align: center;
    i {
      display: block;
      width: 100%;
      height: 100%;
      font-size: 18px;
      line-height: 30px;
    }
    .navico_1 {
      background: url(../../assets/nav_images/navico_1.png);
    }
    .navico_2 {
      background: url(../../assets/nav_images/navico_2.png);
    }
    .navico_3 {
      background: url(../../assets/nav_images/navico_3.png);
    }
    .navico_4 {
      background: url(../../assets/nav_images/navico_4.png);
    }
    .navico_5 {
      background: url(../../assets/nav_images/navico_5.png);
    }
    .navico_6 {
      background: url(../../assets/nav_images/navico_6.png);
    }
    .navico_7 {
      background: url(../../assets/nav_images/navico_7.png);
    }
    .navico_8 {
      background: url(../../assets/nav_images/navico_8.png);
    }
    .navico_9 {
      background: url(../../assets/nav_images/navico_9.png);
    }
    .navico_10 {
      background: url(../../assets/nav_images/navico_10.png);
    }
    .navico_11 {
      background: url(../../assets/nav_images/navico_11.png);
    }
  }

  .submenu {
    &.on {
      .navico_1 {
        background: url(../../assets/nav_images/navico_on_1.png);
      }
      .navico_2 {
        background: url(../../assets/nav_images/navico_on_2.png);
      }
      .navico_3 {
        background: url(../../assets/nav_images/navico_on_3.png);
      }
      .navico_4 {
        background: url(../../assets/nav_images/navico_on_4.png);
      }
      .navico_5 {
        background: url(../../assets/nav_images/navico_on_5.png);
      }
      .navico_6 {
        background: url(../../assets/nav_images/navico_on_6.png);
      }
      .navico_7 {
        background: url(../../assets/nav_images/navico_on_7.png);
      }
      .navico_8 {
        background: url(../../assets/nav_images/navico_on_8.png);
      }
      .navico_9 {
        background: url(../../assets/nav_images/navico_on_9.png);
      }
      .navico_10 {
        background: url(../../assets/nav_images/navico_on_10.png);
      }
      .navico_11 {
        background: url(../../assets/nav_images/navico_on_11.png);
      }
    }

  }

  .submenu-title {
    width: 100%;
    text-align: center;
    color: #cccccc;
    line-height: 36px;
  }

  .menu-more {
    position: absolute;
    right: 0;
    top: 0;
    width: 120px;
    height: 100%;
    padding-top: 25px;
    color: #fff;
    cursor: pointer;
  }

  .avatar-help {
    float: right;
    color: #409eff;
    font-size: 24px;
    line-height: 100px;
  }

  .avatar-line {
    border-right: 1px solid rgba(255, 255, 255, .3);
    height: 30px;
    float: right;
    margin: 35px 30px;
  }

  .avatar-container {
    float: right;
    height: 100px;
    line-height: 100px;
    color: #fff;
    padding-right: 20px;
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        // top: 25px;
        top: 0;
        line-height: 100px;
        font-size: 12px;
      }
    }
  }

  ::-webkit-scrollbar {
    width: 12px;
    background-color: #324157;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #555;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }
</style>
<style>
  .headerbardialog .el-dialog .el-input__inner {
    width: 250px;
  }

  .headerbardialog .el-dialog {
    min-width: 400px !important;
  }

  .headerbardialog .el-dialog__footer {
    padding: 0 20px 20px !important;
    margin-top: -40px !important;
  }
</style>
