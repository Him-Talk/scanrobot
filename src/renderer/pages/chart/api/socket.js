import pako from 'pako'
class socket {
  constructor (url, options = null) {
    this.url = url
    this.heartCheck = null
    this.options = options
    this.messageMap = {}
    this.connState = 0 // 连接状态
    this.socket = null
  }
  doOpen () { // TODO: 开启websocket连接
    if (this.connState) {
      return
    }
    this.connState = 1
    const BrowserWebSocket = window.WebSocket || window.MozWebSocket
    const socket = new BrowserWebSocket(this.url)
    const _this = this
    socket.onopen = (e) => {
      return _this.onOpen(e)
    }
    socket.onmessage = (e) => {
      var result = ''
      var _this = this
      if (e.data instanceof Blob) {
          var reader = new FileReader()
          reader.readAsArrayBuffer(e.data)
          reader.onload = function () {
              var arrayBuffer = this.result
              result = JSON.parse(pako.ungzip(new Uint8Array(arrayBuffer), {to: 'string'}))
              if(result.ping){
                _this.send(JSON.stringify({
                    pong: result.ping
                }))
              }
              console.log(result)
              return _this.onMessage(result)
          }
      }
    }
    socket.onclose = (e) => {
      return _this.onClose(e)
    }
    socket.onerror = (e) => {
      return _this.onError(e)
    }
    this.socket = socket
  }
  onOpen (e) { // TODO: 连接打开
    this.connState = 2
    // this.heartCheck.start(this.socket)
    this.onReceiver({ Event: 'open' })
  }
  onMessage (e) { // TODO: 接收websocket推送信息
    try {
      let data = e
      // this.heartCheck.reset()
      this.onReceiver({ Event: 'message', data })
    } catch (error) {
      console.error(' >> onMessage 发生错误', error)
    }
  }
  onClose (e) { // TODO: websocket关闭
    console.log('关闭websocket链接....')
    console.log(e)
    this.connState = 0
    if (this.connState) {
      this.onReceiver({ Event: 'close' })
    }
  }
  onError (e) { // TODO: websocket错误
    this.connState = 0
    this.doClose()
    console.log(' >> onError 发生错误', e)
  }
  checkOpen () { // TODO: 检验websocket连接状态
    return this.connState === 2
  }
  send (data) { // TODO: 发送信息
    if (this.socket.readyState !== 1) {
      setTimeout(() => {
        this.send(data)
      }, 100)
    } else {
      this.socket.send(data)
    }
  }
  onReceiver (data) { // TODO: 注册接收器
    let callback = this.messageMap[data.Event]
    if (callback) callback(data.data)
  }
  on (eventname, handler) { // TODO:绑定监听事件
    this.messageMap[eventname] = handler
  }
  emit (data) { // TODO: 绑定传递事件
    return new Promise((resolve, reject) => {
      this.socket.send(data)
      this.on('message', (data) => {
        resolve(data)
      })
    })
  }
  doClose () { // TODO: 主动关闭websocket
    this.socket.close()
  }
  destroy () { // TODO: 销毁websocket
    // if (this.heartBeatTimer) {
    //   clearInterval(this.heartBeatTimer)
    //   this.heartBeatTimer = null
    // }
    this.doClose()
    this.messageMap = {}
    this.connState = 0
    this.socket = null
  }
}

export default socket
