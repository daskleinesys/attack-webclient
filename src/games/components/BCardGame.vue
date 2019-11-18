<template>
  <BCard
    :title="game.name"
    :img-src="`${publicPath}images/card.jpg`"
    img-alt="Image"
    img-top
    class="b-card-game"
    :class="{ 'b-card-game--done': game.status === gameStatusDone }"
  >
    <BButton
      v-if="labelCta != null"
      variant="primary"
      style="float: right;"
    >
      {{ labelCta }}
    </BButton>
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
    };
  },
  computed: {
    labelCta() {
      if (this.game.status !== GAME_STATUS.NEW) {
        return 'view';
      }
      const { user } = this.$store.state.auth;
      const inGame = this.game.players.some(player => player.user.login === user);
      const isFull = this.game.players.length === this.game.playerslots;
      const isCreator = this.game.creator.login === user;
      if (isCreator && isFull) {
        return 'start';
      }
      if (!inGame && !isFull) {
        return 'join';
      }
      return null;
    },
  },
};
</script>

<style scoped>
.b-card-game {
  width: 100%;
  max-width: 20rem;
  margin: 10px;
}

.b-card-game--done {
  filter: grayscale(100%);
}
</style>
