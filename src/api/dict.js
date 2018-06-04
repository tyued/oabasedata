import axios from 'axios';

export function getDict() {
  return new Promise(resolve => {
    axios.get('/static/dictionary.JSON').then(res => {
      resolve(res);
    }, err => {
      console.log(err)
      resolve('err')
    });
  });
}
export function getXXMess(id) {
  return new Promise(resolve => {
    axios.get('/static/' + id + '.JSON').then(res => {
      resolve(res);
    }, err => {
      console.log(err)
      resolve('err')
    });
  });
}


