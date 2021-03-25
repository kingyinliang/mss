<template>
  <LoginBg />
  <LoginForm />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import LoginBg from './login-bg.vue'
import LoginForm from './login-form.vue'

export default defineComponent({
  name: 'login',
  components: {
    LoginBg,
    LoginForm
  },
  setup () {
    onMounted(() => {
      // login().then((data) => {
      //   console.log(data)
      // })
      // setTimeout(() => {
      //   login()
      // }, 2000)
    })
  }
})
</script>

<style scoped>

</style>
