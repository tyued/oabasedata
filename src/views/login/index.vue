<template>
  <div class="login-container">
    <el-form auto-complete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
      <h3 class="title">{{title}}</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <icon-svg icon-class="jiedianyoujian"></icon-svg>
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" auto-complete="off" placeholder="超管账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <icon-svg icon-class="mima"></icon-svg>
        </span>
        <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" auto-complete="off" placeholder="超管密码"></el-input>
      </el-form-item>
      <el-form-item prop="othername" v-if="loginForm.simulationFlag" >
        <span class="svg-container">
          <icon-svg icon-class="mima"></icon-svg>
        </span>
        <el-input name="othername" type="text" v-model="loginForm.othername" auto-complete="off" placeholder="对方账户"></el-input>
      </el-form-item>
      <el-form-item prop="yzm" v-if="error_count>=3">
         <span class="svg-container">
          <icon-svg icon-class="mima"></icon-svg>
         </span>
        <!-- <el-input style="width: 45%" name="yzm" type="text" v-model="loginForm.yzm" autocomplete="off" placeholder="验证码"></el-input>
        <span class="svg-container">
           <img ref = "kaptcha_img" alt="验证码" onclick="this.src='/api/auth/jwt/defaultKaptcha?d='+ new Date() * 1" src="/api/auth/jwt/defaultKaptcha" />
        </span> -->
      </el-form-item>
      <!-- 后面添加参数起到清除缓存作用 -->

      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button style="width:100%;" @click.native.prevent="changeView">
          {{ buttencontent }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { lga, getvalidateYzm } from 'api/login';
export default {
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        callback();
      }
    };
    /** 验证码验证**/
    const validateYzm = (rule, value, callback) => {
      // if (value.length < 0) {
      //   callback(new Error('验证码不能为空'));
      // } else {
      //   getvalidateYzm({ yzm: value }).then(res => {
      //     if (res.data) {
      //       callback();
      //     } else {
      //       callback(new Error('验证码不正确'));
      //     }
      //   });
      // }
    };
    return {
      title: '系统登录',
      buttencontent: '模拟登录',
      loginForm: {
        username: '',
        password: '',
        kaptcha: '',
        othername: '',
        simulationFlag: false
      },
      loginRules: {
        username: [
          {
            required: true,
            message: '账户不能为空',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePass
          }
        ],
        kaptcha: [
          {
            required: false,
            trigger: 'blur',
            // validator: validateYzm
          }
        ],
        othername: [
          {
            required: true,
            trigger: 'blur',
            message: '账户不能为空'
          }
        ]
      },
      loading: false,
      showDialog: false,
      error_count: 0
    };
  },
  methods: {
    changeView() {
      this.loginForm.simulationFlag = !this.loginForm.simulationFlag;
      if (this.loginForm.simulationFlag) {
        this.title = '模拟登录'
        this.buttencontent = '返回系统登录'
      } else {
        this.title = '系统登录'
        this.buttencontent = '返回模拟登录'
      }
    },
    handleLogin() {
      // if (!this.loginForm.simulationFlag) {
      //   this.$refs.loginForm.validate(valid => {
      //     if (valid) {
            this.loading = true;
            this.$store
                .dispatch('loginByEmailadmin', this.loginForm)
                .then(res => {
                  console.log(res)
                  if (res.status !== 200) {
                    this.error_count = res.status;
                    this.$refs.kaptcha_img.click();
                  }
                  this.loading = false;
                  this.$router.push({
                    path: '/'
                  });
                })
                .catch(() => {
                  this.loading = false;
                });
        //   } else {
        //     console.log('error submit!!');
        //     return false;
        //   }
        // });
        // return;
      // }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
              .dispatch('LoginByEmail', this.loginForm)
              .then(res => {
                this.loading = false;
                this.$router.push({
                  path: '/'
                });
              })
              .catch(() => {
                this.loading = false;
              });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1);
      // const hashObj = getQueryObject(hash);
      // const originUrl = window.location.origin;
      // history.replaceState({}, '', originUrl);
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // };
      // const codeName = hashObj[codeMap[this.auth_type]];
      // if (!codeName) {
      //   alert('第三方登录失败');
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' });
      //   });
      // }
    },
    _getQueryId(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      const r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return '';
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan);
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan);
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import 'src/styles/mixin.scss';
.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 5px;
}

.login-container {
  @include relative;
  height: 100vh;
  background-color: #2d3a4b;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 0;
    -webkit-appearance: none;
    border-radius: 0;
    padding: 12px 5px 12px 15px;
    color: #eeeeee;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: #eeeeee;
    margin: 0 auto 40px;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px;
    margin: 120px auto;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .forget-pwd {
    color: #fff;
  }
}
</style>
