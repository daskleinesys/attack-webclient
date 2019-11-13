import subscribableDataStore, { initialState as initialStateSubscribableDataStore } from '@/shared/storeMixins/subscribableDataStore';
import updatableDataStore, { initialState as initialStateUpdatableDataStore } from '@/shared/storeMixins/updatableDataStore';

const subscribable = subscribableDataStore('/api/areas');
const updatable = updatableDataStore('/api/areas');

const mapsPolygonToDatabasePolygon = (polygon) => {
  const line = polygon.getPath()
    .getArray()
    .map(point => [point.lat(), point.lng()]);
  line.push(line[0]);
  return [line];
};

const areas = {
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
    async addPolygonToArea({ dispatch }, { area, polygon }) {
      const geometry = {
        type: 'MultiPolygon',
        coordinates: [],
      };
      if (area.geometry != null && area.geometry.type === 'MultiPolygon') {
        geometry.coordinates = JSON.parse(JSON.stringify(area.geometry.coordinates));
      }
      geometry.coordinates.push(mapsPolygonToDatabasePolygon(polygon));
      dispatch('updateById', {
        id: area.id,
        geometry,
      });
    },
    async updatePolygonAreas({ dispatch }, { area, polygons }) {
      const geometry = {
        type: 'MultiPolygon',
        coordinates: polygons.map(polygon => mapsPolygonToDatabasePolygon(polygon)),
      };
      dispatch('updateById', {
        id: area.id,
        geometry,
      });
    },
  },
};

export default areas;
