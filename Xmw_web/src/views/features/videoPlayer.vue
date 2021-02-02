<template>
    <page-header-wrapper content="基于vue开发的视频播放器组件">
        <a-row :gutter="20">
            <!-- 播放传统MP4 -->
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <a-card :bordered="false" hoverable title="播放传统MP4">
                    <video-mp4></video-mp4>
                </a-card>
            </a-col>
        </a-row>
    </page-header-wrapper>
</template>

<script>
import videoMp4 from './components/videoMp4'
export default {
    name: 'videoPlayer',
    components: {
        videoMp4,
    },
}
</script>

<style lang="less" scoped>
</style>