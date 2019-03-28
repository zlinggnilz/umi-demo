import axios from 'axios';
import { message } from 'antd';

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(error => {
  console.log(error); // for debug
  Promise.reject(error);
});

// response interceptor
service.interceptors.response.use(
  response => response,

  response => {
    const res = response.data;
    if (res.code !== 200) {
      message.error(res.message, 5 * 1000);

      if (res.code === 401 || res.code === 403) {
        // 跳转到登录页
      }
      return Promise.reject('error');
    } else {
      console.log(res);
      // if(!res.success){
      //   // success 不是true 的情况
      // }
      return res;
    }
  },
  error => {
    console.log('err' + error); // for debug
    message(error.mesage);
    return Promise.reject(error);
  }
);

export default service;
