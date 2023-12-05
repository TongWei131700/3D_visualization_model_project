<template>
  <div id="trace-statistics"/>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'TraceStatistics',
  data() {
    return {
      date: null,
      value: null
    }
  },
  computed: {
    ...mapGetters('traceReplay', {
      trailOneWeekData: 'getTrailOneWeekData'
    }),
    chartOptions() {
      return {
        title: {
          text: '7日内轨迹线统计',
          textStyle: {
            fontSize: 20,
            color: '#fff'
          },
          top: 5,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: `日期：{b} <br /> 轨迹线数量：{c}`,
          backgroundColor: 'rgba(255,255,255,0.4)'
        },
        xAxis: {
          type: 'category',
          name: '日期',
          axisTick: {
            alignWithLabel: true,
            lineStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          nameTextStyle: {
            color: '#fff',
            fontSize: 14
          },
          axisLabel: {
            rotate: 30
          },
          data: this.date
        },
        yAxis: {
          type: 'value',
          name: '轨迹线数量',
          minInterval: 1,
          axisTick: {
            alignWithLabel: true,
            lineStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#fff',
              opacity: 0.1
            }
          },
          nameTextStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        series: [{
          data: this.value,
          type: 'line',
          lineStyle: {
            color: '#4169E1'
          },
          label: {show: true},
          symbolSize: 10,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(21, 233, 241, 0.3)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(21, 233, 241, 0.1)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }]
      }
    }
  },
  methods: {
    // ...mapActions('traceReplay', {
    //   getTrailOneWeek: 'getTrailOneWeekByActions'
    // }),
    initCharts() {
      const chartDom = document.getElementById('trace-statistics')
      const myChart = this.$echarts.init(chartDom)
      myChart.setOption(this.chartOptions)
      // 根据屏幕自适应
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    beforeInitCharts() {
      // 获取到后台数据后稍做处理
      this.date = []
      this.value = []
      for (const obj of this.trailOneWeekData) {
        this.date.unshift(obj.date)
        this.value.unshift(obj.value)
      }
      this.initCharts()
    }
  },
  mounted() {
    console.log(this.trailOneWeekData, 1111111)
    if (this.trailOneWeekData === null) {
      // this.getTrailOneWeek().then(() => {
      //   this.beforeInitCharts()
      // })
    } else {
      this.beforeInitCharts()
    }
  },
  watch: {
    trailOneWeekData() {
      this.beforeInitCharts()
    }
  },
}
</script>

<style scoped>
#trace-statistics {
  width: 100%;
  height: 100%;
}
</style>
