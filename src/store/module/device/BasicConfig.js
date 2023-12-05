import {
  getAllMonitorGroupIdName,
  getAllRadar,
  getAllCamera
} from '@/api/device/BasicConfig'

const BasicConfig = {
  namespaced: true,
  state: {
    // 所有哨兵组信息
    monitorInfo: [],
    // 所有雷达信息
    radarInfo: [],
    // 所有摄像头信息
    cameraInfo: []
  },
  mutations: {
    updateAllMonitorGroupIdNameByMutations: (state, payload) => {
      state.monitorInfo = payload
    },
    updateAllRadarByMutations: (state, payload) => {
      state.radarInfo = payload
    },
    updateAllCameraByMutations: (state, payload) => {
      state.cameraInfo = payload
    }
  },
  actions: {
    getAllMonitorGroupIdNameByActions: ({commit}) => new Promise((resolve, reject) => {
      getAllMonitorGroupIdName().then((res) => {
        const monitorInfo = res.data
        commit('updateAllMonitorGroupIdNameByMutations', monitorInfo)
        resolve(res.data)
      }).catch((error) => {
        reject(error)
      })
    }),
    getAllRadarByActions: ({commit}) => new Promise((resolve, reject) => {
      getAllRadar().then((res) => {
        const radarInfo = res.data
        commit('updateAllRadarByMutations', radarInfo)
        resolve(res.data)
      }).catch((error) => {
        reject(error)
      })
    }),
    getAllCameraByActions: ({commit}) => new Promise((resolve, reject) => {
      getAllCamera().then((res) => {
        const cameraInfo = res.data
        console.log(cameraInfo)
        commit('updateAllCameraByMutations', cameraInfo)
        resolve(res.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  getters: {
    getmonitorInfo: (state) => {
      return state.monitorInfo
    },
    getradarInfo: (state) => {
      return state.radarInfo
    },
    getcameraInfo: (state) => {
      console.log(state.cameraInfo)
      return state.cameraInfo
    }
  }
}
export default BasicConfig
