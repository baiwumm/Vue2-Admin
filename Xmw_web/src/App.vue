<template>
    <a-config-provider :locale="locale">
        <div id="app">
            <router-view></router-view>
        </div>
    </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/util'
import { i18nRender } from '@/locales'
export default {
    computed: {
        locale() {
            // 只是为了切换语言时，更新标题
            const { title } = this.$route.meta
            title && setDocumentTitle(`${i18nRender(title)} - ${domTitle}`)

            return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
        },
    },
}
</script>
<style lang="less">
@import '~@/components/index.less';
::-webkit-scrollbar {
    width: 6px;
    height: 3px;
}

::-webkit-scrollbar-thumb {
    background-color: @primary-color;
    background-clip: padding-box;
    min-height: 100px;
}

::-webkit-scrollbar-track {
    width: 3px;
    background-color: #f9f9f9;
}
</style>
