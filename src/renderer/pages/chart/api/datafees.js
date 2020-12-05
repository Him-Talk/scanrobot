import DataUpdater from './dataUpdater'

class datafeeds {
  constructor (vue) {
    this.self = vue
    this.currentsymbolinfo = null
    this.barsUpdater = new DataUpdater(this)
  }
  /**
   * @description 提供填充配置数据的对象
   * @param {*Function} callback  回调函数
   */
  onReady (callback) {
    console.log('1.onReady running......')
    return new Promise((resolve, reject) => {
      let configuration = this.defaultConfiguration()
      if (this.self.getConfig) {
        configuration = Object.assign(this.defaultConfiguration(), this.self.getConfig)
      }
      resolve(configuration)
    }).then((data) => {
      return callback(data)
    })
  }
  /**
   * @description 通过商品名称解析商品信息
   * @param {String} symbolName 商品名
   * @param {Function} onSymbolResolvedCallback 成功回调
   * @param {Function} onResolveErrorCallback 失败回调
   */
  async resolveSymbol (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    return new Promise((resolve, reject) => {
      let defaultSymbolinfo = this.defaultSymbol()
      resolve(defaultSymbolinfo)
    }).then((data) => {
      onSymbolResolvedCallback(data)
    }).catch((err) => {
      onResolveErrorCallback(err)
    })
  }
  /**
   * @description 通过日期范围获取历史K线数据
   * @param {*Object} symbolInfo  商品信息对象
   * @param {*String} resolution  分辨率
   * @param {*Number} rangeStartDate  时间戳、最左边请求的K线时间
   * @param {*Number} rangeEndDate  时间戳、最右边请求的K线时间
   * @param {*Function} onDataCallback  回调函数
   * @param {*Function} onErrorCallback  回调函数
   */
  getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
    const onLoadedCallback = data => {
      data && data.length ? onDataCallback(data, {
        noData: true
      }) : onDataCallback([], {
        noData: true
      })
    }
    this.self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
  }
  /**
   * @description 订阅K线数据
   * @param {*} symbolInfo  商品信息对象
   * @param {*} resolution  周期 '1D'
   * @param {*} onRealtimeCallback
   * @param {*} subscriberUID  GDEX:GDC/GXC_1D
   * @param {*} onResetCacheNeededCallback
   */
  subscribeBars (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    console.log('4.订阅K线数据....')
    this.barsUpdater.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback)
  }
  /**
   * @description 取消订阅K线数据
   * @param {String} subscriberUID
   */
  unsubscribeBars (subscriberUID) {
    console.log('取消订阅....')
    this.barsUpdater.unsubscribeBars(subscriberUID)
    this.self.unSubscribe(subscriberUID)
  }
  /**
   * @description 修改默认配置
   */
  defaultConfiguration () {
    return {
      supports_search: false,
      supports_group_request: false,
      supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D', '5D', '1W', '1M'],
      supports_marks: true,
      supports_timescale_marks: true,
      supports_time: true
    }
  }
  /**
   * @description 修改默认商品信息
   */
  defaultSymbol () {
    return {
      'base_name': [this.self.symbol],
      'data_status': 'streaming',
      'description': `${this.self.symbol},LongBit`,
      'exchange': 'LongBit',
      'full_name': this.self.symbol,
      'has_intraday': true,
      'intraday_multipliers': ['1S', '1', '5', '15', '30', '60', '240'],
      'legs': this.self.symbol,
      'minmov': 1,
      'name': `LongBit${this.self.symbol}`,
      'pricescale': 100000,
      'pro_name': this.self.symbol,
      'session': '24x7',
      'supported_resolutions': ['1S', '1', '5', '15', '30', '60', '240', '1D', '5D', '1W', '1M'],
      'ticker': `LongBit:${this.self.symbol}`,
      'timezone': 'Asia/Shanghai',
      'type': 'crypto',
      'volume_precision': 5
    }
  }
}
export default datafeeds
