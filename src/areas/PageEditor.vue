<template>
  <Page class="editor">
    <template #sidebar>
      <Navigation/>
    </template>
    <template #default>
      <aside class="editor__controls">
        <div class="editor__controls-top">
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
        </div>
        <div>
          <BButton
            class="editor__control"
            @click="exportAreas()"
          >
            Export Areas
          </BButton>
        </div>
      </aside>
      <div class="editor__map-wrapper">
        <MapItemTooltip
          v-if="map != null"
          :map="map"
          :polygon="hoveredPolygon"
        >
          <div class="editor__polygon-tooltip">
            {{ polygonTooltipData.title }}<br>
            <span v-if="polygonTooltipData.economy">
            {{ polygonTooltipData.economy }} economy
          </span>
          </div>
        </MapItemTooltip>
        <div
          class="editor__map-container"
          ref="editor__map-container"
        ></div>
      </div>
    </template>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';

import MapItemTooltip from '@/shared/components/MapItemTooltip.vue';
import googleMapsApi from '@/shared/modules/googleMapsApi';
import { AREA_TYPE_LAND, mapStylesEditor } from '@/shared/constants';
import Page from '@/layout/components/Page.vue';
import Navigation from '@/layout/components/Navigation.vue';

const polygonOptions = type => ({
  strokeColor: '#343a40',
  strokeOpacity: 1,
  strokeWeight: 2,
  fillColor: (type === AREA_TYPE_LAND) ? '#e9ecef' : '#17a2b8',
  fillOpacity: (type === AREA_TYPE_LAND) ? 0.6 : 0.2,
  editable: false,
  clickable: true,
});
const activePolygonOptions = editable => ({
  fillColor: '#28a745',
  editable,
});
const hoveredPolygonOptions = type => ({
  fillColor: (type === AREA_TYPE_LAND) ? '#6c757d' : '#0c54cf',
  fillOpacity: 1,
});
const adjacentPolygonOptions = type => ({
  fillColor: (type === AREA_TYPE_LAND) ? '#ced4da' : '#5994fc',
  fillOpacity: 1,
});

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
  components: {
    Navigation,
    Page,
    MapItemTooltip,
  },
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
            ...polygonOptions(area.id_type),
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
        polygonOptions: polygonOptions(AREA_TYPE_LAND),
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
        const area = this.areas.byId[polygon.areaId];
        const options = { ...polygonOptions(area.id_type) };
        if (this.hoveredPolygon != null) {
          if (polygon.areaId === this.hoveredPolygon.areaId) {
            Object.assign(options, hoveredPolygonOptions(area.id_type));
          }
          if (this.areas.byId[this.hoveredPolygon.areaId].adjacentAreas.includes(polygon.areaId)) {
            Object.assign(options, adjacentPolygonOptions(area.id_type));
          }
        }
        if (polygon.areaId === this.areaSelected) {
          Object.assign(options, activePolygonOptions(this.editingPolygon));
          if (this.editingPolygon) {
            options.editable = true;
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
    exportAreas() {
      let sqlAreas = 'INSERT INTO `areas` (`id`, `name`, `number`, `coords_map`, `id_type`, `economy`) VALUES\n  ';
      const areas = [];
      let sqlAdjacents = '\n\nINSERT INTO `area_is_adjacent` (`id_area1`, `id_area2`) VALUES\n  ';
      const adjacents = [];
      this.areas.data.forEach((area) => {
        let sqlArea = '(';
        sqlArea += `${area.id}, `;
        sqlArea += `'${area.name}', `;
        sqlArea += `${area.number}, `;
        sqlArea += `ST_GeomFromGeoJSON('${JSON.stringify(area.geometry)}'), `;
        sqlArea += `${area.id_type}, `;
        sqlArea += `'${area.economy}'`;
        sqlArea += ')';
        areas.push(sqlArea);
        area.adjacentAreas.forEach((adjacent) => {
          adjacents.push(`(${area.id}, ${adjacent})`);
        });
      });
      sqlAreas += `${areas.join(',\n  ')};`;
      sqlAdjacents += `${adjacents.join(',\n  ')};\n`;

      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(sqlAreas)}${encodeURIComponent(sqlAdjacents)}`);
      element.setAttribute('download', 'areas.sql');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
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
  display: flex;
  flex-direction: column;
  padding: 5px 5px;
  border-right: 6px solid $gray-800;
}

.editor__controls-top {
  flex: 1;
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
