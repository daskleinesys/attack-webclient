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
    <div
      class="editor__map-container"
      ref="editor__map-container"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import googleMapsApi from '@/shared/modules/googleMapsApi';

export default {
  name: 'Editor',
  data() {
    return {
      google: null,
      map: null,
      drawingManger: null,
      polygonsByAreaId: {},

      // controls
      areaSelected: null,
      drawingPolygon: false,
    };
  },
  computed: {
    ...mapGetters(['areas']),
    areaOptions() {
      return this.areas.data.map(area => ({
        value: area.id,
        text: `${area.number} - ${area.name}`,
      }));
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
          this.polygonsByAreaId[this.areaSelected].push(polygon);
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

.editor__map-container {
  flex: 1;
}
</style>
