import fetch from 'utils/fetch';

// 获取新生入学列表
export function Queryinfo (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Student/page',
    method: 'post',
    data: query
  });
}

// 获取课程信息
export function Getkcsj (query) {
  return fetch({
    url: '/api/base/jcKcsj/page',
    method: 'get',
    params: query
  });
}

// 获取学年学期信息
export function Getxndm (query) {
  return fetch({
    url: '/api/base/jcXndm/getDqxnxq',
    method: 'get',
    params: query
  });
}

// 新增学生信息
export function PostStudent (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Student',
    method: 'post',
    data: query
  })
}

// 修改新生信息
export function ChangeStudent (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Student',
    method: 'put',
    data: query
  })
}

// 获取新生详细信息
export function GetStudentDetail (id) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Student/' + id,
    method: 'get'
  })
}

// 新生数量统计
export function GetStudentCount (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Student/Count',
    method: 'get',
    params: query
  })
}

// 删除新生
export function DeleteStudent (id) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Student/' + id,
    method: 'delete'
  })
}

// 获取班级列表
export function PostClassList (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Class/List',
    method: 'post',
    data: query
  })
}

// 批量删除学生
export function DelectStudent (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Student/DeleteMultiple',
    method: 'delete',
    data: query
  })
}

// 查询班级新生信息
export function GetClassStudentInfo (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Student/ClassStudentList',
    method: 'post',
    data: query
  })
}

// 自动分班
export function AutoAllocationStudent (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Class/AutoAllocationStudent',
    method: 'post',
    data: query
  })
}

// 分配学生班级
export function AllocationStudentClass (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Class/AllocationStudent',
    method: 'post',
    data: query
  })
}

// 批量导入模板下载
export function ImportTemplateDownload (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Student/ImportTemplateDownload',
    method: 'get',
    responseType: 'arraybuffer',
    // responseType: 'text',
    params: query
  })
}

// 批量导入学生信息
export function ImportExcel (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Student/ImportExcel',
    method: 'post',
    data: query
  })
}

// 分班信息excel导出
export function ExcelExport (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Class/ExcelExport',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

// 分班确认
export function AllocationConfirm (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Class/AllocationConfirm',
    method: 'post',
    data: query
  })
}

// 获取分班历史
export function GetGroupHistory (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Batch/List/' + query.xxdm,
    method: 'get'
    // params: query
  })
}

// 获取分班历史（有分页）
export function GetGroupHistoryPage (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Batch/Page',
    method: 'post',
    data: query
  })
}

// 修改分班历史
export function EditGroupHistory (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Batch',
    method: 'put',
    data: query
  })
}

// 删除历史
export function DelectGroupHistory (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Batch/' + query,
    method: 'delete',
  })
}

// 调整历史分班
export function Adjustmenthistory (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Batch/' + query,
    method: 'get'
  })
}

// 统计班级各名次段人数
export function StatisticsRank (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Class/StatisticsClassRankingInfo',
    method: 'post',
    data: query
  })
}

// 导出班级各名次段人数
export function ExportClassRank (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Class/StatisticsClassRankingExcelExport',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

// 添加名次段
// export function PostRank (query) {
//   return fetch({
//     url: '/api/newborn//smartnewborn/v1/Ranking',
//     method: 'post',
//     data: query
//   })
// }

// 批量添加名次段
export function PostRange (query) {
  return fetch({
    url: 'api/newborn/smartnewborn/v1/Ranking/PostRange',
    method: 'post',
    data: query
  })
}

// 批量修改名次段
export function EditRange (query) {
  return fetch({
    url: 'api/newborn/smartnewborn/v1/Ranking/PutRange',
    method: 'put',
    data: query
  })
}

// 修改名次段
// export function EditRank (query) {
//   return fetch({
//     url: '/api/newborn/smartnewborn/v1/Ranking',
//     method: 'put',
//     data: query
//   })
// }

// 删除名次段
export function DelectRank (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Ranking/' + query,
    method: 'delete',
  })
}

// 查询名次段列表
export function GetRankList (query) {
  return fetch({
    url: '/api/newborn/smartnewborn/v1/Ranking/List',
    method: 'post',
    data: query
  })
}