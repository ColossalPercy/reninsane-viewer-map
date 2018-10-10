<template>
  <b-modal
    ref="adminLogin"
    id="adminLogin"
    title="Admin Login"
    hide-footer
    header-bg-variant="light"
    @hidden="modalHidden"
  >
    <b-form @submit.prevent="login" autocomplete=off v-if="!admin">
      <b-form-group id="adminEmailGroup"
        label="Email:"
        horizontal
      >
        <b-form-input id="adminEmailInput"
          required
          v-model="email"
          type="email"
          placeholder="Enter email..."
        ></b-form-input>
      </b-form-group>
      <b-form-group id="adminPasswordGroup"
        label="Passowrd:"
        horizontal
      >
        <b-form-input id="adminPasswordInput"
          required
          v-model="password"
          type="password"
          placeholder="Enter password..."
        ></b-form-input>
      </b-form-group>
      <div class="d-flex flex-row-reverse">
        <b-button class="ml-2" type="submit" variant="primary">Login</b-button>
        <b-button @click="closeModal">Cancel</b-button>
      </div>
    </b-form>
    <p v-if="admin">Succesfully logged in as admin!</p>
  </b-modal>
</template>

<script>

export default {
  name: 'LoginModal',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    closeModal() {
      this.$refs.adminLogin.hide()
    },
    login() {
      this.$store.dispatch('login', { email: this.email, password: this.password })
    },
    modalHidden() {
      this.email = ''
      this.password = ''
    }
  },
  computed: {
    admin() {
      return this.$store.getters.getAdmin
    }
  }
}
</script>
