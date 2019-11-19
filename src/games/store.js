import subscribableDataStore, { initialState as initialStateSubscribableDataStore } from '@/shared/storeMixins/subscribableDataStore';
import insertableDataStore, { initialState as initialStateInsertableDataStore } from '@/shared/storeMixins/insertableDataStore';
import deletableDataStore, { initialState as initialStateDeletableDataStore } from '@/shared/storeMixins/deletableDataStore';

const subscribable = subscribableDataStore('/api/games');
const insertable = insertableDataStore('/api/games');
const deletable = deletableDataStore('/api/games');

export default {
  namespaced: true,
  state: {
    ...subscribable.state,
    ...insertable.state,
    ...deletable.state,
  },
  mutations: {
    ...subscribable.mutations,
    ...insertable.mutations,
    ...deletable.mutations,
    reset(state) {
      Object.assign(state, initialStateSubscribableDataStore(), initialStateInsertableDataStore(), initialStateDeletableDataStore());
    },
  },
  actions: {
    ...subscribable.actions,
    ...insertable.actions,
    ...deletable.actions,
  },
};
