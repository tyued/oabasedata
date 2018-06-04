import fetch from 'utils/fetch';

/* 学分监控-班级 */
export function bj_page(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Statistics/GetClasses',
    method: 'post',
    data: query
  });
}

/* 学分监控-年级 */
export function nj_page(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Statistics/GetGrade',
    method: 'post',
    data: query
  });
}

/* 学分监控-学生 */
export function xs_page(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Statistics/GetStudents',
    method: 'post',
    data: query
  });
}

export function xs_export(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Statistics/GetStudentsExcel',
    method: 'post',
    responseType: 'arraybuffer',
    data: query
  });
}


/* 学分监控-学校 */
export function school_page(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Statistics/GetSchool',
    method: 'post',
    data: query
  });
}


/* ----------------- 基础数据接口 ------------ */
//获取当前学年学期
export function dqxnxqObj(query) {   
  return fetch({
    url: '/api/base/jcXndm/getDqxnxq',
    method: 'get',
    params: query
  });
}

//获取学年
export function getXn(query) {   
  return fetch({
    url: '/api/base/jcXndm/page',
    method: 'get',
    params: query
  });
} 

//获取学期
export function getXq(query) {   
  return fetch({
    url: '/api/base/jcXqdm/page',
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
