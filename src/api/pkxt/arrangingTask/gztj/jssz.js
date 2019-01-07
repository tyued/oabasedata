import fetch from 'utils/fetch';

export function getJspk(query) {
    return fetch({
        url: '/api/admin/jsgdbpk/getJspk',
        // url: '/test/jsgdbpk/getJspk',
        method: 'get',
        params: query
    })
}

export function getJszjsgxList(query) {
    return fetch({
        url: '/api/base/jcJszgx/getJszjsgxList',
        // url: '/hxw/jcJszgx/getJszjsgxList',
        method: 'get',
        params: query
    })
}

/**
 * 删除班级排课
 * @param query
 */
export function deleteKCpk(query) {
    return fetch({
        url: '/api/admin/bjgdbpk/delete/scbjpk',
        // url: '/test/bjgdbpk/delete/scbjpk',
        method: 'delete',
        data: query
    })
}

/**
 * 删除教师排课
 * @param query
 */
export function deleteTeacherpk(query) {
    return fetch({
        url: '/api/admin/jsgdbpk/scjspk',
        // url: '/test/jsgdbpk/scjspk',
        method: 'delete',
        data: query
    })
}


/**
 * save教师排课
 * @param query
 */
export function saveTeacherpk(query) {
    return fetch({
        url: '/api/admin/jsgdbpk/addjspk',
        // url: '/test/jsgdbpk/addjspk',
        method: 'post',
        data: query
    })
}

/**
 * 规则教师排课 getHadSetting
 * @param query
 */
export function getHadSetting(query) {
    return fetch({
        url: '/api/admin/jsgdbpk/getYpkjs',
        // url: '/test/jsgdbpk/getYpkjs',
        method: 'get',
        params: query
    })
}
/** --------------- 互斥连排 ------------------------------------------------------------ */
/**
 * 查询已设置过互斥的教师 getHadSettingHCMethod
 * @param query
 */
export function getHadSettingHCMethod(query) {
    return fetch({
        url: '/api/admin/jshc/getYhcjs',
        // url: '/test/jshc/getYhcjs',
        method: 'get',
        params: query
    })
}

/**
 * 点击教师，根据职工号查询教师互斥 getHeherHCjs
 * @param query
 */
export function getHeherHCjs(query) {
    return fetch({
        url: '/api/admin/jshc/getPkjshc',
        // url: '/test/jshc/getPkjshc',
        method: 'get',
        params: query
    })
}

/**
 * 保存连续上课数 saveLxSkNum
 * @param query
 */
export function saveLxSkNum(query) {
    return fetch({
        url: '/api/admin/jshc/addlxsk',
        // url: '/test/jshc/addlxsk',
        method: 'post',
        data: query
    })
}

/**
 * 保存替换教师互斥 saveLxSkNum
 * @param query
 */
export function saveHcJs(query) {
    return fetch({
        url: '/api/admin/jshc/addjshclp',
        // url: '/test/jshc/addjshclp',
        method: 'post',
        data: query
    })
}


/** --------------- 合班设置 ------------------------------------------------------------ */

/**
 * 查询已设置每周上课数的课程 findHaveSetCurriculum
 * @param query
 */
export function findHaveSetCurriculum(query) {
    return fetch({
        url: '/api/admin/jxjh/getKcList',
        // url: '/test/jxjh/getKcList',
        method: 'get',
        params: query
    })
}

/**
 * 根据课程查询班级，授课教师(没有合班的) curriculumFindClassTeacher
 * @param query
 */
export function curriculumFindClassTeacher(query) {
    return fetch({
        url: '/api/admin/jxjh/getBjJsListBykcdm',
        // url: '/test/jxjh/getBjJsListBykcdm',
        method: 'get',
        params: query
    })
}

/**
 * 根据kcdm,xxdm,rwid,查询合班列表 toFindCommonClassList
 * @param query
 */
export function toFindCommonClassList(query) {
    return fetch({
        url: '/api/admin/jshbsz/getHbszByRwid',
        // url: '/test/jshbsz/getHbszByRwid',
        method: 'get',
        params: query
    })
}

/**
 * 合班 mergeClass
 * @param query
 */
export function mergeClass(query) {
    return fetch({
        url: '/api/admin/jshbsz/addhbsz',
        // url: '/test/jshbsz/addhbsz',
        method: 'post',
        data: query
    })
}


/**
 * 拆班 breakClass
 * @param query
 */
export function breakClass(query) {
    return fetch({
        url: '/api/admin/jshbsz/deletehb',
        // url: '/test/jshbsz/deletehb',
        method: 'delete',
        data: query
    })
}

/**
 * 获取某个teacher已设置的课程 getClass
 * @param query
 */
export function getClass(query) {
    return fetch({
        url: '/api/admin/jsgdbpk/getJssdkc',
        // url: '/test/jshbsz/deletehb',
        method: 'get',
        params: query
    })
}