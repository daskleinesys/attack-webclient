import axios from 'axios';
import Vue from 'vue';

export function initialState() {
  return {
    fetching: false,
    user: null,
    token: null,
  };
}

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    startFetching(state) {
      Vue.set(state, 'fetching', true);
    },
    setUser(state, { user, token }) {
      Vue.set(state, 'user', user);
      Vue.set(state, 'token', token);
      Vue.set(state, 'fetching', false);
    },
  },
  actions: {
    async login({ state, commit }) {
      if (state.fetching) {
        return;
      }
      commit('startFetching');
      const { data } = await axios('http://localhost:3000/');
      commit('setUser', {
        user: 'test',
        token: data,
      });
    },
    logout({ commit }) {
      commit('setUser', {
        user: null,
        token: null,
      });
    },
  },
};
