import signStr from './sign.js'
class Tx
{
    constructor(accesskey, seckey){
        this.seckey = seckey;
        this.accesskey = accesskey;
    }

    historyOrder(path, payload){
        let data = {
            AccessKeyId: this.accesskey,
            SignatureMethod: 'HmacSHA256',
            SignatureVersion: 2,
            Timestamp: signStr.timstamp()
        };
        if(payload.symbol !== ''){
            data.symbol = payload.symbol
        }
        if(payload.types !== ''){
            data.types = payload.types
        }
        if(payload.start_time !== ''){
            data['start-time'] = payload.start_time
        }
        if(payload.end_time !== ''){
            data['end-time'] = payload.end_time
        }
        if(payload.states !== ''){
            data.states = payload.states
        }
        if(payload.direct !== ''){
            data.direct = payload.direct
        }
        if(payload.size !== ''){
            data.size = payload.size
        }
        if(payload.from !== ''){
            data.from = payload.from
        }
        let sign = signStr.sign("GET", path, data, this.seckey); //访问域名 api.huobi.pro
        return sign
    }

    openOrders(path, payload){
        let data = {
            AccessKeyId: this.accesskey,
            SignatureMethod: 'HmacSHA256',
            SignatureVersion: 2,
            Timestamp: signStr.timstamp()
        };
        if(payload.symbol !== ''){
            data.symbol = payload.symbol
        }
        if(payload['account-id'] !== ''){
            data['account-id'] = payload['account-id']
        }
        if(payload.side !== ''){
            data.side = payload.side
        }
        if(payload.direct !== ''){
            data.direct = payload.direct
        }
        if(payload.size !== ''){
            data.size = payload.size
        }
        if(payload.from !== ''){
            data.from = payload.from
        }
        let sign = signStr.sign("GET", path, data, this.seckey); //访问域名 api.huobi.pro
        return sign
    }

    historyDeal(path, payload){
        let data = {
            AccessKeyId: this.accesskey,
            SignatureMethod: 'HmacSHA256',
            SignatureVersion: 2,
            Timestamp: signStr.timstamp()
        };
        if(payload.symbol !== ''){
            data.symbol = payload.symbol
        }
        if(payload.types !== ''){
            data.types = payload.types
        }
        if(payload.start_time !== ''){
            data['start-time'] = payload.start_time
        }
        if(payload.end_time !== ''){
            data['end-time'] = payload.end_time
        }
        if(payload.direct !== ''){
            data.direct = payload.direct
        }
        if(payload.size !== ''){
            data.size = payload.size
        }
        if(payload.from !== ''){
            data.from = payload.from
        }
        let sign = signStr.sign("GET", path, data, this.seckey); //访问域名 api.huobi.pro
        return sign
    }

}
export default Tx;