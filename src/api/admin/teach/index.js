import fetch from 'utils/fetch';

export function teacherAll(query) {
  return fetch({
    url: '/api/base/jcJzgjbsj/all',
    method: 'get',
    params: query
  });
}

export function teacherpage(query) {
  return fetch({
    url: '/api/base/jcJzgjbsj/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/base/jcJzgjbsj',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/base/jcJzgjbsj/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/base/jcJzgjbsj/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/base/jcJzgjbsj/' + id,
    method: 'put',
    data: obj
  })
}
