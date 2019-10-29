import axios from 'axios';
import Vue from 'vue';

export function initialState() {
  return {
    data: [],
    byId: {},
    updating: false,
  };
}

export function updatableDataStore(dataUrl) {
  return {
    namespaced: true,
    state: initialState(),
    mutations: {
      startUpdating(state) {
        Vue.set(state, 'updating', true);
      },
      updateEntry(state, entry) {
        const newEntry = {
          ...state.byId[entry.id],
          ...entry,
        };
        const data = state.data.map((currentEntry) => {
          if (currentEntry.id === entry.id) {
            return newEntry;
          }
          return currentEntry;
        });
        Vue.set(state, 'data', data);
        Vue.set(state.byId, entry.id, newEntry);
      },
      finishUpdating(state) {
        Vue.set(state, 'updating', false);
      },
    },
    actions: {
      async updateById({ commit, state }, entry) {
        if (
          typeof entry.id !== 'number'
          || state.byId[entry.id] == null
        ) {
          return;
        }
        commit('startUpdating');
        commit('updateEntry', entry);
        const oldEntry = state.byId[entry.id];
        try {
          const response = await axios.post(`${dataUrl}/${entry.id}`, entry);
          commit('updateEntry', response);
          commit('finishUpdating');
        } catch (e) {
          console.error('unable to update entry', e, entry);
          commit('updateEntry', oldEntry);
          commit('finishUpdating');
        }
      },
    },
  };
}
