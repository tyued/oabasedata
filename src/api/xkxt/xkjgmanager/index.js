import fetch from 'utils/fetch';

export function xsxxPage(query) {
  return fetch({
    url: '/test/xkjg/xsxxList',
    method: 'get',
    params: query
  });
}

export function kcxxPage(query) {
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

export function copyXkxx(query) {
  return fetch({
    url: '/test/xkjg/copyXkxx',
    method: 'get',
    params: query
  });
}

export function getXkmdUrl(query) {
  return fetch({
    url: '/test/xkjg/getXkmdUrl',
    method: 'get',
    params: query
  });
}

export function sendXktz(query) {
  return fetch({
    url: '/test/xkjg/sendXktz',
    method: 'post',
    data: query
  });
}




