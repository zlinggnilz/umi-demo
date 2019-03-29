import * as services from '@/services/account';

export default {
  namespace: 'multiform',

  state: {},

  reducers: {
    setKey(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    delKey(state, action) {
      const name = `${action.payload}-`;
      const keys = Object.keys(state).filter(item => item.indexOf(name) !== 0);
      const obj = keys.length ? keys.reduce((total, item) => (total[item] = state[item]), {}) : {};
      return obj;
    },
  },
};
