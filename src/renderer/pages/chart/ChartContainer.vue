<template>
    <Frame>
        <renderHead slot="header"></renderHead>
        <div class="main-div">
            <div class="ChartContainer" id="tv_chart_container"></div>
            <!--<lightweight />-->
            <!--<TVChartContainer />-->
        </div>
    </Frame>
</template>

<script>
    import Frame from '@/components/frame/mainFrame.vue'
    import renderHead from '@/components/header/renderHead.vue'
//    import lightweight from '@/components/market/lightweight-charts.vue'
//    import TVChartContainer from '@/components/market/TVChartContainer.vue'
      import TVjsApi from './api/index'
      let jsApi = null // TODO: 图表配置项
    export default {
        data() {
          return {
              data: {}
          }
        },
        mounted: function () {
            this.data = this.$Win.getParameter()
            console.warn(this.data)
            jsApi = new TVjsApi(this.data.symbol)
            jsApi.init() // 图表初始化
        },
        components: {Frame, renderHead },
        methods: {
          changetranspair (val, old) {
            console.log('切换交易对....')
            console.log(val)
             if (jsApi) {
                  this._jsApi.widgets.chart().setSymbol(val)
                 jsApi.switchtranspair(val, old).then((res) => {
                     jsApi.widgets.chart().setSymbol(val)
                 })
             }
          }
        },
        destroyed () {
            jsApi.destoryinstance().then((bool) => {
                if (bool) {
                    jsApi = null
                }
            })
        }
    }
</script>


<style lang="scss">
    .ChartContainer {
        width: 100%;
        height: 460px;
    }
    .main-div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .ele-font{
        font-size: 30px;
        padding: 15px;
    }
</style>