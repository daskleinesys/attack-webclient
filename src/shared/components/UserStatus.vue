<template>
  <div>
    <h5>
      Hello {{ $store.state.auth.user }}!
    </h5>
    <pre class="mt-3 mb-3">
      {{ status }}
    </pre>
    <BButton
      @click="checkBE"
    >
      check BE status
    </BButton>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserStatus',
  data() {
    return {
      status: null,
    };
  },
  methods: {
    async checkBE() {
      const { data } = await axios.get('http://localhost/api/me');
      this.status = data;
    },
  },
};
</script>

<style scoped>

</style>
