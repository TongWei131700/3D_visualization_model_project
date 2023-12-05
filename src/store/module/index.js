import {getAlarmList, getAllRadarStatus, getTodayUndoneOrDone} from '@/api/index'

const index = {
  namespaced: true,
  state: {
    // 今日报警统计信息
    todayInfo: {
      undone: 0,
      done: 0,
      total: -1
    },
    // 轮播图中报警列表
    alarmList: [],
    // 雷达在线状态信息
    radarOnlineInfo: {
      online: 0,
      offline: 0,
      list: []
    },
  },

  getters: {
    /* 与SecurityAlarm相关的 getters */
    getTodayInfo: (state) => state.todayInfo,
    getAlarmList: (state) => state.alarmList,
    /* 与RadarOnlineStatistics相关的 getters */
    numberOfOnAndOfflineRadars: state => {
      return {
        online: state.radarOnlineInfo.online,
        offline: state.radarOnlineInfo.offline,
        total: state.radarOnlineInfo.online + state.radarOnlineInfo.offline
      }
    },
    onlineRadarList: state => state.radarOnlineInfo.list.filter((item) => item.radarOnline === '1'),
    offlineRadarList: state => state.radarOnlineInfo.list.filter((item) => item.radarOnline === '0'),
    allRadarList: state => state.radarOnlineInfo.list,
  },

  mutations: {
    /** 更新state中今日报警统计信息
     * @author Mzy
     * */
    SET_TODAY_INFO(state, payload) {
      state.todayInfo.done = payload.done
      state.todayInfo.undone = payload.undone
      state.todayInfo.total = payload.done + payload.undone
      // 说明：防止出现0/0 NaN
      if (state.todayInfo.total === 0) {
        state.todayInfo.total = -1
      }
    },
    /**  websocket触发增加state中报警数目统计
     * @author Mzy
     */
    addNumberOfTodayDoneOrUndone(state) {
      if (state.todayInfo.total === -1) {
        state.todayInfo.total = 1
      } else {
        state.todayInfo.total++
      }
      state.todayInfo.undone++
    },
    /**  更新state中报警列表数据
     * @author Mzy
     */
    SET_INDEX_ALARM_LIST: (state, payload) => {
      state.alarmList = payload
    },
    SET_RADAR_ONLINE_INFO: (state, radarOnlineInfo) => {
      state.radarOnlineInfo = radarOnlineInfo
    },

    // /** 更新state中VideoUrl数据
    //  * @author Mzy
    //  * */
    // indexMuGainVideoUrl: (state, payload) => {
    //   Object.assign(state.video_url, payload);
    // },
    //
    // indexMuUpdateAlarmList: (state, payload) => {
    //   // 进行更新alarm_list中的Array
    //   state.alarm_list.unshift(payload);
    //   if (state.alarm_list.length > 20) {
    //     state.alarm_list.pop();
    //   }
    // },
    // setAllArrayDefence: (state, payload) => {
    //   state.allArrayDefence = payload;
    // },
    // // 防区内容
    // setArrayDefence: (state, payload) => {
    //   Object.assign(state.arrayDefence, payload);
    // },
    // deleteOneArrayDefence: (state, payload) => {
    //   state.arrayDefence.splice(payload, 1);
    // },
    // deleteAllArrayDefence: (state) => {
    //   state.arrayDefence = [];
    // },
    // addOneArrayDefence: (state, payload) => {
    //   state.arrayDefence.push(payload);
    // },
    //
    // // 轨迹线websocket
    // setLineWebsocket: (state, payload) => {
    //   state.lineWebsocket = payload;
    //   // console.log(state.lineWebsocket,"@@@@@@@@@@@@@@@@n")
    // },

  },

  actions: {
    /** 获取今日报警处理个数
     * @param context
     * @param payload
     * @returns {Promise<unknown>}
     */
    getTodayDoneOrUndoneByActions({commit}) {
      return new Promise((resolve, reject) => {
        getTodayUndoneOrDone().then(
          (res) => {
            const result = {
              undone: res.data.undo,
              done: res.data.done
            }
            commit('SET_TODAY_INFO', result)
            resolve(res)
          }
        ).catch(
          (error) => {
            console.error('获得今日报警情况错误')
            reject(new Error(error))
          }
        )
      })
    },
    /**  获取首页报警列表
     * @author Mzy
     * @param context
     * @param payload
     * @returns {Promise<unknown>}
     */
    getIndexAlarmListByActions: ({commit}, payload) => new Promise((resolve, reject) => {
      getAlarmList(payload).then((res) => {
        const result = res.data.records
        commit('SET_INDEX_ALARM_LIST', result)
        resolve(res)
      }).catch(
        (error) => {
          console.error('获得报警列表错误')
          reject(new Error(error))
        }
      )
    }),
    // /** 开启报警信息的websocket
    //  * @author Mzy
    //  * @param payload
    //  * */
    // openAlarmWebsocket: ({ commit }, payload) => {
    //   const websocketConnector = new MyWebsocketConnector(payload.url, 5000)
    //   websocketConnector.websocketObject.onopen = () => {
    //     console.log('AlarmWebsocket连接成功')
    //     websocketConnector.heartStart()
    //     websocketConnector.websocketObject.onmessage = payload.message
    //     commit('setAlarmWebsocket', websocketConnector)
    //   }
    // },
    /** 获取首页雷达在线状态
     * @author Mzy
     * @param payload
     * */
    getRadarOnlineStateByActions: ({commit}) => new Promise((resolve, reject) => {
      getAllRadarStatus().then((res) => {
        const result = res.data
        commit('SET_RADAR_ONLINE_INFO', result)
        resolve(res)
      }).catch(
        (error) => {
          console.error('获得雷达在线统计错误')
          reject(new Error(error))
        }
      )
    })
    // /** 获取首页视频流
    //  * @author Mzy
    //  * @param payload
    //  * */
    // indexAcGainVideoUrl: (context, payload) => new Promise((resolve) => {
    //   getVideoUrl(payload)
    //     .then((res) => {
    //       const result = {
    //         bolt: '',
    //         ball: '',
    //         recognize: ''
    //       }
    //       for (const [key, value] of Object.entries(res.data)) {
    //         if (key.includes('bolt') && value) {
    //           result.bolt = value.deviceVideo || ''
    //         } else if (key.includes('ball') && value.length > 0) {
    //           result.ball = value[0].deviceVideo || ''
    //         } else if (key.includes('object') && value) {
    //           result.recognize = value.deviceVideo || ''
    //         }
    //       }
    //       context.commit('indexMuGainVideoUrl', result)
    //       resolve()
    //     })
    // }),
    //
    // // 获取所有防区
    // getAllDefences: ({ commit }) => getAllDefences().then((res) => res.data
    //   // commit('setArrayDefence', res.data);
    // ),
    // openLineWebsocket: ({ commit }, payload) => {
    //   // "ws://10.10.2.67:8081/index/radar_data"
    //   const websocket = new WebSocket(payload)
    //   websocket.onopen = () => {
    //     console.log('line  websocket连接成功', websocket)
    //     commit('setLineWebsocket', websocket)
    //   }
    // },
    // deleteDefenceX: ({ commit }, payload) => {
    //   console.log('进入x', payload)
    //   return deleteDefenceAPI(payload).then((res) => res)
    // }
  }
}

export default index
