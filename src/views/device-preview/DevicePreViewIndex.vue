<template>
  <div id="webglContainer" ref="webglContainer" @mouseup.right="onClickPole">
    <device-form
      :modelPositionParam="modelPositionParam"
      @cancelDevice="cancelDevice"
      @changeCardPosition="changeCardPosition"
      @changeDefencePosition="changeDefencePosition"
      @changeMapPosition="changeMapPosition"
      @changeModelPosition="changeModelPosition"
      @changeMonitor="changeMonitor"
      @changeRadarScale="changeRadarScale"
      @changeSensorScale="changeSensorScale"
      @initCameraLookAt="initCameraLookAt"
      @moveDeviceModel="moveDeviceModel"
      @saveDevice="saveDevice"
      @saveDeviceAngle="upDateDeviceAngle"
      @showSelectBuilding="showSelectBuilding"
    />
    <div :style="deviceOptionPosition" class="device-option">
      <option-card @addDeviceModel="addDeviceModel"/>
    </div>
    <div v-if="deviceDetailVisible" :style="deviceOptionPosition" class="device-detail">
      <device-detail :device-name="currentDeviceName" :models="models" @closeDeviceDetail="closeDeviceDetail"
                     @deleteDevice="deleteDevice"/>
    </div>
    <div class="floor-selector">
      <el-card class="device-form" shadow="hover">{{ viewPort }}</el-card>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'
import SelfModels from '../../components/models/SelfModels'
import DeviceForm from './DeviceForm'
import OptionCard from './OptionCard'
import DeviceDetail from './DeviceDetail'
import {DEVICE, DEVICE_MAP} from '../../store/config'
import {apiGetDevice, getCaremaByFloor} from '@/api/device/index'
import {getDefenceInfo, getVideoStream} from '@/api/device/BasicConfig'
import {setSession} from '@/utils/storage'
import * as THREE from 'three'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {LightShadow} from 'three'
import {getPeopleCountingWebsocketAddr} from '@/api/index'
import {MyWebsocketConnector} from '@/utils/myWebsocketConnector'
import {getAllRadarStatus} from '@/api/index'
import {floorSaveParam} from '@/api/setMap/setMap.js'
import {getFloorShot} from "../../api/setMap/setMap";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'DevicePreView',
  components: {
    DeviceForm,
    OptionCard,
    DeviceDetail
  },
  data() {
    return {
      // 装场景的容器
      container: {},
      models: null,
      polePosition: null,
      deviceVisible: false,
      deviceOptionVisible: true,
      deviceOptionPosition: {
        position: 'absolute',
        top: '200px',
        left: '500px'
      },
      mapOptionPosition: {
        position: 'absolute',
        top: '200px',
        left: '500px'
      },
      currentDeviceName: '球机',
      deviceDetailVisible: false,
      // 不应该被取消所删除的设备
      deviceArrays: [],
      // 判断当前创建的设备是否存在
      deviceistrue: null,

      websocketAddr: '',
      websocketConnector: null,
      radarList: null,

      // 视频卡片
      videoCardGroup: null,
      cameraPosition: {},
      // 每层楼的镜头参数信息
      modelPositionParam: {},
      viewPort: '地图视角',
      clickEvent: {}
    }
  },
  computed: {
    ...mapGetters('device', {
      formMonitor: 'getFormMonitor',
      formDevice: 'getFormDevice',
      getDeviceVisible: 'getDeviceVisible',
      // 当前设备
      currentDevice: 'getCurrentDevice',
      getSelectDevice: 'getSelectedDevice'
    }),
    ...mapGetters('models', {
      shareModels: 'getShareModels',
      getSelectFloorInfo: 'getSelectFloorInfo',
      getRadarCardPosition: 'getRadarCardPosition',
      getSaveTraceParam: 'getSaveTraceParam'
    }),
    ...mapGetters('setMap', {
      initMapInfo: 'getInitMapInfo'
    }),
    ...mapGetters('traceReplay', {
      floorlevel: 'getFloor'
    })
    // ...mapGetters("index", {
    //   arrayDefence: "getArrayDefence",
    // }),
  },
  watch: {
    shareModels: function (val) {
      console.log('haaaaaqaaaaaaa')
      // console.log(val, '初始化场景')
      // console.log(window.localStorage.getItem('infoMsg'))
      const initMapMsg = JSON.parse(window.localStorage.getItem('infoMsg'))
      // console.log(initMapMsg)
      if (this.models == null && val != null) {
        this.initSelfModels()
        // console.log(this.models, 7777777777777777)
      }
      // val.initPlane(this.initMapInfo);
      // console.log(this.shareModels, '=================')
      this.shareModels.initPlane(initMapMsg)
      // this.getDevice(this.getSelectedDevice)
      // this.getDefenceArea()
    },
    /**
     * 检测模型移动位置
     */
    polePosition: {
      handler: function (val) {
        const poleForm = {}
        Object.assign(poleForm, this.formMonitor)
        poleForm.monitorMapX = val.x.toFixed(4)
        poleForm.monitorMapY = val.y.toFixed(4)
        poleForm.monitorMapZ = val.z.toFixed(4)
        this.setFormMonitor(poleForm)
        console.log('click', this.formMonitor)
      },
      deep: true
    },
    models() {
      this.saveDevicePreviewSelfModel(this.models)
    }
  },
  methods: {
    ...mapActions('selfModelInfo', ['saveDevicePreviewSelfModel']),
    ...mapActions('device', ['initAllDeviceByPole', 'saveDeviceInfo', 'deletePoleInfo']),
    ...mapActions('setMap', ['initMap']),
    ...mapActions('models', ['initShareModels']),
    ...mapMutations('models', ['setShareModels', 'uploadSelectFloorInfo', 'uploadRadarCardShow', 'uploadSaveTraceParam', 'uploadRadarCardPosition']),
    ...mapMutations('device', {
      setFormMonitor: 'setFormMonitor',
      setFormDevice: 'setFormDevice',
      setDeviceOptionVisible: 'SET_DEVICE_OPTION_VISIBLE',
      setCurrentStep: 'SET_CURRENT_STEP',
      setCurrentDevice: 'SET_CURRENT_DEVICE',
      setDoublePosition: 'setDoublePosition'
    }),
    initSelfModels() {
      this.container = this.$refs['webglContainer']
      this.models = new SelfModels(this.container, this.shareModels)
      this.animation()
      this.container.addEventListener('dblclick', this.ondblClickInfo)
      this.container.addEventListener('click', this.onClickVideo)
      // this.container.addEventListener("mousemove", this.bigVideo);
      // this.lineGeometry = new THREE.BufferGeometry();
      // this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xbd10e0 });
      // this.line = new THREE.LineLoop(this.lineGeometry, this.lineMaterial);
      // this.models.scene.add(this.line);
    },
    // 请求设备
    getDevice(param) {
      apiGetDevice('/sys/group/listAll').then((res) => {
        console.log('--------------------------=============')
        console.log(res)
        // this.deviceList = res;
        const deviceList = []
        for (const group of res.data) {
          if (group.cameraDevices.length !== 0) {
            for (const groupDevice of group.cameraDevices) {
              groupDevice.deviceMapX = groupDevice.cameraMapX
              groupDevice.deviceMapY = groupDevice.cameraMapY
              groupDevice.deviceMapZ = groupDevice.cameraMapZ
              if (groupDevice.kind === 'ptz') {
                groupDevice.deviceType = 3
              } else {
                groupDevice.deviceType = 2
              }
              groupDevice.deviceSn = groupDevice.cameraSn
              deviceList.push(groupDevice)
            }
          }
          if (group.radarDevices.length !== 0) {
            for (const groupDevice of group.radarDevices) {
              groupDevice.deviceMapX = groupDevice.radarMapX
              groupDevice.deviceMapY = groupDevice.radarMapY
              groupDevice.deviceMapZ = groupDevice.radarMapZ
              groupDevice.deviceType = 1
              groupDevice.deviceSn = groupDevice.radarSn
              deviceList.push(groupDevice)
            }
          }
          if(group.sensorDevices.length !== 0) {
            for(const groupDevice of group.sensorDevices) {
              groupDevice.deviceMapX = groupDevice.sensorMapX
              groupDevice.deviceMapY = groupDevice.sensorMapY
              groupDevice.deviceMapZ = groupDevice.sensorMapZ
              groupDevice.deviceType = 4
              groupDevice.deviceSn = groupDevice.sensorSn
              deviceList.push(groupDevice)
            }
          }
        }
        this.initDevice(deviceList, param)
      })
    },
    // 初始化雷达、枪机、球机 ********li 2021/7/12
    initDevice(deviceList, floor) {
      // 关闭雷达卡片大小调节选项
      this.uploadRadarCardShow(false)
      const videoUrl = ''
      // const rotation = new THREE.Vector2(0, 0)
      this.radarList = []
      for (let i = 0; i < deviceList.length; i++) {
        const rotation = new THREE.Vector2(0, 0)
        const position = new THREE.Vector3(
          deviceList[i].deviceMapX,
          deviceList[i].deviceMapY,
          deviceList[i].deviceMapZ
        )
        if (deviceList[i].radarAngle || deviceList[i].radarPortraitAngle) {
          rotation.x = deviceList[i].radarAngle * Math.PI / 180
          rotation.y = deviceList[i].radarPortraitAngle * Math.PI / 180
          console.log('@@@@@@@@@@@@@@@@@@@')
          // 雷达没有videoUrl
          // videoUrl = '';
        } else if (deviceList[i].cameraAngle || deviceList[i].cameraPortraitAngle) {
          rotation.x = deviceList[i].cameraAngle * Math.PI / 180
          rotation.y = deviceList[i].cameraPortraitAngle * Math.PI / 180
          console.log('@@@@@@@@@@@@@@@@@@@')
          // videoUrl = deviceList[i].videoUrl;
        }else if (deviceList[i].sensorPortraitAngle || deviceList[i].sensorAngle) {
          rotation.x = deviceList[i].sensorAngle * Math.PI / 180
          rotation.y = deviceList[i].sensorPortraitAngle * Math.PI / 180
        }
        if (floor == deviceList[i].floor) {
          this.loadDevice(
            deviceList[i].deviceType,
            deviceList[i].deviceName,
            deviceList[i].deviceSn,
            position,
            rotation,
            deviceList[i].floor,
            deviceList[i].groupId,
            deviceList[i].videoUrl
          )
        }
        if(deviceList[i].deviceType == 1) this.radarList.push(deviceList[i])// 此处用于保存雷达卡片的雷达列表
        // this.radarList = deviceList
      }
    },
    // 初始化雷达、枪机、球机*********
    loadDevice(deviceType, deviceName, deviceSn, position, rotation, floor, groupId, videoUrl) {
      if (videoUrl) {
        console.log(videoUrl)
      }
      let url = ''

      switch (deviceType) {
        case 1:
          url = '/selfModels/other/radar/newRadar.fbx'
          deviceName = 'radar'
          this.uploadRadarCardShow(true)
          break
        case 3:
          url = '/selfModels/camera/qiuji/ball_camera1.fbx'
          deviceName = 'ballHeadCamera'
          break
        case 2:
          url = '/selfModels/camera/qiangji/camera.fbx'
          deviceName = 'gunCamera'
          break
        case 4:
          url = '/selfModels/other/radar/sensor.fbx'
          deviceName = 'sensor'
          break
        default:
          url = ''
      }
      // const deviceInfo = { deviceType, deviceName, deviceSn, position, rotation };
      const loader = new FBXLoader()
      return new Promise((resolve, reject) => {
        loader.load(
          url,
          (object) => {
            object.position.x = position.x
            object.position.y = position.y
            object.position.z = position.z
            object.rotation.y = rotation.x
            object.rotation.z = rotation.y
            if (deviceType === 2) {
              if (this.modelPositionParam.gunCameraLocalScale) {
                if (this.modelPositionParam.gunCameraLocalScale - 0.2 > 0) {
                  object.scale.setScalar(this.modelPositionParam.gunCameraLocalScale - 0.2)
                } else object.scale.setScalar(this.modelPositionParam.gunCameraLocalScale)
              } else {
                object.scale.set(0.004, 0.004, 0.004)
              }
            }
            if (deviceType === 1) {
              if (this.modelPositionParam.radarScale) {
                object.scale.setScalar(this.modelPositionParam.radarScale)
                // if (this.modelPositionParam.radarScale - 0.2 > 0) {
                //   object.scale.setScalar(this.modelPositionParam.radarScale - 0.2)
                // } else object.scale.setScalar(this.modelPositionParam.radarScale)
              } else {
                object.scale.set(0.08, 0.08, 0.08)
              }
            }
            if (deviceType === 3) {
              if (this.modelPositionParam.ballHeadCameraLocalScale) {
                if (this.modelPositionParam.ballHeadCameraLocalScale - 0.2 > 0) {
                  object.scale.setScalar(this.modelPositionParam.ballHeadCameraLocalScale - 0.2)
                } else object.scale.setScalar(this.modelPositionParam.ballHeadCameraLocalScale)
              } else {
                object.scale.set(0.04, 0.04, 0.04)
              }
            }
            if(deviceType === 4) {
              if (this.modelPositionParam.sensorScale) {
                object.scale.setScalar(this.modelPositionParam.sensorScale)
              } else {
                object.scale.set(0.04, 0.04, 0.04)
              }
            }
            const obj = new THREE.Object3D()
            obj.add(object)
            obj.name = deviceName
            obj.floor = floor
            obj.deviceSn = deviceSn
            obj.groupId = groupId
            obj.videoUrl = videoUrl

            // if(obj.name == 'radar'){
            //   var number = 0;
            //   var needupdate = 1;
            //   this.models.createRadarNumberCard(obj.children[0].position,obj.deviceSn,number,obj.floor,0,needupdate);
            // }
            // if (obj.name === 'gunCamera') {
            //   this.models.createVideoCard(obj.children[0].position, obj.videoUrl)
            // }
            if (obj.name === 'ballHeadCamera') {
              // this.models.createVideoCard(obj.children[0].position, 'http://192.168.8.127:8080/shaobing/livestream64.flv')
              this.models.createVideoCard(obj.children[0].position, obj.videoUrl)
            }
            this.models.scene.add(obj)
            // 回调
            resolve(object)
          },
          null,
          (error) => {
            console.error(error)
            reject(error)
          }
        )
      })
    },

    // 获取所有防区信息，初始化防区
    getDefenceArea() {
      let defenseAreas = this.models.scene.getObjectByName('已添加防区')
      if (defenseAreas) this.models.scene.remove(defenseAreas)
      getDefenceInfo().then(
        (res) => {
          console.log('打印获取到的防区信息：')
          console.log(res.data)
          const defenceInfo = res.data
          // console.log(defenceInfo[0].radarSn)
          // console.log(defenceInfo.length);
          for (let i = 0; i < defenceInfo.length; i++) {
            if (this.getSelectFloorInfo.id == defenceInfo[i].floor) {
              this.initDefenceArea(defenceInfo[i])
            }
          }
        }
      )
    },

    /**
     * 这是初始化每个防区的方法
     */
    initDefenceArea(defenceArea) {
      console.log(this.models)
      const defencePointNode = []
      for (let i = 0; i < defenceArea.defenceInfo.points.length; i++) {
        defencePointNode.push(new THREE.Vector3(defenceArea.defenceInfo.points[i].posX + this.getSelectFloorInfo.trailOffsetX,
          defenceArea.defenceInfo.points[i].posY + this.getSelectFloorInfo.trailOffsetY,
          defenceArea.defenceInfo.points[i].posZ + this.getSelectFloorInfo.trailOffsetZ))
        // console.log(defenceArea.defenceInfo.points);
      }

      if (defenceArea.defenceInfo.type === 'polygon') {
        this.models.initPolygonDefence(defencePointNode, defenceArea.floor, defenceArea.radarSn)
      } else if (defenceArea.defenceInfo.type === 'circle') {
        console.log(defencePointNode)
        this.models.initcircleDefence(defencePointNode, defenceArea.floor, defenceArea.radarSn)
      } else {
        throw new Error('没有防区type')
      }
      // initcircleDefence
    },

    /*
    左键单击摄像头，出来对应的视频
    */
    onClickVideo(event) {
      if (this.models.getClickModel()) {
        switch (this.models.getClickModel().name) {
          case DEVICE.GUN_CAMERA:
            // 枪机不需要视频卡片
            this.currentDeviceName = '枪机'
            this.setCurrentDevice(this.models.getClickModel())
            if (this.models.getClickModel().deviceSn !== undefined) {
              getVideoStream(this.models.getClickModel().deviceSn).then(res => {
                this.videoCardGroup = this.models.createVideoCard1(this.models.getClickModel().children[0].position, this.models.getClickModel().floor, res.data)
              })
            }
            // this.models.createVideoCard1(this.currentDevice.children[0].position, this.currentDevice.floor,this.currentDevice.videoUrl)
            break
          case DEVICE.BALL_HEAD_CAMERA:
            this.currentDeviceName = '球机'
            this.setCurrentDevice(this.models.getClickModel())
            if (this.models.getClickModel().deviceSn !== undefined) {
              getVideoStream(this.models.getClickModel().deviceSn).then(res => {
                this.videoCardGroup = this.models.createVideoCard1(this.models.getClickModel().children[0].position, this.models.getClickModel().floor, res.data)
              })
            }
            // this.models.createVideoCard1(this.currentDevice.children[0].position, this.currentDevice.floor,this.currentDevice.videoUrl)
            break
          case 'videoCard':
            this.models.camera.position.x = this.models.getClickModel().cameraPositionx
            this.models.camera.position.y = this.models.getClickModel().cameraPositiony
            this.models.camera.position.z = this.models.getClickModel().cameraPositionz
            this.models.camera.rotation.x = this.models.getClickModel().cameraRotationx
            this.models.camera.rotation.y = this.models.getClickModel().cameraRotationy
            this.models.camera.rotation.z = this.models.getClickModel().cameraRotationz

            // 移除视频模型
            // this.models.getClickModel().visible = false
            // this.models.getClickModel().scale.x=0
            // this.models.getClickModel().scale.y=0
            // this.models.getClickModel().scale.z=0
            // console.log('scene:', this.models.scene)
            // console.log('videoCardGroup:', this.videoCardGroup)
            this.models.scene.remove(this.videoCardGroup)

            break
          default:
            break
        }
      }
    },
    /**
     * @author Lyc
     * 右键单击模型
     */
    onClickPole(event) {
      this.clickEvent = this.models.getClickInfo()

      console.log(this.clickEvent);
      console.log('beidianji')
      if (this.models.getClickModel()) {
        console.log(this.models.getClickModel(), 555555666)
        switch (this.models.getClickModel().name) {
          case DEVICE.RADAR:
            this.deviceOptionPosition.top = `${event.clientY}px`
            this.deviceOptionPosition.left = `${event.clientX + 10}px`
            this.deviceDetailVisible = true
            this.setDeviceOptionVisible(false)
            this.currentDeviceName = '雷达'
            this.setCurrentDevice(this.models.getClickModel())
            break
          case DEVICE.SENSOR:
            this.deviceOptionPosition.top = `${event.clientY}px`
            this.deviceOptionPosition.left = `${event.clientX + 10}px`
            this.deviceDetailVisible = true
            this.setDeviceOptionVisible(false)
            this.currentDeviceName = '环境检测器'
            this.setCurrentDevice(this.models.getClickModel())
            break
          case DEVICE.GUN_CAMERA:
            this.deviceOptionPosition.top = `${event.clientY}px`
            this.deviceOptionPosition.left = `${event.clientX + 10}px`
            this.deviceDetailVisible = true
            this.setDeviceOptionVisible(false)
            this.currentDeviceName = '枪机'
            this.setCurrentDevice(this.models.getClickModel())
            // console.log('&&&&&&&')
            // console.log(this.models.getClickModel())
            // console.log('*************')
            // console.log(this.currentDevice)

            // this.models.createVideoCard(this.currentDevice.children[0].position, 'http://192.168.8.127:8080/shaobing/livestream64.flv')
            break
          case DEVICE.BALL_HEAD_CAMERA:
            this.deviceOptionPosition.top = `${event.clientY}px`
            this.deviceOptionPosition.left = `${event.clientX + 10}px`
            this.deviceDetailVisible = true
            this.currentDeviceName = '球机'
            this.setCurrentDevice(this.models.getClickModel())
            this.setDeviceOptionVisible(false)
            // console.log(this.models.getClickModel())
            // console.log('*************')
            // console.log(this.currentDevice)
            // 右击生成视频卡片
            // this.models.createVideoCard(this.currentDevice.children[0].position,'http://192.168.8.127:8080/shaobing/livestream64.flv')
            break
          case DEVICE.WARNING_LIGHT:
            this.deviceOptionPosition.top = `${event.clientY}px`
            this.deviceOptionPosition.left = `${event.clientX + 10}px`
            this.deviceDetailVisible = true
            this.setDeviceOptionVisible(false)
            this.currentDeviceName = '报警器'
            this.setCurrentDevice(this.models.getClickModel())
            break
          default:
            console.log('default++++++++++++++++++++++')
            this.deviceOptionPosition.top = `${event.clientY}px`
            this.deviceOptionPosition.left = `${event.clientX + 10}px`
            this.setDeviceOptionVisible(true)
            // console.log(this.getDeviceVisible)
            this.deviceDetailVisible = false
            break
        }
      }
    },

    /**
     * @author Lyc
     * 双击场景模型
     */
    ondblClickInfo() {
      const clickInfo = this.models.getClickInfo()
      console.log(clickInfo)
      let obj = this.models.scene.getObjectByName('一楼厕所')
      console.log('+++++yiii', obj)
      console.log(this.deviceArrays, 'sssssssssssss', this.currentDevice)
      // 点击预创建后移动设备位置()
      if (this.currentDevice === null) {
        if (this.deviceistrue === null) return
        else this.setCurrentDevice(this.deviceistrue)
      }
      const flag = this.deviceArrays.indexOf(this.currentDevice)
      if (flag !== -1) return
      // 方便小学部署加的临时代码,用于写死在单层楼创建雷达的高度
      if (this.getSelectFloorInfo.floorName == '一楼厕所') clickInfo.point.y = 2.3
      if (this.getSelectFloorInfo.floorName == '二楼厕所') clickInfo.point.y = 3.7
      if (this.getSelectFloorInfo.floorName == '三楼厕所') clickInfo.point.y = 5.1
      if (this.getSelectFloorInfo.floorName == '四楼厕所') clickInfo.point.y = 6.4
      if (this.getSelectFloorInfo.floorName == '操场厕所') clickInfo.point.y = 2.3
      this.currentDevice.position.copy(clickInfo.point)
      // console.log(this.floorlevel,"拿到到 dddddd")
      if (this.floorlevel == null || this.floorlevel == '全部楼层显示') {
        if (this.currentDevice.position.y < 1) {
          if (this.currentDevice.position.y < -6) {
            this.currentDevice.floor = 24
          } else {
            this.currentDevice.floor = 25
          }
        } else {
          this.currentDevice.floor = 26
        }
      } else {
        if (this.floorlevel == '24F') {
          this.currentDevice.floor = 24
        }
        if (this.floorlevel == '25F') {
          this.currentDevice.floor = 25
        }
        if (this.floorlevel == '26F') {
          this.currentDevice.floor = 26
        }
      }
      console.log('在这里测试一下', this.currentDevice)
      // if(this.currentDevice.name == 'radar') this.currentDevice.scale.set(0.4, 0.4, 0.4)
      // if(this.currentDevice.name == 'sensor') this.currentDevice.scale.setScalar(0.02)
      this.polePosition = clickInfo.point
      // this.currentDevice.position.y += 0.3 // y的高度
      if (this.currentDevice.name === 'radar') {
        // this.currentDevice.position.y = -1.3588100771469154
      }
      // 一旦双击，就在store中把保存双击位置的store修改掉
      this.setDoublePosition(this.currentDevice.position)
      console.log(this.currentDevice.name, this.currentDevice.position, 777777)
      console.log('高度：', this.currentDevice.position)
    },
    /**
     * @author Lyc
     * 添加设备，只添加不保存
     */
    addDeviceModel(deviceName, event) {
      // 一次只能添加一个设备，后期可以用数组添加多个设备
      console.log('这里是添加模型', '我是6666666')

      if (this.currentDevice != null || this.deviceistrue != null) return

      const deviceMap = DEVICE_MAP()
      console.log('正在添加模型', deviceName)
      //加载模型
      const deviceModelInfo = this.models.loadModel(
        deviceMap.get(deviceName),
        this.models.scene
      )

      deviceModelInfo.then((res) => {
        this.models.addModelExtraInf(res, this.formDevice)
        this.setCurrentDevice(res)
        this.currentDevice.position.copy(this.clickEvent.point)
        this.deviceistrue = this.currentDevice
        console.log(this.deviceistrue, this.currentDevice, 5555555555555)
        console.log('console.log(res)')
        console.log(res)
        // switch (this.getSelectDevice) {
        //   case '球机':
        //     let ballHeadCamera = this.models.scene.getObjectByName("ballHeadCamera")
        //     console.log('++++++++++++++++++++++ballHeadCamera', ballHeadCamera)
        //     break
        // }
      })
    },
    /**
     * @author Lyc
     * 取消设备模型创建,根据用户选择不同，完成不同操作
     */
    cancelDevice() {
      let params = true
      console.log(this.currentDevice, this.deviceistrue, 7777777777777777)
      if (this.currentDevice) {
        console.log(this.currentDevice)
        this.deviceArrays.forEach((arr) => {
          if (arr === this.currentDevice) params = false
        })
        if (params) this.models.deleteModel(this.currentDevice)
        this.setCurrentDevice(null)
        this.deviceistrue = null
      } else {
        if (this.deviceistrue) {
          console.log(this.deviceistrue, 99999999997)
          this.models.deleteModel(this.deviceistrue)
          this.deviceistrue = null
        }
      }
      if (this.getDeviceVisible) {
        this.setDeviceOptionVisible(false)
      }
      // 清空表单信息
      var initFormMonitor = {
        monitorName: '',
        monitorLocation: '',
        monitorOnOff: '0',
        monitorMapX: '',
        monitorMapY: '',
        monitorMapZ: '',
        groupId: 0,
        deviceName: '',
        angle: 0,
        floor: 25,
        pitchAngle: 0,
        horizontalAngle: 0
      }
      this.setFormMonitor(initFormMonitor)
      // 强制表单清空
      location.reload()
    },
    /**
     * 更新角度
     * @author Lml
     */
    upDateDeviceAngle(data) {
      console.log('接收到数据')
      console.log(data)
      console.log('this.currentDevice', this.currentDevice)
      this.models.scene.remove(this.currentDevice)
      this.models.scene.add(this.currentDevice)
      // data.angle
      // 俯仰角
      this.currentDevice.rotation.z = data.pitchAngle * Math.PI / 180
      this.currentDevice.rotation.y = data.horizontalAngle * Math.PI / 180
    },
    /**
     * 更新地图位置
     */
    changeMapPosition(data) {
      let mainModel = this.models.scene.getObjectByName("mainModel")
      mainModel.position.x = data.positionX
      mainModel.position.y = data.positionY
      mainModel.position.z = data.positionZ
      mainModel.scale.setScalar(data.scale)
      mainModel.rotation.x = data.rotationX
      mainModel.rotation.y = data.rotationY
      mainModel.rotation.x = data.rotationZ
    },
    /**
     * 更新模型位置
     */
    changeModelPosition(data) {
      let mainModel = this.models.scene.getObjectByName("mainModel")
      mainModel.rotation.y = data.selectBuildingRotation
      let camera = this.models.scene.getObjectByName("全局摄像机")
      this.cameraPosition.x = camera.position.x = data.cameraX
      this.cameraPosition.y = camera.position.y = data.cameraY
      this.cameraPosition.z = camera.position.z = data.cameraZ
      this.models.orbitControls.enableDamping = true
      this.models.orbitControls.dampingFactor = data.dampingFactor
      this.models.orbitControls.target.set(data.centerX, data.centerY, data.centerZ)
      this.models.orbitControls.update()
      this.models.orbitControls.saveState()
      let ballHeadCamera = this.models.scene.getObjectByName('testBallHeadCamera')
      if (ballHeadCamera) {
        ballHeadCamera.scale.setScalar(data.ballHeadCameraLocalScale)
      }
      let gunCamera = this.models.scene.getObjectByName('testGunCamera')
      if (gunCamera) {
        gunCamera.scale.setScalar(data.GunCameraLoadScale)
      }
      let testWarningLight = this.models.scene.getObjectByName('testWarningLight')
      if (testWarningLight) {
        testWarningLight.scale.setScalar(data.WarningLightScale)
      }
      let testRadar = this.models.scene.getObjectByName('testRadar')
      if (testRadar) {
        testRadar.scale.setScalar(data.RadarScale)
      }
    },
    // /**
    //  * 更新单层楼旋转模型的旋转角度
    //  */
    // changeSelectBuildingRotation(data) {
    //   let mainModel = this.models.scene.getObjectByName("mainModel")
    //   mainModel.rotation.y = data
    // },
    /**
     * 专用于七十五中的补丁，调节雷达大小时，保持地图尺寸不变
     */
    changeRadarScale(data) {
      let testRadar = this.models.scene.getObjectByName('testRadar')
      if (testRadar) {
        testRadar.scale.setScalar(data.RadarScale)
      }
    },
    /**
     * 调节传感器大小时，保持地图尺寸不变
     */
    changeSensorScale(data) {
      let testSenor = this.models.scene.getObjectByName('testSenor')
      if (testSenor) {
        testSenor.scale.setScalar(data.sensorScale)
      }
    },
    /**
     * 更新卡片大小缩放
     */
    changeCardPosition(data) {
      let objects = this.models.scene.children
      for (let i = 0; i < objects.length; i++) {
        if (objects[i].name == 'radarCard') objects[i].scale.set(data.CardScaleX, data.CardScaleY, 4)
      }
    },
    /**
     * 更新防区高度
     */
    changeDefencePosition(data) {
      console.log('++++++++++data', data)
    },
    /**
     * 仅展示选中的楼层，其余建筑全部隐藏显示
     */
    showSelectBuilding(data) {
      this.cameraPosition = {}
      this.models.orbitControls.enableDamping = false
      // 隐藏雷达雷达人数卡片
      let objects = this.models.scene.children
      for (let i = 0; i < objects.length; i++) {
        if (objects[i].name == 'radarCard') objects[i].visible = false
        if (objects[i].name == 'radar') objects[i].visible = false
        if (objects[i].name == 'ballHeadCamera') objects[i].visible = false
        if (objects[i].name == 'gunCamera') objects[i].visible = false
        if (objects[i].name == 'videoCardGroup') objects[i].visible = false
        if (objects[i].name == 'sensor') objects[i].visible = false
      }
      let mainModel = this.models.scene.getObjectByName("mainModel")
      let mainModelChildren = mainModel.children
      let length = mainModelChildren.length
      for (let i = 0; i < length; i++) { // 先隐藏整张模型上的设备
        if (mainModelChildren[i].name.indexOf('室外') >= 0) { // 室外模型文件结构不同，隐藏其所有子元素模型
          for (let j = 0; j < mainModelChildren[i].children.length; j++) {
            mainModelChildren[i].children[j].visible = false
          }
        } else {
          mainModelChildren[i].visible = false
        }
      }
      if (data.length == 0) {
        this.getDevice(0)
        return
      }
      if (data[0] == 'mainModel') {
        for (let i = 0; i < length; i++) {
          mainModelChildren[i].visible = true
        }
        let param = {}
        param.floorName = data[0]
        getFloorShot(param).then(res => {
          this.uploadSaveTraceParam(res.data)
          let radarCardPosition = {}
          radarCardPosition.positionX = this.getSaveTraceParam.radarCardScaleX
          radarCardPosition.positionY = this.getSaveTraceParam.radarCardScaleY
          this.uploadRadarCardPosition(radarCardPosition)
          let param = {}
          param.floorName = res.data.floorName
          param.id = res.data.id
          param.mapModelId = res.data.mapModelId
          param.trailOffsetX = res.data.trailOffsetX
          param.trailOffsetY = res.data.trailOffsetY
          param.trailOffsetZ = res.data.trailOffsetZ
          param.scale = res.data.imageScale
          this.modelPositionParam = {}
          this.modelPositionParam.ballHeadCameraLocalScale = res.data.ballHeadCameraLocalScale
          this.modelPositionParam.cameraX = res.data.cameraX
          this.modelPositionParam.cameraY = res.data.cameraY
          this.modelPositionParam.cameraZ = res.data.cameraZ
          // 单层旋转参数，用于旋转单层的角度
          if (res.data.rotationY || res.data.rotationY == 0) this.modelPositionParam.selectBuildingRotation = res.data.rotationY
          else this.modelPositionParam.selectBuildingRotation = mainModel.rotation.y
          this.modelPositionParam.dampingFactor = res.data.dampingFactor
          // 单层旋转中心点位置设置
          if (res.data.centerX) this.modelPositionParam.centerX = res.data.centerX
          else this.modelPositionParam.centerX = 0
          if (res.data.centerY) this.modelPositionParam.centerY = res.data.centerY
          else this.modelPositionParam.centerY = 0
          if (res.data.centerZ) this.modelPositionParam.centerZ = res.data.centerZ
          else this.modelPositionParam.centerZ = 0
          this.modelPositionParam.gunCameraLocalScale = res.data.gunCameraLocalScale
          // 七十五中补丁，修复雷达创建不拖条造成默认scale为1的问题
          if (res.data.radarScale == 1) this.modelPositionParam.radarScale = 0.02
          else this.modelPositionParam.radarScale = res.data.radarScale
          this.modelPositionParam.sensorScale = res.data.sensorScale
          this.modelPositionParam.warningLightScale = res.data.warningLightScale
          this.viewPort = data[0] + '视角'
          this.getDevice(res.data.id)
          this.getDefenceArea()
          this.uploadSelectFloorInfo(param)
        })
        return;
      }
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < length; j++) {
          if (mainModelChildren[j].name == data[i] && mainModelChildren[j].name.indexOf('室外') < 0) { // 通常情况，不包含室外的地图
            mainModelChildren[j].visible = true
            let param = {}
            param.floorName = mainModelChildren[j].name
            getFloorShot(param).then(res => {
              this.uploadSaveTraceParam(res.data)
              let radarCardPosition = {}
              radarCardPosition.positionX = this.getSaveTraceParam.radarCardScaleX
              radarCardPosition.positionY = this.getSaveTraceParam.radarCardScaleY
              this.uploadRadarCardPosition(radarCardPosition)
              let param = {}
              param.floorName = res.data.floorName
              param.id = res.data.id
              param.mapModelId = res.data.mapModelId
              param.trailOffsetX = res.data.trailOffsetX
              param.trailOffsetY = res.data.trailOffsetY
              param.trailOffsetZ = res.data.trailOffsetZ
              param.scale = res.data.imageScale
              // 只对最后一个选中楼层更新位置
              if (i == data.length - 1) {
                this.modelPositionParam = {}
                this.modelPositionParam.ballHeadCameraLocalScale = res.data.ballHeadCameraLocalScale
                this.modelPositionParam.cameraX = res.data.cameraX
                this.modelPositionParam.cameraY = res.data.cameraY
                this.modelPositionParam.cameraZ = res.data.cameraZ
                // 单层旋转参数，用于旋转单层的角度
                if (res.data.rotationY  || res.data.rotationY == 0) this.modelPositionParam.selectBuildingRotation = res.data.rotationY
                else this.modelPositionParam.selectBuildingRotation = mainModel.rotation.y
                this.modelPositionParam.dampingFactor = res.data.dampingFactor
                // 单层旋转中心点位置设置
                if (res.data.centerX) this.modelPositionParam.centerX = res.data.centerX
                else this.modelPositionParam.centerX = 0
                if (res.data.centerY) this.modelPositionParam.centerY = res.data.centerY
                else this.modelPositionParam.centerY = 0
                if (res.data.centerZ) this.modelPositionParam.centerZ = res.data.centerZ
                else this.modelPositionParam.centerZ = 0
                this.modelPositionParam.gunCameraLocalScale = res.data.gunCameraLocalScale
                // this.modelPositionParam.radarScale = res.data.radarScale
                if (res.data.radarScale == 1) this.modelPositionParam.radarScale = 0.02
                else this.modelPositionParam.radarScale = res.data.radarScale
                this.modelPositionParam.sensorScale = res.data.sensorScale
                this.modelPositionParam.warningLightScale = res.data.warningLightScale
                this.modelPositionParam.radarCardScaleX = res.data.radarCardScaleX
                this.modelPositionParam.radarCardScaleY = res.data.radarCardScaleY
                this.viewPort = data[i] + '视角'
                // 展示最后一个选中楼层的设备
                this.getDevice(res.data.id)
                this.getDefenceArea()
              }
              this.uploadSelectFloorInfo(param)
            })
          }
          else if (mainModelChildren[j].name == data[i] && mainModelChildren[j].name.indexOf('室外') >= 0) { // 第二种情况，点击了带室外场景的楼层
            let outerModel = mainModelChildren[j]
            for(let k = 0; k < outerModel.children.length; k++) {
              outerModel.children[k].visible = true
            }
            let param = {}
            param.floorName = mainModelChildren[j].name
            getFloorShot(param).then(res => {
              this.uploadSaveTraceParam(res.data)
              let radarCardPosition = {}
              radarCardPosition.positionX = this.getSaveTraceParam.radarCardScaleX
              radarCardPosition.positionY = this.getSaveTraceParam.radarCardScaleY
              this.uploadRadarCardPosition(radarCardPosition)
              let param = {}
              param.floorName = res.data.floorName
              param.id = res.data.id
              param.mapModelId = res.data.mapModelId
              param.trailOffsetX = res.data.trailOffsetX
              param.trailOffsetY = res.data.trailOffsetY
              param.trailOffsetZ = res.data.trailOffsetZ
              param.scale = res.data.imageScale
              // 只对最后一个选中楼层更新位置
              if (i == data.length - 1) {
                this.modelPositionParam = {}
                this.modelPositionParam.ballHeadCameraLocalScale = res.data.ballHeadCameraLocalScale
                this.modelPositionParam.cameraX = res.data.cameraX
                this.modelPositionParam.cameraY = res.data.cameraY
                this.modelPositionParam.cameraZ = res.data.cameraZ
                // 单层旋转参数，用于旋转单层的角度
                if (res.data.rotationY || res.data.rotationY == 0) this.modelPositionParam.selectBuildingRotation = res.data.rotationY
                else this.modelPositionParam.selectBuildingRotation = mainModel.rotation.y
                this.modelPositionParam.dampingFactor = res.data.dampingFactor
                // 单层旋转中心点位置设置
                if (res.data.centerX) this.modelPositionParam.centerX = res.data.centerX
                else this.modelPositionParam.centerX = 0
                if (res.data.centerY) this.modelPositionParam.centerY = res.data.centerY
                else this.modelPositionParam.centerY = 0
                if (res.data.centerZ) this.modelPositionParam.centerZ = res.data.centerZ
                else this.modelPositionParam.centerZ = 0
                this.modelPositionParam.gunCameraLocalScale = res.data.gunCameraLocalScale
                // this.modelPositionParam.radarScale = res.data.radarScale
                if (res.data.radarScale == 1) this.modelPositionParam.radarScale = 0.02
                else this.modelPositionParam.radarScale = res.data.radarScale
                this.modelPositionParam.sensorScale = res.data.sensorScale
                this.modelPositionParam.warningLightScale = res.data.warningLightScale
                this.modelPositionParam.radarCardScaleX = res.data.radarCardScaleX
                this.modelPositionParam.radarCardScaleY = res.data.radarCardScaleY
                this.viewPort = data[i] + '视角'
                // 展示最后一个选中楼层的设备
                this.getDevice(res.data.id)
                this.getDefenceArea()
              }
              this.uploadSelectFloorInfo(param)
            })
          }
          else if (mainModelChildren[j].name != data[i] && mainModelChildren[j].name.indexOf('室外') >= 0) { // 第三种情况，点击的楼层名包含在室外场景结构中
            let outerModel = mainModelChildren[j]
            for(let k = 0; k < outerModel.children.length; k++) {
              if (outerModel.children[k].name == data[i]) {
                outerModel.children[k].visible = true
                let param = {}
                param.floorName = outerModel.children[k].name
                getFloorShot(param).then(res => {
                  this.uploadSaveTraceParam(res.data)
                  let radarCardPosition = {}
                  radarCardPosition.positionX = this.getSaveTraceParam.radarCardScaleX
                  radarCardPosition.positionY = this.getSaveTraceParam.radarCardScaleY
                  this.uploadRadarCardPosition(radarCardPosition)
                  let param = {}
                  param.floorName = res.data.floorName
                  param.id = res.data.id
                  param.mapModelId = res.data.mapModelId
                  param.trailOffsetX = res.data.trailOffsetX
                  param.trailOffsetY = res.data.trailOffsetY
                  param.trailOffsetZ = res.data.trailOffsetZ
                  param.scale = res.data.imageScale
                  // 只对最后一个选中楼层更新位置
                  if (i == data.length - 1) {
                    this.modelPositionParam = {}
                    this.modelPositionParam.ballHeadCameraLocalScale = res.data.ballHeadCameraLocalScale
                    this.modelPositionParam.cameraX = res.data.cameraX
                    this.modelPositionParam.cameraY = res.data.cameraY
                    this.modelPositionParam.cameraZ = res.data.cameraZ
                    // 单层旋转参数，用于旋转单层的角度
                    if (res.data.rotationY || res.data.rotationY == 0) this.modelPositionParam.selectBuildingRotation = res.data.rotationY
                    else this.modelPositionParam.selectBuildingRotation = mainModel.rotation.y
                    this.modelPositionParam.dampingFactor = res.data.dampingFactor
                    // 单层旋转中心点位置设置
                    if (res.data.centerX) this.modelPositionParam.centerX = res.data.centerX
                    else this.modelPositionParam.centerX = 0
                    if (res.data.centerY) this.modelPositionParam.centerY = res.data.centerY
                    else this.modelPositionParam.centerY = 0
                    if (res.data.centerZ) this.modelPositionParam.centerZ = res.data.centerZ
                    else this.modelPositionParam.centerZ = 0
                    this.modelPositionParam.gunCameraLocalScale = res.data.gunCameraLocalScale
                    // this.modelPositionParam.radarScale = res.data.radarScale
                    if (res.data.radarScale == 1) this.modelPositionParam.radarScale = 0.02
                    else this.modelPositionParam.radarScale = res.data.radarScale
                    this.modelPositionParam.sensorScale = res.data.sensorScale
                    this.modelPositionParam.warningLightScale = res.data.warningLightScale
                    this.modelPositionParam.radarCardScaleX = res.data.radarCardScaleX
                    this.modelPositionParam.radarCardScaleY = res.data.radarCardScaleY
                    this.viewPort = data[i] + '视角'
                    // 展示最后一个选中楼层的设备
                    this.getDevice(res.data.id)
                    this.getDefenceArea()
                  }
                  this.uploadSelectFloorInfo(param)
                })
                break
              }
            }
          }
        }
      }
    },
    /**
     * 让镜头归位
     */
    initCameraLookAt() {
      this.models.orbitControls.reset()
      // if (this.cameraPosition) {
      //   let camera = this.models.scene.getObjectByName("全局摄像机")
      //   camera.position.x = this.cameraPosition.x
      //   camera.position.y = this.cameraPosition.y
      //   camera.position.z = this.cameraPosition.z
      // }
    },
    /**
     * 新建器件时，输入框位置改变，触发器件位置变化
     */
    changeMonitor(data) {
      if (this.currentDevice) {
        this.currentDevice.position.x = data.positionX
        this.currentDevice.position.y = data.positionY
        this.currentDevice.position.z = data.positionZ
      }
    },
    /**
     * @author Lyc
     * 保存设备模型并进行网络请求
     */
    saveDevice(extraInfoObj) {
      const deviceKey = this.currentDevice.name
      const floorselect = this.floorlevel
      console.log(deviceKey, 8777777)
      console.log('')
      this.saveDeviceInfo({deviceKey, ...extraInfoObj, floorselect}).then((res) => {
        if (res.code === 200) {
          this.setDeviceOptionVisible(false)
          this.$notify.success({
            title: '操作提示',
            message: `添加设备成功！`,
            offset: 100
          })
          // this.setFormDevice(FORM_DEVICE);
          this.currentDevice.deviceSn = res.data.deviceSn
          this.currentDevice.groupId = extraInfoObj.groupId
          this.deviceArrays.push(this.currentDevice)
          this.setCurrentDevice(null)
          console.log('成功', res.data.deviceSn)
          setSession('radarOrWarningLightSn', res.data.deviceSn)
          this.setCurrentDevice(null)
          this.deviceistrue = null
          console.log(this.currentDevice, 77777777777777)
        } else {
          this.$notify.error({
            title: '操作提示',
            message: `添加失败:${res.code}${res.msg}`,
            offset: 100
          })
        }
      })
    },
    /**
     * 增加高度目前没用
     */
    addHeight() {
      console.log('目前设备', this.currentDevice)
      const y = this.currentDevice.position.y
      this.models.moveModel('ballHeadCamera', y + 0.1, this.currentDevice)
    },
    /**
     * @author Lyc
     * 实时移动设备模型
     */
    moveDeviceModel({type, value}) {
      const moveData = {}
      if (type === 'height') {
        Object.assign(moveData, {
          deviceHigh: value,
          deviceAngle: this.formDevice.deviceRotation,
          deviceRotationAngle: this.formDevice.deviceSelfRotation
        })
      } else if (type === 'angle') {
        Object.assign(moveData, {
          deviceHigh: this.formDevice.deviceHigh,
          deviceAngle: value,
          deviceRotationAngle: this.formDevice.deviceSelfRotation
        })
      } else {
        Object.assign(moveData, {
          deviceHigh: this.formDevice.deviceHigh,
          deviceAngle: this.formDevice.deviceRotation,
          deviceRotationAngle: value
        })
      }
      console.log(this.currentDevice.name, moveData, this.currentDevice)
      this.models.moveModel(this.currentDevice.name, moveData, this.currentDevice)
    },
    /**
     * @author Lyc
     * 删除选中设备模型
     */
    deleteDevice() {
      this.deviceDetailVisible = false
      console.log('执行删除模型', this.currentDevice)
      if (this.currentDevice) {
        this.models.deleteModel(this.currentDevice)
        this.setCurrentDevice(null)
        // console.log("删除了",parent)
        const p = this.deviceArrays.indexOf(this.currentDevice)
        if (p > -1) this.deviceArrays.splice(p, 1)
      } else {
        throw new Error('object is null')
      }
      // 删除deviceArrays里的相同文件
    },
    /**
     * @author Lyc
     * 单机关闭按钮，同时制空当前模型对象
     */
    closeDeviceDetail() {
      this.setCurrentDevice(null)
      this.deviceDetailVisible = false
    },
    animation() {
      this.models.renderer.render(this.models.scene, this.models.camera)
      requestAnimationFrame(this.animation)
    }
  },
  destroyed() {
    this.setShareModels(null)
    this.saveDevicePreviewSelfModel(null)
    window.location.reload()
  },
  async mounted() {
    if (this.shareModels === null) {
      // console.log('这里执行了吗')
      await this.initShareModels()
    }
    await this.initMap()
    if (this.models === null && this.shareModels !== null) {
      this.initSelfModels()
      console.log(this.models, 44444444444444444444444444444444)
    }

    getPeopleCountingWebsocketAddr().then((res) => {
      this.websocketAddr = res.msg
      console.log(this.websocketAddr, 'websocket地址')
      const onopenCallback = () => {
        console.log('人数统计websocket已连接')
        this.websocketConnector.heartStart()
      }
      const onmessageCallback = (msg) => {
        const message = JSON.parse(msg.data)
        this.websocketConnector.heartReset()
        console.log('console.log(message.data)')
        console.log(message)
        const res = {
          offline: message.offline,
          list: message.peopleCountBos
        }
        if (res.offline != 0) { // 离线
          if (this.radarList.length) {
            let perCardDistance = 0
            for (var item4 = 0; item4 < this.radarList.length; item4++) {
              perCardDistance += 0.1 // 为了避免卡片重叠再一起
              for (var item15 = 0; item15 < res.list.length; item15++) {
                if (res.list[item15].radarOnline === '0' && this.radarList[item4].deviceSn == res.list[item15].radarSn) {
                  var position1234 = {}
                  position1234.x = this.radarList[item4].deviceMapX
                  position1234.y = this.radarList[item4].deviceMapY + 0.5
                  position1234.z = this.radarList[item4].deviceMapZ
                  var currentfloor1 = this.floor
                  var radarFloor1 = this.radarList[item4].floor + 'F'
                  var needupdate1
                  if (currentfloor1 && currentfloor1 != radarFloor1) {
                    needupdate1 = 0
                  } else {
                    needupdate1 = 1
                  }
                  if (this.getSelectFloorInfo.id == this.radarList[item4].floor) {
                    position1234.x += perCardDistance
                    perCardDistance += 1
                    if (perCardDistance >= 2) perCardDistance = 0
                    this.models.createRadarNumberCard(position1234, res.list[item15].radarSn, 0, this.radarList[item4].floor, 0, needupdate1, this.getRadarCardPosition)
                  }
                }
              }
            }
          }
        }
        // getAllRadarStatus().then((res) => {
        //   var radaronline = res
        //   console.log(radaronline)
        //   console.log(this.radarList)
        //   if (radaronline.data.offline != 0) { // 离线
        //     console.log(this.radarList)
        //     if (this.radarList.length) {
        //       let perCardDistance = 0
        //       for (var item4 = 0; item4 < this.radarList.length; item4++) {
        //         perCardDistance += 0.1 // 为了避免卡片重叠再一起
        //         for (var item15 = 0; item15 < radaronline.data.list.length; item15++) {
        //           if (radaronline.data.list[item15].radarOnline === '0' && this.radarList[item4].deviceSn == radaronline.data.list[item15].radarSn) {
        //             var position1234 = {}
        //             position1234.x = this.radarList[item4].deviceMapX + perCardDistance
        //             position1234.y = this.radarList[item4].deviceMapY
        //             position1234.z = this.radarList[item4].deviceMapZ
        //             var currentfloor1 = this.floor
        //             var radarFloor1 = this.radarList[item4].floor + 'F'
        //             var needupdate1
        //             if (currentfloor1 && currentfloor1 != radarFloor1) {
        //               needupdate1 = 0
        //             } else {
        //               needupdate1 = 1
        //             }
        //             if (this.getSelectFloorInfo.id == this.radarList[item4].floor) {
        //               position1234.x += perCardDistance
        //               perCardDistance += 1
        //               if (perCardDistance >= 2) perCardDistance = 0
        //               this.models.createRadarNumberCard(position1234, radaronline.data.list[item15].radarSn, 0, this.radarList[item4].floor, 0, needupdate1, this.getRadarCardPosition)
        //             }
        //           }
        //         }
        //       }
        //     }
        //   }
        // })
        if (message != 1) {
          let perCardDistance = 0
          for (var item = 0; item < this.radarList.length; item++) {
            for (var item1 = 0; item1 < message.peopleCountBos.length; item1++) {
              if (this.radarList[item].deviceSn == message.peopleCountBos[item1].radarSn && message.peopleCountBos[item1].radarOnline != 0) {
                var position123 = {}
                position123.x = this.radarList[item].deviceMapX
                position123.y = this.radarList[item].deviceMapY + 0.5
                position123.z = this.radarList[item].deviceMapZ
                var currentfloor = this.floorlevel
                var radarFloor = this.radarList[item].floor + 'F'
                var needupdate

                if (currentfloor && currentfloor != radarFloor) {
                  needupdate = 0
                } else {
                  needupdate = 1
                }
                if (this.getSelectFloorInfo.id == this.radarList[item].floor) {
                  position123.x += perCardDistance
                  perCardDistance += 1
                  if (perCardDistance >= 2) perCardDistance = 0
                  this.models.createRadarNumberCard(position123, message.peopleCountBos[item1].radarSn, message.peopleCountBos[item1].peopleNum, this.radarList[item].floor, 1, needupdate, this.getRadarCardPosition)
                }
              }
            }
          }
        }
      }
      this.websocketConnector = new MyWebsocketConnector(this.websocketAddr, 45000, onopenCallback, onmessageCallback)
    }).catch((error) => {
      console.log('error')
      this.$message.error(error)
    })

    /** @author Lyc
     * 拿到雷达和设备在地图上显示
     */
    setTimeout(() => {
      const canvasDom = document.querySelector('canvas')
      if (canvasDom) {
        canvasDom.addEventListener(
          'contextmenu',
          (e) => {
            this.onClickPole(e)
            // this.clickCreateVideoCard(e);
            return true
          },
          true
        )
      }
    }, 1000)
  }
}
</script>

<style scoped>
#webglContainer {
  position: relative;
  height: 100%;
  width: 100%;
}

.device-option {
  width: 200px;
}

.device-detail {
  width: 200px;
}

.floor-selector {
  position: absolute;
  right: 5px;
  top: 10px;
  width: 300px;
  height: 100px;
  background: transparent;
}

.device-form {
  overflow: inherit;
  border: 0.5px solid #666;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background: #0000;
  color: white;
  font-size: 18px;
  text-align: center;
}
</style>
