<template>
    <global-footer class="footer custom-render">
        <template v-slot:links>
            <a title="Antd vue" href="https://www.antdv.com/docs/vue/introduce-cn/" target="_blank"
                >Ant Design of Vue</a
            >
            <a title="github" href="https://github.com/FollowTrend/vue-admin-xmw-pro" target="_blank"
                ><a-icon type="github" /></a
            ><a title="Antd pro vue" href="https://pro.antdv.com/" target="_blank">Ant Design Pro of Vue</a>
        </template>
        <template v-slot:copyright>
            Copyright © 2021 vue-admin-xmw-pro by 843348394@qq.com
            <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                style="color: rgba(0, 0, 0, 0.45); font-size: 14px; margin-left: 10px"
            >
                粤ICP备2021126986号-1
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
