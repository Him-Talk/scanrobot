<template>
    <div class="lightweight" id="lightweight"></div>
</template>
<script>
    import { createChart } from 'lightweight-charts'
import pako from 'pako'
const chart = createChart(h('lightweight'), { width: 400, height: 300 })
const lineSeries = chart.addLineSeries()
export default {
        data () {
            return {
                socket: '',
                ws: 'wss://ws-agent.evergreenstudio.dev/ws'
            }
        },
        mounted () {
            lineSeries.setData()
        },
        methods: {

            connect () {
                this.socket = new WebSocket(this.ws)
                this.socket.onmessage = this.getMessage
                this.socket.onclose = this.close
                this.socket.onerror = this.error
                this.socket.onopen = this.open
            },

            getMessage: (msg) => {
                let result = ''
                let _this = this
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
                                _this.updatedata(result)
                            }
                        }
                    }
                }
            },

            error: () => {
                console.log('市场出现异常')
            },

            open: () => {
                let data = this.$win.getParameter()
                this.socket.send(JSON.stringify({
                    sub: `market.${data.symbol}.kline.1min`,
                    id1: 'id1'
                }))
            },

            updatedata: (data) => {
                lineSeries.setData(data)
            },

            close: () => {
                this.connect()
            }

        },
        destory: () => {
            this.socket.close()
        }
    }
</script>