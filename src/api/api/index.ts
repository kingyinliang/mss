import { AxiosResponse } from 'axios'
import Http from '../http/axios'

export function login (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysDept/dropDown?factory=common', params)
}
export function login1 (params = {}):Promise<AxiosResponse> {
  return Http.get('http://10.22.7.52:8081/?clientId=aaa&responseType=code&redirectUri=http://10.22.7.52:8081', params)
}
