<template>
  <div
    class="editor"
    ref="editor"
  >
  </div>
</template>

<script>
import googleMapsApi from '@/shared/modules/googleMapsApi';

export default {
  name: 'Editor',
  data() {
    return {
      google: null,
    };
  },
  async created() {
    this.$store.dispatch('areas/subscribe');
    this.google = await googleMapsApi();
    this.drawMap();
  },
  methods: {
    drawMap() {
      const options = {
        tilt: 0,
        mapTypeId: this.google.maps.MapTypeId.TERRAIN,
        disableDefaultUI: true,
        mapTypeControl: false,
        zoomControl: false,
        fullscreenControl: false,
      };
      this.map = new this.google.maps.Map(this.$refs.editor, options);
      this.map.setCenter({
        lat: 30.047746,
        lng: 31.235288,
      });
      this.map.setZoom(3);
    },
  },
};
</script>

<style scoped>
.editor {
  flex: 1;
}
</style>
