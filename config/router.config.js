export default [
  // {
  //   path: '/pasport',
  //   component: '../layouts/UserLayout',
  //   routes: [
  //     {
  //       path: '/passport/login',
  //       component: './passport/login',
  //     },
  //   ],
  // },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    // Routes: ['src/components/Authorized'],
    routes: [
      {
        path: '/',
        redirect: '/account',
      },
      {
        path: '/account',
        name: '账户',
        icon: 'user',
        component: './account',
      },
      {
        path: '/demo',
        name: '页面',
        icon: 'reconciliation',
        routes: [
          {
            path: '/demo/form',
            name: '多级表单',
            component: './demo/form',
          },
          {
            path: '/demo/table',
            name: '翻页表格',
            component: './demo/table',
          },
        ],
      },
    ],
  },
];
