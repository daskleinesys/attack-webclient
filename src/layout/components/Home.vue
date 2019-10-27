<template>
  <div class="home">
    <aside class="home__aside bg-light">
      <h1 class="home__title">Attack Online</h1>
    </aside>
    <main class="home__content">
      <FormLogin v-if="$store.state.auth.user == null"/>
      <div v-else>
        <h5 class="mb-3">Hello {{ $store.state.auth.user }}!</h5>
        <BButton
          variant="warning"
          @click="$store.dispatch('auth/logout')"
        >
          Logout
        </BButton>
      </div>
    </main>
  </div>
</template>

<script>
import FormLogin from '@/shared/components/FormLogin.vue';

export default {
  name: 'Home',
  components: { FormLogin },
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
