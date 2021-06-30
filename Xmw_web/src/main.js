import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import vuedraggable from 'vuedraggable'
Vue.component("vuedraggable", vuedraggable);

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // 动态路由权限控制
import './global.less'

import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
    debug: false,
    connection: 'http://www.xmwpro.com/'
}))

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
    router,
    store,
    i18n,
    created: bootstrap,
    render: h => h(App)
}).$mount('#app')
