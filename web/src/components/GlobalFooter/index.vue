<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a title="Vue3 Admin" href="https://github.com/baiwumm/vue3-admin/" target="_blank">Vue3 Admin</a>
      <a title="github" href="https://github.com/baiwumm/vue2-admin/" target="_blank"><a-icon type="github" /></a
      ><a title="Xmw Admin" href="https://github.com/baiwumm/react-admin/" target="_blank">React Admin</a>
    </template>
    <template v-slot:copyright>
      Copyright © {{ dayjs().year() }} by
      <a
        href="https://baiwumm.com/"
        target="_blank"
        style="color: rgba(0, 0, 0, 0.45); font-size: 14px; margin-left: 10px"
      >
        白雾茫茫丶
      </a>
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

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  },
  data() {
    return {
      dayjs
    }
  }
}
</script>
