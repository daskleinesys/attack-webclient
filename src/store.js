import Vue from 'vue';
import Vuex from 'vuex';

import auth from '@/auth';

Vue.use(Vuex);

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
});
