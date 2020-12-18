<template>
    <global-footer class="footer custom-render">
        <template v-slot:links>
            <a title="Antd vue" href="https://www.antdv.com/docs/vue/introduce-cn/">Antd vue</a>
            <a title="github" href="https://github.com/vueComponent/ant-design-vue-pro"><a-icon type="github" /></a
            ><a title="Antd pro vue" href="https://pro.antdv.com/">Antd pro vue</a>
        </template>
        <template v-slot:copyright> Copyright © 2020 Xmw-Pro by XieMingwei 843348394@qq.com </template>
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
