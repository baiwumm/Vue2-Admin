<template>
    <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" :playsinline="true">
    </video-player>
</template>

<script>
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import { videoPlayer } from 'vue-video-player'
export default {
    components: {
        videoPlayer,
    },
    data() {
        return {
            // videojs options
            playerOptions: {
                autoplay: true,
                muted: true,
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [
                    {
                        type: 'video/mp4',
                        src: 'https://cdn.jsdelivr.net/gh/chuzhixin/videos@master/video.mp4',
                    },
                ],
            },
        }
    },
    mounted() {
        setTimeout(() => {
            this.player.muted(false) //控制视频播放暂停
        }, 1000)
    },
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        },
    },
}
</script>