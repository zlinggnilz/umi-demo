import request from '@/utils/axios';

export async function fetchRecords(payload) {
  return request({ url: '/api/records', method: 'get', params: payload });
}
