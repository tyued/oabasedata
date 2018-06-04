import fetch from 'utils/fetch';

export function classpage(query) {
  return fetch({
    url: '/api/base/jcBjsj/page',
    method: 'get',
    params: query
  });
}
export function classBjpage(query) {
  return fetch({
    url: '/api/base/jcBjsj/bjpage',
    method: 'get',
    params: query
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/base/jcBjsj/' + id,
    method: 'get'
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/base/jcBjsj',
    method: 'post',
    data: obj
  });
}

export function delObj(id) {
  return fetch({
    url: '/api/base/jcBjsj/' + id,
    method: 'delete'
  })
}
export function putObj(id, obj) {
  return fetch({
    url: '/api/base/jcBjsj/' + id,
    method: 'put',
    data: obj
  })
}