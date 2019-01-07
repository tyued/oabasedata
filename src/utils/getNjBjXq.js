import * as api from 'api/publicLibManager'
// 获取年级数据
export const getNj = async (xxdm) => {
  let res = await api.getNj({
    schoolcode: xxdm
  })
  if (res.State == 1 && res.Value) {
    return res.Value
  } else {
    return []
  }
}
// 获取所有的班级数据
export const getBj = async (xxdm) => {
  let res = await api.getBj({
    schoolcode: xxdm
  })
  if (res.State == 1 && res.Value) {
    return res.Value
  } else {
    return []
  }
}

// 是否显示学期
export const getGradeState = async (xxdm) => {
  const res = await api.getGradeState({
    SchoolCode: xxdm
  })
  if (res.State == 1 && res.Value) {
    return parseInt(res.Value.HaveTerm) // 是否显示学期
  } else {
    return 2
  }
}
// 获取学校代码
export const getSchoolCode = () => {
  let xxdm = JSON.parse(window.localStorage.getItem('xxdm') || null)
  return xxdm
}

// 获取图书类型
export const formatBookType = (index) => {
  let arr = [
    '历史/地理',
    '故事/漫画',
    '国学/礼仪',
    '名人/传记',
    '人文/教育',
    '诗词/散文',
    '艺术/综合',
    '自然/科普',
    '小说/名著',
    '其他'
  ]
  return arr[--index]
}

// 获取必读选读
export const formatType = (index) => {
  let arr = [
    '必读',
    '选读'
  ]
  return arr[--index]
}

export const formatDate = () => {
  var date = new Date();
  return date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
}