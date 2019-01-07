import fetch from 'utils/fetch';

/** 保存排课任务信息接口**/
export function getSelect(query) {
  return fetch({
    url: '/api/admin/pkrw/',
    method: 'post',
    data: query
  });
}
/**验证点亮模块**/
export function getModuleUp(query) {
  return fetch({
    url: '/api/admin/pkrw/getModuleUp',
    method: 'get',
    params: query
  });
}


