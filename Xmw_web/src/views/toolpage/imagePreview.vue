<template>
    <page-header-wrapper content="基于v-viewer的图像预览">
        <a-alert message="点击图像预览大图像" type="info" show-icon closable />
        <a-row :gutter="16">
            <img
                :src="item"
                v-for="(item, index) in imgList"
                :key="index"
                style="width: 300px; margin: 20px 10px 0; cursor: pointer"
                @click="previewImgObject(imgList, index)"
            />
        </a-row>
    </page-header-wrapper>
</template>

<script>
import 'viewerjs/dist/viewer.css' // 图片预览插件
import { api as viewerApi } from 'v-viewer'
export default {
    name: 'imagePreview',
    data() {
        return {
            imgList: [
                require('@/assets/images/studio_0001.jpg'),
                require('@/assets/images/studio_0002.jpg'),
                require('@/assets/images/studio_0003.jpg'),
                require('@/assets/images/studio_0004.jpg'),
                require('@/assets/images/studio_0005.jpg'),
                require('@/assets/images/studio_0006.jpg'),
                require('@/assets/images/studio_0001.jpg'),
                require('@/assets/images/studio_0002.jpg'),
                require('@/assets/images/studio_0003.jpg'),
                require('@/assets/images/studio_0004.jpg'),
            ],
        }
    },
    methods: {
        // 图片预览
        previewImgObject(images, index) {
            viewerApi({
                options: {
                    toolbar: true,
                    initialViewIndex: index,
                },
                images: images,
            })
        },
    },
}
</script>

<style lang="less" scoped>
</style>
