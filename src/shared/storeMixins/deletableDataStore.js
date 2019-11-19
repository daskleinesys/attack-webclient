import axios from 'axios';
import Vue from 'vue';

export function initialState() {
  return {
    data: [],
    byId: {},
    deleting: null,
  };
}

export default function insertableDataStore(dataUrl) {
  return {
    namespaced: true,
    state: initialState(),
    mutations: {
      startDeleting(state, { id }) {
        Vue.set(state, 'deleting', id);
      },
      delete(state, { id }) {
        Vue.set(state, 'data', state.data.filter(entry => entry.id !== id));
        delete state[id];
      },
      finishDeleting(state) {
        Vue.set(state, 'deleting', null);
      },
    },
    actions: {
      async delete({ commit, state }, entry) {
        if (state.deleting) {
          return;
        }
        commit('startDeleting', entry);
        try {
          await axios.delete(`${dataUrl}/${entry.id}`);
          if (state.deleting === entry.id) {
            commit('delete', entry);
          }
        } catch (e) {
          console.error('unable to delete entry', e, entry);
        }
        commit('finishDeleting');
      },
    },
  };
}
