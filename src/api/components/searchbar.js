import fetch from 'utils/fetch';


// 获取当前学年学期
export function dqxnxqObj(query) {
  return fetch({
    url: '/api/base/jcXndm/getDqxnxq',
    method: 'get',
    params: query
  });
}
// 获取年级List接口
export function getNj(query) {
  return fetch({
    url: '/api/base/jcNjsjlx/page',
    method: 'get',
    params: query
  });
}
// 查询班级List接口
export function getBj(query) {
  return fetch({
    url: '/api/base/jcBjsj/ajaxGetBjList',
    method: 'get',
    params: query
  })
}

//获取学年列表
export function getxnList(query) {
  return fetch({
    url: '/api/base/jcXndm/queryXnList',
    method: 'get',
    params: query
  });
}
//获取学期列表
export function getxqList(query) {
  return fetch({
    url: '/api/base/jcXqdm/queryXqList',
    method: 'get',
    params: query
  });
}

export function getkclbList(query) {
  return fetch({
    url: '/api/admin/kclbwh/kclbpage',
    method: 'get',
    params: query
  });
}

