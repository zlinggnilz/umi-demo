import request from '@/utils/axios';

export async function fetchInfo(params) {
  return request('/api/accountInfo', { method: 'get', data: params });
}

export async function formSubmit() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ code: 200, message: 'success' });
    }, 2500);
  });
}
