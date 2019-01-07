import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/admin/xkjg/kcxxList',
    method: 'post',
    data: query
  });
}

export function ckxkjg(query) {
  return fetch({
    url: '/api/admin/xkjg/ckxkjg',
    method: 'post',
    data: query
  });
}

export function tzXsxkxx(query) {
  return fetch({
    url: '/api/admin/xkjg/tzXsxkxx',
    method: 'post',
    data: query
  });
}

export function cxXsxkjg(query) {
  return fetch({
    url: '/api/admin/xkjg/cxXsxkjg',
    method: 'post',
    data: query
  });
}


