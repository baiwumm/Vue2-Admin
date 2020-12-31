<template>
    <page-header-wrapper>
        <template v-slot:content>
            <div class="page-header-content">
                <div class="avatar">
                    <a-avatar size="large" :src="user.avatar" />
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
        <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <a-card :bordered="false" hoverable title="2020年9月编程语言排行榜TOP10">
                    <column-plot :value="columnPlotData" :Height="177"></column-plot>
                </a-card>
            </a-col>
            <a-col :xs="24" :sm="12" :md="6" :lg="3" :xl="3" v-for="(item, index) in navList" :key="index">
                <router-link :to="item.link">
                    <a-card :bordered="false" hoverable :bodyStyle="{ textAlign: 'center', height: '130px' }">
                        <a-icon :type="item.icon" :style="{ color: item.color, fontSize: '50px' }" />
                        <p style="color: #303133; font-size: 16px; margin-top: 10px">{{ item.title }}</p>
                    </a-card>
                </router-link>
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
                <a-card title="更新日志" hoverable>
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
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import columnPlot from './columnPlot'
export default {
    name: 'WorkBench',
    components: {
        PageHeaderWrapper,
        columnPlot,
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
            technologyStack: [
                { technology: 'vue', version: '^2.6.10' },
                { technology: 'vue-i18n', version: '^8.17.4' },
                { technology: 'vuex', version: '^3.1.1' },
                { technology: 'vue-router', version: '^3.1.2' },
                { technology: 'ant-design-vue', version: '^1.6.5' },
                { technology: '@antv/g2plot', version: '^2.0.7' },
                { technology: 'egg', version: '^2.29.1' },
                { technology: 'egg-redis', version: '^2.4.0' },
                { technology: 'sequelize', version: '^5.21.3' },
                { technology: 'mysql2', version: '^2.1.0' },
            ],
            checkedTag: true,
            updateTime: [
                {
                    describe: '部署上线，持续开发更新中...',
                    timestamp: '2021-01-01',
                },
                {
                    describe: '修改动态路由加载BUG，优化逻辑',
                    timestamp: '2020-09-30',
                },
                {
                    describe: '完善个人中心模块功能逻辑',
                    timestamp: '2020-09-24',
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
                { title: '公告', icon: 'sound', link: '/integrated/announcement', color: 'rgb(255, 133, 192)' },
                { title: '架构', icon: 'team', link: '/integrated/organizational', color: 'rgb(255, 156, 110)' },
                { title: '二维码', icon: 'qrcode', link: '/features/qrcode', color: 'rgb(179, 127, 235)' },
                { title: '表格', icon: 'table', link: '/integrated/seniorForms', color: 'rgb(92, 219, 211)' },
                { title: '阅读', icon: 'read', link: '/', color: 'rgb(105, 192, 255)' },
                { title: '休息一下', icon: 'coffee', link: '/', color: 'rgb(149, 222, 100)' },
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
            let sectorJobs = JSON.parse(JSON.stringify(this.user.SectorJobs))
            return sectorJobs.join('-')
        },
    },
    created() {
        this.user = this.userInfo
        this.avatar = this.userInfo.avatar
    },
    mounted() {},
    methods: {},
}
</script>

<style lang="less" scoped>
@import './WorkBench.less';
.ant-card /deep/ .ant-card-body {
    margin-bottom: 20px;
}
</style>
