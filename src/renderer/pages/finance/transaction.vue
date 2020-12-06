<template>
    <Frame>
        <renderHead slot="header"></renderHead>
        <el-main>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item v-show="formInline[orderpip].hasOwnProperty('account-id')">
                    <el-select v-model="formInline[orderpip]['account-id']" placeholder="账户ID">
                        <el-option label="账户ID" value=""></el-option>
                        <el-option v-for="(item,index) in accountid" :key="index" :label="item.type" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="formInline[orderpip].symbol" filterable placeholder="交易对">
                        <el-option label="缺省交易对" value=""></el-option>
                        <el-option v-for="(item, index) in symbols" :key="index" :label="item.symbol.toUpperCase()" :value="item.symbol"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="formInline[orderpip].hasOwnProperty('states')">
                    <el-select v-model="formInline[orderpip].states" placeholder="订单状态组合">
                        <el-option v-for="(item, index) in states" :key="index" :label="item" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="orderpip" placeholder="成交类型">
                        <el-option label="当前委托单" value="historyOrder"></el-option>
                        <el-option label="未成交订单" value="openOrders"></el-option>
                        <el-option label="当前和历史成交" value="historyDeal"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="formInline[orderpip].hasOwnProperty('types')">
                    <el-select v-model="formInline[orderpip].types" placeholder="订单组合类型">
                        <el-option label="缺省" value=""></el-option>
                        <el-option v-for="(item, index) in types" :key="index" :label="item" value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="formInline[orderpip].hasOwnProperty('start_time')" label-width="160">
                    <el-date-picker type="date" placeholder="开始时间" v-model="formInline[orderpip].start_time" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item v-show="formInline[orderpip].hasOwnProperty('end_time')">
                    <el-date-picker type="date" placeholder="结束时间" v-model="formInline[orderpip].end_time" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="formInline[orderpip].direct" placeholder="检索方向">
                        <el-option label="检索方向" value=""></el-option>
                        <el-option label="向后" value="next"></el-option>
                        <el-option label="向前" value="prev"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input type="number" v-model="formInline[orderpip].size" placeholder="最大条目数" :max="max[orderpip].size" min="1"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="number" v-model="formInline[orderpip].from" placeholder="起始ID"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    height="600"
                    v-loading="loading"
                    :data="tableData"
                    style="width: 100%"
                    max-height="650">
                <el-table-column
                        fixed
                        prop="transactId"
                        label="交易流水号"
                        width="120">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>付款方账户ID: <span style="color: green">{{ scope.row.transferer }}</span></p>
                            <p>收款方账户ID: <span style="color: green">{{ scope.row.transferee }}</span></p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.transactId }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="accountId"
                        label="账户ID"
                        width="150">
                    <template slot-scope="score">
                        {{ accountid.find(d=> d.id===score.row.accountId).type }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="currency"
                        label="币种"
                        width="120">
                    <template slot-scope="scope">
                        {{ scope.row.currency.toUpperCase() }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="transactAmt"
                        label="变动金额"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="transactType"
                        label="变动类型"
                        width="120">
                    <template slot-scope="scope">
                        <el-tag>{{ enumtype[scope.row.transactType] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="transferType"
                        label="划转类型"
                        width="300">
                    <template slot-scope="scope">
                        <el-tag>{{ transferType[scope.row.transferType] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        prop="transactTime"
                        label="交易时间"
                        width="210">
                    <template slot-scope="scope">
                        {{ formatTime(scope.row.transactTime) }}
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </Frame>
</template>
<script>
    import Frame from '@/components/frame/mainFrame.vue'
    import renderHead from '@/components/header/renderHead.vue'
    import account from '@/lib/account.js'
    import Tx from '@/lib/tx.js'
    export default {
        name: 'finance-transaction',
        data () {
            return {
                formInline: {
                    historyOrder: {
                        symbol: 'btcusdt',
                        types: '',
                        start_time: '',
                        end_time: '',
                        states: 'filled',
                        direct: '',
                        size: 100,
                        from: ''
                    },
                    historyDeal: {
                        symbol: '',
                        types: '',
                        start_date: '',
                        end_date: '',
                        from: '',
                        direct: '',
                        size: 100
                    },
                    openOrders: {
                        'account-id': '',
                        symbol: '',
                        side: '',
                        from: '',
                        direct: '',
                        size: 100
                    }
                },
                states: {
                    submitted: '已提交',
                    'partial-filled': '部分提交',
                    'partial-canceled': '部分成交撤销',
                    filled: '完全成交',
                    canceled: '已撤销',
                    created: '已成功下单'
                },
                max: {
                    historyOrder: {
                        size: 100
                    },
                    openOrders: {
                      size: 500
                    },
                    historyDeal: {
                        size: 500
                    }
                },
                accountid: [],
                loading: true,
                tableData: [],
                orderpip: 'historyOrder',
                types: {
                  'buy-market': "市价买",
                  'sell-market': '市价卖',
                  'buy-limit': '限价买',
                  'sell-limit': '限价卖',
                  'buy-ioc': 'IOC买单',
                  'sell-ioc': 'ICO卖单',
                  'buy-limit-maker': '下单价格低于市场最低卖出价',
                  'sell-limit-maker': '下单价格大于市场最高买入价',
                  'buy-stop-limit': '止损买入',
                  'sell-stop-limit': '止损卖出',
                  'buy-limit-fok': '限价买入',
                  'sell-limit-fok': '限价卖出',
                  'buy-stop-limit-fok': '止损限价买入',
                   'sell-stop-limit-fok': '止损限价卖出'
                },
                config: {},
                symbols: [],
                root: ''
            }
        },
        components: {Frame, renderHead},
        methods: {
            init () {
                let _this = this
                try {
                    electron.ipcRenderer.send('leveldb', {
                        name: 'find',
                        keys: {prefix: `${this.root}.accountid.config.api.temp`, limit: 1, revers: false}
                    });
                    electron.ipcRenderer.on(`${this.root}.accountid.config.api.temp_find_callback`, (event, args) => {
                        if (args !== '' && args.key!==null) {
                            let res = JSON.parse(JSON.stringify(args.value));
                            console.table(res)
                            if (args.key !== null) {
                                if(res.url === ''){
                                    _this.$alert('您还没有配置api接口地址哦，无法使用交易所功能', '温馨提示',{
                                        confirmButtonText: '确定'
                                    })
                                    return false;
                                }else {
                                    _this.config = res
                                    _this.req()
                                }
                            }
                        }
                    })
                }catch(e){
                    console.log(e)
                }
            },
            onSubmit() {
                this.loading = true
                if(this.formInline[this.orderpip].hasOwnProperty('account-id')) {
                    if (this.formInline[this.orderpip]['account-id'] === '') {
                        this.loading = false
                        this.$alert('请选择查询账户类型', '温馨提示', {
                            confirmButtonText: '确定'
                        })
                        return false;
                    }
                }
                if(this.formInline[this.orderpip].hasOwnProperty('symbol')){
                    if(this.formInline[this.orderpip].symbol === '') {
                        this.loading = false;
                        this.$alert('请选择查询交易对', '温馨提示', {
                            confirmButtonText:'确定'
                        })
                        return false
                    }
                }
                const tx = new Tx(this.config.ak, this.config.sk);

                const path = this.$api[this.orderpip].replace('{version}', this.config.ver);

                let payload = tx[this.orderpip](path, this.formInline[this.orderpip]);

                this.$http.get(this.config.url + path + "?" + payload).then(res => {
                    console.log(res)
                    this.loading = false
                    if(res.data.status === 'error') {
                        this.$alert(res.data['err-msg'], '温馨提醒', {
                            confirmButtonText: '确定'
                        })
                        return false;
                    }else{
                        this.tableData = res.data.data
                    }
                });

            },
            symbol(){
                this.$http.get(this.config.url + this.$api.tradeState.replace('{version}', this.config.ver)).then(res=> {
                    console.table(res.data)

                    if(res.data.status === 'ok') {

                        this.symbols = res.data.data

                        this.onSubmit()

                    }else{

                        this.symbol()

                    }
                })
            },
            req(){

                const accounts = new account(this.config.ak, this.config.sk);

                const accountlistpath = this.$api.accounts.replace('{version}', this.config.ver);

                let listreq = accounts.accounts(accountlistpath);

                this.$http.get(this.config.url + accountlistpath + "?" + listreq).then(res=> {

                    if(res.data.status === 'ok') {

                        this.accountid = res.data.data;

                        this.symbol()

                    }else {
                        this.req()

                    }
                })

            },
        },
        mounted() {
            this.root = this.$universal.hash('talkrun')
            this.init()
        }
    }
</script>
<style>
    .el-form-item {
        width: 120px
    }
</style>