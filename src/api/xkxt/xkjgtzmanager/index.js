import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/test/xkjg/kcxxList',
    method: 'get',
    params: query
  });
}

export function ckxkjg(query) {
  return fetch({
    url: '/test/xkjg/ckxkjg',
    method: 'get',
    params: query
  });
}

export function tzXsxkxx(query) {
  return fetch({
    url: '/test/xkjg/tzXsxkxx',
    method: 'post',
    data: query
  });
}

export function cxXsxkjg(query) {
  return fetch({
    url: '/test/xkjg/cxXsxkjg',
    method: 'get',
    params: query
  });
}


