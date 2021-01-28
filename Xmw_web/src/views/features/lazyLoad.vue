<template>
    <page-header-wrapper content="自定义一些实用的Vue指令，系统的按钮权限就是用了自定义的指令v-action控制。">
        <a-row :gutter="20">
            <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" v-for="(v, i) in 50" :key="i">
                <div class="lazy-img-cpntainer">
                    <div
                        class="img-waterMarker"
                        v-waterMarker="{ text: 'XmwPro版权所有', textColor: 'rgba(255, 255, 255,1)' }"
                    ></div>
                    <img
                        class="lazy-img"
                        v-LazyLoad="{
                            src: picLazyLoad,
                            callback: onCallback,
                        }"
                    />
                </div>
            </a-col>
        </a-row>
    </page-header-wrapper>
</template>

<script>
export default {
    name: 'lazyLoad',
    data() {
        return {
            picLazyLoad: require('@/assets/images/pic_zoom.jpg'),
        }
    },
    methods: {
        onCallback(el) {
            el.style.opacity = 1
            el.style.display = 'block'
        },
    },
}
</script>

<style lang="less" scoped>
.lazy-img-cpntainer {
    position: relative;
    margin-bottom: 20px;
    .img-waterMarker {
        position: absolute;
        width: 170px;
        height: 65px;
        top: 0;
        right: 0;
    }
    .lazy-img {
        height: 200px;
        width: 100%;
        opacity: 0;
        transition: opacity 1s;
    }
}
</style>