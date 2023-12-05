import {getAllMapInfo, getEnabledMapInfo, updateMapConfigById, enabledMapById} from '@/api/mapConfig/mapConfig'
import {Message} from 'element-ui'

const mapConfig = {
  namespaced: true,
  state: {
    // 全部地图的信息
    mapInfoList: [],
    // 当前正在使用的地图信息
    enabledMapInfo: null,
    // 是否显示地图配置信息
    editMapSettingsStatus: false,
    // 当前正在配置的地图信息
    editingMapInfo: null
  },
  mutations: {
    /** 更新地图信息
     * @author Lyc
     * @payload { mapInfoList }
     */
    updateMapInfoList(state, payload) {
      state.mapInfoList = payload
    },
    /** 更新当前正在使用的地图信息并且向地图信息中添加是否启用属性
     * @author Lyc
     * @payload { enabledMapInfo }
     */
    updateEnabledMapInfo(state, payload) {
      state.enabledMapInfo = payload
      state.mapInfoList = state.mapInfoList.map((item) => {
        item.isEnabled = item.id === state.enabledMapInfo.id
        return item
      })
    },
    /** 控制是否显示地图配置信息
     * @author Lyc
     * @payload { status }
     */
    updateEditMapSettingsStatus(state, payload) {
      state.editMapSettingsStatus = payload
    },
    /** 行点击填入正在配置地图的信息
     * @author Lyc
     * @payload { editingMapInfo}
     */
    updateEditingMapInfo(state, payload) {
      state.editingMapInfo = payload
    }
  },
  actions: {
    /** 请求数据库获得所有地图信息
     * @author Lyc
     * @return Promise<T>
     */
    getAllMapInfoByActions: ({commit}) => new Promise((resolve) => {
      getAllMapInfo().then((res) => {
        const mapInfoList = res.data
        console.log("bbbbbbbbbbbbbb");
        console.log(mapInfoList);
        commit('updateMapInfoList', mapInfoList)
        resolve(res)
      })
    }),
    /** 请求数据库获得当前使用的地图信息
     * @author Lyc
     * @return Promise<T>
     */
    getEnabledMapInfoByActions: ({commit}) => new Promise((resolve) => {
      getEnabledMapInfo().then((res) => {
        const enabledMapInfo = res.data
        commit('updateEnabledMapInfo', enabledMapInfo)
        resolve(res)
      })
    }),
    /** 向数据库更新地图的相关配置信息和启用状态
     * @author Lyc
     * @param payload: mapSettingsForm
     */
    updateMapSettings: ({state}, payload) => Promise.all([
      new Promise((resolve) => {
        if (payload.isEnabled === true) {
          enabledMapById(payload.id).then((res) => {
            Message({
              type: 'success',
              message: '启用新地图成功'
            })
            resolve(res)
          })
        } else {
          resolve('不更新地图')
        }
        if (payload.isEnabled === false && state.editingMapInfo.isEnabled === true) {
          Message({
            type: 'warning',
            message: '不能一个地图都不启用'
          })
          payload.isEnabled = true
        }
      }),
      new Promise((resolve) => {
        updateMapConfigById(payload).then((res) => {
          resolve(res)
        })
      })
    ]).then(() => {
      Message({
        type: 'success',
        message: '更新地图配置信息成功'
      })
    }).catch(() => {
      Message({
        type: 'error',
        message: '更新地图配置信息失败'
      })
    })
  },
  getters: {
    getMapInfoList(state) {
      return state.mapInfoList
    },
    getEnabledMapInfo(state) {
      return state.enabledMapInfo
    },
    getEditMapSettingsStatus(state) {
      return state.editMapSettingsStatus
    },
    getEditingMapInfo(state) {
      return state.editingMapInfo
    }
  }
}

export default mapConfig
