import { RouteMeta, Router, RouteRecordRaw } from 'vue-router'
interface MenuList {
  menuUrl: string;
  type: string;
  id: string;
  menuName: string;
  list: MenuList[];
}
// eslint-disable-next-line
const importTarget = process.env.NODE_ENV !== 'local' ? (file: string) => () => import('@/project/' + file + '.vue') : (file: string) => require('@/project/' + file + '.vue').default

export function fnAddDynamicMenuRoutes (menuList: MenuList[] = [], routes: RouteRecordRaw[] = [], router:Router, mainRouter: RouteRecordRaw): void {
  let temp: MenuList[] = []
  for (let i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    }
    if (menuList[i].menuUrl && /\S/.test(menuList[i].menuUrl)) {
      menuList[i].menuUrl = menuList[i].menuUrl.replace(/^\//, '')
      const route: RouteRecordRaw = {
        path: '/' + menuList[i].menuUrl.replace(/\//g, '-'),
        name: menuList[i].menuUrl.replace(/\//g, '-'),
        component: {},
        meta: {
          componentName: '',
          menuId: menuList[i].id,
          title: menuList[i].menuName,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      try {
        route.component = importTarget(`${menuList[i].menuUrl}`) || null;
        (route.meta as RouteMeta).componentName = route.component.name
      } catch (e) {
        //
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes, router, mainRouter)
  } else {
    mainRouter.children = mainRouter.children?.concat(routes)
    router.addRoute(mainRouter)
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(routes || []))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(routes)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}
