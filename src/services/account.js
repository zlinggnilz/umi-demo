import request from '@/utils/axios';

export async function fetchInfo() {
  return request({ url: '/api/accountInfo', method: 'get' });
}
