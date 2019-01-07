import fetch from 'utils/fetch';

export function getKsxx(jlid) {
  return fetch({
    url: '/api/admin/kswh/' + jlid + '/getKsxx',
    method: 'get',
    params: null
  });
}

export function getCknj(query) {
  return fetch({
    url: '/api/admin/kskmxx/getCknj',
    method: 'get',
    params: query
  })
}

export function getKskc(query) {
  return fetch({
    url: '/api/admin/kskcxx/getKskc',
    method: 'get',
    params: query
  })
}

export function getKcxsxx(query) {
  return fetch({
    url: '/api/admin/kcxsxx/getKcxsxx',
    method: 'get',
    params: query
  })
}

export function getKsrq(query) {
  return fetch({
    url: '/api/admin/kskmxx/getKsrq',
    method: 'get',
    params: query
  })
}

export function getKskmsj(query) {
  return fetch({
    url: '/api/admin/kskmxx/cxKskmmxkssj',
    method: 'get',
    params: query
  })
}

export function getXklsxxByKsid(query) {
  return fetch({
    url: '/api/admin/kcjkls/cxXklsxxByKsid',
    method: 'get',
    params: query
  })
}
