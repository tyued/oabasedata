import fetch from 'utils/fetch';

/**课程学生预分配分页列表查询维护接口**/
export function page(query) {
  return fetch({
    url: '/test/xkxtXsyfp/page',//查询成绩单管理列表
    method: 'get',
    params: query
  });
}

/**跳转加载分配页面**/
export function xsyfpxq(query) {
	  return fetch({
	    url: '/test/xkxtXsyfp/pfxsxq',//查询成绩单管理列表
	    method: 'get',
	    params: query
	  });
}

//获取班级学生信息接口
export function getBjSdunt(query) {
  return fetch({
    url: '/api/base/jcXsbjgx/'+query.bjid+'/students',
    method: 'get',
    params: query
  });
}

//获取当前学年学期
export function dqxnxqObj(query) {
  return fetch({
    url: '/api/base/jcXndm/getDqxnxq',
    method: 'get',
    params: query
  });
}

//判断学生选择的课程是否有在同一时间段，有同时段返回：false
export function getIstsdkc(query) {
  return fetch({
    url: '/test/xkxtXsyfp/isTsdkc',
    method: 'get',
    params: query
  });
}

export function getTcsXs(query) {
  return fetch({
    url: '/test/special/'+query.lxid+'/students',
    method: 'get',
    params: query
  });
}

/**保存学生选课信息**/
export function saveXsxkInfo(query) {
  return fetch({
    url: '/test/xkxtXsyfp/saveXsxkInfo',//查询成绩单管理列表
    method: 'post',
    data: query
  });
}