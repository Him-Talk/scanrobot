<template>
    <Frame>
    <renderHead slot="header"></renderHead>
    <el-main>
        <el-form :model="formInline" ref="from" label-width="120px">
            <el-form-item label="转出币种">
                <el-col :span="10">
                    <el-select v-model="formInline.currency" filterable placeholder="转出币种" @change="getBalance">
                        <el-option label="缺省币种" value=""></el-option>
                        <el-option v-for="(item, index) in symbols" :key="index" :label="item.toUpperCase()" :value="item"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="7">可用： <el-tag>{{ assets.trade }}</el-tag></el-col>
                <el-col :span="7">冻结： <el-tag>{{ assets.frozen }}</el-tag></el-col>
            </el-form-item>
            <el-form-item label="转出用户UID">
                <el-col :span="20">
                    <el-input v-model="formInline['from-user']" placeholder="母用户uid,子用户uid"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="转出账户类型">
                <el-select v-model="formInline['from-account-type']" filterable placeholder="转出账户类型" @change="getBalance">
                    <el-option label="币币账户" value="spot"></el-option>
                    <el-option label="逐仓杠杆账户" value="margin"></el-option>
                    <el-option label="法币账户(暂不支持)" value="otc"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="转出账户ID">
                <el-col :span="20">
                    <el-input v-model="formInline['from-account']" placeholder="转出账户ID"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="转入用户UID">
                <el-col :span="20">
                    <el-input v-model="formInline['to-user']" placeholder="母用户uid,子用户uid"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="转入账户类型">
                <el-select v-model="formInline['to-account-type']" placeholder="转入账户类型">
                    <el-option label="币币账户" value="spot"></el-option>
                    <el-option label="合约账户" value="margin"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="转入账户ID">
                <el-col :span="20">
                    <el-input v-model="formInline['to-account']" placeholder="转入账户ID"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="划转数量">
                <el-col :span="18">
                    <el-input v-model="formInline.amount" placeholder="划转数量"></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button type="success" @click="allin">全部</el-button>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
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
                formInline: {
                    "from-user": '',
                    'from-account-type': 'spot',
                    'from-account': '',
                    'to-user': '',
                    'to-account-type': '',
                    currency: '',
                    amount: 0
                },
                assets: {
                    trade: 0,
                    frozen: 0
                },
                balance: {
                    spot: {},
                    margin: {},
                    otc: {}
                },
                symbols: [],
                accountid: [],
                config: {},
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
                                    _this.symbol()
                                }
                            }
                        }
                    })
                }catch(e){
                    console.log(e)
                }
            },
            symbol(){
                this.$http.get(this.config.url + this.$api.allpair.replace('{version}', this.config.ver)).then(res=> {
                    if(res.data.status==='ok'){
                        this.symbols = res.data.data
                        this.symbols.map(d=> {
                            this.balance['spot'][d] = {
                                trade: null,
                                frozen: null
                            }
                            this.balance['margin'][d] = {
                                trade: null,
                                frozen: null
                            }
                            this.balance['otc'][d] = {
                                trade: null,
                                frozen: null
                            }
                            console.log(d, '设置币种初始化结构')
                        })
                        this.account()
                    }else{
                        this.symbol()
                    }
                })
            },


            account(){

                const accounts = new account(this.config.ak, this.config.sk);

                const accountlistpath = this.$api.accounts.replace('{version}', this.config.ver);

                let listreq = accounts.accounts(accountlistpath);

                this.$http.get(this.config.url + accountlistpath + "?" + listreq).then(res=> {

                    if(res.data.status === 'ok') {

                        this.accountid = res.data.data;

                    }else {

                        this.account()

                    }
                })
            },

            allin(){
               this.formInline.amount = this.balance[this.formInline['from-account-type']][this.formInline.currency]
            },

            getBalance(){
                let symbol = this.formInline.currency

                let type = this.formInline['from-account-type']

                let accountid = this.accountid.find(d=> d.type === type)

                if(accountid){
                    accountid = accountid.id
                }else{
                    this.$alert("没有找到该类型的账户ID", "温馨提醒", {
                        confirmButtonText: '确定'
                    })
                    return false
                }

                if(this.balance[type][symbol].trade === null) {

                    const accounts = new account(this.config.ak, this.config.sk);

                    const accountlistpath = this.$api.balance.replace('{version}', this.config.ver).replace('{account-id}', accountid);

                    let listreq = accounts.balance(accountlistpath);

                    this.$http.get(this.config.url + accountlistpath + "?" + listreq).then(res => {

                        if (res.data.status === 'ok') {

                            res.data.data.list.map(d=> {

                                if(d.currency === symbol) {

                                    this.assets[d.type] = d.balance

                                }

                                this.balance[type][d.currency][d.type] = d.balance;

                            })

                        } else {

                            this.getBalance()

                        }
                    })
                } else {

                    this.assets.trade = this.balance[type][symbol].trade
                    this.assets.frozen = this.balance[type][symbol].frozen

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

            }
        },
        mounted() {
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