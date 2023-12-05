<template>
  <div id="radar-online-statistics">
    <dv-border-box-8 style="height: 100%;width: 100%">
      <div class="radar-state-content">
        <div class="radar-state-head">
<!--          <h4 class="radar-state-title">雷达状态</h4>-->
          <el-select v-model="selectDevice" placeholder="请选择" style="width: 35%" class="radar-state-select" @change="selectDiffDevice">
            <el-option
              v-for="item in deviceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
          <h4 class="radar-state-detail-title" @click="showRadarStateDetail">详情 >></h4>
        </div>
        <div class="radar-state-count global-flex-row-sa-center">
          <div class="state-total state-common global-flex-column-sa-center">
            <div>{{ selectDevice }}总数</div>
<!--            <span>{{ numberOfOnAndOfflineRadars.total }}</span>-->
            <span>{{ deviceTotal }}</span>
          </div>
          <div class="state-online state-common global-flex-column-sa-center">
            <div>在线</div>
<!--            <span>{{ numberOfOnAndOfflineRadars.online }}</span>-->
            <span>{{ deviceOnline }}</span>
          </div>
          <div class="state-offline state-common global-flex-column-sa-center">
            <div>离线</div>
<!--            <span>{{ numberOfOnAndOfflineRadars.offline }}</span>-->
            <span>{{ deviceOffline }}</span>
          </div>
        </div>
        <div class="radar-state-echarts-wrapper">
          <radar-online-statistics-echarts/>
        </div>
      </div>
    </dv-border-box-8>
    <radar-online-state-table
      v-show="isShowRadarDetail"
      :is-show-radar-detail="isShowRadarDetail"
      @closeRadarDetail="isShowRadarDetail = false"
    />
  </div>
</template>

<script>
import RadarOnlineStatisticsEcharts from '@/views/index/echarts/RadarOnlineStatisticsEcharts'
import RadarOnlineStateTable from '@/views/index/components/RadarOnlineStateTable'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import {MyWebsocketConnector} from '@/utils/myWebsocketConnector'
import {getRadarOnlineAddr} from '@/api/index'
import {getAllDeviceStatusApi} from '@/api/device/index'

export default {
  name: 'RadarOnlineStatistics',
  components: {RadarOnlineStateTable, RadarOnlineStatisticsEcharts},
  data() {
    return {
      isShowRadarDetail: false,
      websocketAddr: '',
      websocketConnector: null,
      radarOnlineInfo: {
        total: 0,
        online: 0,
        offline: 0
      },
      deviceOptions: [{
        value: '1',
        label: '77G雷达'
      }, {
        value: '2',
        label: '24G雷达'
      }, {
        value: '3',
        label: '环境检测器'
      }, {
        value: '4',
        label: '摄像头'
      }],
      selectDevice: '77G雷达',
      deviceTotal: 0,// 设备总数
      deviceOnline: 0,// 在线设备数目
      deviceOffline: 0// 离线设备数目
    }
  },
  computed: {
    ...mapGetters('index', ['numberOfOnAndOfflineRadars']),
    ...mapGetters('device', {
      getAllDeviceStatus: 'getAllDeviceStatus'
    })
  },
  methods: {
    ...mapActions('index', {
      getRadarOnlineInfo: 'getRadarOnlineStateByActions'
    }),
    ...mapMutations('device', {
      setAllDeviceStatus: 'setAllDeviceStatus',
      setSelectDeviceName: 'setSelectDeviceName'
    }),
    showRadarStateDetail() {
      this.isShowRadarDetail = true
    },
    /**
     * 选择不同的设备种类，重新统计设备在离线情况
     */
    selectDiffDevice(e) {
      this.setAllDeviceStatusByApi()// 选择查看不同设备时，强制刷新一次
      this.setSelectDeviceName(e)// 存入vuex中，使得echarts与表格重新刷新绘制
      switch (e) {
        case '77G雷达':
          this.deviceOnline = this.getAllDeviceStatus.radarStatusBo77g.online
          this.deviceOffline = this.getAllDeviceStatus.radarStatusBo77g.offline
          this.deviceTotal = this.getAllDeviceStatus.radarStatusBo77g.online + this.getAllDeviceStatus.radarStatusBo77g.offline
          break
        case '24G雷达':
          this.deviceOnline = this.getAllDeviceStatus.radarStatusBo24g.online
          this.deviceOffline = this.getAllDeviceStatus.radarStatusBo24g.offline
          this.deviceTotal = this.getAllDeviceStatus.radarStatusBo24g.online + this.getAllDeviceStatus.radarStatusBo24g.offline
          break
        case '环境检测器':
          this.deviceOnline = this.getAllDeviceStatus.sensorStatusBo.online
          this.deviceOffline = this.getAllDeviceStatus.sensorStatusBo.offline
          this.deviceTotal = this.getAllDeviceStatus.sensorStatusBo.online + this.getAllDeviceStatus.sensorStatusBo.offline
          break
        case '摄像头':
          this.deviceOnline = this.getAllDeviceStatus.cameraStatusBo.online
          this.deviceOffline = this.getAllDeviceStatus.cameraStatusBo.offline
          this.deviceTotal = this.getAllDeviceStatus.cameraStatusBo.online + this.getAllDeviceStatus.cameraStatusBo.offline
          break
      }
    },
    /**
     * 将获取的设备状态信息，存在vuex中
     */
    setAllDeviceStatusByApi() {
      getAllDeviceStatusApi().then(res => {
        this.setAllDeviceStatus(res.data)
      })
    }
  },
  mounted() {
    getRadarOnlineAddr().then((res) => {
      this.websocketAddr = res.msg
      console.log(this.websocketAddr, 'websocket地址')
      const onopenCallback = () => {
        console.log('人数统计websocket已连接')
        this.websocketConnector.heartStart()
      }
      const onmessageCallback = (message) => {
        this.websocketConnector.heartReset()
        this.getRadarOnlineInfo()
      }
      this.websocketConnector = new MyWebsocketConnector(this.websocketAddr, 45000, onopenCallback, onmessageCallback)
    }).catch((error) => {
      this.$message.error(error)
    })
  },
  beforeDestroy() {
    this.websocketConnector.closeWebsocket()
  },
  created() {
    this.getRadarOnlineInfo()
    this.setAllDeviceStatusByApi()
    // 初始只加载77g雷达信息情况
    setTimeout(() => {
      this.deviceOnline = this.getAllDeviceStatus.radarStatusBo77g.online
      this.deviceOffline = this.getAllDeviceStatus.radarStatusBo77g.offline
      this.deviceTotal = this.getAllDeviceStatus.radarStatusBo77g.online + this.getAllDeviceStatus.radarStatusBo77g.offline
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
#radar-online-statistics {
  height: 100%;

  .radar-state-content {
    height: 100%;
    padding: 10px;

    .radar-state-head {
      position: relative;
      height: 10%;

      .radar-state-title {
        font-weight: 600;
        font-size: 1.2rem;
        color: #fff;
        letter-spacing: 0.2rem;
        text-align: center;
      }

      .radar-state-select {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .radar-state-detail-title {
        position: absolute;
        top: 2px;
        right: 10px;
        text-decoration: underline;
        font-size: 1rem;
        color: #fff;
        cursor: pointer;
      }
    }

    .radar-state-count {
      height: 20%;

      .state-common {
        height: 100%;
        font-size: 1.2rem;
        color: #fff;
      }

      .state-total, .state-online, .state-online {
        font-size: 1.1rem;
      }

      .state-total span {
        color: #007feb;
      }

      .state-online span {
        color: #fff;
      }

      .state-offline span {
        color: #ff0;
      }
    }

    .radar-state-echarts-wrapper {
      height: 70%;
    }
  }
}

/*修改下拉框默认高度*/
::v-deep .el-input {
  height: 30px!important;
}

/*修改下拉框的背景色*/
::v-deep .el-input__inner {
  background-color: transparent !important;
  border-color: #409EFF;
  color: #d9d9d9;
  height: 30px!important;
}

/*下拉图标*/
::v-deep .el-input__icon {
  line-height: 30px;
}
</style>
