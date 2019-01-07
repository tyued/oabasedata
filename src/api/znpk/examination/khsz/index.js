import fetch from 'utils/fetch';

export function getPageList(data) {
  return fetch({
    url: '/api/admin/ckxsxx/queryPageList',
    method: 'post',
    data
  })
}

export function getCkxsxxList(params) {
  return fetch({
    url: '/api/admin/ckxsxx/getCkxsxxList',
    method: 'get',
    params
  })
}

export function saveCkxsxx(data) {
  return fetch({
    url: '/api/admin/ckxsxx/saveCkxsxx',
    method: 'post',
    data
  })
}
/** 修改学生考号 **/
export function getEditXskh(params) {
  return fetch({
    url: '/api/admin/ckxsxx/getEditXskh',
    method: 'get',
    params
  })
}

/** 查询参考年级列表 **/
export function getCknj(query) {
  return fetch({
    url: '/api/admin/kskmxx/getCknj',
    method: 'get',
    params: query
  })
}
