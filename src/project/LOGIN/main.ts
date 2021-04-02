import { createApp } from 'vue'
import AppVue from './App.vue'
import router from './router'
import VueCookies from '@/components/cookie/vue-cookies'

import '@/assets/scss/index.scss'
import '@/assets/icon/iconfont.css'

const app = createApp(AppVue)

app.use(router).use(VueCookies).mount('#app')
