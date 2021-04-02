<template>
  <div>ParameterPage</div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'ParameterPage',
  setup () {
    onMounted(() => {
      console.log('ParameterPage')
    })
    return {}
  }
})
</script>

<style scoped>

</style>
