import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/base/jcXqsj/page',
    method: 'get',
    params: query
  });
}

export function getCampus(query) {
  return fetch({
    url: '/api/base/jcXqsj/all',
    method: 'get',
    params: query
  });
}

export function getxxdmCampus(id) {
  return fetch({
    url: '/api/base/jcXqsj/' + id + '/campuses',
    method: 'get'
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/base/jcXqsj',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/base/jcXqsj/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/base/jcXqsj/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/base/jcXqsj/' + id,
    method: 'put',
    data: obj
  })
}


























