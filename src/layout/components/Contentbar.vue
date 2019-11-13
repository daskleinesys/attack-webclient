<template>
  <div class="contentbar bg-light border-bottom">
    <div class="contentbar__left">
      <slot name="left"/>
    </div>
    <div class="contentbar__middle">
      <slot name="middle"/>
    </div>
    <div class="contentbar__right">
      <slot name="right"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contentbar',
};
</script>

<style scoped>
.contentbar {
  display: flex;
  min-height: 50px;
}

.contentbar__left,
.contentbar__middle,
.contentbar__right {
  display: flex;
  align-items: center;
}

.contentbar__left,
.contentbar__right {
  flex: 1;
}

.contentbar__right {
  justify-content: flex-end;
}
</style>
