import axios from 'axios';
import { message } from 'antd';
import { baseurl } from '@/constans';

// create an axios instance
const service = axios.create({
  baseURL: baseurl,
  timeout: 10000, // request timeout
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// request interceptor
axios.interceptors.request.use(
  config => {
    console.log(config);
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    // const res = response.data;

    const res = {
      success: true,
      code: 200,
      message: '',
      result: response.data,
    };

    if (res.code !== 200) {
      message.error(res.message, 5 * 1000);

      if (res.code === 401 || res.code === 403) {
        // 跳转到登录页
      }
      return Promise.reject(res.message);
    }
    if (!res.success) {
      // success 不是true 的情况
      message.error(res.message);
      return Promise.reject(res.message);
    }
    return response.data;
  },
  error => {
    console.log(`error: ${error}`); // for debug
    // message(error.mesage);
    return Promise.reject(error);
  }
);

export default service;
