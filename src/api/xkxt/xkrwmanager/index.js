import fetch from 'utils/fetch';

//获取学年列表
export function getxnList(query) {
  return fetch({
    url: '/api/base/jcXndm/queryXnList',
    method: 'get',
    params: query
  });
}
//获取学期列表
export function getxqList(query) {
  return fetch({
    url: '/api/base/jcXqdm/queryXqList',
    method: 'get',
    params: query
  });
}
export function page(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/list',
    method: 'post',
    data: query
  });
}

export function checkUnique(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/cxKclbxx',
    method: 'get',
    params: query
  });
}


export function all(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/page',
    method: 'get',
    params: query
  });
}

export function get(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/' + query,
    method: 'get'
  });
}

export function post(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/saveXkrw',
    method: 'post',
    data: query
  });
}

export function put(id, query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/' + id,
    method: 'put',
    data: query
  })
}

export function del(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/' + query,
    method: 'delete'
  });
}

export function getKclx(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/getKclx',
    method: 'get',
    params: query
  });
}

export function getKcxx(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/getKcxx',
    method: 'get',
    params: query
  });
}

export function addKcxx(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/addKcxx',
    method: 'post',
    data: query
  });
}

export function deleteKcxx(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/deleteKcxx',
    method: 'post',
    data: query
  });
}

export function getGzszXkkc(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/getGzszXkkc',
    method: 'get',
    params: query
  });
}

export function addGzszHckc(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/addGzszHckc',
    method: 'post',
    data: query
  });
}

export function getHckcList(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/getHckcList',
    method: 'get',
    params: query
  });
}

export function deleteHckc(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/deleteHckc',
    method: 'get',
    params: query
  });
}

export function getGzszXklb(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/getGzszXklb',
    method: 'get',
    params: query
  });
}


export function addGzszBxkc(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/addGzszBxkc',
    method: 'post',
    data: query
  });
}

export function getBxkcList(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/getBxkcList',
    method: 'get',
    params: query
  });
}

export function saveGzsz(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/saveGzsz',
    method: 'post',
    data: query
  });
}


export function deleteBxkc(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/deleteBxkc',
    method: 'get',
    params: query
  });
}

export function getXktjzdks(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/getXktjzdks',
    method: 'get',
    params: query
  });
}

export function sendXktz(query) {
  return fetch({
    url: '/api/admin/xkxtxkrw/sendXktz',
    //url: '/test/xkxtxkrw/sendXktz',
    method: 'post',
    data: query
  });
}
