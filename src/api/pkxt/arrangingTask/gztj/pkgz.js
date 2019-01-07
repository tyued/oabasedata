import fetch from 'utils/fetch';

// 根据任务id获取所有规则
export function getGzlb(query) {
  return fetch({
    url: '/api/admin/pkgz/queryPkgzlb',
    method: 'get',
    params: query
  });
}
export function scgzBylx(query) {
  return fetch({
    url: '/api/admin/pkgz/scgzBygzlx',
    method: 'post',
    data: query
  });
}

