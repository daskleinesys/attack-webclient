<template>
  <div id="app" class="app">
    <RouterView/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
@import './sass/app.scss';

.app {
  display: flex;
  height: 100%;
}
</style>
