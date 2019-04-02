import request from '@/utils/axios';

export async function fetchRecords(payload) {
  return request('/api/records', { method: 'get', params: payload });
}
