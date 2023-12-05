<template>
  <el-card :class="{ 'pack-up-form': isPackUp }" class="device-form" shadow="hover">
    <div slot="header" class="clearfix">
      <span @click='submitDeviceAngle'></span>
      <span style="font-size: 26px; font-weight: bold; color: #fff">设备操作</span>
      <el-button
        class="pack-up-form-btn"
        style="float: right; padding: 3px 0"
        type="text"
        @click="packUpForm"
      >
        <i v-if="isPackUp" class="el-icon-caret-right"/>
        {{ isPackUp ? "展开" : "收起" }}
        <i v-if="!isPackUp" class="el-icon-caret-left"/>
      </el-button>
      <br>
    </div>
    <div class="card-content">
      <el-menu background-color="#fff1" mode="horizontal" text-color="#fff" @select="selectMenu">
        <el-menu-item index="1">添加设备</el-menu-item>
        <el-menu-item index="2">调整模型位置</el-menu-item>
        <el-menu-item index="3">选择教学楼层</el-menu-item>
      </el-menu>
      <br>
      <!--      设备杆添加-->
      <el-form
        v-show="showMenu == 1"
        ref="formMonitor"
        :model="formMonitor"
        label-position="left"
        label-width="100px"
        size="small"
        text-color="#fff"
      >
        <el-form-item style="margin-left: -150px">
          <label>1. 右击鼠标选择创建设备</label>
          <hr>
          <label>2. 在地图上左键双击，可移动设备的位置</label>
          <hr>
          <label>3. 确定位置后，点击“保存”，即可保存设备</label>
        </el-form-item>
        <el-form-item label="设备坐标">
          <el-col :span="7">
            <el-input
              v-model="formMonitor.monitorMapX"
              autocomplete="off"
              placeholder="X"
              @change="changeMonitor"
            />
          </el-col>
          <el-col :span="1" class="line" style="text-align: center">-</el-col>
          <el-col :span="7">
            <el-input
              v-model="formMonitor.monitorMapY"
              autocomplete="off"
              placeholder="Y"
              @change="changeMonitor"
            />
          </el-col>
          <el-col :span="1" class="line" style="text-align: center"> -</el-col>
          <el-col :span="7">
            <el-input
              v-model="formMonitor.monitorMapZ"
              autocomplete="off"
              placeholder="Z"
              @change="changeMonitor"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="设备绑定组">
          <el-select v-model="formMonitor.groupId" filterable placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in monitorList"
              :key="item.monitorId"
              :label="item.monitorName"
              :value="item.monitorId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input
            v-model="formMonitor.deviceName"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item v-show="showIpInput" label="摄像头IP">
          <el-input
            v-model="formMonitor.cameraIp"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="雷达俯仰角/摄像机旋转角">
          <el-slider
            v-model="formMonitor.pitchAngle"
            :max="360"
            :min="0"
            :step="0.1"
            show-input
            @change="submitDeviceAngle"
          />
        </el-form-item>
        <el-form-item label="雷达水平角/摄像机旋转角">
          <el-slider
            v-model="formMonitor.horizontalAngle"
            :max="360"
            :min="0"
            :step="0.1"
            show-input
            @change="submitDeviceAngle"
          />
        </el-form-item>
        <el-form-item label="雷达轨迹旋转角">
          <el-slider
            v-model="formMonitor.radarTrailRotation"
            :max="180"
            :min="-180"
            :step="0.1"
            show-input
          />
        </el-form-item>
        <div>
          <el-button size="small" type="primary" @click="submitDeviceInfo">保存</el-button>
          <el-button size="small" @click="cancelDevice">取消</el-button>
        </div>
      </el-form>
      <!--      模型整体位置调整-->
      <el-form
        v-show="showMenu == 2 && showModelPosition"
        :model="mapPosition"
        label-position="left"
        label-width="100px"
        size="small"
        text-color="#fff"
      >
        <el-form-item label="PositionX">
          <el-slider
            v-model="mapPosition.positionX"
            :max="100"
            :min="-100"
            :step="0.1"
            show-input
            @change="changeMapPosition"
          />
        </el-form-item>
        <el-form-item label="PositionY">
          <el-slider
            v-model="mapPosition.positionY"
            :max="100"
            :min="-100"
            :step="0.1"
            show-input
            @change="changeMapPosition"
          />
        </el-form-item>
        <el-form-item label="PositionZ">
          <el-slider
            v-model="mapPosition.positionZ"
            :max="100"
            :min="-100"
            :step="0.1"
            show-input
            @change="changeMapPosition"
          />
        </el-form-item>
        <el-form-item label="Scaling">
          <el-slider
            v-model="mapPosition.scale"
            :max="1"
            :min="0"
            :step="0.01"
            show-input
            @change="changeMapPosition"
          />
        </el-form-item>
        <el-form-item label="rotationX">
          <el-slider
            v-model="mapPosition.rotationX"
            :max="10"
            :min="-10"
            :step="0.1"
            show-input
            @change="changeMapPosition"
          />
        </el-form-item>
        <el-form-item label="rotationY">
          <el-slider
            v-model="mapPosition.rotationY"
            :max="10"
            :min="-10"
            :step="0.1"
            show-input
            @change="changeMapPosition"
          />
        </el-form-item>
        <el-form-item label="rotationZ">
          <el-slider
            v-model="mapPosition.rotationZ"
            :max="10"
            :min="-10"
            :step="0.1"
            show-input
            @change="changeMapPosition"
          />
        </el-form-item>
        <el-form-item label="坐标缩放比例">
          <el-input
            v-model="mapPosition.coordScale"
            @change="changeMapPosition"
          />
        </el-form-item>
        <div>
          <el-button size="small" type="primary" @click="submitModelPosition">保存修改</el-button>
          <el-button size="small" @click="cancelModelPosition">取消</el-button>
        </div>
      </el-form>
      <!--      摄像头位置调整-->
      <el-form
        v-show="showMenu == 2 && showModelSize"
        :model="ModelPosition"
        label-position="left"
        label-width="120px"
        size="small"
        text-color="#fff"
      >
        <el-form-item label="摄像头positionX">
          <el-slider
            v-model="ModelPosition.cameraX"
            :max="100"
            :min="-100"
            :step="0.1"
            show-input
            @change="changeModelPosition"
          />
        </el-form-item>
        <el-form-item label="摄像头positionY">
          <el-slider
            v-model="ModelPosition.cameraY"
            :max="100"
            :min="-100"
            :step="0.1"
            show-input
            @change="changeModelPosition"
          />
        </el-form-item>
        <el-form-item label="摄像头positionZ">
          <el-slider
            v-model="ModelPosition.cameraZ"
            :max="100"
            :min="-100"
            :step="0.1"
            show-input
            @change="changeModelPosition"
          />
        </el-form-item>
        <el-form-item label="单层建筑旋转">
          <el-slider
            v-model="ModelPosition.selectBuildingRotation"
            :max="100"
            :min="-100"
            :step="0.1"
            show-input
            @change="changeModelPosition"
          />
        </el-form-item>
        <el-form-item label="模型中心坐标X">
          <el-slider
            v-model="ModelPosition.centerX"
            :max="100"
            :min="-100"
            :step="0.1"
            show-input
            @change="changeModelPosition"
          />
        </el-form-item>
        <el-form-item label="模型中心坐标Y">
          <el-slider
            v-model="ModelPosition.centerY"
            :max="100"
            :min="-100"
            :step="0.1"
            show-input
            @change="changeModelPosition"
          />
        </el-form-item>
        <el-form-item label="模型中心坐标Z">
          <el-slider
            v-model="ModelPosition.centerZ"
            :max="100"
            :min="-100"
            :step="0.1"
            show-input
            @change="changeModelPosition"
          />
        </el-form-item>
        <el-form-item label="鼠标旋转灵敏度调节">
          <el-slider
            v-model="ModelPosition.dampingFactor"
            :max="1"
            :min="0"
            :step="0.01"
            show-input
            @change="changeModelPosition"
          />
        </el-form-item>
        <el-form-item v-show="showBallHeadCameraSet" label="球机大小缩放">
          <el-slider
            v-model="ModelPosition.ballHeadCameraLocalScale"
            :max="1"
            :min="0"
            :step="0.001"
            show-input
            @change="changeModelPosition"
          />
        </el-form-item>
        <el-form-item v-show="showGunCameraSet" label="枪机大小缩放">
          <el-slider
            v-model="ModelPosition.GunCameraLoadScale"
            :max="0.1"
            :min="0"
            :step="0.0001"
            show-input
            @change="changeModelPosition"
          />
        </el-form-item>
        <el-form-item v-show="showWarningLightSet" label="报警器大小缩放">
          <el-slider
            v-model="ModelPosition.WarningLightScale"
            :max="0.01"
            :min="0"
            :step="0.001"
            show-input
            @change="changeModelPosition"
          />
        </el-form-item>
        <el-form-item v-show="showRadarSet" label="雷达大小缩放">
          <el-slider
            v-model="ModelPosition.RadarScale"
            :max="1"
            :min="0"
            :step="0.01"
            show-input
            @change="changeRadarScale"
          />
        </el-form-item>
        <el-form-item v-show="showSensorSet" label="传感器大小缩放">
          <el-slider
            v-model="ModelPosition.sensorScale"
            :max="1"
            :min="0"
            :step="0.01"
            show-input
            @change="changeSensorScale"
          />
        </el-form-item>
        <el-form-item v-show="showRadarCard" label="雷达卡片X轴缩放">
          <el-slider
            v-model="ModelPosition.CardScaleX"
            :max="10"
            :min="0"
            :step="0.01"
            show-input
            @change="changeCardPosition"
          />
        </el-form-item>
        <el-form-item v-show="showRadarCard" label="雷达卡片Y轴缩放">
          <el-slider
            v-model="ModelPosition.CardScaleY"
            :max="10"
            :min="0"
            :step="0.01"
            show-input
            @change="changeCardPosition"
          />
        </el-form-item>
        <div>
          <el-button size="small" type="primary" @click="submitModelSize">保存修改</el-button>
          <el-button size="small" type="primary" @click="initCameraLookAt">镜头归位</el-button>
          <el-button size="small" @click="cancelModelSize">取消</el-button>
        </div>
      </el-form>
      <!--      防区高度调整显示-->
      <el-form
        v-show="showMenu == 2 && showDefencePosition"
        :model="defencePosition"
        label-position="left"
        label-width="120px"
        size="small"
        text-color="#fff"
      >
        <el-form-item label="防区高度调整">
          <el-slider
            v-model="defencePosition.defenceHeight"
            :max="20"
            :min="-20"
            :step="0.1"
            show-input
            @change="changeDefencePosition"
          />
        </el-form-item>
      </el-form>
      <!--      教学楼层显示-->
      <el-form
        v-show="showMenu == 3"
        :model="BuildingSelect"
        label-position="left"
        size="small"
        text-color="#fff"
      >
        <BuildingTree @selectBuilding='selectBuilding'/>
        <el-form-item>
          <el-button size="small" type="primary" @click="initCameraLookAt">镜头归位</el-button>
          <el-button type="primary" @click="showAllMap">显示全部图层</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import BuildingTree from "./BuildingTree";
import mapConfig from "../../store/module/mapConfig";
import {floorShotAdd, initMapAPI, putMapConfigureAPI} from "@/api/setMap/setMap.js"

export default {
  name: 'DeviceForm',
  components: {
    BuildingTree
  },
  props: [
    'modelPositionParam'
  ],
  data() {
    return {
      isPackUp: false,
      showMenu: 1,
      formMonitor: {
        monitorName: '',
        monitorLocation: '',
        monitorOnOff: '0',
        monitorMapX: '',
        monitorMapY: '',
        monitorMapZ: '',
        groupId: '',
        deviceName: '',
        cameraIp: '',
        angle: 0,
        floor: 25,
        pitchAngle: 0,
        horizontalAngle: 0,
        radarTrailRotation:0
      },
      mapPosition: {
        positionX: 0,
        positionY: 7,
        positionZ: 0,
        rotationX: 0,
        rotationY: 0.78,
        rotationZ: 0,
        scale: 0.1,
        coordScale: 1
      },//记录整张地图的位置信息
      ModelPosition: {
        dampingFactor: 0.25,
        cameraX: 50,
        cameraY: 50,
        cameraZ: 50,
        ballHeadCameraLoadX: 0,
        ballHeadCameraLoadY: 0,
        ballHeadCameraLoadZ: 0,
        ballHeadCameraLocalScale: 1,
        GunCameraLoadX: 0,
        GunCameraLoadY: 0,
        GunCameraLoadZ: 0,
        GunCameraLoadScale: 1,
        WarningLightX: 0,
        WarningLightY: 0,
        WarningLightZ: 0,
        WarningLightScale: 1,
        RadarScale: 0.02,
        sensorScale: 0.5,
        CardScaleX: 1,
        CardScaleY: 0.5,
        selectBuildingRotation: -0.75,
        centerX: 9.7,
        centerY: 16,
        centerZ: 19.1
      }, // 记录模型位置
      defencePosition: {
        defenceHeight: 0
      }, // 记录防区高度
      BuildingSelect: '', // 选择相应的楼层
      showIpInput: true,
      showModelPosition: true,
      showModelSize: false,
      showDefencePosition: false,
      showBallHeadCameraSet: false,
      showGunCameraSet: false,
      showWarningLightSet: false,
      showRadarSet: false,
      showRadarCard: false,
      showSensorSet: false
    }
  },
  computed: {
    ...mapGetters('device', {
      getFormMonitor: 'getFormMonitor',
      getSelectedDevice: 'getSelectedDevice',
      getFormType: 'getFormType',
      currentDevice: 'getCurrentDevice',
      monitorList: 'monitorList',
      getDoublePosition: 'getDoublePosition'
    }),
    ...mapGetters('models', {
      getSelectFloorInfo: 'getSelectFloorInfo',
      getDefencePosition: 'getDefencePosition',
      getDefenceInfo: 'getDefenceInfo',
      getRadarCardShow: 'getRadarCardShow'
    }),
    floorOptions() {
      return [
        {
          value: 24,
          label: '24F'
        }, {
          value: 25,
          label: '25F'
        }, {
          value: 26,
          label: '26F'
        }]
    }
  },
  watch: {
    modelPositionParam: {
      handler: function (val) {
        if (val) {
          this.ModelPosition.ballHeadCameraLocalScale = val.ballHeadCameraLocalScale
          this.ModelPosition.cameraX = val.cameraX
          this.ModelPosition.cameraY = val.cameraY
          this.ModelPosition.cameraZ = val.cameraZ
          this.ModelPosition.selectBuildingRotation = val.selectBuildingRotation
          this.ModelPosition.centerX = val.centerX
          this.ModelPosition.centerY = val.centerY
          this.ModelPosition.centerZ = val.centerZ
          this.ModelPosition.dampingFactor = val.dampingFactor
          this.ModelPosition.GunCameraLocalScale = val.gunCameraLocalScale
          this.ModelPosition.RadarScale = val.radarScale
          this.ModelPosition.sensorScale = val.sensorScale
          this.ModelPosition.WarningLightScale = val.warningLightScale
          this.ModelPosition.CardScaleX = val.radarCardScaleX
          this.ModelPosition.CardScaleY = val.radarCardScaleY
          this.changeModelPosition()
        }
      },
      deep: true
    },
    getDefencePosition: {
      handler: function (val) {
        if (val) {
          this.showDefencePosition = true
          this.showModelSize = false
          this.showModelPosition = false
        }
      },
      deep: true
    },
    getDefenceInfo: {
      handler: function (val) {
        console.log('getDefenceInfo', val)
      }
    },
    // 判断选择的设备，如果是雷达，那么禁用iP输入框
    getSelectedDevice: {
      handler: function (val) {
        if (val === '77G雷达' || val === '24G雷达') this.showIpInput = false
        if (val === '球机') {
          this.showBallHeadCameraSet = true
          this.showGunCameraSet = false
          this.showWarningLightSet = false
          this.showRadarSet = false
          this.showSensorSet = false
        }
        if (val === '枪机') {
          this.showBallHeadCameraSet = false
          this.showGunCameraSet = true
          this.showWarningLightSet = false
          this.showRadarSet = false
          this.showSensorSet = false
        }
        if (val === '报警器') {
          this.showBallHeadCameraSet = false
          this.showGunCameraSet = false
          this.showWarningLightSet = false
          this.showRadarSet = true
          this.showSensorSet = false
        }
        if (val === '77G雷达' || val === '24G雷达') {
          this.showBallHeadCameraSet = false
          this.showGunCameraSet = false
          this.showWarningLightSet = false
          this.showRadarSet = true
          this.showSensorSet = false
        }
        if (val === '环境检测器') {
          this.showIpInput = false
          this.showBallHeadCameraSet = false
          this.showGunCameraSet = false
          this.showWarningLightSet = false
          this.showRadarSet = false
          this.showSensorSet = true
        }
      },
      deep: true
    },
    //  一旦双击模型，就监控位置变化，从而动态更新表格位置信息
    getDoublePosition: {
      handler: function (val) {
        this.formMonitor.monitorMapX = val.x
        this.formMonitor.monitorMapY = val.y
        this.formMonitor.monitorMapZ = val.z
      },
      deep: true
    },
    // 展示卡片缩放大小调节框
    getRadarCardShow: {
      handler: function (val) {
        console.log('++++++++++++++++变化了')
        if (val) {
          this.showRadarCard = true
        } else {
          this.showRadarCard = false
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('device', {
      setFormMonitor: 'setFormMonitor',
      setCurrentDevice: 'SET_CURRENT_DEVICE',
      setFormType: 'SET_TYPE',
      setDeviceOptionVisible: 'SET_DEVICE_OPTION_VISIBLE',
      setSelectedDevice: 'SET_SELECTED_DEVICE'
    }),
    ...mapMutations('models', {
      uploadDefenceInfo: 'uploadDefenceInfo',
      uploadRadarCardPosition: 'uploadRadarCardPosition'
    }),
    ...mapActions('device', [
      'updatePoleInfo',
      'getMonitorListByActions'
    ]),
    /**
     * 选中不同的菜单的头部展示不同的配置项
     */
    selectMenu(index) {
      this.showMenu = index
    },
    /**
     * 选中要操作的楼层,传递给父组件进行单独显示
     */
    selectBuilding(data) {
      this.$emit('showSelectBuilding', data)
      this.showModelSize = true
      this.showModelPosition = false
      this.showDefencePosition = false
      this.setSelectedDevice('')
    },
    /**
     * 设备坐标输入框发生改变时，触发事件
     */
    changeMonitor() {
      let devicePosition = {}
      devicePosition.positionX = Number(this.formMonitor.monitorMapX)
      devicePosition.positionY = Number(this.formMonitor.monitorMapY)
      devicePosition.positionZ = Number(this.formMonitor.monitorMapZ)
      this.$emit('changeMonitor', devicePosition)
    },
    /**
     * 保存模型调整的最新位置
     */
    submitModelPosition() {
      // 在这里输入向后端传递的最新模型位置信息
      let param = {}
      initMapAPI().then(res => {
        param.height = res.data.height
        param.id = res.data.id
        param.layer = res.data.layer
        param.mapName = res.data.mapName
      })
      param.positionX = this.mapPosition.positionX
      param.positionY = this.mapPosition.positionY
      param.positionZ = this.mapPosition.positionZ
      param.rotationX = this.mapPosition.rotationX
      param.rotationY = this.mapPosition.rotationY
      param.rotationZ = this.mapPosition.rotationZ
      param.scaling = this.mapPosition.scale
      param.coordScale = this.mapPosition.coordScale
      putMapConfigureAPI(param).then(res => {
        if (res.code == 200) {
          this.$message.success(`${res.msg}`)
        }
      }).catch(err => {
        this.$message.error(`${err}`)
      })
    },
    /**
     * 取消模型修改，恢复最初位置
     */
    cancelModelPosition() {
      location.reload()
    },
    // 最新camera位置
    submitModelSize() {
      let floorShot = {}
      floorShot.cameraX = this.ModelPosition.cameraX
      floorShot.cameraY = this.ModelPosition.cameraY
      floorShot.cameraZ = this.ModelPosition.cameraZ
      floorShot.rotationY = this.ModelPosition.selectBuildingRotation
      floorShot.centerX = this.ModelPosition.centerX
      floorShot.centerY = this.ModelPosition.centerY
      floorShot.centerZ = this.ModelPosition.centerZ
      floorShot.floorName = this.getSelectFloorInfo.floorName
      floorShot.ballHeadCameraLocalScale = this.ModelPosition.ballHeadCameraLocalScale
      floorShot.gunCameraLocalScale = this.ModelPosition.GunCameraLoadScale
      floorShot.warningLightScale = this.ModelPosition.WarningLightScale
      floorShot.radarScale = this.ModelPosition.RadarScale
      floorShot.sensorScale = this.ModelPosition.sensorScale
      if (!this.ModelPosition.dampingFactor) floorShot.dampingFactor = 0.07
      else {
        floorShot.dampingFactor = this.ModelPosition.dampingFactor
      }
      floorShot.id = this.getSelectFloorInfo.id
      floorShot.mapModelId = this.getSelectFloorInfo.mapModelId
      floorShot.trailOffsetX = this.getSelectFloorInfo.trailOffsetX
      floorShot.trailOffsetY = this.getSelectFloorInfo.trailOffsetY
      floorShot.trailOffsetZ = this.getSelectFloorInfo.trailOffsetZ
      floorShot.imageScale = this.getSelectFloorInfo.imageScale
      floorShot.radarCardScaleX = this.ModelPosition.CardScaleX
      floorShot.radarCardScaleY = this.ModelPosition.CardScaleY
      floorShotAdd(floorShot).then(res => {
        if (res.code == 200) {
          this.$message.success(`${res.msg}`)
        }
      }).catch(err => {
        this.$message.error(`${err}`)
      })
    },

    // 让镜头归位，避免出现模型找不到的情况
    initCameraLookAt() {
      this.$emit('initCameraLookAt')
    },
    //
    cancelModelSize() {
      location.reload()
    },
    //向父组件传输角度信息
    submitDeviceAngle() {
      let data = {
        pitchAngle: this.formMonitor.pitchAngle,
        horizontalAngle: this.formMonitor.horizontalAngle,
      };
      this.$emit('saveDeviceAngle',
        data
      )
    },
    /**
     * 向父组件传递整张地图位置调整信息
     */
    changeMapPosition() {
      this.$emit('changeMapPosition', this.mapPosition)
    },
    /**
     * 向父组件传递模型位置调整信息
     */
    changeModelPosition() {
      this.$emit('changeModelPosition', this.ModelPosition)
    },
    // /**
    //  * 向父组件传递单层楼的旋转角度调整信息
    //  */
    // changeSelectBuildingRotation() {
    //   this.$emit('changeSelectBuildingRotation', this.ModelPosition.selectBuildingRotation)
    // },
    /**
     * 七十五中补丁，专用于调节雷达大小变化时，模型位置保持不变
     */
    changeRadarScale() {
      this.$emit('changeRadarScale', this.ModelPosition)
    },
    /**
     * 专用于调节传感器大小变化时，模型位置保持不变
     */
    changeSensorScale() {
      this.$emit('changeSensorScale', this.ModelPosition)
    },
    /**
     * 向父组件传递模型卡片的调整信息
     */
    changeCardPosition() {
      this.$emit('changeCardPosition', this.ModelPosition)
      let radarCardPosition = {}
      radarCardPosition.positionX = this.ModelPosition.CardScaleX
      radarCardPosition.positionY = this.ModelPosition.CardScaleY
      this.uploadRadarCardPosition(radarCardPosition)
    },
    /**
     * 修改防区高度
     */
    changeDefencePosition(val) {
      let defenceHeight = {}
      defenceHeight.height = val
      this.uploadDefenceInfo(defenceHeight)
    },
    /**
     * @author Lyc
     * 保存创建的哨兵杆
     */
    submitDeviceInfo() {
      this.submitModelSize()
      if (!this.getSelectFloorInfo.id) {
        this.$message.warning('请先在设备预览界面选择一楼层，再添加设备！！')
        return
      }
      let radarFrequency = ''
      if (this.getSelectedDevice === '77G雷达') radarFrequency = '77'
      else if (this.getSelectedDevice === '24G雷达') radarFrequency = '24'
      this.$emit('saveDevice', {
        groupId: Number(this.formMonitor.groupId),
        deviceName: this.formMonitor.deviceName,
        cameraIp: this.formMonitor.cameraIp,
        // angle: this.formMonitor.angle / 180 * Math.PI,
        pitchAngle: this.formMonitor.pitchAngle,
        horizontalAngle: this.formMonitor.horizontalAngle,
        // floor: this.formMonitor.floor
        floor: this.getSelectFloorInfo.id,
        radarTrailRotation:this.formMonitor.radarTrailRotation,
        radarFrequency,
        // 模拟
        radarTrailRotation: this.formMonitor.radarTrailRotation
      })
      this.formMonitor = {
        monitorName: '',
        monitorLocation: '',
        monitorOnOff: '0',
        monitorMapX: '',
        monitorMapY: '',
        monitorMapZ: '',
        groupId: '',
        deviceName: '',
        cameraIp: '',
        angle: 0,
        floor: 25,
        pitchAngle: 0,
        horizontalAngle: 0,
        radarTrailRotation:0
      }
      this.setFormMonitor(this.formMonitor)
      // 点击保存的时候，将摄像头IP input复位
      this.showIpInput = true
    },
    /** @author Lyc
     * 取消添加杆的操作
     */
    cancelDevice() {
      this.$emit('cancelDevice')
    },
    packUpForm() {
      this.isPackUp = !this.isPackUp
    },
    showAllMap() {
      location.reload()
    }
  },
  mounted() {
    this.getMonitorListByActions().then(res => {
      console.log(res)
      console.log('this.monitorList', this.monitorList)
    })
    initMapAPI().then(res => {
      this.mapPosition.positionX = res.data.positionX
      this.mapPosition.positionY = res.data.positionY
      this.mapPosition.positionZ = res.data.positionZ
      this.mapPosition.rotationX = res.data.rotationX
      this.mapPosition.rotationY = res.data.rotationY
      this.mapPosition.rotationZ = res.data.rotationZ
      this.mapPosition.scale = res.data.scaling
      this.mapPosition.coordScale = res.data.coordScale
    })
    // param.positionX = this.ModelPosition.positionX
    // param.positionY = this.ModelPosition.positionY
    // param.positionZ = this.ModelPosition.positionZ
    // param.rotationX = this.ModelPosition.rotationX
    // param.rotationY = this.ModelPosition.rotationY
    // param.rotationZ = this.ModelPosition.rotationZ
    // param.scaling = this.ModelPosition.scale
    // param.coord_scale = this.ModelPosition.coord_scale
  }
}
</script>
<style scoped>
/deep/ .el-form-item__label {
  color: black;
}

/deep/ .el-radio-group .el-radio {
  color: black;
  margin-right: 10px;
}

/deep/ .el-radio__input.is-disabled + span.el-radio__label {
  color: black;
}

/deep/ .el-radio__input.is-disabled.is-checked .el-radio__inner {
  background-color: teal;
  border-color: #e4e7ed;
}

/deep/ .el-menu {
  background-color: transparent;
}

/deep/ .el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid teal;
  color: teal;
}

/deep/ .el-menu--horizontal > .el-menu-item {
  color: black;
}

/deep/ label {
  color: #fff;
}
</style>
<style lang="scss" scoped>
.card-content {
  max-height: 65vh;
  height: 70%;
  overflow-y: scroll;
  // 滚动条
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  // 内部滑快
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: hsla(220, 4%, 58%, 0);
    transition: background-color 0.3s;

    &:hover {
      background: transparent;
    }
  }

  // 内部滑槽
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.add-device-tip {
  margin-left: 20px;
  color: teal;
}

.device-form {
  overflow: inherit;
  position: absolute;
  left: 5px;
  padding: 24px;
  width: 540px;

  border: 0.5px solid #666;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background: #0000;

  .pack-up-form-btn {
    transition: 0.6s;
  }
}

.pack-up-form {
  transform: translateX(-100%);

  .pack-up-form-btn {
    transform: translateX(200%);
    border: 1px solid #eeeeee;
  }
}
</style>
