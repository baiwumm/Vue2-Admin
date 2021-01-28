<template>
    <div @click="toggleFullscreen">
        <a-tooltip placement="bottom">
            <template slot="title"> 全屏 </template>
            <a-icon :type="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" style="font-size: 20px" />
        </a-tooltip>
    </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
    name: 'FullScreen',
    data() {
        return {
            isFullscreen: false,
        }
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

<style>
</style>