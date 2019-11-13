import subscribableDataStore, { initialState as initialStateSubscribableDataStore } from '@/shared/storeMixins/subscribableDataStore';
import insertableDataStore, { initialState as initialStateInsertableDataStore } from '@/shared/storeMixins/insertableDataStore';

const subscribable = subscribableDataStore('/api/games');
const insertable = insertableDataStore('/api/games');

export default {
  namespaced: true,
  state: {
    ...subscribable.state,
    ...insertable.state,
  },
  mutations: {
    ...subscribable.mutations,
    ...insertable.mutations,
    reset(state) {
      Object.assign(state, initialStateSubscribableDataStore(), initialStateInsertableDataStore());
    },
  },
  actions: {
    ...subscribable.actions,
    ...insertable.actions,
  },
};
