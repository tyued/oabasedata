import fetch from '@/utils/fetch';
import { firstBy } from 'thenby';

const BJ_KEY = 'bj_list';
const NJ_KEY = 'nj_list';
const KC_KEY = 'kc_list';
const JS_KEY = 'js_list';
const DQXN_KEY = 'dqxn';
const JSZ_KEY = 'jsz_list';


// -------------------基础信息-------------------- 内部调用
function gradeList(query) {
  return fetch({
    url: '/api/base/jcNjsjlx/selectNjList',
    method: 'get',
    params: query
  });
}

function classList(query) {
  return fetch({
    url: '/api/base/jcBjsj/selectBjListByJbxn',
    method: 'get',
    params: query
  });
}

// 获取当前学年学期
function dqxnxq(query) {
  return fetch({
    url: '/api/base/jcXndm/getCurrentXnxq',
    method: 'get',
    params: query
  });
}

// 获取年级课程接口
function getKcAll(query) {
  return fetch({
    url: '/api/base/jcKcsj/selectNjKcList',
    method: 'get',
    params: query
  });
}

// 获取教师接口
function getJsAll(query) {
  return fetch({
    url: '/api/base/jcJzgjbsj/selectJsList',
    method: 'get',
    params: query
  });
}

// 获取教师组接口
function getJszAll(query) {
  return fetch({
    url: '/api/base/jcJszb/getJszAll',
    method: 'get',
    params: query
  });
}

/**
 * @program: 基础接口调用
 * @description:
 * @author: ggh
 * @create: 2018/6/19
 **/
export default {
  BJ_KEY, NJ_KEY, KC_KEY, JS_KEY, JSZ_KEY,
  fetch(key) {
    return JSON.parse(window.sessionStorage.getItem(key));
  },
  save(key, items) {
    window.sessionStorage.setItem(key, JSON.stringify(items));
  },
  remove(key) {
    window.sessionStorage.removeItem(key);
  },
  hqdqxnxq(query) {
    /** 获取当前学年学期**/
    return new Promise(resolve => {
      let xnxq = this.fetch(DQXN_KEY);
      if (!xnxq) {
        dqxnxq(query).then(res => {
          xnxq = res;
          this.save(DQXN_KEY, xnxq);
          resolve(xnxq);
        });
      } else {
        resolve(xnxq);
      }
    });
  },
  hqbjlb(query) {
    /** 获取班级**/
    return new Promise(resolve => {
      let bjList = this.fetch(BJ_KEY);
      if (!bjList) {
        classList(query).then(res => {
          bjList = res;
          this.save(BJ_KEY, bjList);
          resolve(bjList);
        });
      } else {
        resolve(bjList);
      }
    });
  },
  hqnjlb(query) {
    /** 获取年级**/
    return new Promise(resolve => {
      let njList = this.fetch(NJ_KEY);
      if (!njList) {
        gradeList(query).then(res => {
          njList = res;
          this.save(NJ_KEY, njList);
          resolve(njList);
        })
      } else {
        resolve(njList);
      }
    });
  },
  hqkclb(query) {
    /** 获取课程**/
    return new Promise(resolve => {
      let kcList = this.fetch(KC_KEY);
      if (!kcList) {
        getKcAll(query).then(res => {
          kcList = res;
          this.save(KC_KEY, kcList);
          resolve(kcList);
        })
      } else {
        resolve(kcList);
      }
    });
  },
  hqjslb(query) {
    /** 获取教师**/
    return new Promise(resolve => {
      let jsList = this.fetch(JS_KEY);
      if (!jsList) {
        getJsAll(query).then(res => {
          jsList = res;
          this.save(JS_KEY, jsList);
          resolve(jsList);
        })
      } else {
        resolve(jsList);
      }
    });
  },
  hqjszlb(query) {
    /** 获取教师组**/
    return new Promise(resolve => {
      let jszList = this.fetch(JSZ_KEY);
      if (!jszList) {
        getJszAll(query).then(res => {
          jszList = res;
          this.save(JSZ_KEY, jszList);
          resolve(jszList);
        })
      } else {
        resolve(jszList);
      }
    });
  },
  hqbjmcByid(dataList, value) {
    const res = _.find(dataList, ['uuid', value]);
    if (res) {
      return res.bj;
    } else {
      return value;
    }
  },
  /** 班级名称获取代码**/
  hqbjdmBymc(dataList, value) {
    const res = _.find(dataList, ['bj', value]);
    if (res) {
      return res.uuid;
    } else {
      return value;
    }
  },
  hqnjmcByid(dataList, value) {
    const res = _.find(dataList, ['njdm', value]);
    if (res) {
      return res.njmc;
    } else {
      return value;
    }
  },
  hqnjdmBymc(dataList, value) {
    const res = _.find(dataList, ['njmc', value]);
    if (res) {
      return res.njdm;
    } else {
      return value;
    }
  },
  hqkcmcByid(dataList, value) {
    const res = _.find(dataList, ['uuid', value]);
    if (res) {
      return res.kcmc;
    } else {
      return value;
    }
  },
  /** 课程名称获取课程代码**/
  hqkcdmBymc(dataList, value) {
    const res = _.find(dataList, o => o.kcmc == value);
    if (res) {
      return res.uuid;
    } else {
      return value;
    }
  },
  /** 课程代码获取课程类型**/
  hqkclxByid(dataList, value) {
    const res = _.find(dataList, ['uuid', value]);
    if (res) {
      return res.kclx;
    } else {
      return value;
    }
  },
  hqjsmcByid(dataList, value) {
    const res = _.find(dataList, o => o.gh == value);
    if (res) {
      return res.xm;
    } else {
      return value;
    }
  },
  hqkclbBykclx(dataList, value) {
    const res = _.find(dataList, ['lbid', value]);
    if (res) {
      return res.lbmc;
    } else {
      return value;
    }
  },
  /** 根据教师名称获取教师代码**/
  hqjsdmBymc(dataList, value) {
    const res = _.find(dataList, o => o.xm == value);
    if (res) {
      return res.gh;
    } else {
      return value;
    }
  },
  // 根据 对象某个属性 进行分组
  sjfz(dataModel, keyStr) {
    const result = [];
    dataModel.forEach(item => {
      const keyValue = item[keyStr];
      const arr = _.find(result, o => o[keyStr] == keyValue)
      if (arr) {
        arr.children.push(item);
      } else {
        const obj = {};
        obj[keyStr] = keyValue;
        if (item.hasOwnProperty('njdm')) obj.njdm = item.njdm;
        obj.children = [];
        obj.children.push(item);
        result.push(obj);
      }
    });
    return result;
  },
  // 导出表格
  exportTable2Excel(oHtml, title) {
    const excelHtml = '<html> <head> <meta charset=\'utf-8\' /> ' +
      '    <style>\n' +
      '{\n' +
      '      border-collapse: collapse;\n' +
      '    }\n' +
      '.title th{\n' +
      '      height: 50px;\n' +
      '      font-size: 24px;\n' +
      '      font-family: \'微软雅黑\';\n' +
      '      font-weight: 700;\n' +
      '    }\n' +
      'tr th {\n' +
      '      border: 1px #000 solid;\n' +
      '      height: 40px;\n' +
      '      background: #efefef;\n' +
      '    }\n' +
      'tr td {\n' +
      '      padding: 0 40px;\n' +
      '      border: 1px #000 solid;\n' +
      '      height: 40px;\n' +
      '      text-align: center;\n' +
      '    }\n' +
      '.footer td {\n' +
      '      font-size: 20px;\n' +
      '      font-weight: 700;\n' +
      '    }\n' +
      '    </style>' +
      '</head><body>' + oHtml + '</body></html>';
    const excelBlob = new Blob([excelHtml], { type: 'application/vnd.ms-excel' });
    // 创建一个a标签
    const oA = document.createElement('a');
    // 利用URL.createObjectURL()方法为a元素生成blob URL
    oA.href = URL.createObjectURL(excelBlob);
    // 给文件命名
    oA.download = title + '.xls';
    // 模拟点击
    oA.click();
    // 移除
    oA.remove();
  },
  sortObjectByStr(data, key) { // 对数组对象中的字符串属性进行排序
    const sort_data = data.sort(
       firstBy((v1, v2) => v1[key].length - v2[key].length)
         .thenBy(key)
     );
    return sort_data;
  }

}
