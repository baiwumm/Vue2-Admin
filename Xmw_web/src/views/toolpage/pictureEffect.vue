<template>
    <page-header-wrapper content="嵌套路由的展示和图片的一些小功能">
        <a-row :gutter="16">
            <a-col :span="8">
                <a-card hoverable title="图片滑块对比" style="height: 25vw">
                    <vab-comparison
                        :id="comparison.id"
                        :width="comparison.width"
                        :height="comparison.height"
                        :src1="comparison.src1"
                        :src2="comparison.src2"
                    ></vab-comparison>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card hoverable title="图片放大镜" style="height: 25vw">
                    <vab-magnifier :url="piczoom" type="square"></vab-magnifier>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card hoverable title="图片散开动画" style="height: 25vw">
                    <photo-card></photo-card>
                </a-card>
            </a-col>
        </a-row>
    </page-header-wrapper>
</template>

<script>
import vabComparison from './components/comparison.vue'
import vabMagnifier from './components/magnifie.vue'
import photoCard from './components/photoCard.vue'
export default {
    name: 'pictureEffect',
    components: {
        vabComparison,
        vabMagnifier,
        photoCard,
    },
    data() {
        return {
            comparison: {
                id: 'vabComparison',
                width: '100%',
                height: 'auto',
                src1: require('@/assets/images/pic_1.jpg'),
                src2: require('@/assets/images/pic_2.jpg'),
            },
            piczoom: require('@/assets/images/pic_zoom.jpg'),
        }
    },
}
</script>

<style>
</style>
