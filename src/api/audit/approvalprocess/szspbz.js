import fetch from 'utils/fetch';

export function cxlcbz(mbid) {
  return fetch({
    url: '/api/workflow/spLcmbxx/' + mbid,
    method: 'get'
  })
}
export function bcspbztj(obj) {
  return fetch({
    url: '/api/workflow/spLcmbxx/addbztj',
    method: 'post',
    data: obj
  });
}
// 查询可作为审批条件的表单项
export function cxbtbdx(bdid) {
  return fetch({
    url: '/api/workflow/spLcbdx/mbbdx/' + bdid,
    method: 'get'
  })
}
// 查询可作为审批步骤的表单项
export function cxbzbdx(bdid) {
  return fetch({
    url: '/api/workflow/spLcbdx/mbbzbdx/' + bdid,
    method: 'get'
  })
}
