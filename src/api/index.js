import request from '@/utils/request'

/**
 * 获取今日报警处理数
 * @author Mzy
 */
export function getTodayUndoneOrDone() {
  return request({
    url: '/sys/alarm-message/todayUndoOrDone',
    method: 'get'
  })
}

/**
 * 获取主页最新6条报警信息列表
 * @param {Object} param
 * @author Mzy
 */
export function getAlarmList(params) {
  return request({
    url: 'sys/alarm-message/getAlarmMessage/ByCondition',
    method: 'get',
    params
  })
}

/**
 * 获取主页雷达在线状态
 * @author Mzy
 */
export function getAllRadarStatus() {
  return request({
    url: 'sys/radarDevice/getAllRadarStatus',
    method: 'get'
  })
}

/**
 * 获取主页雷达在线状态
 * @author Mzy
 */
export function getAllRadarDevices() {
  return request({
    url: 'sys/radarDevice/getAllRadarDevices',
    method: 'get'
  })
}

/**
 * 获取主页实时轨迹webSocket地址
 * @author Mzy
 */
export function getRealtimeTraceWebsocketAddr() {
  return request({
    url: 'sys/webSocketAddress/trackAddr',
    method: 'get'
  })
}

/**
 * 获取主页报警列表webSocket地址
 * @author Mzy
 */
export function getAlarmWebsocketAddr() {
  return request({
    url: 'sys/webSocketAddress/alarmMesgAddr',
    method: 'get'
  })
}

/**
 * 获取主页雷达活动人数统计webSocket地址
 * @author Mzy
 */
export function getPeopleCountingWebsocketAddr() {
  return request({
    url: 'sys/webSocketAddress/peopleCountAddr',
    method: 'get'
  })
}

/**
 * 获取主页雷达状态webSocket地址
 * @author wj
 */
export function getRadarOnlineAddr() {
  return request({
    url: 'sys/webSocketAddress/radarOnlineAddr',
    method: 'get'
  })
}

/**
 * 首页分层发送请求
 * @author Lyc
 */
export function sendFloorLevel(params) {
  return request({
    url: `sys/trail-point/updateFloor?floor=${params}`,
    method: 'get'
  })
}

/**
 * 获取传感器数据的地址
 */
export function getSensorDataAdd() {
  return request({
    url: `/sys/webSocketAddress/sensorDataAddr `,
  })
}
