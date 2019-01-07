import fetch from 'utils/fetch';

export function queryPageList(query) { // 获取代课信息列表
  return fetch({
    url: '/api/admin/tzgg/queryPageList',
    method: 'post',
    data: query
  });
}
export function save(query) { // 保存通知公告信息
  return fetch({
    url: '/api/admin/tzgg',
    method: 'post',
    data: query
  });
}
export function validateLcmb(query) { // 获取流程模板id
  return fetch({
    url: '/api/admin/tzgg/validateLcmb',
    method: 'get',
    params: query
  });
}
export function deletegg(query) { // 获取流程模板id
  return fetch({
    url: '/api/admin/tzgg/' + query,
    method: 'delete'
  });
}
