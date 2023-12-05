<template>
  <div class="map-canvas">
    <section id="webglContainer" ref="container"/>
  </div>
</template>

<script>
import * as THREE from 'three'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import SelfModels from '@/components/models/SelfModels'
import {initTrack, websocketMessage} from '@/components/models/trackRelation'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {apiGetDevice} from '@/api/device/index'
import {MyWebsocketConnector} from '@/utils/myWebsocketConnector'
import {getRealtimeTraceWebsocketAddr, sendFloorLevel} from '@/api/index'
import {getDefenceInfo, getVideoStream} from '@/api/device/BasicConfig'
import {log} from 'three'
import {DEVICE} from '../../../store/config'
import {getPeopleCountingWebsocketAddr} from '@/api/index'
import {getAllRadarStatus} from '@/api/index'
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'
import {CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {getFloorShot} from "../../../api/setMap/setMap";

const BALLHEADCAMERA = 2
const GUNCAMERA = 3
const RADAR = 1
const WARNINGLIGHT = 4
const RECOGNITION = 5

const deviceNameArray = []
deviceNameArray[RADAR] = 'radar'
deviceNameArray[BALLHEADCAMERA] = 'ballHeadCamera'
deviceNameArray[GUNCAMERA] = 'gunCamera'
deviceNameArray[WARNINGLIGHT] = 'warningLight'
deviceNameArray[RECOGNITION] = 'Recognition'

export default {
  name: 'Model',
  data() {
    return {
      // 装场景的容器
      container: {},
      // 模型对象
      models: null,
      //  轨迹线
      line: {},
      //  轨迹线点
      points: {},
      websocketConnector: null,
      // websocket地址
      websocketAddr: '',
      radarList: null,
      labelRenderer: null,
      // 视频卡片
      videoCardGroup: null,
      // 模型缩放比
      Scaling: {},
      // 记录选中楼层的ID
      selectFloorID: 0,
      intervalClock: 0 //定时器锁
    }
  },
  async mounted() {
    /* sendFloorLevel(0).then()*/
    if (this.shareModels == null) {
      console.log('重新加载模型')
      await this.initShareModels()
      await this.initMap()
    } else {
      console.log('加载已有模型+++++++++++++')
      this.initSelfModels()
    }
    console.log('jj')
    // 加载模型的函数在这里重构
    await this.promiseInitModel()
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
        const res = {
          offline: message.offline,
          list: message.peopleCountBos
        }
        if (res.offline !== 0) { // 离线
          let perCardDistance = 0
            for (let item4 = 0; item4 < this.radarList.length; item4++) {
              for (let item15 = 0; item15 < res.list.length; item15++) {
                if (res.list[item15].radarOnline === '0' && this.radarList[item4].deviceSn === res.list[item15].radarSn) {
                  var position1234 = {}
                  position1234.x = this.radarList[item4].deviceMapX
                  position1234.y = this.radarList[item4].deviceMapY + 0.5
                  position1234.z = this.radarList[item4].deviceMapZ
                  var currentfloor1 = this.floor
                  var radarFloor1 = this.radarList[item4].floor + 'F'
                  var needupdate1
                  if (currentfloor1 && currentfloor1 !== radarFloor1) {
                    needupdate1 = 0
                  } else {
                    needupdate1 = 1
                  }
                  // console.log(needupdate1)
                  if (this.getSelectHomeFloorInfoID == this.radarList[item4].floor) {
                    position1234.x += perCardDistance
                    perCardDistance += 1
                    if (perCardDistance >= 2) perCardDistance = 0
                    this.models.createRadarNumberCard(position1234, res.list[item15].radarSn, 0, this.radarList[item4].floor, 0, needupdate1, this.getRadarCardPosition)
                  }
                }
              }
            }
        }
        if (message !== 1) {
          let perCardDistance = 0
          for (var item3 = 0; item3 < this.radarList.length; item3++) {
            for (var item2 = 0; item2 < message.peopleCountBos.length; item2++) {
              if (this.radarList[item3].deviceSn === message.peopleCountBos[item2].radarSn && message.peopleCountBos[item2].radarOnline != 0) {
                var position123 = {}
                position123.x = this.radarList[item3].deviceMapX
                position123.y = this.radarList[item3].deviceMapY + 0.5
                position123.z = this.radarList[item3].deviceMapZ
                var currentfloor = this.floor
                var radarFloor = this.radarList[item3].floor + 'F'
                var needupdate
                if (currentfloor && currentfloor !== radarFloor) {
                  needupdate = 0
                } else {
                  needupdate = 1
                }
                if (this.getSelectHomeFloorInfoID == this.radarList[item3].floor) {
                  position123.x += perCardDistance
                  perCardDistance += 1
                  if (perCardDistance >= 2) perCardDistance = 0
                  this.models.createRadarNumberCard(position123, message.peopleCountBos[item2].radarSn, message.peopleCountBos[item2].peopleNum, this.radarList[item3].floor, 1, needupdate, this.getRadarCardPosition)
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
  },
  computed: {
    ...mapGetters('setMap', {
      initMapInfo: 'getInitMapInfo'
    }),
    ...mapGetters('models', {
      shareModels: 'getShareModels', // 这里拿到shareModels的值
      getSelectHomeFloorInfo: 'getSelectHomeFloorInfo',
      getRadarCardPosition: 'getRadarCardPosition',
      getSelectHomeFloorInfoID: 'getSelectHomeFloorInfoID',
      getSaveTraceParam: 'getSaveTraceParam'
    }),
    ...mapGetters('trajectory', {
      ws: 'getLineWebsocket'
    }),
    ...mapGetters('traceReplay', {
      floor: 'getFloor'
    })
  },

  methods: {
    // 存模型
    ...mapActions('selfModelInfo', ['saveMainPageSelfModel']),
    ...mapMutations('models', ['setShareModels', 'uploadSelectHomeFloorInfoID', 'uploadSaveTraceParam', 'uploadTraceParam', 'uploadRadarCardPosition']),
    ...mapActions('models', [
      'initShareModels' // 这里调用initShareModels
    ]),
    ...mapActions('setMap', ['initMap']),
    // 双击获取坐标
    onclick() {
      console.log('点击到了')
    },
    // 将mounted的定时器函数包装成返回Promise的值
    promiseInitModel() {
      return new Promise(resolve => {
        console.log('***********************')
        console.log(window.localStorage.getItem('infoMsg'))
        const initMapMsg = JSON.parse(window.localStorage.getItem('infoMsg'))
        console.log(initMapMsg)
        if (initMapMsg && this.shareModels != null) {
          const handeler = this
          this.shareModels.loadSimapleModel(handeler)
          this.shareModels.initPlaneByHandeler(initMapMsg, handeler)
          this.initSelfModels()
          // this.getAllDevice()
          // this.getAllDefenceArea()

          getRealtimeTraceWebsocketAddr()
            .then((res) => {
              this.websocketAddr = res.msg
              const existSet = new Set() //创建一个保存雷达获取的所有人tid
              const onopenCallback = () => {
                console.log('实时轨迹websocket已连接')
                this.websocketConnector.heartStart()
              }
              const onmessageCallback = (message) => {
                this.websocketConnector.heartReset()
                this.websocketMessage(message)
                // if (this.$store.state.models.selectHomeFloorInfoID && (this.$store.state.models.selectHomeFloorInfoID == message.floor)) { //仅对选中的楼层的雷达轨迹点
                //   existSet.add(message.tid) //将tid存入set中
                // }
                // /* 人物消失逻辑开始 */
                // if(!this.intervalClock) {
                //   this.intervalClock = setInterval(() => {
                //     const existArray = Array.from(existSet) // set转数组，方便循环遍历
                //     for(let i = 0 ; i < existArray.length; i++) {
                //       if(this.$store.state.traceReplay.existPeopleImage.indexOf(existArray[i]) == -1) {
                //         this.models.scene.remove(this.models.scene.getObjectByName(existArray[i])) // 2s内未找到该人的tid，在模型上删除这个人的图片
                //         existSet.delete(existArray[i]) // 在set中删除这个人的记录
                //       }
                //     }
                //     this.$store.state.traceReplay.existPeopleImage = Array.from(existSet) //两秒后将剩余存在的人放入Vuex中，已进行下一轮判定
                //     existSet.clear() // 清空set,已方便下一轮判断
                //     clearInterval(this.intervalClock) // 清空该定时器
                //     this.intervalClock = 0 // 清空该定时器
                //   }, 2000)
                // }
                /* 人物消失逻辑结束 */
              }
              this.websocketConnector = new MyWebsocketConnector(
                this.websocketAddr,
                // '175.178.56.233:8281/index/radar_data',
                45000,
                onopenCallback,
                onmessageCallback
              )
              this.initTrack()
              this.saveMainPageSelfModel(this.models)
              // this.initSelfModels(); // 执行selfmodel
            })
            .catch((error) => {
              this.$message.error(error)
            })
        }
        resolve(1)
      })
    },

    // 在mounted中主动调用
    initSelfModels() {
      this.container = this.$refs.container
      this.models = new SelfModels(this.container, this.shareModels)
      this.container.addEventListener('click', this.onClickVideo)
      console.log(this.models, '初始化私有模型', 11111111111)
      // this.labelRenderer = new CSS2DRenderer()
      // this.labelRenderer.setSize(this.$refs.container.clientWidth, this.$refs.container.clientHeight)
      // this.labelRenderer.domElement.style.position = 'absolute'
      // this.labelRenderer.domElement.style.top = '0px'
      // this.$refs.container.appendChild(this.labelRenderer.domElement)
      // const orbitControls = new OrbitControls(this.models.camera, this.labelRenderer.domElement)
      // orbitControls.maxAzimuthAngle = Math.PI / 2
      // orbitControls.maxPolarAngle = Math.PI / 2 - 0.01
      // 将selfModels加入vuex
      this.initTrack()
      this.animation()
    },
    // 请求设备
    getDevice(param) {
      console.log('pppppppppppppppparam', param)
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
    // 前面主动调用渲染bim
    animation() {
      // 请求下一次渲染
      requestAnimationFrame(this.animation)
      // 渲染一帧的方法
      this.models.renderer.render(this.models.scene, this.models.camera)
      // this.labelRenderer.render(this.models.scene, this.models.camera)
    },
    initTrack,
    websocketMessage,

    // 初始化雷达、枪机、球机 ********li 2021/7/12
    initDevice(deviceList, floor) {
      this.radarList = []
      for (let i = 0; i < deviceList.length; i++) {
        const rotation = new THREE.Vector2(0, 0)
        const position = new THREE.Vector3(
          deviceList[i].deviceMapX,
          deviceList[i].deviceMapY,
          deviceList[i].deviceMapZ
        )

        if (deviceList[i].radarAngle || deviceList[i].radarPortraitAngle) {
          // console.log('cccccccccccccccccccccccccccccccccccccccccccccccccc')

          rotation.x = (deviceList[i].radarAngle * Math.PI) / 180
          // console.log(rotation.x)
          rotation.y = (deviceList[i].radarPortraitAngle * Math.PI) / 180
        } else if (deviceList[i].cameraAngle || deviceList[i].cameraPortraitAngle) {
          // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

          rotation.x = (deviceList[i].cameraAngle * Math.PI) / 180
          rotation.y = (deviceList[i].cameraPortraitAngle * Math.PI) / 180
        } else if (deviceList[i].sensorPortraitAngle || deviceList[i].sensorAngle) {
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
          if(deviceList[i].deviceType == 1) this.radarList.push(deviceList[i])// 此处用于保存雷达卡片的雷达列表
          // this.radarList = deviceList
        }
      }
    },
    // 初始化雷达、枪机、球机*********
    loadDevice(deviceType, deviceName, deviceSn, position, rotation, floor, groupId, videoUrl) {
      if (videoUrl) {
        console.log(videoUrl)
      }
      let url = ''
      console.log(rotation)
      console.log('asdsadsadsadsadasasdsd')

      switch (deviceType) {
        case 1:
          url = '/selfModels/other/radar/newRadar.fbx'
          deviceName = 'radar'
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
      const loader = new FBXLoader()
      console.log(url)
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
              if (this.scaling.gunCameraLocalScale) {
                if (this.scaling.gunCameraLocalScale - 0.2 > 0) {
                  object.scale.setScalar(this.scaling.gunCameraLocalScale - 0.2)
                } else object.scale.setScalar(this.scaling.gunCameraLocalScale)
              } else {
                object.scale.set(0.004, 0.004, 0.004)
              }
            }
            if (deviceType === 1) {
              if (this.scaling.radarScale) {
                object.scale.setScalar(this.scaling.radarScale)
              } else {
                object.scale.set(0.08, 0.08, 0.08)
              }
            }
            if (deviceType === 3) {
              if (this.scaling.ballHeadCameraLocalScale) {
                if (this.scaling.ballHeadCameraLocalScale - 0.2 > 0) {
                  object.scale.setScalar(this.scaling.ballHeadCameraLocalScale - 0.2)
                } else object.scale.setScalar(this.scaling.ballHeadCameraLocalScale)
              } else {
                object.scale.set(0.04, 0.04, 0.04)
              }
            }
            if(deviceType === 4) {
              if (this.scaling.sensorScale) {
                object.scale.setScalar(this.scaling.sensorScale)
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
            this.models.scene.add(obj)
            // if(obj.name == 'radar'){
            //   var number = 0;
            //   var needupdate = 1;
            //   // this.models.createRadarNumberCard(obj.children[0].position,obj.deviceSn,number,obj.floor,0,needupdate);
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
          for (let i = 0; i < defenceInfo.length; i++) {
            if (this.selectFloorID == defenceInfo[i].floor) {
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
        defencePointNode.push(new THREE.Vector3(defenceArea.defenceInfo.points[i].posX, defenceArea.defenceInfo.points[i].posY, defenceArea.defenceInfo.points[i].posZ))
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
    /**
     * 左键点击摄像头模型
     */
    onClickVideo(event) {
      this.clickSensor() // 注册点击到雷达事件
      if (this.models.getClickModel()) {
        switch (this.models.getClickModel().name) {
          case DEVICE.GUN_CAMERA:
            this.currentDeviceName = '枪机'
            // this.models.createVideoCard(this.models.getClickModel().children[0].position, this.models.getClickModel().floor,this.models.getClickModel().videoUrl)
            getVideoStream(this.models.getClickModel().deviceSn).then(res => {
              this.videoCardGroup = this.models.createVideoCard1(this.models.getClickModel().children[0].position, this.models.getClickModel().floor, res.data)
            })
            break
          case DEVICE.BALL_HEAD_CAMERA:
            this.currentDeviceName = '球机'
            // this.models.createVideoCard(this.models.getClickModel().children[0].position, this.models.getClickModel().floor,this.models.getClickModel().videoUrl)
            getVideoStream(this.models.getClickModel().deviceSn).then(res => {
              this.videoCardGroup = this.models.createVideoCard1(this.models.getClickModel().children[0].position, this.models.getClickModel().floor, res.data)
            })
            break
          case 'videoCard':
            // this.models.getClickModel().visible = false
            // this.models.getClickModel().scale.x = 0
            // this.models.getClickModel().scale.y = 0
            // this.models.getClickModel().scale.z = 0
            console.log('scene:', this.models.scene)
            console.log('videoCardGroup:', this.videoCardGroup)

            this.models.camera.position.x = this.models.getClickModel().cameraPositionx
            this.models.camera.position.y = this.models.getClickModel().cameraPositiony
            this.models.camera.position.z = this.models.getClickModel().cameraPositionz
            this.models.camera.rotation.x = this.models.getClickModel().cameraRotationx
            this.models.camera.rotation.y = this.models.getClickModel().cameraRotationy
            this.models.camera.rotation.z = this.models.getClickModel().cameraRotationz

            this.models.scene.remove(this.videoCardGroup)
            break
          default:
            break
        }
      }
    },
    /**
     * 点击到传感器后，将传感器sn号emit父组件，同时打开传感器卡片
     */
    clickSensor() {
      // if(this.models.getClickModel().name == 'sensor' || (this.models.getClickModel().name == 'radarCard' && this.models.getClickModel().deviceSn)) { //点击的是雷达
      //   this.$emit('openSensorCard', this.models.getClickModel().deviceSn)
      // }
      if(this.models.getClickModel().name == 'sensor') {
        this.$emit('openSensorCard', this.models.getClickModel().deviceSn)
      }
    }
  },
  watch: {
    getSelectHomeFloorInfo: function (val) {
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
      // 清空模型上所有的人物图片,与线条
      setTimeout(() => {
        let pictureName = this.$store.state.traceReplay.trailImgName
        for(let i = 0; i < pictureName.length; i++) {
          if(this.models.scene.getObjectByName(pictureName[i])) this.models.scene.remove(this.models.scene.getObjectByName(pictureName[i]))
        }
        this.$store.state.traceReplay.trailImgName = [] //情况后，赋值空数组
      }, 1000) //有时延，建议1s后清空
      if (val == '全部楼层') {
        location.reload()
      }
      this.models.orbitControls.enableDamping = false
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
      if (val == 'mainModel') {
        for (let i = 0; i < length; i++) {
          mainModelChildren[i].visible = true
        }
        let param = {}
        param.floorName = val
        getFloorShot(param).then(res => {
          this.uploadSaveTraceParam(res.data)
          let radarCardPosition = {}
          radarCardPosition.positionX = this.getSaveTraceParam.radarCardScaleX
          radarCardPosition.positionY = this.getSaveTraceParam.radarCardScaleY
          this.uploadRadarCardPosition(radarCardPosition)
          let traceParam = {}
          traceParam.scale = res.data.imageScale
          traceParam.positionX = res.data.trailOffsetX
          traceParam.positionY = res.data.trailOffsetY
          traceParam.positionZ = res.data.trailOffsetZ
          this.uploadTraceParam(traceParam)
          this.scaling = {}
          let camera = this.models.scene.getObjectByName("全局摄像机")
          camera.position.x = res.data.cameraX
          camera.position.y = res.data.cameraY
          camera.position.z = res.data.cameraZ
          // 处理单层楼时的旋转值
          if (res.data.rotationY || res.data.rotationY == 0) mainModel.rotation.y = res.data.rotationY
          // 处理单层的旋转中心位置
          let centerX = 0
          if (res.data.centerX) centerX = res.data.centerX
          let centerY = 0
          if (res.data.centerY) centerY = res.data.centerY
          let centerZ = 0
          if (res.data.centerZ) centerZ = res.data.centerZ
          this.models.orbitControls.target.set(centerX, centerY, centerZ)
          this.models.orbitControls.enableDamping = true
          if (!res.data.dampingFactor) this.models.orbitControls.dampingFactor = 0.07
          else {
            this.models.orbitControls.dampingFactor = res.data.dampingFactor
          }
          this.models.orbitControls.update()
          this.models.orbitControls.saveState()
          this.scaling.gunCameraLocalScale = res.data.gunCameraLocalScale
          this.scaling.ballHeadCameraLocalScale = res.data.ballHeadCameraLocalScale
          this.scaling.warningLightScale = res.data.warningLightScale
          this.scaling.radarScale = res.data.radarScale
          this.scaling.sensorScale = res.data.sensorScale
          let ballHeadCamera = this.models.scene.getObjectByName('ballHeadCamera')
          if (ballHeadCamera) {
            ballHeadCamera.scale.setScalar(res.data.ballHeadCameraLoadScale)
          }
          let gunCamera = this.models.scene.getObjectByName('gunCamera')
          if (gunCamera) {
            gunCamera.scale.setScalar(res.data.gunCameraLoadScale)
          }
          let testWarningLight = this.models.scene.getObjectByName('testWarningLight')
          if (testWarningLight) {
            testWarningLight.scale.setScalar(res.data.warningLightScale)
          }
          let testRadar = this.models.scene.getObjectByName('radar')
          if (testRadar) {
            testRadar.scale.setScalar(res.data.radarScale)
          }
          this.selectFloorID = res.data.id
          this.uploadSelectHomeFloorInfoID(this.selectFloorID)
          this.getDevice(res.data.id)
          // this.getDefenceArea()
        })
      }
      foo: for (let j = 0; j < length; j++) {
        if (mainModelChildren[j].name == val && mainModelChildren[j].name.indexOf('室外') < 0) { // 通常情况，不包含室外的地图
          mainModelChildren[j].visible = true
          let param = {}
          param.floorName = mainModelChildren[j].name
          getFloorShot(param).then(res => {
            this.uploadSaveTraceParam(res.data)
            let radarCardPosition = {}
            radarCardPosition.positionX = this.getSaveTraceParam.radarCardScaleX
            radarCardPosition.positionY = this.getSaveTraceParam.radarCardScaleY
            this.uploadRadarCardPosition(radarCardPosition)
            let traceParam = {}
            traceParam.scale = res.data.imageScale
            traceParam.positionX = res.data.trailOffsetX
            traceParam.positionY = res.data.trailOffsetY
            traceParam.positionZ = res.data.trailOffsetZ
            this.uploadTraceParam(traceParam)
            this.scaling = {}
            let camera = this.models.scene.getObjectByName("全局摄像机")
            camera.position.x = res.data.cameraX
            camera.position.y = res.data.cameraY
            camera.position.z = res.data.cameraZ
            // 处理单层楼时的旋转值
            if (res.data.rotationY || res.data.rotationY == 0) mainModel.rotation.y = res.data.rotationY
            // 处理单层的旋转中心位置
            let centerX = 0
            if (res.data.centerX) centerX = res.data.centerX
            let centerY = 0
            if (res.data.centerY) centerY = res.data.centerY
            let centerZ = 0
            if (res.data.centerZ) centerZ = res.data.centerZ
            this.models.orbitControls.target.set(centerX, centerY, centerZ)
            this.models.orbitControls.enableDamping = true
            if (!res.data.dampingFactor) this.models.orbitControls.dampingFactor = 0.07
            else {
              this.models.orbitControls.dampingFactor = res.data.dampingFactor
            }
            this.models.orbitControls.update()
            this.models.orbitControls.saveState()
            this.scaling.gunCameraLocalScale = res.data.gunCameraLocalScale
            this.scaling.ballHeadCameraLocalScale = res.data.ballHeadCameraLocalScale
            this.scaling.warningLightScale = res.data.warningLightScale
            this.scaling.radarScale = res.data.radarScale
            this.scaling.sensorScale = res.data.sensorScale
            let ballHeadCamera = this.models.scene.getObjectByName('ballHeadCamera')
            if (ballHeadCamera) {
              ballHeadCamera.scale.setScalar(res.data.ballHeadCameraLoadScale)
            }
            let gunCamera = this.models.scene.getObjectByName('gunCamera')
            if (gunCamera) {
              gunCamera.scale.setScalar(res.data.gunCameraLoadScale)
            }
            let testWarningLight = this.models.scene.getObjectByName('testWarningLight')
            if (testWarningLight) {
              testWarningLight.scale.setScalar(res.data.warningLightScale)
            }
            let testRadar = this.models.scene.getObjectByName('radar')
            if (testRadar) {
              console.log('testRadar', testRadar)
              testRadar.scale.setScalar(res.data.radarScale)
            }
            this.selectFloorID = res.data.id
            this.uploadSelectHomeFloorInfoID(this.selectFloorID)
            this.getDevice(res.data.id)
            // this.getDefenceArea()
          })
          break
        }
        else if (mainModelChildren[j].name == val && mainModelChildren[j].name.indexOf('室外') >= 0) { // 第二种情况，点击了带室外场景的楼层
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
            let traceParam = {}
            traceParam.scale = res.data.imageScale
            traceParam.positionX = res.data.trailOffsetX
            traceParam.positionY = res.data.trailOffsetY
            traceParam.positionZ = res.data.trailOffsetZ
            this.uploadTraceParam(traceParam)
            this.scaling = {}
            let camera = this.models.scene.getObjectByName("全局摄像机")
            camera.position.x = res.data.cameraX
            camera.position.y = res.data.cameraY
            camera.position.z = res.data.cameraZ
            // 处理单层楼时的旋转值
            if (res.data.rotationY || res.data.rotationY == 0) mainModel.rotation.y = res.data.rotationY
            // 处理单层的旋转中心位置
            let centerX = 0
            if (res.data.centerX) centerX = res.data.centerX
            let centerY = 0
            if (res.data.centerY) centerY = res.data.centerY
            let centerZ = 0
            if (res.data.centerZ) centerZ = res.data.centerZ
            this.models.orbitControls.target.set(centerX, centerY, centerZ)
            this.models.orbitControls.enableDamping = true
            if (!res.data.dampingFactor) this.models.orbitControls.dampingFactor = 0.07
            else {
              this.models.orbitControls.dampingFactor = res.data.dampingFactor
            }
            this.models.orbitControls.update()
            this.models.orbitControls.saveState()
            this.scaling.gunCameraLocalScale = res.data.gunCameraLocalScale
            this.scaling.ballHeadCameraLocalScale = res.data.ballHeadCameraLocalScale
            this.scaling.warningLightScale = res.data.warningLightScale
            this.scaling.radarScale = res.data.radarScale
            this.scaling.sensorScale = res.data.sensorScale
            let ballHeadCamera = this.models.scene.getObjectByName('ballHeadCamera')
            if (ballHeadCamera) {
              ballHeadCamera.scale.setScalar(res.data.ballHeadCameraLoadScale)
            }
            let gunCamera = this.models.scene.getObjectByName('gunCamera')
            if (gunCamera) {
              gunCamera.scale.setScalar(res.data.gunCameraLoadScale)
            }
            let testWarningLight = this.models.scene.getObjectByName('testWarningLight')
            if (testWarningLight) {
              testWarningLight.scale.setScalar(res.data.warningLightScale)
            }
            let testRadar = this.models.scene.getObjectByName('radar')
            if (testRadar) {
              console.log('testRadar', testRadar)
              testRadar.scale.setScalar(res.data.radarScale)
            }
            this.selectFloorID = res.data.id
            this.uploadSelectHomeFloorInfoID(this.selectFloorID)
            this.getDevice(res.data.id)
            // this.getDefenceArea()
          })
          break
        }
        else if (mainModelChildren[j].name != val && mainModelChildren[j].name.indexOf('室外') >= 0) { // 第三种情况，点击的楼层名包含在室外场景结构中
          let outerModel = mainModelChildren[j]
          for(let k = 0; k < outerModel.children.length; k++) {
            if (outerModel.children[k].name == val) {
              outerModel.children[k].visible = true
              let param = {}
              param.floorName = outerModel.children[k].name
              getFloorShot(param).then(res => {
                this.uploadSaveTraceParam(res.data)
                let radarCardPosition = {}
                radarCardPosition.positionX = this.getSaveTraceParam.radarCardScaleX
                radarCardPosition.positionY = this.getSaveTraceParam.radarCardScaleY
                this.uploadRadarCardPosition(radarCardPosition)
                let traceParam = {}
                traceParam.scale = res.data.imageScale
                traceParam.positionX = res.data.trailOffsetX
                traceParam.positionY = res.data.trailOffsetY
                traceParam.positionZ = res.data.trailOffsetZ
                this.uploadTraceParam(traceParam)
                this.scaling = {}
                let camera = this.models.scene.getObjectByName("全局摄像机")
                camera.position.x = res.data.cameraX
                camera.position.y = res.data.cameraY
                camera.position.z = res.data.cameraZ
                // 处理单层楼时的旋转值
                if (res.data.rotationY || res.data.rotationY == 0) mainModel.rotation.y = res.data.rotationY
                // 处理单层的旋转中心位置
                let centerX = 0
                if (res.data.centerX) centerX = res.data.centerX
                let centerY = 0
                if (res.data.centerY) centerY = res.data.centerY
                let centerZ = 0
                if (res.data.centerZ) centerZ = res.data.centerZ
                this.models.orbitControls.target.set(centerX, centerY, centerZ)
                this.models.orbitControls.enableDamping = true
                if (!res.data.dampingFactor) this.models.orbitControls.dampingFactor = 0.07
                else {
                  this.models.orbitControls.dampingFactor = res.data.dampingFactor
                }
                this.models.orbitControls.update()
                this.models.orbitControls.saveState()
                this.scaling.gunCameraLocalScale = res.data.gunCameraLocalScale
                this.scaling.ballHeadCameraLocalScale = res.data.ballHeadCameraLocalScale
                this.scaling.warningLightScale = res.data.warningLightScale
                this.scaling.radarScale = res.data.radarScale
                this.scaling.sensorScale = res.data.sensorScale
                let ballHeadCamera = this.models.scene.getObjectByName('ballHeadCamera')
                if (ballHeadCamera) {
                  ballHeadCamera.scale.setScalar(res.data.ballHeadCameraLoadScale)
                }
                let gunCamera = this.models.scene.getObjectByName('gunCamera')
                if (gunCamera) {
                  gunCamera.scale.setScalar(res.data.gunCameraLoadScale)
                }
                let testWarningLight = this.models.scene.getObjectByName('testWarningLight')
                if (testWarningLight) {
                  testWarningLight.scale.setScalar(res.data.warningLightScale)
                }
                let testRadar = this.models.scene.getObjectByName('radar')
                if (testRadar) {
                  console.log('testRadar', testRadar)
                  testRadar.scale.setScalar(res.data.radarScale)
                }
                this.selectFloorID = res.data.id
                this.uploadSelectHomeFloorInfoID(this.selectFloorID)
                this.getDevice(res.data.id)
                // this.getDefenceArea()
              })
              break foo // 跳到最外层foo循环
            }
          }
        }
      }
    },
    initMapInfo: function (val, oldVal) {
      // console.log(this.shareModels.scene, '初始化sharemodels');
    },

    // shareModels: function () {
    //   console.log("***********************")
    //   console.log(window.localStorage.getItem('infoMsg'))
    //   const initMapMsg = JSON.parse(window.localStorage.getItem('infoMsg'))
    //   console.log(initMapMsg)
    //   if (initMapMsg && this.shareModels != null) {
    //     this.shareModels.initPlane(initMapMsg)
    //     this.initSelfModels()
    //     setTimeout(() => {
    //       this.getDevice()
    //       this.getDefenceArea()
    //     }, 800)

    //     getRealtimeTraceWebsocketAddr()
    //       .then((res) => {
    //         this.websocketAddr = res.msg
    //         const onopenCallback = () => {
    //           console.log('实时轨迹websocket已连接')
    //           this.websocketConnector.heartStart()
    //         }
    //         const onmessageCallback = (message) => {
    //           this.websocketConnector.heartReset()
    //           this.websocketMessage(message, this.getfloor)
    //         }
    //         this.websocketConnector = new MyWebsocketConnector(
    //           this.websocketAddr,
    //           45000,
    //           onopenCallback,
    //           onmessageCallback
    //         )
    //         this.initTrack()
    //         this.saveMainPageSelfModel(this.models)
    //         //this.initSelfModels(); // 执行selfmodel
    //       })
    //       .catch((error) => {
    //         this.$message.error(error)
    //       })
    //   }
    // },
    floor() {
      let level = 0
      switch (this.floor) {
        case '全部楼层显示':
          level = 0
          break
        case '24F':
          level = 24
          break
        case '25F':
          level = 25
          break
        case '26F':
          level = 26
          break
      }
      console.log(level, 55555)
      /* sendFloorLevel(level).then(res =>
         console.log(res, 555555555)
       )*/
    }

    // 防区更新
  },
  created() {
    // this.getRadarOnlineInfo()
  },
  destroyed() {
    this.setShareModels(null)
    this.saveMainPageSelfModel(null)
    clearInterval(this.intervalClock) // 清空该定时器
    this.intervalClock = 0 // 清空该定时器
    // window.location.reload()
  }
}
</script>

<style lang="scss" scoped>
.map-canvas {
  width: 100%;
  height: 100%;

  section {
    height: 100%;
  }
}
</style>

<style scoped>
/deep/ canvas {
  width: 100% !important;
  height: 100% !important;
  color: #0f94d9;
}
</style>
