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
        <a-row :gutter="24">
            <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
                <a-card
                    class="project-list"
                    style="margin-bottom: 24px"
                    :bordered="false"
                    title="进行中的项目"
                    :body-style="{ padding: 0 }"
                >
                    <a slot="extra">全部项目</a>
                    <div>
                        <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in projects">
                            <a-card :bordered="false" :body-style="{ padding: 0 }">
                                <a-card-meta>
                                    <div slot="title" class="card-title">
                                        <a-avatar size="small" :src="item.cover" />
                                        <a>{{ item.title }}</a>
                                    </div>
                                    <div slot="description" class="card-description">
                                        {{ item.description }}
                                    </div>
                                </a-card-meta>
                                <div class="project-item">
                                    <a href="/#/">科学搬砖组</a>
                                    <span class="datetime">9小时前</span>
                                </div>
                            </a-card>
                        </a-card-grid>
                    </div>
                </a-card>
                <a-card title="动态" :bordered="false">
                    <a-list>
                        <a-list-item :key="index" v-for="(item, index) in activities">
                            <a-list-item-meta>
                                <a-avatar slot="avatar" :src="item.user.avatar" />
                                <div slot="title">
                                    <span>{{ item.user.nickname }}</span
                                    >&nbsp; 在&nbsp;<a href="#">{{ item.project.name }}</a
                                    >&nbsp; <span>{{ item.project.action }}</span
                                    >&nbsp;
                                    <a href="#">{{ item.project.event }}</a>
                                </div>
                                <div slot="description">{{ item.time }}</div>
                            </a-list-item-meta>
                        </a-list-item>
                    </a-list>
                </a-card>
            </a-col>
            <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-card
                    title="快速开始 / 便捷导航"
                    style="margin-bottom: 24px"
                    :bordered="false"
                    :body-style="{ padding: 0 }"
                >
                    <div class="item-group">
                        <a>操作一</a>
                        <a>操作二</a>
                        <a>操作三</a>
                        <a>操作四</a>
                        <a>操作五</a>
                        <a>操作六</a>
                        <a-button size="small" type="primary" ghost icon="plus">添加</a-button>
                    </div>
                </a-card>
                <a-card
                    title="XX 指数"
                    style="margin-bottom: 24px"
                    :bordered="false"
                    :body-style="{ paddingBottom: 30 }"
                >
                    <radar :value="radarData" :Height="355" />
                </a-card>
                <a-card title="团队" :bordered="false">
                    <div class="members">
                        <a-row>
                            <a-col :span="12" v-for="(item, index) in teams" :key="index">
                                <a>
                                    <a-avatar size="small" :src="item.avatar" />
                                    <span class="member">{{ item.name }}</span>
                                </a>
                            </a-col>
                        </a-row>
                    </div>
                </a-card>
            </a-col>
        </a-row>
    </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import Radar from '@/views/workbench/Radar'
export default {
    name: 'WorkBench',
    components: {
        PageHeaderWrapper,
        Radar,
    },
    data() {
        return {
            timeFix: timeFix(),
            avatar: '',
            user: {},
            linePlot: null,
            data: [
                { year: '1991', value: 3 },
                { year: '1992', value: 4 },
                { year: '1993', value: 3.5 },
                { year: '1994', value: 5 },
                { year: '1995', value: 4.9 },
                { year: '1996', value: 6 },
                { year: '1997', value: 7 },
                { year: '1998', value: 9 },
                { year: '1999', value: 13 },
            ],
            projects: [
                {
                    id: 1,
                    cover: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
                    title: 'Alipay',
                    description: '那是一种内在的东西， 他们到达不了，也无法触及的',
                    status: 1,
                    updatedAt: '2018-07-26 00:00:00',
                },
                {
                    id: 2,
                    cover: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
                    title: 'Angular',
                    description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
                    status: 1,
                    updatedAt: '2018-07-26 00:00:00',
                },
                {
                    id: 3,
                    cover: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
                    title: 'Ant Design',
                    description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
                    status: 1,
                    updatedAt: '2018-07-26 00:00:00',
                },
                {
                    id: 4,
                    cover: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
                    title: 'Ant Design Pro',
                    description: '那时候我只会想自己想要什么，从不想自己拥有什么',
                    status: 1,
                    updatedAt: '2018-07-26 00:00:00',
                },
                {
                    id: 5,
                    cover: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
                    title: 'Bootstrap',
                    description: '凛冬将至',
                    status: 1,
                    updatedAt: '2018-07-26 00:00:00',
                },
                {
                    id: 6,
                    cover: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
                    title: 'Vue',
                    description: '生命就像一盒巧克力，结果往往出人意料',
                    status: 1,
                    updatedAt: '2018-07-26 00:00:00',
                },
            ],
            activities: [
                {
                    id: 1,
                    user: {
                        nickname: '@name',
                        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                    },
                    project: {
                        name: '白鹭酱油开发组',
                        action: '更新',
                        event: '番组计划',
                    },
                    time: '2018-08-23 14:47:00',
                },
                {
                    id: 1,
                    user: {
                        nickname: '蓝莓酱',
                        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
                    },
                    project: {
                        name: '白鹭酱油开发组',
                        action: '更新',
                        event: '番组计划',
                    },
                    time: '2018-08-23 09:35:37',
                },
                {
                    id: 1,
                    user: {
                        nickname: '@name',
                        avatar: '@image(64x64)',
                    },
                    project: {
                        name: '白鹭酱油开发组',
                        action: '创建',
                        event: '番组计划',
                    },
                    time: '2017-05-27 00:00:00',
                },
                {
                    id: 1,
                    user: {
                        nickname: '曲丽丽',
                        avatar: '@image(64x64)',
                    },
                    project: {
                        name: '高逼格设计天团',
                        action: '更新',
                        event: '六月迭代',
                    },
                    time: '2018-08-23 14:47:00',
                },
                {
                    id: 1,
                    user: {
                        nickname: '@name',
                        avatar: '@image(64x64)',
                    },
                    project: {
                        name: '高逼格设计天团',
                        action: 'created',
                        event: '六月迭代',
                    },
                    time: '2018-08-23 14:47:00',
                },
                {
                    id: 1,
                    user: {
                        nickname: '曲丽丽',
                        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                    },
                    project: {
                        name: '高逼格设计天团',
                        action: 'created',
                        event: '六月迭代',
                    },
                    time: '2018-08-23 14:47:00',
                },
            ],
            radarData: [
                {
                    item: 'Design',
                    a: 70,
                    b: 30,
                },
                {
                    item: 'Development',
                    a: 60,
                    b: 70,
                },
                {
                    item: 'Marketing',
                    a: 50,
                    b: 60,
                },
                {
                    item: 'Users',
                    a: 40,
                    b: 50,
                },
                {
                    item: 'Test',
                    a: 60,
                    b: 70,
                },
                {
                    item: 'Language',
                    a: 70,
                    b: 50,
                },
                {
                    item: 'Technology',
                    a: 50,
                    b: 40,
                },
                {
                    item: 'Support',
                    a: 30,
                    b: 40,
                },
                {
                    item: 'Sales',
                    a: 60,
                    b: 40,
                },
                {
                    item: 'UX',
                    a: 50,
                    b: 60,
                },
            ],
            teams: [
                {
                    id: 1,
                    name: '科学搬砖组',
                    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                },
                {
                    id: 2,
                    name: '程序员日常',
                    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
                },
                {
                    id: 1,
                    name: '设计天团',
                    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
                },
                {
                    id: 1,
                    name: '中二少女团',
                    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
                },
                {
                    id: 1,
                    name: '骗你学计算机',
                    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
                },
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
.project-list {
    .card-title {
        font-size: 0;
        a {
            color: rgba(0, 0, 0, 0.85);
            margin-left: 12px;
            line-height: 24px;
            height: 24px;
            display: inline-block;
            vertical-align: top;
            font-size: 14px;
            &:hover {
                color: #1890ff;
            }
        }
    }
    .card-description {
        color: rgba(0, 0, 0, 0.45);
        height: 44px;
        line-height: 22px;
        overflow: hidden;
    }
    .project-item {
        display: flex;
        margin-top: 8px;
        overflow: hidden;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
        a {
            color: rgba(0, 0, 0, 0.45);
            display: inline-block;
            flex: 1 1 0;
            &:hover {
                color: #1890ff;
            }
        }
        .datetime {
            color: rgba(0, 0, 0, 0.25);
            flex: 0 0 auto;
            float: right;
        }
    }
}
.item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
        color: rgba(0, 0, 0, 0.65);
        display: inline-block;
        font-size: 14px;
        margin-bottom: 13px;
        width: 25%;
    }
}
.members {
    a {
        display: block;
        margin: 12px 0;
        line-height: 24px;
        height: 24px;
        .member {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            line-height: 24px;
            max-width: 100px;
            vertical-align: top;
            margin-left: 12px;
            transition: all 0.3s;
            display: inline-block;
        }
        &:hover {
            span {
                color: #1890ff;
            }
        }
    }
}
</style>
