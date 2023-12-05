const selfModelInfo = {
  namespaced: true,
  state: {
    MainPageSelfModel: null,
    TraceReplaySelfModel: null,
    DevicePreviewSelfModel: null,
  },

  mutations: {
    setMainPageSelfModel(state, MainPageSelfModel) {
      state.MainPageSelfModel = MainPageSelfModel;
    },
    setTraceReplaySelfModel(state, TraceReplaySelfModel) {
      state.TraceReplaySelfModel = TraceReplaySelfModel
    },
    setDevicePreviewSelfModel(state, payload) {
      state.DevicePreviewSelfModel = payload
    }
  },
  getters: {
    getMainPageSelfModel(state) {
      return state.MainPageSelfModel
    },
    getTraceReplaySelfModel(state) {
      return state.TraceReplaySelfModel
    },
    getDevicePreviewSelfModel(state) {
      return state.DevicePreviewSelfModel
    }
  },
  actions: {
    // saveModel(context, products) {
    //   context.commit('setModel', products)
    // }
    //保存selfModels
    saveMainPageSelfModel(context, products) {
      context.commit('setMainPageSelfModel', products)
    },
    saveTraceReplaySelfModel(context, products) {
      context.commit('setTraceReplaySelfModel', products)
    },
    saveDevicePreviewSelfModel(context, payload) {
      context.commit('setDevicePreviewSelfModel', payload)
    }
  }
}

export default selfModelInfo
