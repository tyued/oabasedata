import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/page',
    method: 'post',
    params: query
  });
}
export function createItem(obj) {
    return fetch({
      url: '/api/netcore/smartcredit/v1/Xm',
      method: 'post',
      data: obj
    });
}
export function updateItem(obj) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm?id=' + obj.id,
    method: 'put',
    data: obj.info
  });
}
export function delItem(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/' + query.id,
    method: 'delete',
    params: query
  });
}
export function getItem(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/' + query.id,
    method: 'get',
    params: query
  });
}

//获取年级
export function getNj(query) {
  return fetch({
    url: '/api/base/jcNjsjlx/page',
    method: 'get',
    params: query
  });
}
//获取学科
export function getXk(query) {
  return fetch({
    url: '/api/base/jcKcsj/page',
    method: 'get',
    params: query
  });
}
//获取当前学年学期
export function dqxnxqObj(query) {   
  return fetch({
    url: '/api/base/jcXndm/getDqxnxq',
    method: 'get',
    params: query
  });
}


