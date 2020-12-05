/**
 *
 * @param {*} theme 主题：
 * white(日间模式) black(夜间模式) mobile(移动端模式)
 */
export function getOverrides (theme = 'black') { // Widget对象的默认属性进行覆盖
  const themes = {
    'white': { // 日间模式
      up: '#03c087',
      down: '#ef5555',
      bg: '#ffffff',
      grid: '#f7f8fa',
      cross: '#23283D',
      border: '#9194a4',
      text: '#9194a4',
      areatop: 'rgba(71, 78, 112, 0.1)',
      areadown: 'rgba(71, 78, 112, 0.02)',
      line: '#737375'
    },
    'black': { // 夜间模式
      up: '#4bd96e',
      down: '#cb4867',
      bg: '#1b2331',
      grid: '#262c36',
      cross: '#37a6ef',
      border: '#4e5b85',
      text: '#4d596e',
      areatop: 'rgba(122, 152, 247, .1)',
      areadown: 'rgba(122, 152, 247, .02)',
      line: '#737375'
    },
    'mobile': { // 移动端模式
      up: '#03C087',
      down: '#E76D42',
      bg: '#ffffff',
      grid: '#f7f8fa',
      cross: '#23283D',
      border: '#C5CFD5',
      text: '#8C9FAD',
      areatop: 'rgba(71, 78, 112, 0.1)',
      areadown: 'rgba(71, 78, 112, 0.02)',
      showLegend: !0
    }
  }
  const t = themes[theme]
  return {
    'volumePaneSize': 'medium', // 支持的值: large, medium, small, tiny
    'scalesProperties.lineColor': t.text,
    'scalesProperties.textColor': t.text,
    'paneProperties.background': t.bg,
    'paneProperties.vertGridProperties.color': t.grid,
    'paneProperties.horzGridProperties.color': t.grid,
    'paneProperties.crossHairProperties.color': t.cross,
    'paneProperties.legendProperties.showLegend': !!t.showLegend,
    'paneProperties.legendProperties.showStudyArguments': !0,
    'paneProperties.legendProperties.showStudyTitles': !0,
    'paneProperties.legendProperties.showStudyValues': !0,
    'paneProperties.legendProperties.showSeriesTitle': !0,
    'paneProperties.legendProperties.showSeriesOHLC': !0,
    'mainSeriesProperties.candleStyle.upColor': t.up,
    'mainSeriesProperties.candleStyle.downColor': t.down,
    'mainSeriesProperties.candleStyle.drawWick': !0,
    'mainSeriesProperties.candleStyle.drawBorder': !0,
    'mainSeriesProperties.candleStyle.borderColor': t.border,
    'mainSeriesProperties.candleStyle.borderUpColor': t.up,
    'mainSeriesProperties.candleStyle.borderDownColor': t.down,
    'mainSeriesProperties.candleStyle.wickUpColor': t.up,
    'mainSeriesProperties.candleStyle.wickDownColor': t.down,
    'mainSeriesProperties.candleStyle.barColorsOnPrevClose': !1,
    'mainSeriesProperties.hollowCandleStyle.upColor': t.up,
    'mainSeriesProperties.hollowCandleStyle.downColor': t.down,
    'mainSeriesProperties.hollowCandleStyle.drawWick': !0,
    'mainSeriesProperties.hollowCandleStyle.drawBorder': !0,
    'mainSeriesProperties.hollowCandleStyle.borderColor': t.border,
    'mainSeriesProperties.hollowCandleStyle.borderUpColor': t.up,
    'mainSeriesProperties.hollowCandleStyle.borderDownColor': t.down,
    'mainSeriesProperties.hollowCandleStyle.wickColor': t.line,
    'mainSeriesProperties.haStyle.upColor': t.up,
    'mainSeriesProperties.haStyle.downColor': t.down,
    'mainSeriesProperties.haStyle.drawWick': !0,
    'mainSeriesProperties.haStyle.drawBorder': !0,
    'mainSeriesProperties.haStyle.borderColor': t.border,
    'mainSeriesProperties.haStyle.borderUpColor': t.up,
    'mainSeriesProperties.haStyle.borderDownColor': t.down,
    'mainSeriesProperties.haStyle.wickColor': t.border,
    'mainSeriesProperties.haStyle.barColorsOnPrevClose': !1,
    'mainSeriesProperties.barStyle.upColor': t.up,
    'mainSeriesProperties.barStyle.downColor': t.down,
    'mainSeriesProperties.barStyle.barColorsOnPrevClose': !1,
    'mainSeriesProperties.barStyle.dontDrawOpen': !1,
    'mainSeriesProperties.lineStyle.color': t.border,
    'mainSeriesProperties.lineStyle.linewidth': 1,
    'mainSeriesProperties.lineStyle.priceSource': 'close',
    'mainSeriesProperties.areaStyle.color1': t.areatop,
    'mainSeriesProperties.areaStyle.color2': t.areadown,
    'mainSeriesProperties.areaStyle.linecolor': t.border,
    'mainSeriesProperties.areaStyle.linewidth': 1,
    'mainSeriesProperties.areaStyle.priceSource': 'close'
  }
}

/**
 *
 * @param {*} theme
 * white(日间模式) black(夜间模式) mobile(移动端模式)
 */
export function getStudiesOverrides (theme = 'black') { // 自定义默认指标的样式及输入值
  const themes = {
    'white': {
      c0: '#eb4d5c',
      c1: '#53b987',
      t: 70,
      v: !1
    },
    'black': {
      c0: '#fd8b8b',
      c1: '#3cb595',
      t: 70,
      v: !1
    },
    'mobile': {
      c0: '#fd8b8b',
      c1: '#3cb595',
      t: 70,
      v: !1
    }
  }
  const t = themes[theme]
  return {
    'volume.volume.color.0': t.c0,
    'volume.volume.color.1': t.c1,
    'volume.volume.transparency': t.t,
    'volume.options.showStudyArguments': t.v
  }
}
