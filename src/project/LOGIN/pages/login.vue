<template>
  <component :is="systemName" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MssLogin from './mss/mss_login.vue'
import RdmLogin from './rdm/rdm_login.vue'
import MdsLogin from './mds/mds_login.vue'
import CdmLogin from './cdm/cdm_login.vue'
import loginTs from './login'

export default defineComponent({
  name: 'login',
  components: {
    MssLogin,
    RdmLogin,
    MdsLogin,
    CdmLogin
  },
  created (): void {
    this.init()
  },
  setup () {
    const { init, systemName } = loginTs()

    return {
      init,
      systemName
    }
  }
})
</script>

<style scoped>

</style>
