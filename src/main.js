import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './permission'
import './assets/styles/global.scss'

import '@/plugins/ElementUI'
import '@/plugins/echarts'
import '@/plugins/Avue'
import '@/plugins/dataV'

import bootstrap from '@/bootstrap'
import AuthorityPlugin from "./plugins/authority-plugin";

// 引入总线
Vue.prototype.$bus = new Vue()

Vue.config.productionTip = false

bootstrap({ router, store, undefined, message: Vue.prototype.$message })
Vue.use(AuthorityPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
