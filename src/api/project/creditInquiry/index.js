import fetch from 'utils/fetch';

// 基础信息
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

// 获取班级列表
export function getBj(params) {
  // console.log(params)
  return fetch({
    url: '/api/base/jcBjsj/getBjListByNjdm',
    method: 'get',
    params
  });
}

// 学分查询
export function GetCredit(params) {
  console.log(params)
  return fetch({
    url: '/api/netcore/smartcredit/v1/Statistics/GetStudentXmReport',
    method: 'post',
    data: params
  });
}

// 分页获取报告单集合
export function Getreport(params) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Bgd/Page',
    method: 'get',
    params: params
  })
}

// 获取报告单设置
export function Getreportset(params) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Bgd/GetReportSetting',
    method: 'get',
    params: params
  })
}

// 获取当前人有权限的班级
export function Getjurisdiction(params) {
  return fetch({
    url: '/api/base/jcBjsj/listGrantedClass',
    method: 'get',
    params: params
  })
}

// 学生报告单统计
export function Getreportstatistics(params){
  return fetch({
    url: '/api/netcore/smartcredit/v1/Statistics/GetStudentBgdReport',
    method:'post',
    data: params
  })
}
// 导出报告单模板
export function ImportTemplateDownload (query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Bgd/DownloadExcelTemplateBgdxx',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

// 获取课程成绩(雷达图数据)
export function Getstastick(params) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Statistics/GetKcReport',
    method: 'post',
    data: params
  })
}

// 保存学生报告单录入信息
export function Savereport(params) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Bgd/SaveStudentBgdxx',
    method: 'post',
    data: params
  })
}

// 学生学分查询Excel导出
export function ImportRportlateDownload (query) {
  return fetch({
    url: '/api/netcore/smartcredit/v1/Statistics/GetStudentXmReportExcel',
    method: 'post',
    responseType: 'arraybuffer',
    data: query
  })
}
