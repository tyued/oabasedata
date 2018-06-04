import fetch from 'utils/fetch';

export function loginByEmail(username, password) {
  const data = {
    username,
    password
  };
  return fetch({
    url: '/api/auth/jwt/token',
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

