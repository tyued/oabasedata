import fetch from 'utils/fetch';

/**
 * @description: 获取课表结构信息
 * @author: hzc
 * @create: 2018/6/19
 * @param taskId 任务id
 */
export function timeTableInfo(taskId) {
  return fetch({
    url: '/api/admin/pktz/tasks/' + taskId + '/timeTableInfo',
    method: 'get',
    params: null
  });
}

/**
 * @description: 获取年级列表
 * @author: hzc
 * @create: 2018/6/19
 * @param query
 */
export function gradeList(query) {
  return fetch({
    url: '/api/base/jcNjsjlx/selectNjList',
    method: 'get',
    params: query
  });
}

/**
 * @description: 获取班级列表
 * @author: hzc
 * @create: 2018/6/19
 * @param query
 */
export function classList(query) {
  return fetch({
    url: '/api/base/jcBjsj/selectBjListByJbxn',
    method: 'get',
    params: query
  });
}

/**
 * @description: 获取排课结果列表
 * @author: hzc
 * @create: 2018/6/19
 * @param taskId 任务id
 */
export function coursePlanList(taskId) {
  return fetch({
    url: '/api/admin/pktz/tasks/' + taskId + '/coursePlanList',
    method: 'get'
  });
}

/**
 * @description: 根据职工号获取教师课表
 * @author: zzh
 * @create: 2018/6/19
 * @param query
 */
export function getJskbByZgh(query) {
  return fetch({
    url: '/api/admin/pkjg/getJskbByZgh',
    method: 'post',
    data: query
  });
}

// 根据职工号获取教师课表
export function getJskbUrl(query) {
  return fetch({
    url: '/api/admin/pkjg/getJskbUrl',
    method: 'get',
    params: query
  });
}

/**
 * @description: 根据rwid 获取排课教师
 * @author: zzh
 * @create: 2018/6/19
 * @param query
 */
export function pkjsList(query) {
  return fetch({
    url: '/api/admin/jxjh/pkjsList',
    method: 'post',
    data: query
  });
}

/**
 * @description: 获取排课规则列表
 * @author: hzc
 * @create: 2018/6/19
 * @param taskId 任务id
 */
export function ruleList(taskId) {
  return fetch({
    url: '/api/admin/pktz/tasks/' + taskId + '/coursePlanRule',
    method: 'get'
  });
}

/**
 * @description: 获取排课教学计划列表
 * @author: hzc
 * @create: 2018/6/19
 * @param taskId 任务id
 */
export function pkJxjhList(taskId) {
  return fetch({
    url: '/api/admin/pktz/tasks/' + taskId + '/pkJxjhList',
    method: 'get'
  });
}

/**
 * @description: 保存课程调整结果
 * @author: hzc
 * @create: 2018/6/19
 * @param dataModel
 */
export function saveKctz(dataModel) {
  return fetch({
    url: '/api/admin/pktz/saveKctz',
    method: 'post',
    data: dataModel
  });
}

export function getAlljs(dataModel) {
  return fetch({
    url: '/api/admin/pkjg/getAlljs',
    method: 'post',
    params: dataModel
  });
}

