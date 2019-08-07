import Mock from 'mockjs';
import { delay } from 'roadhog-api-doc';

const proxy = {
  'GET /api/records': Mock.mock({
    code: 200,
    result: {
      'list|10': [{ 'id|+1': 123, name: '@name', 'noid|+1': 123, email: '@email' }],
      total: 60,
    },
    message: '',
  }),
  'GET /api/accountInfo': Mock.mock({
    code: 200,
    result: { name: '@name', email: '@email', birth: '@datetime', city: '@city', 'balance|1-100': 30 },
    message: '',
  }),
};

export default delay(proxy, 2000);
