import fetch from 'utils/fetch';

// 获取考场信息
export function getAllKc(params) {
  return fetch({
    url: '/api/admin/kskcxx/getKsCdxx',
    method: 'post',
    data: params
  });
}

// 批量保存考场设置记录
export function bcKcSettings(params) {
  return fetch({
    url: '/api/admin/kskcxx/whKcszData',
    method: 'post',
    data: params
  });
}

// 获取该年级设置的考场信息
export function getKcxxByKsidAndNjdm(data) {
  return fetch({
    url: '/api/admin/kskcxx/getKskc',
    method: 'get',
    params: data
  });
}

// 获取考试学生数量
export function getKsStuNum(data) {
  return fetch({
    url: '/api/admin/kskcxx/getStuNumber',
    method: 'post',
    params: data
  });
}

// 删除考场设置信息
export function delKcsz(data) {
  return fetch({
    url: '/api/admin/kskcxx/deleteKcsz',
    method: 'post',
    params: data
  });
}

// 检查数据
export function checkDataByKsid(data) {
  return fetch({
    url: '/api/admin/kskcxx/checkData',
    method: 'get',
    params: data
  });
}

// 清空数据
export function clearDataByKsid(data) {
  return fetch({
    url: '/api/admin/kskcxx/clearData',
    method: 'get',
    params: data
  });
}

// 更新考场名称
export function updateExamRoomName(params) {
  return fetch({
    url: '/api/admin/kskcxx/updateKcInfo',
    method: 'post',
    data: params
  });
}




