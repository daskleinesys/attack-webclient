import axios from 'axios';
import Vue from 'vue';

import router from '@/router';

export const reducer = state => ({
  user: state.user,
  token: state.token,
});

export const initialState = () => ({
  fetching: false,
  user: null,
  token: null,
});

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
    async login({ state, commit, dispatch }, { username, password }) {
      if (state.fetching) {
        return;
      }
      commit('startFetching');
      try {
        const { data } = await axios.post('http://localhost:3000/login', {
          username,
          password,
        });
        commit('setUser', {
          user: username,
          token: data,
        });
      } catch (e) {
        dispatch('logout');
      }
    },
    logout({ commit }) {
      commit('setUser', {
        user: null,
        token: null,
      });
      router.push({ name: 'home' });
    },
  },
};
