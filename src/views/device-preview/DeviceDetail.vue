<template>
  <dialog-drag id="device-detail" :title="deviceName" @close="closeDeviceOption">
    <div style="width: 150px">
      <el-button
        v-show="deviceName==='雷达'?true:false"
        icon="el-icon-edit"
        plain
        size="mini"
        style="margin-left: 0; width: 100%"
        type="info"
        @click="addRadarDefenceAreaCirlce"
      >
        添加圆形防区
      </el-button>
      <el-button
        v-show="deviceName==='雷达'?true:false"
        icon="el-icon-edit"
        plain
        size="mini"
        style="margin-left: 0; width: 100%"
        type="info"
        @click="addRadarDefenceAreaPolygon"
      >
        添加多边形防区
      </el-button>

      <el-button
        v-show="deviceName==='雷达'?true:false"
        icon="el-icon-edit"
        plain
        size="mini"
        style="margin-left: 0; width: 100%"
        type="info"
        @click="deleteDefenceArea"
      >
        删除防区
      </el-button>

      <el-button
        icon="el-icon-delete"
        plain
        size="mini"
        style="margin-left: 0; width: 100%"
        type="danger"
        @click="deleteDevices"
      >
        删除{{ deviceName }}
      </el-button>
    </div>
  </dialog-drag>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import DialogDrag from 'vue-dialog-drag'
import {getSession} from '../../utils/storage'
import {log} from 'three'
import {saveDefenceInfo} from '@/api/device/BasicConfig'
import {deleteDefenceInfo} from '@/api/device/BasicConfig'
import {getDefenceInfo} from '@/api/device/BasicConfig'

export default {
  name: 'DeviceDetail',
  components: {
    DialogDrag
  },
  props: {
    deviceName: {
      type: String,
      default: '设备名称'
    },
    models: {
      type: Object,
      default: null
    }
  },
  mounted() {
    console.log(this.models, 'woshimoxing111111')
    this.addevent()
  },
  computed: {
    ...mapGetters('device', ['getCurrentDevice']),
    ...mapGetters('selfModel', {
      DevicePreviewSelfModel: 'getDevicePreviewSelfModel'
    }),
    ...mapGetters('models', {
      getSaveTraceParam: 'getSaveTraceParam',
      getSelectFloorInfo: 'getSelectFloorInfo'
    })
  },
  methods: {
    ...mapActions('device', ['deleteDeviceInfo']),
    ...mapMutations('device', {
      setCurrentDevice: 'SET_CURRENT_DEVICE'
    }),
    ...mapMutations('models', {
      uploadDefencePosition: 'uploadDefencePosition'
    }),
    setDeviceSnForModel() {
      if (typeof getSession('radarOrWarningLightSn') !== 'undefined') {
        const currentDevice = {
          ...this.getCurrentDevice
        }
        currentDevice.deviceSn = getSession('radarOrWarningLightSn')
        this.delemodels()
        this.setCurrentDevice(currentDevice)
        console.log(
          currentDevice.deviceSn,
          this.getCurrentDevice,
          this.models.scene,
          9999999999999
        )
      }
    },
    delemodels() {
      this.models.scene.children.forEach((obj) => {
        if (obj === this.getCurrentDevice) {
          console.log(obj, '--------------->')
          this.models.deleteModel(this.getCurrentDevice)
        }
      })
    },
    closeDeviceOption() {
      this.$emit('closeDeviceDetail')
    },
    deleteDevices() {
      console.log('delete', this.getCurrentDevice)
      console.log('deviceSn', getSession('radarOrWarningLightSn'))
      console.log('deviceSn', this.getCurrentDevice.deviceSn)
      if (this.getCurrentDevice.deviceSn == null) {
        if (getSession('radarOrWarningLightSn')) {
          this.setDeviceSnForModel()
        }
        console.log('deleteffff', this.getCurrentDevice)
      }
      var justonce = 1
      this.models.scene.traverse((obj) => {
        if (obj.deviceSn === this.getCurrentDevice.deviceSn && obj.name === '已添加防区') {
          console.log('7777777778888888888888')
          this.models.scene.remove(obj)
        } else if (obj.deviceSn === this.getCurrentDevice.deviceSn && obj.name === 'radarCard') {
          console.log('888888888888899999999999')
          this.models.scene.remove(obj)
        } else if (obj.deviceSn === this.getCurrentDevice.deviceSn && obj.name === 'sensor') {// 删除传感器
          this.models.scene.remove(obj)
        }
        justonce--
        if (justonce === 0) {
          this.deleteDeviceInfo().then((res) => {
            if (res.code === 200) {
              this.$emit('deleteDevice')
              this.$notify.success({
                title: '操作提示',
                message: `删除设备成功！`,
                offset: 100
              })
              this.closeDeviceOption()
            } else {
              this.$notify.error({
                title: '操作提示',
                message: `删除设备失败！${res.msg}`,
                offset: 100
              })
              this.closeDeviceOption()
            }
          })
        }
      })
    },

    addevent(models) {
      document.onkeydown = (e) => {
        // let e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode === 13) { // enter
          e.preventDefault()
          console.log('222222222222222222222')
          models.stopListen = true
          // let defenceArea
          // if (models.denfenceType === 'polygon') {
          //   defenceArea = models.drawDefenceAreaLast(this.getCurrentDevice.floor, this.getCurrentDevice.deviceSn)
          // }
          // if (models.denfenceType === 'circle') {
          //   defenceArea = models.drawDefenceCircleAreaLast(this.getCurrentDevice.floor, this.getCurrentDevice.deviceSn)
          // }
          // console.log(defenceArea)
          // console.log(this.stopListen);
          models.clickEvent.remove()
          models.mousemoveEvent.remove()
          let send = {
            defenceAlarmOnOff: null,
            defenceInfo: {
              points: [],
              radius: 0,
              type: null
            },
            floor: 0,
            groupId: null,
            groupName: '',
            radarSn: null
          }
          for (let i = 0; i < models.defencePointNode.length; i++) {
            const point = {posX: 0, posY: 0, posZ: 0}
            // 创建的防区，端点值要相应减去轨迹线偏移值，才能与轨迹线显示位置匹配
            point.posX = models.defencePointNode[i].x - this.getSelectFloorInfo.trailOffsetX
            point.posY = models.defencePointNode[i].y - this.getSelectFloorInfo.trailOffsetY
            point.posZ = models.defencePointNode[i].z - this.getSelectFloorInfo.trailOffsetZ
            send.defenceInfo.points.push(point)
          }
          console.log(this.getCurrentDevice)
          send.defenceInfo.type = models.denfenceType
          console.log('asdasdasdsadasdasdasdadasdasd')
          console.log(send.defenceInfo.type)
          send.radarSn = this.getCurrentDevice.deviceSn
          send.defenceInfo.radius = models.radius
          send.groupId = this.getCurrentDevice.groupId
          send.floor = this.getCurrentDevice.floor
          send.groupName = this.getCurrentDevice.groupName
          send = JSON.stringify(send)
          console.log('给后端传递的防区信息:')
          console.log(send)
          try {
            saveDefenceInfo(send)
            this.$notify.success({
              title: '操作提示',
              message: `添加防区成功！`,
              offset: 100
            })
            this.closeDeviceOption()
          } catch (err) {
            this.$notify.error({
              title: '操作提示',
              message: `添加防区失败！`,
              offset: 100
            })
            this.closeDeviceOption()
            console.log(err)
          } finally {
            // window.location.reload();
          }
          // window.location.reload();
          // window.removeEventListener("mousemove", ()=>{console.log('移除了鼠标移动事件');});
        }
        // if(e && e.keyCode === 13) { //enter
        //   console.log('222222222222222222222');
        //   //window.removeEventListener("mousemove", ()=>{console.log('移除了鼠标移动事件');});
        // }
      }
    },
    /**
     * 圆形防区
     */
    addRadarDefenceAreaCirlce() {
      this.$notify.info({
        title: '添加圆形防区步骤提示',
        dangerouslyUseHTMLString: true,
        message: '1. 点击鼠标标记圆心</br>2. 移动并点击鼠标确定半径</br>3. 按enter确定防区',
        offset: 100,
        duration: 10000
      })
      this.uploadDefencePosition(true)
      var temp = this.getCurrentDevice
      this.closeDeviceOption()
      this.setCurrentDevice(temp)
      let height
      if(this.getSaveTraceParam.centerY || this.getSaveTraceParam.centerY == 0) height = this.getSaveTraceParam.centerY
      else height = 10
      // if (this.getCurrentDevice.floor === 24) {
      //   height = -11
      // } else if (this.getCurrentDevice.floor === 25) {
      //   height = -2
      // } else if (this.getCurrentDevice.floor === 26) {
      //   height = 4
      // }
      this.models.defenceHeight = height
      console.log('当前设备')
      console.log(this.getCurrentDevice)
      // this.TraceReplaySelfModel = this.getTraceReplaySelfModel();
      console.log(this.models)
      const getBoundingClientRect = this.models.container.getBoundingClientRect()
      console.log(this.models.drawDefenceArea)
      // 这里加延时是因为防止和选项卡点击事件重合
      setTimeout(() => {
        // this.models.defenceHeight = height;
        console.log('高度高度高度')
        console.log(height)
        this.models.drawDefenceAreaEvent(getBoundingClientRect)
        this.models.drawDefenceArea('circle', height)
        this.addevent(this.models)
        this.models.denfenceType = 'circle'
        this.models.animate()
        this.setCurrentDevice(null)
        console.log(this.currentDevice, 77777777777777)
      }, 400)

      // this.models.drawDefenceAreaEvent(getBoundingClientRect);
      // this.models.drawDefenceArea(1);
    },

    /**
     * 多边形防区
     */
    addRadarDefenceAreaPolygon() {
      this.$notify.info({
        title: '添加多边形防区步骤提示',
        dangerouslyUseHTMLString: true,
        message: `1.点击鼠标标记多边形的点</br> 2.依次点击鼠标标记完多边形的所有点</br>3.按enter确定防区`,
        offset: 100,
        duration: 10000
      })
      var temp = this.getCurrentDevice
      this.closeDeviceOption()
      this.setCurrentDevice(temp)
      let height
      if(this.getSaveTraceParam.centerY || this.getSaveTraceParam.centerY == 0) height = this.getSaveTraceParam.centerY
      else height = 11
      // if (this.getCurrentDevice.floor === 24) {
      //   height = -11
      // } else if (this.getCurrentDevice.floor === 25) {
      //   height = -2
      // } else if (this.getCurrentDevice.floor === 26) {
      //   height = 4
      // }
      this.models.defenceHeight = height
      console.log('当前设备')
      console.log(this.getCurrentDevice)
      // this.TraceReplaySelfModel = this.getTraceReplaySelfModel();
      console.log(this.models)
      const getBoundingClientRect = this.models.container.getBoundingClientRect()
      console.log(this.models.drawDefenceArea)

      // 这里加延时是因为防止和选项卡点击事件重合
      setTimeout(() => {
        this.models.drawDefenceAreaEvent(getBoundingClientRect)
        this.models.drawDefenceArea('polygon', height)
        this.addevent(this.models)
        this.models.denfenceType = 'polygon'
        this.models.animate()
        this.setCurrentDevice(null)
        console.log(this.currentDevice, 77777777777777)
      }, 400)
    },

    deleteDefenceArea() {
      console.log(this.models.scene)
      var flag = 0
      this.models.scene.traverse((obj) => {
        if (obj.deviceSn === this.getCurrentDevice.deviceSn && obj.name === '已添加防区') {
          flag = 1
          console.log('777777777')
          console.log(obj)
          deleteDefenceInfo(obj.deviceSn.toString()).then((res) => {
            this.models.scene.remove(obj)
            this.$notify.success({
              title: '操作提示',
              message: `删除防区成功！`,
              offset: 100
            })
            this.closeDeviceOption()
          }).catch((error) => {
            this.$notify.error({
              title: '操作提示',
              message: `删除防区失败！`,
              offset: 100
            })
            this.closeDeviceOption()
          })
        }
      })
      if (flag === 0) {
        this.$notify.error({
          title: '操作提示',
          message: `该雷达没有防区哦！`,
          offset: 100
        })
      }
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 100%;
  background-color: transparent;
}
</style>
