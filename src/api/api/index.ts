import { AxiosResponse } from 'axios'
import Http from '../http/axios'

export function login (params = {}):Promise<AxiosResponse> {
  return Http.get('/sysDept/dropDown?factory=common', params)
}
