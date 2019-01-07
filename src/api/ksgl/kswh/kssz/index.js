import fetch from 'utils/fetch';

// 获取课程年级关系数据
export function getNjgxList(query) {
  return fetch({
    url: '/api/base/kcnjGx/selectAll',
    method: 'post',
    data: query
  });
}

// 保存考试科目信息
export function saveKsKmxx(query) {
  return fetch({
    url: '/api/admin/kskmxx/saveKsKmxx',
    method: 'post',
    data: query
  });
}

// 获取考试科目信息数据
export function getKskmxxList(query) {
  return fetch({
    url: '/api/admin/kskmxx/getKskmxxList',
    method: 'get',
    params: query
  });
}



