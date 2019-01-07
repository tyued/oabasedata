import fetch from 'utils/fetch';

// 获取考试统计数据
export function getTjsz(query) {
  return fetch({
    url: '/api/admin/kstj/getTjszByKsidAndNjdm',
    method: 'get',
    params: query
  });
}

// 保存考试统计设置信息
export function saveTjsz(query) {
  return fetch({
    url: '/api/admin/kstj/addTjsz',
    method: 'post',
    data: query
  });
}


