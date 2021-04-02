import axios, { AxiosInstance, AxiosResponse } from 'axios'
import VueCookies from '@/components/cookie/vue-cookies'

enum HttpCode {
  SUCCESS = 200,
  EXPIRED_TOKEN = 401,
  ERROR = 500,
}

export class HttpManager {
  static _instance: HttpManager
  _axios: AxiosInstance

  constructor () {
    console.log('axios初始化')
    this._axios = axios.create({
      baseURL: (process.env.VUE_APP_BASE_API as string) + (process.env.VUE_APP_API_V as string),
      timeout: 30000
    })
    this.interceptorsRequest()
    this.interceptorsResponse()
  }

  static getInstance (): HttpManager {
    this._instance || (this._instance = new HttpManager())
    return this._instance
  }

  get (url: string, params = {}, config = {}): Promise<AxiosResponse> {
    return this._axios.get(url, {
      ...config,
      params
    })
  }

  post (url: string, data = {}, config = {}): Promise<AxiosResponse> {
    return this._axios.post(url, data, config)
  }

  interceptorsRequest (): void {
    this._axios.interceptors.request.use(config => {
      if (VueCookies.get('token')) {
        config.headers.Authorization = VueCookies.get('token')
      }
      return config
    }, error => Promise.reject(error))
  }

  interceptorsResponse (): void {
    this._axios.interceptors.response.use(res => {
      if (res.data.code === HttpCode.SUCCESS) {
        return res
      } else if (res.data.code === HttpCode.EXPIRED_TOKEN) {
        window.location.href = process.env.VUE_APP_HOST as string
        return res
      } else {
        return res
      }
    }, error => Promise.reject(error))
  }
}

export default HttpManager.getInstance()
