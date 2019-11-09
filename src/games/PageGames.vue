<template>
  <Page class="games">
    <template #sidebar>
      <Navigation/>
    </template>
    <template #topbar>
      <Topbar/>
    </template>
    <template #default>
      hello world
    </template>
  </Page>
</template>

<script>
import Navigation from '@/layout/components/Navigation.vue';
import Topbar from '@/layout/components/Topbar.vue';
import Page from '@/layout/components/Page.vue';

export default {
  name: 'PageGames',
  components: {
    Navigation,
    Topbar,
    Page,
  },
};
</script>

<style scoped>

</style>
