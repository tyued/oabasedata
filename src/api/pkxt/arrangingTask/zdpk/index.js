import fetch from 'utils/fetch';


export function znpk(query) {
  return fetch({
    url: '/api/admin/pkjg/zdpk',
    method: 'get',
    params: query
  });
}

export function checkSfypk(query) {
  return fetch({
    url: '/api/admin/pkjg/checkSfypk',
    method: 'post',
    data: query
  });
}

export function checkNoSuccessPkData(query) {
  return fetch({
    url: '/api/admin/pkjg/checkNoSuccessPkData',
    method: 'post',
    data: query
  });
}


