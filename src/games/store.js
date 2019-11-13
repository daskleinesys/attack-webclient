import subscribableDataStore, { initialState as initialStateSubscribableDataStore } from '@/shared/storeMixins/subscribableDataStore';
import updatableDataStore, { initialState as initialStateUpdatableDataStore } from '@/shared/storeMixins/updatableDataStore';

const subscribable = subscribableDataStore('/api/games');
const updatable = updatableDataStore('/api/games');

export default {
  namespaced: true,
  state: {
    ...subscribable.state,
    ...updatable.state,
  },
  mutations: {
    ...subscribable.mutations,
    ...updatable.mutations,
    reset(state) {
      Object.assign(state, initialStateSubscribableDataStore(), initialStateUpdatableDataStore());
    },
  },
  actions: {
    ...subscribable.actions,
    ...updatable.actions,
  },
};
