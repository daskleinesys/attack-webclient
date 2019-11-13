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
            :disabled="newGame != null"
            @click="onNewGame"
          >
            New Game
          </BButton>
        </template>
      </Contentbar>
    </template>
    <template #default class="test">
      <BCard
        v-if="newGame != null"
        :img-src="`${publicPath}images/card.jpg`"
        img-alt="Image"
        img-top
        class="games__game-card"
        :class="{ 'games__game-card--inserting': inserting }"
      >
        <BForm @submit="onCreateGame">
          <BCardTitle>
            <BFormInput
              placeholder="New Game"
              v-model="newGame.name"
              ref="name"
              :disabled="inserting"
            />
          </BCardTitle>
          <BFormSelect
            v-model="newGame.playerslots"
            class="mb-3"
            :disabled="inserting"
          >
            <option value="2">2 players</option>
            <option value="6">6 players</option>
          </BFormSelect>
          <BButton
            variant="light"
            @click="newGame = null"
            :disabled="inserting"
          >
            Cancel
          </BButton>
          <BButton
            variant="primary"
            style="float: right;"
            :disabled="newGame.name == null || newGame.name.length < 3 || inserting"
            type="submit"
          >
            Create
          </BButton>
        </BForm>
      </BCard>
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
import Contentbar from '@/layout/components/Contentbar.vue';
import { GAME_STATUS } from '@/shared/constants';

const GAME_STATUS_CREATING = Symbol('creating');

export default {
  name: 'PageGames',
  components: {
    Contentbar,
    Navigation,
    Topbar,
    Page,
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      gameStatusNew: GAME_STATUS.NEW,
      gameStatusDone: GAME_STATUS.DONE,
      gameStatusCreating: GAME_STATUS_CREATING,

      newGame: null,
      inserting: false,
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
  methods: {
    onNewGame() {
      if (this.newGame != null) {
        return;
      }
      this.newGame = {
        name: '',
        playerslots: 6,
      };
      this.$nextTick(() => this.$refs.name.focus());
    },
    async onCreateGame(e) {
      e.preventDefault();
      this.inserting = true;
      await this.$store.dispatch('games/insert', this.newGame);
      this.newGame = null;
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
  align-items: stretch;
  padding-top: 10px;
  padding-left: 10px;
  flex-wrap: wrap;
}

.games__btn-new-game {
  margin: 15px 10px;
}

.games__game-card {
  max-width: 20rem;
  margin-right: 10px;
  margin-bottom: 10px;
}

.games__game-card--done {
  filter: grayscale(100%);
}

.games__game-card--inserting {
  filter: blur(1px);
}
</style>
