import hash from 'object-hash'
export default {
    hash: function (data) {
       return hash(data, {algorithm: 'sha256'})
    }
}