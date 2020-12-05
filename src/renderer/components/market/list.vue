<template>
    <div>
        <el-table
                :data="marketlist.filter((data)=> !search || data.symbol.toLowerCase().includes(search.toLowerCase()))"
                style="width: 100%" height="720">
            <el-table-column
                    prop="symbol"
                    label="市场"
                    width="120">
                <template slot-scope="scope">
                    {{scope.row.symbol.toUpperCase()}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="amount"
                    label="成交量"
                    width="220">
                <template slot-scope="scope">
                    {{scope.row.amount.toString()}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="vol"
                    width="220"
                    label="成交额">
                <template slot-scope="scope">
                    {{scope.row.vol.toString()}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="high"
                    label="最高价">
                <template slot-scope="scope">
                    {{scope.row.high.toString()}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="low"
                    label="最低价">
                <template slot-scope="scope">
                    {{scope.row.low.toString()}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="open"
                    label="开盘价">
                <template slot-scope="scope">
                    {{scope.row.open.toString()}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="close"
                    label="收盘价">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>最新成交价格: <span style="color: green">{{scope.row.close.toString()}}</span></p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.close.toString() }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="count"
                    label="成交笔数">
                <template slot-scope="scope">
                    {{scope.row.count.toString()}}
                </template>
            </el-table-column>
            <el-table-column
                    align="right">
                <template slot="header" slot-scope="scope">
                    <el-input
                            v-model="search"
                            size="mini"
                            placeholder="输入关键字搜索"/>
                </template>
                <template slot-scope="scope">
                    <el-tag size="medium" @click="favorites(scope.row)" v-if="favorite.findIndex((d)=> d['symbol'] === scope.row.symbol) === -1">
                        <i class="el-icon-star-off"></i>
                    </el-tag>
                    <el-tag size="medium" @click="trash(scope.row)" v-else>
                        <i class="el-icon-star-on"></i>
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
const pako = require('pako')
    export default {
        data () {
            return {
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
                search: '',
                favorite: [],
                socket: [],
                allmarket: [],
                loading: true
            }
        },
        computed: {
            ...mapGetters([
                'favoriteChild'
            ])
        },
        mounted: function () {
            this.data = this.$Win.getParameter()
            this.marketlist = []
            let jsonDeepClone = (value) => {
                return JSON.parse(JSON.stringify(value))
        }
            this.favorite.concat(jsonDeepClone(this.favoriteChild))
            this.connect();
        },
        props: {
            ws: String,
            url: String,
            ver: String,
            sub: Object,
            quota: Array,
            normal: Array,
            maxfavorite: Number
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

            favorites (item) {
                if (this.favorite.length === 0 || this.favorite.findIndex((d) => d.symbol === item.symbol) === -1) {
                    item.state = this.allmarket.data.data[this.allmarket.data.data.findIndex((d) => d.symbol === item.symbol)].state
                    if(this.favorite.length >= this.maxfavorite && this.maxfavorite !== 0){
                        this.$message({
                            showClose: true,
                            message: "当前收藏夹已达到允许收藏上限，如需增加收藏数量，请调整市场设置",
                            type: 'error'
                        });
                        return false;
                    }
                    this.$message({
                        showClose: true,
                        message: `${item.symbol.toUpperCase()}已加入到收藏夹`,
                        type: 'success'
                    })
                    this.favorite.push(item)
                    this.$store.commit('CHANGE_FAVORITE', JSON.parse(JSON.stringify(this.favorite)))
                    this.$emit('setData', {name: 'favorite', data: this.favorite})
                }
            },
            trash (item) {
                this.$message({
                    showClose: true,
                    message: `${item.symbol.toUpperCase()}已从收藏夹移除`,
                    type: 'success'
                })
                this.favorite.splice(this.favorite.findIndex((d) => d.symbol === item.symbol), 1)
                this.$store.commit('CHANGE_FAVORITE', JSON.parse(JSON.stringify(this.favorite)))
            },
            formatter (row, column) {
                return row.address
            },
            async marketall () {
                let list = this.$store.state.BaseConfig.allmarket
                if (!list.hasOwnProperty('data')) {
                    list = await this.$http.get(this.url + '/' + this.ver + '/common/symbols')
                    this.$store.commit('CHANGE_MARKET', JSON.parse(JSON.stringify(list)))
                }
                this.allmarket = list
                return list
            },
            connect: function () {
//                console.trace('init websocket connect.')
                if (typeof (WebSocket) === 'undefined') {
                    alert('您的浏览器不支持WebSocket')
                } else {
                    let clientid = this.sub.clientid
                    this.socket[clientid] = new WebSocket(this.ws)
                    this.socket[clientid].onopen = () => this.open(clientid)
                    this.socket[clientid].onerror = () => this.error
                    this.socket[clientid].onmessage = (msg) => this.getMessage(msg, this, clientid)
//                    console.trace('connected to ', this.ws)
                }
            },
            open: function (clientid) {
                if (this.normal.length > 0) {
                    console.log("normal", this.normal)
                    for (let i = 0; i < this.normal.length; i++) {
                        this.send(JSON.stringify({
                            sub: `market.${this.normal[i]}.detail`,
                            id: `id_${this.normal[i]}${clientid}`
                        }), clientid)
                    }
                    this.marketall().then((res) => {
                        console.log('Get market list')
                    })
                } else {
                    this.marketall().then((res) => {
                        let item
                        for (let i = this.sub.cur; i < res.data.data.length; i++) {
                            item = res.data.data[i]
                            if (this.quota.indexOf(item['quote-currency'].toUpperCase()) !== -1 && item.state === 'online') {
                                if (this.sub.cur < this.sub.target) {
//                                console.log(this.socket[clientid], 1)
                                    if (this.socket[clientid].readyState === 1) {
                                        this.send(JSON.stringify({
                                            sub: `market.${item.symbol}.detail`,
                                            id: `id_${item.symbol}${clientid}`
                                        }), clientid)
                                        this.sub.cur++
//                                    console.trace('socket连接成功', `订阅一个 ${item.symbol} 市场`)
                                    }
                                } else {
                                    this.sub.target += this.sub.entry
                                    if (this.sub.target < this.sub.high) {
                                        this.sub.clientid++
                                        this.connect()
                                        break
                                    }
                                }
                            }
                        }
                    })
                }
            },
            error: function () {
                console.trace('连接错误')
            },
            getMessage: function (msg, evt, clientid) {
                let result = ''
                let _this = evt
                if (msg.data instanceof Blob) {
                    let reader = new FileReader()
                    reader.readAsArrayBuffer(msg.data)
                    reader.onload = function () {
                        let arrayBuffer = this.result
                        result = JSON.parse(pako.ungzip(new Uint8Array(arrayBuffer), {to: 'string'}))
                        if (result.ping) {
                            _this.send(JSON.stringify({pong: result.ping}), clientid)
                        } else {
                            if (result.hasOwnProperty('ch')) {
                                _this.updatedata(result, _this)
                            }
                        }
                    }
                }
            },
            updatedata: function (data, _self) {
                let market = data.ch.split('.')[1]
                let ticker = data.tick
                ticker.symbol = market
                if (_self.loading) {
                    _self.loading = false
                }
                let list = _self.marketlist
                let favorite = _self.favorite
                let findex = favorite.findIndex((d) => d['symbol'] === market)
                let index = list.findIndex((d) => d['symbol'] === market)
                if (index < 0) {
                    list.push(ticker)
                } else {
                    list.splice(index, 1, ticker)
                    // _self.$forceUpdate()
                }
                if (findex >= 0) {
                    favorite[findex]['close'] = ticker['close']
                }
            },
            send: function (params, id) {
//                console.trace(params, id)
                if (this.socket[id].readyState === 1) {
                    this.socket[id].send(params)
                }
            },
            close: function () {
                console.trace('socket已经关闭')
            }
        },
        destroyed () {
            // 销毁监听
            for (let i = this.sub.clientid; i > 0; i--) {
                this.socket[i].onclose = this.close
                this.socket[i].close()
            }
        }
    }
</script>