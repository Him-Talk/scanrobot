import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'mainWindow',
      component: () => import('@/pages/MainWindow.vue'),
      children: [
        {
          path: '',
          component: () => import('@/pages/main/Index.vue')
        },
        {
          path: 'windows',
          component: () => import('@/pages/main/Windows.vue')
        },
        {
          path: 'transform',
          component: () => import('@/pages/main/Transform.vue')
        },
        {
          path: 'ipc',
          component: () => import('@/pages/main/Ipc.vue')
        }
      ]
    },
    {
      path: '/ipcWindow',
      name: 'ipcWindow',
      component: () => import('@/pages/IpcWindow.vue')
    },
    {
      path: '/infoWindow/:id',
      name: 'infoWindow',
      component: () => import('@/pages/InfoWindow.vue')
    },
    {
      path: '/newWindow',
      name: 'newWindow',
      component: () => import('@/pages/NewWindow.vue')
    },
    {
      path: '/exchange',
      name: 'exchange',
      meta: {
        title: '自动市场交易分析及账户跟踪'
      },
      component: () => import('@/pages/exchange.vue')
    },
    {
      path: '/chart/:symbol',
      name: 'chart',
      meta: {
        title: '交易市场'
      },
      component: () => import('@/pages/chart/ChartContainer.vue')
    },
    {
        path: '/accounts/assets',
        name: 'assets',
        meta: {
          title: '账户资产'
        },
        component: () => import('@/pages/account/assets.vue')
    },
    {
        path: '/accounts/authors',
        name: 'authors',
        meta: {
          title: '账户授权'
        },
        component: () => import('@/pages/account/authors.vue')
    },
    {
        path: '/accounts/deposit',
        name: 'deposit',
        meta: {
          title: '充提记录'
        },
        component: () => import('@/pages/account/deposit.vue')
    },
    {
        path: '/accounts/finance',
        name: 'finance',
        meta: {
            title: '财务流水'
        },
        component: () => import('@/pages/account/finance.vue')
    },
    {
        path: '/accounts/turnover',
        name: 'turnover',
        meta: {
            title: '账户流水'
        },
        component: () => import('@/pages/account/turnover.vue')
    },
    {
        path: '/config/api',
        name: 'api',
        meta: {
            title: 'API设置'
        },
        component: () => import('@/pages/config/api.vue')
    },
    {
        path: '/config/haystack',
        name: 'haystack',
        meta: {
            title: '大海捞针 龘齉齾（da Nang Ya）生僻字'
        },
        component: () => import('@/pages/config/haystack.vue')
    },
    {
        path: '/config/market',
        name: 'market',
        meta: {
            title: '市场配置'
        },
        component: () => import('@/pages/config/market.vue')
    },
    {
        path: '/finance/pending',
        name: 'pending',
        meta: {
            title: '待确认交易'
        },
        component: () => import('@/pages/finance/pending.vue')
    },
    {
        path: '/finance/transaction',
        name: 'transaction',
        meta: {
            title: '财务交易'
        },
        component: () => import('@/pages/finance/transaction.vue')
    },
    {
        path: '/finance/transfer',
        name: 'transfer',
        meta: {
            title: '互转记录'
        },
        component: () => import('@/pages/finance/transfer.vue')
    },
    {
        path: '/market/pending',
        name: 'marketpending',
        meta: {
            title: '未成交订单'
        },
        component: () => import('@/pages/market/pending.vue')
    },
    {
        path: '/market/quotes',
        name: 'quotes',
        meta: {
            title: '行情列表'
        },
        component: () => import('@/pages/market/quotes.vue')
    },
    {
        path: '/market/stats',
        name: 'stats',
        meta: {
            title: '系统状态'
        },
        component: () => import('@/pages/market/stats.vue')
    },
    {
      path: '/backGround',
      name: 'backGround',
      meta: {
          title: '背景'
      },
      component: () => import('@/components/public/BackGround')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
          title: '登录'
      },
      component: () => import('@/pages/Login')
    },
    {
      path: '/register',
      name: 'register',
      meta: {
          title: '账户注册'
      },
      component: () => import('@/pages/Register')
    },
    {
      path: '/setting',
      name: 'setting',
      meta: {
        title: '设置'
      },
      component: () => import('@/pages/Setting')
    },
    {
      path: '/qqPage',
      name: 'qqPage',
      component: () => import('@/pages/QQpage')
    },
    {
      path: '/cloudWindow',
      name: 'cloudWindow',
      component: () => import('@/pages/CloudWindow')
    }
  ]
})
