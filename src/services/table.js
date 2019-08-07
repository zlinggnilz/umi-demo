import request from '@/utils/axios';

export async function fetchRecords(params) {
  return request('/api/records', { method: 'get', data: params });
}
