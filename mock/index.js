import mockjs from 'mockjs';

Mock.setup({
  timeout: '1000 - 5000', // 方式二 设置区间 注意这个是一个字符串形式
});

export default {
  'GET /api/records': mockjs.mock({
    'list|10': [{ 'id|+1': 123, name: '@name', 'noid|+1': 123, email: '@email' }],
    total: 60,
  }),
  'GET /api/userInfo': mockjs.mock({ name: '@name', email: '@email', create: '@datetime', city: '@city' }),
};
