import fetch from 'utils/fetch';


export function getpage(query) {
  return fetch({
    url: '/api/admin/dszsz/dszlist',
    method: 'get',
    params: query
  });
}

export function getdszkc(query) {
  return fetch({
    url: '/api/admin/dszsz/getkcbyjs',
    method: 'get',
    params: query
  });
}

export function saveadd(query) {
  return fetch({
    url: '/api/admin/dszsz/addDsz',
    method: 'post',
    data: query
  });
}
export function delbyid(query) {
  return fetch({
    url: '/api/admin/dszsz/delDsz',
    method: 'post',
    data: query
  });
}
export function  getbjhclist(query) {
  return fetch({
    url: '/api/admin/bjhc/bjhclist',
    method: 'get',
    params: query
  });
}

export function savebjhc(query) {
  return fetch({
    //url: '/api/admin/dszsz/addDsz',
    url: '/api/admin/bjhc/addbjhc',
    method: 'post',
    data: query
  });
}

// 查询单个班级的所有课程
export function  getbjClasslist(query) {
  return fetch({
    url: '/api/admin/bjgdbpk/getPkKclist',
    method: 'get',
    params: query
  });
}

// 根据班级和课程查询固定排页面
export function  getDetailClassTable(query) {
  return fetch({
    url: '/api/admin/bjgdbpk/getPkgdbpk',
    method: 'get',
    params: query
  });
}

// 保存班级和课程查询固定排页面
export function  saveDetailClassTable(query) {
  return fetch({
    url: '/api/admin/bjgdbpk/savePkBjgdbpk',
    method: 'post',
    data: query
  });
}

// 固定排删除课程为空
export function  deleteDetailClass(query) {
  return fetch({
    url: '/api/admin/bjgdbpk/delete/scbjpk',
    method: 'delete',
    data: query
  });
}