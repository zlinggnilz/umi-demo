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
      const obj = {};
      keys.forEach(item => {
        obj[item] = state[item];
      });
      return obj;
    },
  },
};
