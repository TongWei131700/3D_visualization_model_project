import Router from 'vue-router'
import deepMerge from 'deepmerge'
import NavigationHeader from "../components/layout/header/NavigationHeader";
import IndexHeader from "../components/layout/header/IndexHeader";

const routerMap = {
  'index': {
    path: '/index',
    name: '首页',
    components: {
      header: IndexHeader,
      content: () => import ('@/views/index/Index')
    },
  },
  'alarm': {
    path: '/alarm',
    name: '报警管理',
    components: {
      header: NavigationHeader,
      content: () => import ('@/views/alarm/AlarmIndex')
    }
  },
  'trace_replay': {
    path: '/trace_replay',
    name: '轨迹回放',
    components: {
      header: NavigationHeader,
      content: () => import ('@/views/trace-replay/TraceReplayIndex')
    }
  },
  'device_preview': {
    path: '/device_preview',
    name: '设备预览',
    components: {
      header: NavigationHeader,
      content: () => import ('@/views/device-preview/DevicePreViewIndex')
    }
  },
  'device_basic_config': {
    path: '/device_basic_config',
    name: '设备管理',
    components: {
      header: NavigationHeader,
      content: () => import ('@/views/device-basic-config/BasicConfig')
    }
  },
  'rule_config': {
    path: '/rule_config',
    name: '规则管理',
    components: {
      header: NavigationHeader,
      content: () =>  import ('@/views/rule/RuleConfig')
    }
  },
  'map-config': {
    path: '/map-config',
    name: '地图配置',
    components: {
      header: NavigationHeader,
      content: () => import ('@/views/mapconfig/MapConfig')
    }
  },
  'system': {
    path: '/system',
    name: '系统管理',
    components: {
      header: NavigationHeader,
      content: () => import ('@/views/system/SystemManage')
    }
  },
}

//应用配置
let appOptions = {
  router: undefined,
  i18n: undefined,
  store: undefined
}

/**
 * 设置应用配置
 * @param options
 */
function setAppOptions(options) {
  const {router, store, i18n} = options
  appOptions.router = router
  appOptions.store = store
  appOptions.i18n = i18n
}

/**
 * 根据 路由配置 和 路由组件注册 解析路由
 * @param routesConfig 路由配置
 * @param routerMap 本地路由组件注册配置
 */
function parseRoutes(routesConfig, routerMap) {
  let routes = []
  routesConfig.forEach(item => {
    // 获取注册在 routerMap 中的 router，初始化 routeCfg
    let router = routerMap[item]
    if (!router) {
      console.warn(`can't find register for router ${item}, please register it in advance.`)
    }
    routes.push(router)
  })
  return routes
}

/**
 * 加载路由
 * @param routesConfig {String[]} 路由配置
 */
function loadRoutes(routesConfig) {
  // 应用配置
  const {router, store, i18n} = appOptions
  // 如果 routesConfig 有值，则更新到本地，否则从本地获取
  if (routesConfig) {
    store.commit('account/setRoutesConfig', routesConfig)
  } else {
    routesConfig = store.getters['account/routesConfig']
  }
  // 加载异步路由配置
  if (routesConfig && routesConfig.length > 0) {
    const routes = parseRoutes(routesConfig, routerMap)
    router.options.routes[2].children.push(...routes);
    router.addRoutes(router.options.routes)
  }
}

function getRouters() {
  const {store} = appOptions
  let routesConfig = store.getters['account/routesConfig']
  let routeCfg = [...routesConfig]
  if (routeCfg && routeCfg.length > 0) {
    routeCfg.unshift('index')
  } else {
    routeCfg = ['index']
  }
  return parseRoutes(routeCfg, routerMap)
}

/**
 * 合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function mergeRoutes(target, source) {
  const routesMap = {}
  target.forEach(item => routesMap[item.path] = item)
  source.forEach(item => routesMap[item.path] = item)
  return Object.values(routesMap)
}

// /**
//  * 深度合并路由
//  * @param target {Route[]}
//  * @param source {Route[]}
//  * @returns {Route[]}
//  */
// function deepMergeRoutes(target, source) {
//   // 映射路由数组
//   const mapRoutes = routes => {
//     const routesMap = {}
//     routes.forEach(item => {
//       routesMap[item.path] = {
//         ...item,
//         children: item.children ? mapRoutes(item.children) : undefined
//       }
//     })
//     return routesMap
//   }
//   const tarMap = mapRoutes(target)
//   const srcMap = mapRoutes(source)
//
//   // 合并路由
//   const merge = deepMerge(tarMap, srcMap)
//
//   // 转换为 routes 数组
//   const parseRoutesMap = routesMap => {
//     return Object.values(routesMap).map(item => {
//       if (item.children) {
//         item.children = parseRoutesMap(item.children)
//       } else {
//         delete item.children
//       }
//       return item
//     })
//   }
//   return parseRoutesMap(merge)
// }

/**
 * 格式化路由
 * @param routes 路由配置
 */
function formatRoutes(routes) {
  routes.forEach(route => {
    const {path} = route
    if (!path.startsWith('/') && path !== '*') {
      route.path = '/' + path
    }
  })
  formatAuthority(routes)
}

/**
 * 格式化路由的权限配置
 * @param routes 路由
 * @param pAuthorities 父级路由权限配置集合
 */
function formatAuthority(routes, pAuthorities = []) {
  routes.forEach(route => {
    const meta = route.meta
    const defaultAuthority = pAuthorities[pAuthorities.length - 1] || {permission: '*'}
    if (meta) {
      let authority = {}
      if (!meta.authority) {
        authority = defaultAuthority
      }else if (typeof meta.authority === 'string') {
        authority.permission = meta.authority
      } else if (typeof meta.authority === 'object') {
        authority = meta.authority
        const {role} = authority
        if (typeof role === 'string') {
          authority.role = [role]
        }
        if (!authority.permission && !authority.role) {
          authority = defaultAuthority
        }
      }
      meta.authority = authority
    } else {
      const authority = defaultAuthority
      route.meta = {authority}
    }
    route.meta.pAuthorities = pAuthorities
    if (route.children) {
      formatAuthority(route.children, [...pAuthorities, route.meta.authority])
    }
  })
}

/**
 * 从路由 path 解析 i18n key
 * @param path
 * @returns {*}
 */
function getI18nKey(path) {
  const keys = path.split('/').filter(item => !item.startsWith(':') && item != '')
  keys.push('name')
  return keys.join('.')
}

/**
 * 加载导航守卫
 * @param guards
 * @param options
 */
function loadGuards(guards, options) {
  const {beforeEach, afterEach} = guards
  const {router} = options
  beforeEach.forEach(guard => {
    if (guard && typeof guard === 'function') {
      router.beforeEach((to, from, next) => guard(to, from, next, options))
    }
  })
  afterEach.forEach(guard => {
    if (guard && typeof guard === 'function') {
      router.afterEach((to, from) => guard(to, from, options))
    }
  })
}

export {parseRoutes, loadRoutes, formatAuthority, getI18nKey, loadGuards,
  // deepMergeRoutes,
  getRouters,
  formatRoutes, setAppOptions}
