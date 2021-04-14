<template>
  <LoginBg />
  <LoginForm />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LoginBg from './login-bg.vue'
import LoginForm from './login-form.vue'

export default defineComponent({
  name: 'login',
  components: {
    LoginBg,
    LoginForm
  }
})
</script>

<style scoped>

</style>
