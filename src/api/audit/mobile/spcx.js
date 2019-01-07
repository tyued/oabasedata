import fetch from "@/utils/fetch";
export function mbxx(query) {
  return fetch({
    url: '/api/workflow/spLcmbxx/mbxx',
    method: 'post',
    data: query
  });
}
export function myspsl(userid) {
  return fetch({
    url: '/api/workflow/spLcsl/mysprw/'+userid,
    method: 'get'
  });
}
export function myfqsl(userid) {
  return fetch({
    url: '/api/workflow/spLcsl/myfqrw/'+userid,
    method: 'get'
  });
}
export function mywcsl(userid) {
  return fetch({
    url: '/api/workflow/spLcsl/mywcrw/'+userid,
    method: 'get'
  });
}
export function mycssl(userid) {
  return fetch({
    url: '/api/workflow/spLcsl/mycsrw/'+userid,
    method: 'get'
  });
}
export function cxspslxx(slid) {
  return fetch({
    url: '/api/workflow/spLcsl/spslxx/'+slid,
    method: 'get'
  });
}
export function clslbz(query) {
  return fetch({
    url: '/api/workflow/spSlbz/clspbz',
    method: 'post',
    data: query
  });
}
export function cxspsl(slid) {
  return fetch({
    url: '/api/workflow/spLcsl/cxspsl/'+slid,
    method: 'put'
  });
}
export function page(query) {
  return fetch({
    url: '/api/workflow/spLcsl/pageLcsl',
    method: 'post',
    data: query
  });
}
export function del(id) {
  return fetch({
    url: '/api/workflow/spLcsl/' + id,
    method: 'delete'
  });
}
