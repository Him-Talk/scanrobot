var CryptoJS = require('crypto-js');
import HmacSHA256 from 'crypto-js/hmac-sha256'
const moment = require('moment');

class signStr {

    sign(method, path, data, prikey){

        data = this.sort_ASCII(data)

        return this.sign_sha(method, path, data, prikey)

    }

    sort_ASCII(obj){

        var arr = new Array();

        var keys = Object.keys(obj)

        var sortArr = keys.sort();

        // var sortArr = keys.sort(function(a,b){
        //
        //     return a.toLowerCase().localeCompare(b.toLowerCase())
        //
        // });

        var sortObj = {};

        for (var i in sortArr) {

            sortObj[sortArr[i]] = obj[sortArr[i]];

        }

        console.table(sortObj)

        return sortObj;

    }

    timstamp(){

        return moment.utc().format('YYYY-MM-DDTHH:mm:ss')

    }

    sign_sha(method, path,  json, prikey) {

        let signstr = Object.keys(json).map(function(key){

            return key + "=" + encodeURIComponent(json[key]);

        }).join("&");

        const meta = [method, "api.huobi.pro", path, signstr].join('\n')

        var hash = HmacSHA256(meta, prikey);

        var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));

        signstr += "&Signature="+ Signature;

        return signstr;
    }
}
const sign = new signStr;
export default sign;