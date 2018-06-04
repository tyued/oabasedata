import fetch from 'utils/fetch';

// 任务接口

export function page(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Rw/GetPageList',
    method: 'post',
    params: query
  });
}
export function createRw(obj) {
    return fetch({
      url: '/api/netcore/smartcredit/v1/Rw/Insert',
      method: 'post',
      data: obj
    });
}
export function updateRw(obj) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Rw/Update',
    method: 'post',
    data: obj
  });
}
export function delRw(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Rw/Delete/' + query.id,
    method: 'delete',
    params: query
  });
}
export function getRw(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Rw/GetInfo/' + query.id,
    method: 'post',
    params: query
  });
}
export function supplementRw(query) {
    return fetch({
      url: '/api/netcore/smartcredit/v1/Rw/DealAllowSupplement',
      method: 'post',
      params: query
    });
}

// 学生成绩接口

export function inputCredit(obj) {
    return fetch({
      url: '/api/netcore/smartcredit/v1/Xmcj/InputCredit',
      method: 'post',
      data: obj
    });
}
export function getCreditList(query) {
    return fetch({
      url: '/api/netcore/smartcredit/v1/Xmcj/GetCreditList',
      method: 'post',
      params: query
    });
}
export function checkResult(query) {
    return fetch({
      url: '/api/netcore/smartcredit/v1/Xmcj/CheckResult',
      method: 'post',
      params: query
    });
}
// 成绩上报
export function scoreReported(query, type) {
    let requestUrl = ''
    if(type == 0) {
      requestUrl = '/api/netcore/smartcredit/v1/Xmcj/ScoreReported'  //成绩上报（成绩和学分）,无子项
    }else if(type == 1) {
      requestUrl = '/api/netcore/smartcredit/v1/Xmcj/LJLScoreReported'  //累计量成绩上报，有子项
    }else{
      requestUrl = '/api/netcore/smartcredit/v1/Xmcj/ZXScoreReported'  //有子项目成绩计分类型的成绩上报(成绩)
    }

    return fetch({
      url: requestUrl,
      method: 'post',
      params: query
    });
}


export function CheckXtResult(query) {//查看系统结果
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xmcj/CheckXtResult',
    method: 'post',
    params: query
  });
}

export function GetXmStatistics(query) {//子项目成绩统计
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xmcj/GetXmStatistics',
    method: 'post',
    params: query
  });
}

export function GetScoreList(query) {//获取成绩记录
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xmcj/GetScoreList',
    method: 'post',
    params: query
  });
}
export function ImportScore(query) {//成绩批量录入
  return fetch({
    url: '/api/netcore/smartcredit/v1/Xmcj/ImportScore',
    method: 'post',
    data: query
  });
}



export function exportExcel(query) {
    return fetch({
      url: '/api/netcore/smartcredit/v1/Xmcj/ExportExcel',
      method: 'get',
      responseType: 'arraybuffer',
      params: query
    });
}
export function importExcel(query) {
    return fetch({
      url: '/api/netcore/smartcredit/v1/Xmcj/ImportExcel',
      method: 'post',
      params: query
    });
}
export function dealAllowSupplement(query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Rw/DealAllowSupplement',
    method: 'post',
    params: query
  });
}


//查询班级
export function getBj(query) {
  return fetch({
    url: '/api/base/jcBjsj/page',
    method: 'get',
    params: query
  })
}
//查询单个学科信息
export function getXkInfo(query) {
  return fetch({
    url: '/api/base/jcKcsj/' + query.id,
    method: 'get',
    params: query
  });
}

