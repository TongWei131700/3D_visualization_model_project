<template>
  <div class="security-alarm">
    <dv-border-box-8 style="height: 100%;width: 100%">
      <div class="security-alarm-content">
        <div class="alarm-statistic">
          <div id="alarmFrequencyStatistics" class="chart-container"/>

        </div>
        <div class="alarm-list">
          <h4 class="done">实时保护校园安全{{ dataNum }}天</h4>
        </div>
      </div>
    </dv-border-box-8>
  </div>
</template>

<script>

import {GetAlarmFrequency} from '@/api/rule/RuleConfig'

export default {
  data() {
    return {
      date: null,
      value: null,
      dataNum: null,
    }
  },
  mounted() {
    this.beforeInitCharts()
  },
  computed: {

    chartOptions() {
      return {
        title: {
          text: '每日报警频次统计',
          textStyle: {
            fontSize: 16,
            color: '#fff'
          },
          top: 5,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: `日期：{b} <br /> 报警频次：{c}`,
          backgroundColor: 'rgba(255,255,255,0.9)'
        },
        grid: {
          left: "10%",
          right: "10%",
          width: "70%",
          height: "65%",
          containLabel: true
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
          // data: [1, 2, 3, 5]
        },
        yAxis: {
          type: 'value',
          name: '报警频次',
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
          // data: [1, 10, 100, 1],
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
    initCharts() {
      const chartDom = document.getElementById('alarmFrequencyStatistics')
      console.log("alarm-statisticsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", chartDom);
      const myChart = this.$echarts.init(chartDom)
      myChart.setOption(this.chartOptions)
      // 根据屏幕自适应
      // window.addEventListener('resize', () => {
      //     myChart.resize()
      // })
    },
    beforeInitCharts() {
      // 获取到后台数据后稍做处理
      this.date = []
      this.value = []
      GetAlarmFrequency().then((res) => {
        console.log("报警天数");
        console.log(res);
        this.date = res.data.weak_report.alarmDate;
        this.value = res.data.weak_report.alarmCount;
        this.dataNum = res.data.deployed_days;
        this.initCharts()

      }).catch(() => {
        this.$message({
          duration: 1000,
          type: 'error',
          message: '获取报警天数失败'
        })
      })


    }

  },

}
</script>
<style scoped>
/deep/ text {
  font-size: 1.3rem;
  font-weight: 400;
}

/deep/ .row .row-item {
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
.security-alarm {
  height: 100%;
  background: rgba(255, 255, 255, 0.1);

  .security-alarm-content {
    height: 100%;
    padding: 10px;


    .alarm-statistic {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 80%;
      font-weight: 550;
      // background-color: #fff;
      color: #fff;

      // span {
      //     display: inline-block;
      //     width: 0.8rem;
      //     height: 0.8rem;
      //     border-radius: 50%;
      // }


      .done-dot {
        background-color: #6ff;
      }

      .undone-dot {
        background-color: #ff9;
      }

      .done,
      .undone {
        display: inline-block;
        margin-left: 1.25rem;
        font-size: 1rem;
      }

      .done {
        color: #6ff;
      }

      .undone {
        color: #ff9;
      }

      .chart-container {
        // display: flex;

        // justify-content: center;
        // align-items: center;
        width: 100%;
        height: 100%;

        // .dv-water-pond-level {
        //     width: 40%;
        //     height: 100%;
        // }
      }
    }

    .alarm-list {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 20%;
      padding: 10px;

      .done,
      .undone {
        display: inline-block;
        margin-left: 1.25rem;
        font-size: 1.25rem;
      }

      .done {
        color: #6ff;
      }

      .undone {
        color: #ff9;
      }
    }
  }
}
</style>
