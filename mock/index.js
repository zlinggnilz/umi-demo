import Mock from 'mockjs';
import { delay } from 'roadhog-api-doc';

const proxy = {
  'GET /api/records': Mock.mock({
    'list|10': [{ 'id|+1': 123, name: '@name', 'noid|+1': 123, email: '@email' }],
    total: 60,
  }),
  'GET /api/accountInfo': Mock.mock({ name: '@name', email: '@email', birth: '@datetime', city: '@city', 'balance|1-100': 30 }),
};

export default delay(proxy, 2500);
