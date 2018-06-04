import fetch from 'utils/fetch';

export function getInfo(token) {
  return fetch({
    url: '/api/admin/user/front/info',
    // url: '/user/front/info',
    method: 'get',
    params: { token }
  });
}

export function getMenus(token) {
  return fetch({
    url: '/api/admin/user/front/menus',
    // url: '/user/front/menus',
    method: 'get',
    params: { token }
  });
}