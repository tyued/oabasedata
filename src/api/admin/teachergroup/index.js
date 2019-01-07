import fetch from 'utils/fetch';

//获取教师组分页信息
export function page(query) {
  return fetch({
    url: '/api/base/jcJszb/page',
    method: 'get',
    params: query
  });
}

// 增加教师组信息
export function addObj(obj) {
  return fetch({
    url: '/api/base/jcJszb',
    method: 'post',
    data: obj
  });
}

// 获取教师组信息
export function getObj(query) {
  return fetch({
    url: '/api/base/jcJszb/getJszxx',
    method: 'post',
    data: query
  });
}

// 更新教师组信息
export function putObj(obj) {
  return fetch({
    url: '/api/base/jcJszb/updateJszxx',
    method: 'post',
    data: obj
  })
}

// 删除教师组信息
export function delJszxx(obj) {
  return fetch({
    url: '/api/base/jcJszb/delJszxx',
    method: 'post',
    data: obj
  })
}

// 获取教师接口
export function getJsAll(query) {
  return fetch({
   url: '/api/base/jcJzgjbsj/selectJsList',
    method: 'get',
    params: query
  });
}

// 获取教师组教师名单
export function getJszJsList(query) {
  return fetch({
     url: '/api/base/jcJszgx/selectJszjsList',
    method: 'get',
    params: query
  });
}

// 添加教师组教师
export function addJszjs(data) {
  return fetch({
   url: '/api/base/jcJszgx/addJszjs',
    method: 'post',
    data: data
  })
}




