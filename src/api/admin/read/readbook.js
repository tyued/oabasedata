import fetch from 'utils/fetch'
import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';
import { DEFAULT_ENCODING } from 'crypto';
import { get } from 'http';

//展示学校信息
export function addSchool (params){
    return fetch({
        url:"/red/ReadPC/GetSchoolInfo",
        // url:"/red/ReadPC/GetSchoolInfo?a=" + params.a + '&b=' + params.b,
        methods:'get',
        params
    })
}
//获取学校信息
export function  pcinto (params) {
    console.log(params)
    return fetch({
        url:'/red/ReadPC/UpdateSchoolInfo',
        methods:get,
        params
    })
}

//获取书本列表
export function queryBook (params) {
    console.log(params)
    return fetch({
        url: '/red/ReadPC/GetTextBookList',
        methods: 'post',
        params
    })
}
//获取书本信息
export function gainBook (params){
    return fetch ({
        url:'/red/ReadPC/GetBookInfo',
        methods :'get',
        params
    })
}
//添加或修改书目信息
export function addBook (params){
    console.log(params)
    return fetch ({
        url:'/red/ReadPC/AddOrUpdateBook',
        methods :"get",
        params
    })
}
//修改一本书
export function getBook (params){
    return fetch ({
        url :'api/ReadPC/GetBookInfo',
        methods : 'get',
        params
    })
}
//删除书本信息
export function dele (params){
    console.log(params)
    return fetch ({
        url:'/red/ReadPC/DelTextBook',
        methods :'get',
        params
    })
}

//获取考题数据
export function flunk  (params){
    return fetch({
        url:'/red/ReadPC/GetBQByID',
        methods :'post',
        params
    })
}
//获取所有考题数据
export function  BookID (params){
    return fetch({
        url:"/red/ReadPC/GetPublicBQListByBookID",
        methods:'get',
        params
    })
}
//获取题库数据添加或删除书本题库
export function bqbook ( params){
    return fetch ({
        url :"api/ReadPC/AddOrUpdateBQ",
        methods :"post",
        params5
    })
}
//用处：添加或删除书本题库
export function addPaper (params){
    return fetch ({
        url:'/red/ReadPC/AddOrUpdateBQ',
        methods:'get',
        params
    })
}
//获取考题信息
export function testPaper (params){
    return fetch ({
        url:'/red/GetBQListByBookID',
        methods:'post',
        params
    })
}
//获取题库数据
export function textDa (){
    return fetch ({
        url:'/red/ReadPC/GetBQByID',
        methods :'get',
        params
    })
}

//获取考试规则
export function  exam (params){
    return fetch({
        url:'/red/ReadPC/GetPSByBookID',
        methods:'post',
        params
    })
}
//修改考试规则
export function upda (){
    return fetch ({
        url:"/api/ReadPC/UpdatePS",
        methods :'post',
        params   
    })
}
//添加等级分数
export function grade (params){
    return fetch({
        url:'/red/ReadPC/AddLevelList',
        methods:'post',
        params
    })
}
//获取等级分数
export function gain (params) {
    return fetch ({
        url:'/red/ReadPC/GetLevelList?SchoolCode=' +localStorage.getItem("xxdm"),
        methods:"post",
        params
    })
}
//编辑等级分数
export function redact (params) {
    console.log(params)
    return fetch ({
        url:'/red/ReadPC/UpdateLevelList' + '?ID',
        params
    })
}


 


//删除等级分数
export function cancel (params){
    console.log(params)
    return fetch ({
        url:'/red/ReadPC/DeleteLevelList' + '?IDs=' + params,
        methods: 'delete'
        // data: params
    })
}

//学校获取公共库书本
export function pubook (params) {
    return fetch({
        url:'/red/ReadPC/GetPublicBookBySchoolCode',
        params,
        methods:get,

    })
}
//学校获取公共库图书
// export function gdbook (params){
//     return fetch({
//         url:'/red/ReadPC/GetPublicBookBySchoolCode',
//         methods:get
//     })
// }
//获取公共库书本题库信息
export function bybook (){
    return fetch ({
        url:'red/ReadPC/GetPublicBQListByBookID',
        methods:get
    })
 }
//获取公共库导入学校库
export function inporbook (params){
    return fetch ({
        url:'/red/ReadPC/PTBToSchoolCode',
        methods:get,
        params
    })
}
//导出模板
export function educe (params){
    return fetch ({
        url:'home/LoadTextBook',
        methods:get,
        responseType: 'blob',
    })
}