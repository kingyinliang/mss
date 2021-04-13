import { AxiosResponse } from 'axios'
import Http from '../http/axios'

export function LOGIN (url: string, params = {}):Promise<AxiosResponse> {
  return Http.post('/oauth2/authorize?' + url, params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
}
export function GET_LOGIN_INFO (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysUser/login', params, { baseURL: (process.env.VUE_APP_SYSTEM_API as string) + (process.env.VUE_APP_API_V as string) })
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
export function APP_VERSION (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysApp/getLastedVersion', params)
}
export function APP_SAVE (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysApp/save', params)
}
export function UPLOAD_APK (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysApp/getUploadUrl', params)
}
export function ROLE_LIST (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysRole/query', params)
}
export function ROLE_REMOVE (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysRole/remove', params)
}
export function ROLE_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysRole/insert', params)
}
export function ROLE_UPDATE (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysRole/update', params)
}
export function ROLE_USER (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysUserRole/roleUserList', params)
}
export function ROLE_USER_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysUserRole/insert', params)
}
export function DEPT_ALL (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysDept/dropDown', params)
}
export function ROLE_DEPT (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysRoleDept/roleDeptList', params)
}
export function ROLE_DEPT_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysRoleDept/insert', params)
}
export function ROLE_MENU_ADD (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysRoleMenu/insert', params)
}
export function ROLE_MENU_LIST (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysMenu/selectByRole', params)
}
export function ROLE_MENU (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysRoleMenu/roleMenuList', params)
}
export function USER_LIST (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysUser/userRole/query', params)
}
export function USER_PASSWORD_RESET (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysUser/password/reset', params)
}
export function USER_ROLE_DROPDOWN (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysRole/dropDown', params)
}
export function USER_ROLE_UPDATE (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysUserRole/userRole/insert', params)
}
export function ORG_TREE_API (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysDept/dropDown', params)
}
export function USER_DELETE (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysUser/delete', params)
}
export function USER_BATCH_QUERY (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysUser/batchQueryById', params)
}
export function DICT_QUERY (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysDictItem/dropDown', params)
}
export function USER_INSERT (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysUser/insert', params)
}
export function USER_UPDATE (params = {}):Promise<AxiosResponse> {
  return Http.post('/sysUser/update', params)
}
export function USER_QUIT (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysUser/quit', params)
}
