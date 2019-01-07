import fetch from 'utils/fetch';

export function kczdpk(data) {
  return fetch({
    url: '/api/admin/kskcpk/' + data,
    method: 'get'
  })
}
