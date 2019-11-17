<template>
  <Page class="games">
    <template #sidebar>
      <Navigation/>
    </template>
    <template #topbar>
      <Topbar/>
    </template>
    <template #contentbar>
      <Contentbar>
        <template #left>
          <BButton
            class="games__btn-new-game"
            variant="primary"
            :disabled="newGame"
            @click="newGame = true"
          >
            New Game
          </BButton>
        </template>
      </Contentbar>
    </template>
    <template #default>
      <BCardNewGame
        v-if="newGame"
        :inserting="inserting"
        @cancel="newGame = false"
        @create="onCreateGame"
      />
      <BCardGame
        v-for="(game, index) in gamesComputed"
        :key="`game-${index}`"
        :game="game"
      />
    </template>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';

import Navigation from '@/layout/components/Navigation.vue';
import Topbar from '@/layout/components/Topbar.vue';
import Page from '@/layout/components/Page.vue';
import Contentbar from '@/layout/components/Contentbar.vue';
import { GAME_STATUS } from '@/shared/constants';
import BCardNewGame from './components/BCardNewGame.vue';
import BCardGame from './components/BCardGame.vue';

export default {
  name: 'PageGames',
  components: {
    BCardGame,
    BCardNewGame,
    Contentbar,
    Navigation,
    Topbar,
    Page,
  },
  data() {
    return {
      newGame: false,
      inserting: false,
    };
  },
  created() {
    this.$store.dispatch('games/subscribe');
  },
  computed: {
    ...mapGetters(['games']),
    gamesComputed() {
      return [...this.games.data]
        .reverse()
        .sort((a, b) => {
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
  methods: {
    async onCreateGame(newGame) {
      this.inserting = true;
      await this.$store.dispatch('games/insert', newGame);
      this.newGame = false;
      this.inserting = false;
    },
  },
};
</script>

<style scoped>
/deep/ .page__content {
  flex: initial;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 10px;
}

.games__btn-new-game {
  margin: 15px 10px;
}
</style>
