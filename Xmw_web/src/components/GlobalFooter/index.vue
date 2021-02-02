<template>
    <global-footer class="footer custom-render">
        <template v-slot:links>
            <a title="Antd vue" href="https://www.antdv.com/docs/vue/introduce-cn/" target="_blank">Antd vue</a>
            <a title="github" href="https://github.com/FollowTrend/vue-admin-xmw-pro" target="_blank"
                ><a-icon type="github" /></a
            ><a title="Antd pro vue" href="https://pro.antdv.com/" target="_blank">Antd pro vue</a>
        </template>
        <template v-slot:copyright> Copyright © 2020 vue-admin-xmw-pro by XieMingwei 843348394@qq.com </template>
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
