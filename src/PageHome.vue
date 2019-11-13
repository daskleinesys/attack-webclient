<template>
  <Page class="home">
    <aside class="home__aside bg-light">
      <h1 class="home__title text-primary">Attack Online</h1>
    </aside>
    <main class="home__content">
      <FormLogin v-if="$store.state.auth.user == null"/>
      <UserStatus v-else/>
    </main>
  </Page>
</template>

<script>
import FormLogin from '@/shared/components/FormLogin.vue';
import Page from '@/layout/components/Page.vue';
import UserStatus from '@/shared/components/UserStatus.vue';

export default {
  name: 'PageHome',
  components: { UserStatus, Page, FormLogin },
};
</script>

<style scoped>
.home__aside {
  position: relative;
  width: 50%;
}

.home__title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
}

.home__content {
  flex: 1;
  padding: 100px 50px;
}
</style>
