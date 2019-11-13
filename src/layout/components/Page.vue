<template>
  <div class="page">
    <slot name="sidebar"/>
    <div class="page__main">
      <slot name="topbar"/>
      <div class="page__content">
        <slot name="default"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page',
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

.page__main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page__content {
  flex: 1;
  display: flex;
  padding-right: 17px;
  overflow: auto;
  overflow-x: hidden;
}
</style>
