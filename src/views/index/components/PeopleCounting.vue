<template>
  <dv-border-box-8
    :reverse="true"
    style="height: 100%;width: 100%"
  >
    <div class="people-counting-wrapper">
      <header class="people-counting-header">
        <h4 class="people-counting-title">雷达活动人数统计</h4>
      </header>
      <main class="people-counting-content">
        <dv-capsule-chart
          :config="peopleCountingConfig"
          class="hidden-scroll"
          style="width:100%;height:100%;"
        />
      </main>
    </div>
  </dv-border-box-8>
</template>

<script>
import {MyWebsocketConnector} from '@/utils/myWebsocketConnector'
import {getPeopleCountingWebsocketAddr} from '@/api/index'

export default {
  name: 'PeopleCounting',
  data() {
    return {
      websocketAddr: '',
      websocketConnector: null,
      peopleCountingInfo: null
    }
  },
  computed: {
    peopleCountingConfig() {
      const data = []
      if (this.peopleCountingInfo instanceof Array) {
        this.peopleCountingInfo.forEach((item) => {
          data.push({
            name: `${item.location} (${item.radarName})`,
            value: item.peopleNum
          })
        })
        return {
          data,
          colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
          showValue: true
        }
      } else {
        return {}
      }
    }
  },
  mounted() {
    getPeopleCountingWebsocketAddr().then((res) => {
      this.websocketAddr = res.msg
      console.log(this.websocketAddr, 'websocket地址')
      const onopenCallback = () => {
        console.log('人数统计websocket已连接')
        this.websocketConnector.heartStart()
      }
      const onmessageCallback = (message) => {
        this.websocketConnector.heartReset()
        this.peopleCountingInfo = JSON.parse(message.data).peopleCountBos
        // console.log(message.data)
      }
      this.websocketConnector = new MyWebsocketConnector(this.websocketAddr, 45000, onopenCallback, onmessageCallback)
    }).catch((error) => {
      this.$message.error(error)
    })
  },
  beforeDestroy() {
    this.websocketConnector.closeWebsocket()
  }
}
</script>

<style scoped>
.people-counting-content /deep/ .dv-capsule-chart .label-column {
  justify-content: flex-start;
  font-size: 14px;
  text-align: left;
}

.people-counting-content /deep/ .dv-capsule-chart .label-column div {
  margin: 5px 0;
}

.people-counting-content /deep/ .dv-capsule-chart .capsule-item .capsule-item-column .capsule-item-value {
  font-size: 14px;
  transform: translateX(80%);
}

.people-counting-content /deep/ .capsule-container {
  justify-content: flex-start;
}

.people-counting-content /deep/ .dv-capsule-chart .capsule-item {
  height: 20px;
  padding: 6px;
  margin: 5px 0;
}

.people-counting-content /deep/ .dv-capsule-chart .unit-label {
  display: none;
}

.people-counting-content /deep/ .dv-capsule-chart .unit-text {
  display: none;
}
</style>
<style lang="scss" scoped>
.people-counting-wrapper {
  padding: 10px;
  height: 100%;

  .people-counting-header {
    height: 5%;

    .people-counting-title {
      font-weight: 600;
      font-size: 1.2rem;
      color: #fff;
      letter-spacing: 0.2rem;
      text-align: center;
    }
  }

  .people-counting-content {
    height: 95%;
  }
}
</style>
