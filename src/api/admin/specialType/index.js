import fetch from 'utils/fetch';

export function placeAll(query) {
  return fetch({
    url: '/api/admin/xkxtXslxb/all',
    method: 'get',
    params: query
  });
}
export function page(query) {
  return fetch({
    url: '/api/admin/xkxtXslxb/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/admin/xkxtXslxb',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/xkxtXslxb/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/xkxtXslxb/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/xkxtXslxb/' + id,
    method: 'put',
    data: obj
  })
}
