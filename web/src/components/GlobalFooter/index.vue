<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a title="Vue3 Admin" href="https://github.com/baiwumm/Vue3-Admin/" target="_blank">Vue3 Admin</a>
      <a title="github" href="https://github.com/baiwumm/Vue2-Admin/" target="_blank"><a-icon type="github" /></a
      ><a title="Xmw Admin" href="https://github.com/baiwumm/Xmw-Admin/" target="_blank">Xmw Admin</a>
    </template>
    <template v-slot:copyright>
      Copyright © {{ dayjs().year() }} {{ defaultSettings.title }} by {{ pkg.author.email }}
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        style="color: rgba(0, 0, 0, 0.45); font-size: 14px; margin-left: 10px"
      >
        粤ICP备2023007649号
      </a></template
    >
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'
import dayjs from 'dayjs'

import defaultSettings from '@/config/defaultSettings'

import pkg from '../../../package.json'
export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  },
  data() {
    return {
      dayjs,
      defaultSettings,
      pkg
    }
  }
}
</script>
