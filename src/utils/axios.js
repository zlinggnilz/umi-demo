import axios from 'axios';
import { baseurl } from '@/constans';
import { get } from 'lodash';
import errorMsg from '@/constans/errorMsg';
import { Notification } from 'antd';
// import router from 'umi/router'

const service = axios.create({
  baseURL: baseurl,
  timeout: 15000, // request timeout
  // withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// request interceptor
service.interceptors.request.use(
  config => {
    if (config.method === 'get' && config.data) {
      config.params = config.data;
      delete config.data;
    }

    return config;
  },
  error => {
    console.log('request error', error.message);
    Notification.error({
      ...errorMsg['500'],
      key: 'networkError',
    });
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const { data } = response;

    const { code: resCode, result } = data;

    if (resCode !== 200) {
      Notification.error({
        ...errorMsg[resCode],
        key: resCode,
      });

      return Promise.reject({ error: 'error', code: resCode });
    }

    return { data: result };
  },
  error => {
    console.log('response error', error);

    const code = get(error.response, 'status');
    
    /** 401 跳转登录 */
    // if(code === 401){
    //   router.push('/login')
    // }

    Notification.error({
      ...errorMsg[code],
      key: 'networkError',
    });

    return Promise.reject({ error });
  }
);

export default service;
