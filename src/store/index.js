import Vue from 'vue'
import Vuex from 'vuex'

import index from '@/store/module'
import alarm from '@/store/module/alarm'
import models from '@/store/module/models'
import user from '@/store/module/user'
import mapConfig from '@/store/module/mapConfig'
import setMap from '@/store/module/setMap'
import traceReplay from '@/store/module/traceReplay'
import device from '@/store/module/device'
import RuleConfig from '@/store/module/rule/RuleConfig'
import BasicConfig from '@/store/module/device/BasicConfig'
import selfModelInfo from '@/store/module/selfModel'
import account from '@/store/module/account'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mapper: null,
  },
  getters: {
    getMapper: state => state.mapper
  },
  mutations: {
    updateMapper(state, payload) {
      state.mapper = payload
    }
  },
  modules: {
    index,
    alarm,
    user,
    models,
    mapConfig,
    setMap,
    traceReplay,
    device,
    RuleConfig,
    BasicConfig,
    selfModelInfo,
    account,
  },
  // getters
})
