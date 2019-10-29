import axios from 'axios';
import Vue from 'vue';

export function initialState() {
  return {
    data: [],
    byId: {},
    fetching: false,
    observers: [],
    axiosSource: null,
  };
}

export function subscribableDataStore(dataUrl) {
  return {
    namespaced: true,
    state: initialState(),
    mutations: {
      startFetching(state, axiosSource) {
        Vue.set(state, 'fetching', true);
        Vue.set(state, 'axiosSource', axiosSource);
      },
      addObserver(state, resolve) {
        Vue.set(state, 'observers', [
          ...state.observers,
          resolve,
        ]);
      },
      loadAll(state, { data }) {
        const byId = data.reduce((currentById, entry) => ({
          ...currentById,
          [entry.id]: entry,
        }), {});
        Vue.set(state, 'data', data);
        Vue.set(state, 'byId', byId);
      },
      finishFetching(state) {
        Vue.set(state, 'observers', []);
        Vue.set(state, 'fetching', false);
        Vue.set(state, 'axiosSource', null);
      },
    },
    actions: {
      async subscribe({ commit, dispatch, state }) {
        if (state.data.length > 0) {
          return;
        }
        if (!state.fetching) {
          dispatch('loadAll');
        }
        await new Promise(resolve => commit('addObserver', resolve));
      },
      async loadAll({ commit, state }) {
        const source = axios.CancelToken.source();
        commit('startFetching', source);
        try {
          const response = await axios.get(dataUrl, { cancelToken: source.token });
          commit('loadAll', response);
          state.observers.forEach(resolve => resolve());
          commit('finishFetching');
        } catch (e) {
          commit('finishFetching');
        }
      },
      reset({ commit, state }) {
        if (state.fetching) {
          state.axiosSource.cancel();
        }
        commit('loadAll', initialState());
        commit('finishFetching');
      },
    },
    getters: {
      byId: state => state.byId,
    },
  };
}
