import { App, ComponentOptions } from 'vue'
import MdsCard from './mds-card'
import TableTreeColumn from './TableTreeColumn'
import OrgView from './OrgView'

import { ElNotification } from 'element-plus'
import { isAuth } from '@/utils'

const components: ComponentOptions[] = [
  MdsCard,
  TableTreeColumn,
  OrgView
]

const install = function (app: App):void {
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

  components.forEach(component => {
    app.component(component.name as string, component)
  })
}

export default {
  install,
  MdsCard,
  TableTreeColumn,
  OrgView
}
