<template>
  <div id="radar-statistics-echarts" ref="radarStatisticsEcharts" class="radar-statistics-echarts"/>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'RadarOnlineStatisticsEcharts',
  data() {
    return {
      deviceName: '',
      deviceOnline: 0,
      deviceOffline: 0
    }
  },
  computed: {
    ...mapGetters('index', ['numberOfOnAndOfflineRadars']),
    ...mapGetters('device', {
      getAllDeviceStatus: 'getAllDeviceStatus',
      getSelectDeviceName: 'getSelectDeviceName'
    }),
    chartOptions() {
      return {
        color: ['#91cc75', '#ee6666'],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '0',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: `${this.deviceName}` + '在线状态',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            startAngle: 0,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'outside',
              color: '#fff'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true,
              lineStyle: {
                width: 2
              }
            },
            data: [
              {value: this.deviceOnline, name: '在线' + `${this.deviceName}` + '数'},
              {value: this.deviceOffline, name: '离线' + `${this.deviceName}`+ '数'}
            ]
          }
        ]
      }
    }
  },
  watch: {
    // numberOfOnAndOfflineRadars() {
    //   this.initCharts()
    // }
    getSelectDeviceName: {
      handler: function (val) {
        switch (val) {
          case '77G雷达':
            this.deviceName = '77G雷达'
            this.deviceOnline = this.getAllDeviceStatus.radarStatusBo77g.online
            this.deviceOffline = this.getAllDeviceStatus.radarStatusBo77g.offline
            break
          case '24G雷达':
            this.deviceName = '24G雷达'
            this.deviceOnline = this.getAllDeviceStatus.radarStatusBo24g.online
            this.deviceOffline = this.getAllDeviceStatus.radarStatusBo24g.offline
            break
          case '环境检测器':
            this.deviceName = '环境检测器'
            this.deviceOnline = this.getAllDeviceStatus.sensorStatusBo.online
            this.deviceOffline = this.getAllDeviceStatus.sensorStatusBo.offline
            break
          case '摄像头':
            this.deviceName = '摄像头'
            this.deviceOnline = this.getAllDeviceStatus.cameraStatusBo.online
            this.deviceOffline = this.getAllDeviceStatus.cameraStatusBo.offline
            break
        }
        this.initCharts()
      },
      deep: true
    }
  },
  mounted() {
    // if (this.numberOfOnAndOfflineRadars) {
    //   this.initCharts()
    // }
    setTimeout(() => {
      this.deviceName = '77G雷达'
      this.deviceOnline = this.getAllDeviceStatus.radarStatusBo77g.online
      this.deviceOffline = this.getAllDeviceStatus.radarStatusBo77g.offline
      this.initCharts()
    }, 1000)
  },
  methods: {
    initCharts() {
      this.$echarts.dispose(document.getElementById('radar-statistics-echarts'))
      const chartDom = document.getElementById('radar-statistics-echarts')
      const echartsInstance = this.$echarts.init(chartDom)
      echartsInstance.setOption(this.chartOptions)
      // 根据屏幕自适应
      window.addEventListener('resize', () => {
        echartsInstance.resize()
      })
    }
  }
}
</script>

<style scoped>
.radar-statistics-echarts {
  height: 100%;
}
</style>
