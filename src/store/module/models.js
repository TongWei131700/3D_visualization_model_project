import * as types from '../mutation-types'
import ShareModels from '@/components/models/ShareModels'
import {resolve} from "eslint-plugin-promise/rules/lib/promise-statics";
// 本来想用它实现场景存储, 但刷新页面会重置, 因此弃用
// models.onlyModels 表示全局唯一场景
const models = {
  namespaced: true,
  state: {
    shareModels: null,
    flag: true,
    selectFloorInfo: {}, // 保存选中楼层信息
    selectHomeFloorInfo: {}, // 保存首页选中楼层信息
    selectHomeFloorInfoID: 0, // 保存首页轨迹线的ID
    showTrace: false, // 展示轨迹调节框
    traceParam: {}, // 轨迹线位置偏移量调整
    saveTraceParam: {}, // 首页轨迹修改参数
    showDefencePosition: false, // 轨迹线调节栏是否展示
    defenceInfo: -1, // 初始值-1.记录防区高度调节信息
    radarCardShow: false, // 雷达卡片高度调节是否展示
    radarCardPosition: {}, // 雷达卡片高度位置
    ifShowLoad: false// 如果只有简易模型的话，楼层选择器处于加载状态
  },
  mutations: {
    uploadDefenceInfo(state, payload) {
      state.defenceInfo = payload
    },
    uploadDefencePosition(state, payload) {
      state.showDefencePosition = payload
    },
    uploadRadarCardShow(state, payload) {
      state.radarCardShow = payload
    },
    uploadRadarCardPosition(state, payload) {
      state.radarCardPosition = payload
    },
    uploadSaveTraceParam(state, payload) {
      state.saveTraceParam = payload
    },
    uploadTraceParam(state, payload) {
      state.traceParam = payload
    },
    uploadShowTrace(state, payload) {
      state.showTrace = payload
    },
    uploadSelectFloorInfo(state, payload) {
      state.selectFloorInfo = payload
    },
    uploadIfShowLoad(state, payload) {
      state.ifShowLoad = payload
    },
    uploadSelectHomeFloorInfo(state, payload) {
      state.selectHomeFloorInfo = payload
    },
    uploadSelectHomeFloorInfoID(state, payload) {
      state.selectHomeFloorInfoID = payload
    },
    updShareModels(state, payload) {
      state.shareModels = {...payload}
      console.log(state.shareModels, "mutations更新完毕")
    },
    setShareModels(state, payload) {
      state.shareModels = payload
    },
    [types.INIT_SHARE_MODELS](state, payload) {
      state.shareModels = payload
    },
    updateFlag(state, flag) {
      state.flag = flag
    },
    updateShareModels(state, payload) {
      state.shareModels = payload
    }
  },
  actions: {
    // 修改成返回promise从而使得异步流程可控
    initShareModels({commit}) {
      return new Promise(resolve => {
        const shareModels = new ShareModels()
        // commit(types.INIT_SHARE_MODELS, shareModels);
        shareModels.initDeviceModels().then(res => {
          shareModels.initModels = res[0]
          commit('updShareModels', shareModels)
          console.log('这里是initShareModels')
          resolve(1)
        })
      })
    }
  },
  getters: {
    getShareModels: state => state.shareModels,
    getSelectFloorInfo: state => state.selectFloorInfo,
    getSelectHomeFloorInfo: state => state.selectHomeFloorInfo,
    getRadarCardShow: state => state.radarCardShow,
    getRadarCardPosition: state => state.radarCardPosition,
    getSelectHomeFloorInfoID: state => state.selectHomeFloorInfoID,
    getShowTrace: state => state.showTrace,
    getTraceParam: state => state.traceParam,
    getSaveTraceParam: state => state.saveTraceParam,
    getDefencePosition: state => state.showDefencePosition,
    getDefenceInfo: state => state.defenceInfo,
    getIfShowLoad: state => state.ifShowLoad
  }

}

export default models
