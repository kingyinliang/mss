<template>
  <div>MenuPage</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'MenuPage',
  setup () {
    onMounted(() => {
      console.log('MenuPage')
    })
    return {}
  }
})
</script>

<style scoped>

</style>
