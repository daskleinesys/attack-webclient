<template>
  <div
    class="map-item-tooltip"
    :id="elementId"
  >
    <div
      class="map-item-tooltip__target"
      ref="map-item-tooltip__target"
      :style="tooltipPosition"
    ></div>
    <BTooltip
      v-if="showTooltip"
      :custom-class="customClass"
      :container="elementId"
      :target="() => $refs['map-item-tooltip__target']"
      :show.sync="showTooltip"
    >
      <slot/>
    </BTooltip>
  </div>
</template>

<script>
import googleMapsApi from '@/shared/modules/googleMapsApi';

let count = 0;

export default {
  name: 'MapItemTooltip',
  props: {
    map: {
      type: Object,
      required: true,
    },
    marker: {
      type: Object,
      default: null,
    },
    polygon: {
      type: Object,
      default: null,
    },
    customClass: {
      type: String,
      default: '',
    },
  },
  computed: {
    tooltipPosition() {
      if (this.marker != null) {
        return this.getTooltipPositionForMarker(this.marker);
      }
      if (this.polygon != null) {
        return this.getTooltipPositionForPolygon(this.polygon);
      }
      return null;
    },
    showTooltip() {
      return this.tooltipPosition != null;
    },
  },
  data() {
    return {
      elementId: null,
      google: null,
      overlayView: null,
    };
  },
  async created() {
    count += 1;
    this.elementId = `map-item-tooltip--${count}`;
    this.google = await googleMapsApi();
    this.overlayView = new this.google.maps.OverlayView();
    this.overlayView.setMap(this.map);
  },
  beforeDestroy() {
    if (this.overlayView != null) {
      this.overlayView.setMap(null);
    }
  },
  methods: {
    getTooltipPositionForMarker(marker) {
      if (this.overlayView == null) {
        return null;
      }
      const { x, y } = this.overlayView.getProjection().fromLatLngToContainerPixel(marker.getPosition());
      return {
        top: `${y - 50}px`,
        left: `${x}px`,
      };
    },
    getTooltipPositionForPolygon(polygon) {
      if (this.google == null) {
        return null;
      }
      const bounds = new this.google.maps.LatLngBounds();
      polygon.getPath().getArray().forEach((latLng) => {
        bounds.extend(latLng);
      });
      const latLng = new this.google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getCenter().lng());
      const { x, y } = this.overlayView.getProjection().fromLatLngToContainerPixel(latLng);
      return {
        top: `${y}px`,
        left: `${x}px`,
      };
    },
  },
};
</script>

<style scoped>
.map-item-tooltip {
  position: relative;
}

.map-item-tooltip__target {
  position: absolute;
  width: 50px;
  height: 50px;
  transform: translate(-50%, 0);
  opacity: 0;
  pointer-events: none;
}
</style>
