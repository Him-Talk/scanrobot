<template>
    <Frame>
        <renderHead slot="header"></renderHead>
        <el-main>

            <el-form ref="from" :model="from" label-width="80px">
                <el-form-item label="REST节点">
                    <el-col :span="18">
                        <el-input v-model="from.url" placeholder="REST api 接口域名"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="版本号">
                    <el-col :span="18">
                        <el-input v-model="from.ver" placeholder="REST版本号"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="WS节点">
                    <el-col :span="18">
                        <el-input v-model="from.ws" placeholder="WebSocket 接口域名"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="API密钥">
                    <el-col :span="18">
                        <el-input v-model="from.ak" placeholder="Access Key"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="Secret key">
                    <el-col :span="18">
                        <el-input v-model="from.sk" placeholder="Secret Key"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="账户ID">
                    <el-col :span="18">
                        <el-input v-model="from.uid" placeholder="用户ID"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="密钥时效">
                    <el-col :span="18">
                        <el-date-picker type="date" placeholder="到期时间" v-model="from.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="交易平台">
                    <el-select v-model="from.region" placeholder="请选择API注册平台">
                        <el-option label="火币" value="huobi"></el-option>
                        <el-option label="币安" value="binance"></el-option>
                        <el-option label="OKEX" value="okex"></el-option>
                        <el-option label="Uniswap" value="uniswap"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报价币种">
                    <el-col :span="22">
                        <el-checkbox-group v-model="from.type">
                            <el-checkbox :label="item" name="type" :value="index" v-for="(item, index) in from.typelist[from.region]" :key="index"></el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存设置</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </Frame>
</template>
<script>
    import Frame from '@/components/frame/mainFrame.vue'
    import renderHead from '@/components/header/renderHead.vue'
    export default {
        data () {
            return {
                from: {
                    url: 'https://api-agent.evergreenstudio.dev',
                    ws: 'wss://ws-agent.evergreenstudio.dev/ws',
                    ak: '',
                    sk: '',
                    ver: '',
                    uid: '',
                    typelist: {
                      huobi: ['USDT', "HUSD", 'BTC', 'ETH', 'HT', 'ALTS'],
                      okex: ['USDT', 'USDK', 'USDC', 'DAI', 'BTC', 'OKB', 'ETH'],
                      binance: ['BNB', 'BTC', 'ALTS', 'ETH', 'TRX', 'XRP', 'USDT', "BUSD", 'EUR', 'TUSD', 'USDC', 'TRY', 'PAX', 'AUD', 'BIRD', 'BRL', 'GBP', 'IDRT', 'NGN', 'RUB', 'ZAR', 'UAH'],
                      poloniex: ['USDT', 'USDC', 'USDJ', 'DAI', 'PAX', 'BUSD', 'BTC', 'TRX', 'ALTS', 'ETH', 'BNB'],
                      uniswap: ['USDT', 'ETH', 'BTC', 'USDC', 'DAI']
                    },
                    region: 'huobi',
                    perviousHash: '',
                    date1: '',
                    type: [],
                    createTime: 0
                },
                old: {},
                hash: '',
                root: ''
            }
        },
        components: {Frame, renderHead},
        methods: {
            onSubmit() {
                let data = {
                  height: 0,
                  perviousHash: '',
                  timestmap: '',
                  data: this.from,
                  hash: 'nexthash'
                };
                let _this = this;
                try {
                    this.from.createTime = new Date().getTime()
                    this.from.perviousHash = this.hash === "" ? "" : this.hash.split('.')[5]
                    electron.ipcRenderer.send('leveldb', {
                        name: 'put',
                        keys: `${this.root}.accountid.config.api.temp`,
                        value: this.from
                    });
                    electron.ipcRenderer.on(`${_this.root}.accountid.config.api.temp_put_callback`, function(event, args) {
                        if(_this.hash !== ''){
                            console.log(_this.hash)
                            _this.old.hash = _this.hash.split('.')[5]
                            electron.ipcRenderer.send('leveldb', {
                                name: 'put',
                                keys:`${_this.root}.accountid.config.api`,
                                value: _this.old
                            });
                            electron.ipcRenderer.on(`${_this.root}.accountid.config.api_put_callback`, function(event, args){
                                _this.remove(_this.hash)
                                _this.$alert('修改成功', '操作提醒', {
                                    confirmButtonText: '确定'
                                })
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
            remove(key){
                electron.ipcRenderer.send("leveldb", {
                    name: 'del',
                    keys: key
                })
            },
            init () {
                let _this = this
                try {
                    electron.ipcRenderer.send('leveldb', {
                        name: "find",
                        keys: {prefix: `${_this.root}.accountid.config.api.temp`, limit: 1, revers: false}
                    });
                    electron.ipcRenderer.on(`${_this.root}.accountid.config.api.temp_find_callback`, (event, args)=>{
                        console.log(args, event)
                        if(args !== '') {
                            let res = JSON.parse(JSON.stringify(args.value));
                            console.table(res)
                            if (args.key !== null) {
                                _this.hash = args.key
                                _this.old = res
                                _this.from = res
                            }
                        }
                    })
                } catch (e) {
                    console.log(e)
                    this.init()
                }
            },

            printLastBlock() {
                console.table(this.block[this.block.length - 1])
            }
        },
        mounted() {
            /**
             *  roothash    hash(talkrun)
             *  accountroothash    hash(this.root.accountid)
             *  accountconfighash    hash(this.acchash.config)
             *  accountconfigapihash hash(this.cofhash)
             *  blocknumber     hash= hash(number+talkrun)
             *  verify block    满足块的验证条件 必须符合区块交易数量（挖矿或者信息更新，优先对费率较高的块进行处理）
             *  插入数据进入到队列文件当中，一个临时暂存库
             */
            this.root = this.$universal.hash('talkrun')
            this.init()
        }
    }
</script>
<style>
    .el-main {
        background: rgba(0, 0, 0, 0.09);
    }
    .el-input input {
        background: rgba(250, 250, 210, 0.9);
        color: #474f54;
        font-weight: bold;
        font-size: 12px;
        border-color: #fff;
    }
    .el-form-item label {
        color: #fff
    }
</style>