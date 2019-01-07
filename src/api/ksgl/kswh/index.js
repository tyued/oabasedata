import fetch from 'utils/fetch';

/** 考试维护分页列表查询维护接口**/
export function getPageList(query) {
  return fetch({
    url: '/api/admin/kswh/queryPageList',
    method: 'post',
    data: query
  });
}

/** 保存排课任务信息接口**/
export function getAdd(query) {
  return fetch({
    url: '/api/admin/kswh/',
    method: 'post',
    data: query
  });
}
/** 修改排课任务信息接口**/
export function getUpdate(id, query) {
  return fetch({
    url: '/api/admin/kswh/' + id,
    method: 'put',
    data: query
  });
}
/** 删除排课任务信息接口**/
export function getDelete(id) {
  return fetch({
    url: '/api/admin/kswh/' + id,
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

/** 考试类型列表**/
export function getKslxList(query) {
  return fetch({
    url: '/api/admin/kslx/queryKslxList',
    method: 'get',
    params: query
  });
}

/** 修改考试维护状态列表**/
export function getUpdateState(query) {
  return fetch({
    url: '/api/admin/kswh/getUpdateState',
    method: 'post',
    data: query
  });
}

/** 查询参考年级列表 **/
export function getCknj(query) {
  return fetch({
    url: '/api/admin/kskmxx/getCknj',
    method: 'get',
    params: query
  })
}
/** 查询参考学生列表 **/
export function getCkxsxxList(params) {
  return fetch({
    url: '/api/admin/ckxsxx/getCkxsxxList',
    method: 'get',
    params
  })
}
/** 免考设置 **/
export function saveMkszXx(data) {
  return fetch({
    url: '/api/admin/ckxsxx/saveMkszXx',
    method: 'post',
    data
  })
}


