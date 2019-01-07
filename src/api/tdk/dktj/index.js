import fetch from 'utils/fetch';

export function queryPageList(query) { // 获取代课信息列表
  return fetch({
    url: '/api/admin/dk/selectDktjList',
    method: 'post',
    data: query
  });
}
export function getDkInfo(query) { // 获得代课统计信息
  return fetch({
    url: '/api/admin/dk/selectDkInfo',
    method: 'get',
    params: query
  });
}
