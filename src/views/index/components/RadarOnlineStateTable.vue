<template>
  <transition name="el-zoom-in-top">
    <el-dialog
      :modal="false"
      :show-close="false"
      :visible="isShowRadarDetail"
      center
      class="radar-online-state-table"
      :title="selectDevice + '在线状态详情'"
      width="60%"
    >
      <div class="radar-state-button-group">
        <button
          :class="{sumButtonActive: state === 'total'}"
          class="sum-button button-common"
          @click="changeState('total')"
        >{{ selectDevice }}总数： {{ deviceTotal }}
        </button>
        <button
          :class="{onlineButtonActive: state === 'online'}"
          class="online-button button-common"
          @click="changeState('online')"
        >在线{{ selectDevice }}： {{ deviceOnline }}
        </button>
        <button
          :class="{offlineButtonActive: state === 'offline'}"
          class="offline-button button-common"
          @click="changeState('offline')"
        >离线{{ selectDevice }}： {{ deviceOffline }}
        </button>
      </div>
      <el-table
        :data="deviceStateData"
        :header-row-style="headerRowStyle"
        class="radar-state-table"
        max-height="400"
        stripe
      >
        <el-table-column
          align="center"
          :label="selectDevice + 'Sn'"
          property="deviceSn"
          width="200"
        />
        <el-table-column
          align="center"
          :label="selectDevice + '名称'"
          property="deviceName"
          width="200"
        />
        <el-table-column
          align="center"
          :label="selectDevice + '位置'"
          property="location"
        />
        <el-table-column
          align="center"
          label="在线状态"
          property="deviceOnline"
          width="200"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.deviceOnline === '1'"
              style="color: #228B22"
            >在线</span>
            <span v-else style="color: #ff0000">离线</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleButtonClick">确 定</el-button>
      </span>
    </el-dialog>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'RadarOnlineStateTable',
  props: {
    isShowRadarDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      state: 'total',
      deviceStateData: [],
      staticDeviceStateData: [],
      selectDevice: '77G雷达',
      deviceTotal: 0,// 设备总数
      deviceOnline: 0,// 在线设备数目
      deviceOffline: 0// 离线设备数目
    }
  },
  computed: {
    ...mapGetters('index', ['numberOfOnAndOfflineRadars', 'onlineRadarList', 'offlineRadarList', 'allRadarList']),
    ...mapGetters('device', {
      getAllDeviceStatus: 'getAllDeviceStatus',
      getSelectDeviceName: 'getSelectDeviceName'
    }),
    headerRowStyle() {
      return {
        padding: '5px',
        color: '#29a1a2',
        fontSize: '18px'
      }
    }
  },
  watch: {
    getSelectDeviceName: {
      handler: function (val) {
        switch (val) {
          case '77G雷达':
            this.selectDevice = '77G雷达'
            this.deviceOnline = this.getAllDeviceStatus.radarStatusBo77g.online
            this.deviceOffline = this.getAllDeviceStatus.radarStatusBo77g.offline
            this.deviceTotal = this.getAllDeviceStatus.radarStatusBo77g.online + this.getAllDeviceStatus.radarStatusBo77g.offline
            this.staticDeviceStateData = []
            const radarStatusBo77gArray = this.getAllDeviceStatus.radarStatusBo77g.list
            for(let i = 0; i < radarStatusBo77gArray.length; i++) {
              let tempObj = {}
              tempObj.deviceSn = radarStatusBo77gArray[i].radarSn
              tempObj.deviceName = radarStatusBo77gArray[i].radarName
              tempObj.location = radarStatusBo77gArray[i].location
              tempObj.deviceOnline = radarStatusBo77gArray[i].radarOnline
              this.staticDeviceStateData.push(tempObj)
            }
            this.deviceStateData = [...this.staticDeviceStateData]
            break
          case '24G雷达':
            this.selectDevice = '24G雷达'
            this.deviceOnline = this.getAllDeviceStatus.radarStatusBo24g.online
            this.deviceOffline = this.getAllDeviceStatus.radarStatusBo24g.offline
            this.deviceTotal = this.getAllDeviceStatus.radarStatusBo24g.online + this.getAllDeviceStatus.radarStatusBo24g.offline
            this.staticDeviceStateData = []
            const radarStatusBo24gArray = this.getAllDeviceStatus.radarStatusBo24g.list
            for(let i = 0; i < radarStatusBo24gArray.length; i++) {
              let tempObj = {}
              tempObj.deviceSn = radarStatusBo24gArray[i].radarSn
              tempObj.deviceName = radarStatusBo24gArray[i].radarName
              tempObj.location = radarStatusBo24gArray[i].location
              tempObj.deviceOnline = radarStatusBo24gArray[i].radarOnline
              this.staticDeviceStateData.push(tempObj)
            }
            this.deviceStateData = [...this.staticDeviceStateData]
            break
          case '环境检测器':
            this.selectDevice = '环境检测器'
            this.deviceOnline = this.getAllDeviceStatus.sensorStatusBo.online
            this.deviceOffline = this.getAllDeviceStatus.sensorStatusBo.offline
            this.deviceTotal = this.getAllDeviceStatus.sensorStatusBo.online + this.getAllDeviceStatus.sensorStatusBo.offline
            this.staticDeviceStateData = []
            const sensorStatusBoArray = this.getAllDeviceStatus.sensorStatusBo.list
            for(let i = 0; i < sensorStatusBoArray.length; i++) {
              let tempObj = {}
              tempObj.deviceSn = sensorStatusBoArray[i].sensorSn
              tempObj.deviceName = sensorStatusBoArray[i].sensorName
              tempObj.location = sensorStatusBoArray[i].location
              tempObj.deviceOnline = sensorStatusBoArray[i].sensorOnline
              this.staticDeviceStateData.push(tempObj)
            }
            this.deviceStateData = [...this.staticDeviceStateData]
            break
          case '摄像头':
            this.selectDevice = '摄像头'
            this.deviceOnline = this.getAllDeviceStatus.cameraStatusBo.online
            this.deviceOffline = this.getAllDeviceStatus.cameraStatusBo.offline
            this.deviceTotal = this.getAllDeviceStatus.cameraStatusBo.online + this.getAllDeviceStatus.cameraStatusBo.offline
            this.staticDeviceStateData = []
            const cameraStatusBoArray = this.getAllDeviceStatus.cameraStatusBo.list
            for(let i = 0; i < cameraStatusBoArray.length; i++) {
              let tempObj = {}
              tempObj.deviceSn = cameraStatusBoArray[i].cameraSn
              tempObj.deviceName = cameraStatusBoArray[i].cameraName
              tempObj.location = cameraStatusBoArray[i].location
              tempObj.deviceOnline = cameraStatusBoArray[i].cameraOnline
              this.staticDeviceStateData.push(tempObj)
            }
            this.deviceStateData = [...this.staticDeviceStateData]
            break
        }
      },
      deep: true
    }
  },
  created() {
    // this.radarStateData = this.allRadarList
  },
  mounted() {
    setTimeout(() => {
      this.deviceOnline = this.getAllDeviceStatus.radarStatusBo77g.online
      this.deviceOffline = this.getAllDeviceStatus.radarStatusBo77g.offline
      this.deviceTotal = this.getAllDeviceStatus.radarStatusBo77g.online + this.getAllDeviceStatus.radarStatusBo77g.offline
      this.staticDeviceStateData = []
      const radarStatusBo77gArray = this.getAllDeviceStatus.radarStatusBo77g.list
      for(let i = 0; i < radarStatusBo77gArray.length; i++) {
        let tempObj = {}
        tempObj.deviceSn = radarStatusBo77gArray[i].radarSn
        tempObj.deviceName = radarStatusBo77gArray[i].radarName
        tempObj.location = radarStatusBo77gArray[i].location
        tempObj.deviceOnline = radarStatusBo77gArray[i].radarOnline
        this.staticDeviceStateData.push(tempObj)
      }
      this.deviceStateData = [...this.staticDeviceStateData]
    }, 1100)
  },
  methods: {
    changeState(radarState) {
      this.state = radarState
      let tempDeviceStateData = []
      if (radarState === 'total') {
        tempDeviceStateData = [...this.staticDeviceStateData]
      } else if (radarState === 'online') {
        for(let i = 0; i < this.staticDeviceStateData.length; i++) {
          if(this.staticDeviceStateData[i].deviceOnline === '1') {
            tempDeviceStateData.push(this.staticDeviceStateData[i])
          }
        }
      } else {
        for(let i = 0; i < this.staticDeviceStateData.length; i++) {
          if(this.staticDeviceStateData[i].deviceOnline === '0') {
            tempDeviceStateData.push(this.staticDeviceStateData[i])
          }
        }
      }
      this.deviceStateData = tempDeviceStateData
    },
    handleButtonClick() {
      this.$emit('closeRadarDetail')
    }
  }
}
</script>

<style scoped>
.radar-online-state-table /deep/ .el-dialog {
  background: linear-gradient(to right, #182952, #104f97);
  padding: 1rem 3rem;
}

.radar-online-state-table /deep/ .el-dialog__title {
  font-size: 1.2rem;
  color: #fff;
}
</style>
<style lang="scss" scoped>
.radar-online-state-table {
  .radar-state-button-group {
    display: flex;
    justify-content: center;
    height: 60px;
    padding: 10px;

    .button-common {
      width: 10rem;
      margin-left: 1.5rem;
      height: 40px;
      line-height: 40px;
      background-color: transparent;
      text-align: center;
      font-size: 1.1rem;
      color: #fff;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    .sum-button {
      border-color: rgb(255, 255, 0);
    }

    .sumButtonActive {
      background-color: rgba(255, 255, 0, 0.5);
    }

    .online-button {
      border-color: #00FF7F;
    }

    .onlineButtonActive {
      background-color: rgba(0, 255, 127, .5);
    }

    .offline-button {
      border-color: #F08080;
    }

    .offlineButtonActive {
      background-color: rgba(240, 128, 128, .5);
    }
  }

  .radar-state-table {
    margin-top: 30px;
    background: transparent;
  }
}
</style>
