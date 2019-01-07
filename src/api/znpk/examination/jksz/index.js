import fetch from 'utils/fetch';

// 获取考试科目信息
export function getKskmxx(params) {
  return fetch({
    url: '/api/admin/kskmxx/cxKskmmx',
    method: 'post',
    data: params
  });
}

/** 教师组关系数据**/
export function getJszjsgxList(query) {
  return fetch({
    url: '/api/base/jcJszgx/getJszjsgxList',
    method: 'get',
    params: query
  })
}

/** 保存巡考老师信息 **/
export function getSaveXklsxx(params) {
  return fetch({
    url: '/api/admin/xklsxx/saveUpdateXklsxx',
    method: 'post',
    data: params
  });
}

/** 获取所有巡考教师信息接口**/
export function getXkjsAll(id, query) {
  return fetch({
    url: '/api/admin/xklsxx/getXklsxxByKsid/' + id,
    method: 'get',
    data: query
  });
}

// 获取该年级设置的考场信息
export function getKcxxByKsidAndNjdm(data) {
  return fetch({
    url: '/api/admin/kskcxx/getKskc',
    method: 'get',
    params: data
  });
}


/** 保存监考老师信息 **/
export function getSaveJklsxx(params) {
  return fetch({
    url: '/api/admin/jklsxx/saveUpdateJklsxx',
    method: 'post',
    data: params
  });
}
// 获取监考条件设置的考场信息
export function getselectJklsList(data) {
  return fetch({
    url: '/api/admin/jklsxx/getJklsList',
    method: 'get',
    params: data
  });
}
// 获取年级下的监考老师
export function getJklsBynjksid(data) {
  return fetch({
    url: '/api/admin/jklsxx/getJklsBynjksid',
    method: 'get',
    params: data
  });
}

// 获取年级下的排考规则
export function getJktjBynjksid(data) {
  return fetch({
    url: '/api/admin/kcjktj/getJktjBynjksid',
    method: 'get',
    params: data
  });
}
// 新增监考条件
export function addJktj(params) {
  return fetch({
    url: '/api/admin/kcjktj/addJktj',
    method: 'post',
    data: params
  });
}

// 删除监考条件
export function delJktj(params) {
  return fetch({
    url: '/api/admin/kcjktj/delJktj',
    method: 'post',
    data: params
  });
}
// 删除监考条件
export function plxgJktj(params) {
  return fetch({
    url: '/api/admin/kcjktj/plxgJktj',
    method: 'post',
    data: params
  });
}
