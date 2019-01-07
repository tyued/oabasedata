import fetch from 'utils/fetch';

// /** 修改排课任务信息接口**/
// export function getUpdate(id, query) {
//   return fetch({
//     url: '/api/admin/pkrw/' + id,
//     method: 'put',
//     data: query
//   });
// }
// /** 复用排课任务信息接口**/
// export function getCopy(query) {
//   return fetch({
//     url: '/api/base/pkrw/copyPkrw',
//     method: 'post',
//     data: query
//   });
// }

/** 获得当前学年学期**/
export function getdnxq(query) {
  return fetch({
    url: '/api/base/jcXndm/getCurrentXnxq?xxdm=' + query.xxdm,
    method: 'get',
  });
}
/** 获得学年列表**/
export function getxnlb(query) {
  return fetch({
    url: '/api/base/jcXndm/queryXnList?xxdm=' + query.xxdm,
    method: 'get',
  });
}
/** 根据学年获得年级**/
export function getnj(query) {
  return fetch({
    url: '/api/base/jcBjsj/getBjListByBynd?xxdm=' + query.xxdm + '&bynd=' + query.bynd,
    method: 'get',
  });
}

/** 根据毕业班级ID查询该班级毕业学生信息**/
export function getbjxs(query) {
  return fetch({
    url: '/api/base/jcXsbjgx/getGraduatedStudentListByBjid?xxdm='
    +query.xxdm + '&bjid=' + query.bjid + '&page='
    +query.page + '&limit=' + query.limit,
    method: 'get',
  });
}

/** 毕业生导出 */


/** 查年级的毕业学生信息**/
export function njgetxs(query) {
  return fetch({
    url: '/api/base/jcXsbjgx/getGraduatedStudentListByBjid?xxdm='
      +query.xxdm + '&njdm=' + query.njdm + '&xn='
      +query.xn + '&limit=' + query.limit + '&page=' + + query.page,
    method: 'get',
  });
}

