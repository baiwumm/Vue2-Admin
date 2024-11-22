import 'ant-design-vue/dist/antd.less'
// import '@/components/use'
import './directives/action'

// base library
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import Vue from 'vue'
// ext library
import VueClipboard from 'vue-clipboard2'
import VueCropper from 'vue-cropper'

import MultiTab from '@/components/MultiTab'
import PageLoading from '@/components/PageLoading'

VueClipboard.config.autoSetContainer = true

Vue.use(Antd)
Vue.use(Viser)
Vue.use(MultiTab)
Vue.use(PageLoading)
Vue.use(VueClipboard)
Vue.use(VueCropper)

process.env.NODE_ENV !== 'production' && console.warn('[antd-pro] WARNING: Antd now use fulled imported.')
