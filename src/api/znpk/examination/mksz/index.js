import fetch from 'utils/fetch';

// 获取当前学年学期
export function dqxnxqObj(query) {
  return fetch({
    url: '/api/base/jcXndm/getDqxnxq',
    method: 'get',
    params: query
  });
}
/** 学年列表**/
export function xnList(query) {
  return fetch({
    url: '/api/base/jcXndm/queryXnList',
    method: 'get',
    params: query
  });
}
/** 学期列表**/
export function xqList(query) {
  return fetch({
    url: '/api/base/jcXqdm/queryXqList',
    method: 'get',
    params: query
  });
}
/** 查询参考年级列表 **/
export function getCknj(query) {
  return fetch({
    url: '/api/admin/kskmxx/getCknj',
    method: 'get',
    params: query
  })
}
/** 查询参考学生列表 **/
export function getCkxsxxList(params) {
  return fetch({
    url: '/api/admin/ckxsxx/getCkxsxxList',
    method: 'get',
    params
  })
}
/** 免考设置 **/
export function saveMkszXx(data) {
  return fetch({
    url: '/api/admin/ckxsxx/saveMkszXx',
    method: 'post',
    data
  })
}

// 删除免考
export function getDelete(query) {
  return fetch({
    url: '/api/admin/ckxsxx/getUpdateCkState',
    method: 'get',
    params: query
  });
}
