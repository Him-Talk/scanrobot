<template>
    <Frame>
    <renderHead slot="header"></renderHead>
    <el-main>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item>
                <el-select v-model="formInline.accountid" placeholder="账户ID">
                    <el-option label="账户ID" value=""></el-option>
                    <el-option v-for="(item,index) in accountid" :key="index" :label="item.type" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="币种">
                <el-select v-model="formInline.currency" placeholder="币种">
                    <el-option label="缺省" value=""></el-option>
                    <el-option v-for="(item, index) in currencys" :key="index" :label="item.toUpperCase()" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="formInline['transact-types']" placeholder="变动类型">
                    <el-option label="缺省" value=""></el-option>
                    <el-option v-for="(item,index) in enumtype" :key="index" :label="item" :value="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-col :span="12">
                    <el-date-picker type="date" placeholder="远点时间" v-model="formInline.start_time" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col :span="12">
                    <el-date-picker type="date" placeholder="近点时间" v-model="formInline.end_time" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="排序">
                <el-select v-model="formInline.sort" placeholder="检索方向">
                    <el-option label="缺省" value=""></el-option>
                    <el-option label="倒序" value="desc"></el-option>
                    <el-option label="顺序" value="asc"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input type="number" v-model="formInline.size" placeholder="最大条目数" max="500" min="1"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
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
    import moment from 'moment'
    export default {
        name: 'finance-turnover',
        data () {
            return {
                formInline: {
                    accountId: '',
                    currency: '',
                    transactTypes: '',
                    startTime: '',
                    endTime: '',
                    sort: '',
                    limit: 100,
                    fromid: ''
                },
                loading: true,
                currencys: [],
                config: {},
                root: '',
                accountid: [],
                transferType: {
                    'otc-to-pro': "OTC到现货",
                    'pro-to-otc': '现货到OTC',
                    'futures-to-pro': '交割合约到现货',
                    'pro-to-futures': '现货到交割合约',
                    'dm-swap-to-pro': '币本位永续合约到现货',
                    'dm-pro-to-swap': '现货到币本位永续合约',
                    'margin-transfer-in': '转入到逐仓杠杆',
                    'margin-transfer-out': '从逐仓杠杆转出',
                    'pro-to-super-margin': '现货到全仓杠杆',
                    'super-margin-to-pro': '全仓杠杆到现货',
                    'master-transfer-in': '转入到母用户',
                    'master-transfer-out': '从母用户转出',
                    'sub-transfer-in': '转入到子用户',
                    'sub-transfer-out': '从子用户转出'
                },
                enumtype: {
//                    trade: '交易',
//                    etf: 'ETF申购',
//                    'transact-fee': '交易手续费',
//                    'fee-deduction': '手续费抵扣',
                    transfer: '划转'
//                    credit: '借币',
//                    liquidation: '清仓',
//                    interest:'币息',
//                    deposit:'冲币',
//                    withdraw:'提币',
//                    'withdraw-fee': '提币手续费',
//                    exchange: '兑换',
//                    'other-types': '其他',
//                    'rebate': '交易返佣'
                },
                tableData: []
            }
        },
        components: {Frame, renderHead},
        methods: {

            formatTime(unix) {
                return moment(unix).utc().format('YYYY-MM-DDTHH:mm:ss')
            },

            onSubmit() {
                this.loading = true
                if(this.formInline.accountid=== ''){
                    this.loading = false
                    this.$alert('请选择查询账户类型', '温馨提示', {
                        confirmButtonText: '确定'
                    })
                    return false;
                }

                const accounts = new account(this.config.ak, this.config.sk);

                const path = this.$api.financeTurnover.replace('{version}', this.config.ver);

                let payload = accounts.financeTurnover(this.formInline.accountid, path, this.formInline);

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
            configInit() {
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
                                    this.req();
                                }
                            }
                        }
                    })
                }catch(e){
                    console.log(e)
                }
            },

            req(){

                const accounts = new account(this.config.ak, this.config.sk);

                const accountlistpath = this.$api.accounts.replace('{version}', this.config.ver);

                let listreq = accounts.accounts(accountlistpath);

                this.$http.get(this.config.url + accountlistpath + "?" + listreq).then(res=> {

                    if(res.data.status === 'ok') {

                        this.accountid = res.data.data;
                        this.history()

                        this.pair()

                    }else {

                        this.req()

                    }
                })

            },

            pair() {

                const path = this.$api.allpair.replace('{version}', this.config.ver);

                this.$http.get(this.config.url + path).then(res=> {
                    console.log(res.data.data)
                    this.currencys = res.data.data;
                })
            },

            history() {

                const accounts = new account(this.config.ak, this.config.sk);

                this.accountid.map(item => {

                    const path = this.$api.financeTurnover.replace('{version}', this.config.ver);

                    let payload = accounts.financeTurnover(item.id, path, this.formInline);

                    this.$http.get(this.config.url + path + "?" + payload).then(res => {
                        console.log(res)
                        this.loading = false;
                        if(res.data.status === 'error') {
                            this.$alert(res.data['err-msg'], '温馨提醒', {
                                confirmButtonText: '确定'
                            })
                            return false;
                        }else {
                            this.tableData = res.data.data
                        }
                    });
                });
            }
        },
        mounted() {
            this.root = this.$universal.hash('talkrun')
            this.configInit();
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
        /*font-weight: bold;*/
        font-size: 12px;
        border-color: #fff;
    }
    .el-form-item label {
        color: #fff
    }
</style>