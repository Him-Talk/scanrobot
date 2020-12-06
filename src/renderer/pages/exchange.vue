<template>
  <Frame>
    <renderHead slot="header"></renderHead>
    <el-container style="height:760px">
      <el-aside width="200px">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
                    default-active="0"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#fff"
                    text-color="#000"
                    active-text-color="#333">
              <el-submenu index="0">
                <template slot="title">
                  <i class="el-icon-goods"></i>
                  <span slot="title">市场列表</span>
                </template>
                <template v-if="favorite.length > 0">
                  <el-menu-item v-for="(item, index) in favorite" :key="index" :index="'0-' + index" @click="openChart(item.symbol)">
                    <span :style="item.state === 'online' ? 'color:green' : 'color:red'">{{item.symbol.toUpperCase()}} {{item.close.toString()}}</span>
                  </el-menu-item>
                </template>
              </el-submenu>
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>账户管理</span>
                </template>
                <el-menu-item index="1-1" @click="openWins('/accounts/turnover', 1480, 800)">账户流水</el-menu-item>
                <el-menu-item index="1-2" @click="openWins('/accounts/finance', 1480, 800)">财务流水</el-menu-item>
                <el-menu-item index="2-3" @click="openWins('/accounts/deposit', 1280, 800)">充提记录</el-menu-item>
                <!--<el-menu-item index="1-4" @click="openWins('/accounts/authors')">授权管理</el-menu-item>-->
                <el-menu-item index="1-5" @click="openWins('/accounts/assets')">资产管理</el-menu-item>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-setting"></i>
                  <span slot="title">财务信息</span>
                </template>
                <el-menu-item index="2-1" @click="openWins('/finance/transaction', 1480, 800)">交易记录</el-menu-item>
                <el-menu-item index="2-2" @click="openWins('/finance/transfer')">资产划转</el-menu-item>
                <!--<el-menu-item index="2-3" @click="openWins('/finance/pending')">未成交订单</el-menu-item>-->
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-setting"></i>
                  <span slot="title">市场观察</span>
                </template>
                <el-menu-item index="3-1" @click="openWins('/market/quotes', 1280, 683)">行情列表</el-menu-item>
                <el-menu-item index="3-2" @click="openWins('/market/stats')">系统状态</el-menu-item>
                <el-menu-item index="3-3" @click="openWins('/market/pending')">未成交订单</el-menu-item>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-setting"></i>
                  <span slot="title">系统设置</span>
                </template>
                <el-menu-item index="4-1" @click="openWins('/config/api', 800, 600)">API设置</el-menu-item>
                <el-menu-item index="4-2" @click="openWins('/config/market')">市场设置</el-menu-item>
                <el-menu-item index="4-3" @click="openWins('/config/haystack', 1400, 800)">大海捞针</el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <marketList :ws="ws" :url="url" :ver="ver" :normal="normal" :sub="sub" :quota="quota" :maxfavorite="maxfavorite" @setData="setData"></marketList>
      </el-main>
    </el-container>
    <el-footer height="60"></el-footer>
  </Frame>
</template>
<script>
  import Frame from '@/components/frame/mainFrame.vue'
  import renderHead from '@/components/header/renderHead.vue'
  import marketList from '@/components/market/list.vue'
  export default {
    data () {
      return {
        ws: 'wss://ws-agent.evergreenstudio.dev/ws',
        url: 'https://api-agent.evergreenstudio.dev',
        ver: 'v1',
        sub: {
          entry: 30,
          cur: 0,
          high: 300,
          target: 30,
          clientid: 0
        },
        normal: ['btcusdt', 'ethusdt', 'ltcusdt', 'bchusdt', 'uniusdt', 'unieth', 'ethbtc', 'bchbtc', 'ltcbtc'], // 常规市场监听
        quota: ['btc', 'eth', 'usdt'],
        search: '',
        favorite: [],
        maxfavorite: 0,
        socket: [],
        marketlist: [{
          symbol: 'btcusdt',
          amount: 0,
          vol: 0,
          high: 0,
          low: 0,
          close: 0,
          open: 0,
          count: 0,
          id: 1
        }],
        allmarket: [],
        root: ''
      }
    },
    components: { Frame, renderHead, marketList },
    mounted: function () {
        this.root = this.$universal.hash('talkrun')
        this.init()
    },
    watch: {
      marketlist: {
        handler: function (newValue, oldValue) {
          this.marketlist = newValue
        },
        deep: true
      }
    },
    methods: {
      init(){
          electron.ipcRenderer.send('leveldb', {
              name: 'find',
              keys: {prefix: `${this.root}.accountid.config.api.temp`, limit:1, revers: false}
          });
          electron.ipcRenderer.on(`${this.root}.accountid.config.api.temp_find_callback`,(event, args)=> {
              if(args.key !== null) {
                  this.quota = args.value.type
              }
          });
          electron.ipcRenderer.send('leveldb', {
              name: 'find',
              keys: {prefix: `${this.root}.accountid.config.market.temp`, limit: 1, revers: false}
          });
          electron.ipcRenderer.on(`${this.root}.accountid.config.market.temp_find_callback`, (event, args)=> {
              if(args !== null && args.key !== null) {
                  this.normal = args.value.normal==='' ? [] : args.value.normal.split(',')
                  this.sub.entry = args.value.entry
                  this.sub.high = args.value.high
                  this.maxfavorite = parseInt(args.value.favorite)
              }
          })
      },
      async openWins (router, x=800, y=500) {
        this.$store.dispatch('changeTransition', 'default')
        await this.$Win.openWin({
            width: x,
            height: y,
            useContentSize: false,
            transparent: true,
            frame: false,
            resizable: true,
            alwaysOnTop: false,
            windowConfig: {
                router: router,
                name: `${router.split('/').join('')}`,
                reload: true
            }
        })
      },
      setData (event) {
          this[event.name] = event.data
      },
      handleOpen (key, keyPath) {
          console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
          console.log(key, keyPath)
      },
      async openChart (symbol) {
        this.$store.dispatch('changeTransition', 'default')
        let win = await this.$Win.openWin({
          width: 800,
          height: 500,
          useContentSize: false,
          transparent: true,
          frame: false,
          resizable: true,
          alwaysOnTop: true,
          windowConfig: {
            router: '/chart',
            data: {symbol: symbol},
            name: `chart${symbol}`,
            reload: true
          }
        })
      },
      findIndex (symbol) {
        if (this.favorite.length === 0) {
          return true
        } else if (this.favorite.findIndex((d) => d['symbol'] === symbol) === -1) {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>
<style scoped>
  body {
    margin: 0;
  }
  .main-div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: baseline;
  }
  .ele-font{
    font-size: 30px;
    padding: 15px;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #e7e7e7;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #f1f1f1;
    color: #333;
    text-align: center;
    min-height: 360px;
  }

  .el-main:nth-child(0){
    line-height: 20px;
  }
  .el-footer {
    width: 100%;
    display: flex;
    flex-direction: row;
    display: flex;

  }
  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

</style>