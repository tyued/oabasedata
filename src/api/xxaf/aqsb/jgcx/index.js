 import fetch from  'utils/fetch';

export function pagelist(query) {
  return fetch({
    url: '/api/admin/aqsb/pageJglist',
    method: 'post',
    data: query
  });
}


export function delObj(query) {
  return fetch({
    url: '/api/admin/aqsb/delXcjg',
    method: 'post',
    data: query
  });
}


 export function  getCkxx(query) {
   return fetch({
     url: '/api/admin/aqsb/ckXcjg',
     method: 'get',
     params: query
   });
 }

export function getDclist(query) {
  return fetch({
    url: '/api/admin/aqsb/dcJg',
    method: 'post',
    data: query
  });
}


 export function getLblist(query) {
   return fetch({
     url: '/api/admin/aqsb/getLbxx',
     method: 'get',
     params: query
   });
 }




