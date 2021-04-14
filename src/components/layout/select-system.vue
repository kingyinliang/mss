<template>
  <div v-if="modelValue" class="select_system">
    <div class="select_system_main">
      <div
        v-for="item in system"
        :key="item.id"
        :style='"background-image: url(" + item.backgroundImgUrl + ")"'
        class="select_system_item"
        @click="goSystem(item)"
      >
        <div class="select_system_item_img">
          <img :src="item.logoImgUrl" alt="">
        </div>
        <p>{{ item.systemName }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, toRefs, ref } from 'vue'
import { GET_TENANT_BY_USER_ID, UPDATE_TENANT } from '@/api/api'

export default defineComponent({
  name: 'select-system',
  props: {
    modelValue: Boolean
  },
  setup (props) {
    const { modelValue } = toRefs(props)
    const system = ref([])

    const goSystem = (system) => {
      UPDATE_TENANT({
        systemCode: system.systemCode
      }).then(() => {
        localStorage.setItem('vuex', '')
        sessionStorage.setItem('systemName', system.systemCode)
        window.location.href = '/SYSTEM.html'
      })
    }
    watch(modelValue, () => {
      const userInfo = sessionStorage.getItem('userInfo')
      GET_TENANT_BY_USER_ID({
        userId: userInfo.id
      }).then((res) => {
        system.value = res.data.data
      })
    })
    return {
      system,
      goSystem
    }
  }
})
</script>

<style lang="scss" scoped>
.select_system{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  &_main{
    width: 80%;
    display: flex;
    justify-content: center;
    text-align: center;
    flex-wrap: wrap;
  }
  &_item {
    flex: 1;
    padding: 10px 30px;
    width: 220px;
    cursor: pointer;
    &_img{
      display: flex;
      align-items: center;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      overflow: hidden;
      margin: auto;
      background: white;
      img{
        width: 100%;
      }
    }
    p{
      margin-top: 15px;
      color: white;
      font-size: 24px;
      line-height: 32px;
      text-align: center;
    }
  }
}
</style>
