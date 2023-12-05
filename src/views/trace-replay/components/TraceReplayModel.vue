<template>
  <div class="map-canvas"
       v-loading="loading"
       element-loading-text="加载轨迹线中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <section id="webglContainer" ref="container"/>
  </div>
</template>

<script>
import * as THREE from 'three'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import SelfModels from '@/components/models/SelfModels'
import {initTraceReplay} from '@/components/models/trackRelation'
import {apiGetDevice} from '@/api/device/index'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {getFloorShot} from "../../../api/setMap/setMap";

const POLE = 10
const BALLHEADCAMERA = 2
const GUNCAMERA = 3
const RADAR = 1
const WARNINGLIGHT = 4
const RECOGNITION = 5
const WARNINGLIGHTHOST = 6

const deviceNameArray = []
deviceNameArray[RADAR] = 'radar'
deviceNameArray[BALLHEADCAMERA] = 'ballHeadCamera'
deviceNameArray[GUNCAMERA] = 'gunCamera'
deviceNameArray[WARNINGLIGHT] = 'warningLight'
deviceNameArray[RECOGNITION] = 'Recognition'

export default {
  name: 'TraceReplayModel',
  data() {
    return {
      // 装场景的容器
      container: {},
      models: null,
      isInitPole: false,
      //  视频平面

      //  防区
      //   arrayDefence: [],
      lineGeometry: {},
      line: {},
      defenceEnable: false,

      //  轨迹线
      spheres: {},
      points: {},
      //  球消失速度
      toggle: 0,
      //  同步时间
      timeSyn: 0,
      //  便利索引
      allIndex: {},
      clock: new THREE.Clock(),
      //  动画
      mixer: {},
      //  模型
      personModels: {},
      existTimeClick: null, // 仅允许一个定时器的存在
      loading: false //是否显示加载
    }
  },
  async mounted() {
    if (this.shareModels == null) {
      console.log('重新加载模型')
      await this.initShareModels()
      await this.initMap()
    } else {
      console.log('加载已有模型+++++++++++++')
      this.initSelfModels()
    }
  },
  computed: {
    ...mapGetters('setMap', {
      initMapInfo: 'getInitMapInfo'
    }),
    ...mapGetters('models', {
      shareModels: 'getShareModels', // 这里拿到shareModels的值
      getSelectHomeFloorInfo: 'getSelectHomeFloorInfo',
    }),
    ...mapGetters('traceReplay', {
      getTrailPointsInfo: 'getTrailPointsInfo',
      getCheckWarningInfo: 'getCheckWarningInfo'
    })
  },
  methods: {
    ...mapActions('models', [
      'initShareModels' // 这里调用initShareModels
    ]),
    ...mapMutations('models', ['setShareModels', 'uploadSaveTraceParam', 'uploadSelectHomeFloorInfoID', 'uploadRadarCardPosition', 'uploadTraceParam', 'uploadSelectHomeFloorInfo']),
    ...mapActions('setMap', ['initMap']),
    ...mapActions('selfModelInfo', ['saveTraceReplaySelfModel']),
    ...mapActions('traceReplay', {
      updateTrailPointsInfoByAction: 'updateTrailPointsInfoByAction',
      updateCheckWarningInfo: 'updateCheckWarningInfo'
    }),
    // 在mounted中主动调用
    initSelfModels() {
      this.container = this.$refs.container
      this.models = new SelfModels(this.container, this.shareModels)
      this.container.addEventListener('click', this.onClickVideo)
      console.log(this.models, '初始化私有模型', 11111111111)
      this.animation()
    },
    // 初始化雷达、枪机、球机 ********li 2021/7/12
    initDevice(deviceList) {
      for (let i = 0; i < deviceList.length; i++) {
        const position = new THREE.Vector3(
          deviceList[i].deviceMapX,
          deviceList[i].deviceMapY,
          deviceList[i].deviceMapZ
        )
        const rotation = deviceList[i].deviceAngle
        this.loadDevice(
          deviceList[i].deviceType,
          deviceList[i].deviceName,
          deviceList[i].deviceSn,
          position,
          rotation
        )
      }
    },
    // 初始化雷达、枪机、球机*********
    loadDevice(deviceType, deviceName, deviceSn, position, rotation) {
      let url = ''

      switch (deviceType) {
        case 1:
          url = '/selfModels/other/radar/newRadar.fbx'
          break
        case 2:
          url = '/selfModels/camera/qiuji/ball_camera1.fbx'
          break
        case 3:
          url = '/selfModels/camera/qiangji/camera.fbx'
          break
        default:
          url = ''
      }

      const deviceInfo = {deviceType, deviceName, deviceSn, position, rotation}
      const loader = new FBXLoader()
      console.log(url)

      return new Promise((resolve, reject) => {
        loader.load(
          url,
          (object) => {
            object.position.x = position.x
            object.position.y = position.y
            object.position.z = position.z
            object.rotation.y = rotation

            if (deviceType === 3) {
              object.scale.set(0.01, 0.01, 0.01)
            }
            if (deviceType === 1) {
              object.scale.set(0.2, 0.2, 0.2)
            }
            if (deviceType === 2) {
              object.scale.set(0.1, 0.1, 0.1)
            }
            const obj = new THREE.Object3D()
            obj.deviceInfo = deviceInfo

            obj.add(object)
            console.log('deviceInfo', deviceInfo)
            console.log('object.deviceInfo', object.deviceInfo)

            this.models.scene.add(obj)
            // this.radarModels.push(deviceInfo);
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
    // 前面主动调用渲染bim
    animation() {
      // 请求下一次渲染
      requestAnimationFrame(this.animation)
      // 渲染一帧的方法
      this.models.renderer.render(this.models.scene, this.models.camera)
    },
    initTraceReplay,
    /**
     * 获取预警跳转过来的值，并将其轨迹显示在对应的楼层上
     */
    async drawWarningTrace() {
      // 第一步，获取报警的楼层，并通过Vuex将楼层显示到对应的楼层
      let str = this.getCheckWarningInfo.alarmLocation
      switch (str) { // 注意此处仅对茶室的楼层做个对应关系，因为建立的设备组与楼层的名称不对应，故硬编码；建议日后设定组与楼层名称保持一致，泛化这段代码
        case '茶室测试组':
          this.uploadSelectHomeFloorInfo('茶室')
          break;
        case '会议室测试组':
          this.uploadSelectHomeFloorInfo('会议室')
          break;
        default:
          this.uploadSelectHomeFloorInfo(str)
      }
      // 第二步，获取对应时间段的轨迹数据
      let sendParam = {}
      sendParam.startTime = this.getCheckWarningInfo.startTime
      sendParam.endTime = this.getCheckWarningInfo.endTime
      sendParam.groupId = this.getCheckWarningInfo.groupId
      await this.updateTrailPointsInfoByAction(sendParam)
      // 第三步， 清除从报警列表中点入的报警信息，避免重复加载
      this.updateCheckWarningInfo({})
    },
    /**
     * 清除轨迹线
     */
    clearLineAndCard() {
      clearInterval(this.$store.state.traceReplay.interValClock) // 清除定时器
      // 先清除已经存在的线名
      if (this.$store.state.traceReplay.trailLineName.length) {
        for (let k = 0; k < this.$store.state.traceReplay.trailLineName.length; k++) {
          if (this.models.scene.getObjectByName(this.$store.state.traceReplay.trailLineName[k])) {
            this.models.scene.getObjectByName(this.$store.state.traceReplay.trailLineName[k]).visible = false
            this.models.scene.remove(this.models.scene.getObjectByName(this.$store.state.traceReplay.trailLineName[k]))
          }
        }
      }
      // 清除已经存在的图像
      if (this.$store.state.traceReplay.trailImgName.length) {
        for (let k = 0; k < this.$store.state.traceReplay.trailImgName.length; k++) {
          if (this.models.scene.getObjectByName(this.$store.state.traceReplay.trailImgName[k])) {
            this.models.scene.getObjectByName(this.$store.state.traceReplay.trailImgName[k]).visible = false
            this.models.scene.remove(this.models.scene.getObjectByName(this.$store.state.traceReplay.trailImgName[k]))
          }
        }
      }
    },
  },
  watch: {
    shareModels: async function () {
      const initMapMsg = JSON.parse(window.localStorage.getItem('infoMsg'))
      if (initMapMsg && this.shareModels != null) {
        if(Object.keys(this.getCheckWarningInfo).length) {
          this.loading = true // 如果是从预警信息跳转过来时，加一个加载界面
        }
        // this.shareModels.initPlane(initMapMsg)
        await this.shareModels.initPlaneAsync(initMapMsg)
        this.loading = false
        if(Object.keys(this.getCheckWarningInfo).length) {
          this.drawWarningTrace()
        }
        this.initSelfModels() // 执行selfmodel
      }
    },
    getSelectHomeFloorInfo: function (val) {
      this.clearLineAndCard() //清除在图上的所有轨迹线与图片
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
        // mainModel.position.y += 5
        let param = {}
        param.floorName = val
        getFloorShot(param).then(res => {
          this.uploadSaveTraceParam(res.data)
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
          let traceParam = {}
          traceParam.scale = res.data.imageScale
          traceParam.positionX = res.data.trailOffsetX
          traceParam.positionY = res.data.trailOffsetY
          traceParam.positionZ = res.data.trailOffsetZ
          this.uploadTraceParam(traceParam)
          this.selectFloorID = res.data.id
          this.uploadSelectHomeFloorInfoID(this.selectFloorID)
        })
      }
      foo: for (let j = 0; j < length; j++) {
        if (mainModelChildren[j].name == val && mainModelChildren[j].name.indexOf('室外') < 0) { // 通常情况，不包含室外的地图
          mainModelChildren[j].visible = true
          let param = {}
          param.floorName = mainModelChildren[j].name
          getFloorShot(param).then(res => {
            this.uploadSaveTraceParam(res.data)
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
            let traceParam = {}
            traceParam.scale = res.data.imageScale
            traceParam.positionX = res.data.trailOffsetX
            traceParam.positionY = res.data.trailOffsetY
            traceParam.positionZ = res.data.trailOffsetZ
            this.uploadTraceParam(traceParam)
            this.selectFloorID = res.data.id
            this.uploadSelectHomeFloorInfoID(this.selectFloorID)
          })
          break
        }
        else if (mainModelChildren[j].name == val && mainModelChildren[j].name.indexOf('室外') >= 0) {// 第二种情况，点击了带室外场景的楼层
          let outerModel = mainModelChildren[j]
          for(let k = 0; k < outerModel.children.length; k++) {
            outerModel.children[k].visible = true
          }
          let param = {}
          param.floorName = mainModelChildren[j].name
          getFloorShot(param).then(res => {
            this.uploadSaveTraceParam(res.data)
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
            let traceParam = {}
            traceParam.scale = res.data.imageScale
            traceParam.positionX = res.data.trailOffsetX
            traceParam.positionY = res.data.trailOffsetY
            traceParam.positionZ = res.data.trailOffsetZ
            this.uploadTraceParam(traceParam)
            this.selectFloorID = res.data.id
            this.uploadSelectHomeFloorInfoID(this.selectFloorID)
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
                let traceParam = {}
                traceParam.scale = res.data.imageScale
                traceParam.positionX = res.data.trailOffsetX
                traceParam.positionY = res.data.trailOffsetY
                traceParam.positionZ = res.data.trailOffsetZ
                this.uploadTraceParam(traceParam)
                this.selectFloorID = res.data.id
                this.uploadSelectHomeFloorInfoID(this.selectFloorID)
              })
              break foo // 跳到最外层foo循环
            }
          }
        }
      }
    },
    // 监听点击轨迹回放的信息
    getTrailPointsInfo: {
      handler: function (val) {
        clearInterval(this.$store.state.traceReplay.interValClock) // 清除定时器
        if (val.length) this.initTraceReplay(val)
      },
      deep: true
    }
  },
  destroyed() {
    this.setShareModels(null)
    this.uploadSelectHomeFloorInfo('') //楼层清空
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

  position: fixed;
}

.text {
  z-index: 20000;
}
</style>

<style scoped>
/deep/ canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
