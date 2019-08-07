import * as services from '@/services/table';

export default {
  namespace: 'table',

  state: {
    records: [],
  },

  effects: {
    *fetchRecords({ payload }, { put, call }) {
      yield put({
        type: 'setRecords',
        payload: [],
      });

      const { data } = yield call(services.fetchRecords, payload);
      yield put({
        type: 'setRecords',
        payload: data.list,
      });
      return Promise.resolve(data.total);
    },
  },

  reducers: {
    setRecords(state, action) {
      return {
        ...state,
        records: action.payload,
      };
    },
  },
};
