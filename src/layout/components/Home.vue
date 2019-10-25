<template>
  <div>
    <h1>Home</h1>
    <h5 v-if="$store.state.auth.fetching">
      loading ...
    </h5>
    <BButton
      v-else-if="$store.state.auth.user == null"
      @click="$store.dispatch('auth/login')"
    >
      login
    </BButton>
    <div v-else>
      <h5>
        Hello {{ $store.state.auth.user }}!
      </h5>
      <BButton
        @click="checkBE"
      >
        check BE status
      </BButton>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  methods: {
    checkBE() {
      axios.get('http://localhost/api/me');
    },
  },
};
</script>

<style scoped>

</style>
