'use strict'

import { app, remote, ipcMain } from 'electron'
/**
 * 注册主进程连接
 */
import {put, get, del, find, batch } from '../renderer/lib/db.js'

ipcMain.on('leveldb', (event, args) => {
    switch(args.name){
        case 'put':
        put(args.keys, args.value, function(error) {
            // console.log(args, error)
            event.sender.send(`${args.keys}_put_callback`, error);
        });
        break;
        case 'get':
            get(args.keys, function(data) {
                // console.log(args, data)
                event.sender.send(`${args.keys}_get_callback`, data);
            })
        break;
        case 'del':
            del(args.keys, function(data){
                event.sender.send(`${args.keys}_del_callback`, data)
            })
        break;
        case 'batch':
            batch(args.keys, function(data) {
                // console.log(args, data)
                event.sender.send(`${args.keys}_batch_callback`, data)
            })
        break;
        case 'find':
            find(args.keys, function(key, value){
                // console.log(args, key, value, 'find')
                event.sender.send(`${args.keys.prefix}_find_callback`, {key:key,value: value})
            })
        break;
    }
})
/**
 * 主进程事件注册
 * 获取app目录
 */
ipcMain.on("get-main-path", (event, args) => {
    console.log("主进程接受到的数据是:",args);
    event.sender.send("app-main-path", app.getPath(args))
})
/**
 * 注册端口号
 */
ipcMain.on('listen-rpc', (event, args) => {
    if(args.type === 'check') {
        event.sender.send('listen-rpc-host', remote.getGlobal('sharedObject').argv.rpchost);
        event.sender.send('listen-rpc-port', remote.getGlobal('sharedObject').argv.rpcport);
    }
    console.log("注册RPC服务", event, args)
})

// app.commandLine.appendSwitch('remote-debugging-port', args.port) 远程API端口
/**
 * --host-rules=rules
 // 一个逗号分隔的 rule 列表来控制主机名如何映射.
 //
 // 例如:
 //
 // MAP * 127.0.0.1 强制所有主机名映射到 127.0.0.1
 // MAP *.google.com proxy 强制所有 google.com 子域 使用 "proxy".
 // MAP test.com [::1]:77 强制 "test.com" 使用 IPv6 回环地址. 也强制使用端口 77.
 // MAP * baz, EXCLUDE www.google.com 重新全部映射到 "baz", 除了"www.google.com".
 // 这些映射适用于终端网络请求(TCP 连接和 主机解析 以直接连接的方式, 和 CONNECT 以代理连接, 还有 终端 host 使用 SOCKS 代理连接).
 */
// app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1') 映射规则


ipcMain.on('register-agent', (event, args) => {
    app.commandLine.appendSwitch('proxy-server', args.server) // address:port
    app.commandLine.appendSwitch('proxy-bypass-list', args.whitelist) // <local>;*.google.com;*foo.com;1.2.3.4:5678
})

ipcMain.on('agent-off', (event, args) => {
    app.commandLine.appendSwitch('no-proxy-server')
})