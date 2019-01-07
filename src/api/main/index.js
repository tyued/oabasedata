import fetch from 'utils/fetch';

/** =================================  教育局管理首页  =============================**/
// 总计
export function getjyjTotalData(query) {
  return fetch({
    url: '/api/base/eduAdminMain/unitStatistics',
    method: 'get',
    data: query
  });
}

// 用户动态
export function getjyjUserActive(query) {
  return fetch({
    url: '/api/base/eduAdminMain/userNews',
    // url: '/api/admin/gateLog/getGateLog',
    method: 'get',
    params: query
  });
}

// 用户动态
export function getGateLog(query) {
  return fetch({
    url: '/api/admin/gateLog/getGateLog',
    method: 'get',
    params: query
  });
}

// 统计
export function getjyjStatisticsData(query) {
  return fetch({
    url: '/api/base/eduAdminMain/activeUserStatistics',
    method: 'get',
    data: query
  });
}


/** =================================  校管理首页  =============================**/
// tab切换数据
export function getxglNoticeData(query) {
  return fetch({
    url: '/api/base/schoolAdminMain/notice',
    method: 'get',
    data: query
  });
}

// 用户动态
export function getxglUserActive(query) {
  return fetch({
    url: '/api/base/schoolAdminMain/userNews',
    method: 'get',
    data: query
  });
}

// 统计
export function getxglStatisticsData(query) {
  return fetch({
    url: '/api/base/schoolAdminMain/activeUserStatistics',
    method: 'get',
    data: query
  });
}


/** =================================  超级管理首页  =============================**/
// 总计
export function getcgTotalData(query) {
  return fetch({
    url: '/api/base/adminMain/totalData',
    method: 'get',
    data: query
  });
}

// 各产品开通情况
export function getcgStatisticsData(query) {
  return fetch({
    url: '/api/base/adminMain/productActive',
    method: 'get',
    data: query
  });
}

// 根据学校代码获取用户信息
export function getAllUsersByxxdm(query, xxdm) {
  return fetch({
    url: '/api/admin/user/' + xxdm + '/getAllUsersByxxdm',
    method: 'get',
    params: query
  });
}

/** =================================  老师首页  =============================**/

export function getdbsx(query) {
  return fetch({
    url: '/api/admin/teacherIndex/dbsx/' + query,
    method: 'get'
  });
}
export function getGGxx(query) {
  return fetch({
    url: '/api/admin/tzgg/getFbgg',
    method: 'get',
    params: query
  });
}

