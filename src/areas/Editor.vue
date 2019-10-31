<template>
  <div class="editor">
    <aside class="editor__controls">
      <BFormSelect
        class="editor__control"
        v-model="areaSelected"
        :options="areaOptions"
      />
      <BButton
        class="editor__control"
        :variant="drawingPolygon ? 'primary' : ''"
        :disabled="areaSelected == null"
        @click="drawPolygon"
      >
        Add Polygon
      </BButton>
      <BButton
        class="editor__control"
        :variant="editingPolygon ? 'primary' : ''"
        @click="editPolygon"
      >
        Edit Polygon
      </BButton>
      <BButton
        class="editor__control"
        :variant="deletingPolygon ? 'primary' : ''"
        @click="deletePolygon"
      >
        Delete Polygon
      </BButton>
      <BButton
        class="editor__control"
        :disabled="!drawingPolygon && !editingPolygon && !deletingPolygon && areaSelected == null"
        @click="cancelPolygonActions(true)"
      >
        Cancel Action
      </BButton>
    </aside>
    <div class="editor__map-wrapper">
      <MapItemTooltip
        v-if="this.map != null"
        :map="this.map"
        :polygon="hoveredPolygon"
      >
        <div class="editor__polygon-tooltip">
          {{ polygonTooltipData.title }}<br>
          {{ polygonTooltipData.economy }} economy
        </div>
      </MapItemTooltip>
      <div
        class="editor__map-container"
        ref="editor__map-container"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import MapItemTooltip from '@/shared/components/MapItemTooltip.vue';
import googleMapsApi from '@/shared/modules/googleMapsApi';
import { mapStylesEditor } from '@/shared/constants';

const polygonOptions = {
  strokeColor: '#343a40',
  strokeOpacity: 1,
  strokeWeight: 2,
  fillColor: '#e9ecef',
  fillOpacity: 0.6,
  editable: false,
  clickable: true,
};
const seaPolygonOptions = {
  fillColor: '#007bff',
  fillOpacity: 0.2,
};
const activePolygonOptions = {
  fillColor: '#28a745',
};
const hoveredPolygonOptions = {
  fillColor: '#6c757d',
  fillOpacity: 1,
};
const adjacentPolygonOptions = {
  fillColor: '#ced4da',
  fillOpacity: 1,
};

export default {
  name: 'Editor',
  data() {
    return {
      google: null,
      map: null,
      drawingManger: null,
      polygons: [],
      hoveredPolygon: null,

      // controls
      areaSelected: null,
      drawingPolygon: false,
      editingPolygon: false,
      deletingPolygon: false,
    };
  },
  components: { MapItemTooltip },
  computed: {
    ...mapGetters(['areas']),
    areaOptions() {
      return this.areas.data.map(area => ({
        value: area.id,
        text: `${area.number} - ${area.name}`,
      }));
    },
    polygonTooltipData() {
      const data = {
        title: '',
        economy: null,
      };
      if (this.hoveredPolygon == null) {
        return data;
      }
      const area = this.areas.byId[this.hoveredPolygon.areaId];
      data.title = `${area.number} - ${area.name}`;
      if (area.id_type === 1) {
        data.economy = area.economy;
      }
      return data;
    },
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('areas/subscribe'),
      this.loadGoogleMaps(),
    ]);
    this.drawMap();
    this.initDrawingManager();
  },
  watch: {
    areaSelected() {
      this.updatePolygons();
    },
  },
  methods: {
    async loadGoogleMaps() {
      this.google = await googleMapsApi();
    },
    drawMap() {
      const options = {
        styles: mapStylesEditor,
        tilt: 0,
        mapTypeId: this.google.maps.MapTypeId.TERRAIN,
        disableDefaultUI: true,
        mapTypeControl: false,
        zoomControl: false,
        fullscreenControl: false,
      };
      this.map = new this.google.maps.Map(this.$refs['editor__map-container'], options);
      this.map.setCenter({
        lat: 30.047746,
        lng: 31.235288,
      });
      this.map.setZoom(3);
      this.areas.data.forEach((area) => {
        if (area.geometry == null || area.geometry.type !== 'MultiPolygon') {
          return;
        }
        area.geometry.coordinates.forEach((polygon) => {
          const paths = polygon.map(line => line
            .slice(0, -1)
            .map(point => ({
              lat: point[0],
              lng: point[1],
            })));
          const newPolygon = new this.google.maps.Polygon({
            ...polygonOptions,
            paths,
          });
          newPolygon.setMap(this.map);
          this.initPolygon(newPolygon, area);
        });
      });
    },
    initDrawingManager() {
      this.drawingManager = new this.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions,
      });
      this.drawingManager.setMap(this.map);
      this.google.maps.event.addListener(this.drawingManager, 'polygoncomplete', (polygon) => {
        this.cancelPolygonActions();
        if (this.areaSelected == null) {
          polygon.setMap(null);
          return;
        }
        const area = this.areas.byId[this.areaSelected];
        this.initPolygon(polygon, area);
        this.updatePolygons();

        this.$store.dispatch('areas/addPolygonToArea', {
          area,
          polygon,
        });
      });
    },
    initPolygon(polygon, area) {
      // eslint-disable-next-line no-param-reassign
      polygon.areaId = area.id;
      this.polygons.push(polygon);

      this.google.maps.event.addListener(polygon.getPath(), 'set_at', () => this.persistPolygonsForArea(polygon.areaId));
      this.google.maps.event.addListener(polygon.getPath(), 'insert_at', () => this.persistPolygonsForArea(polygon.areaId));

      this.google.maps.event.addListener(polygon, 'click', () => {
        if (this.deletingPolygon) {
          polygon.setMap(null);
          this.polygons = this.polygons.filter(currentPolygon => currentPolygon !== polygon);
          this.updatePolygons();
          this.$store.dispatch('areas/updatePolygonAreas', {
            area: this.areas.byId[polygon.areaId],
            polygons: this.polygons.filter(currentPolygon => currentPolygon.areaId === polygon.areaId),
          });
        } else {
          this.areaSelected = polygon.areaId;
        }
      });
      this.google.maps.event.addListener(polygon, 'mouseover', () => {
        this.hoveredPolygon = polygon;
        this.updatePolygons();
      });
      this.google.maps.event.addListener(polygon, 'mouseout', () => {
        if (this.hoveredPolygon === polygon) {
          this.hoveredPolygon = null;
          this.updatePolygons();
        }
      });
    },
    drawPolygon() {
      this.cancelPolygonActions();
      this.drawingManager.setDrawingMode(this.google.maps.drawing.OverlayType.POLYGON);
      this.drawingPolygon = true;
    },
    editPolygon() {
      this.cancelPolygonActions();
      this.editingPolygon = true;
      this.updatePolygons();
    },
    deletePolygon() {
      this.cancelPolygonActions(true);
      this.deletingPolygon = true;
      this.updatePolygons();
    },
    cancelPolygonActions(deselectArea) {
      if (deselectArea) {
        this.areaSelected = null;
      }
      this.drawingManager.setDrawingMode(null);
      this.drawingPolygon = false;
      this.editingPolygon = false;
      this.deletingPolygon = false;
    },
    updatePolygons() {
      this.polygons.forEach((polygon) => {
        const options = { ...polygonOptions };
        const area = this.areas.byId[polygon.areaId];
        if (area.id_type === 2) {
          Object.assign(options, seaPolygonOptions);
        }
        if (polygon.areaId === this.areaSelected) {
          Object.assign(options, activePolygonOptions);
          if (this.editingPolygon) {
            options.editable = true;
          }
          if (this.hoveredPolygon != null && polygon.areaId === this.hoveredPolygon.areaId) {
            options.fillOpacity = 1;
          }
        } else if (this.hoveredPolygon != null) {
          const hoveredArea = this.areas.byId[this.hoveredPolygon.areaId];
          if (polygon.areaId === hoveredArea.id) {
            Object.assign(options, hoveredPolygonOptions);
          } else if (hoveredArea.adjacentAreas.includes(polygon.areaId)) {
            Object.assign(options, adjacentPolygonOptions);
          }
        }
        polygon.setOptions(options);
      });
    },
    persistPolygonsForArea(areaId) {
      this.$store.dispatch('areas/updatePolygonAreas', {
        area: this.areas.byId[areaId],
        polygons: this.polygons.filter(polygon => polygon.areaId === areaId),
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';

.editor {
  display: flex;
  flex: 1;
}

.editor__controls {
  padding: 5px 5px;
  border-right: 6px solid $gray-800;
}

.editor__control {
  display: block;
  margin-bottom: 5px;
}

.editor__map-wrapper {
  display: flex;
  flex: 1;
}

.editor__map-container {
  flex: 1;
}

.editor__polygon-tooltip {
  text-align: left;
  white-space: nowrap;
}
</style>
