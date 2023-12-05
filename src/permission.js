import router from './router'
import store from './store'
import {Message} from 'element-ui'
import {getToken} from '@/utils/auth' // get token from cookie

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({path: '/'})
    } else {
      const hasGetUserInfo = store.state.user.userInfo
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')
          // console.time('路由转换时间')
          // ? 加载速度过慢
          await store.dispatch('user/getUserInfo')

          // generate accessible routes map based on roles
          // const accessRoutes = await store.dispatch('permission/generateRoutes', systemMenuItem)
          // dynamically add accessible routes
          // router.addRoutes(accessRoutes)
          // console.timeEnd('路由转换时间')
          //
          next({...to})
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message({
            message: error || '错误',
            type: 'error'
          })
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})
