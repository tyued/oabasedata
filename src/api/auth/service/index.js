import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/auth/service/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/auth/service',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/auth/service/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/auth/service/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/auth/service/' + id,
    method: 'put',
    data: obj
  })
}

export function getClients(id) {
  return fetch({
    url: '/api/auth/service/' + id + '/client',
    method: 'get'
  })
}

export function modifyClients(id, data) {
  return fetch({
    url: '/api/auth/service/' + id + '/client',
    method: 'put',
    params: data
  })
}

export function buildProject(id, packageName) {
  const data = { id, packageName };
  return fetch({
    url: '/api/auth/generator/build',
    method: 'post',
    params: data,
    responseType: 'blob' // 表明返回服务器返回的数据类型'
  })
}