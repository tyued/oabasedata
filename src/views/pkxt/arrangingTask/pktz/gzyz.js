// 班级不排课
export function bjbpk(ruleDataSet, curActive, timeTable, enableCellDataSet) {
  const bjbpkArr = _.filter(ruleDataSet.bjbpk, { bjdm: curActive.bjdm });
  bjbpkArr.forEach(item => {
    const pkzs = parseInt(item.bpkzs, 10);
    const pkjs = parseInt(item.bpkjs, 10);
    const row = pkjs - 1;
    const col = timeTable.weekdayList.indexOf(pkzs);
    console.log('班级不排课: pkzs-' + pkzs + ',pkjs-' + pkjs + ',row-' + row + ' ,col-' + col);
    try {
      enableCellDataSet[row][col].enable = true;
    } catch (e) {
      console.log('error: row: ' + row + ' col: ' + col);
    }
  });
}

// 班级课程固定不排课
export function bjkcgdbpk(ruleDataSet, curActive, timeTable, enableCellDataSet) {
  const bjkcgdbpArr = _.filter(_.filter(ruleDataSet.bjgdpk, { sfpk: 2 }), { bjdm: curActive.bjdm, kcdm: curActive.kcdm });
  bjkcgdbpArr.forEach(item => {
    const pkzs = parseInt(item.pkzs, 10);
    const pkjs = parseInt(item.pkjs, 10);
    const row = pkjs - 1;
    const col = timeTable.weekdayList.indexOf(pkzs);
    console.log(curActive.bjmc + curActive.kcmc + '固定不排课: pkzs-' + pkzs + ',pkjs-' + pkjs + ',row-' + row + ' ,col-' + col);
    try {
      enableCellDataSet[row][col].enable = true;
    } catch (e) {
      console.log('error: row: ' + row + ' col: ' + col);
    }
  });
}

// 班级课程固定排课
export function bjkcgdpk(ruleDataSet, curActive, timeTable, enableCellDataSet) {
  const bjkcgdpArr = _.filter(_.filter(ruleDataSet.bjgdpk, { sfpk: 1 }), { bjdm: curActive.bjdm });
  bjkcgdpArr.forEach(item => {
    const pkzs = parseInt(item.pkzs, 10);
    const pkjs = parseInt(item.pkjs, 10);
    const row = pkjs - 1;
    const col = timeTable.weekdayList.indexOf(pkzs);
    const kcdm = item.kcdm;
    if (kcdm !== curActive.kcdm) {
      console.log(curActive.bjmc + item.kcmc + '固定排课: pkzs-' + pkzs + ',pkjs-' + pkjs + ',row-' + row + ' ,col-' + col);
      try {
        enableCellDataSet[row][col].enable = true;
      } catch (e) {
        console.log('error: row: ' + row + ' col: ' + col);
      }
    }
  });
}

// 教师固定不排课
export function jsgdbpk(ruleDataSet, curActive, timeTable, enableCellDataSet) {
  const jsgdbpkArr = _.filter(ruleDataSet.jsgdpk, item => item.sfpk === 2 && item.zgh === curActive.zgh && item.kcdm === curActive.kcdm);
  jsgdbpkArr.forEach(item => {
    const pkzs = parseInt(item.pkzs, 10);
    const pkjs = parseInt(item.pkjs, 10);
    const row = pkjs - 1;
    const col = timeTable.weekdayList.indexOf(pkzs);
    console.log('教师' + item.zgh + '固定不排课: pkzs-' + pkzs + ',pkjs-' + pkjs + ',row-' + row + ' ,col-' + col);
    try {
      enableCellDataSet[row][col].enable = true;
    } catch (e) {
      console.log('error: row: ' + row + ' col: ' + col);
    }
  });
}

// 获取教师固定时间课程列表
export function hqjsgdsjkc(coursePlanDataSet, zgh, pkzs, pkjs, bj) {
  if (zgh && zgh !== null && zgh !== '') {
    return _.filter(coursePlanDataSet, value => value.zgh === zgh && value.pkzs === pkzs && value.pkjs === pkjs && value.ctype === '0' && value.bjdm !== bj);
  } else {
    return [];
  }
}

// 指定位置教师固定排
export function zdwzjsgdp(curActive, ruleDataSet) {
  if (curActive.zgh && curActive.zgh !== null && curActive.zgh !== '') {
    const jsgdpkArr = _.filter(ruleDataSet.jsgdpk, item => item.sfpk === 1 && item.zgh === curActive.zgh
      && item.pkzs === curActive.pkzs && item.pkjs === curActive.pkjs && item.kcdm === curActive.kcdm);
    if (jsgdpkArr.length > 0) {
      console.log('===' + curActive.zgh + '教师' + curActive.kcdm + '课程固定排, pkzs-' + curActive.pkzs + ',pkjs-' + curActive.pkjs + '===')
      return true;
    }
  }
  return false;
}

// 固定时间是否可排某门课程
export function gdsjsfkpk(curActive, enableItem, gzlb) {
  const bjbpkArr = _.filter(gzlb.bjbpk, { bjdm: enableItem.bjdm, bpkzs: curActive.pkzs, bpkjs: curActive.pkjs });
  if (bjbpkArr.length > 0) {
    console.log('===班级不排===')
    return false;
  }
  const bjkcgdbpArr = _.filter(_.filter(gzlb.bjgdpk, { sfpk: 2 }), { bjdm: enableItem.bjdm, kcdm: enableItem.kcdm, pkzs: curActive.pkzs, pkjs: curActive.pkjs });
  if (bjkcgdbpArr.length > 0) {
    console.log('===班级课程固定不排===')
    return false;
  }
  const bjkcgdpArr = _.filter(_.filter(gzlb.bjgdpk, { sfpk: 1 }), { bjdm: enableItem.bjdm, kcdm: enableItem.kcdm, pkzs: enableItem.pkzs, pkjs: enableItem.pkjs });
  if (bjkcgdpArr.length > 0) {
    console.log('===班级课程固定排===')
    return false;
  }
  if (zdwzjsgdp(enableItem, gzlb)) {
    console.log('===教师固定排===')
    return false;
  }
  if (enableItem.zgh && enableItem.zgh !== null && enableItem.zgh !== '') {
    const jsgdbpArr = _.filter(gzlb.jsgdpk, item => item.sfpk === 2 && item.zgh === enableItem.zgh && item.kcdm === enableItem.kcdm
      && item.pkzs === curActive.pkzs && item.pkjs === curActive.pkjs);
    if (jsgdbpArr.length > 0) {
      console.log('===教师固定不排===')
      return false;
    }
  }
  return true;
}

// 指定位置课程/教师是否固定排
export function kcjsgdp(curActive, ruleDataSet) {
  if (curActive.ctype === '1') {
    return false;
  }
  // 判断班级课程固定排
  const bjkcgdpArr = _.filter(_.filter(ruleDataSet.bjgdpk, { sfpk: 1 }), { bjdm: curActive.bjdm, kcdm: curActive.kcdm, pkzs: curActive.pkzs, pkjs: curActive.pkjs });
  if (bjkcgdpArr.length > 0) {
    console.log('===' + curActive.bjdm + '班级' + curActive.kcdm + '课程固定排, pkzs-' + curActive.pkzs + ',pkjs-' + curActive.pkjs + '===')
    return true;
  }
  // 该教师当前位置是否有固定排课规则
  return zdwzjsgdp(curActive, ruleDataSet);
}
