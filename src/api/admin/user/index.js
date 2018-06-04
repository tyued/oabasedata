import fetch from 'utils/fetch';

export function userAllpage(query) {
  return fetch({
    url: '/api/admin/user/page',
    method: 'get',
    params: query
  });
}

export function userpage(query) {
  return fetch({
    url: '/api/admin/user/userPage',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/admin/user',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/user/' + id,
    method: 'put',
    data: obj
  })
}
// export function putObj(obj) {
//   return fetch({
//     url: '/api/admin/user/update',
//     method: 'put',
//     data: obj
//   })
// }

