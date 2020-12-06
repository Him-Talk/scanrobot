<template>
    <Frame>
    <renderHead slot="header"></renderHead>
    <el-main>
        <el-select v-model="form.symbol" filterable placeholder="交易对" @change="merged">
            <el-option label="缺省交易对" value=""></el-option>
            <el-option v-for="(item, index) in symbols" :key="index" :label="item.symbol.toUpperCase()" :value="item.symbol"></el-option>
        </el-select>
        <el-col :span="3">
            <el-button type="success" @click="tickers">获得最新Tickers</el-button>
        </el-col>
        <el-table height="600" v-loading="loading" :data="tableData" style="width: 100%" max-height="550">
                  <!--row-key="symbol"-->
                  <!--border-->
                  <!--lazy-->
                  <!--:load="load"-->
                  <!--:tree-props="{children: 'children', hasChildren: 'hasChildren'}">-->
            <el-table-column fixed prop="symbol" label="交易对" width="140">
                <template slot-scope="scope">
                    <el-tag>{{ scope.row.symbol.toUpperCase() }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="count" label="交易笔数" width="100"></el-table-column>
            <el-table-column prop="bid" label="买一价" width="120"></el-table-column>
            <el-table-column prop="bidSize" label="买一量" width="120">
                <template slot-scope="scope">
                    <el-tag>{{ scope.row.bidSize }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="ask" label="卖一价" width="120"></el-table-column>
            <el-table-column prop="askSize" label="卖一量" width="120">
                <template slot-scope="scope">
                    <el-tag>{{ scope.row.askSize }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="bid" label="盘口" width="170">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>开盘价：<el-tag>{{ scope.row.open }}</el-tag></p>
                        <p>收盘价：<el-tag>{{ scope.row.close }}</el-tag></p>
                        <p>最高价：<el-tag>{{ scope.row.high }}</el-tag></p>
                        <p>最低价：<el-tag>{{ scope.row.low }}</el-tag></p>
                        <div slot="reference" class="name-wrapper">
                            收盘价：<el-tag>{{ scope.row.close }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column fixed="right" prop="vol" label="交易量" width="240">
                <template slot-scope="scope">
                    <p>基础币种交易量：<el-tag>{{ scope.row.amount.toFixed(2) }}</el-tag></p>
                    <p>报价币种交易量：<el-tag>{{ scope.row.vol.toFixed(2) }}</el-tag></p>
                </template>
            </el-table-column>
        </el-table>
    </el-main>
    </Frame>
</template>
<script>
    import Frame from '@/components/frame/mainFrame.vue'
    import renderHead from '@/components/header/renderHead.vue'
    export default {
        data () {
            return {
                form: {
                  symbol: 'btcusdt'
                },

                config: {},
                symbols: [],
                loading: true,
                tableData: [],
                quotalist: [],
                 market: {},
                root: ''
            }
        },
        components: {Frame, renderHead},
        methods: {
            init() {
                let _this = this
                try {
                    electron.ipcRenderer.send('leveldb', {
                        name: 'find',
                        keys: {prefix: `${this.root}.accountid.config.api.temp`, limit: 1, revers: false}
                    });
                    electron.ipcRenderer.on(`${this.root}.accountid.config.api.temp_find_callback`, (event, args) => {
                        if (args !== '' && args.key!==null) {
                            let res = JSON.parse(JSON.stringify(args.value));
                            if (args.key !== null) {
                                if(res.url === ''){
                                    _this.$alert('您还没有配置api接口地址哦，无法使用交易所功能', '温馨提示',{
                                        confirmButtonText: '确定'
                                    })
                                    return false;
                                }else {
                                    _this.config = res
                                    _this.marketdata()
                                    _this.symbol()
                                }
                            }
                        }
                    })
                }catch(e){
                    console.log(e)
                }
            },
            load(tree, treeNode, resolve) {
                this.$http.get(this.config.url+ this.$api.depth.replace('{version}', this.config.ver)+ `?symbol=${tree.symbol}&depth=20&type=step5`).then(res=> {
                    if(res.data.status === 'ok') {
                        resolve(res.data.tick)
                    }
                });
            },
            symbol(){
                this.$http.get(this.config.url + this.$api.tradeState.replace('{version}', this.config.ver)).then(res=> {

                    if(res.data.status === 'ok') {

                        this.symbols = res.data.data
                        this.symbols.map(d=> {
                            if(this.config.type.indexOf(d['quote-currency'].toUpperCase())!== -1) {
                                this.quotalist.push(d.symbol)
                            }
                        })

                        this.tickers()

                    }else{

                        this.symbol()

                    }
                })
            },

            tickers() {
                this.$http.get(this.config.url + this.$api.tickers.replace('{version}', this.config.ver)).then(res=> {
                    this.tableData = []
                    if(res.data.status === 'ok') {
                        this.loading = false
                        res.data.data.map(d=> {
                            if(this.market.normal !== ''){
                                if(this.market.normal.split(',').indexOf(d.symbol) !== -1){
                                    d.hasChildren =  true;
                                    this.tableData.push(d)
                                }
                            }else {
                                if (this.quotalist.indexOf(d.symbol) !== -1) {
                                    d.hasChildren =  true;
                                    this.tableData.push(d)
                                }
                            }
                        })
                    }else{
                        this.tickers()
                    }
                })
            },
            merged(){

               this.$http.get(this.config.url + this.$api.merged.replace("{version}", this.config.ver)+"?symbol="+this.form.symbol).then(res=> {
                   this.tableData = []
                   if(res.data.status === 'ok') {
                       let data = res.data.tick
                       data.symbol = this.form.symbol
                       data.bid = res.data.tick.bid[0]
                       data.bidSize = res.data.tick.bid[1]
                       data.ask = res.data.tick.ask[0]
                       data.askSize = res.data.tick.ask[1]
                       this.tableData.push(data)
                   }else {
                       this.meged()
                   }
               })
            },
            marketdata() {
                let _this = this
                try {
                    electron.ipcRenderer.send('leveldb', {
                        name: "find",
                        keys: {prefix: `${_this.root}.accountid.config.market.temp`, limit: 1, revers: false}
                    });
                    electron.ipcRenderer.on(`${_this.root}.accountid.config.market.temp_find_callback`, (event, args)=>{
                        if(args !== '') {
                            let res = JSON.parse(JSON.stringify(args.value));
                            if (args.key !== null) {
                                _this.market = res
                            }
                        }
                    })
                } catch (e) {
                    console.log(e)
                    this.marketdata()
                }
            }
        },
        mounted() {
            this.root = this.$universal.hash('talkrun')
            this.init()
        }
    }
</script>