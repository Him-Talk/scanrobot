<template>
  <div>
    <div class="main-div">
      <div class="main-div-child" @click="goWindows">
        <i class="iconfont icon-jiaojuan icons"></i>
        <span style="font-size: 12px">弹窗效果</span>
      </div>
      <div class="main-div-child" @click="goTransform">
        <i class="iconfont icon-donghuaguanli icons"></i>
        <span style="font-size: 12px">动画效果</span>
      </div>
      <div class="main-div-child" @click="goIpc">
        <i class="iconfont icon-tongxin icons"></i>
        <span style="font-size: 12px">窗口通信</span>
      </div>
      <div class="main-div-child" @click="openExchange">
        <i class="iconfont icon-btn_qq icons"></i>
        <span style="font-size: 12px">市场交易</span>
      </div>
    </div>
    <div class="main-div">
      <div class="main-div-child" @click="openHaystack">
        <i class="iconfont icon-btn_qq icons"></i>
        <span style="font-size: 12px">大海捞针</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
      async openHaystack () {
          this.$store.dispatch('changeTransition', 'default')
          let res = await this.$Win.openWin({
              width: 1400,
              height: 800,
              windowConfig: {
                  router: '/config/haystack',
                  name: 'confighaystack',
                  reload: true
              }
          })
      },
      goWindows () {
        this.$store.dispatch('changeTransition', 'slipLeft')
        this.$router.push('/windows')
      },
      goTransform () {
        this.$store.dispatch('changeTransition', 'slipLeft')
        this.$router.push('/transform')
      },
      goIpc () {
        this.$store.dispatch('changeTransition', 'slipLeft')
        this.$router.push('/ipc')
      },
      async openExchange () {
        this.$store.dispatch('changeTransition', 'default')
        let res = await this.$Win.openWin({
          width: 1400,
          height: 800,
          windowConfig: {
            router: '/exchange',
            name: 'exchange',
            reload: true
          }
        })
        console.log(res)
      }
    },
    mounted: function () {
    }
  }
</script>
<style>
.main-div {
  width: 100%;
  height: 100%;
  display: flex;
}
.icons {
  font-size: 30px;
}
.main-div-child{
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50px;
  width: 50px;
  padding: 10px;
}
.main-div-child span{
  color: #fff;
}
</style>
