<template>
    <page-header-wrapper content="收集了一些有趣常见的图片效果">
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
            <a-col :span="8">
                <a-card
                    hoverable
                    title="磨砂玻璃效果"
                    style="height: 25vw"
                    :bodyStyle="{
                        background: `url('${require('@/assets/images/studio_0002.jpg')}') 0 0/cover`,
                        height: 'calc(100% - 104px)',
                        width: 'calc(100% - 48px)',
                        margin: '24px 0 0 24px',
                    }"
                >
                    <div class="arenaceous">
                        <p>xmw-admin-xmw-pro</p>
                    </div>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card hoverable title="图片鼠标悬停过滤器" style="height: 25vw">
                    <photoFilter></photoFilter>
                </a-card>
            </a-col>
        </a-row>
    </page-header-wrapper>
</template>

<script>
import vabComparison from './components/comparison.vue'
import vabMagnifier from './components/magnifie.vue'
import photoCard from './components/photoCard.vue'
import photoFilter from './components/photoFilter.vue'
export default {
    name: 'pictureEffect',
    components: {
        vabComparison,
        vabMagnifier,
        photoCard,
        photoFilter,
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

<style lang="less" scoped>
/deep/ .ant-col {
    margin-bottom: 20px;
}
.arenaceous {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    margin: 0px auto;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    border-radius: 1rem;
    p {
        font-size: 2vw;
        font-family: Helvetica;
        color: #101010;
    }
}
</style>
