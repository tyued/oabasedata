import fetch from 'utils/fetch';


export function termpage(query) {
  return fetch({
    url: '/api/base/jcXqdm/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/base/jcXqdm',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/base/jcXqdm/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/base/jcXqdm/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/base/jcXqdm/' + id,
    method: 'put',
    data: obj
  })
}


export function getXqlist(query) {
  return fetch({
    url: '/api/base/jcXqdm/queryXqList',
    method: 'get',
    params: query
  });
}
