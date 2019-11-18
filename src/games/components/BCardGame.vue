<template>
  <BCard
    no-body
    class="b-card-game"
  >
    <div
      v-if="game.status === gameStatusLoading"
      class="b-card-game__image-placeholder bg-light"
    ></div>
    <BCardImg
      v-else-if="game.status === gameStatusNew"
      class="b-card-game__image"
      :class="{ 'b-card-game__image--done': game.status === gameStatusDone }"
      :src="`${publicPath}images/card.jpg`"
      alt="Game Mood"
      top
      height="230"
    />
    <div
      v-else
      class="b-card-game__image-placeholder bg-primary"
    >
      TODO : insert image for running game (snapshot of game map would be nice)
    </div>
    <BCardBody>
      <h5 class="b-card-game__title">{{ game.name }}</h5>
      <div
        v-if="game.status !== gameStatusLoading"
        class="b-card-game__content mb-4"
      >
        <ul class="b-card-game__specs">
          <li v-if="game.status === gameStatusNew">
            Players: {{ game.players.length }}/{{ game.playerslots }}
          </li>
          <li v-if="game.status !== gameStatusNew">
            Players: {{ game.playerslots }}
          </li>
          <li v-if="game.status !== gameStatusNew">
            Phase: {{ game.phase.name }}
          </li>
        </ul>
      </div>
      <div class="b-card-game__buttons">
        <BButton
          v-if="labelCancel != null"
        >
          {{ labelCancel }}
        </BButton>
        <div class="flex-spacer"></div>
        <span
          class="d-inline-block"
          tabindex="0"
          v-b-tooltip.bottom
          :title="ctaTitle"
        >
          <BButton
            v-if="labelCta != null"
            variant="primary"
            :disabled="ctaDisabled"
          >
            {{ labelCta }}
          </BButton>
        </span>
      </div>
    </BCardBody>
  </BCard>
</template>

<script>
import { GAME_STATUS } from '@/shared/constants';

export default {
  name: 'BCardGame',
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      gameStatusNew: GAME_STATUS.NEW,
      gameStatusDone: GAME_STATUS.DONE,
      gameStatusLoading: GAME_STATUS.LOADING,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    inGame() {
      return this.game.players.some(player => player.user.login === this.user);
    },
    isCreator() {
      return this.game.creator.login === this.user;
    },
    isFull() {
      return this.game.players.length === this.game.playerslots;
    },
    labelCancel() {
      if (this.game.status === GAME_STATUS.NEW && this.isCreator) {
        return 'Cancel';
      }
      if (
        this.game.status === GAME_STATUS.NEW
        && !this.isCreator
        && this.inGame
      ) {
        return 'Leave';
      }
      return null;
    },
    labelCta() {
      if (this.game.status === GAME_STATUS.LOADING) {
        return null;
      }
      if (this.game.status !== GAME_STATUS.NEW) {
        return 'View';
      }
      if (this.isCreator) {
        return 'Start';
      }
      if (!this.inGame && !this.isFull) {
        return 'Join';
      }
      return null;
    },
    ctaDisabled() {
      return (
        this.game.status === GAME_STATUS.NEW
        && this.isCreator
        && !this.isFull
      );
    },
    ctaTitle() {
      if (
        this.game.status === GAME_STATUS.NEW
        && this.isCreator
        && !this.isFull
      ) {
        return 'Not enough players';
      }
      return null;
    },
  },
};
</script>

<style scoped>
.b-card-game {
  width: 100%;
  max-width: 280px;
  min-height: 300px;
  margin: 10px;
}

.b-card-game__image-placeholder {
  height: 230px;
}

.b-card-game__image {
  object-fit: cover;
}

.b-card-game__image--done {
  filter: grayscale(100%);
}

.b-card-game__title {
  font-weight: 700;
}

.b-card-game__specs {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.b-card-game__buttons {
  display: flex;
}
</style>
