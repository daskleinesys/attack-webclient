<template>
  <div class="form-login">
    <BSpinner
      v-if="$store.state.auth.fetching"
      variant="primary"
      label="Spinning"
    />

    <BForm
      v-else-if="$store.state.auth.user == null"
      @submit="onLogin"
    >
      <h5 class="mb-3">Login</h5>
      <BFormGroup
        label-cols-sm="4"
        label-cols-lg="3"
        label="Username"
        label-for="form-login__username"
        :state="stateUsername"
      >
        <BFormInput
          id="form-login__username"
          v-model="username"
          :state="stateUsername"
          trim
        />
      </BFormGroup>
      <BFormGroup
        label-cols-sm="4"
        label-cols-lg="3"
        label="Password"
        label-for="form-login__password"
        :state="statePassword"
      >
        <BFormInput
          id="form-login__password"
          v-model="password"
          type="password"
          :state="statePassword"
          trim
        />
      </BFormGroup>
      <BButton
        type="submit"
        variant="primary"
        :disabled="!stateUsername || !statePassword"
      >
        Login
      </BButton>
    </BForm>
  </div>
</template>

<script>
export default {
  name: 'FormLogin',
  data() {
    return {
      username: null,
      password: null,
    };
  },
  computed: {
    stateUsername() {
      if (this.username == null) {
        return null;
      }
      return this.username.length >= 3;

    },
    statePassword() {
      if (this.password == null) {
        return null;
      }
      return this.password.length >= 5;
    },
  },
  methods: {
    async onLogin() {
      await this.$store.dispatch('auth/login', {
        username: this.username,
        password: this.password,
      });
      this.username = null;
      this.password = null;
      if (this.$store.state.auth.user != null) {
        this.$router.push('dashboard');
      }
    },
  },
};
</script>

<style scoped>

</style>
