import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/test/xkxtxkrw/list',
    method: 'get',
    params: query
  });
}

export function checkUnique(query) {
  return fetch({
    url: '/test/xkxtxkrw/cxKclbxx',
    method: 'get',
    params: query
  });
}


export function all(query) {
  return fetch({
    url: '/test/xkxtxkrw/page',
    method: 'get',
    params: query
  });
}

export function get(query) {
  return fetch({
    url: '/test/xkxtxkrw/' + query,
    method: 'get'
  });
}

export function post(query) {
  return fetch({
    url: '/test/xkxtxkrw/saveXkrw',
    method: 'post',
    data: query
  });
}

export function put(id, query) {
  return fetch({
    url: '/test/xkxtxkrw/' + id,
    method: 'put',
    data: query
  })
}

export function del(query) {
  return fetch({
    url: '/test/xkxtxkrw/' + query,
    method: 'delete'
  });
}

export function getKclx(query) {
  return fetch({
    url: '/test/xkxtxkrw/getKclx',
    method: 'get',
    params: query
  });
}

export function getKcxx(query) {
  return fetch({
    url: '/test/xkxtxkrw/getKcxx',
    method: 'get',
    params: query
  });
}

export function addKcxx(query) {
  return fetch({
    url: '/test/xkxtxkrw/addKcxx',
    method: 'post',
    data: query
  });
}

export function deleteKcxx(query) {
  return fetch({
    url: '/test/xkxtxkrw/deleteKcxx',
    method: 'post',
    data: query
  });
}

export function getGzszXkkc(query) {
  return fetch({
    url: '/test/xkxtxkrw/getGzszXkkc',
    method: 'get',
    params: query
  });
}

export function addGzszHckc(query) {
  return fetch({
    url: '/test/xkxtxkrw/addGzszHckc',
    method: 'post',
    data: query
  });
}

export function getHckcList(query) {
  return fetch({
    url: '/test/xkxtxkrw/getHckcList',
    method: 'get',
    params: query
  });
}

export function deleteHckc(query) {
  return fetch({
    url: '/test/xkxtxkrw/deleteHckc',
    method: 'get',
    params: query
  });
}

export function getGzszXklb(query) {
  return fetch({
    url: '/test/xkxtxkrw/getGzszXklb',
    method: 'get',
    params: query
  });
}


export function addGzszBxkc(query) {
  return fetch({
    url: '/test/xkxtxkrw/addGzszBxkc',
    method: 'post',
    data: query
  });
}

export function getBxkcList(query) {
  return fetch({
    url: '/test/xkxtxkrw/getBxkcList',
    method: 'get',
    params: query
  });
}

export function saveGzsz(query) {
  return fetch({
    url: '/test/xkxtxkrw/saveGzsz',
    method: 'post',
    data: query
  });
}


export function deleteBxkc(query) {
  return fetch({
    url: '/test/xkxtxkrw/deleteBxkc',
    method: 'get',
    params: query
  });
}

export function getXktjzdks(query) {
  return fetch({
    url: '/test/xkxtxkrw/getXktjzdks',
    method: 'get',
    params: query
  });
}
