import axios from 'axios';
import Vue from 'vue';

import { ORIGIN_AUTH } from '@/shared/constants';

export const reducer = state => ({
  user: state.user,
  status: state.status,
  token: state.token,
});

export const initialState = () => ({
  fetching: false,
  user: null,
  status: null,
  token: null,
});

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    reset(state) {
      Object.assign(state, initialState());
    },
    startFetching(state) {
      Vue.set(state, 'fetching', true);
    },
    setUser(state, { user, status, token }) {
      Vue.set(state, 'user', user);
      Vue.set(state, 'status', status);
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
        const { data } = await axios.post(`${ORIGIN_AUTH}/login`, {
          username,
          password,
        });
        if (!state.fetching || typeof data !== 'string') {
          return;
        }
        const payload = JSON.parse(atob(decodeURIComponent(data.split('.')[1])));
        commit('setUser', {
          user: payload.sub,
          status: payload.status,
          token: data,
        });
      } catch (e) {
        dispatch('logout');
      }
    },
  },
};
