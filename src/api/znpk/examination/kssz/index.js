import fetch from 'utils/fetch';

// 获取考试科目信息
export function getKskmxx(params) {
  return fetch({
    url: '/api/admin/kskmxx/cxKskmmx',
    method: 'post',
    data: params
  });
}

// 获取考试年级
export function getKsnj(query) {
  return fetch({
    url: '/api/admin/kskmxx/getCknj',
    method: 'get',
    params: query
  })
}

// 维护考试科目时间
export function updateKskmxx(params) {
  return fetch({
    url: '/api/admin/kskmxx/updateKskmsj',
    method: 'post',
    data: params
  });
}

// 检查数据
export function checkDataByKsid(data) {
  return fetch({
    url: '/api/admin/kskmxx/checkData',
    method: 'get',
    params: data
  });
}

// 清空数据
export function clearDataByKsid(data) {
  return fetch({
    url: '/api/admin/kskmxx/clearData',
    method: 'get',
    params: data
  });
}


