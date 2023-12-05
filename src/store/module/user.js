import {login, logout, getInfo} from '@/api/login'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {MessageBox} from 'element-ui'
import {loadRoutes} from "../../utils/routerUtil";

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: null
  }
}
const user = {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, userInfo) => {
      state.userInfo = userInfo
    },
    RESET_STATE: (state) => {
      Object.assign(state, getDefaultState())
    }
  },
  actions: {
    // 登录
    login({commit}, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.captcha
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    getUserInfo({commit}) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          commit('SET_USER', {
            roles: res.roles,
            userId: res.user.userId,
            userName: res.user.userName
          })
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 退出系统
    logOut({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          // 路由置空
          loadRoutes([])
          MessageBox.confirm(
            '登录状态已过期，您可以继续留在该页面，或者重新登录',
            '系统提示',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            location.href = '/login'
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // remove token
    resetToken({commit}) {
      return new Promise(resolve => {
        removeToken() // must remove  token  first
        commit('RESET_STATE')
        resolve()
      })
    }
  },
  getters: {
    userInfo: (state) => state.userInfo
  }
}

export default user
