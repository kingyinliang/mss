import { AxiosResponse } from 'axios'
import Http from '../http/axios'

export function login (url: string, params = {}):Promise<AxiosResponse> {
  return Http.post('/oauth2/authorize?' + url, params)
}
export function getToken (params = {}):Promise<AxiosResponse> {
  return Http.post('/oauth2/accessToken', params)
}
