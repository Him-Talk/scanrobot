import signStr from './sign.js'
class Account
{
    constructor(accesskey, seckey){
        this.seckey = seckey;
        this.accesskey = accesskey;
    }

    accounts(path){
        let data = {
            AccessKeyId: this.accesskey,
            SignatureMethod: 'HmacSHA256',
            SignatureVersion: 2,
            Timestamp: signStr.timstamp()
        };
        let sign = signStr.sign("GET", path, data, this.seckey); //访问域名 api.huobi.pro

        return sign;
    }

    assets(path, payload){
        let data = {
            AccessKeyId: this.accesskey,
            SignatureMethod: 'HmacSHA256',
            SignatureVersion: 2,
            valuationCurrency: payload.valuationCurrency,
            Timestamp: signStr.timstamp()
        };
        if(payload.accountType !== ''){
            data.accountType = payload.accountType
        }
        let sign = signStr.sign("GET", path, data, this.seckey); //访问域名 api.huobi.pro
        return sign
    }

    balance(path, payload){
        let data = {
            AccessKeyId: this.accesskey,
            SignatureMethod: 'HmacSHA256',
            SignatureVersion: 2,
            Timestamp: signStr.timstamp()
        };
        // if(payload['account-id'] !== ''){
        //     data['account-id'] = payload['account-id']
        // }
        let sign = signStr.sign("GET", path, data, this.seckey); //访问域名 api.huobi.pro
        return sign
    }

    dwlog(accountid, path, payload){
        let data = {
            AccessKeyId: this.accesskey,
            'account-id': accountid,
            SignatureMethod: 'HmacSHA256',
            SignatureVersion: 2,
            Timestamp: signStr.timstamp()
        };
        if(payload.currency !== ''){
            data.currency = payload.currency
        }
        if(payload.type !== ''){
            data.type = payload.type;
        }

        if(payload.direct !== '') {
            data.direct = payload.direct
        }

        if(payload.size > 0 && payload.size <= 500) {
            data.size = payload.size
        }

        if(payload.from !== '') {
            data['from'] = payload.from
        }

        let sign = signStr.sign("GET", path, data, this.seckey);
        return sign;
    }

    financeTurnover(accountid, path, payload) {
        let data = {
            AccessKeyId: this.accesskey,
            accountId: accountid,
            SignatureMethod: 'HmacSHA256',
            SignatureVersion: 2,
            Timestamp: signStr.timstamp()
        };
        if(payload.currency !== ''){
            data.currency = payload.currency
        }
        if(payload.transactTypes !== ''){
            data.transactTypes = payload.transactTypes;
        }

        if(payload.startTime !== ''){
            data['startTime'] = payload.startTime
        }

        if(payload.endTime !== '') {
            data['endTime'] = payload.endTime
        }

        if(payload.sort !== '') {
            data.sort = payload.sort
        }

        if(payload.limit > 0 && payload.limit <= 500) {
            data.limit = payload.limit
        }

        if(payload.fromid !== '') {
            data['from-id'] = payload.fromid
        }

        let sign = signStr.sign("GET", path, data, this.seckey);
        return sign;
    }

    turnover(accountid, path, payload){
        let data = {
            AccessKeyId: this.accesskey,
            'account-id': accountid,
            SignatureMethod: 'HmacSHA256',
            SignatureVersion: 2,
            Timestamp: signStr.timstamp()
        };
        if(payload.currency !== ''){
            data.currency = payload.currency
        }
        if(payload['transact-types'] !== ''){
            data['transact-types'] = payload['transact-types'];
        }

        if(payload.start_time !== ''){
            data['start-time'] = payload.start_time
        }

        if(payload.end_time !== '') {
            data['end-time'] = payload.end_time
        }

        if(payload.sort !== '') {
            data.sort = payload.sort
        }

        if(payload.size > 0 && payload.size <= 500) {
            data.size = payload.size
        }

        if(payload.fromid !== '') {
            data['from-id'] = payload.fromid
        }

        let sign = signStr.sign("GET", path, data, this.seckey);
        return sign;
    }

}
export default Account;