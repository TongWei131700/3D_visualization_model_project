class MyWebsocketConnector {
  /**
   * * @param {String} url Websocket的地址
   * * @param {Number} timeout 循环时间,防止websocket断开【指定此字段的时候，表示开启】
   * */
  constructor(url, timeout = null, onopenCallback, onmessageCallback, onerrorCallback, oncloseCallback) { // 自动检测是否存在的
    this.onopen = onopenCallback
    this.onmessage = onmessageCallback
    this.onerror = onerrorCallback
    this.onclose = oncloseCallback
    this.url = url
    // 该语句才是建立ws的核心
    this.websocketObject = this.loginWebsocket(url)
    this.lockReconnect = false// 避免重复连接
    this.timeout = timeout || 60000 // websocket断线重连时间
    this.websocketHeartCheckTimer = null// 心跳检测定时器
  }

  /**
   * 注册websocket
   * @param {String} url 链接的地址
   */
  loginWebsocket(url) {
    let websocket
    try {
      if ('WebSocket' in window) {
        websocket = new WebSocket('ws://' + url)
      } else if ('MozWebSocket' in window) {
        websocket = new MozWebSocket('ws://' + url)
      } else {
        websocket = new SockJS('http://' + url)
      }
    } catch (e) {
      console.log(`websocket连接失败---${e}`)
      this.reconnect(url)
    }
    websocket.onopen = this.onopen
    websocket.onmessage = this.onmessage
    websocket.onerror = this.onerror
    websocket.onclose = this.onclose
    return websocket
  }

  closeWebsocket() {
    this.websocketObject.close()
    this.websocketObject = null
    if (this.websocketHeartCheckTimer) {
      clearInterval(this.websocketHeartCheckTimer)
    }
    this.heartStart = () => {
    }
    this.heartReset = () => {
    }
  }

  /**
   * 重连方法
   */
  reconnect(url) {
    if (this.lockReconnect) {
      return
    }
    this.websocketObject.close()
    this.lockReconnect = true
    new Promise((resolve, reject) => {
      this.websocketObject = this.loginWebsocket(url)
      setTimeout(() => {
        if (this.websocketObject.readyState === 1) {
          resolve('connected')
        } else {
          reject(new Error('disconnected'))
        }
        this.lockReconnect = false
      }, 45000)
    }).catch(() => {
      this.websocketObject.close()
      this.reconnect(this.url)
    })
  }

  heartReset() {
    if (this.websocketHeartCheckTimer !== null) {
      clearInterval(this.websocketHeartCheckTimer)
      this.websocketHeartCheckTimer = null
    }
    this.heartStart()
  }

  heartStart() {
    new Promise((resolve, reject) => {
      this.websocketHeartCheckTimer = setInterval(() => {
        if (this.websocketObject.readyState === 1) {
          this.websocketObject.send('active')
          resolve('connected')
        } else {
          reject(new Error('disconnected'))
        }
      }, this.timeout)
    }).then(() => {
      clearInterval(this.websocketHeartCheckTimer)
      this.heartReset()
    }).catch(() => {
      this.websocketObject.close()
      this.reconnect(this.url)
    })
  }
}

export {MyWebsocketConnector}
