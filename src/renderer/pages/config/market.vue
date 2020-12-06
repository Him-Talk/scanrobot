<template>
    <Frame>
    <renderHead slot="header"></renderHead>
    <el-main>
        <el-form ref="from" :model="from" label-width="140px">
            <el-form-item label="收藏数量">
                <el-col :span="15">
                    <el-input v-model="from.favorite" placeholder="防止加载过多导致卡死，此处限制收藏收藏数量"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="监听列表">
                <el-col :span="15">
                    <el-input v-model="from.normal" placeholder="手动设置交易对，多余的自动抛弃，多个用,分割，留空则订阅api设置的报价币种"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="订阅数量">
                <el-col :span="15">
                    <el-input v-model="from.entry" placeholder="设置每个WS链接订阅市场数量"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="订阅限制">
                <el-col :span="15">
                    <el-input v-model="from.high" placeholder="设置最大允许订阅的市场交易对数量"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="结算资产">
                <el-col :span="15">
                    <el-input v-model="from.settle" placeholder="设置自动交易结算币种"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="配资比例">
                <el-col :span="15">
                    <el-input v-model="from.alloc" placeholder="预备账户资产投资比例，%"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="营收比例">
                <el-col :span="15">
                    <el-input v-model="from.revenue" placeholder="设置自动挂单结算收益比"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="止盈止损">
                <el-col :span="15">
                    <el-input v-model="from.stop" placeholder="设置挂单盈亏比例"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="投资市场限制">
                <el-col :span="15">
                    <el-input v-model="from.imr" placeholder="限制最大交易市场数量"></el-input>
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
                    favorite: 0,
                    normal: '',
                    entry: 30,
                    high: 300,
                    createTime: 0,
                    settle: 'usdt',
                    alloc: 0,
                    revenue: 0,
                    stop: 0,
                    imr: 10
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
                        keys: {prefix: `${_this.root}.accountid.config.market.temp`, limit: 1, revers: false}
                    });
                    electron.ipcRenderer.on(`${_this.root}.accountid.config.market.temp_find_callback`, (event, args)=>{
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