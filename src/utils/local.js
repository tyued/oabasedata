/**
 * 保存，取出local,删除存储(指定/全部)
 */
const setlocal = (str, datas) => {
  let data
  if (typeof (datas) === 'string') {
    var obj = {}
    obj.info = datas
    data = JSON.stringify(obj)
  } else {
    data = JSON.stringify(datas)
  }
  window.localStorage.setItem(str, data)
}

const getlocal = (str) => {
  let data = JSON.parse(window.localStorage.getItem(str))
  return data
}
const clearlocal = (str, type) => {
  if (str) {
    if (type === 'all') { // 全删除（慎用，最好不用）
      window.localStorage.clear()
    } else if (type === 'appoint') { // 指定删除
      window.localStorage.removeItem(str)
    }
  } else {
    alert('缺少必要参数')
  }
}
export {
  clearlocal, getlocal, setlocal
}