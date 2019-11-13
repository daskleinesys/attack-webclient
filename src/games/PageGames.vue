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
        v-for="(game, index) in gamesComputed"
        :key="`game-${index}`"
        :title="game.name"
        :img-src="`${publicPath}images/card.jpg`"
        img-alt="Image"
        img-top
        class="games__game-card"
        :class="{ 'games__game-card--done': game.status === gameStatusDone }"
      >
        <BButton
          v-if="game.status === gameStatusNew"
          variant="primary"
          style="float: right;"
        >
          Join
        </BButton>
      </BCard>
    </template>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';

import Navigation from '@/layout/components/Navigation.vue';
import Topbar from '@/layout/components/Topbar.vue';
import Page from '@/layout/components/Page.vue';
import { GAME_STATUS } from '@/shared/constants';

export default {
  name: 'PageGames',
  components: {
    Navigation,
    Topbar,
    Page,
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      gameStatusNew: GAME_STATUS.NEW,
      gameStatusDone: GAME_STATUS.DONE,
    };
  },
  created() {
    this.$store.dispatch('games/subscribe');
  },
  computed: {
    ...mapGetters(['games']),
    gamesComputed() {
      return [...this.games.data].sort((a, b) => {
        if (a.status === b.status) {
          return 0;
        }
        if (a.status === GAME_STATUS.NEW) {
          return -1;
        }
        if (b.status === GAME_STATUS.NEW) {
          return 1;
        }
        if (a.status === GAME_STATUS.STARTED) {
          return -1;
        }
        if (b.status === GAME_STATUS.STARTED) {
          return 1;
        }
        if (a.status === GAME_STATUS.DONE) {
          return 1;
        }
        if (b.status === GAME_STATUS.DONE) {
          return -1;
        }
        return 0;
      });
    },
  },
};
</script>

<style scoped>
/deep/ .page__content {
  flex: initial;
  display: flex;
  justify-content: start;
  align-items: stretch;
  padding-top: 10px;
  padding-left: 10px;
  flex-wrap: wrap;
}

.games__game-card {
  max-width: 20rem;
  margin-right: 10px;
  margin-bottom: 10px;
}

.games__game-card--done {
  filter: grayscale(100%);
}
</style>
