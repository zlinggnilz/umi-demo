import * as services from '@/services/account';

export default {
  namespace: 'account',

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
