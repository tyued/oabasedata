import fetch from 'utils/fetch';

export function getSchool(query) {
  return fetch({
    url: '/api/base/jcXxjbsj/all',
    method: 'get',
    params: query
  });
}


