import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { GET_NAV } from '@/api/api/index'
import { fnAddDynamicMenuRoutes } from '@/utils/index'

const globalRoutes: Array<RouteRecordRaw> = []

const mainRouter: RouteRecordRaw = {
  path: '/',
  name: 'index',
  component: () => import('@/components/layout/index.vue'),
  children: [
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      component: () => import('./pages/home.vue')
    },
    {
      path: '/system',
      component: () => import('@/components/layout/system.vue')
    }
  ]
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL + 'SYSTEM.html'),
  routes: globalRoutes.concat(mainRouter)
})

let isAddDynamicMenuRoutes = false

router.beforeEach((to, from, next) => {
  if (isAddDynamicMenuRoutes) {
    return next()
  } else {
    GET_NAV({
      factory: 'mss_fake_factory',
      tenant: 'MSS'
    }).then(({ data }) => {
      fnAddDynamicMenuRoutes(data.data.menuList, [], router, mainRouter)
      sessionStorage.setItem('menuList', JSON.stringify(data.data.menuList || []))
      sessionStorage.setItem('permissions', JSON.stringify(data.data.permissions || '[]'))
      isAddDynamicMenuRoutes = true
      return next(Object.assign({}, to, { replace: true }))
    })
  }
})

export default router
