import fetch from 'utils/fetch';

export function loginByEmailadmin (username, password, kaptcha) {
  const data = {
    username,
    password,
    kaptcha
  };
  return fetch({
    url: '/api/auth/jwt/token',
    method: 'post',
    data
  });
}
export function loginByEmail(adminusercode, adminpassword, usercode) {
  const data = {
    adminusercode,
    adminpassword,
    usercode
  };
  return fetch({
    url: '/api/auth/jwt/adminToanyToken',
    method: 'post',
    data
  });
}
export function logout(token) {
  return fetch({
    url: '/api/auth/jwt/invalid',
    method: 'post',
    params: { token }
  });
}


export function lga(data) {
  return fetch({
    url: '/api/auth/jwt/token',
    method: 'post',
    data
  });
}

export function getvalidateYzm(params) {
  return fetch({
    url: '/api/auth/jwt/vrifyKaptcha',
    method: 'get',
    params
  })
}

