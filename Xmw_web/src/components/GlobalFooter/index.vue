<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a
        title="Vue3 Admin"
        href="https://vue3.baiwumm.com/"
        target="_blank"
      >Vue3 Admin</a
      >
      <a
        title="github"
        href="https://github.com/baiwumm/Vue2-Admin/"
        target="_blank"
      ><a-icon type="github" /></a
      ><a title="Xmw Admin" href="https://react.baiwumm.com/" target="_blank">Xmw Admin</a>
    </template>
    <template v-slot:copyright>
      Copyright © 2021 Vue2 Admin by 843348394@qq.com
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        style="color: rgba(0, 0, 0, 0.45); font-size: 14px; margin-left: 10px"
      >
        粤ICP备2023007649号-2
      </a></template
    >
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
    name: 'ProGlobalFooter',
    components: {
        GlobalFooter,
    },
}
</script>
