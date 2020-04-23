import Vue from 'vue';
import Vuex from 'vuex';
import { SET_USER_INFO, SET_USERS } from './mutation.type';
import { GET_USER, GET_USERS, SEARCH_USERS } from './action.type';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: {},
  },
  getters: {
    users: (state) => {
      return Object.values(state.users);
    },
    user: (state) => (login) => {
      return { ...(state.users[login] || {}), ...JSON.parse(localStorage.getItem(login) || '{}') };
    }
  },
  mutations: {
    [SET_USERS]: (state, users) => {
      state.users = {
        ...users.reduce((acc, user) => ({ [user.login]: user, ...acc }), {}),
      }
    },
    [SET_USER_INFO]: (state, { rewriteStorage = false, ...user }) => {
      const currentUser = state.users[user.login] || {};
      const newUserObject = { ...currentUser, ...user };

      state.users = {
        ...state.users,
        [user.login]: newUserObject,
      };

      if (!rewriteStorage) return;

      const { comment, images, login } = newUserObject;
      localStorage.setItem(user.login, JSON.stringify({ comment, images, login }));
    }
  },
  actions: {
    [SEARCH_USERS]: (context, query) => {
      return Vue.axios.get('https://api.github.com/search/users', { params: { q: query } })
        .then(({ data }) => context.commit(SET_USERS, data.items))
    },
    [GET_USER]: (context, login) => {
      return Vue.axios.get(`https://api.github.com/users/${login}`)
        .then(({ data: user }) => context.commit(SET_USER_INFO, user))
    },
    [GET_USERS]: (context) => {
      return Vue.axios.get(`https://api.github.com/users`)
        .then(({ data }) => context.commit(SET_USERS, data));
    },
  },
});
