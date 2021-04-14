import { App, ComponentOptions } from 'vue'
import MdsCard from './mds-card'
import TableTreeColumn from './TableTreeColumn'
import OrgView from './OrgView'

const components: ComponentOptions[] = [
  MdsCard,
  TableTreeColumn,
  OrgView
]

const install = function (app: App):void {
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
