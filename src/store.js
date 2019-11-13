import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

import auth, { reducer } from '@/auth';
import areas from '@/areas/store';
import router from '@/router';

Vue.use(Vuex);

const persistAuth = new VuexPersistence({
  reducer: state => ({
    auth: reducer(state.auth),
  }),
  storage: window.sessionStorage,
});

export function initialState() {
  return {};
}

export default new Vuex.Store({
  state: initialState(),
  mutations: {
    reset(state) {
      Object.assign(state, initialState());
    },
  },
  actions: {
    logout({ commit }) {
      commit('reset');
      commit('auth/reset');
      commit('areas/reset');
      router.push({ name: 'home' });
    },
  },
  modules: {
    auth,
    areas,
  },
  getters: {
    // DATA
    areas: state => state.areas,
  },
  plugins: [persistAuth.plugin],
});
