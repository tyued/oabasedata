import * as gzyz from './gzyz.js'

// 获取可交换课程内容列表
export function getSwapCourseList(enableCellDataSet, tableCellDataSet) {
  enableCellDataSet.forEach(item => {
    item.forEach(element => {
      const col = element.col;
      const row = element.row;
      const enable = element.enable;
      if (!enable) {
        tableCellDataSet[row][col].state = 1;
        tableCellDataSet[row][col].enable = true;
      }
    });
  });
  return tableCellDataSet;
}

// 特殊课程不能调课
function tskcbpk(enableCellDataSet, mainTableDataSet, curActive, coursePlanDataSet, ruleDataSet) {
  enableCellDataSet.forEach(item => {
    item.forEach(element => {
      const col = element.col;
      const row = element.row;
      const pkzs = element.pkzs;
      const pkjs = element.pkjs;
      const enable = element.enable;
      if (!enable) {
        // 验证是否特殊课程
        const data = mainTableDataSet[row][col];
        if (data.jlid !== null && data.jlid !== '') {
          if (data.isdjs && data.isdjs === '1') {
            element.enable = true;
            return;
          }
          if (data.isdsz && data.isdsz !== '0') {
            element.enable = true;
            return;
          }
          if (data.ishb && data.ishb === '1') {
            element.enable = true;
            return;
          }
          // 验证当前选中课程教师是否同一时间点上多个课程
          if (curActive.zgh && curActive.zgh !== null && curActive.zgh !== '') {
            const list = gzyz.hqjsgdsjkc(coursePlanDataSet, curActive.zgh, pkzs, pkjs, curActive.bjdm);
            if (list.length > 0) {
              console.log('cur教师时间冲突!' + curActive.zgh + ', zs: ' + pkzs + ', js: ' + pkjs);
              element.enable = true;
              return;
            }
          }
          if (curActive.ctype === '0') {
            const flag = gzyz.gdsjsfkpk(curActive, data, ruleDataSet);
            if (!flag) {
              element.enable = true;
              return;
            }
          } else { // 固定排课程不能调、不能放到暂存区
            const bjkcgdpArr = _.filter(_.filter(ruleDataSet.bjgdpk, { sfpk: 1 }), { bjdm: data.bjdm, kcdm: data.kcdm, pkzs: data.pkzs, pkjs: data.pkjs });
            if (bjkcgdpArr.length > 0) {
              console.log('===班级课程固定排===')
              return false;
            }
          }
          if (curActive.ctype === '0') {
            const arr = gzyz.hqjsgdsjkc(coursePlanDataSet, data.zgh, curActive.pkzs, curActive.pkjs, data.bjdm);
            if (arr.length > 0) { // 可安排
              console.log('swap教师时间冲突!' + data.zgh + ', zs: ' + curActive.pkzs + ', js: ' + curActive.pkjs);
              element.enable = true;
            }
          }
        }
      }
    });
  });
}

// 根据规则计算可交换课程坐标列表
export function computEnableCell(mainTableDataSet, initContent, ruleDataSet, curActive, timeTable, pkJxjh, coursePlanDataSet) {
  if (curActive === null) {
    return [];
  }
  const isdjs = curActive.isdjs;
  if (isdjs === '1') {
    return [];
  }
  const isdsz = curActive.isdsz;
  if (isdsz !== '0') {
    return [];
  }
  const ishb = curActive.ishb;
  if (ishb === '1') {
    return [];
  }
  if (gzyz.kcjsgdp(curActive, ruleDataSet, pkJxjh)) {
    console.log('固定排课程不可对调!');
    return [];
  }
  // 当前选中课程教师如果有固定排规则，则该课程不能和其他任何课程对调
  const enableCellDataSet = initContent;
  if (curActive.ctype === '0') {
    enableCellDataSet[curActive.row][curActive.col].enable = true; // 排除当前选中表格坐标
  }
  gzyz.bjbpk(ruleDataSet, curActive, timeTable, enableCellDataSet); // 排除班级不排课表格坐标
  gzyz.bjkcgdbpk(ruleDataSet, curActive, timeTable, enableCellDataSet); // 排除班级课程固定不排课表格坐标
  gzyz.jsgdbpk(ruleDataSet, curActive, timeTable, enableCellDataSet, pkJxjh); // 排除教师固定不排课表格坐标
  // 排除特殊课程表格坐标
  tskcbpk(enableCellDataSet, mainTableDataSet, curActive, coursePlanDataSet, ruleDataSet, pkJxjh);
  return enableCellDataSet;
}

export function computZcqEnableCell(mainTableDataSet, initContent, ruleDataSet, curActive, timeTable, pkJxjh, coursePlanDataSet) {
  if (curActive === null) {
    return [];
  }
  const isdjs = curActive.isdjs;
  if (isdjs === '1') {
    console.log('多教师,暂不支持调整');
    return [];
  }
  const isdsz = curActive.isdsz;
  if (isdsz !== '0') {
    console.log('单双周,暂不支持调整');
    return [];
  }
  const ishb = curActive.ishb;
  if (ishb === '1') {
    console.log('合班,暂不支持调整');
    return [];
  }
  if (gzyz.kcjsgdp(curActive, ruleDataSet, pkJxjh)) {
    console.log('固定排课程不可对调!');
    return [];
  }
  const enableCellDataSet = initContent;
  if (curActive.ctype === '0') {
    enableCellDataSet.forEach(item => {
      item.forEach(element => {
        const col = element.col;
        const row = element.row;
        const enable = element.enable;
        if (!enable) {
          const data = mainTableDataSet[row][col];
          if (data.jlid !== null && data.jlid !== '') {
            if (data.isdjs && data.isdjs === '1') {
              element.enable = true;
              return;
            }
            if (data.isdsz && data.isdsz !== '0') {
              element.enable = true;
              return;
            }
            if (data.ishb && data.ishb === '1') {
              element.enable = true;
              return;
            }
            const flag = gzyz.gdsjsfkpk(curActive, data, ruleDataSet);
            if (!flag) {
              element.enable = true;
              return;
            }
            const arr = gzyz.hqjsgdsjkc(coursePlanDataSet, data.zgh, curActive.pkzs, curActive.pkjs, data.bjdm);
            if (arr.length > 0) {
              element.enable = true;
            }
          }
        }
      });
    });
  }
  return enableCellDataSet;
}
