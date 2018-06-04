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
export function stuXspage(query) {
  return fetch({
    url: '/api/base/jcXsjbsj/xspage',
    method: 'get',
    params: query
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
