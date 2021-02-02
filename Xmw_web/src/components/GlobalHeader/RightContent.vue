<template>
    <div :class="wrpCls">
        <!-- 头部搜索框 -->
        <header-search v-if="!isMobile"></header-search>
        <!-- 锁屏 -->
        <lock-screen :class="prefixCls"></lock-screen>
        <!-- 公告详情 -->
        <header-announcement v-if="!isMobile" :prefixCls="prefixCls"></header-announcement>
        <!-- 全屏 -->
        <full-screen :class="prefixCls" v-if="!isMobile"></full-screen>
        <!-- 头像下拉 -->
        <avatar-dropdown :class="prefixCls" ref="avatar" />
        <!-- 国际化语言 -->
        <select-lang :class="prefixCls" />
        <!-- 睡眠操作 -->
        <lock-sleep></lock-sleep>
    </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import LockSleep from './LockSleep'
import { HeaderSearch, LockScreen, FullScreen, HeaderAnnouncement, SelectLang } from '@/components'
export default {
    name: 'RightContent',
    components: {
        AvatarDropdown,
        LockSleep,
        SelectLang,
        HeaderSearch,
        LockScreen,
        FullScreen,
        HeaderAnnouncement,
    },
    props: {
        prefixCls: {
            type: String,
            default: 'ant-pro-global-header-index-action',
        },
        isMobile: {
            type: Boolean,
            default: () => false,
        },
        topMenu: {
            type: Boolean,
            required: true,
        },
        theme: {
            type: String,
            required: true,
        },
    },
    computed: {
        wrpCls() {
            return {
                'ant-pro-global-header-index-right': true,
                [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true,
            }
        },
    },
}
</script>
<style lang="less" scoped>
.ant-pro-global-header-index-dark {
    .ant-pro-global-header-index-action {
        color: hsla(0, 0%, 100%, 0.85);
    }
}
</style>

