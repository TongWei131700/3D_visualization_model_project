import {initMapAPI, putMapConfigureAPI, uploadModelAPI} from '@/api/setMap/setMap'

const setMap = {
  namespaced: true,
  state: {
    initMapInfo: null
  },
  mutations: {
    initMap(state, payload) {
      state.initMapInfo = {...payload}
    }
  },
  actions: {
    uploadModel({commit}, file) {
      return uploadModelAPI(file)
    },
    // 修改成返回promise从而使得异步流程可控
    initMap({commit}) {
      return new Promise(resolve => {
        initMapAPI().then(res => {
          commit('initMap', res.data)
          console.log('++++++++++++++++++++++++++++++++++')
          console.log(res.data)
          window.localStorage.setItem('infoMsg', JSON.stringify(res.data))
          console.log(res, '初始化地图模型')
          resolve(1)
        })
      })
    },
    // 更新地图配置
    putMapConfigure({commit}, mapConfigureForm) {
      console.log(mapConfigureForm, '更新地图配置信息')
      return putMapConfigureAPI(mapConfigureForm)
    }
  },
  getters: {
    getInitMapInfo: (state) => state.initMapInfo
  }

}

export default setMap
