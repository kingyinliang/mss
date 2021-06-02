import {
  ComponentInternalInstance,
  ComponentPublicInstance,
  getCurrentInstance, reactive, Ref, ref, UnwrapRef
} from 'vue'
import { ElLoading } from 'element-plus'
import { GET_LOGIN_INFO, LOGIN, UPDATE_TENANT } from '@/api/api'

interface QueryObj {
  url?: string;
  clientId?: string;
  responseType?: string;
  clientSecret?: string;
  redirectUri?: string;
  token?: string;
  tenant?: string;
}
interface LoginForm {
  userName: string
  password: string
  terminal: string
}
interface LoginTs {
  loginFormRef: Ref
  // eslint-disable-next-line
  loginRules: any
  systemName: Ref<string>
  eye: Ref<boolean>
  visible: Ref<boolean>
  loginForm: UnwrapRef<LoginForm>
  clearForm: () => void
  createProxy: (redirectUri:string, token:string) => void
  submit: () => void
  init: () => void
}
export default function (): LoginTs {
  const ctx = getCurrentInstance() as ComponentInternalInstance
  const proxy = ctx.proxy as ComponentPublicInstance

  const loginFormRef = ref()
  const systemName = ref('mss')
  const eye = ref(false)
  const visible = ref(false)
  const loginForm = reactive({
    userName: '',
    password: '',
    terminal: 'PC'
  })

  const userNameRules = (rule: string, value: string, callback: (ctx?: Error) => void) => {
    if (value === '') {
      return callback(new Error('请输入账号'))
    } else if (value.length !== 8) {
      return callback(new Error('长度为 8 个字符工号'))
    }
    return callback()
  }
  const passwordRules = (rule: string, value: string, callback: (ctx?: Error) => void) => {
    if (value === '') {
      return callback(new Error('请输入密码'))
    }
    return callback()
  }
  const loginRules = ref({
    userName: [
      { required: true, validator: userNameRules, trigger: 'blur' }
    ],
    password: [
      {
        min: 8,
        max: 12,
        message: '长度在 8 到 12 个字符',
        trigger: 'blur'
      },
      { validator: passwordRules, trigger: 'blur' }
    ]
  })

  const init = () => {
    const query:QueryObj = proxy.$route.query
    if (query.redirectUri) {
      if (/rdm/.test(query.redirectUri)) {
        systemName.value = 'RdmLogin'
      } else if (/mds/.test(query.redirectUri)) {
        systemName.value = 'MdsLogin'
      } else if (/cdm/.test(query.redirectUri)) {
        systemName.value = 'CdmLogin'
      } else {
        systemName.value = 'MssLogin'
      }
    } else {
      systemName.value = 'MssLogin'
    }
    if (query.token) {
      proxy.$cookies.set('token', query.token)
      GET_LOGIN_INFO({
        accessToken: query.token,
        tenant: 'MSS'
      }).then(({ data }) => {
        sessionStorage.setItem('userInfo', JSON.stringify(data.data || {}))
        UPDATE_TENANT({
          systemCode: query.tenant
        }).then(() => {
          localStorage.setItem('vuex', '')
          sessionStorage.setItem('systemName', query.tenant || '')
          window.location.href = '/SYSTEM'
        })
      })
    }
  }
  const clearForm = () => {
    loginForm.userName = ''
    loginForm.password = ''
  }
  const submit = () => {
    loginFormRef.value.validate((valid:boolean) => {
      if (valid) {
        const query:QueryObj = proxy.$route.query

        const clientId = query.clientId || 'baca244f8f0111eb9c21026438001fa4'
        const responseType = query.responseType || 'client'
        // const clientSecret = query.clientSecret || 'baca244f8f0111eb9c21026438001fa4'
        const redirectUri = query.redirectUri
        const url = `clientId=${clientId}&responseType=${responseType}`
        LOGIN(url, loginForm).then(({ data }) => {
          if (redirectUri) {
            // setTimeout(() => {
            //   window.location.href = redirectUri
            // }, 1000)
            window.location.href = redirectUri
            // sso
            // GET_TOKEN({
            //   clientId: clientId,
            //   clientSecret: clientSecret,
            //   grantType: 'authorization_code',
            //   code: data.data,
            //   redirectUri: redirectUri
            // }).then(res => {
            //   proxy.$cookies.set('token', res.data.data.token)
            //   sessionStorage.setItem('userInfo', res.data.data || {})
            //   createProxy(redirectUri, res.data.data.token)
            //   // GET_LOGIN_INFO({
            //   //   accessToken: res.data.data.token,
            //   //   tenant: 'MSS'
            //   // })
            // })
          } else {
            proxy.$cookies.set('token', data.data.token)
            sessionStorage.setItem('userInfo', JSON.stringify(data.data || {}))
            // mss
            visible.value = true
          }
        })
      }
    })
  }
  const createProxy = (redirectUri: string, token: string) => {
    console.time('iframe')
    const _loading = ElLoading.service({
      lock: true,
      spinner: 'loadingGif',
      text: '加载中……',
      background: 'rgba(255, 255, 255, 0.7)'
    })
    // eslint-disable-next-line
    const iframe: any = document.createElement('iframe')
    iframe.src = redirectUri + `?token=${token}`
    iframe.style = 'position: fixed; bottom: 0;left: 0; display: none'
    document.getElementsByTagName('body')[0].appendChild(iframe)
    iframe.onload = function () {
      _loading.close()
      console.timeEnd('iframe')
      window.location.href = redirectUri
    }
  }

  return {
    loginFormRef,
    loginRules,
    systemName,
    eye,
    visible,
    loginForm,
    clearForm,
    createProxy,
    submit,
    init
  }
}
