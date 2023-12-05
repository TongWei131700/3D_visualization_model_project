import { getMonitorList, getAlarmList, readSomeMessages } from '@/api/alarm'
import { FormatTime } from '@/utils/timeUtils'

const alarm = {
    namespaced: true,
    state: {
        // 哨兵组列表
        monitorList: [],
        // 报警列表
        alarmList: [],
        // 报警列表分页配置
        alarmPageConfig: {
            total: 0,
            pageSize: 0,
            currentPage: 1,
            pages: 0,
            pageSizes: [8],
            layout: 'total,pager,prev, next'
        }
    },
    mutations: {
        SET_MONITOR_LIST: (state, monitorList) => {
            state.monitorList = monitorList
        },
        SET_ALARM_LIST: (state, alarmList) => {
            state.alarmList = alarmList
        },
        SET_PAGE_CONFIG: (state, pageConfig) => {
            Object.assign(state.alarmPageConfig, pageConfig)
        },
        SET_ALARM_READ_STATUS: (state, alarmIds) => {
            const map = new Map()
            state.alarmList.forEach((item, index) => {
                map.set(item.alarmId, index)
            })
            alarmIds.forEach((item) => {
                state.alarmList[map.get(item)].alarmDealStatus = 0
            })
        }
    },
    actions: {
        /** 请求数据库获得哨兵组列表
         * @author Mzy
         * @return Promise<T>
         */
        getMonitorListByActions: ({ commit }) => new Promise((resolve, reject) => {
            getMonitorList().then(res => {
                const monitorList = res.data
                commit('SET_MONITOR_LIST', monitorList)
                resolve(res)
            }).catch(error => {
                reject(new Error(error))
            })
        }),
        /** 请求数据库获得指定类型报警列表和分页配置
         * @author Mzy
         * @payload {  curPage, pageSize, status, monitorId, startTime, endTime }
         * @return Promise<T>
         */
        getAlarmListByActions: ({ commit }, payload) => new Promise((resolve, reject) => {
            getAlarmList(payload).then((res) => {
                console.log("getAlarmList", res);
                const alarmList = res.data.records.map((item) => {
                    // 时间格式化
                    item.alarmTime = FormatTime(item.alarmTime, 'yyyy-MM-dd hh:mm:ss')
                    return item
                })
                commit('SET_ALARM_LIST', alarmList)
                const pageConfig = {
                    total: res.data.total,
                    pageSize: res.data.size,
                    currentPage: res.data.current,
                    pages: res.data.pages
                }
                commit('SET_PAGE_CONFIG', pageConfig)
                resolve(res)
            }).catch(error => {
                reject(new Error(error))
            })
        }),
        readSomeMessagesByActions: ({ commit }, alarmIds) => new Promise((resolve, reject) => {
            readSomeMessages(alarmIds).then(res => {
                commit('SET_ALARM_READ_STATUS', alarmIds)
                resolve(res)
            }).catch(error => {
                reject(new Error(error))
            })
        })
    },
    getters: {
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
        alarmList: (state) => state.alarmList,
        alarmPageConfig: (state) => state.alarmPageConfig
    }
}

export default alarm