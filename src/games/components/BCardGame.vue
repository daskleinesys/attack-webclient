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
      v-if="game.status === gameStatusNew"
      variant="primary"
      style="float: right;"
    >
      Join
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
