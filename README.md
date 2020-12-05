## ScanRobot 一个自动化交易以及暴力扫描破解私钥的工具脚本

> 特别说明

    该框架基于Electron核心进行开发
    窗口特效及一些常规界面展示来自于electron-ui库
    css前端ui基于element-ui拓展开发
    再次特别感谢

### ScanRobot 主要功能介绍

  1. 通过调用区块浏览器的资产余额查询接口对我们产出的私钥钱包进行资产余额确认，目前支持查询比特币和以太坊
  2. 钱包算法实现，钱包私钥地址库目前没有集成到本地，而是采用服务端api的方式进行获取
  3. 其中对于比特币和以太坊钱包的私钥地址均来自同一个私钥字符串，为了方便用户进行客户端导入，格式化成为了常用私钥
  4. 同时我们在api接口当中也将返回对应的公钥，目前接口获取的参数包含，公钥、比特币地址、以太坊地址、比特币私钥、以太坊私钥
  5. 钱包地址余额查询分别通过[blockchair](https://blockchair.com/)及[infura](http://infura.io/)进行验证

#### LevelDB在项目中的作用和实现
  
**LevelDB**是谷歌退出的一款快速读写的kv数据库，它有着应用级别存储的功能，使我们在前端开发的过程中无需部署远程服务器及后端即可进行数据存取

我们通过**LevelDB**数据库对用户的常规操作和系统配置进行迭代管理，用户每次操作的记录都将保存在本地的**LevelDB**数据库

~ 数据库和应用之间的读写通信

因为在**LevelDB**的使用当中，只能启用一个独占式进程，不允许用户进行重复初始化数据库，因此，我们将levelDB初始化在Electron主窗口

在前端进行数据库查询的时候，通过ipcRenderer进行通信，这样就不会产生重复性初始化数据库的情况

> 最后，我们后续将计划开发区块链级别的分布式存储服务，使用户的每一步操作都能同步到链上，大海捞针不上链，不存入数据库


#### 如果你对本项目感兴趣，欢迎对项目进行Fork、Star、贡献

#捐赠： 

BTC: [3QEzrFvRD9gYhQccUn9CJs5Hdziaae7FXG](https://blockchair.com/bitcoin/address/3QEzrFvRD9gYhQccUn9CJs5Hdziaae7FXG)

LTC: [LbpTxaKdMrDYzu3ZFZ24DzKaT43HTGy5dG](https://blockchair.com/litecoin/address/LbpTxaKdMrDYzu3ZFZ24DzKaT43HTGy5dG)

ETH: [0x32275Ef32623568168eF909F4f591D3608387097](https://explorer.v.fyi/address/0x32275Ef32623568168eF909F4f591D3608387097)
