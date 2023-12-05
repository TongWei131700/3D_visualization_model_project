const DEVICE = {
  POLE: 'pole',
  // 球机
  BALL_HEAD_CAMERA: 'ballHeadCamera',
  // 枪机
  GUN_CAMERA: 'gunCamera',
  // 报警器
  WARNING_LIGHT: 'warningLight',
  // 雷达
  RADAR: 'radar',
  SENSOR: 'sensor',// 传感器
  SMOKE_SENSATION: 'smokeSensation',
  FIRE: 'fire',
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity'
}
const DEVICE_CODE = {
  [DEVICE.RADAR]: 1,
  [DEVICE.BALL_HEAD_CAMERA]: 2,
  [DEVICE.GUN_CAMERA]: 3,
  [DEVICE.WARNING_LIGHT]: 4,
  RECOGNITION: 5,
  [DEVICE.POLE]: 10,
[DEVICE.SENSOR]: 6
}
const defaultFormShow = {
  deviceName: {isShow: true},
  deviceType: {isShow: true},
  deviceSn: {isShow: true},
  deviceIp: {isShow: true},
  ptzSn: {isShow: true},
  monitorName: {isShow: true},
  deviceHigh: {isShow: true},
  deviceRotation: {isShow: true},
  deviceSelfRotation: {isShow: true},
  deviceOnOff: {isShow: true}
}
// 之前版本
// const DEVICE_INFO = [
//   {
//     key: DEVICE.BALL_HEAD_CAMERA,
//     name: '球机',
//     formShow: {
//       ...defaultFormShow,
//       ptzSn: {isShow: false}
//     }
//   },
//   {
//     key: DEVICE.GUN_CAMERA,
//     name: '枪机',
//     formShow: {
//       ...defaultFormShow,
//       ptzSn: {
//         isShow: false
//       }
//     }
//   },
//   {
//     key: DEVICE.WARNING_LIGHT,
//     name: '报警器',
//     formShow: {
//       ...defaultFormShow,
//       ptzSn: {isShow: false},
//       deviceHigh: {isShow: false},
//       deviceRotation: {isShow: false},
//       deviceSelfRotation: {isShow: false},
//       deviceOnOff: {isShow: false}
//     }
//   },
//   {
//     key: DEVICE.RADAR,
//     name: '雷达',
//     formShow: {
//       ...defaultFormShow
//     }
//   }
// ]
// 之前版本结束

const DEVICE_INFO = [
  {
    key: DEVICE.RADAR,
    name: '77G雷达',
    formShow: {
      ...defaultFormShow
    }
  },
  {
    key: DEVICE.RADAR,
    name: '24G雷达',
    formShow: {
      ...defaultFormShow
    }
  },
  {
    key: DEVICE.SENSOR,
    name: '环境检测器',
    formShow: {
      ...defaultFormShow
    }
  },
  {
    key: DEVICE.BALL_HEAD_CAMERA,
    name: '球机',
    formShow: {
      ...defaultFormShow
    }
  }
]

const FORM_MONITOR = {
  monitorName: '',
  monitorLocation: '',
  monitorOnOff: '0',
  monitorMapX: '',
  monitorMapY: '',
  monitorMapZ: ''
}
const FORM_RADAR = {
  radarHigh: 1.0,
  radarPortraitAngle: 1.0,
  radarOnOff: 'on',
  radarOnline: 'online',
  radarIp: '10.19.12.11',
  location: 'NULL'
}
const FORM_CAMERA = {
  cameraHigh: 0,
  cameraIp: '10.19.12.11',
  cameraOnOff: 'on',
  cameraOnline: 'online',
  cameraPortraitAngle: 0,
  location: 'NULL',
  streamUrl: 'NULL',
  videoUrl: 'NULL'
}

const FORM_DEVICE = {
  deviceType: -1,
  deviceName: '',
  deviceSn: '',
  monitorName: '',
  deviceHigh: 0,
  deviceRotation: 0,
  deviceSelfRotation: 0,
  deviceIp: '',
  deviceOnOff: '0',
  deviceStatus: '',
  ptzSn: ''
}

/**
 * 通过设备的name,获取设备的key
 * @returns {Map<any, any>}
 * @constructor
 */
function DEVICE_MAP() {
  const deviceMap = new Map()
  DEVICE_INFO.forEach((value) => {
    deviceMap.set(value.name, value.key)
  })
  return deviceMap
}

/**
 * 通过设备的key获取设备的name
 * @returns {Map<any, any>}
 * @constructor
 */
function DEVICE_MAP_NAME() {
  const deviceMap = new Map()
  DEVICE_INFO.forEach((value) => {
    deviceMap.set(value.key, value.name)
  })
  return deviceMap
}

export {
  DEVICE,
  DEVICE_INFO,
  DEVICE_MAP,
  DEVICE_MAP_NAME,
  FORM_MONITOR,
  FORM_DEVICE,
  DEVICE_CODE,
  FORM_RADAR,
  FORM_CAMERA
}
