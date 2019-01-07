import fetch from 'utils/fetch';

export function synchronousStuData(query) {
  return fetch({
    url: '/api/admin/ckxsxx/whCkxsxx',
    method: 'get',
    params: query
  })
}
/** 验证点亮模块**/
export function getModuleUp(query) {
  return fetch({
    url: '/api/admin/kskcpk/getModuleUp',
    method: 'get',
    params: query
  });
}

