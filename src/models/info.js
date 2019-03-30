import * as services from '@/services/info';

export default {
  namespace: 'info',

  state: {
    info: {},
  },

  effects: {
    *fetchInfo({ payload }, { put, call }) {
      const data = yield call(services.fetchInfo, payload);
      yield put({
        type: 'setInfo',
        payload: data,
      });
    },
    *formSubmit1({ payload }, { call }) {
      yield call(services.formSubmit, payload);
      return Promise.resolve();
    },
    *formSubmit2({ payload }, { call }) {
      yield call(services.formSubmit, payload);
      return Promise.resolve();
    },
  },

  reducers: {
    setInfo(state, action) {
      return {
        ...state,
        info: action.payload,
      };
    },
  },
};
