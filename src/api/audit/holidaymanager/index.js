import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/workflow/jcqjjq/page',
    method: 'get',
    params: query
  });
}

export function all(query) {
  return fetch({
    url: '/api/workflow/jcqjjq/page',
    method: 'get',
    params: query
  });
}

export function get(query) {
  return fetch({
    url: '/api/workflow/jcqjjq/' + query,
    method: 'get'
  });
}

export function post(query) {
  return fetch({
    url: '/api/workflow/jcqjjq',
    method: 'post',
    data: query
  });
}

export function put(id, query) {
  return fetch({
    url: '/api/workflow/jcqjjq/' + id,
    method: 'put',
    data: query
  })
}

export function del(query) {
  return fetch({
    url: '/api/workflow/jcqjjq/' + query,
    method: 'delete'
  });
}
