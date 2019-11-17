<template>
  <BCard
    :img-src="`${publicPath}images/card.jpg`"
    img-alt="Image"
    img-top
    class="b-card-new-game"
    :class="{ 'b-card-new-game--inserting': inserting }"
  >
    <BForm @submit.prevent="$emit('create', { name, playerslots })">
      <BCardTitle>
        <BFormInput
          placeholder="New Game"
          v-model="name"
          ref="name"
          :disabled="inserting"
        />
      </BCardTitle>
      <BFormSelect
        v-model="playerslots"
        class="mb-3"
        :disabled="inserting"
      >
        <option value="2">2 players</option>
        <option value="6">6 players</option>
      </BFormSelect>
      <BButton
        variant="light"
        @click="$emit('cancel')"
        :disabled="inserting"
      >
        Cancel
      </BButton>
      <BButton
        variant="primary"
        style="float: right;"
        :disabled="name == null || name.length < 3 || inserting"
        type="submit"
      >
        Create
      </BButton>
    </BForm>
  </BCard>
</template>

<script>
export default {
  name: 'BCardNewGame',
  props: {
    inserting: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      name: '',
      playerslots: 6,
    };
  },
  mounted() {
    this.$nextTick(() => this.$refs.name.focus());
  },
};
</script>

<style scoped>
.b-card-new-game {
  width: 100%;
  max-width: 20rem;
  margin: 10px;
}

.b-card-new-game--inserting {
  filter: blur(1px);
}
</style>
