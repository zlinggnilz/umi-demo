// https://umijs.org/config/
import os from 'os';
import slash from 'slash2';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';

const cssExtract = require('mini-css-extract-plugin');

const { pwa, primaryColor } = defaultSettings;
const { APP_TYPE, TEST } = process.env;

const theme = {
  'primary-color': '#004771',
  'primary-1': '#d8e2e4',
  'border-radius-base': 0,
  'border-radius-sm': 0,
  'btn-border-radius-base': 0,
  'btn-border-radius-sm': 0,
  'btn-height-base': '40px',
  'btn-height-lg': '48px',
  'btn-height-sm': '30px',
  'table-border-radius-base': 0,
  'card-head-padding': '10px',
  'card-inner-head-padding': '8px',
  'card-radius': 0,
  'avatar-border-radius': 0,
  'input-height-base': '40px',
  'input-height-lg': '48px',
  'input-height-sm': '28px',
};

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: false, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      ...(!TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: false,
          }
        : {}),
    },
  ],
];

export default {
  history: 'hash',
  // add for transfer to umi
  plugins,
  define: {
    APP_TYPE: APP_TYPE || '',
  },
  treeShaking: true,
  targets: {
    ie: 10,
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme,
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  // manifest: {
  //   basePath: '/max/',
  // },

  // base: '/max/',
  // publicPath: '/max/',
  // outputPath: './dist/max',

  // chainWebpack: webpackPlugin,
  chainWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      config.output.filename('static/js/[name].[chunkhash:8].js').chunkFilename('static/js/[name].[chunkhash:8].chunk.js');
      config.plugin('extract-css').use(cssExtract, [
        {
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        },
      ]);
    }
  },
};
