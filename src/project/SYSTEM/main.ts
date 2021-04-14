import { createApp } from 'vue'
import AppVue from './App.vue'
import router from './router'
import store from './store'
import ElementPlus, { ElNotification } from 'element-plus'
import VueCookies from '@/components/cookie/vue-cookies'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import { isAuth } from '@/utils'

import Mds from '@/components'

import '@/assets/scss/index.scss'
import '@/assets/icon/iconfont.css'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(AppVue)
app.config.globalProperties.isAuth = isAuth
app.config.globalProperties.$warningToast = (str:string) => {
  ElNotification({ title: '警告', message: str, type: 'warning' })
}
app.config.globalProperties.$errorToast = (str:string) => {
  ElNotification({ title: '错误', message: str, type: 'error', duration: 0 })
}
app.config.globalProperties.$successToast = (str:string) => {
  ElNotification({ title: '成功', message: str, type: 'success' })
}
app.config.globalProperties.$infoToast = (str:string) => {
  ElNotification({ title: '提示', message: str, type: 'info' })
}
// eslint-disable-next-line
type Fn<T> = (ctx?: any) => T
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    isAuth: Fn<boolean>,
    $warningToast: Fn<string>
    $errorToast: Fn<string>
    $successToast: Fn<string>
    $infoToast: Fn<string>
  }
}

app.use(router).use(store).use(ElementPlus, { locale }).use(Mds).use(VueCookies).mount('#app')
