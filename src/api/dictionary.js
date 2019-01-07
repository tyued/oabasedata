import fetch from 'utils/fetchfront';

export function getbmInfo(query) {
  return fetch({
    url: '/jcDmtm/bm',
    method: 'get',
    params: query
  });
}

export function getbmInfo_dm(query) {
  return fetch({
    url: '/jcDmtm/dm',
    method: 'get',
    params: query
  });
}

export function getjlcxInfo(query) {
  return fetch({
    url: '/jcDmtm/jlcx',
    method: 'get',
    params: query
  });
}
