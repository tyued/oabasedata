import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/admin/kcxx/pagelist',
    method: 'post',
    data: query
  });
}


export function delObj(query) {
  return fetch({
    url: '/api/admin/kcxx/delKcxx',
    method: 'post',
    data: query
  });
}


export function getXnlist(query) {
  return fetch({
    url: '/api/admin/kcxx/getXnlist',
    method: 'get',
    params: query
  });
}

export function getKcxxhistory(query) {
  return fetch({
    url: '/api/admin/kcxx/getKcxxhistory',
    method: 'get',
    params: query
  });
}



export function getAll(query) {
  return fetch({
    url: '/api/admin/kcxx/getAddAll',
    method: 'get',
    params: query
  });
}


export function copykc(query) {
  return fetch({
    url: '/api/admin/kcxx/fzkc',
    method: 'post',
    data: query
  });
}

export function ck(query) {
  return fetch({
    url: '/api/admin/kcxx/ckkcxx',
    method: 'get',
    params: query
  });
}


export function savexg(query) {
  return fetch({
    url: '/api/admin/kcxx/bcxg',
    method: 'post',
    data: query
  });
}


export function newPicture(datas) {
  return fetch({
    url: '/api/admin/kcxx/sctpS',
    method: 'post',
    data: datas
  });
}



export function saveaddkcxx(query) {
  return fetch({
    url: '/api/admin/kcxx/savekcxx',
    method: 'post',
    data: query
  });
}


