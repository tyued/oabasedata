import fetch from 'utils/fetch';

// 获取考试科目信息
export function getKskmxx(params) {
  return fetch({
    url: '/api/admin/kskmxx/cxKskmmx',
    method: 'post',
    data: params
  });
}

// 获取考试科目信息
export function getClassCourse(params) {
  return fetch({
    url: '/api/admin/kskmxx/getClassCourse',
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

// 获取考试班级
export function getKsClass(query) {
  return fetch({
    url: '/api/admin/kskmxx/getKsbjData',
    method: 'get',
    params: query
  })
}


// 获取科目分项信息
export function getKskmfx(query) {
  return fetch({
    url: '/api/admin/kskmfx/getKskmfx',
    method: 'post',
    data: query
  })
}

// 保存科目分项
export function saveKmfx(query) {
  return fetch({
    url: '/api/admin/kskmfx/saveKmfx',
    method: 'post',
    data: query
  })
}

// 删除科目分项
export function clearKmfx(query) {
  return fetch({
    url: '/api/admin/kskmfx/clearKmfx',
    method: 'post',
    data: query
  })
}

