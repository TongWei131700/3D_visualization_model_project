import {
  getAllMonitorGroupInfo,
  getAllMonitorGroupId,
  getAllMonitorGroupIdName
} from '@/api/rule/RuleConfig'
import {FormatTime} from '@/utils/utils'

const RuleConfig = {
  namespaced: true,
  state: {
    // 所有哨兵组以及规则信息
    monitorList: [],
    // 搜索哨兵组以及规则信息
    groupList: [],
    // 所有哨兵组信息
    groupIdName: [],
    // 是否添加新的通知方式
    contactFormVisible: false
  },
  mutations: {
    /**
     * 更新state中所有哨兵组以及规则信息
     * @author wj
     */
    updateAllMonitorGroupIdNameLocationByMutations(state, payload) {
      state.monitorList = payload
    },

    /**
     * 更新state中搜索哨兵组以及规则信息
     * @author wj
     */
    updateAllMonitorGroupIdByMutations(state, payload) {
      state.groupList = payload
    },

    /**
     * 更新state中所有哨兵组信息
     * @author wj
     */
    updateAllMonitorGroupIdNameByMutations(state, payload) {
      state.groupIdName = payload
    },
    updateContactFormVisible(state, payload) {
      state.contactFormVisible = payload
    }
  },
  actions: {
    /**
     * 获得所有哨兵组以及规则信息
     * @author wj
     */
    getAllMonitorGroupIdNameLocationByActions: ({commit}) => new Promise((resolve, reject) => {
      getAllMonitorGroupInfo().then((res) => {
        const monitorList = res.data
        const monitorLists = []
        for (const i in monitorList) {
          monitorLists.push(Object.assign(monitorList[i].group, monitorList[i].alarmTimes))
        }
        commit('updateAllMonitorGroupIdNameLocationByMutations', monitorLists)
        resolve(res)
      }).catch((error) => {
        reject(error)
      })
    }),

    /**
     * 获得搜索哨兵组以及规则信息
     * @author wj
     */
    getAllMonitorGroupIdByActions: ({commit}) => new Promise((resolve, reject) => {
      getAllMonitorGroupId().then((res) => {
        const groupList = res.data
        const groupLists = []
        for (const i in groupList) {
          groupLists.push(Object.assign(groupList[i].group, groupList[i].alarmTimes))
        }
        commit('updateAllMonitorGroupIdByMutations', groupLists)
        resolve(res)
      }).catch((error) => {
        reject(error)
      })
    }),

    /**
     * 获得所有哨兵组信息
     * @author wj
     */
    getAllMonitorGroupIdNameByActions: ({commit}) => new Promise((resolve, reject) => {
      getAllMonitorGroupIdName().then((res) => {
        const monitorList = res.data
        commit('updateAllMonitorGroupIdNameByMutations', monitorList)
        resolve(res)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  getters: {
    // 所有规则
    getMonitorList: (state) => {
      const monitorGroupRule = []
      state.monitorList.forEach((monitorRule) => {
        /* 报警日期处理*/
        const monitorAlarmDate = []
        monitorAlarmDate.push(FormatTime(new Date(monitorRule.startTime), 'yyyy-MM-dd hh:mm:ss'))
        monitorAlarmDate.push(FormatTime(new Date(monitorRule.endTime), 'yyyy-MM-dd hh:mm:ss'))
        /* 报警时间处理*/
        const monitorAlarmTime = []
        monitorAlarmTime.push(monitorRule.alarmSt)
        monitorAlarmTime.push(monitorRule.alarmEt)
        /* 时间类型处理*/
        let dateType = ''
        switch (monitorRule.dateType) {
          case 0:
            dateType = '工作日';
            break
          case 1:
            dateType = '周末';
            break
          case 2:
            dateType = '节假日';
            break
        }
        /* 封装表格显示数据*/
        const ruleObject = {
          groupId: monitorRule.groupId,
          groupName: monitorRule.groupName,
          monitorAlarmDate: monitorAlarmDate,
          monitorAlarmTime: monitorAlarmTime,
          dateType: dateType,
          alarmInterval: monitorRule.alarmInterval,
          recordInterval: monitorRule.recordInterval,
          acoustoopicOnOff: monitorRule.acoustoopicOnOff,
          recorderOnOff: monitorRule.recorderOnOff,
          photographOnOff: monitorRule.photographOnOff,
          groupOnOff: monitorRule.groupOnOff,
          timeId: monitorRule.timeId
        }
        monitorGroupRule.push(ruleObject)
      })
      console.log(monitorGroupRule)
      return monitorGroupRule
    },
    // 搜索所有规则
    getGroupList: (state) => state.groupList,
    // 所有哨兵组信息
    getGroupIdName: (state) => state.groupIdName,
    getContactFormVisible: (state) => state.contactFormVisible
  }
}
export default RuleConfig
