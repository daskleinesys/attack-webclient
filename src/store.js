import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

import auth, { reducer } from '@/auth';

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
  mutations: {},
  actions: {},
  modules: {
    auth,
  },
  getters: {},
  plugins: [persistAuth.plugin],
});
