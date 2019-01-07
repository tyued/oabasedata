import fetch from 'utils/fetch';

export function getSchool(query) {
  return fetch({
    url: '/api/base/jcXxjbsj/all',
    method: 'get',
    params: query
  });
}
export function getXxdmInfo(query) {
  return fetch({
    url: '/api/base/jcXxjbsj/getXxdmInfo',
    method: 'get',
    params: query
  });
}

export function getPageSchool(obj) {
  return fetch({
    url: '/api/base/jcXxjbsj/queryPageList',
    method: 'post',
    data: obj
  });
}
/** 验证学校代码是否重复**/
export function getValidaXxdm(query) {
  return fetch({
    url: '/api/base/jcXxjbsj/getValidaXxdm',
    method: 'get',
    params: query
  });
}

/** 验证学校名称是否重复**/
export function getValidaXxmc(query) {
  return fetch({
    url: '/api/base/jcXxjbsj/getValidaXxmc',
    method: 'get',
    params: query
  });
}

/** 编辑**/
export function getObj(id, query) {
  return fetch({
    url: '/api/base/jcXxjbsj/' + id,
    method: 'get',
    data: query
  });
}

/** 修改**/
export function getUpdate(id, query) {
  return fetch({
    url: '/api/base/jcXxjbsj/' + id,
    method: 'put',
    data: query
  });
}
/** 删除信息接口**/
export function getDelete(id) {
  return fetch({
    url: '/api/base/jcXxjbsj/' + id,
    method: 'delete'
  });
}

/** 保存信息接口**/
export function getSave(query) {
  return fetch({
    url: '/api/base/jcXxjbsj',
    method: 'post',
    data: query
  });
}

/** 学校参数--个性化设置**/
export function getSetListpage(id) {
  return fetch({
    url: '/api/base/jcXxcssz/' + id + '/yuedu',
    method: 'get'
  });
}
/** 学校参数--个性化设置--更新**/
export function updateSetList(id, query) {
  return fetch({
    url: '/api/base/jcXxcssz/' + id,
    method: 'put',
    data: query
  });
}
  /** 学校参数--个性化设置--保存阅读考级**/
export function saveyuduSet(query) {
  return fetch({
    url: '/api/base/jcXxcssz/saveyuduSet',
    method: 'post',
    data: query
  });
}
