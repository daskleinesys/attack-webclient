import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function initialState() {
  return {};
}

export default new Vuex.Store({
  state: initialState(),
  mutations: {},
  actions: {},
  modules: {},
  getters: {},
});
