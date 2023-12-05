<template>
  <div class="card-content">
    <div class="card-title">
      <div class="card-title-text"><div class="dot"></div>环境传感器:&nbsp;{{cardSn}}</div>
      <div class="close-card" @click="closeImgShow"><i class="el-icon-close"></i></div>
    </div>
    <div class="card-container">
      <div class="card-container-top">
        <div class="card-container-top-left">
          <div class="card-container-top-left-contain">
            <div class="card-img">
              <img src="../../../assets/images/index/pm2d5.png" style="width:70%; object-fit: fill;margin-left: 10px;margin-top: 30%"/>
            </div>
            <div class="card-text-contain">
              <div class="card-text-contain-top">
                <div style="position: absolute;top: 25%;">pm2.5</div></div>
              <div class="card-text-contain-bottom" :class="{'health': pm2d5 ? false : true,'unhealthy': pm2d5 ? true : false}">{{ pm2d5 }}</div>
            </div>
          </div>
        </div>
        <div class="card-container-top-right">
          <div class="card-container-top-left-contain">
            <div class="card-img">
              <img src="../../../assets/images/index/pm10.png" style="width:70%; object-fit: fill;margin-left: 10px;margin-top: 30%"/>
            </div>
            <div class="card-text-contain">
              <div class="card-text-contain-top">
                <div style="position: absolute;top: 25%;left: 50%; transform: translate(-50%, 0)">pm10</div></div>
              <div class="card-text-contain-bottom" :class="{'health': pm10 ? false : true,'unhealthy': pm10 ? true : false}">{{ pm10 }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-container-bottom">
        <div class="card-container-bottom-left">
          <div class="card-container-top-left-contain">
            <div class="card-img">
              <img src="../../../assets/images/index/tvoc.png" style="width:70%; object-fit: fill;margin-left: 10px;margin-top: 30%"/>
            </div>
            <div class="card-text-contain">
              <div class="card-text-contain-top">
                <div style="position: absolute;top: 25%;left: 50%; transform: translate(-50%, 0)">tvoc</div></div>
              <div class="card-text-contain-bottom" :class="{'health': tvoc ? false : true,'unhealthy': tvoc ? true : false}">{{ tvoc }}</div>
            </div>
          </div>
        </div>
        <div class="card-container-bottom-right">
          <div class="card-container-top-left-contain">
            <div class="card-img">
              <img src="../../../assets/images/index/ch2o.png" style="width:70%; object-fit: fill;margin-left: 10px;margin-top: 30%"/>
            </div>
            <div class="card-text-contain">
              <div class="card-text-contain-top">
                <div style="position: absolute;top: 25%;left: 50%; transform: translate(-50%, 0)">ch2o</div></div>
              <div class="card-text-contain-bottom" :class="{'health': ch2o ? false : true,'unhealthy': ch2o ? true : false}">{{ ch2o }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getSensorDataAdd} from '@/api/index'
import {MyWebsocketConnector} from '@/utils/myWebsocketConnector'

export default {
  name: "testCard",
  methods: {
    closeImgShow() {
      this.$emit('closeCard')
    },
    /**
     * 获取ws地址关于环境传感器
     */
    getWSAddress() {
      getSensorDataAdd().then(res => {
        this.websocketAddress = res.msg
        this.createSensorConnect(this.websocketAddress)
      })
    },
    /**
     * 建一个传感器websocket连接
     */
    createSensorConnect(address) {
      const onopenCallback = () => {
        console.log('实时传感器已连接')
        this.websocketConnector.heartStart()
      }
      const onmessageCallback = (message) => {
        this.websocketConnector.heartReset()
        this.dealWSMessage(message)
      }
      this.websocketConnector = new MyWebsocketConnector(address, 45000, onopenCallback, onmessageCallback)
    },
    /**
     * 处理ws发来的message信息
     */
    dealWSMessage(msg) {
      const message = JSON.parse(msg.data) //转成json格式
      let sensorData = message.sensorDataBos // 注意此处是一个数组
      for(let i = 0; i < sensorData.length; i++) {
        let gas = sensorData[i].data.data //gas存储每一个传感器所传来的气体含量
        console.log('this.pm2d5', gas)
        if(sensorData[i].data.sn == this.cardSn) { // 如果在WS消息中找到点击的sn号后
          this.pm2d5 = gas.pm2d5
          this.pm10 = gas.pm10
          this.tvoc = gas.tvoc
          this.ch2o = gas.ch2o
          break
        }
      }
    },
    /**
     *关闭websocket
     */
    closeWSConnect() {
      this.websocketConnector.closeWebsocket()
      this.websocketConnector = null
    }
  },
  props: ['cardSn'],
  mounted() {
    this.getWSAddress()
  },
  destroyed() {
    this.closeWSConnect()
  },
  data() {
    return {
      websocketConnector: null, //代表建立的ws连接
      websocketAddress: '',// websocket地址
      pm2d5: 0,
      pm10: 0,
      tvoc: 0,
      ch2o: 0 // 以上四个变量对应是否超标， 1为超标， 0为未超标
    }
  }
}
</script>

<style scoped>
.card-content {
  position: relative;
  width: 350px;
  height: 320px;
  border: solid #50b5ea 1px;
  border-radius: 10px;
  background-color: rgba(3,11,103,0.5);
}

.card-title {
  width: 100%;
  height: 24%;
  position: relative;
}

.card-title-text {
  width: 100%;
  height: 100%;
  margin: auto;
  font-size:18px;
  line-height: 75px;
  color: white;
  position: relative;
  padding-left: 40px;
  background: linear-gradient(to top right, #0f94d9, rgba(255, 255, 255, 0.1));
}

.dot {
  width: 15px;
  height: 15px;
  border-radius: 100px;
  background-color: #7ee1ee;
  position: absolute;
  top: 40%;
  left: 10px;
}

.close-card {
  position: absolute;
  top: 35%;
  right: 20px;
  font-size: 20px;
  color: white;
}

.close-card:hover {
  cursor: pointer;
  color: #409eff;
}

.card-container {
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
}

.card-container-top {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.card-container-top-left {
  flex: 1;
}

.card-container-top-left-contain {
  width: 90%;
  height: 90%;
  background-color: rgba(64, 158, 258, 0.4);
  margin: 10px auto 2px;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
}

.card-img {
  width: 50%;
  height: 100%;
  flex: 1;
}

.card-text-contain {
  width: 50%;
  height: 100%;
  flex: 1;
}

.card-text-contain-top {
  height: 50%;
  font-size: 25px;
  text-align: center;
  color: white;
  position: relative;
}

.health {
  color: #42f642;
}

.unhealthy {
  color: red;
}

.card-text-contain-bottom {
  height: 50%;
  font-size: 25px;
  text-align: center;
}

.card-container-top-right {
  flex: 1;
}

.card-container-bottom {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.card-container-bottom-left {
  flex: 1;
}

.card-container-bottom-right {
  flex: 1;
}
</style>
