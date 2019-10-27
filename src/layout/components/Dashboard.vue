<template>
  <div class="dashboard">
    <UserStatus/>
  </div>
</template>

<script>
import UserStatus from '@/shared/components/UserStatus.vue';

export default {
  name: 'Dashboard',
  components: {
    UserStatus,
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px 30px;
}
</style>
