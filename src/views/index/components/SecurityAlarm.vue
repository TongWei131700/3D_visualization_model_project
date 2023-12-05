<template>
  <div class="security-alarm">
    <dv-border-box-8 style="height: 100%;width: 100%">
      <div class="security-alarm-content">
        <div class="alarm-head">
          <div class="alarm-logo">
            <img src="@/assets/images/index/security-alarm.png"/>
          </div>
          <div class="alarm-title">
            <h5 class="title">安防告警</h5>
            <h5 class="title">ALERTS</h5>
          </div>
        </div>
        <div class="alarm-statistic">
          <div class="alarm-num">
            <div>
              <span class="done-dot"/>
              <h4 class="done">今日已读报警数:{{ todayInfo.done }}</h4>
            </div>
            <div>
              <span class="undone-dot"/>
              <h4 class="undone">今日未读报警数:{{ todayInfo.undone }}</h4>
            </div>
          </div>


          <div ref="info-chart" class="chart-container">
            <dv-water-level-pond :config="chartConfig" style="width:150px;height:130px"/>
          </div>
        </div>
        <div class="alarm-list">
          <dv-scroll-board :config="alarmListConfig" @click="seeDetails($event)" @mouseover="seeRoughInfo($event)"
                           @mouseout.native="clearTimer"/>
        </div>
      </div>
    </dv-border-box-8>
  </div>
</template>

<script>
import {FormatTime} from '@/utils/timeUtils'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import {getAlarmWebsocketAddr} from '@/api/index'
import {MyWebsocketConnector} from '@/utils/myWebsocketConnector'

export default {
  name: 'SecurityAlarm',
  data() {
    return {
      websocketAddr: '',
      websocketConnector: null,
      chartConfig: {
        data: [],
        shape: 'round',
        waveHeight: 18,
        colors: [],
        waveOpacity: 0.2,
        waveNum: 3
      },
      alarmListConfig: {
        header: ['报警位置', '报警时间'],
        data: [],
        rowNum: 4,
        index: true,
        evenRowBGC: 'transparent',
        oddRowBGC: 'transparent',
        columnWidth: [50, 180, 100],
        align: ['left', 'center', 'center']
      },
      isShowDone: true,
      timer: null,
      warningLimit: false // 报警次数限制
    }
  },
  created() {
    this.getTodayAlarm()
    this.showDone()
    setInterval(this.changeChart, 5000)
    getAlarmWebsocketAddr().then(res => {
      this.websocketAddr = res.msg
      const onopenCallback = () => {
        console.log('实时报警websocket已连接')
        this.websocketConnector.heartStart()
      }
      const onmessageCallback = (message) => {
        this.websocketConnector.heartReset()
        console.log('++++++++++++++')
        console.log(message)
        this.alarmWsUpdateAlarmList(message)
      }
      this.websocketConnector = new MyWebsocketConnector(this.websocketAddr, 45000, onopenCallback, onmessageCallback)
    }).catch((error) => {
      this.$message.error(error)
    })
  },
  computed: {
    ...mapGetters('index', {
      todayInfo: 'getTodayInfo',
      alarmList: 'getAlarmList'
    })
  },
  methods: {
    ...mapMutations('index', {
      indexMuGainAlarmList: 'SET_INDEX_ALARM_LIST',
      addNumberOfTodayDoneOrUndone: 'addNumberOfTodayDoneOrUndone'
    }),
    ...mapMutations('models', {
      uploadSelectHomeFloorInfo: 'uploadSelectHomeFloorInfo'
    }),
    ...mapActions('index', {
      getTodayInfo: 'getTodayDoneOrUndoneByActions',
      getAlarmList: 'getIndexAlarmListByActions'
    }),
    /* 初始化报警信息 */
    async getTodayAlarm() {
      await this.getTodayInfo()
      if (this.alarmList.length === 0) {
        await this.getAlarmList({
          curPage: 0,
          pageSize: 6,
          status: 'both',
          groupId: 0
        })
      }
      this.formatAlarmList()
    },
    /* websocket接收到报警消息的回调 message为回调函数的服务器返回参数 */
    alarmWsUpdateAlarmList(message) {
      let alarmInfo = JSON.parse(message.data)
      console.log('***********')
      console.log(alarmInfo)
      alarmInfo = alarmInfo.data
      const alarmTime = `${alarmInfo.alarmTime.year
      }-${alarmInfo.alarmTime.monthValue < 10 ? '0' + alarmInfo.alarmTime.monthValue : alarmInfo.alarmTime.monthValue
      }-${alarmInfo.alarmTime.dayOfMonth < 10 ? '0' + alarmInfo.alarmTime.dayOfMonth : alarmInfo.alarmTime.dayOfMonth
      }T${alarmInfo.alarmTime.hour < 10 ? '0' + alarmInfo.alarmTime.hour : alarmInfo.alarmTime.hour
      }:${alarmInfo.alarmTime.minute < 10 ? '0' + alarmInfo.alarmTime.minute : alarmInfo.alarmTime.minute
      }:${alarmInfo.alarmTime.second < 10 ? '0' + alarmInfo.alarmTime.second : alarmInfo.alarmTime.second}`
      alarmInfo.alarmTime = alarmTime
      // 显示报警框
      // this.$message({
      //   message: `最新报警    报警地点：${alarmInfo.alarmLocation}，  报警时间：${FormatTime(alarmInfo.alarmTime, 'yyyy-MM-dd hh:mm:ss')}`,
      //   type: 'warning'
      // })
      if (!this.warningLimit) {
        // warningLimit起到限制提示框一次产生过多的问题，只有解决一个弹窗才会产生下一个
        this.warningLimit = true
        const h = this.$createElement
        this.$confirm(
          //   `最新报警    报警地点：${alarmInfo.alarmLocation}，  报警时间：${FormatTime(alarmInfo.alarmTime, 'yyyy-MM-dd hh:mm:ss')}`, '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // })
          '提示',
          {
            title: '报警提示',
            message: h('div', [h('div', {style: 'margin-bottom:5px;'}, [h('span', '报警时间：'), h('span', {style: 'color:#1e9fff;'}, `${FormatTime(alarmInfo.alarmTime, 'yyyy-MM-dd hh:mm:ss')}`)]),
              h('div', {style: 'margin-bottom:5px;'}, [h('span', '报警组：'), h('span', {style: 'color:#1e9fff;'}, `${alarmInfo.groupName}`)]),
              h('div', {style: 'margin-bottom:5px;'}, [h('span'), '报警地点：', h('span', {style: 'color:#1e9fff;'}, `${alarmInfo.alarmLocation}`)]),
              h('div', [h('span', '报警类别：'), h('span', {style: 'color:#1e9fff;'}, '触发'), h('span', {style: 'color:#1e9fff;'}, `${alarmInfo.reason}`), h('span', {style: 'color:#1e9fff;'}, '报警')])]),
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'})
              .then(() => {
                // 此处属于硬编码，实现点击报警地址后跳转到相应的报警楼层，希望之后跳转的优化方向是：
                // alarmInfo.alarmLocation或groupName其一与模型的name是一致的，这就需要建立绑定组时提供楼层选项而不是随意创建雷达绑定组
                if (alarmInfo.groupName == '茶室测试组') this.uploadSelectHomeFloorInfo('茶室')
                if (alarmInfo.groupName == '会议室测试组') this.uploadSelectHomeFloorInfo('会议室')
                this.warningLimit = false
              }).catch(() => {
                this.warningLimit = false
              });
          }
        // 更新state中报警列表的数据
        const newAlarmList = []
        newAlarmList.push(alarmInfo)
        for (let i = 0; i < 5; i++) {
          newAlarmList.push(this.alarmList[i])
        }
        this.indexMuGainAlarmList(newAlarmList)
        this.addNumberOfTodayDoneOrUndone()
        // 格式化显示在首页中
        this.formatAlarmList(newAlarmList)
      }
    ,
      /* 将获取到的信息格式化为报警列表展示信息 */
      formatAlarmList()
      {
        const alarmLocation = []
        const alarmTime = []
        this.alarmList.forEach((item) => {
          alarmLocation.push(item.alarmLocation)
          alarmTime.push(FormatTime(item.alarmTime, 'MM/dd hh:mm'))
        })
        const spanStart = '<span style="color:red">'
        const spanEnd = '</span>'
        const scrollListContent = []
        for (const index in this.alarmList) {
          scrollListContent.push([alarmLocation[index], alarmTime[index]])
        }
        console.log(scrollListContent)
        scrollListContent[0][0] = spanStart + scrollListContent[0][0] + spanEnd
        scrollListContent[0][1] = spanStart + scrollListContent[0][1] + spanEnd
        this.alarmListConfig = {
          ...this.alarmListConfig,
          data: scrollListContent
        }
      }
    ,
      /* 鼠标悬浮时 显示粗略信息 */
      seeRoughInfo(event)
      {
        const alarmLocation = this.alarmList[event.rowIndex].alarmLocation
        const alarmTime = FormatTime(this.alarmList[event.rowIndex].alarmTime, 'yyyy-MM-dd hh:mm:ss')
        this.timer = setTimeout(() => {
          this.$message({
            message: `报警地点：${alarmLocation}，  报警时间：${alarmTime}`,
            center: true
          })
        }, 1000)
      }
    ,
      /* 鼠标悬浮不到500ms时 取消定时器 */
      clearTimer()
      {
        clearTimeout(this.timer)
      }
    ,
      /* 点击对应项跳转到报警管理页面 */
      seeDetails(event)
      {
        const id = this.alarmList[event.rowIndex].alarmId
        this.$router.push({path: '/alarm', query: {id}})
      }
    ,
      /* 水位图展示已经处理百分比 */
      showDone()
      {
        this.chartConfig = {
          ...this.chartConfig,
          data: [(this.todayInfo.done / this.todayInfo.total * 100).toFixed(2)],
          colors: ['#6ff', '#6ff'],
          formatter: this.todayInfo.total === 0 ? '无已读报警' : '已读{value}%'
        }
      }
    ,
      /* 水位图展示未处理百分比 */
      showUndone()
      {
        this.chartConfig = {
          ...this.chartConfig,
          data: [(this.todayInfo.undone / this.todayInfo.total * 100).toFixed(2)],
          colors: ['#ffff99', '#ffff99'],
          formatter: this.todayInfo.total === 0 ? '无未处理报警' : '未读{value}%'
        }
      }
    ,
      /* 变换水位图信息 */
      changeChart()
      {
        if (this.isShowDone === true) {
          this.showUndone()
        } else {
          this.showDone()
        }
        this.isShowDone = !this.isShowDone
      }
    },
    beforeDestroy() {
      this.websocketConnector.closeWebsocket()
    }
  }
</script>
<style scoped>
/*/deep/ .dv-water-pond-level ellipse {*/
/*  margin-top: 8px;*/
/*  margin-left: 8px;*/
/*  width: calc(100% - 16px);*/
/*  height: calc(100% - 16px);*/
/*  box-sizing: border-box;*/
/*}*/
/*/deep/ canvas {*/
/*  margin-top: 8px;*/
/*  margin-left: 8px;*/
/*  width: calc(100% - 16px);*/
/*  height: calc(100% - 16px);*/
/*  box-sizing: border-box;*/
/*}*/
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

    .alarm-head {
      display: flex;
      justify-content: space-around;
      height: 20%;

      .alarm-logo,
      .alarm-title {
        width: 45%;
        height: 100%;
      }

      .alarm-logo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        img {
          width: 3.7rem;
          height: 3.7rem;
        }
      }

      .alarm-title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 1.5rem;
        color: #f00;
        text-align: left;
      }
    }

    .alarm-statistic {
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
      // align-items: center;
      height: 35%;
      font-weight: 550;
      color: #fff;

      span {
        display: inline-block;
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
      }

      .alarm-num {
        float: left;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width: 50%;
        height: 100%;
        // background-color: #fff;
      }

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
        display: flex;
        float: left;
        justify-content: center;
        align-items: center;
        width: 50%;
        height: 100%;

        .dv-water-pond-level {
          width: 40%;
          height: 100%;
        }
      }
    }

    .alarm-list {
      height: 40%;
      padding: 10px;
    }
  }
}
</style>
