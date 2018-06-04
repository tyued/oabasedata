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
export function cxbtbdx(bdid) {
  return   fetch({
    url: '/api/workflow/spLcbdx/mbbdx/' + bdid,
    method: 'get'
  })
}
