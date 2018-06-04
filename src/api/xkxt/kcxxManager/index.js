import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/test/kcxx/kcxxpage',
    method: 'get',
    params: query
  });
}


export function delObj(query) {
  return fetch({
    url: '/test/kcxx/delKcxx',
    method: 'delete',
    params: query
  });
}


export function getXnlist(query) {
  return fetch({
    url: '/test/kcxx/getXnlist',
    method: 'get',
    params: query
  });
}

export function getKcxxhistory(query) {
  return fetch({
    url: '/test/kcxx/getKcxxhistory',
    method: 'get',
    params: query
  });
}



export function getAll(query) {
  return fetch({
    url: '/test/kcxx/getAddAll',
    method: 'get',
    params: query
  });
}


export function copykc(query) {
  return fetch({
    url: '/test/kcxx/fzkc',
    method: 'post',
    data: query
  });
}


export function saveaddkcxx(query) {
  return fetch({
    url: '/test/kcxx/savekcxx',
    method: 'post',
    data: query
  });
}


