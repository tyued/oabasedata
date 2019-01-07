import axios from 'axios';
import store from '../store';
import { Message, MessageBox } from 'element-ui';
import { getToken } from 'utils/auth';

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  // baseURL: process.env.BASE_API,
  timeout: 20000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers.Authorization = getToken(); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    if (!getToken()) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      })
    }
  }
  return config;
}, error => {
  // Do something with request error
  // console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
    const res = response.data;
    if (response.status === 401 || res.status === 40101) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      })
      return Promise.reject('error');
    }
    if (res.status === 40301) {
      Message({
        message: '当前用户无相关操作权限！',
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject('error');
    }
    if (response.status !== 200 && res.status !== 200) {
      console.log('respone拦截器')
      Message({
        message: '请刷新页面',
        type: 'error',
        duration: 5 * 1000
      });
    } else {
      // if (response.headers['content-type'] === '"application/octet-stream; charset=UTF-8"') {
      //   return response;
      // }
      return response.data;
    }
  },
  error => {
    if (error.response.request.responseType == 'arraybuffer') {
      const array = error.response.data;
      const blob = new Blob([array]);
      const reader = new FileReader();
      reader.readAsText(blob, 'utf-8');
      reader.onload = function(e) {
        Message({
          message: reader.result,
          type: 'error',
          duration: 5 * 1000
        });
      }
    } else {
      let message = error.message;
      if (error.response && error.response.data) {
        message = error.response.data;
        const status = error.response.status;
        if (status === 401) {
          Message({
            message: '请重新登录',
            type: 'warning',
            duration: 5 * 1000
          });
        }else{
          Message({
            message: message,
            type: 'error',
            duration: 5 * 1000
          });
        }
      }
    }
    return Promise.reject(error);
  }
);

export default service;
