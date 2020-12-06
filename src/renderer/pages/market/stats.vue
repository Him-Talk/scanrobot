<template>
    <Frame>
    <renderHead slot="header"></renderHead>
    <el-main>
        <el-row>
            <el-col :span="6">系统状态指标</el-col>
            <el-col :span="18">{{ stats.status.indicator }}</el-col>
        </el-row>
        <el-row>
            <el-col :span="6">系统状态描述</el-col>
            <el-col :span="18">{{ stats.status.description }}</el-col>
        </el-row>

        <el-row>
            <el-col><el-tag>现货页面基本信息</el-tag></el-col>
        </el-row>
        <el-row :gutter="12">
            <el-card>
                <el-row>
                    <el-col :span="6">页面ID</el-col><el-col :span="18">{{ stats.page.id }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">页面名称</el-col><el-col :span="18">{{ stats.page.name }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">页面地址</el-col><el-col :span="18">{{ stats.page.url }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">时区</el-col><el-col :span="18">{{ stats.page.time_zone }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">页面最近更新时间</el-col><el-col :span="18">{{ stats.page.updated_at }}</el-col>
                </el-row>
            </el-card>
        </el-row>
        <el-row>
            <el-col><el-tag>系统组件状态跟踪</el-tag></el-col>
        </el-row>
        <el-row :gutter="12">
            <el-card v-for="(item, index) in stats.components" :key="index">
                <el-row>
                    <el-col :span="6">组件ID</el-col><el-col :span="18">{{ item.id }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">组件名称</el-col><el-col :span="18">{{ item.name }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">组件状态</el-col><el-col :span="18">{{ item.status }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">创建时间</el-col><el-col :span="18">{{ item.created_at }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">更新时间</el-col><el-col :span="18">{{ item.updated_at }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">组件定位</el-col><el-col :span="18">{{ item.position }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">组件描述</el-col><el-col :span="18">{{ item.description }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">展示状态</el-col><el-col :span="18">{{ item.showcase }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">分组ID</el-col><el-col :span="18">{{ item.group_id }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">页面ID</el-col><el-col :span="18">{{ item.page_id }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">分组</el-col><el-col :span="18">{{ item.group }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">仅在降级时显示</el-col><el-col :span="18">{{ item.only_show_if_degraded }}</el-col>
                </el-row>
            </el-card>
        </el-row>
        <el-row>
            <el-col>系统计划维护</el-col>
        </el-row>
        <el-row :gutter="12">
            <el-col :span="24">
                <el-tag>{{ stats.scheduled_maintenances.length === 0 ? '无' : '是' }}</el-tag>
                <el-card v-show="stats.scheduled_maintenances.length > 0">
                    <el-form>
                        <el-form-item v-for="(item, index) in stats.scheduled_maintenances" :key="index">
                            <el-row>
                                <el-col :span="4">事件ID: </el-col><el-col :span="20"><el-tag>{{ item.id }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">事件名称: </el-col><el-col :span="20"><el-tag>{{ item.name }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">事件状态: </el-col><el-col :span="20"><el-tag>{{ item.status }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">创建时间: </el-col><el-col :span="20"><el-tag>{{ item.created_at }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">更新时间: </el-col><el-col :span="20"><el-tag>{{ item.updated_at }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">验证时间: </el-col><el-col :span="20"><el-tag>{{ item.monitoring_at }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">计划维护开始时间: </el-col><el-col :span="20"><el-tag>{{ item.scheduled_for }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">计划维护结束时间: </el-col><el-col :span="20"><el-tag>{{ item.scheduled_until }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">事件影响: </el-col><el-col :span="20"><el-tag>{{ item.impact }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">维护信息链接: </el-col><el-col :span="20"><el-tag>{{ item.shortlink }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">开始时间: </el-col><el-col :span="20"><el-tag>{{ item.started_at }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">页面地址ID: </el-col><el-col :span="20"><el-tag>{{ item.page_id }}</el-tag></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-divider></el-divider>
                                <el-col :span="24"><el-tag>事件进度更新</el-tag></el-col>
                                <el-divider></el-divider>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">事件页面ID:</el-col>
                                <el-col :span="20"><el-tag>{{ item.incident_updates.id }}</el-tag></el-col>
                            </el-row>

                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">更新事件状态: </el-col>
                                <el-col :span="20"><el-tag>{{ item.incident_updates.status }}</el-tag></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">更新事件内容:</el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.body }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">事件ID:</el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.incident_id }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">创建时间: </el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.created_at }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">更新时间: </el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.updated_at }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">显示时间: </el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.display_at }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">发送通知:</el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.deliver_notifications }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">自定义tweet: </el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.custom_tweet }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">tweet id: </el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.tweet_id }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="24"><el-alert type="waring">受影响的组件: </el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-row :span="24" v-for="(items, keys) in item.incident_updates.affected_components" :key="keys">
                                    <el-col :span="4">组件代码：</el-col><el-col :span="20"><el-tag>{{ items.code }}</el-tag></el-col>
                                    <el-col :span="4">组件名称：</el-col><el-col :span="20"><el-tag>{{ items.name }}</el-tag></el-col>
                                    <el-col :span="4">旧状态：</el-col><el-col :span="20"><el-tag>{{ items.old_status }}</el-tag></el-col>
                                    <el-col :span="4">新状态：</el-col><el-col :span="20"><el-tag>{{ items.new_status }}</el-tag></el-col>
                                </el-row>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col>系统故障维护</el-col>
        </el-row>
        <el-row :gutter="12">
            <el-col :span="24">
                <el-tag>{{ stats.incidents.length === 0 ? '无' : '是' }}</el-tag>
                <el-card v-show="stats.incidents.length > 0">
                    <el-form>
                        <el-form-item v-for="(item, index) in stats.incidents" :key="index">
                            <el-row>
                                <el-col :span="4">事件ID: </el-col><el-col :span="20"><el-tag>{{ item.id }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">事件名称: </el-col><el-col :span="20"><el-tag>{{ item.name }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">事件状态: </el-col><el-col :span="20"><el-tag>{{ item.status }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">创建时间: </el-col><el-col :span="20"><el-tag>{{ item.created_at }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">更新时间: </el-col><el-col :span="20"><el-tag>{{ item.updated_at }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">验证时间: </el-col><el-col :span="20"><el-tag>{{ item.monitoring_at }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">计划维护开始时间: </el-col><el-col :span="20"><el-tag>{{ item.scheduled_for }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">计划维护结束时间: </el-col><el-col :span="20"><el-tag>{{ item.scheduled_until }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">事件影响: </el-col><el-col :span="20"><el-tag>{{ item.impact }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">维护信息链接: </el-col><el-col :span="20"><el-tag>{{ item.shortlink }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">开始时间: </el-col><el-col :span="20"><el-tag>{{ item.started_at }}</el-tag></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">页面地址ID: </el-col><el-col :span="20"><el-tag>{{ item.page_id }}</el-tag></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-divider></el-divider>
                                <el-col :span="24"><el-tag>事件进度更新</el-tag></el-col>
                                <el-divider></el-divider>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">事件页面ID:</el-col>
                                <el-col :span="20"><el-tag>{{ item.incident_updates.id }}</el-tag></el-col>
                            </el-row>

                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">更新事件状态: </el-col>
                                <el-col :span="20"><el-tag>{{ item.incident_updates.status }}</el-tag></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">更新事件内容:</el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.body }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">事件ID:</el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.incident_id }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">创建时间: </el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.created_at }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">更新时间: </el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.updated_at }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">显示时间: </el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.display_at }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">发送通知:</el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.deliver_notifications }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">自定义tweet: </el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.custom_tweet }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="4">tweet id: </el-col>
                                <el-col :span="20"><el-alert type="success">{{ item.incident_updates.tweet_id }}</el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-col :span="24"><el-alert type="waring">受影响的组件: </el-alert></el-col>
                            </el-row>
                            <el-row v-show="item.incident_updates.length === 0">
                                <el-row :span="24" v-for="(items, keys) in item.incident_updates.affected_components" :key="keys">
                                    <el-col :span="4">组件代码：</el-col><el-col :span="20"><el-tag>{{ items.code }}</el-tag></el-col>
                                    <el-col :span="4">组件名称：</el-col><el-col :span="20"><el-tag>{{ items.name }}</el-tag></el-col>
                                    <el-col :span="4">旧状态：</el-col><el-col :span="20"><el-tag>{{ items.old_status }}</el-tag></el-col>
                                    <el-col :span="4">新状态：</el-col><el-col :span="20"><el-tag>{{ items.new_status }}</el-tag></el-col>
                                </el-row>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </el-main>
    </Frame>
</template>
<script>
    import Frame from '@/components/frame/mainFrame.vue'
    import renderHead from '@/components/header/renderHead.vue'
    export default {
        data () {
            return {
                stats: {
                    "page": {  // 火币现货页面基本信息
                        "id": "p0qjfl24znv5",  // 页面id
                        "name": "Huobi",  // 页面名称
                        "url": "https://status.huobigroup.com", // 页面地址
                        "time_zone": "Etc/UTC", // 时区
                        "updated_at": "2020-02-07T10:25:14.717Z" // 页面最新一次更新时间
                    },
                    "components": [  // 系统组件及状态
                        {
                            "id": "h028tnzw1n5l",  // 组件id
                            "name": "Deposit", // 组件名称
                            "status": "operational", // 组件状态
                            "created_at": "2019-12-05T02:07:12.372Z",  // 组件创建时间
                            "updated_at": "2020-02-07T09:27:15.563Z", // 组件更新时间
                            "position": 1,
                            "description": null,
                            "showcase": true,
                            "group_id": "gtd0nyr3pf0k",
                            "page_id": "p0qjfl24znv5",
                            "group": false,
                            "only_show_if_degraded": false
                        }
                    ],
                    "incidents": [ // 系统故障事件及状态
                        {
                            "id": "rclfxz2g21ly",  // 事件id
                            "name": "Market data is delayed",  // 事件名称
                            "status": "investigating",  // 事件状态
                            "created_at": "2020-02-11T03:15:01.913Z",  // 事件创建时间
                            "updated_at": "2020-02-11T03:15:02.003Z",   // 事件更新时间
                            "monitoring_at": null,
                            "resolved_at": null,
                            "impact": "minor",  // 事件影响程度
                            "shortlink": "http://stspg.io/pkvbwp8jppf9",
                            "started_at": "2020-02-11T03:15:01.906Z",
                            "page_id": "p0qjfl24znv5",
                            "incident_updates": [
                                {
                                    "id": "dwfsk5ttyvtb",
                                    "status": "investigating",
                                    "body": "Market data is delayed",
                                    "incident_id": "rclfxz2g21ly",
                                    "created_at": "2020-02-11T03:15:02.000Z",
                                    "updated_at": "2020-02-11T03:15:02.000Z",
                                    "display_at": "2020-02-11T03:15:02.000Z",
                                    "affected_components": [
                                        {
                                            "code": "nctwm9tghxh6",
                                            "name": "Market data",
                                            "old_status": "operational",
                                            "new_status": "degraded_performance"
                                        }
                                    ],
                                    "deliver_notifications": true,
                                    "custom_tweet": null,
                                    "tweet_id": null
                                }
                            ],
                            "components": [
                                {
                                    "id": "nctwm9tghxh6",
                                    "name": "Market data",
                                    "status": "degraded_performance",
                                    "created_at": "2020-01-13T09:34:48.284Z",
                                    "updated_at": "2020-02-11T03:15:01.951Z",
                                    "position": 8,
                                    "description": null,
                                    "showcase": false,
                                    "group_id": null,
                                    "page_id": "p0qjfl24znv5",
                                    "group": false,
                                    "only_show_if_degraded": false
                                }
                            ]
                        }
                    ],
                    "scheduled_maintenances": [  // 系统计划维护事件及状态
                        {
                            "id": "k7g299zl765l", // 事件id
                            "name": "Schedule maintenance", // 事件名称
                            "status": "scheduled", // 事件状态
                            "created_at": "2020-02-11T03:16:31.481Z",  // 事件创建时间
                            "updated_at": "2020-02-11T03:16:31.530Z",  // 事件更新时间
                            "monitoring_at": null,
                            "resolved_at": null,
                            "impact": "maintenance", // 事件影响
                            "shortlink": "http://stspg.io/md4t4ym7nytd",
                            "started_at": "2020-02-11T03:16:31.474Z",
                            "page_id": "p0qjfl24znv5",
                            "incident_updates": [
                                {
                                    "id": "8whgr3rlbld8",
                                    "status": "scheduled",
                                    "body": "We will be undergoing scheduled maintenance during this time.",
                                    "incident_id": "k7g299zl765l",
                                    "created_at": "2020-02-11T03:16:31.527Z",
                                    "updated_at": "2020-02-11T03:16:31.527Z",
                                    "display_at": "2020-02-11T03:16:31.527Z",
                                    "affected_components": [
                                        {
                                            "code": "h028tnzw1n5l",
                                            "name": "Deposit And Withdraw - Deposit",
                                            "old_status": "operational",
                                            "new_status": "operational"
                                        }
                                    ],
                                    "deliver_notifications": true,
                                    "custom_tweet": null,
                                    "tweet_id": null
                                }
                            ],
                            "components": [
                                {
                                    "id": "h028tnzw1n5l",
                                    "name": "Deposit",
                                    "status": "operational",
                                    "created_at": "2019-12-05T02:07:12.372Z",
                                    "updated_at": "2020-02-10T12:34:52.970Z",
                                    "position": 1,
                                    "description": null,
                                    "showcase": false,
                                    "group_id": "gtd0nyr3pf0k",
                                    "page_id": "p0qjfl24znv5",
                                    "group": false,
                                    "only_show_if_degraded": false
                                }
                            ],
                            "scheduled_for": "2020-02-15T00:00:00.000Z",  // 计划维护开始时间
                            "scheduled_until": "2020-02-15T01:00:00.000Z"  // 计划维护结束时间
                        }
                    ],
                    "status": {  // 系统整体状态
                        "indicator": "minor",   // 系统状态指标
                        "description": "Partially Degraded Service"  // 系统状态描述
                    }
                }
            }
        },
        components: {Frame, renderHead},
        methods: {
            sysStats(){
                this.$http.get('https://status.huobigroup.com/api/v2/summary.json').then(res=> {
                    console.table(res.data)
                    this.stats = res.data
                })
            }
        },
        mounted() {
            this.sysStats()
        }
    }
</script>

<style>
    .el-main {
        background: rgba(0, 0, 0, 0.09);
        color: #fff
    }
    .el-input input {
        background: rgba(250, 250, 210, 0.9);
        color: #474f54;
        font-weight: bold;
        font-size: 12px;
        border-color: #fff;
    }
    .el-form-item label {
        color: #fff
    }
</style>