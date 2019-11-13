import axios from 'axios';
import Vue from 'vue';

export function initialState() {
  return {
    data: [],
    byId: {},
    inserting: false,
  };
}

export default function insertableDataStore(dataUrl) {
  return {
    namespaced: true,
    state: initialState(),
    mutations: {
      startInserting(state) {
        Vue.set(state, 'inserting', true);
      },
      insert(state, entry) {
        Vue.set(state, 'data', [...state.data, entry]);
        Vue.set(state.byId, entry.id, entry);
      },
      finishInserting(state) {
        Vue.set(state, 'inserting', false);
      },
    },
    actions: {
      async insert({ commit, state }, entry) {
        if (state.inserting) {
          return;
        }
        commit('startInserting');
        try {
          const { data } = await axios.put(dataUrl, entry);
          if (state.inserting) {
            commit('insert', data);
          }
          commit('finishInserting');
        } catch (e) {
          console.error('unable to insert new entry', e, entry);
          commit('finishInserting');
        }
      },
    },
  };
}
