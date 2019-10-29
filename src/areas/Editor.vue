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
        :disabled="!drawingPolygon"
        @click="cancelDrawPolygon"
      >
        Cancel Polygon
      </BButton>
    </aside>
    <div class="editor__map-wrapper">
      <MapItemTooltip
        v-if="this.map != null"
        :map="this.map"
        :polygon="hoveredPolygon"
      >
        <div class="editor__polygon-tooltip">
          {{ polygonTooltipData.title }}
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

export default {
  name: 'Editor',
  data() {
    return {
      google: null,
      map: null,
      drawingManger: null,
      polygonsByAreaId: {},
      hoveredPolygon: null,

      // controls
      areaSelected: null,
      drawingPolygon: false,
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
      };
      if (this.hoveredPolygon == null) {
        return data;
      }
      data.title = this.areas.byId[this.hoveredPolygon.areaId].name;
      return data;
    },
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('areas/subscribe'),
      this.loadGoogleMaps(),
    ]);
    this.drawMap();
  },
  methods: {
    async loadGoogleMaps() {
      this.google = await googleMapsApi();
    },
    drawMap() {
      const options = {
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
      this.drawingManager = new this.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
          strokeColor: 'black',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: 'gray',
          fillOpacity: 0.8,
          zIndex: 1,
        },
      });
      this.drawingManager.setMap(this.map);
      this.google.maps.event.addListener(this.drawingManager, 'polygoncomplete', (polygon) => {
        const shape = polygon.getPath()
          .getArray()
          .map(point => ({
            lat: point.lat(),
            lng: point.lng(),
          }));
        if (this.areaSelected == null) {
          polygon.setMap(null);
        } else {
          // eslint-disable-next-line no-param-reassign
          polygon.areaId = this.areaSelected;
          this.polygonsByAreaId[this.areaSelected].push(polygon);
          this.google.maps.event.addListener(polygon, 'mouseover', () => {
            this.hoveredPolygon = polygon;
          });
          this.google.maps.event.addListener(polygon, 'mouseout', () => {
            this.hoveredPolygon = null;
          });
          this.$store.dispatch('areas/addPolygonToArea', {
            area: this.areaSelected,
            polygon: shape,
          });
        }
        this.cancelDrawPolygon();
      });
      this.areas.data.forEach((area) => {
        this.polygonsByAreaId[area.id] = [];
        // TODO : draw polygon for each area
      });
    },
    drawPolygon() {
      this.cancelDrawPolygon();
      this.drawingManager.setDrawingMode(this.google.maps.drawing.OverlayType.POLYGON);
      this.drawingPolygon = true;
    },
    cancelDrawPolygon() {
      this.drawingManager.setDrawingMode(null);
      this.drawingPolygon = false;
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
