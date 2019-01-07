import fetch from 'utils/fetch';

export function getAllGroupTypes() {
  return fetch({
    url: '/api/admin/groupType/all',
    method: 'get'
  });
}

export function getGroupAll(query) {
  return fetch({
    url: '/api/admin/group/all',
    method: 'get',
    params: query
  });
}

export function fetchTree(query) {
  return fetch({
    url: '/api/admin/group/tree',
    method: 'get',
    params: query
  });
}

export function fetchlistgroup(query) {
  return fetch({
    url: '/api/admin/group/page',
    method: 'get',
    params: query
  });
}

export function fetchlistRole(query) {
  return fetch({
    url: '/api/admin/group/listGroupByEntiy',
    method: 'post',
    data: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/admin/group',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/group/' + id,
    method: 'get'
  });
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/group/delete/' + id,
    method: 'delete'
  });
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/group/' + id,
    method: 'put',
    data: obj
  });
}

export function getUsers(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/user',
    method: 'get'
  });
}

export function modifyUsers(id, data) {
  // fix [6676 角色部门全体教师赋予权限时报错], put方式提交的参数会拼接在url地址后面,
  // 有长度限制, 修改为通过post方式参数放在请求体body中提交
  return fetch({
    url: '/api/admin/group/' + id + '/user',
    method: 'post',
    data,
    transformRequest: [function(data) {
      const body = [];
      for (const it in data) {
        body.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]));
      }
      return body.join('&');
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function modifyLeaders(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/leader',
    method: 'put',
    params: data
  });
}


export function removeElementAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element/remove',
    method: 'post',
    params: data
  });
}

export function addElementAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element/add',
    method: 'post',
    params: data
  });
}

export function getElementAuthority(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/element',
    method: 'get'
  });
}

export function modifyMenuAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/menu',
    method: 'post',
    params: data
  });
}

export function modifyDDMenuAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/mobileDDmenu',
    method: 'post',
    params: data
  });
}

export function modifyWXMenuAuthority(id, data) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/mobileWXmenu',
    method: 'post',
    params: data
  });
}
export function modifySJMenuAuthority(data) {
  return fetch({
    url: '/api/base/baseDataAuthority/saveAuthoritys',
    method: 'post',
    data
  });
}
export function getMobileWXMenuAuthority(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/mobileWXmenu',
    method: 'get'
  });
}

export function getMobileDDMenuAuthority(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/mobileDDmenu',
    method: 'get'
  });
}

export function getMobileSJMenuAuthority(id) {
  return fetch({
    url: '/api/base/baseDataAuthority/' + id + '/authoritys',
    method: 'get'
  });
}

export function getMenuAuthority(id) {
  return fetch({
    url: '/api/admin/group/' + id + '/authority/menu',
    method: 'get'
  });
}

export function addGroupUser(data) {
  return fetch({
    url: '/api/admin/group/addGroupUser',
    method: 'put',
    params: data
  });
}

export function getJsBm(query) {
  return fetch({
    url: '/api/admin/group/getJsBm',
    method: 'get',
    params: query
  });
}

// 搜索部门成员
export function Searchmember(query) {
  return fetch({
    url: '/api/admin/user/selectMemberByName',
    method: 'get',
    params: query
  })
}

// 获取学校所有教师
export function Getallteacher(query) {
  return fetch({
    url: '/api/admin/user/page',
    method: 'get',
    params: query
  })
}
