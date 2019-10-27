<template>
  <div id="app" class="app">
    <Navigation v-if="$route.meta.navigation"/>
    <RouterView/>
  </div>
</template>

<script>
import Navigation from '@/layout/components/Navigation.vue';

export default {
  name: 'App',
  components: { Navigation },
};
</script>

<style lang="scss">
@import './sass/app.scss';

.app {
  display: flex;
  height: 100%;
}
</style>
