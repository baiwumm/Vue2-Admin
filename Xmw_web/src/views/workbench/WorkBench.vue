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
    </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'

export default {
    name: 'WorkBench',
    components: {
        PageHeaderWrapper,
    },
    data() {
        return {
            timeFix: timeFix(),
            avatar: '',
            user: {},
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
