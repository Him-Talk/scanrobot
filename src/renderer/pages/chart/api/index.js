import Socket from './socket'
import Datafeeds from './datafees'
import { getOverrides, getStudiesOverrides } from './overrides'
import { widget } from '@/assets/charting_library/charting_library.min'
import pako from 'pako'
class TVjsApi {
  constructor (symbol) {
    this.symbol = symbol
    this.widgets = null // TODO: tradingview图表
    this.socket = new Socket('wss://ws-agent.evergreenstudio.dev/ws')
    this.interval = localStorage.getItem('tradingview.resolution') || '1' // 图表周期
    this.cacheData = {} // 图表缓存数据
    this.resolveSymbolinfo = {} // 币种信息
    this.lastTime = null
    this.getBarTimer = null
    this.studies = [] // 配置项
    this.isLoading = true // 是否懒加载
    this.socket.doOpen()
    this.resolution = {
      '1': '1min',
      '5': '5min',
      '15': '15min',
      '30': '30min',
      '60': '60min',
      '1D': '1day',
      '1W': '1week',
      '1M': '1mon',
      '1Y': '1year'
    };
    this.socket.on('open', () => {
      //  TODO: 页面初始化后请求币种基本信息
      this.sendMessage(JSON.stringify({
        sub: `market.${this.symbol}.detail`,
        id: 'id1'
      }))
    })
    this.socket.on('message', this.onMessage.bind(this))
    this.socket.on('close', this.onClose.bind(this))
    this.datafeeds = new Datafeeds(this)
  }
  getLanguageFromURL () {
      const regex = new RegExp('[\\?&]lang=([^&#]*)')
      const results = regex.exec(window.location.search)
      return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
  }
  /**
   * @description 图表初始化
   */
  init () {
    let resolution = this.interval // TODO: 图表周期
    // let chartType = (localStorage.getItem('tradingview.chartType') || '1') * 1
    let symbol = this.symbol // 币种信息
    let locale = 'zh' // 中文本地化
    let skin = localStorage.getItem('tradingViewTheme') || 'black' // 皮肤
    if (!this.widgets) {
        this.widgets = new widget({
            autosize: true,
            symbol: symbol,
            interval: resolution,
            container_id: 'tv_chart_container',
            datafeed: this.datafeeds,
            library_path: '../../static/charting_library/',
            enabled_features: ['study_templates'],
            timezone: 'Asia/Shanghai',
            // custom_css_url: 'chart.css',
            toolbar_bg: '#1b2331', // 工具栏的背景颜色
            locale: locale,
            debug: false,
            //  header_resolutions
            disabled_features: [
                'header_symbol_search',
                'header_saveload',
                'header_screenshot',
                'header_chart_type',
                'header_compare',
                'header_undo_redo',
                'timeframes_toolbar',
                'volume_force_overlay'
            ],
            // preset: 'mobile',
            overrides: getOverrides(skin),
            studies_overrides: getStudiesOverrides(skin)
        })

      let thats = this.widgets
      const buttons = [{
        title: 'Time',
        resolution: '1',
        chartType: 3
      },
        {
          title: '1min',
          resolution: '1',
          chartType: 1
        },
        {
          title: '5min',
          resolution: '5',
          chartType: 1
        },
        {
          title: '15min',
          resolution: '15',
          chartType: 1
        },
        {
          title: '30min',
          resolution: '30',
          chartType: 1
        },
        {
          title: '1hour',
          resolution: '60',
          chartType: 1
        },
        {
          title: '1day',
          resolution: '1D',
          chartType: 1
        },
        {
          title: '1week',
          resolution: '1W',
          chartType: 1
        },
        {
          title: '1month',
          resolution: '1M',
          chartType: 1
        }
      ]
      thats.onChartReady(() => {
        this.createStudy()
    })
    }
  }
  /**
   * @description 创建5、10、20、30日均线
   */
  createStudy () {
    let thats = this.widgets
    let id = thats.chart().createStudy('Moving Average', false, false, [5], null, {
      'Plot.color': 'rgb(150, 95, 196)'
    })
    this.studies.push(id)
    id = thats.chart().createStudy('Moving Average', false, false, [10], null, {
      'Plot.color': 'rgb(116,149,187)'
    })
    this.studies.push(id)
    id = thats.chart().createStudy('Moving Average', false, false, [20], null, {
      'plot.color': 'rgb(58,113,74)'
    })
    this.studies.push(id)
    id = thats.chart().createStudy('Moving Average', false, false, [30], null, {
      'plot.color': 'rgb(118,32,99)'
    })
    this.studies.push(id)
  }
  /**
   * @description websocket推送信息
   * @param {Object} e
   */
  onMessage (e) {
      let result = e
      if(result.hasOwnProperty('rep')){
          let data = result.data
          const ticker = `${this.symbol}-${this.interval}` // TODO: GXC/USDT-15
          const tickerCallback = ticker + 'Callback' // TODO: GXC/USDT-15Callback
          data.map((d)=> {
              d.time = d.id
              return d
          })
          if (data && data.length) { // TODO: 有数据返回

              let list = []
              const tickerstate = ticker + 'state' // TODO: GXC/USDT-15state
              const onLoadedCallback = this.cacheData[tickerCallback]
              list = [...list, ...data]

              // 如果没有缓存数据，则直接填充，发起订阅
              if (!this.cacheData[ticker]) {
                  this.cacheData[ticker] = list
                  this.subscribe() // TODO: 发起订阅
              }
              // 新数据即当前时间段需要的数据，直接喂给图表插件
              if (onLoadedCallback) {
                  onLoadedCallback(list)
                  delete this.cacheData[tickerCallback]
              }
              // 请求完成，设置状态为false
              this.cacheData[tickerstate] = !1
              // 记录当前缓存时间，即数组最后一位的时间
              this.lastTime = this.cacheData[ticker][this.cacheData[ticker].length - 1].time
          } else { // TODO: 无数据返回
              const onLoadedCallback = this.cacheData[tickerCallback]
              if (onLoadedCallback) {
                  onLoadedCallback([])
                  delete this.cacheData[tickerCallback]
              }
          }
      }
      if (result.hasOwnProperty('ch')) {
        switch(result.ch) {
            case `market.${this.symbol}.detail`:
                // TODO: 币种信息
                console.log('币种信息....')
                console.log(result.tick)
            break;
            case `market.${this.symbol}.kline.detail`:
                // TODO: 市场深度3
            {
                let data = result.tick
                const ticker = `${this.symbol}-${this.interval}` // TODO: GXC/USDT-15
                const tickerCallback = ticker + 'Callback' // TODO: GXC/USDT-15Callback
                data.map((d)=> {
                    d.time = d.id
                    return d
                })
                if (data && data.length) { // TODO: 有数据返回
                    let list = []
                    const tickerstate = ticker + 'state' // TODO: GXC/USDT-15state
                    const onLoadedCallback = this.cacheData[tickerCallback]
                    list = [...list, ...data]

                    // 如果没有缓存数据，则直接填充，发起订阅
                    if (!this.cacheData[ticker]) {
                        this.cacheData[ticker] = list
                        this.subscribe() // TODO: 发起订阅
                    }
                    // 新数据即当前时间段需要的数据，直接喂给图表插件
                    if (onLoadedCallback) {
                        onLoadedCallback(list)
                        delete this.cacheData[tickerCallback]
                    }
                    // 请求完成，设置状态为false
                    this.cacheData[tickerstate] = !1
                    // 记录当前缓存时间，即数组最后一位的时间
                    this.lastTime = this.cacheData[ticker][this.cacheData[ticker].length - 1].time
                } else { // TODO: 无数据返回
                    const onLoadedCallback = this.cacheData[tickerCallback]
                    if (onLoadedCallback) {
                        onLoadedCallback([])
                        delete this.cacheData[tickerCallback]
                    }
                }
            }
            break;
            case `market.${this.symbol}.kline.${this.resolution[this.interval]}`:
            {
                let data = result.tick
                if (data) {
                    const ticker = `${this.symbol}-${this.interval}` // TODO: GXC/BTC-15
                    let barsData = {
                        time: data.id,
                        open: data.open,
                        high: data.high,
                        low: data.low,
                        close: data.close,
                        volume: data.volume,
                        isBarClosed: true,
                        isLastBar: false
                    }
                    // TODO: 如果增量更新数据的时间大于缓存时间，而且缓存有数据，数据长度大于0
                    if (barsData.time > this.lastTime && this.cacheData[ticker] && this.cacheData[ticker].length) {
                        // 增量更新的数据直接加入缓存数组
                        this.cacheData[ticker].push(barsData)
                        // 修改缓存时间
                        this.lastTime = barsData.time
                    } else if (barsData.time === this.lastTime && this.cacheData[ticker] && this.cacheData[ticker].length) {
                        // 如果增量更新的时间等于缓存时间，即在当前时间颗粒内产生了新数据，更新当前数据
                        this.cacheData[ticker][this.cacheData[ticker].length - 1] = barsData
                    }
                    console.log('订阅数据.....')
                    console.log(this.lastTime)
                    console.log(barsData.time)
                    // TODO: 通知图表插件，可以开始增量更新的渲染了
                    this.datafeeds.barsUpdater.updateData()
                }
            }
            break;
            default:
              break;
        }
      }
  }
  /**
   * @description websocket关闭信息
   */
  onClose () {
    console.log(' >> : 连接已断开... 正在重连')
  }
  /**
   * 发送websocket消息
   * @param {Object} data
   */
  sendMessage (data) {
    if (this.socket.checkOpen()) { // 检验websocket是否打开
      this.socket.send(data)
    } else {
      this.socket.on('open', () => {
        this.socket.send(data)
      })
    }
  }
  /**
   * @description 获取当前交易币种信息
   * @param {String} symbol 币种信息
   */
  getSymbolinfo (symbol) {
    // let splitsymbolName = symbol.split('/')
    // let tradeAssetId = filtercoin(splitsymbolName[splitsymbolName.length - 2]).asset_id
    // let coreAssetId = filtercoin(splitsymbolName[splitsymbolName.length - 1]).asset_id
    // return {
    //   coreAssetId,
    //   tradeAssetId
    // }
  }
  /**
   * @description 获取历史K线数据
   * @param {*} symbolInfo
   * @param {*} resolution
   * @param {*} rangeStartDate
   * @param {*} rangeEndDate
   * @param {*} onLoadedCallback
   */
  getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
    let ticker = `${symbolInfo.name}-${resolution}` // TODO: GDEXGDC/GXC-1D
    let tickerload = ticker + 'load' // TODO: GDEXGDC/GXC-1Dload
    let tickerstate = ticker + 'state' // TODO: GDEXGDC/GXC-1Dstate
    if (!this.cacheData[ticker] && !this.cacheData[tickerstate]) { // TODO: 如果缓存没有数据，而且未发出请求，记录当前节点开始时间
      this.cacheData[tickerload] = rangeStartDate
      // 发起请求，从websocket获取当前时间段的数据
      this.initMessage(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
      // 设置状态为true
      this.cacheData[tickerstate] = !0

      return false
    }
    //  TODO: 获取历史记录
    if (!this.cacheData[tickerload] || this.cacheData[tickerload] > rangeStartDate) { // TODO: 如果缓存有数据，但是没有当前时间段的数据，更新当前节点时间
      this.cacheData[tickerload] = rangeStartDate
      this.initMessage(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
      this.cacheData[tickerstate] = !0
      return false
    }
    if (this.cacheData[tickerstate]) { // TODO: 正在从websocket获取数据，禁止一切操作
      return false
    }
    ticker = `${symbolInfo.name}-${this.interval}` // TODO: GDEXGDC/GXC-1D
    //  如果缓存中有当前时间段的数据，构造newBars，调用onLoadedCallback(newBars)。
    if (this.cacheData[ticker] && this.cacheData[ticker].length) {
      this.isLoading = false // 关闭loading
      const newBars = []
      this.cacheData[ticker].forEach(item => {
        if (item.time >= rangeStartDate * 1000 && item.time <= rangeEndDate * 1000) {
          newBars.push(item)
        }
      })
      onLoadedCallback(newBars)
    } else {
      this.getBarTimer = setTimeout(() => {
        this.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
    }, 10)
    }
  }
  /**
   * @description 初始化数据
   * @param {*} symbolInfo
   * @param {*} resolution
   * @param {*} rangeStartDate
   * @param {*} rangeEndDate
   * @param {*} onLoadedCallback
   */
  initMessage (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
    // 保留当前回调
    const tickerCallback = symbolInfo.name + '-' + resolution + 'Callback' // TODO: GDEXGDC/GXC-1DCallback
    this.cacheData[tickerCallback] = onLoadedCallback
    // 商品名
    const symbol = this.symbol
    // 如果当前时间节点已经改变，停止上一个时间节点的订阅，修改时间节点值
    if (this.interval !== resolution) {
      this.unSubscribe(this.interval)
      this.interval = resolution
    }
    // TODO: 获取当前时间段的数据，在onMessage中执行回调onLoadedCallback
    if (symbolInfo && resolution && rangeStartDate && rangeEndDate) {
      let symbol = symbolInfo.full_name
      let resolutionstr = this.initresolutionstr(resolution)

      let params = {
            req: `market.${this.symbol}.kline.${this.resolution[this.interval]}`,
            from: (rangeEndDate - rangeEndDate%60) - this.toSec(resolution),
            to: (rangeEndDate-rangeEndDate%60+ 120),
            id: `id${Math.floor(Math.random()*1000)}`
        };
      this.sendMessage(JSON.stringify(params))
    }
  }
  toSec(resolution){
    switch(resolution){
        case 1:
          return 60
        break;
        case 5:
          return 300
        break;
        case 15:
          return 15*60
          break;
        case 30:
          return 1800
        break;
        case 60:
          return 3600
        break;
        case '1d':
          return 3600 *24
        break;
        case '1W':
          return 3600*24*7
        break;
        case '1M':
          return 3600*24*30
        break;
        case '1Y':
          return 3600*244*365
        break;
    }
  }
  initresolutionstr (resolution) {
    let resolutionstr = ''
    if (resolution <= 60) {
      resolutionstr = resolution + 'm'
    } else if (resolution === 240) {
      resolutionstr = '4h'
    } else if (resolution === '1D') {
      resolutionstr = '1d'
    } else {
      resolutionstr = '1d'
    }
    return resolutionstr
  }
  /**
   * @description 发起订阅
   */
  subscribe () {
    let params = {
      id: 'id123',
      sub: `market.${this.symbol}.kline.${this.resolution[this.interval]}`
    }
    this.sendMessage(JSON.stringify(params))
  }
  /**
   * @description 取消订阅
   * @param {String} interval 周期
   */
  unSubscribe (interval) {
    //  TODO: 停止订阅，删除过期缓存、缓存时间、缓存状态
    const ticker = `${this.symbol}-${interval}` // TODO: GDEXGDC/GXC-1D
    const tickertime = ticker + 'load'
    const tickerstate = ticker + 'state'
    const tickerCallback = ticker + 'Callback'
    delete this.cacheData[ticker]
    delete this.cacheData[tickertime]
    delete this.cacheData[tickerstate]
    delete this.cacheData[tickerCallback]
    let resolutionstr = this.initresolutionstr(interval)
    let params = {
      id: 'id123',
      unsub: `market.${this.symbol}.kline.${this.resolution[this.interval]}`
    }
    this.sendMessage(JSON.stringify(params))
  }
  /**
   * @description 切换交易对
   * @param {String} newpair 新交易对
   * @param {String} oldpair 旧交易对
   */
  switchtranspair (newpair, oldpair) {
    const newpairinfo = this.getSymbolinfo(newpair) // TODO: 新交易对详情 {coreAssetId: 1, tradeAssetId: 18}
    //  TODO: 旧交易对 停止订阅，删除过期缓存、缓存时间、缓存状态
    const oldticker = `GDEX${oldpair}-${this.interval}`
    this.datafeeds.unsubscribeBars(oldticker) // TODO: 取消订阅
    const tickertime = oldticker + 'load'
    const tickerstate = oldticker + 'state'
    const tickerCallback = oldticker + 'Callback'
    delete this.cacheData[oldticker]
    delete this.cacheData[tickertime]
    delete this.cacheData[tickerstate]
    delete this.cacheData[tickerCallback]

    this.symbol = newpair
    this.initsymbolparams = newpairinfo
    this.isLoading = true
    return new Promise((resolve, reject) => {
      resolve({ // TODO: reslove回递消息确认
            symbol: this.symbol,
      initsymbolparams: this.initsymbolparams
  })
  })
  }
  /**
   * @description 销毁操作
   */
  destoryinstance () {
    this.unSubscribe(this.interval)
    return new Promise((resolve, reject) => {
      this.widgets = null
    this.cacheData = {}
    this.resolveSymbolinfo = {} // 币种信息
    this.lastTime = null
    this.getBarTimer = null
    this.studies = [] // 配置项
    this.socket.destroy()
    resolve(true)
  })
  }
}

export default TVjsApi
