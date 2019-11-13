<template>
  <BDropdown
    class="user-status"
    variant="outline-dark"
    :text="$store.state.auth.user"
  >
    <BDropdownItem @click="$store.dispatch('logout')">logout</BDropdownItem>
  </BDropdown>
</template>

<script>
export default {
  name: 'UserStatus',
  data() {
    return {
      status: null,
    };
  },
};
</script>

<style scoped>

</style>
