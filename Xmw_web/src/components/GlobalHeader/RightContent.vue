<template>
    <div :class="wrpCls">
        <div :class="prefixCls">
            <a-icon type="search" style="font-size: 20px" />
        </div>
        <div :class="prefixCls">
            <a-input-search placeholder="input search text" style="width: 200px" />
        </div>
        <div :class="prefixCls">
            <a-badge count="5">
                <a-icon type="bell" style="font-size: 20px" />
            </a-badge>
        </div>
        <div :class="prefixCls" @click="toggleFullscreen">
            <a-icon :type="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" style="font-size: 20px" />
        </div>
        <avatar-dropdown :menu="showMenu" :class="prefixCls" />
        <select-lang :class="prefixCls" />
    </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import screenfull from 'screenfull'
export default {
    name: 'RightContent',
    components: {
        AvatarDropdown,
        SelectLang,
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
    data() {
        return {
            showMenu: true,
            isFullscreen: false,
        }
    },
    computed: {
        wrpCls() {
            return {
                'ant-pro-global-header-index-right': true,
                [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true,
            }
        },
    },
    methods: {
        toggleFullscreen() {
            if (!screenfull.isEnabled) {
                this.$notification.warning({
                    message: '警告',
                    description: `您的浏览器不支持全屏!`,
                })
                return false
            }
            screenfull.toggle()
            this.isFullscreen = !this.isFullscreen
        },
    },
}
</script>
