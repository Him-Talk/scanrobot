<template>
    <Frame>
    <renderHead slot="header"></renderHead>
    <el-main>
        <el-form :Inline="true" ref="form" class="demo-form-inline">
            <el-form-item>
                <el-select v-model="valuationCurrency" filterable placeholder="估值类型" @change="asset">
                    <el-option label="缺省币种" value=""></el-option>
                    <el-option v-for="(item, index) in symbols" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-row :gutter="12">
            <el-col :span="8">
                <el-card shadow="always" @click.native="switchAssets('otc')">
                    <small>法币账户估值:</small><el-tag>{{ assets.otc }} {{ valuationCurrency }}</el-tag>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="always" @click.native="switchAssets('spot')">
                    <small>币币账户估值:</small><el-tag>{{ assets.spot }} {{ valuationCurrency }}</el-tag>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="always">
                    <small>合约账户估值:</small><el-tag>{{ assets.margin }} {{ valuationCurrency }}</el-tag>
                </el-card>
            </el-col>
        </el-row>
        <el-table :data="balanceByType[tableIndex]" style="width: 100%;margin-top: 10px" max-height="650">
            <el-table-column
                    fixed
                    prop="currency"
                    label="币种"
                    width="120">
                <template slot-scope="scope">
                    {{ scope.row.currency.toUpperCase() }}
                </template>
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="类型"
                    width="120" :filters="[{text: '可用', value: 'trade'}, {text: '冻结', value: 'frozen'}]" :filter-method="filterType">
                <template slot-scope="scope">
                    <el-tag>{{ tradeType[scope.row.type] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="balance" label="余额" :filters="[{text: '过滤为0的资产', value: 0}]" :filtered-value="[0]" :filter-method="filterTag">
                <template slot-scope="scope">
                    <el-tag>{{ scope.row.balance }}</el-tag>
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
    export default {
        data () {
            return {
                assets: {
                    spot: 0,
                    otc: 0,
                    margin: 0
                },
                tradeType: {
                  trade: '可用',
                  frozen: '冻结'
                },
                valuationCurrency: 'BTC',
                symbols: ['BTC', 'CNY', 'USD', 'JPY', 'KRW', 'GBP', 'TRY', 'EUR', 'RUB', 'VND', 'HKD', 'TWD', 'MYR', 'SGD', 'AED', 'SAR'],
                config: {},
                accountid: [],
                tableIndex: 'spot',
                balanceByType: [],
                root: ''
            }
        },
        components: {Frame, renderHead},
        methods: {
            switchAssets(type){
               this.tableIndex = type
            },
            filterType(value, row){
              return row.type === value
            },
            filterTag(value, row){
              return row.balance > value
            },
            onSubmit() {
                let data = {
                    height: 0,
                    perviousHash: '',
                    timestmap: '',
                    data: this.from,
                    hash: 'nexthash'
                };
                let _this = this
                try {
                    _this.from.createTime = new Date().getTime()
                    _this.from.perviousHash = _this.hash === "" ? "" : _this.hash.split('.')[5]
                    electron.ipcRenderer.send('leveldb', {
                        name: 'put',
                        keys: `${_this.root}.accountid.config.market.temp`,
                        value: _this.from
                    });
                    electron.ipcRenderer.on(`${_this.root}.accountid.config.market.temp_put_callback`, function(event, args) {
                        if(_this.hash !== ''){
                            _this.old.hash = _this.hash.split('.')[5]
                            electron.ipcRenderer.send('leveldb', {
                                name: 'put',
                                keys:`${_this.root}.accountid.config.market`,
                                value: _this.old
                            });
                            electron.ipcRenderer.on(`${_this.root}.accountid.config.market_put_callback`, function(event, args){
                                _this.remove(_this.hash)
                                if(args===null){
                                    _this.$alert('修改成功', '操作提醒', {
                                        confirmButtonText: '确定'
                                    })
                                }else{
                                    _this.$alert("修改失败", '操作提醒', {
                                        confirmButtonText: '确定'
                                    })
                                }
                            })
                        }else{
                            _this.$alert("修改成功", '操作提醒', {
                                confirmButtonText: '确定'
                            })
                        }
                    })
                }catch (e) {
                    console.log(e)
                }
            },
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
                                    _this.account()
                                    setInterval(function() {
                                        _this.account();
                                    }, 3000)
                                }
                            }
                        }
                    })
                }catch(e){
                    console.log(e)
                }
            },
            balance(){

                this.accountid.map(d=> {
                    const accounts = new account(this.config.ak, this.config.sk);

                    const accountlistpath = this.$api.balance.replace('{version}', this.config.ver).replace('{account-id}', d.id);

                    let listreq = accounts.balance(accountlistpath);

                    this.$http.get(this.config.url + accountlistpath + "?" + listreq).then(res => {

                        if (res.data.status === 'ok') {

                            this.balanceByType[d.type] = res.data.data.list;

                        } else {

                            this.balance()

                        }
                    })
                })
            },

            account(){

                const accounts = new account(this.config.ak, this.config.sk);

                const accountlistpath = this.$api.accounts.replace('{version}', this.config.ver);

                let listreq = accounts.accounts(accountlistpath);

                this.$http.get(this.config.url + accountlistpath + "?" + listreq).then(res=> {

                    if(res.data.status === 'ok') {

                        this.accountid = res.data.data;

                        this.asset()

                        this.balance()

                    }else {

                        this.account()

                    }
                })
            },

            asset(){

                this.accountid.map(d=> {
                    const accounts = new account(this.config.ak, this.config.sk);

                    const accountlistpath = this.$api.assets.replace('{version}', this.config.ver);

                    let listreq = accounts.assets(accountlistpath, {
                        accountType: d.type,
                        valuationCurrency: this.valuationCurrency,
                    });

                    this.$http.get(this.config.url + accountlistpath + "?" + listreq).then(res => {

                        if (res.data.ok && res.data.code === 200) {

                            this.assets[d.type] = res.data.data.balance;

                        } else {

                            this.asset()

                        }
                    })
                })
            }
        },
        mounted() {
            this.root = this.$universal.hash('talkrun')
            this.init()
        }
    }
</script>