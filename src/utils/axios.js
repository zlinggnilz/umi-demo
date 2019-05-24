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
service.interceptors.request.use(
  config =>
    // console.log(config);
    config,
  error => {
    console.log('request', error);
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const { status, data } = response;

    console.log('response', response);

    if (status !== 200) {
      return Promise.reject(response);
    }

    const res = {
      success: true,
      // code: 200,
      message: '',
      result: data,
    };

    if (!res.success) {
      // success 不是true 的情况
      message.error(res.message);
      return Promise.reject(res.message);
    }
    return data;
  },
  error => {
    console.log(`error: ${error}`); // for debug
    // message(error.mesage);
    return Promise.reject(error);
  }
);

export default service;
