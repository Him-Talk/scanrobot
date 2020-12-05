const universal = require('./common')
// ipcRender
// ipcRenderer.send('get-main-path', 'userData')
// ipcRenderer.on('app-main-path', function(event, args) {
//     console.log(args, 'datadir')
// });
import {app} from 'electron'
    const leveldb = require("level")
    
    let db = leveldb(require('path').join(app.getPath('userData'), "/data"), {valueEncoding: "json", create_if_missing: true}, function (err, db) {
        console.log(err, '建立数据库连接')
        if (err) throw err
    })


    function put(key, value, callback) {
        if (key && value) {
            let hash = universal.default.hash(value)
            console.log('write', key, hash, value)
            db.put(`${key}.${hash}`, value, function (error) {
                callback(error);
            })
        } else {
            callback('no key or value');
        }
    }

    function get(key, callback) {
        if (key) {
            db.get(key, function (error, value) {
                callback(error, value);
            })
        } else {
            callback('no key', key);
        }
    }

    function del(key, callback) {
        if (key) {
            db.del(key, function (error) {
                callback(error);
            })
        } else {
            callback('no key');
        }
    }

    function batch(arr, callback) {
        if (Array.isArray(arr)) {
            var batchList = [];
            arr.forEach(item)
            {
                var listMember = {};
                if (item.hasOwnProperty('type')) {
                    listMember.type = item.type;
                }
                if (item.hasOwnProperty('key')) {
                    listMember.key = `${item.key}.${universal.hash(item.value)}`;
                }
                if (item.hasOwnProperty('value')) {
                    listMember.value = item.value;
                }
                if (listMember.hasOwnProperty('type') && listMember.hasOwnProperty('key') && listMember.hasOwnProperty('value')) {
                    batchList.push(listMember);
                }
            }
            if (batchList && batchList.length > 0) {
                db.batch(batchList, function (error) {
                    callback(error, batchList);
                })
            } else {
                callback('array Membre format error');
            }
        } else {
            callback('not array');
        }
    }

    function find(find, callback) {
        var option = {keys: true, values: true, revers: false, limit: 20, fillCache: true};
        if (!find)
            return callback('nothing', null);
        else {
            if (find.prefix) {
                option.start = find.prefix;
                option.end = find.prefix.substring(0, find.prefix.length - 1)
                    + String.fromCharCode(find.prefix[find.prefix.length - 1].charCodeAt() + 1);
            }

            if (find.limit)
                option.limit = find.limit;

            db.createReadStream(option).on('data', function (data) {
                data && callback(data.key, data.value);
            }).on('error', function (err) {
            }).on('close', function () {
            }).on('end', function () {
                return callback(null, Date.now());
            });
        }
    }
exports.put = put;
exports.get = get;
exports.del = del;
exports.find = find;
exports.batch = batch;
// module.exports = dbLevel;