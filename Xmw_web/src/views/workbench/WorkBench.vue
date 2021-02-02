<template>
    <page-header-wrapper>
        <template v-slot:content>
            <div class="page-header-content">
                <div class="avatar">
                    <a-avatar size="large" :src="user.avatar" v-if="user.avatar" />
                    <a-avatar size="large" v-else class="user-avatar">{{
                        user.CnName.substr(user.CnName.length - 2, 2)
                    }}</a-avatar>
                </div>
                <div class="content">
                    <div class="content-title">
                        {{ timeFix }}，{{ user.CnName }}<span class="welcome-text">，{{ welcome }}</span>
                    </div>
                    <div>{{ department }}</div>
                </div>
            </div>
        </template>
        <template v-slot:extraContent>
            <div class="extra-content">
                <div class="stat-item">
                    <a-statistic title="项目数" :value="56" />
                </div>
                <div class="stat-item">
                    <a-statistic title="团队内排名" :value="8" suffix="/ 24" />
                </div>
                <div class="stat-item">
                    <a-statistic title="项目访问" :value="2223" />
                </div>
            </div>
        </template>
        <a-row :gutter="24">
            <!-- 总销售额 -->
            <a-col :sm="24" :md="12" :xl="6">
                <chart-card :loading="loading" title="总销售额" :total="'¥' + formatDigital(126560, 2)">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div>
                        <trend flag="up" style="margin-right: 16px">
                            <span slot="term">周同比</span>
                            12%
                        </trend>
                        <trend flag="down">
                            <span slot="term">日同比</span>
                            11%
                        </trend>
                    </div>
                    <template slot="footer"
                        >日均销售额 <span>{{ '¥' + formatDigital(234.56, 2) }}</span></template
                    >
                </chart-card>
            </a-col>
            <!-- 访问量 -->
            <a-col :sm="24" :md="12" :xl="6">
                <chart-card :loading="loading" title="访问量" :total="formatDigital(8846.02)">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div style="margin-bottom: -10px">
                        <mini-area :value="miniAreaData" :Height="60" />
                    </div>
                    <template slot="footer"
                        >日访问量<span>{{ formatDigital(5623, 0) }}</span></template
                    >
                </chart-card>
            </a-col>
            <!-- 支付笔数 -->
            <a-col :sm="24" :md="12" :xl="6">
                <chart-card :loading="loading" title="支付笔数" :total="formatDigital(6560, 0)">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div style="margin-bottom: -10px">
                        <mini-bar :value="miniBarData" :Height="60" />
                    </div>
                    <template slot="footer">转化率<span>60%</span></template>
                </chart-card>
            </a-col>
            <!-- 客户满意度 -->
            <a-col :sm="24" :md="12" :xl="6">
                <chart-card :loading="loading" title="客户满意度" total="80">
                    <a-tooltip title="指标说明" slot="action">
                        <a-icon type="info-circle-o" />
                    </a-tooltip>
                    <div style="margin-bottom: -15px">
                        <mini-bullet :value="miniBulletData" :Height="60" />
                    </div>
                    <template slot="footer">
                        <trend flag="down" style="margin-right: 16px">
                            <span slot="term">周同比</span>
                            12%
                        </trend>
                        <trend flag="up">
                            <span slot="term">日同比</span>
                            80%
                        </trend>
                    </template>
                </chart-card>
            </a-col>
        </a-row>
        <a-row :gutter="20">
            <a-col :xs="24" :sm="12" :md="6" :lg="3" :xl="3" v-for="(item, index) in navList" :key="index">
                <router-link :to="item.link">
                    <a-card :bordered="false" hoverable :bodyStyle="{ textAlign: 'center' }">
                        <a-icon
                            :component="iconfontSvg(item.icon)"
                            :style="{ fontSize: '30px', color: item.color }"
                            v-if="item.icon && item.icon.includes('Icon')"
                        />
                        <a-icon
                            :type="iconfontSvg(item.icon)"
                            :style="{ fontSize: '30px', color: item.color }"
                            v-else-if="item.icon"
                        />
                        <p style="color: #303133; font-size: 16px; margin: 10px 0 0">{{ item.title }}</p>
                    </a-card>
                </router-link>
            </a-col>
        </a-row>
        <a-row :gutter="20">
            <a-col :sm="24" :md="12" :xl="10">
                <a-card :bordered="false" hoverable title="2020年9月编程语言排行榜TOP10">
                    <column-plot :value="columnPlotData" :Height="250"></column-plot>
                </a-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="14">
                <a-card :bordered="false" hoverable title="每月收支情况">
                    <Waterfall :Height="250" :value="WaterfallData"></Waterfall>
                </a-card>
            </a-col>
        </a-row>
        <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
                <a-card title="开发技术栈" hoverable>
                    <a-button type="primary" slot="extra"> egg.js+vue+antd-vue+mysql+redis </a-button>
                    <a-descriptions bordered :column="2">
                        <a-descriptions-item
                            :label="item.technology"
                            v-for="(item, index) in technologyStack"
                            :key="index"
                            >{{ item.version }}</a-descriptions-item
                        >
                    </a-descriptions>
                </a-card>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                <a-card title="Xmw Pro git日志" hoverable>
                    <a-timeline>
                        <a-timeline-item v-for="(item, index) in updateTime" :key="index">
                            <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px" />
                            <div class="describe">{{ item.describe }}</div>
                            <div class="timestamp" style="color: #909399; font-size: 13px">
                                {{ item.timestamp }}
                            </div>
                        </a-timeline-item>
                    </a-timeline>
                </a-card>
            </a-col>
        </a-row>
    </page-header-wrapper>
</template>

<script>
import { timeFix, filterDigital } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import columnPlot from './columnPlot'
import { ChartCard, Trend, MiniArea, MiniBar, MiniBullet, Waterfall } from '@/components'
import iconfont from '@/core/icons'
export default {
    name: 'WorkBench',
    components: {
        PageHeaderWrapper,
        columnPlot,
        ChartCard,
        Trend,
        MiniArea,
        MiniBar,
        MiniBullet,
        Waterfall,
    },
    data() {
        return {
            timeFix: timeFix(),
            avatar: '',
            user: {},
            columnPlotData: [
                {
                    language: 'C',
                    Ratings: 15.95,
                },
                {
                    language: 'java',
                    Ratings: 13.48,
                },
                {
                    language: 'Python',
                    Ratings: 10.47,
                },
                {
                    language: 'C++',
                    Ratings: 7.11,
                },
                {
                    language: 'C#',
                    Ratings: 4.58,
                },
                {
                    language: 'Visual Basic',
                    Ratings: 4.12,
                },
                {
                    language: 'javascript',
                    Ratings: 2.54,
                },
                {
                    language: 'PHP',
                    Ratings: 2.49,
                },
                {
                    language: 'R',
                    Ratings: 2.37,
                },
                {
                    language: 'SQL',
                    Ratings: 1.76,
                },
            ],
            miniAreaData: [
                {
                    time: '2021-01-01',
                    total: 264,
                },
                {
                    time: '2021-01-02',
                    total: 417,
                },
                {
                    time: '2021-01-03',
                    total: 438,
                },
                {
                    time: '2021-01-04',
                    total: 887,
                },
                {
                    time: '2021-01-05',
                    total: 309,
                },
                {
                    time: '2021-01-06',
                    total: 397,
                },
                {
                    time: '2021-01-07',
                    total: 550,
                },
                {
                    time: '2021-01-08',
                    total: 575,
                },
                {
                    time: '2021-01-09',
                    total: 430,
                },
                {
                    time: '2021-01-10',
                    total: 340,
                },
            ],

            miniBarData: [
                {
                    time: '2021-01-01',
                    total: 274,
                },
                {
                    time: '2021-01-02',
                    total: 337,
                },
                {
                    time: '2021-01-03',
                    total: 81,
                },
                {
                    time: '2021-01-04',
                    total: 497,
                },
                {
                    time: '2021-01-05',
                    total: 666,
                },
                {
                    time: '2021-01-06',
                    total: 219,
                },
                {
                    time: '2021-01-07',
                    total: 269,
                },
                {
                    time: '2021-01-08',
                    total: 342,
                },
                {
                    time: '2021-01-09',
                    total: 653,
                },
                {
                    time: '2021-01-10',
                    total: 185,
                },
            ],
            miniBulletData: [
                {
                    title: '满意度',
                    ranges: [40, 70, 100],
                    measures: [80],
                    target: 85,
                },
            ],
            technologyStack: [
                { technology: 'vue', version: '^2.6.10' },
                { technology: 'vue-i18n', version: '^8.17.4' },
                { technology: 'vuex', version: '^3.1.1' },
                { technology: 'vue-router', version: '^3.1.2' },
                { technology: 'ant-design-vue', version: '^1.7.2' },
                { technology: '@antv/g2plot', version: '^2.0.7' },
                { technology: 'egg', version: '^2.29.1' },
                { technology: 'egg-redis', version: '^2.4.0' },
                { technology: 'sequelize', version: '^5.21.3' },
                { technology: 'mysql2', version: '^2.1.0' },
            ],
            checkedTag: true,
            updateTime: [
                {
                    describe: '修改token验证中间件，前端给多标签页加上icon',
                    timestamp: ' 2021-01-20',
                },
                {
                    describe: '增加阿里icon图标，完善图标显示，优化代码，增加字典管理模块(开发中)',
                    timestamp: ' 2021-01-13',
                },
                {
                    describe: '优化验证码模块，优化路由切换过渡动画和keepAlive缓存失效的问题，增加外链',
                    timestamp: ' 2021-01-11',
                },
                {
                    describe: '增加用户二次登录检测，增加params参数集合中间件',
                    timestamp: ' 2020-12-30',
                },
                {
                    describe: '完成聊天室仿微信页面逻辑，配合egg.socket.io一对一发送',
                    timestamp: ' 2020-12-24',
                },
                {
                    describe: '完成自定义Vue指令页面开发，新增10个实用指令',
                    timestamp: ' 2020-12-17',
                },
                {
                    describe: '完成富文本编辑器和工作台模块的功能开发',
                    timestamp: ' 2020-12-16',
                },
                {
                    describe: '将SettingDrawer缓存到localstorage,新增用户标签拖拽功能',
                    timestamp: ' 2020-12-09',
                },
                {
                    describe: '新增锁屏和长时间不操作锁定功能',
                    timestamp: ' 2020-12-08',
                },
                {
                    describe: '完成公告发布socket监听和高级表格模块',
                    timestamp: '2020-11-27',
                },
                {
                    describe: '完善消息公告小铃铛逻辑',
                    timestamp: '2020-11-06',
                },
                {
                    describe: '增加路由搜索、全屏缩放、发布公告等功能',
                    timestamp: '2020-11-05',
                },
                {
                    describe: '完成动态路由权限和角色权限组模块的开发',
                    timestamp: '2020-09-23',
                },
                {
                    describe: '优化前端冗余组件和依赖,配置动态路由菜单',
                    timestamp: '2020-09-10',
                },
                {
                    describe: '接入egg后台和数据库,完成前期准备工作',
                    timestamp: '2020-09-05',
                },
                {
                    describe: '克隆antd-pro项目，着手二次开发',
                    timestamp: '2020-09-01',
                },
            ],
            navList: [
                {
                    title: '消息公告',
                    icon: 'notificationIcon',
                    link: '/integrated/announcement',
                    color: 'rgb(255, 133, 192)',
                },
                {
                    title: '组织架构',
                    icon: 'apartmentIcon',
                    link: '/integrated/organizational',
                    color: 'rgb(255, 156, 110)',
                },
                { title: '二维码', icon: 'qrcode', link: '/features/qrcode', color: 'rgb(179, 127, 235)' },
                { title: '高级表格', icon: 'table', link: '/integrated/seniorForms', color: 'rgb(92, 219, 211)' },
                { title: '个人中心', icon: 'idcard', link: '/personal/center', color: 'rgb(255, 133, 192)' },
                { title: '聊天室', icon: 'chatRoomIcon', link: '/features/chatRoom', color: 'rgb(255, 156, 110)' },
                { title: '阅读', icon: 'read', link: '/', color: 'rgb(105, 192, 255)' },
                { title: '休息一下', icon: 'coffee', link: '/', color: 'rgb(149, 222, 100)' },
            ],
            loading: false,
            WaterfallData: [
                { type: '日用品', money: 680 },
                { type: '伙食费', money: 900 },
                { type: '交通费', money: 430 },
                { type: '水电费', money: 360 },
                { type: '房租', money: 1200 },
                { type: '商场消费', money: 1000 },
                { type: '红包收入', money: -2000 },
            ],
        }
    },
    computed: {
        ...mapState({
            nickname: (state) => state.user.nickname,
            welcome: (state) => state.user.welcome,
        }),
        userInfo() {
            return this.$store.getters.userInfo
        },
        department() {
            let department = JSON.parse(JSON.stringify(this.user.department))
            return department.join('-')
        },
    },
    created() {
        this.user = this.userInfo
        this.avatar = this.userInfo.avatar
    },
    mounted() {},
    methods: {
        // 引用图表静态文件
        iconfontSvg(icon) {
            return iconfont[icon] || icon
        },
        // 格式化数字
        formatDigital(value, decimal) {
            return filterDigital(value, decimal)
        },
    },
}
</script>

<style lang="less" scoped>
@import './WorkBench.less';
@import '~@/components/index.less';
.ant-card /deep/ .ant-card-body {
    margin-bottom: 20px;
}
.user-avatar {
    background: @primary-color;
    /deep/ .ant-avatar-string {
        line-height: 68px;
        font-size: 30px;
    }
}
</style>
