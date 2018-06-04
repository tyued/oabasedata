import fetch from 'utils/fetch';
export function cxspxxBymb(mbid,userid) {
  return fetch({
    url: '/api/workflow/spLcmbxx/sqlcByid?mbid=' + mbid+"&userid="+userid,
    method: 'get'
  })
}
export function cxspxxBylx(mbid,userid,xxdm) {
  return fetch({
    url: '/api/workflow/spLcmbxx/sqlcBylx?mbid=' + mbid+"&userid="+userid+"&xxdm="+xxdm,
    method: 'get'
  });
}
export function cxlcbzbybdxx(query) {
  return fetch({
    url: '/api/workflow/spLcsl/cxlcslbzBytj',
    method: 'post',
    data: query
  });
}
export function bcxlbz(query) {
  return fetch({
    url: '/api/workflow/spLcsl/bcslbz',
    method: 'post',
    data: query,
  });
}
export function cxjqxx(jqmc,xxdm) {
  return fetch({
    url: '/api/workflow/jcqjjq/cxqjxxByname?jqmc=' + jqmc+"&xxdm="+xxdm,
    method: 'get'
  });
}
