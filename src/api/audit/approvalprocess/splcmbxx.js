import fetch from 'utils/fetch';

export function add(query) {
  return fetch({
    url: '/api/workflow/spLcmbxx',
    method: 'post',
    data: query
  });
}

export function addLcmb(query) {
  return fetch({
    url: '/api/workflow/spLcmbxx/addLcmb',
    method: 'post',
    data: query
  });
}

export function all() {
  return fetch({
    url: '/api/workflow/spLcmbxx/all',
    method: 'get'
  });
}

export function mbbd(mbid) {
  return fetch({
    url: '/api/workflow/spLcmbxx/mbbd/' + mbid,
    method: 'get'
  });
}

export function mbxx(query) {
  return fetch({
    url: '/api/workflow/spLcmbxx/mbxx',
    method: 'post',
    data: query
  });
}

export function mbxxAll(query) {
  return fetch({
    url: '/api/workflow/spLcmbxx/mbxxAll',
    method: 'post',
    data: query
  });
}

export function del(id) {
  return fetch({
    url: '/api/workflow/spLcmbxx/' + id,
    method: 'delete'
  });
}

export function get(id) {
  return fetch({
    url: '/api/workflow/spLcmbxx/' + id,
    method: 'get'
  });
}

export function put(id, query) {
  return fetch({
    url: '/api/workflow/spLcmbxx/' + id,
    method: 'put',
    data: query
  })
}

export function updateLcmb(query) {
  return fetch({
    url: '/api/workflow/spLcmbxx/updateLcmb',
    method: 'post',
    data: query
  })
}
