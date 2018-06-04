import fetch from 'utils/fetch';

/**特长生分页列表查询维护接口**/
export function getPageList(query) {
  return fetch({
    url: '/api/admin/special/queryPageList',//查询成绩单管理列表
    method: 'post',
    data: query
  });
}
/**保存特长生维护信息接口**/
export function saveSpecialInfo(query) {
  return fetch({
    url: '/api/admin/special/saveSpecialInfo',//查询成绩单管理列表
    method: 'post',
    data: query
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
//特长生类型接口
export function getTcsLx(query) {
  return fetch({
    url: '/api/admin/special/getTypeInfo',
    method: 'get',
    params: query
  });
}
//特长生类型列表接口
export function getTcsLxList(query) {
  return fetch({
    url: '/api/admin/xkxtXslxb/ajaxGetTypeList',
    method: 'get',
    params: query
  });
}

//获取全校年级班级树形数据接口
export function getTreeNode(query) {
  return fetch({
    url: '/api/admin/special/getTreeNode',
    method: 'get',
    params: query
  });
}

// 获取年级接口
export function getNj(query) {
  return fetch({
    url: '/api/base/jcNjsjlx/page',
    method: 'get',
    params: query
  });
}
// 查询班级
export function getBj(query) {
  return fetch({
    url: '/api/base/jcBjsj/ajaxGetBjList',
    method: 'get',
    params: query
  })
}
//获取班级学生信息接口
export function getBjSdunt(query) {
  return fetch({
    url: '/api/base/jcXsbjgx/'+query.bjid+'/students',
    method: 'get',
    params: query
  });
}

