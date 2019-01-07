import fetch from 'utils/fetch';

export function getAllList(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/list',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/page',
    method: 'post',
    params: query
  });
}
export function createItem(obj) {
    return fetch({
      url: '/api/netcore/smartcredit/v1/Xm',
      method: 'post',
      data: obj
    });
}
export function updateItem(obj) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm?id=' + obj.id,
    method: 'put',
    data: obj.info
  });
}
export function delItem(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/' + query.id,
    method: 'delete',
    params: query
  });
}
export function getItem(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/' + query.id,
    method: 'get',
    params: query
  });
}

//获取年级
export function getNj(query) {
  return fetch({
    url: '/api/base/jcNjsjlx/page',
    method: 'get',
    params: query
  });
}
//获取学科
export function getXk(query) {
  return fetch({
    url: '/api/base/jcKcsj/page',
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

//获取权重项目或者任务列表
export function GetQzListByAll(query) {   
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/GetQzListByAll',
    method: 'post',
    params: query
  });
}
//获取权重项目下的所有子项目或者所有任务列表
export function GetQzListByxmId(query) {   
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/GetQzListByxmId',
    method: 'post',
    params: query
  });
}
//批量新增权重
export function AddBatchQz(query) {   
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/AddBatchQz',
    method: 'post',
    data: query
  });
}

// 获取专业
export function getjcZysjlx(query) {   
  return fetch({
    url: '/api/base/jcZysjlx/selectAll',
    method: 'get',
    params: query
  });
}

// 获取项目下权重信息
export function getQzInfo(query) {   
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/QzInfo/' + query.id,
    method: 'get',
    params: query
  });
}

// 创建项目副本
export function getCopy(query) {   
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/Copy/' + query.id,
    method: 'get',
    params: query
  });
}

// 修改项目备注
export function putBz(query) {   
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xm/Bz',
    method: 'put',
    data: query
  });
}