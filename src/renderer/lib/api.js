const api = {
    turnover: '/{version}/account/history',//账户流水
    accounts: '/{version}/account/accounts',// 账户信息
    balance: '/{version}/account/accounts/{account-id}/balance', // 账户余额
    assets: '/v2/account/asset-valuation',//账户资产估值 //valuationCurrency BTC、CNY、USD、JPY、KRW、GBP、TRY、EUR、RUB、VND、HKD、TWD、MYR、SGD、AED、SAR
    transfer: '/{version}/account/transfer',//资产划转
    transferout_to_margin: '/{version}/dw/transfer-out/margin',// 从杠杆账户划转至币币交易账户
    transferin_to_margin: '/{version}/dw/transfer-in/margin',// 从币币交易账户划转至杠杆账户
    financeTurnover: '/v2/account/ledger', //财务流水
    dwlog: '/{version}/query/deposit-withdraw', //充提记录 type 类型
    orders: '/{version}/order/orders/place', // 下单 POST
    batchOrder: '/{version}/order/batch-orders', //批量下单 POST
    revokeOrder: '/{version}/order/orders/{order-id}/submitcancel', // 撤销订单 POST
    revokeOrderByClientId: '/{version}/order/orders/submitCancelClientOrder', //根据客户提交订单号撤单 client-order-id
    openOrders: '/{version}/order/openOrders', // 未成交订单 当前委托单
    batchRevokeOpenOrders: '/{{version}}/order/orders/batchCancelOpenOrders', // 批量撤销订单 POST open Order
    batchRevoke: '/{version}/order/orders/batchcancel', //批量撤销订单
    orderDetail: '/{version}/order/orders/{order-id}', // 查询订单详情 order-id
    orderDetailClientId: '/{version}/order/orders/getClientOrder?clientOrderId',// 基于客户端id查询订单
    dealDetail: '/{version}/order/orders/{order-id}/matchresults', // 成交明细
    historyOrder: '/{version}/order/orders', // 	查询当前委托、历史委托
    historyDeal: '/{version}/order/matchresults', // 	查询成交
    curFee: '/v2/reference/transact-fee-rate', // 查询当前手续费费率 symbols btcusdt,ethusdt
    sysState: 'https://status.huobigroup.com/api/v2/summary.json', // 获取当前系统状态
    marketState: '/v2/market-status', //获取当前市场状态
    tickers: '/market/tickers', // 获取所有交易对
    tradeState: '/{version}/common/symbols', //获取当前交易状态
    allpair: '/{version}/common/currencys', // 获取所有币对
    ticket: '/v2/reference/currencies', // API v2币链参考信息
    depth: '/market/depth', // 市场深度数据查询
    merged: '/market/detail/merged', // 聚合行情
    timestamp: '/{version}/common/timestamp' // 获取当前系统时间戳
};

export default api;