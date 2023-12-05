import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Layout = () =>
  import ('@/components/layout/Layout')
const NavigationHeader = () =>
  import ('@/components/layout/header/NavigationHeader')
const IndexHeader = () =>
  import ('@/components/layout/header/IndexHeader')
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
const constantRoutes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/login',
    component: () =>
      import ('@/views/login/LoginIndex')
  },
  {
    path: '/index',
    component: Layout,
    children: [
      {
        path: '/index',
        components: {
          header: IndexHeader,
          content: () => import ('@/views/index/Index')
        },
      }
    ],
  },
  // {
  //   path: '/index',
  //   component: Layout,
  //   children: [
  //     {
  //     path: '/index',
  //     components: {
  //       header: IndexHeader,
  //       content: () =>
  //         import ('@/views/index/Index')
  //     }
  //   },
  //     {
  //       path: '/alarm',
  //       components: {
  //         header: NavigationHeader,
  //         content: () =>
  //           import ('@/views/alarm/AlarmIndex')
  //       }
  //     },
  //     {
  //       path: '/trace_replay',
  //       components: {
  //         header: NavigationHeader,
  //         content: () =>
  //           import ('@/views/trace-replay/TraceReplayIndex')
  //       }
  //     },
  //     {
  //       path: '/device_preview',
  //       name: 'DevicePreview',
  //       components: {
  //         header: NavigationHeader,
  //         content: () =>
  //           import ('@/views/device-preview/DevicePreViewIndex')
  //       }
  //     },
  //     {
  //       path: '/device_basic_config',
  //       components: {
  //         header: NavigationHeader,
  //         content: () =>
  //           import ('@/views/device-basic-config/BasicConfig')
  //       }
  //     },
  //     {
  //       path: '/rule_config',
  //       components: {
  //         header: NavigationHeader,
  //         content: () =>
  //           import ('@/views/rule/RuleConfig')
  //       }
  //     },
  //     {
  //       path: '/map-config',
  //       components: {
  //         header: NavigationHeader,
  //         content: () =>
  //           import ('@/views/mapconfig/MapConfig')
  //       }
  //
  //
  //     },
  //   ]
  // },

  {
    path: '/404',
    name: 'notFound',
    component: () =>
      import ('@/components/error-page/404')
  },
  {
    path: '*', // 此处需特别注意置于最底部
    redirect: '/404'
  }
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes,
})

export default router
