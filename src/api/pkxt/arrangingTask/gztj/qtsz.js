import fetch from 'utils/fetch';

//查询年级课程班级信息接口
export function getKcSz(query) {
  return fetch({
    /*url: '/api/admin/jxjh/getSelectList',*/
    url: '/api/admin/jxjh/getSelectList',
    method: 'get',
    params: query
  })
}

/**
 * @program: 课程时段查询列表
 * @description:
 * @author:
 * @create: 2018/6/29
 **/
export function getQtszList(query, i) {
  const value = ['kssd/getKcsdList', 'jaqp/getJaqpList', 'jszrk/getZrkszList', 'jstrk/getTrkszList'];
  return fetch({
    url: '/api/admin/' + value[i],
    method: 'get',
    params: query
  })
}

//保存课程时段信息接口
export function getQtszSave(query, i) {
  const value = ['kssd/getSaveKcsdInfo', 'jaqp/getSaveJaqpInfo', 'jszrk/getSaveZrkszInfo', 'jstrk/getSaveTrkszInfo'];
  return fetch({
    url: '/api/admin/' + value[i],
    method: 'post',
    data: query
  })
}

/**
 * @program: 教案齐平查询列表
 * @description:
 * @author:
 * @create: 2018/6/29
 **/
export function getJaqpList(query) {
  return fetch({
    url: '/api/admin/jaqp/getJaqpList',
    method: 'get',
    params: query
  })
}

//保存教案齐平信息接口
export function getSaveJaqp(query) {
  return fetch({
    url: '/api/admin/jaqp/getSaveJaqpInfo',
    method: 'post',
    data: query
  })
}

/**
 * @program: 周内分布查询列表
 * @description:
 * @author:
 * @create: 2018/6/29
 **/
export function getZrkszList(query) {
  return fetch({
    url: '/api/admin/jszrk/getZrkszList',
    method: 'get',
    params: query
  })
}

//保存课程时段信息接口
export function getSaveZrkszInfo(query) {
  return fetch({
    url: '/api/admin/jszrk/getSaveZrkszInfo',
    method: 'post',
    data: query
  })
}

/**
 * @program: 天内分布查询列表
 * @description:
 * @author:
 * @create: 2018/6/29
 **/
export function getTrkszList(query) {
  return fetch({
    url: '/api/admin/jstrk/getTrkszList',
    method: 'get',
    params: query
  })
}

//保存课程时段信息接口
export function getSaveTrkszInfo(query) {
  return fetch({
    url: '/api/admin/jstrk/getSaveTrkszInfo',
    method: 'post',
    data: query
  })
}



