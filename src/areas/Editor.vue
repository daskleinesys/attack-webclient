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

const polygonOptions = {
  strokeColor: 'black',
  strokeOpacity: 1,
  strokeWeight: 2,
  fillColor: 'gray',
  fillOpacity: 0.8,
};

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
      const area = this.areas.byId[this.hoveredPolygon.areaId];
      data.title = `${area.number} - ${area.name}`;
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
      this.areas.data.forEach((area) => {
        this.polygonsByAreaId[area.id] = [];
        if (area.geometry == null || area.geometry.type !== 'MultiPolygon') {
          return;
        }
        area.geometry.coordinates.forEach((polygon) => {
          const paths = polygon.map(line => line.map(point => ({
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
        this.cancelDrawPolygon();
        if (this.areaSelected == null) {
          polygon.setMap(null);
          return;
        }
        const area = this.areas.byId[this.areaSelected];
        this.initPolygon(polygon, area);

        this.$store.dispatch('areas/addPolygonToArea', {
          area,
          polygon,
        });
      });
    },
    initPolygon(polygon, area) {
      // eslint-disable-next-line no-param-reassign
      polygon.areaId = area.id;
      this.polygonsByAreaId[area.id].push(polygon);
      this.google.maps.event.addListener(polygon, 'mouseover', () => {
        this.hoveredPolygon = polygon;
      });
      this.google.maps.event.addListener(polygon, 'mouseout', () => {
        if (this.hoveredPolygon === polygon) {
          this.hoveredPolygon = null;
        }
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
