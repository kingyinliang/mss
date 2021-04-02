<template>
<section class="SystemLayout system_container">
  <LeftBar :menuList="menuList" />
  <section class="system_container system_container--column">
    <TopBar :userInfo="userInfo" />
    <MainContent />
  </section>
</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import TopBar from './top-bar.vue'
import LeftBar from './left-bar.vue'
import MainContent from './main_content.vue'
import layoutTs from '@/components/layout/layoutTs'

export default defineComponent({
  name: 'SystemLayout',
  components: {
    TopBar,
    LeftBar,
    MainContent
  },
  created () {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
    this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
  },
  setup () {
    const { userInfo, menuList, routeHandle, dynamicMenuRoutes } = layoutTs()

    onBeforeRouteUpdate(routeHandle)

    return {
      menuList,
      dynamicMenuRoutes,
      userInfo
    }
  }
})
</script>

<style lang="scss" scoped>
.SystemLayout{
  width: 100%;
  height: 100%;
}
</style>
