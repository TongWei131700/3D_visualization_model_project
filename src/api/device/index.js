import request from '@/utils/request'

/**
 * 获取当前所有设备
 * @param {*} info
 * @returns
 */
export function apiGetDevice(info) {
  return request.get(`${info}`)
}

/**
 *
 * @param sn
 * @version 2.0
 * 删除雷达和相机
 */
export function deleteRadar(sn) {
  return request({
    url: `/sys/radarDevice/deleteRadar?radarSn=${sn}`,
    method: 'delete'
  })
}

export function deleteSensor(param) {
  return request({
    url: '/sys/sensorDevice/deleteSensor',
    method: 'delete',
    params: param
  })
}

export function deleteCamera(sn) {
  return request({
    url: `/camera/deleteCamera/?cameraSn=${sn}`,
    method: 'delete'
  })
}

/**
 * @author Lyc
 * @param device
 * @param position
 * 新增雷达/球机/枪机
 */
export function createRadar(device, position, groupId, deviceName, pitchAngle, horizontalAngle, floor, radarFrequency, radarTrailRotation) {
  // pole) {
  return request({
    url: '/sys/radarDevice/addRadar',
    method: 'post',
    data: {
      location: device.location,
      radarHigh: device.radarHigh,
      radarIp: device.radarIp,
      radarMapX: position.x,
      radarMapY: position.y,
      radarMapZ: position.z,
      radarOnOff: device.radarOnOff,
      radarOnline: device.radarOnline,
      groupId,
      radarName: deviceName,
      radarHorizontalAngle: horizontalAngle,
      radarPitchAngle: pitchAngle,
      radarTrailRotation: radarTrailRotation,
      floor,
      radarFrequency
    }
  })
}

/**
 * 新增传感器
 * @param param
 * @returns {*}
 */
export function createSensor(param) {
  return request({
    url: '/sys/sensorDevice/addSensor',
    method: 'post',
    data: param
  })
}

export function createCamera(device, position, groupId, deviceName, pitchAngle, horizontalAngle, floor, kind, cameraIp) {
  return request({
    url: '/camera/addCamera',
    method: 'post',
    data: {
      cameraHigh: device.cameraHigh,
      cameraIp: cameraIp,
      cameraMapX: position.x,
      cameraMapY: position.y,
      cameraMapZ: position.z,
      cameraOnOff: device.cameraOnOff,
      cameraOnline: device.cameraOnline,
      cameraHorizontalAngle: horizontalAngle,
      cameraPitchAngle: pitchAngle,
      location: device.location,
      streamUrl: device.streamUrl,
      videoUrl: device.videoUrl,
      groupId,
      cameraName: deviceName,
      floor,
      kind
    }
  })
}

/**
 * @author Lyc
 * @param device
 * @param position
 * @returns
 * 新增报警器，暂时没用
 */
export function createWarningLight(device, position) {
  // pole) {
  return request({
    url: '/sys/device_others/insertRecord',
    method: 'post',
    data: {
      deviceIp: device.deviceIp,
      deviceName: device.deviceName,
      deviceOnOff: device.deviceOnOff,
      deviceSn: device.deviceSn,
      deviceType: device.deviceType,
      // monitorName: pole.monitorName
      position: position
    }
  })
}

/**
 *
 */
export function getCaremaByFloor(params) {
  return request({
    url: '/device/camera/getCaremaByFloor',
    method: 'post',
    data: params
  })
}

/**
 * 获取所有创建的传感器设备
 * @param params
 * @returns {*}
 */
export function getAllSensorDevices() {
  return request({
    url: '/sys/sensorDevice/allSensorDevices',
    method: 'get'
  })
}

/**
 * 获取所有设备的在线离线状态
 */
export function getAllDeviceStatusApi() {
  return request({
    url: '/sys/info/getAllDeviceStatus',
    method: 'get'
  })
}
