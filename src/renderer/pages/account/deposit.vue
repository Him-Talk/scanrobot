<template>
    <Frame>
    <renderHead slot="header"></renderHead>
    <el-main>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="币种">
                <el-select v-model="formInline.currency" placeholder="币种">
                    <el-option label="缺省" value=""></el-option>
                    <el-option v-for="(item, index) in currencys" :key="index" :label="item.toUpperCase()" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="formInline.type" placeholder="充提类型">
                    <el-option label="缺省" value=""></el-option>
                    <el-option v-for="(item,index) in enumtype" :key="index" :label="item" :value="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="排序">
                <el-select v-model="formInline.direct" placeholder="返回记录排序方向">
                    <el-option label="缺省" value=""></el-option>
                    <el-option label="降序" value="next"></el-option>
                    <el-option label="升序" value="prev"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input type="number" v-model="formInline.size" placeholder="记录大小" max="500" min="1"></el-input>
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
                    prop="id"
                    label="ID"
                    width="120">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>链名称: <span style="color: green">{{scope.row['chain'].toUpperCase()}}</span></p>
                        <p>交易ID: <span style="color: green">{{scope.row['tx-hash']}}</span></p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.id }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="类型"
                    width="150">
                <template slot-scope="score">
                    {{ enumtype[score.row.type] }}
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
                    prop="amount"
                    label="变动金额"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="address-tag"
                    label="收款地址"
                    width="120">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>目标地址: <span style="color: green">{{scope.row.address.toString()}}</span></p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row['address-tag']==="" ? '缺省标签' : scope.row['address-tag'] }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="fee"
                    label="手续费"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="state"
                    label="状态"
                    width="120">
                <template slot-scope="scope">
                    {{ state[scope.row.type][scope.row.state]}}
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    prop="created-at"
                    label="处理时间"
                    width="210">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>发起时间: <span style="color: green">{{ formatTime(scope.row['created-at']) }}</span></p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">更新时间：{{ formatTime(scope.row['updated-at']) }}</el-tag>
                        </div>
                    </el-popover>

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
                    currency: '',
                    type: 'deposit',
                    from: '',
                    size: 100,
                    direct: ''
                },
                state: {
                    deposit: {
                        unknown: '状态未知',
                        confirming: '确认中',
                        confirmed: '已确认',
                        safe: '已完成',
                        orphan: '待确认'
                    },
                    withdraw: {
                        verifying: '待验证',
                        failed: '验证失败',
                        submitted: '已提交',
                        reexamine: '审核中',
                        canceled: '已撤销',
                        pass: '审批通过',
                        reject: '审批拒绝',
                        'pre-transfer': '处理中',
                        'wallet-transfer': '已汇出',
                        'wallet-reject': '钱包拒绝',
                        confirmed: '区块已确认',
                        'confirm-error': '区块确认错误',
                        'repealed': '已撤销'
                    }
                },
                loading: true,
                currencys: [],
                config: {},
                root: '',
                accountid: [],
                enumtype: {
                    deposit: '充值',
                    withdraw: '提现'
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
                if(this.formInline.type=== ''){
                    this.loading = false
                    this.$alert('请选择充提类型', '温馨提示', {
                        confirmButtonText: '确定'
                    })
                    return false;
                }

                const accounts = new account(this.config.ak, this.config.sk);

                const path = this.$api.dwlog.replace('{version}', this.config.ver);

                let payload = accounts.dwlog(this.formInline.accountid, path, this.formInline);

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

                    const path = this.$api.dwlog.replace('{version}', this.config.ver);

                    let payload = accounts.dwlog(item.id, path, this.formInline);

                    this.$http.get(this.config.url + path + "?" + payload).then(res => {
                        console.log(res)
                        this.loading = false;
                        this.tableData = res.data.data
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