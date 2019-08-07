import { query as queryUsers, queryCurrent } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {
      name: 'Test',
      userid: '00000001',
      email: 'test@test.com',
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const { data } = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: data,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const { data } = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
