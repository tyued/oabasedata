import fetch from 'utils/fetch';

export function studentAll(query) {
  return fetch({
    url: '/api/base/jcXsjbsj/all',
    method: 'get',
    params: query
  });
}

export function stupage(query) {
  return fetch({
    url: '/api/base/jcXsjbsj/page',
    method: 'get',
    params: query
  });
}

// 模糊查询
export function fuzzyQuery(query) {
  return fetch({
    url: '/api/base/jcXsjbsj/fuzzyQuery',
    method: 'get',
    params: query
  });
}

export function stuXspage(query) {
  return fetch({
    url: '/api/base/jcXsjbsj/page',
    method: 'get',
    params: query
  });
}

export function studentImportTemplate(query) {
  return fetch({
    url: '/api/base/jcXsjbsj/studentImportTemplate',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  });
}

export function studentexport(query) {
  return fetch({
    url: '/api/base/jcXsjbsj/export?xxdm=' + query.xxdm,
    method: 'get',
    responseType: 'arraybuffer',
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/base/jcXsjbsj',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/base/jcXsjbsj/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/base/jcXsjbsj/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/base/jcXsjbsj/' + id,
    method: 'put',
    data: obj
  })
}
// 班级树
export function getBjTree(xxdm) {
  return fetch({
    url: '/api/base/jcXsjbsj/getNjBjTree?xxdm=' + xxdm,
    method: 'get'
  })
}
// 重置密码
export function resetSecret(obj) {
  return fetch({
    url: '/api/base/jcXsjbsj/resetPassword',
    method: 'post',
    data: obj
  })
}

// 导入
export function importdata(obj) {
  return fetch({
    url: '/api/base/jcXsjbsj/import',
    method: 'post',
    data: obj
  })
}
