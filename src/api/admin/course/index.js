import fetch from 'utils/fetch';

export function courseAll(query) {
  return fetch({
    url: '/api/base/jcKcsj/all',
    method: 'get',
    params: query
  });
}

export function pagelist(query) {
  return fetch({
    url: '/api/base/jcKcsj/pagelist',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/base/jcKcsj/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
   url: '/api/base/jcKcsj',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/base/jcKcsj/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/base/jcKcsj/' + id,
    method: 'delete'
  })
}


export function putObj(id, obj) {
  return fetch({
    url: '/api/base/jcKcsj/' + id,
    method: 'put',
    data: obj
  })
}

export function getAllKcnjgx(query) {
  return fetch({
    url: '/api/base/kcnjGx/selectAll',
    method: 'post',
    data: query
  })
}

export function getKclbByXxdm(query) {
  return fetch({
    url: '/api/admin/kclbwh/getKclbByXxdm',
    method: 'get',
    params: query
  })
}
