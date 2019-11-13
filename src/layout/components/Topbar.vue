<template>
  <div class="topbar">
    <div class="topbar__left">
      <h1 class="topbar__page-title text-primary">{{ title }}</h1>
    </div>
    <div class="topbar__middle">
    </div>
    <div class="topbar__right">
      <UserStatus class="topbar__user"/>
    </div>
  </div>
</template>

<script>
import UserStatus from '@/shared/components/UserStatus.vue';

export default {
  name: 'Topbar',
  components: { UserStatus },
  computed: {
    title() {
      if (typeof this.$route.meta.label === 'string') {
        return this.$route.meta.label;
      }
      if (typeof this.$route.meta.label === 'function') {
        return this.$route.meta.label();
      }
      return 'Attack Online';
    },
  },
};
</script>

<style scoped>
.topbar {
  display: flex;
}

.topbar__left,
.topbar__middle,
.topbar__right {
  display: flex;
  align-items: center;
}

.topbar__left,
.topbar__right {
  flex: 1;
}

.topbar__right {
  justify-content: flex-end;
}

.topbar__page-title {
  margin: 15px 10px;
}

.topbar__user {
  margin: 10px;
}
</style>
