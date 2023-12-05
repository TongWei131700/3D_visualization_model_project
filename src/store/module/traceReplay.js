import {
  getGroupMonitorList,
  getMonitorList,
  getTrailOneWeek,
  getTrailPoints,
  getTrailPointsNew
} from '@/api/traceReplay'
import {Message} from 'element-ui'

const TraceReplay = {
  namespaced: true,
  state: {
    // 哨兵组列表
    monitorList: [],
    // 一周内轨迹数量统计
    trailOneWeekData: null,
    // 轨迹点信息
    trailPoints: null,
    // 轨迹点分页信息
    pagination: null,
    // 没有轨迹点的原因描述
    noItemDescription: '该时间段暂无轨迹回放',
    // 表单保存的开始结束时间 以便list中访问
    startTimeAndEndTime: null,
    groupId: 1,
    floor: null,
    trailPointsInfo: [], // 存储某个时间段内所有有关轨迹点的信息
    trailLineName: [],//存储轨迹线的名称
    trailImgName: [], //存储人物头像的名称
    interValClock: null,// 存储定时器
    checkWarningInfo: {}, // 存储报警管理中的报警信息
    existPeopleImage: [] // 存储首页创建的人物tid，方便遍历这个数组，删掉对象
  },
  mutations: {
    SET_MONITOR_LIST: (state, monitorList) => {
      state.monitorList = monitorList
    },
    updateTrailOneWeekByMutations(state, payload) {
      state.trailOneWeekData = payload
    },
    updateTrailPointsByMutations(state, payload) {
      if (payload.total === 0) {
        state.pagination = {
          total: 0,
          pageSize: 4,
          currentPage: 1
        }
        state.trailPoints = []
        state.noItemDescription = '该时间段暂无轨迹回放'
      } else {
        state.pagination = {
          total: payload.total,
          pageSize: payload.size,
          currentPage: payload.current + 1
        }
        state.trailPoints = payload
      }
    },
    updateNoItemDescription(state, payload) {
      state.noItemDescription = payload
    },
    updateStartTimeAndEndTime(state, payload) {
      state.startTimeAndEndTime = {
        startTime: payload.startTime,
        endTime: payload.endTime
      }
    },
    SET_GROUP_ID(state, groupId) {
      state.groupId = groupId
    },
    updateFloor(state, payload) {
      state.floor = payload
    },
    updateTrailPointsInfo(state, payload) {
      state.trailPointsInfo = payload
    },
    updateCheckWarningInfo(state, payload) {
      state.checkWarningInfo = payload
    }
  },
  actions: {
    /** 请求数据库获得哨兵组列表
     * @author Mzy
     * @return Promise<T>
     */
    getGroupMonitorListByActions: ({commit}) => new Promise((resolve, reject) => {
      getGroupMonitorList().then(res => {
        const monitorList = res.data
        console.log(res, '请求到的数据')
        commit('SET_MONITOR_LIST', monitorList)
        resolve(res)
      }).catch(error => {
        reject(new Error(error))
      })
    }),
    /** 根据楼层请求数据库获得哨兵组列表
     * @author Mzy
     * @return Promise<T>
     */
    getMonitorListByActions: ({commit}, payload) => new Promise((resolve, reject) => {
      getMonitorList(payload).then(res => {
        const monitorList = res.data
        console.log(res, '请求到的数据')
        commit('SET_MONITOR_LIST', monitorList)
        resolve(res)
      }).catch(error => {
        reject(new Error(error))
      })
    }),
    getTrailOneWeekByActions: ({commit}, payload) => new Promise((resolve, reject) => {
      console.log(payload, 55555)
      getTrailOneWeek(payload).then((res) => {
        const trailOneWeek = res.data
        commit('updateTrailOneWeekByMutations', trailOneWeek)
        console.log('一周信息0,11111111', res.data, payload)
        resolve(res.data)
      }).catch((error) => {
        reject(error)
      })
    }),
    getTrailPointsByActions: ({commit}, payload) => new Promise((resolve, reject) => {
      commit('updateNoItemDescription', '内容正在获取,请稍候...')
      getTrailPoints(payload).then((res) => {
        const trailPoints = res.data
        commit('updateTrailPointsByMutations', trailPoints)
        resolve(res.data)
      }).catch((error) => {
        reject(error)
      })
    }),
    setFloor({commit}, payload) {
      commit('updateFloor', payload)
    },
    /**
     * 通过请求，更新TrailPointsInfo的值
     * @param commit
     * @param payload
     * @returns {Promise<unknown>}
     */
    updateTrailPointsInfoByAction: ({commit}, payload) => new Promise((resolve, reject) => {
      getTrailPointsNew(payload).then((res) => {
        if (res.code == 200) {
          const pointsInfo = res.data
          if (!pointsInfo.length) {
            Message({
              message: '该时间端未捕获到雷达数据点！！',
              type: 'warning',
              offset: 70,
              duration: 2 * 1000
            })
          }
          commit('updateTrailPointsInfo', pointsInfo)
          resolve()
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  getters: {
    getFloor: (state) => state.floor,
    monitorList: (state) => state.monitorList.filter((item) => item.monitorId !== 0),
    monitorListMap: (state) => {
      const map = new Map()
      state.monitorList.forEach((item) => {
        if (item.monitorId !== 0) {
          map.set(item.monitorId, item.monitorName)
        }
      })
      return map
    },
    getTrailOneWeekData: (state) => state.trailOneWeekData,
    getTrailPointsData: (state) => state.trailPoints,
    getPagination: (state) => state.pagination,
    getNoItemDescription: (state) => state.noItemDescription,
    getStartTimeAndEndTime: (state) => state.startTimeAndEndTime,
    groupId: (state) => state.groupId,
    getTrailPointsInfo: (state) => state.trailPointsInfo,
    getCheckWarningInfo: (state) => state.checkWarningInfo
  }
}
export default TraceReplay
