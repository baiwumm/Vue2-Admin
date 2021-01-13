<template>
    <pro-layout
        :menus="menus"
        :collapsed="collapsed"
        :mediaQuery="query"
        :isMobile="isMobile"
        :handleMediaQuery="handleMediaQuery"
        :handleCollapse="handleCollapse"
        :i18nRender="i18nRender"
        v-bind="settings"
    >
        <setting-drawer :settings="settings" @change="handleSettingChange" />
        <template v-slot:menuHeaderRender>
            <div class="menu-logo" id="menu-logo">
                <img src="../assets/logo.svg" />
                <h1>{{ title }}</h1>
            </div>
        </template>
        <template v-slot:rightContentRender>
            <MultiTab
                v-if="settings.layout === 'topmenu'"
                style="position: absolute; left: 0; top: 64px"
                @update="reload"
            ></MultiTab>
            <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" />
        </template>
        <template v-slot:headerContentRender>
            <MultiTab @update="reload"></MultiTab>
        </template>
        <template v-slot:footerRender>
            <global-footer />
        </template>
        <!-- 路由切换过渡和缓存 -->
        <transition name="fade-transform" mode="out-in">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive && isRouterAlive" :key="key"></router-view>
            </keep-alive>
        </transition>
        <transition name="fade-transform" mode="out-in">
            <router-view v-if="!$route.meta.keepAlive && isRouterAlive" :key="key"></router-view
        ></transition>
        <!--这里是不会被缓存的组件-->
        <!-- 回到顶部 -->
        <div id="components-back-top-custom">
            <a-back-top>
                <div class="ant-back-top-inner">UP</div>
            </a-back-top>
        </div>
    </pro-layout>
</template>

<script>
import storage from 'store'
import { SettingDrawer, updateTheme } from '@ant-design-vue/pro-layout'
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import {
    TOGGLE_LAYOUT,
    TOGGLE_COLOR,
    TOGGLE_CONTENT_WIDTH,
    TOGGLE_NAV_THEME,
    CONTENT_WIDTH_TYPE,
    SIDEBAR_TYPE,
    TOGGLE_MOBILE_TYPE,
    TOGGLE_FIXED_HEADER,
    TOGGLE_FIXED_SIDEBAR,
    TOGGLE_WEAK,
} from '@/store/mutation-types'
import { MultiTab } from '@/components'
import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
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
                layout: storage.get(TOGGLE_LAYOUT) || defaultSettings.layout, // 'sidemenu', 'topmenu'
                // CONTENT_WIDTH_TYPE
                contentWidth:
                    storage.get(TOGGLE_CONTENT_WIDTH) || defaultSettings.layout === 'sidemenu'
                        ? CONTENT_WIDTH_TYPE.Fluid
                        : defaultSettings.contentWidth,
                // 主题 'dark' | 'light'
                theme: storage.get(TOGGLE_NAV_THEME) || defaultSettings.navTheme,
                // 主色调
                primaryColor: storage.get(TOGGLE_COLOR) || defaultSettings.primaryColor,
                fixedHeader: storage.get(TOGGLE_FIXED_HEADER) || defaultSettings.fixedHeader,
                fixSiderbar: storage.get(TOGGLE_FIXED_SIDEBAR) || defaultSettings.fixSiderbar,
                colorWeak: storage.get(TOGGLE_WEAK) || defaultSettings.colorWeak,

                hideHintAlert: false,
                hideCopyButton: false,
            },
            // 媒体查询
            query: {},

            // 是否手机模式
            isMobile: false,
            ops: {}, // 滚动条样式
            isRouterAlive: true,
        }
    },
    watch: {
        // 这里监听路由keepAlive变化,防止当路由从keepAlive的不同状态切换时，会出现页面重叠
        $route(to, from) {
            if (to.meta.keepAlive != from.meta.keepAlive) this.reload()
        },
    },
    computed: {
        ...mapState({
            // 动态主路由
            mainMenu: (state) => state.permission.addRouters,
        }),
        key() {
            return this.$route.fullPath
        },
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
            storage.set(type, value)
            type && (this.settings[type] = value)
            switch (type) {
                case 'contentWidth':
                    this.settings[type] = value
                    break
                case 'layout':
                    if (value === 'sidemenu' || value === 'topmenu') {
                        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
                    } else {
                        this.settings.fixSiderbar = false
                        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
                    }
                    break
            }
        },
        // 重载局部路由
        reload(e) {
            this.isRouterAlive = false
            setTimeout(() => {
                this.$nextTick(() => (this.isRouterAlive = true))
            }, 500)
        },
    },
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
@import './BasicLayout.less';
#components-back-top-custom .ant-back-top {
    bottom: 100px;
}
#components-back-top-custom .ant-back-top-inner {
    height: 40px;
    width: 40px;
    line-height: 40px;
    border-radius: 4px;
    background-color: @primary-color;
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
    display: flex !important;
    overflow: hidden;
    /deep/ .ant-layout-header {
        height: 92px;
    }
    /deep/ .ant-layout-header .ant-pro-global-header-content {
        position: absolute;
        width: 100%;
        display: block;
        height: 30px !important;
        line-height: 30px !important;
    }
}
.ant-layout.topmenu /deep/ .ant-layout-header {
    height: 92px;
    z-index: 88 !important;
}
.menu-logo {
    width: 100%;
    height: 100%;
    position: relative;
    h1 {
        margin-bottom: 0;
    }
}
.ant-layout-sider-dark .ant-pro-sider-menu-logo h1 {
    color: #fff;
}
.ant-pro-top-nav-header.dark h1 {
    color: #fff;
}
</style>
