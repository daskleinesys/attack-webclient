<template>
  <div class="home">
    <aside class="home__aside bg-light">
      <h1 class="home__title">Attack Online</h1>
    </aside>
    <main class="home__content">
      <FormLogin v-if="$store.state.auth.user == null"/>
      <UserStatus v-else/>
    </main>
  </div>
</template>

<script>
import FormLogin from '@/shared/components/FormLogin.vue';
import UserStatus from '@/shared/components/UserStatus.vue';

export default {
  name: 'Home',
  components: {
    UserStatus,
    FormLogin
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex: 1;
}

.home__aside {
  position: relative;
  width: 50%;
}

.home__title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.home__content {
  flex: 1;
  padding: 100px 50px;
}
</style>
