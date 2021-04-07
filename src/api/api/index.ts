import { AxiosResponse } from 'axios'
import Http from '../http/axios'

export function LOGIN (url: string, params = {}):Promise<AxiosResponse> {
  return Http.post('/oauth2/authorize?' + url, params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function GET_TOKEN (params = {}):Promise<AxiosResponse> {
  return Http.post('/oauth2/accessToken', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function GET_TENANT_BY_USER_ID (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysTenant/queryUserTenant', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function UPDATE_TENANT (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysTenant/tenant/update', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function GET_NAV (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysUser/userRole/menuQuery', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function GET_FACTORY (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysDept/getTypeDept', params)
}
export function GET_DICT (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysDict/query', params)
}
export function GET_DICT_ITEM (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysDictItem/query', params)
}
export function DEL_DICT (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysDict/delete', params)
}
export function DEL_DICT_ITEM (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysDictItem/delete', params)
}
export function DICT_ITEM_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysDictItem/insert', params)
}
export function DICT_ITEM_UPDATE (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysDictItem/update', params)
}
export function DICT_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysDict/insert', params)
}
export function DICT_UPDATE (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysDict/update', params)
}
export function MENU_LIST (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysMenu/query', params)
}
export function ALL_MENU_LIST (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysMenu/selectMenu', params)
}
export function MENU_DEL (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysMenu/remove', params)
}
export function GET_DEPT (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysDept/getTypeDept', params)
}
export function MENU_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('sysMenu/insert', params)
}
export function MENU_UPDATE (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysMenu/update', params)
}
