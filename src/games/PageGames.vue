<template>
  <Page class="games">
    <template #sidebar>
      <Navigation/>
    </template>
    <template #topbar>
      <Topbar/>
    </template>
    <template #default class="test">
      <BCard
        v-for="(card, index) in cards"
        :key="`card-${index}`"
        :title="card.title"
        :img-src="`${publicPath}images/card.jpg`"
        img-alt="Image"
        img-top
        class="games__game-card"
      >
        hello world
      </BCard>
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
  data() {
    const cards = [];
    for (let x = 0; x < 20; x += 1) {
      cards.push({
        title: `Game ${x}`,
      });
    }
    return {
      publicPath: process.env.BASE_URL,
      cards,
    };
  },
};
</script>

<style scoped>
/deep/ .page__content {
  display: grid;
  grid-template-columns: repeat(7,auto);
  grid-row-gap: 1rem;
  grid-column-gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.games__game-card {
  max-width: 20rem;
}
</style>
