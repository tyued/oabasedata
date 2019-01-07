import * as gzyz from './gzyz.js'

export function getTeacherTableContent(initContent, dataSet, timeTable) {
  dataSet.forEach(item => {
    const pkzs = parseInt(item.pkzs, 10);
    const pkjs = parseInt(item.pkjs, 10);
    const row = pkjs - 1;
    const col = timeTable.weekdayList.indexOf(pkzs);
    const index = col + (row * timeTable.daysPerWeek);
    const cell = {};
    cell.bjdm = item.bjdm;
    cell.bjmc = item.bjmc;
    cell.njdm = item.njdm;
    cell.njmc = item.njmc;
    cell.kcmc = item.kcmc;
    cell.kcdm = item.kcdm;
    cell.children = item.children;
    cell.state = '0';
    cell.index = index;
    cell.row = row;
    cell.col = col;
    cell.pkzs = pkzs;
    cell.pkjs = pkjs;
    cell.active = false;
    try {
      initContent[row][col] = cell;
    } catch (e) {
      console.log('error: row: ' + row + ' col: ' + col);
    }
  });
  return initContent;
}

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

// 被调课程是否可排
function btkcsfkp(enableCellDataSet, mainTableDataSet, curActive, coursePlanDataSet) {
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
              console.log('当前教师时间冲突!' + curActive.zgh + ', zs: ' + pkzs + ', js: ' + pkjs);
              element.enable = true;
              return;
            }
          }
          if (curActive.ctype === '0') {
            const arr = gzyz.hqjsgdsjkc(coursePlanDataSet, data.zgh, curActive.pkzs, curActive.pkjs, data.bjdm);
            if (arr.length > 0) {
              console.log('目标教师时间冲突!' + data.zgh + ', zs: ' + pkzs + ', js: ' + pkjs);
              element.enable = true;
              return;
            }
          }
        } else {
          if (curActive.zgh && curActive.zgh !== null && curActive.zgh !== '') {
            const list = gzyz.hqjsgdsjkc(coursePlanDataSet, curActive.zgh, pkzs, pkjs, curActive.bjdm);
            if (list.length > 0) {
              console.log('当前教师时间冲突!' + curActive.zgh + ', zs: ' + pkzs + ', js: ' + pkjs);
              element.enable = true;
              return;
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
  const enableCellDataSet = initContent;
  if (curActive.ctype === '0') {
    enableCellDataSet[curActive.row][curActive.col].enable = true; // 排除当前选中表格坐标
  }
  btkcsfkp(enableCellDataSet, mainTableDataSet, curActive, coursePlanDataSet);
  return enableCellDataSet;
}
