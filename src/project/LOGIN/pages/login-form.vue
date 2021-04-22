<template>
  <div class="login_form">
    <div class="login_form_main">
      <div class="login_form_main_icon">
        <img src="@/assets/img/login/login_icon.png" alt="Icon">
      </div>
<!--      <div class="login_form_main_text">DF-MSS 综合管理平台</div>-->
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
<!--            <div class="login_form_main_password_eye" @click="eye = !eye">-->
<!--              <em class="iconfont factory-in_biyan_fill" />-->
<!--            </div>-->
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
import SelectSystem from '@/components/layout/select-system.vue'
import { defineComponent, ref, reactive, onMounted, getCurrentInstance, ComponentPublicInstance, ComponentInternalInstance } from 'vue'
import { LOGIN, GET_LOGIN_INFO, GET_TOKEN, UPDATE_TENANT } from '@/api/api'
import { ElLoading } from 'element-plus'

interface QueryObj {
  url?: string;
  clientId?: string;
  responseType?: string;
  clientSecret?: string;
  redirectUri?: string;
  token?: string;
  tenant?: string;
}
export default defineComponent({
  name: 'login_form',
  components: {
    SelectSystem
  },
  setup () {
    const ctx = getCurrentInstance() as ComponentInternalInstance
    const proxy = ctx.proxy as ComponentPublicInstance
    const eye = ref(false)
    const visible = ref(false)
    const system = ref([])
    const loginForm = reactive({
      userName: '',
      password: '',
      terminal: 'PC'
    })

    const init = () => {
      const query:QueryObj = proxy.$route.query
      if (query.token) {
        proxy.$cookies.set('token', query.token)
        GET_LOGIN_INFO({
          accessToken: query.token,
          tenant: 'MSS'
        }).then(({ data }) => {
          sessionStorage.setItem('userInfo', JSON.stringify(data.data || {}))
          UPDATE_TENANT({
            systemCode: query.tenant
          }).then(() => {
            localStorage.setItem('vuex', '')
            sessionStorage.setItem('systemName', query.tenant || '')
            window.location.href = '/SYSTEM'
          })
        })
      }
    }
    const submit = () => {
      const query:QueryObj = proxy.$route.query

      const clientId = query.clientId || 'baca244f8f0111eb9c21026438001fa4'
      const responseType = query.responseType || 'client'
      const clientSecret = query.clientSecret || 'baca244f8f0111eb9c21026438001fa4'
      const redirectUri = query.redirectUri
      const url = `clientId=${clientId}&responseType=${responseType}`
      LOGIN(url, loginForm).then(({ data }) => {
        if (redirectUri) {
          // sso
          GET_TOKEN({
            clientId: clientId,
            clientSecret: clientSecret,
            grantType: 'authorization_code',
            code: data.data,
            redirectUri: redirectUri
          }).then(res => {
            proxy.$cookies.set('token', res.data.data.token)
            sessionStorage.setItem('userInfo', res.data.data || {})
            createProxy(redirectUri, res.data.data.token)
          })
        } else {
          proxy.$cookies.set('token', data.data.token)
          sessionStorage.setItem('userInfo', JSON.stringify(data.data || {}))
          // mss
          visible.value = true
        }
      })
    }
    const createProxy = (redirectUri: string, token: string) => {
      console.time('iframe')
      const _loading = ElLoading.service({
        lock: true,
        spinner: 'loadingGif',
        text: '加载中……',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      const iframe = document.createElement('iframe')
      iframe.src = redirectUri + `?token=${token}`
      document.getElementsByTagName('body')[0].appendChild(iframe)
      iframe.onload = function () {
        _loading.close()
        console.timeEnd('iframe')
        window.location.href = redirectUri
      }
    }
    const clearForm = () => {
      loginForm.userName = ''
      loginForm.password = ''
    }

    onMounted(() => {
      init()
    })

    return {
      loginForm,
      eye,
      visible,
      system,
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
      min-width: 450px;
      min-height: 600px;
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
            color: #5F73F0;
          }
          .iconfont--left{
            left: 14px;
          }
          .iconfont--right{
            right: 14px;
            cursor: pointer;
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
        padding: 0 40px 0 40px;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
      }
    }
  }
</style>
