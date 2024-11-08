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
    <!-- 1.0.0+ 版本 pro-layout 提供 API，
          我们推荐使用这种方式进行 LOGO 和 title 自定义
    -->
    <template v-slot:menuHeaderRender>
      <div>
        <img src="@/assets/logo.svg" />
        <h1>{{ title }}</h1>
      </div>
    </template>
    <!-- 1.0.0+ 版本 pro-layout 提供 API,
          增加 Header 左侧内容区自定义
    -->
    <template v-slot:headerContentRender>
      <div>
        <a-tooltip :title="$t('views.layouts.reloadPage')">
          <a-icon type="reload" style="font-size: 16px; cursor: pointer" @click="reload" :spin="!isRouterAlive" />
        </a-tooltip>
      </div>
    </template>
    <!-- 主题设置 -->
    <setting-drawer :settings="settings" @change="handleSettingChange" />
    <template v-slot:rightContentRender>
      <multi-tab v-if="multiTab" @update="reload" />
      <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" />
    </template>
    <!-- custom footer / 自定义Footer -->
    <template v-slot:footerRender>
      <global-footer />
    </template>
    <!-- layout content -->
    <a-layout-content>
      <!-- 路由切换过渡和缓存 -->
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive && isRouterAlive" :key="key"></router-view>
        </keep-alive>
      </transition>
      <transition name="fade-transform" mode="out-in">
        <router-view v-if="!$route.meta.keepAlive && isRouterAlive" :key="key"></router-view>
      </transition>
    </a-layout-content>
  </pro-layout>
</template>

<script>
import { SettingDrawer, updateTheme } from '@ant-design-vue/pro-layout'
import storage from 'store'
import { mapState } from 'vuex'

import GlobalFooter from '@/components/GlobalFooter'
import RightContent from '@/components/GlobalHeader/RightContent'
import MultiTab from '@/components/MultiTab'
import defaultSettings from '@/config/defaultSettings'
import { i18nRender } from '@/locales'
import store from '@/store'
import {
  CONTENT_WIDTH_TYPE,
  SIDEBAR_TYPE,
  TOGGLE_COLOR,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR,
  TOGGLE_LAYOUT,
  TOGGLE_MOBILE_TYPE,
  TOGGLE_NAV_THEME,
  TOGGLE_WEAK
} from '@/store/mutation-types'

export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent,
    GlobalFooter,
    MultiTab
  },
  data() {
    return {
      multiTab: defaultSettings.multiTab,

      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: storage.get(TOGGLE_LAYOUT) || defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth: storage.get(TOGGLE_CONTENT_WIDTH) || defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: storage.get(TOGGLE_NAV_THEME) || defaultSettings.navTheme,
        // 主色调
        primaryColor: storage.get(TOGGLE_COLOR) || defaultSettings.primaryColor,
        fixedHeader: storage.get(TOGGLE_FIXED_HEADER) || defaultSettings.fixedHeader,
        fixSiderbar: storage.get(TOGGLE_FIXED_SIDEBAR) || defaultSettings.fixSiderbar,
        colorWeak: storage.get(TOGGLE_WEAK) || defaultSettings.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false,
      // 是否缓存
      isRouterAlive: true
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: (state) => state.permission.addRouters
    }),
    key() {
      return this.$route.fullPath
    }
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
      console.log('type', type)
      console.log('value', value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value
          store.commit(TOGGLE_CONTENT_WIDTH, value)
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
          }
          store.commit(TOGGLE_LAYOUT, value)
          break
        case 'primaryColor':
          store.commit(TOGGLE_COLOR, value)
          break
        case 'theme':
          store.commit(TOGGLE_NAV_THEME, value)
          break
      }
    },
    // 重载局部路由
    reload() {
      this.isRouterAlive = false
      setTimeout(() => {
        this.$nextTick(() => (this.isRouterAlive = true))
      }, 500)
    }
  }
}
</script>

<style lang="less">
@import './BasicLayout.less';
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
</style>
