import fetch from 'utils/fetch';

export function teacherAll(query) {
  return fetch({
    url: '/api/base/jcJzgjbsj/all',
    method: 'get',
    params: query
  });
}

/**
 * 部门树
 * @param {} query
 */
export function getBMTree(query) {
  return fetch({
    url: '/api/admin/group/tree?groupType=2',
    method: 'get',
    params: query
  });
}

export function teacherpage(query) {
  return fetch({
    url: '/api/base/jcJzgjbsj/page',
    method: 'get',
    params: query
  });
}

// 模糊查询
export function fuzzyQuery(query) {
  return fetch({
    url: '/api/base/jcJzgjbsj/fuzzyQuery',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/base/jcJzgjbsj',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/base/jcJzgjbsj/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/base/jcJzgjbsj/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/base/jcJzgjbsj/' + id,
    method: 'put',
    data: obj
  })
}
export function teachexport(query) {
  return fetch({
    url: '/api/base/jcJzgjbsj/export?xxdm=' + query.xxdm,
    method: 'get',
    responseType: 'arraybuffer',
  });
}
export function teacherImportTemplate(query) {
  return fetch({
    url: '/api/base/jcJzgjbsj/teacherImportTemplate',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  });
}
// 重置密码
export function resetSecret(obj) {
  return fetch({
    url: '/api/base/jcJzgjbsj/resetPassword',
    method: 'post',
    data: obj
  })
}
