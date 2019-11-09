<template>
  <BDropdown
    class="user-status"
    variant="outline-primary"
    :text="$store.state.auth.user"
  >
    <BDropdownItem @click="$store.dispatch('auth/logout')">logout</BDropdownItem>
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
