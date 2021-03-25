<template>
  <div class="login_form">
    <div class="login_form_main">
      <div class="login_form_main_icon">
        <img src="@/assets/img/login/login_icon.png" alt="Icon">
      </div>
      <div class="login_form_main_text">MDS 综合管理平台</div>
      <div class="login_form_main_contain">
        <div class="login_form_main_username login_form_main_input" style="margin-bottom: 12%;">
          <p>账号:</p>
          <div class="login_form_main_input_prefix">
            <input v-model="loginForm.username" class="input" type="text" placeholder="账号">
            <em class="iconfont factory-zhanghao" />
          </div>
        </div>
        <div class="login_form_main_input" style="margin-bottom: 11.5%;">
          <p>密码:</p>
          <div class="login_form_main_password">
            <div class="login_form_main_input_prefix">
              <input v-model="loginForm.password" class="input" :type="eye? 'text' : 'password'" placeholder="密码">
              <em class="iconfont factory-zu" />
            </div>
            <div class="login_form_main_password_eye" @click="eye = !eye">
              <em class="iconfont factory-in_biyan_fill" />
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
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { login1 } from '@/api/api'

export default defineComponent({
  name: 'login_form',
  setup () {
    const eye = ref(false)
    const loginForm = reactive({
      username: '',
      password: ''
    })

    const submit = () => {
      // const url = decodeURIComponent(window.location.href.split('?')[1].split('=')[1])
      // const urlData = JSON.parse(url)
      // console.log(urlData)
      // window.location.href
      login1()
    }
    const clearForm = () => {
      loginForm.username = ''
      loginForm.password = ''
    }

    onMounted(() => {
      const a = document.cookie
      console.log('110da21278ede4f87dd26fe23a6f0f0e')
      console.log(a)
    })

    return {
      loginForm,
      eye,
      clearForm,
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
  .login_form{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    &_main{
      display: flex;
      flex-direction: column;
      position: absolute;
      left: 7%;
      height: 80%;
      width: 30%;
      padding: 4%;
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.82);
      &_text{
        margin-top: 10px;
        font-weight: bold;
        font-size: 32px;
      }
      &_contain{
        flex: 1;
        padding-top: 15%;
      }
      &_input{
        flex: 1;
        &_prefix{
          flex: 1;
          position: relative;
          .iconfont{
            height: 100%;
            font-size: 16px;
            line-height: 50px;
            text-align: center;
            position: absolute;
            left: 14px;
            color: #5F73F0;
          }
        }
        p{
          line-height: 36px;
          font-size: 14px;
          color: #999999;
        }
      }
      &_password{
        display: flex;
        &_eye{
          cursor: pointer;
          width: 50px;
          height: 50px;
          margin-left: 8px;
          background: #F9C3D2;
          border-radius: 8px;
          text-align: center;
          .iconfont{
            color: #5F73F0;
            font-size: 16px;
            line-height: 50px;
          }
        }
      }
      &_btn{
        cursor: pointer;
        color: #999999;
        font-size: 14px;
        line-height: 34px;
        .iconfont{
          color: #5F73F0;
        }
      }
      &_button{
        cursor: pointer;
        border: none;
        width: 50%;
        height: 50px;
        font-size: 18px;
        color: white;
        background: #000000;
        border-radius: 8px;
      }
      .input{
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 8px;
        border: 1px solid #5F73F0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 50px;
        line-height: 50px;
        outline: 0;
        padding: 0 15px 0 40px;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
      }
    }
  }
</style>
