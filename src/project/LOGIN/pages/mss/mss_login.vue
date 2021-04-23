<template>
  <div class="login_bg" />
  <div class="login_form">
    <div class="login_form_main">
      <div class="login_form_main_icon">
        <img src="@/assets/img/login/login_icon.png" alt="Icon">
      </div>
      <div class="login_form_main_contain">
        <div class="login_form_main_username login_form_main_input" style="margin-bottom: 12%;">
          <p>账号:</p>
          <div class="login_form_main_input_prefix">
            <input v-model="loginForm.userName" class="input" type="text" placeholder="账号">
            <em class="iconfont--left iconfont factory-zhanghao" />
          </div>
        </div>
        <div class="login_form_main_input" style="margin-bottom: 11.5%;">
          <p>密码:</p>
          <div class="login_form_main_password">
            <div class="login_form_main_input_prefix">
              <input v-model="loginForm.password" class="input" :type="eye? 'text' : 'password'" placeholder="密码" @keyup.enter="submit">
              <em class="iconfont--left iconfont factory-zu" />
              <em class="iconfont--right iconfont factory-in_biyan_fill" @click="eye = !eye" />
            </div>
          </div>
          <div>
            <label class="login_form_main_btn" @click="clearForm">
              <em class="iconfont factory-zhongzhi" />
              重置
            </label>
          </div>
        </div>
        <div style="flex: 1;">
          <button class="login_form_main_button" @click="submit">登录</button>
        </div>
      </div>
    </div>
  </div>
  <SelectSystem v-model="visible"/>
</template>

<script lang="ts">
import loginTs from '../login'
import { defineComponent } from 'vue'
import SelectSystem from '@/components/layout/select-system.vue'

export default defineComponent({
  name: 'MssLogin',
  components: {
    SelectSystem
  },
  setup () {
    const { eye, visible, loginForm, clearForm, submit } = loginTs()

    return {
      loginForm,
      eye,
      visible,
      clearForm,
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
  .login_bg{
    width: 100%;
    height: 100%;
    background: url("~@/assets/img/login/login_bg.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
