const getters = {
  // avatar: state => state.user.avatar,
  // name: state => state.user.name,
  // introduction: state => state.user.introduction,
  // roles: state => state.user.roles,
  // permissions: state => state.user.permissions,
  // scene: state => state.models.scene,
  // onlyModels: state => state.models.onlyModels,

  // /**
  //  * rule->mix
  //  */
  // // 获取要展示的区域房间内容
  // rule_getguardshowlist: state => (cur, size) => {
  //   if (state.rule.guardList.hasOwnProperty(cur)) {
  //     return state.rule.guardList[cur];
  //   }
  //   return [];
  // },

  // // 获取区域总数
  // rule_getguardtotal: state => state.rule.totalGuardList,

  // // 获取某个区域内的雷达详情【用于数据展示】
  // rule_getshowguardradar: state => (groupName) => {
  //   let radarList = []
  //   if (state.rule.guardRadar.hasOwnProperty(groupName)) {
  //     state.rule.guardRadar[groupName].forEach((radar) => {
  //       let radarItem = Object.assign(deepCopy(radar.radarRule), deepCopy(radar.radarDevice))
  //       radarList.push(radarItem)
  //     })
  //   }
  //   return radarList;
  // },

  // // 获取某个哨兵组的雷达详情【用于数据交互】
  // rule_getinteractguardradar: state => (groupName) => {
  //   let radarList = [];
  //   if (state.rule.guardRadar.hasOwnProperty(groupName)) {
  //     state.rule.guardRadar[groupName].forEach((radar) => {
  //       radarList.push(radar.radarRule)
  //     })
  //   }
  //   return radarList;
  // },

  // // 获取物体识别列表
  // rule_getrecognize: state => {
  //   return state.rule.recognizeList;
  // },
  // /**
  //  * rule->radar
  //  */
  // // 获取要展示的雷达列表
  // rule_getradarshowlist: state => (cur, size) => {
  //   if (state.rule.radarList.hasOwnProperty(cur)) {
  //     return state.rule.radarList[cur];
  //   }
  //   return [];
  // },
  // // 获取雷达总数
  // rule_getradartotal: state => state.rule.totalRadarList,
  // // 根据sn号获取对应的雷达的规则
  // rule_getRadarRuleByRadarSn: state => (sn) => {
  //   if (state.rule.radarListRule.hasOwnProperty(sn)) {
  //     return state.rule.radarListRule[sn]
  //   }
  //   return null;
  // },

  // /**
  //  * device-list: 设备列表管理
  //  */
  // // 根据页码获取哨兵组信息[cur:当前页数，size：当前页的容器]
  // deviceList_getGuardInfoList: state => (cur, size) => {
  //   let start = (cur - 1) * size;
  //   let end = cur * size > state.deviceList.guardInfoList.length ? state.deviceList.guardInfoList.length : cur * size;
  //   let result = []
  //   if (0 != state.deviceList.guardInfoList.length && (state.deviceList.guardInfoList[start] instanceof Object)) {
  //     for (; start < end; start++) {
  //       result.push(state.deviceList.guardInfoList[start])
  //     }
  //   }
  //   return result;
  // },
  // // 获取区域内总数
  // deviceList_getGuardInfoListLength: state => state.deviceList.guardInfoListLength,
  // // 获取区域中的设备
  // deviceList_getGuardDevices: state => (monitorName) => {
  //   if (state.deviceList.guardOfDevices.hasOwnProperty(monitorName)) {
  //     return state.deviceList.guardOfDevices[monitorName];
  //   }
  //   return null;
  // },

  // // 获取当前仓库中的雷达
  // deviceList_getAllRadar: state => (cur, size) => {
  //   let start = (cur - 1) * size;
  //   let end = cur * size > state.deviceList.radarInfoList.length ? state.deviceList.radarInfoList.length : cur * size;
  //   let result = []
  //   if (0 != state.deviceList.radarInfoList.length && (state.deviceList.radarInfoList[start] instanceof Object)) {
  //     for (; start < end; start++) {
  //       result.push(state.deviceList.radarInfoList[start])
  //     }
  //   }
  //   return result;
  // },
  // // 获取雷达总数
  // deviceList_getRadarTotal: state => state.deviceList.radarInfoListLength,
  // // 获取当前仓库中的报警器
  // deviceList_getAllAlarmDevice: state => (cur, size) => {
  //   let start = (cur - 1) * size;
  //   let end = cur * size > state.deviceList.alarmDeviceInfoList.length ? state.deviceList.alarmDeviceInfoList.length : cur * size;
  //   let result = []
  //   if (0 != state.deviceList.alarmDeviceInfoList.length && (state.deviceList.alarmDeviceInfoList[start] instanceof Object)) {
  //     for (; start < end; start++) {
  //       result.push(state.deviceList.alarmDeviceInfoList[start])
  //     }
  //   }
  //   return result;
  // },
  // // 获取报警器总数
  // deviceList_getAlarmDeviceTotal: state => state.deviceList.alarmDeviceInfoListLength,
  // // 获取当前仓库中的报警主机
  // deviceList_getAllAlarmHost: state => (cur, size) => {
  //   let start = (cur - 1) * size;
  //   let end = cur * size > state.deviceList.alarmHostInfoList.length ? state.deviceList.alarmHostInfoList.length : cur * size;
  //   let result = []
  //   if (0 != state.deviceList.alarmHostInfoList.length && (state.deviceList.alarmHostInfoList[start] instanceof Object)) {
  //     for (; start < end; start++) {
  //       result.push(state.deviceList.alarmHostInfoList[start])
  //     }
  //   }
  //   return result;
  // },
  // // 获取报警主机总数
  // deviceList_getAlarmHostTotal: state => state.deviceList.alarmHostInfoListLength,

  // /**
  //  * alarm：报警列表
  //  */
  // // 获取报警列表信息
  // alarm_getAlarmInfoList: state => (cur, size) => {
  //   let start = (cur - 1) * size;
  //   let end = cur * size > state.alarm.alarmInfoList.length ? state.alarm.alarmInfoList.length : cur * size;
  //   let result = []
  //   if (0 != state.alarm.alarmInfoList.length && (state.alarm.alarmInfoList[start] instanceof Object)) {
  //     for (; start < end; start++) {
  //       result.push(state.alarm.alarmInfoList[start])
  //     }
  //   }
  //   return result;
  // },
  // // 获取报警列表的长度
  // alarm_getAlarmInfoListLength: state => state.alarm.alarmInfoListLength,
  // // 根据设备sn获取设备名
  // alarm_getDeviceNameByDeviceSn: state => (sn) => {
  //   if (state.alarm.deviceSn2DeviceName.hasOwnProperty(sn)) {
  //     return state.alarm.deviceSn2DeviceName[sn]
  //   }
  //   return null
  // },

  modelX: state => state.modelinfo.modelX
}
export default getters
