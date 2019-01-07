// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from './router';
import App from './App';
import lodash from 'lodash';

import store from './store';
import ElementUI from 'element-ui';
import Mint from 'mint-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'mint-ui/lib/style.css'
import '../element-variables.scss';
// import 'assets/custom-theme/index.css'; // 换肤版本element-ui css
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条 样式
import 'normalize.css/normalize.css';// normalize.css 样式格式化
import '../static/tinymce/icon/iconfont.css';// normalize.css 样式格式化
import 'assets/iconfont/iconfont'; // iconfont 具体图标见https://github.com/PanJiaChen/vue-element- /wiki
import * as filters from './filters'; // 全局vue filter
import Multiselect from 'vue-multiselect';// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css';// 多选框组件css
import Sticky from 'components/Sticky'; // 粘性header组件
import IconSvg from 'components/Icon-svg';// svg 组件
import vueWaves from './directive/waves';// 水波纹指令
import errLog from 'store/errLog';// error log组件
// import './mock/index.js';  // 该项目所有请求使用mockjs模拟
import { getToken } from 'utils/auth';

// register globally
Vue.component('multiselect', Multiselect);
Vue.component('Sticky', Sticky);
Vue.component('icon-svg', IconSvg)
Vue.use(ElementUI);
Vue.use(vueWaves);
Vue.use(Mint);
Vue.use(lodash);
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

function _getQueryId(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return '';
}

const GetYear = () => {
  const date = new Date()
  let y = ''
  y = date.getFullYear()
  return y
}
const year = GetYear()
store.dispatch('set_batch', GetYear());
window.localStorage.setItem('year', year);

const username = _getQueryId('username')
const password = _getQueryId('password')
if (username && password) {
  store.dispatch('LoginByEmail', { username, password }).then(() => {
    const num = location.href.indexOf(window.location.search)
    // var length = window.location.search.length + num
    const url = location.href.slice(0, num) + '#/projectManager/mainProject'
    window.location.href = url;

    // router.push({
    //   path: '/projectManager/mainProject'
    // });
  }).catch(() => {
    this.loading = false;
  });
}

// register global progress.
const whiteList = ['/login', '/authredirect'];// 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start(); // 开启Progress
  if (getToken()) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (store.getters.menus === undefined) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetDict')

        store.dispatch('GetInfo').then(info => { // 拉取user_info
          
          window.localStorage.setItem('xxdm', info.xxdm);
          window.localStorage.setItem('userid', info.id);
          window.localStorage.setItem('name', info.name);
          window.localStorage.setItem('lguserType', info.type);
          window.localStorage.setItem('usercode', info.usercode);
          window.localStorage.setItem('username', info.username);
          window.localStorage.setItem('xxmc', info.xxmc);
          window.localStorage.setItem('xxbxlxm', info.xxbxlxm);
          store.dispatch('set_schoolCode', info.xxdm);
          // window.localStorage.setItem("xxdm","1438")
          // console.log(info)
          const menus = {};
          for (let i = 0; i < info.menus.length; i++) {
            menus[info.menus[i].code] = true;
          }
          store.dispatch('GenerateRoutes', menus).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            // console.log(store.getters.addRouters);
            // store.dispatch('GetDict').then(res => {
            // })



            next({ ...to }); // hack方法 确保addRoutes已完成
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/login' });
          })
        })
      } else {
        //  else {
        //   // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        //   if (hasPermission(store.getters.roles, to.meta.role)) {
        //     next();//
        //   } else {
        next();
        //   }
        //   // 可删 ↑
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else if (username && password) {
      // next({path: '/projectManager/mainProject'})
    } else {
      // Message({
      //   message: '账户或密码错误！',
      //   type: 'warning'
      // });
      next('/login'); // 否则全部重定向到登录页
      NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});

Vue.config.productionTip = false;

// 生产环境错误日志
if (process.env.NODE_ENV === 'production') {
  Vue.config.errorHandler = function(err, vm) {
    // console.log(err, window.location.href);
    errLog.pushLog({
      err,
      url: window.location.href,
      vm
    })
  };
}

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
