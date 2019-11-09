<template>
  <div class="topbar">
    <div class="topbar__left">

    </div>
    <div class="topbar__middle">

    </div>
    <div class="topbar__right">
      <UserStatus/>
    </div>
  </div>
</template>

<script>
import UserStatus from '@/shared/components/UserStatus.vue';

export default {
  name: 'Topbar',
  components: { UserStatus },
};
</script>

<style scoped>
.topbar {
  display: flex;
}

.topbar__left,
.topbar__right {
  flex: 1
}

.topbar__right {
  display: flex;
  justify-content: flex-end;
}
</style>
