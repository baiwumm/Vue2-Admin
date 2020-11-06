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
        <a-row :gutter="16">
            <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
                <a-card>
                    <line-Echart :value="data" :Height="300"></line-Echart>
                </a-card>
            </a-col>
        </a-row>
    </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import lineEchart from '@/views/workbench/g2plot'
export default {
    name: 'WorkBench',
    components: {
        PageHeaderWrapper,
        lineEchart,
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
</style>
