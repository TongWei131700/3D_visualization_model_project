import {createWarningLight, createCamera, createRadar, deleteRadar, deleteCamera, deleteSensor, createSensor} from '../../api/device'
import * as types from '../mutation-types'
import {FORM_RADAR, FORM_CAMERA, FORM_DEVICE} from '../config'
import {getMonitorList} from '@/api/alarm'

const store = {
  namespaced: true,
  state: {
    // 哨兵组列表
    monitorList: [],
    // 枪机列表
    poleInfos: [],
    devices: [],
    devicesOthers: [],
    // 添加设备杆表单信息
    formMonitor: {},
    // 添加设备表单信息
    formDevice: {},
    // 添加雷达表单信息
    formRadar: {},
    // 添加摄像机
    formCamera: {},
    deviceOptionVisible: false,
    currentStep: 1,
    selectedDevice: '球机',
    // 当前设备模型对象
    currentDevice: null,
    // 对表单的操作类型
    deviceFormType: 'add',
    // 保存双击的位置
    doublePosition: {},
    allDeviceStatus: {},// 保存创建的设备所有状态
    selectDeviceName: '77G雷达'// 保存查询不同设备的名称
  },
  mutations: {
    // 在这里修改双击位置的信息
    setDoublePosition: (state, param) => {
      state.doublePosition = param
    },
    SET_MONITOR_LIST: (state, monitorList) => {
      state.monitorList = monitorList
    },
    setFormMonitor(state, poleForm) {
      // Object.assign(state.formMonitor, poleForm);
      state.formMonitor = poleForm
    },
    setFormDevice(state, device) {
      // Object.assign(state.formDevice, device);
      state.formDevice = device
    },
    setFormRadar(state, device) {
      // Object.assign(state.formDevice, device);
      state.formRadar = device
    },
    setFormCamera(state, device) {
      state.formCamera = device
    },
    setAllDeviceStatus: (state, payload) => {
      state.allDeviceStatus = payload
    },
    // 自动的吗??
    [types.INIT_ALL_MODELS](state, payload) {
      state.devices = payload
    },
    [types.INIT_ALL_MODELS_OTHERS](state, payload) {
      state.devicesOthers = payload
    },

    SET_DEVICE_OPTION_VISIBLE: (state, visible) => {
      state.deviceOptionVisible = visible
    },
    SET_CURRENT_STEP: (state, step) => {
      state.currentStep = step
    },
    SET_SELECTED_DEVICE: (state, device) => {
      state.selectedDevice = device
    },
    SET_CURRENT_DEVICE: (state, device) => {
      state.currentDevice = device
      console.log(device, state.currentDevice, 'vuex判断是否改变')
    },
    SET_TYPE: (state, type) => {
      state.deviceFormType = type
    },
    setSelectDeviceName: (state, payload) => {
      state.selectDeviceName = payload
    }
  },
  actions: {
    /** 请求数据库获得哨兵组列表
     * @author Mzy
     * @return Promise<T>
     */
    getMonitorListByActions: ({commit}) => new Promise((resolve, reject) => {
      getMonitorList().then(res => {
        const monitorList = res.data
        commit('SET_MONITOR_LIST', monitorList)
        resolve(res)
      }).catch(error => {
        reject(new Error(error))
      })
    }),
    /**
     * @author Lyc
     * @param commit
     * @param state
     * @param deviceKey 区分报警器和(雷达，球机，枪机)
     * 保存设备信息到数据库
     */
    saveDeviceInfo({
                     commit,
                     state
                   }, payload) {
      console.log(state.currentDevice, state.currentDevice.position, payload.deviceKey)
      let postion = JSON.parse(JSON.stringify(state.currentDevice.position))
      console.log(state.currentDevice, payload, "kkkkkkkkkkkkkkkk")
      // if(state.currentDevice.floor==24||state.currentDevice.floor=="24F"){
      //   if(postion.y>-5){
      //     postion.y-=8
      //   }
      // }
      // if(state.currentDevice.floor==26||state.currentDevice.floor=="26F"){
      //   if(postion.y<1){
      //     postion.y+=8
      //   }
      // }
      console.log(postion, ":LLLLLLLLLLLLLL")
      switch (payload.deviceKey) {
        case 'ballHeadCamera':
          commit('setFormCamera', FORM_CAMERA)
          console.log('添加球机')
          return createCamera(state.formDevice, postion, payload.groupId, payload.deviceName, payload.pitchAngle, payload.horizontalAngle, payload.floor, 'ptz', payload.cameraIp).then(res => {
            console.log(res, 'qingqiude 111')
            return res
          })
        case 'gunCamera':
          commit('setFormCamera', FORM_CAMERA)
          console.log('添加枪机')
          return createCamera(state.formDevice, postion, payload.groupId, payload.deviceName, payload.pitchAngle, payload.horizontalAngle, payload.floor, 'bolt', payload.cameraIp).then(
            res => {
              console.log(res, 'qingqiude 111')
              return res
            })
        case 'warningLight':
          commit('setFormDevice', FORM_DEVICE)
          console.log('添加报警灯')
          return createWarningLight(state.formDevice, postion).then(res => {
            return res
          })
        case 'radar':
          commit('setFormRadar', FORM_RADAR)
          console.log('添加雷达')
          // postion.y = -2.6588100771469154
          if (!payload.deviceName) payload.deviceName = ''
          return createRadar(state.formDevice, postion, payload.groupId, payload.deviceName, payload.pitchAngle, payload.horizontalAngle, payload.floor, payload.radarFrequency,payload.radarTrailRotation).then(res => {
            console.log(res, 'qingqiude 111')
            return res
          })
        case 'sensor':
          if (!payload.deviceName) payload.deviceName = ''
          let sensorParam = {}
          sensorParam.floor = payload.floor
          sensorParam.groupId = payload.groupId
          sensorParam.sensorMapX = postion.x
          sensorParam.sensorMapY = postion.y
          sensorParam.sensorMapZ = postion.z
          sensorParam.sensorName = payload.deviceName
          sensorParam.sensorAngle = payload.horizontalAngle
          sensorParam.sensorPortraitAngle = payload.pitchAngle
          sensorParam.sensorName = payload.deviceName
          return createSensor(sensorParam).then(res => {
            return res
          })
      }
    },

    /**
     * @author Lyc
     * @param state
     * @returns {*}
     * 删除设备
     */
    deleteDeviceInfo({state}) {
      if (state.currentDevice.name === 'ballHeadCamera' || state.currentDevice.name === 'gunCamera') {
        console.log('删除相机机', state.currentDevice.deviceSn)
        return deleteCamera(state.currentDevice.deviceSn).then(res => {
          return res
        })
      }
      if (state.currentDevice.name === 'radar') {
        console.log('删除雷达', state.currentDevice.deviceSn)
        return deleteRadar(state.currentDevice.deviceSn).then(res => {
          return res
        })
      }
      if (state.currentDevice.name === 'sensor') {
        let sendParam = {}
        sendParam.sensorSn = state.currentDevice.deviceSn
        return deleteSensor(sendParam).then(res => {
          return res
        })
      }
    }

  },
  getters: {
    monitorList: (state) => state.monitorList,
    monitorListMap: (state) => {
      const map = new Map()
      state.monitorList.forEach((item) => {
        if (item.monitorId !== 0) {
          map.set(item.monitorId, item.monitorName)
        }
      })
      return map
    },
    getFormType: (state) => state.deviceFormType,
    getFormMonitor: (state) => state.formMonitor,
    getFormDevice: (state) => state.formDevice,
    getFormRadar: (state) => state.formRadar,
    getFormCamera: (state) => state.formCamera,
    getDeviceVisible: (state) => state.deviceOptionVisible,
    getCurrentStep: (state) => state.currentStep,
    getSelectedDevice: (state) => state.selectedDevice,
    getCurrentDevice: (state) => state.currentDevice,
    //  这里获取双击位置的信息
    getDoublePosition: (state) => state.doublePosition,
    getAllDeviceStatus: (state) => state.allDeviceStatus,
    getSelectDeviceName: (state) => state.selectDeviceName
  }
}

export default store
