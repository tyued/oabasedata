import fetch from 'utils/fetch';

//获得学年列表
export function getxnlb(query) {
    return fetch({
        url: '/api/base/jcXndm/queryXnList',
        method: 'get',
        params: query
    })
}
//获得学期列表
export function getxqlb(query) {
    return fetch({
        url: '/api/base/jcXqdm/queryXqList',
        method: 'get',
        params: query
    })
}
//根据年级查找课程
export function getKcListByNj(query) {
    return fetch({
        url: '/api/base/jcKcsj/getKcListByNj',
        method: 'get',
        params: query
    })
}
//修改报告单
export function updateBgd(query) {
    return fetch({
        url: '/api/netcore/smartcredit/v1/Bgd',
        method: 'put',
        data: query
    });
}
//创建报告单
export function createBgd(query) {
    return fetch({
        url: '/api/netcore/smartcredit/v1/Bgd',
        method: 'post',
        data: query
    });
}
//分页获取报告单
export function getBgd(query) {
    return fetch({
        url: '/api/netcore/smartcredit/v1/Bgd/Page',
        method: 'get',
        params: query
    });
}
//删除报告单
export function delBgd(query) {
    return fetch({
        url: '/api/netcore/smartcredit/v1/Bgd/' + query.id,
        method: 'delete',
        params: query
    });
}
//获取报告单模板集合
export function GetReportTemplateList(query) {
    return fetch({
        url: '/api/netcore/smartcredit/v1/Bgd/GetReportTemplateList',
        method: 'get',
        params: query
    });
}
//获取数据字典
export function GetNetcoreDict(query) {
    return fetch({
        url: '/api/netcore/smartcredit/v1/Dictionary',
        method: 'get',
        params: query
    });
}
//提交报告单设置
export function SaveReportSetting(query) {
    return fetch({
        url: '/api/netcore/smartcredit/v1/Bgd/SaveReportSetting',
        method: 'post',
        data: query
    });
}
//获取报告单设置
export function GetReportSetting(query) {
    return fetch({
        url: '/api/netcore/smartcredit/v1/Bgd/GetReportSetting',
        method: 'get',
        params: query
    });
}
//获取报告单项目信息（无成绩信息及班级成绩信息）
export function GetBgdXmInfo(query) {
    return fetch({
        url: '/api/netcore/smartcredit/v1/Bgd/GetBgdXmInfo',
        method: 'post',
        params: query
    });
}
