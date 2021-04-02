<template>
  <div>AppPage</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'AppPage',
  setup () {
    onMounted(() => {
      console.log('App')
    })
    return {}
  }
})
</script>

<style scoped>

</style>
