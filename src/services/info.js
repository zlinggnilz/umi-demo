import request from '@/utils/axios';

export async function fetchInfo() {
  return request({ url: '/api/accountInfo', method: 'get' });
}

export async function formSubmit() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('success');
    }, 2500);
  });
}
