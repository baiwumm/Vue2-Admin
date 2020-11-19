<template>
    <pro-layout
        :title="title"
        :menus="menus"
        :collapsed="collapsed"
        :mediaQuery="query"
        :isMobile="isMobile"
        :handleMediaQuery="handleMediaQuery"
        :handleCollapse="handleCollapse"
        :logo="logoRender"
        :i18nRender="i18nRender"
        v-bind="settings"
    >
        <setting-drawer :settings="settings" @change="handleSettingChange" />
        <template v-slot:rightContentRender>
            <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" />
        </template>
        <template v-slot:headerContentRender>
            <MultiTab></MultiTab>
        </template>
        <template v-slot:footerRender>
            <global-footer />
        </template>
        <transition name="fade-transform" mode="out-in">
            <keep-alive v-if="$route.meta.keepAlive">
                <router-view></router-view>
            </keep-alive>
            <router-view v-else></router-view>
        </transition>
        <!-- 回到顶部 -->
        <div id="components-back-top-custom">
            <a-back-top>
                <div class="ant-back-top-inner">UP</div>
            </a-back-top>
        </div>
    </pro-layout>
</template>

<script>
import { SettingDrawer, updateTheme } from '@ant-design-vue/pro-layout'
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import { CONTENT_WIDTH_TYPE, SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'
import { MultiTab } from '@/components'
import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import LogoSvg from '../assets/logo.svg?inline'
export default {
    name: 'BasicLayout',
    components: {
        SettingDrawer,
        RightContent,
        GlobalFooter,
        MultiTab,
    },
    data() {
        return {
            // preview.pro.antdv.com only use.
            isProPreviewSite: process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
            // end

            // base
            menus: [],
            // 侧栏收起状态
            collapsed: false,
            title: defaultSettings.title,
            settings: {
                // 布局类型
                layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
                // CONTENT_WIDTH_TYPE
                contentWidth:
                    defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,
                // 主题 'dark' | 'light'
                theme: defaultSettings.navTheme,
                // 主色调
                primaryColor: defaultSettings.primaryColor,
                fixedHeader: defaultSettings.fixedHeader,
                fixSiderbar: defaultSettings.fixSiderbar,
                colorWeak: defaultSettings.colorWeak,

                hideHintAlert: false,
                hideCopyButton: false,
            },
            // 媒体查询
            query: {},

            // 是否手机模式
            isMobile: false,
            ops: {}, // 滚动条样式
        }
    },
    computed: {
        ...mapState({
            // 动态主路由
            mainMenu: (state) => state.permission.addRouters,
        }),
    },
    created() {
        const routes = this.mainMenu.find((item) => item.path === '/')
        this.menus = (routes && routes.children) || []
        // 处理侧栏收起状态
        this.$watch('collapsed', () => {
            this.$store.commit(SIDEBAR_TYPE, this.collapsed)
        })
        this.$watch('isMobile', () => {
            this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
        })
    },
    mounted() {
        const userAgent = navigator.userAgent
        if (userAgent.indexOf('Edge') > -1) {
            this.$nextTick(() => {
                this.collapsed = !this.collapsed
                setTimeout(() => {
                    this.collapsed = !this.collapsed
                }, 16)
            })
        }

        // first update color
        // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
        if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
            updateTheme(this.settings.primaryColor)
        }
    },
    methods: {
        i18nRender,
        handleMediaQuery(val) {
            this.query = val
            if (this.isMobile && !val['screen-xs']) {
                this.isMobile = false
                return
            }
            if (!this.isMobile && val['screen-xs']) {
                this.isMobile = true
                this.collapsed = false
                this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
                // this.settings.fixSiderbar = false
            }
        },
        handleCollapse(val) {
            this.collapsed = val
        },
        handleSettingChange({ type, value }) {
            console.log('type', type, value)
            type && (this.settings[type] = value)
            switch (type) {
                case 'contentWidth':
                    this.settings[type] = value
                    break
                case 'layout':
                    if (value === 'sidemenu') {
                        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
                    } else {
                        this.settings.fixSiderbar = false
                        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
                    }
                    break
            }
        },
        logoRender() {
            return <LogoSvg />
        },
    },
}
</script>

<style lang="less" scoped>
@import './BasicLayout.less';
#components-back-top-custom .ant-back-top {
    bottom: 100px;
}
#components-back-top-custom .ant-back-top-inner {
    height: 40px;
    width: 40px;
    line-height: 40px;
    border-radius: 4px;
    background-color: #1088e9;
    color: #fff;
    text-align: center;
    font-size: 20px;
}
.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all 0.5s;
}

.fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
.ant-layout {
    /deep/ .ant-layout-header {
        height: 92px;
    }
    /deep/ .ant-layout-header .ant-pro-global-header-content {
        position: absolute;
        bottom: -29px;
        width: 100%;
    }
}
.ant-layout.topmenu /deep/ .ant-layout-header {
    height: 64px;
}
</style>
