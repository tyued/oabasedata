import fetch from 'utils/fetch';

export function xsxxPage(query) {
  return fetch({
    url: '/api/admin/xkjg/xsxxList',
    // url: '/test/xkjg/xsxxList',
    method: 'post',
    data: query
  });
}

export function kcxxPage(query) {
  return fetch({
   url: '/api/admin/xkjg/kcxxList',
    //  url: '/test/xkjg/kcxxList',
    method: 'post',
    data: query
  });
}

export function ckxkjg(query) {
  return fetch({
    url: '/api/admin/xkjg/ckxkjg',
    // url: '/test/xkjg/ckxkjg',
    method: 'post',
    data: query
  });
}

export function copyXkxx(query) {
  return fetch({
    url: '/api/admin/xkjg/copyXkxx',
    //url: '/test/xkjg/copyXkxx',
    method: 'get',
    params: query
  });
}

export function getXkmdUrl(query) {
  return fetch({
    url: '/api/admin/xkjg/getXkmdUrl',
/*url: '/test/xkjg/getXkmdUrl',*/
    method: 'get',
    params: query
    });
    }

    export function sendXktz(query) {
    return fetch({
    url: '/api/admin/xkjg/sendXktz',
    //  url: '/test/xkjg/sendXktz',
    method: 'post',
    data: query
    });
    }

    export function getAllXsgx(query) {
    return fetch({
    url: '/api/admin/special/getAllXslxgx',
    // url: '/test/special/getAllXslxgx',
    method: 'post',
    data: query
    });
    }

export function tcsPage(query) {
return fetch({
url: '/api/admin/xkxtXslxb/page',
//url: '/test/xkxtXslxb/page',
method: 'get',
params: query
});
}







