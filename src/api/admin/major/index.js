import fetch from 'utils/fetch';

// 获取专业分页信息
export function page(query) {
  return fetch({
    url: '/api/base/jcZysjlx/page',
    method: 'get',
    params: query
  });
}

// 模糊查询
export function fuzzyQuery(query) {
  return fetch({
    url: '/api/base/jcZysjlx/fuzzyQuery',
    method: 'get',
    params: query
  });
}

// 添加新专业
export function add(obj) {
  return fetch({
    url: '/api/base/jcZysjlx/add',
    method: 'post',
    data: obj
  });
}

// 删除专业
export function del(params) {
  return fetch({
    url: '/api/base/jcZysjlx/delete',
    method: 'delete',
    data: params
  });
}

// 获取指定专业信息
export function get(id) {
  return fetch({
    url: '/api/base/jcZysjlx/' + id,
    method: 'get'
  });
}

// 更改专业信息
export function update(obj) {
  return fetch({
    url: '/api/base/jcZysjlx/update',
    method: 'put',
    data: obj
  });
}

// 获取课程
export function getCourseList(query) {
  return fetch({
    url: '/api/base/jcZykcgx/selectJcZykcgxList',
    method: 'get',
    params: query
  });
}

// 更新专业-课程关系
export function updateZykcgx(params) {
  return fetch({
    url: '/api/base/jcZykcgx/updateZykcgx',
    method: 'post',
    data: params
  })
}

// 获取班级
export function getClassList(query) {
  return fetch({
    url: '/api/base/jcZybjgx/selectJcZybjgxList',
    method: 'get',
    params: query
  });
}

// 更新专业-课程关系
export function updateZybjgx(params) {
  return fetch({
    url: '/api/base/jcZybjgx/updateZybjgx',
    method: 'post',
    data: params
  })
}







