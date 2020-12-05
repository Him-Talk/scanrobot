<template>
    <Frame>
        <renderHead slot="header"></renderHead>
        <el-main>
            <div class="items">
                <el-popover trigger="hover" placement="top">
                    <p>
                    <div class="title">Pubkey: <kbd style="color: orangered" @click.native="copy(addrGroup.pubkey)">{{ addrGroup.pubkey }}</kbd></div>
                        <div class="eth">
                            <el-col class="col-10">以太坊地址：<kbd style="color: darkolivegreen" @click.native="copy(addrGroup.eth)">{{ addrGroup.eth }}</kbd></el-col>
                            <el-col class="col-14">以太坊私钥：<kbd style="color: forestgreen" @click.native="copy(addrGroup.prikey)">{{ addrGroup.prikey }}</kbd></el-col>
                        </div>
                        <div class="btc">
                            <el-col class="col-10">比特币地址：<kbd style="color:green" @click.native="copy(addrGroup.btc)">{{ addrGroup.btc }}</kbd></el-col>
                            <el-col class="col-14">比特币私钥：<kbd style="color:darkgreen"@click.native="copy(addrGroup.bkey)">{{ addrGroup.bkey }}</kbd></el-col>
                        </div>
                     </p>
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" @click="copy(addrGroup.pubkey)">公钥地址：{{ addrGroup.pubkey }}</el-tag>
                    </div>
                </el-popover>
            </div>
            <el-table v-loading="loading"
                      :data="tableData"
                      :fit="true"
            height="600">
                <el-table-column label="以太坊地址" prop="eth">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>
                                <div class="eth">
                                    <el-col class="col-24">以太坊余额：<el-tag size="medium" @click.native="copy(scope.row.balance)">{{ scope.row.balance }}</el-tag></el-col>
                                    <el-col class="col-14">公钥：<el-tag size="medium" @click.native="copy(scope.row.pubkey)">{{ scope.row.pubkey }}</el-tag></el-col>
                                    <el-col class="col-10">以太坊私钥：<kbd style="color: forestgreen" @click.native="copy(scope.row.prikey)">{{ scope.row.prikey }}</kbd></el-col>
                                    <el-col class="col-14">比特币私钥：<kbd style="color:darkgreen"  @click.native="copy(scope.row.bkey)">{{ scope.row.bkey }}</kbd></el-col>
                                </div>
                            </p>
                            <div slot="reference" class="name-wrapper">
                                以太坊地址: <span style="color: green"  @click="copy(scope.row.eth)">{{scope.row.eth }}</span>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="比特币地址" prop="btc">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>
                                <div class="eth">
                                    <el-col class="col-20" @click.native="copy(scope.row.overage)">比特币余额：<el-tag size="medium">{{ scope.row.overage }}</el-tag></el-col>
                                    <el-col class="col-14" @click.native="copy(scope.row.pubkey)">公钥：<el-tag size="medium">{{ scope.row.pubkey }}</el-tag></el-col>
                                    <el-col class="col-10" @click.native="copy(scope.row.prikey)">以太坊私钥：<kbd style="color: forestgreen">{{ scope.row.prikey }}</kbd></el-col>
                                    <el-col class="col-14" @click.native="copy(scope.row.bkey)">比特币私钥：<kbd style="color:darkgreen">{{ scope.row.bkey }}</kbd></el-col>
                                </div>
                            </p>
                            <div slot="reference" class="name-wrapper">
                                比特币地址: <span style="color: green"  @click="copy(scope.row.btc)">{{scope.row.btc }}</span>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="以太坊余额" prop="balance" width="150"></el-table-column>
                <el-table-column label="比特币余额" prop="overage" width="150"></el-table-column>
            </el-table>
        </el-main>
    </Frame>
</template>
<script>
    /**
     * 大海捞针
     */
    import Frame from '@/components/frame/mainFrame.vue'
    import renderHead from '@/components/header/renderHead.vue'
    export default {
        name: 'haystack',
        data () {
            return {
                loading: true,
                index: 0,
                url: 'https://mainnet.eth.api.lc/api/generate/getpub',
                blockchair: 'https://api.blockchair.com/bitcoin/addresses/balances',
                infura: 'https://mainnet.infura.io/v3/3130e7ba66ab4ca88b7876cbad82fff6',
                addrGroup: {
                    eth: '0x990EA71F05D8C0B7D3EB796982285B8A3DC6ED4B',
                    btc: '1FvPbG9RNQjcaUdsjuwULqeZXecKeYEvLV',
                    pubkey: '5b451ec101010a6b2c03ac67e511e54dd9a6d232b3cd24dea1dc3435bb0e619dcf1e814c94904c0ad36979d051d20c560beec95b2152a89730edc4bfd7e8333b',
                    prikey: '0x1f79c99715e0925a9a71d1b13905cf3a0c9d668a2969691f157ed7eb8c6d3b2f',
                    bkey: 'KxGtu2MQtujwgY9z5R2GJh6fL1vNHdnqxk5bbb73KCoCYBzDTSoV'
                },
                tableData: []
            }
        },
        components: {Frame, renderHead},
        watch: {
          tableData: {
              handler(newValue, oldValue){
                  if(newValue.length > 0){
                      this.loading = false
                  }
              },
              deep: true
          }
        },
        methods: {
            copy (text) {
              electron.clipboard.writeText(text)
            this.$notify({
                title: '系统通知',
                message: '文本复制成功',
                showClose: false,
                type: 'success',
                position: 'bottom-left'
            });
            },
            start () {
                let _this = this
                this.getList().then(res=>{
                    _this.fetch(res);
                });
            },
            async getList() {
                let result;
                try {
                    result = await this.$http.get(this.url);
                }catch(e){
//                    console.log(e)
                    this.getList()
                }
               return result.data;
            },
            async fetch (list) {
                let _this = this

//                _this.loading = false;
                for(let i=0;i < list.length; i++){
                    let item = list[i]
                    if(this.index%1500===0 && this.tableData.length < 10) {
                        item.balance = 0
                        item.overage = 0
                        this.tableData.push(item)
                    }
                    this.index++
//                    console.log(item)
                   _this.addrGroup = item;
                    try {
                        let res = await _this.$http.post(_this.blockchair, {addresses: item.btc});
                        if (res.data.data.length > 0) {
                            item.overage = res.data.data[item.btc].balance;
                            _this.tableData.push(item);
                        } else {
                            let ret = await _this.$http.post(_this.infura, JSON.stringify({
                                'jsonrpc': '2.0',
                                'method': 'eth_getBalance',
                                'params': [item.eth, 'latest'],
                                'id': Math.floor(Math.random() * 10000)
                            }));

                            if (parseInt(ret.data.result) > 0) {
                                _this.tableData.push(item);
                            }
                        }
                    }catch(e){
                        this.fetch(list.splice(i, list.length - i))
                    }
                }
                this.start()
            }
        },
        mounted() {
            this.start()
        }
    }
</script>