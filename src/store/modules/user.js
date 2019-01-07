import {
  loginByEmail,
  loginByEmailadmin,
  logout
} from 'api/login';
import {
  getInfo,
  getMenus
} from 'api/logininfo';
import {
  getToken,
  setToken,
  removeToken
} from 'utils/auth';
import {
  getDict
} from 'api/dict';
import {
  Message
} from 'element-ui';
const user = {

  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    xxmc: '',
    avatar: '',
    introduction: '',
    roles: [],
    menus: undefined,
    elements: undefined,
    permissionMenus: undefined,
    setting: {
      articlePlatform: []
    },
    dict: [],
    dictionary: [], // 通用字典json

    dynamicTagschange: [],
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_XXMC: (state, xxmc) => {
      state.xxmc = xxmc;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    SET_ELEMENTS: (state, elements) => {
      state.elements = elements;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    },
    SET_PERMISSION_MENUS: (state, permissionMenus) => {
      state.permissionMenus = permissionMenus;
    },

    SET_DICT: (state, type) => {
      state.dict = type;
    },

    SET_dynamicTagschange: (state, type) => {
      state.dynamicTagschange = type;
    },

  },

  actions: {
    // 邮箱登录
    LoginByEmail({
      commit
    }, userInfo) {
      const username = userInfo.username.trim();
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      commit('SET_MENUS', undefined);
      commit('SET_ELEMENTS', undefined);
      removeToken();
      return new Promise((resolve, reject) => {
        // var tokenTest = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6IjEiLCJ1c2VyTmFtZSI6IlnlhYjnlJ8iLCJleHBpcmUiOjE1MjA4NDk1MDMzNzV9.H4LzMRClyChB4hh7W7ouvwNiNol6sHa6n5w3eTMmty_ePbKJ8Nkq0rkh9zS9FzKTr4sg5iIaE-aIoU2XiE19qmdtbMMIaeAI9gSBI913j3ecwdw8jDI4ngEshKJqlc-k30L3Os5VT507v1rdyNt5aLolx5itO7QjKWsDbOurcxI"

        // setToken(tokenTest);
        // commit('SET_TOKEN',tokenTest);
        // resolve();

        loginByEmail(username, userInfo.password, userInfo.othername).then(response => {
          const data = response;
          if (data.status === 500) {
            Message({
              message: '账户或密码错误！',
              type: 'warning'
            });
            resolve(response);
            return Promise.reject('error');
          } else {
            if (data.data === '') {
              Message({
                message: '账户或密码错误！',
                type: 'warning'
              });
            }
            setToken(data.data);
            commit('SET_TOKEN', data.data);
            resolve(response);
          }
        }).catch(error => {
          console.log(error);
          reject(error);
        });
      });
    },
    // 邮箱登录
    loginByEmailadmin({
      commit
    }, userInfo) {
      const username = userInfo.username.trim();
      const kaptcha = userInfo.kaptcha;
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      commit('SET_MENUS', undefined);
      commit('SET_ELEMENTS', undefined);
      removeToken();
      return new Promise((resolve, reject) => {
        loginByEmailadmin(username, userInfo.password, kaptcha).then(response => {
          const data = response;
          if (data.status === 200 && data.data !== '') {
            setToken(data.data);
            commit('SET_TOKEN', data.data);
            resolve(response);
          } else {
            Message({
              message: data.message,
              type: 'warning'
            });
            resolve(response);
            return Promise.reject('error');
          }
          resolve(response);
        }).catch(error => {
          console.log('token99999999')
          reject(error);
        });
      });
    },
    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response;
          // 首页识别
          sessionStorage.setItem('unitCode', data.type);
          // window.localStorage.setItem('lguserType', data.type);
          commit('SET_ROLES', 'admin');
          commit('SET_NAME', data.name);
          commit('SET_AVATAR', data.image);
          commit('SET_XXMC', data.xxmc);
          commit('SET_INTRODUCTION', data.description);
          const menus = {};
          for (let i = 0; i < data.menus.length; i++) {
            menus[data.menus[i].code] = true;
          }
          // console.log(data);
          commit('SET_MENUS', menus);
          const elements = {};
          for (let i = 0; i < data.elements.length; i++) {
            elements[data.elements[i].code] = true;
          }
          commit('SET_ELEMENTS', elements);
          // console.log(response)
          resolve(response);
        }).catch(error => {
          reject(error);
        });
        getMenus(state.token).then(response => {
          // console.log("11111111111111111")
          commit('SET_PERMISSION_MENUS', response);
        });
      });
    },

    // 第三方验证登录
    LoginByThirdparty({
      commit,
      state
    }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', code);
        loginByThirdparty(state.status, state.email, state.code).then(response => {
          commit('SET_TOKEN', response.data.token);
          setToken(response.data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          commit('SET_MENUS', undefined);
          commit('SET_ELEMENTS', undefined);
          commit('SET_PERMISSION_MENUS', undefined);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        commit('SET_MENUS', undefined);
        commit('SET_ELEMENTS', undefined);
        commit('SET_PERMISSION_MENUS', undefined);
        removeToken();
        resolve();
      });
    },

    // 动态修改权限
    ChangeRole({
      commit
    }, role) {
      return new Promise(resolve => {
        commit('SET_ROLES', [role]);
        commit('SET_TOKEN', role);
        setToken(role);
        resolve();
      })
    },

    // 本地json文件
    GetDict({
      commit
    }) {
      return new Promise(resolve => {
        getDict().then(response => {
          commit('SET_DICT', response.data);

          resolve(response);
        }).catch(error => {
          console.log(error);
          // reject(error);
        });
      })
    },

    get_dynamicTagschange: ({
      commit
    }, view) => {
      commit('SET_dynamicTagschange', view)
    }



  }
};

export default user;
