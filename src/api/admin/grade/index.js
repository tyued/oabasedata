import fetch from 'utils/fetch';

export function gradepage(query) {
  return fetch({
    url: '/api/base/jcNjsjlx/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/base/jcNjsjlx',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/base/jcNjsjlx/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/base/jcNjsjlx/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/base/jcNjsjlx/' + id,
    method: 'put',
    data: obj
  })
}
