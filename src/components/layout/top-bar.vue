<template>
  <nav class="SystemLayout__header">
    <div class="SystemLayout__header__item" style="position: absolute;left: 10px" @click="sidebarFold = !sidebarFold">
      <em class="iconfont factory-shouqicaidan switching" :class="{ open: sidebarFold, packup: !sidebarFold }" style="font-size: 25px;" />
    </div>
    <!--    消息    -->
    <div class="SystemLayout__header__item">
      <el-badge class="SystemLayout__header__badge" :value="messageNum" :max="99" type="danger" :hidden="messageNum === 0">
        <em class="iconfont factory-bell" style="font-size: 18px;color: #00a2d4;" />
      </el-badge>
    </div>
    <!--    个人信息下拉    -->
    <el-dropdown>
      <div class="SystemLayout__header__item">
        <img v-if="userInfo.sex === 'M'" src="~@/assets/img/layout/avatarM.png" :alt="userInfo.userName" style="float: left">
        <img v-else src="~@/assets/img/layout/avatarF.png" :alt="userInfo.userName" style="">
        {{ `${userInfo.realName || ''}(${userInfo.userName || ''})` }}
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item >
            修改密码
          </el-dropdown-item>
          <el-dropdown-item>
            退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!--    分割线     -->
    <div class="SystemLayout__header__item--line"/>
    <!--    工厂      -->
    <div class="SystemLayout__header__item" style="color: #00a2d4;"><em class="iconfont factory-gongchang" style="margin-right: 5px;" />{{ factoryName }}</div>
    <!--    分割线    -->
    <div class="SystemLayout__header__item--line"/>
    <!--    设置      -->
    <div class="SystemLayout__header__item" style="color: #00a2d4;" @click="router.push('system')">
      <em class="iconfont factory-shezhi" />
    </div>
  </nav>
</template>

<script>
import { defineComponent, ref } from 'vue'
import layoutTs from '@/components/layout/layoutTs'

export default defineComponent({
  name: 'TopBar',
  props: {
    userInfo: Object
  },
  setup () {
    const { router, sidebarFold } = layoutTs()
    const messageNum = ref(1)
    const factoryName = ref('')

    return {
      router,
      sidebarFold,
      messageNum,
      factoryName
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
