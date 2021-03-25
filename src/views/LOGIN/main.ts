import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/scss/index.scss'
import '@/assets/icon/iconfont.css'

const app = createApp(App)

app.use(router).mount('#app')
