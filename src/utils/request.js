import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken} from '@/utils/auth'
import errorCode from '@/config/responeErrorCode'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// create an axios instance
const service = axios.create({
  baseURL: '/api',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (config.url === '/captchaImage' || config.url === '/login') return config
  if (getToken()) {
    config.headers['Authorization'] = 'Bearer ' + getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  return Promise.reject(Error(error))
})

// response 拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const message = errorCode[code] || res.data.msg || errorCode['default']
    console.log('状态码------------')
    console.log(code)
    if (code === 403) {
      MessageBox.confirm(
        '证书已过期，请重新申请新的证书'
      ).then(() => {
        store.dispatch('userLogOut').then(() => {
          location.href = '/login'
          // location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code === 500) {
      Message({
        message: message,
        offset: 70,
        type: 'error'
      })
      return Promise.reject(new Error(message))
    } else if (code !== 200) {
      Message({
        message: message,
        offset: 70,
        type: 'error'
      })
      return Promise.reject(new Error(message))
    } else {
      return res.data
    }
  },
  error => {
    console.log(error)
    Message({
      message: error.message,
      type: 'error',
      offset: 70,
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
