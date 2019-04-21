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
        redirect: '/display/simple',
      },
      {
        path: '/display',
        name: '信息展示',
        icon: 'user',
        routes: [
          {
            path: '/display/simple',
            name: '普通',
            component: './display/simple',
          },
        ],
      },
      {
        path: '/table',
        name: '翻页表格',
        icon: 'table',
        component: './table',
      },
      {
        path: '/banner',
        name: 'Banner',
        icon: 'image',
        component: './banner',
      },
    ],
  },
];
