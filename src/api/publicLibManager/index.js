import fetch from 'utils/fetch';
// 获取年级
export function getNj(params) {
  return fetch({
    url: '/red/ReadPC/GetAllClassInfo',
    method: 'get',
    params
  });
}
/**
 * 获取班级
 * @param {String} params schoolcode
 */
export function getBj(params) {
  return fetch({
    url: '/red/ReadPC/GetClassInfo',
    method: 'get',
    params
  });
}
// ------------------------
// 通过审核
export function passCheck(params) {
  return fetch({
    url: '/red/ReadPC/UpdateBookVerify',
    method: 'post',
    params
  });
}

// 添加到公共库
export function addBookToPublic(params) {
  return fetch({
    url: '/red/ReadPC/AddBookToPublic',
    method: 'post',
    params
  });
}

// 获取学校库书目列表
export function getSchoolBookList(params) {
  return fetch({
    url: '/red/ReadPC/GetSchoolAllBook',
    method: 'get',
    params
  });
}

// 获取公共库书目列表
export function getPublicBookList(params) {
  return fetch({
    url: '/red/ReadPC/GetPublicBook',
    method: 'get',
    params
  });
}

// ===============================================
// 获取题目列表
export function getQList(params) {
  return fetch({
    url: '/red/ReadPC/GetBQListByBookID',
    method: 'get',
    params
  });
}

// 将题库导入到公共库
export function commitQList(params) {
  return fetch({
    url: '/red/ReadPC/BQToPublickTextBook',
    // http://newreadlevel.91sst.com.cn/api/ReadPC/InsertBQ
    method: 'get',
    params
  });
}


// 添加题目
export function addQ(params) {
  return fetch({
    url: '/red/ReadPC/BQToPublickTextBook',
    method: 'get',
    params
  });
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// 获取公共库书本详情
export function getPublicBookInfo(params) {
  return fetch({
    url: '/red/ReadPC/GetPublicBookInfo',
    method: 'get',
    params
  });
}

// 公共库书本修改/增加
export function updateAddPublicBook(data) {
  return fetch({
    url: '/red/ReadPC/AddorUpdatePublicBook',
    method: 'post',
    params: data
  });
}

// 公共库书本删除
export function delPublicBook(params) {
  return fetch({
    url: '/red/ReadPC/DelPublicBook',
    method: 'post',
    params
  });
}

// =====================================

// 获取现有的老师添加的题目列表
export function getNewQList(params) {
  return fetch({
    url: '/red/ReadPC/GetBQListByBookID',
    method: 'get',
    params
  });
}

// 获取公共库题目列表
export function getPublicQList(params) {
  return fetch({
    url: '/red/ReadPC/GetPublicBQListByBookID',
    method: 'get',
    params
  });
}


// 将题库导入到公共库
export function addQListToPublic(params) {
  return fetch({
    url: '/red/ReadPC/GetBQListByBookID',
    method: 'post',
    data
  });
}

// 修改或者添加公共题库
export function updateAddPublicQ(params) {
  return fetch({
    url: '/red/ReadPC/AddOrUpdatePublicBQ',
    method: 'post',
    params
  });
}

// 用题目ID获取题目信息
export function getQInfo(params) {
  return fetch({
    url: '/red/ReadPC/GetPublicBQByID',
    method: 'get',
    params
  });
}

// 删除public题目
export function deletePQ(params) {
  return fetch({
    url: '/red/ReadPC/DeletePublicBQ',
    method: 'post',
    params
  });
}


// 获取学期是否显示
export function getGradeState(params) {
  return fetch({
    url: '/red/ReadPC/GetSchoolInfo',
    method: 'get',
    params
  });
}

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// 考试管理模块-题库添加和修改接口
export function addOrUpdateq(params) {
  return fetch({
    url: '/red/ReadPC/AddOrUpdateBQ',
    method: 'post',
    params
  });
}

// 获取学校库书本列表
export function getBookId(params) {
  return fetch({
    url: '/red/ReadPC/GetTextBookList',
    method: 'get',
    params
  });
}

// 获取学校库书本信息
export function getBookInfo(params) {
  return fetch({
    url: '/red/ReadPC/GetBookInfo',
    method: 'get',
    params
  });
}

// 删除学校库书本信息
export function deleteSchoolQ(params) {
  return fetch({
    url: '/red/ReadPC/DeleteBQ',
    method: 'post',
    params
  });
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// 获取考试信息
export function getRuleInfo(params) {
  return fetch({
    url: '/red/ReadPC/GetPSByBookID',
    method: 'get',
    params
  });
}
// 保存考试信息
export function saveRuleInfo(params) {
  return fetch({
    url: '/red/ReadPC/UpdatePS',
    method: 'post',
    params
  });
}

// 删除题目
export function deleteQ(params) {
  return fetch({
    url: '/red/ReadPC/DeleteBQ',
    method: 'post',
    params
  });
}

// *****************************************************************
// -阅读成果统计-
// 功能：阅读成果统计第1个
export function GetCommentListByClass(params) {
  return fetch({
    url: '/red/ReadPC/GetCommentListByClass',
    method: 'get',
    params
  });
}

// 阅读成果统计第2个
export function GetCommentListByClassCode(params) {
  return fetch({
    url: '/red/ReadPC/GetCommentListByClassCode',
    method: 'get',
    params
  });
}

// 阅读成果统计第3个
export function GetCommentListByStudent(params) {
  return fetch({
    url: '/red/ReadPC/GetCommentListByStudent',
    method: 'get',
    params
  });
}

// -考试统计-
// 考试统计第1个
export function GetHonorByClass(params) {
  return fetch({
    url: '/red/ReadPC/GetHonorByClass',
    method: 'get',
    params
  });
}

// 考试统计第2个
export function GetHonorByClassCode(params) {
  return fetch({
    url: '/red/ReadPC/GetHonorByClassCode',
    method: 'get',
    params
  });
}

// 考试统计第2个拓展
export function GetHonorByClassCodeList(params) {
  return fetch({
    url: '/red/ReadPC/GetHonorByClassCodeList',
    method: 'get',
    params
  });
}

// 考试统计第3个
export function GetHonorByStudent(params) {
  return fetch({
    url: '/red/ReadPC/GetHonorByStudent',
    method: 'get',
    params
  });
}

