import axios, { AxiosInstance, AxiosResponse } from 'axios'

export class HttpManager {
  static _instance: HttpManager
  _axios: AxiosInstance

  constructor () {
    console.log('axios初始化')
    this._axios = axios.create({
      baseURL: 'https://apimarket-dev.shinho.net.cn/df-system/v1',
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

  interceptorsRequest ():void {
  //
  }

  interceptorsResponse ():void {
  //
  }
}

export default HttpManager.getInstance()
