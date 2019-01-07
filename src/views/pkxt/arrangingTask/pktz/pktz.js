// 计算课表上午下午晚上分割行Index列表
export function computTableRowDivider(timeTable) {
  const result = [];
  if (timeTable.amLessonCount > 0 && timeTable.pmLessonCount > 0) {
    result.push(timeTable.amLessonCount);
  }
  if (timeTable.pmLessonCount > 0 && timeTable.eveLessonCount > 0) {
    result.push(timeTable.amLessonCount + timeTable.pmLessonCount);
  }
  return result;
}

// 初始化表格结构DataModel
export function initTableStructure(timeTable) {
  const result = [];
  for (let i = 0; i < timeTable.totalLessonCount; i++) {
    const rowData = [];
    for (let j = 0; j < timeTable.daysPerWeek; j++) {
      const cell = {};
      cell.jlid = '';
      cell.state = '0';
      cell.index = j + (i * timeTable.daysPerWeek);
      cell.row = i;
      cell.col = j;
      cell.pkjs = i + 1;
      cell.pkzs = timeTable.weekdayList[j];
      cell.courseName = '';
      cell.active = false;
      cell.enable = false;
      cell.children = [];
      cell.muiltiple = false;
      cell.ctype = '0';
      rowData.push(cell);
    }
    result.push(rowData);
  }
  return result;
}

export function initZcqStructure(timeTable) {
  const result = [];
  const startIndex = timeTable.totalLessonCount * timeTable.daysPerWeek;
  for (let i = 0; i < 2; i++) {
    const rowData = [];
    for (let j = 0; j < timeTable.daysPerWeek; j++) {
      const cell = {};
      cell.jlid = '';
      cell.state = '0';
      cell.index = j + (i * timeTable.daysPerWeek) + startIndex;
      cell.row = i;
      cell.col = j;
      cell.pkjs = i + 1;
      cell.pkzs = timeTable.weekdayList[j];
      cell.courseName = '';
      cell.active = false;
      cell.enable = false;
      cell.muiltiple = false;
      cell.children = [];
      cell.ctype = '1';
      rowData.push(cell);
    }
    result.push(rowData);
  }
  return result;
}

export function getItem(data) {
  const result = data[0];
  const teacherName = result.jsmc && result.jsmc !== null && result.jsmc !== '' ? result.jsmc : '';
  const kcName = result.kcmc && result.kcmc !== null && result.kcmc !== '' ? result.kcmc : '';
  result.children = [];
  if (data.length === 1) {
    let courseName = teacherName + ' ' + kcName;
    if (result.isdsz === '1') {
      courseName = teacherName + ' 单:' + kcName;
    }
    if (result.isdsz === '2') {
      courseName = teacherName + ' 双:' + kcName;
    }
    if (result.ishb === '1') {
      courseName += '(合)';
    }
    result.courseName = courseName;
    result.muiltiple = false;
    return result;
  }
  const dzlb = [], szlb = [], hblb = [], dzhb = [], szhb = [];
  data.forEach((item, index) => {
    if (item.isdsz === '1') {
      dzlb.push(item);
      if (item.ishb === '1') {
        dzhb.push(item);
      }
    }
    if (item.isdsz === '2') {
      szlb.push(item);
      if (item.ishb === '1') {
        szhb.push(item);
      }
    }
    if (item.ishb === '1') {
      hblb.push(item);
    }
    if (index !== 0) {
      result.children.push(item);
    }
  });
  let courseName = teacherName + ' ' + kcName, singleName = teacherName + kcName, doubleName = teacherName + kcName;
  if (dzlb.length > 0) {
    const singleTeacher = dzlb[0].jsmc && dzlb[0].jsmc !== null && dzlb[0].jsmc !== '' ? dzlb[0].jsmc : '';
    const singlekcName = dzlb[0].kcmc && dzlb[0].kcmc !== null && dzlb[0].kcmc !== '' ? dzlb[0].kcmc : '';
    singleName = singleTeacher + ' 单:' + singlekcName;
    if (dzhb.length > 0) {
      singleName += '(合)';
    }
  }
  if (szlb.length > 0) {
    const doubleTeacher = szlb[0].jsmc && szlb[0].jsmc !== null && szlb[0].jsmc !== '' ? szlb[0].jsmc : '';
    const doublekcName = szlb[0].kcmc && szlb[0].kcmc !== null && szlb[0].kcmc !== '' ? szlb[0].kcmc : '';
    doubleName = doubleTeacher + ' 双:' + doublekcName;
    if (szhb.length > 0) {
      doubleName += '(合)';
    }
  }
  if (hblb.length > 0) {
    courseName += '(合)';
  }
  result.courseName = courseName;
  result.singleName = singleName;
  result.doubleName = doubleName;
  if (dzlb.length > 0 && szlb.length > 0) {
    result.muiltiple = true;
  } else {
    result.muiltiple = false;
    if (dzlb.length > 0) {
      result.courseName = singleName;
    }
    if (szlb.length > 0) {
      result.courseName = doubleName;
    }
  }
  return result;
}

export function getDataGroupByIndex(dataSet) {
  const result = [];
  // 按排课节数周数分组, 处理多教师及单双周情况(单双周多教师会有多条记录分配在同一个周数和节数上)
  dataSet.forEach(item => {
    const arr = _.find(result, o => o.pkzs === item.pkzs && o.pkjs === item.pkjs);
    if (arr) {
      arr.children.push(item);
    } else {
      const obj = {};
      obj.pkzs = item.pkzs;
      obj.pkjs = item.pkjs;
      obj.children = [];
      obj.children.push(item);
      result.push(obj);
    }
  });
  return result;
}

export function getTableContent(initContent, dataSet, timeTable) {
  dataSet.forEach(data => {
    const list = data.children;
    const item = getItem(list);
    const pkzs = parseInt(item.pkzs, 10);
    const pkjs = parseInt(item.pkjs, 10);
    const row = pkjs - 1;
    const col = timeTable.weekdayList.indexOf(pkzs);
    const index = col + (row * timeTable.daysPerWeek);
    const ctype = item.ctype;
    const cell = {};
    cell.zgh = item.zgh;
    cell.jsmc = item.jsmc;
    cell.kcdm = item.kcdm;
    cell.kcmc = item.kcmc;
    cell.courseName = item.courseName;
    cell.singleName = item.singleName;
    cell.doubleName = item.doubleName;
    cell.muiltiple = item.muiltiple;
    cell.bjdm = item.bjdm;
    cell.bjmc = item.bjmc;
    cell.njdm = item.njdm;
    cell.njmc = item.njmc;
    cell.ishb = item.ishb;
    cell.hbbj = item.hbbj;
    cell.isdjs = item.isdjs;
    cell.dzgh = item.dzgh;
    cell.isdsz = item.isdsz;
    cell.jlid = item.jlid;
    cell.pkid = item.pkid;
    cell.children = item.children;
    cell.state = '0';
    cell.index = index;
    cell.row = row;
    cell.col = col;
    cell.pkzs = pkzs;
    cell.pkjs = pkjs;
    cell.ctype = ctype;
    cell.active = false;
    cell.enable = true;
    try {
      initContent[row][col] = cell;
    } catch (e) {
      console.log('error: row: ' + row + ' col: ' + col);
    }
  });
  return initContent;
}

// 获取调整课程记录列表
export function swapCourse(from, to, temp) {
  const toPkzs = to.pkzs;
  const toPkjs = to.pkjs;
  const toCtype = to.ctype;
  const toRow = to.row;
  const toCol = to.col;
  let fromPkzs = from.pkzs;
  let fromPkjs = from.pkjs;
  let fromCtype = from.ctype;
  let fromRow = from.row;
  let fromCol = from.col;
  const records = [];
  from.pkzs = toPkzs;
  from.pkjs = toPkjs;
  from.ctype = toCtype;
  from.row = toRow;
  from.col = toCol;
  if (from.jlid !== null && from.jlid !== '') {
    records.push(from);
  }
  from.children.forEach(item => {
    item.pkzs = toPkzs;
    item.pkjs = toPkjs;
    item.ctype = toCtype;
    item.row = toRow;
    item.col = toCol;
    if (item.jlid !== null && item.jlid !== '') {
      records.push(item);
    }
  });
  if (temp) {
    fromPkzs = temp.pkzs;
    fromPkjs = temp.pkjs;
    fromCtype = temp.ctype;
    fromRow = temp.row;
    fromCol = temp.col;
  }
  to.pkzs = fromPkzs;
  to.pkjs = fromPkjs;
  to.ctype = fromCtype;
  to.row = fromRow;
  to.col = fromCol;
  if (to.jlid !== null && to.jlid !== '') {
    records.push(to);
  }
  to.children.forEach(item => {
    item.pkzs = fromPkzs;
    item.pkjs = fromPkjs;
    item.ctype = fromCtype;
    item.row = fromRow;
    item.col = fromCol;
    if (item.jlid !== null && item.jlid !== '') {
      records.push(item);
    }
  });
  return records;
}
