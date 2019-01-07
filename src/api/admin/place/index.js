import fetch from 'utils/fetch';

export function placeAll(query) {
  return fetch({
    url: '/api/base/jcCdsj/all',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/base/jcCdsj/page',
    method: 'get',
    params: query
  });
}

// 模糊查询
export function fuzzyQuery(query) {
  return fetch({
    url: '/api/base/jcCdsj/fuzzyQuery',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/base/jcCdsj',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/base/jcCdsj/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/base/jcCdsj/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/base/jcCdsj/' + id,
    method: 'put',
    data: obj
  })
}
