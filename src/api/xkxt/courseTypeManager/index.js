import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
   // url: '/test/kclbwh/kclbpage',
    url: '/api/admin/kclbwh/kclbpage',
    method: 'get',
    params: query
  });
}

export function checkUnique(query) {
  return fetch({
   // url: '/test/kclbwh/cxKclbxx',
    url: '/api/admin/kclbwh/cxKclbxx',
    method: 'get',
    params: query
  });
}


export function all(query) {
  return fetch({
    //url: '/test/kclbwh/page',
    url: '/api/admin/kclbwh/page',
    
    method: 'get',
    params: query
  });
}

export function get(query) {
  return fetch({
    //url: '/test/kclbwh/' + query,
	url: '/api/admin/kclbwh/' + query, 
    method: 'get'
  });
}

export function post(query) {
  return fetch({
    //url: '/test/kclbwh',
    url: '/api/admin/kclbwh',
    method: 'post',
    data: query
  });
}

export function put(id, query) {
  return fetch({
    //url: '/test/kclbwh/' + id,
    url: '/api/admin/kclbwh/' + id,
    method: 'put',
    data: query
  })
}

export function del(query) {
  return fetch({
	//url: '/test/kclbwh/' + query,
    url: '/api/admin/kclbwh/' + query,
    method: 'delete'
  });
}
