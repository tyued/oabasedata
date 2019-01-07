import fetch from 'utils/fetch';

/**课程学生预分配分页列表查询维护接口**/
export function page(query) {
  return fetch({
    url: '/api/admin/xkxtXsyfp/pagelist',
    method: 'post',
    data: query
  });
}

/**跳转加载分配页面**/
export function xsyfpxq(query) {
	  return fetch({
	    url: '/api/admin/xkxtXsyfp/pfxsxq',
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
    url: '/api/base/jcXndm/getCurrentXnxq',
    method: 'get',
    params: query
  });
}

//判断学生选择的课程是否有在同一时间段，有同时段返回：false
export function getIstsdkc(query) {
  return fetch({
    url: '/api/admin/xkxtXsyfp/isTsdkc',
    method: 'get',
    params: query
  });
}

export function getTcsXs(query) {
  return fetch({
    url: '/api/admin/special/'+query.lxid+'/students',
    method: 'get',
    params: query
  });
}

/**保存学生选课信息**/
export function saveXsxkInfo(query) {
  return fetch({
    url: '/api/admin/xkxtXsyfp/saveXsxkInfo',
    method: 'post',
    data: query
  });
}

/**下载模板**/
export function getXsyfpMbUrl() {
  return fetch({
    url: '/api/admin/xkxtXsyfp/getXsyfpMbUrl',
    method: 'get'
  });
}

/**重新导入**/
export function againUp(query) {
  return fetch({
    url: '/api/admin/xkxtXsyfp/againUplode',
    method: 'post',
    data: query
  });
}

/**根据班级代码查询学生信息**/
export function getBjSduntByBjid(query) {
  return fetch({
    url: '/api/admin/xkxtXsyfp/getBjSduntByBjid',
    method: 'get',
    params: query
  });
}
