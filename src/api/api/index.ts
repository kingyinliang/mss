import { AxiosResponse } from 'axios'
import Http from '../http/axios'

export function LOGIN (url: string, params = {}):Promise<AxiosResponse> {
  return Http.post('/oauth2/authorize?' + url, params)
}
export function GET_TOKEN (params = {}):Promise<AxiosResponse> {
  return Http.post('/oauth2/accessToken', params)
}
export function GET_TENANT_BY_USER_ID (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysTenant/queryUserTenant', params)
}
export function GET_NAV (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysUser/userRole/menuQuery', params)
}
