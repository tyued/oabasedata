import fetch from 'utils/fetch';

/** 考试类型分页列表查询维护接口**/
export function getPageList(query) {
  return fetch({
    url: '/api/admin/kslx/queryPageList',
    method: 'post',
    data: query
  });
}

/** 保存考试类型信息接口**/
export function getAdd(query) {
  return fetch({
    url: '/api/admin/kslx/',
    method: 'post',
    data: query
  });
}
/** 修改考试类型信息接口**/
export function getUpdate(id, query) {
  return fetch({
    url: '/api/admin/kslx/' + id,
    method: 'put',
    data: query
  });
}
/** 删除考试类型信息接口**/
export function getDelete(id) {
  return fetch({
    url: '/api/admin/kslx/' + id,
    method: 'delete'
  });
}


// 获取当前学年学期
export function dqxnxqObj(query) {
  return fetch({
    url: '/api/base/jcXndm/getDqxnxq',
    method: 'get',
    params: query
  });
}
/** 学年列表**/
export function xnList(query) {
  return fetch({
    url: '/api/base/jcXndm/queryXnList',
    method: 'get',
    params: query
  });
}
/** 学期列表**/
export function xqList(query) {
  return fetch({
    url: '/api/base/jcXqdm/queryXqList',
    method: 'get',
    params: query
  });
}

/** 验证类型名称不重复**/
export function getValidaName(query) {
  return fetch({
    url: '/api/admin/kslx/getValidaName',
    method: 'get',
    params: query
  });
}

/** 验证类型名称不重复**/
export function getValidaKslx(query) {
  return fetch({
    url: '/api/admin/kswh/getValidaKslx',
    method: 'get',
    params: query
  });
}


