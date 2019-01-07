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


