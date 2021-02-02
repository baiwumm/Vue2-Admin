<template>
    <page-header-wrapper
        content="瀑布流组件,支持瀑布流布局和无限滚动加载,相比其他实现方式，无需在返回的数据中指定图片的宽度和高度"
    >
        <div class="waterfall">
            <vue-waterfall-easy
                :imgsArr="imgsArr"
                @scrollReachBottom="fetchImgsData"
                hrefKey="link"
                ref="waterfall"
                linkRange="img"
                height="calc(100vh - 440px)"
            >
                <div slot="waterfall-over"><a-alert message="没有更多了!" type="success" /></div>
                <div class="img-info" slot-scope="props">
                    <p class="some-info">第{{ props.index + 1 }}张图片</p>
                    <p class="some-info">{{ props.value.info }}</p>
                </div>
                <div slot="loading">
                    <a-spin size="large" />
                </div>
            </vue-waterfall-easy>
        </div>
    </page-header-wrapper>
</template>

<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
export default {
    name: 'waterfall',
    components: {
        vueWaterfallEasy,
    },
    data() {
        return {
            imgsArr: [],
            fetchImgsArr: [
                {
                    src: require('@/assets/images/studio_0001.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
                {
                    src: require('@/assets/images/studio_0002.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
                {
                    src: require('@/assets/images/studio_0003.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
                {
                    src: require('@/assets/images/studio_0004.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
                {
                    src: require('@/assets/images/studio_0005.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
                {
                    src: require('@/assets/images/studio_0006.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
                {
                    src: require('@/assets/images/studio_0001.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
                {
                    src: require('@/assets/images/studio_0002.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
                {
                    src: require('@/assets/images/studio_0003.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
                {
                    src: require('@/assets/images/studio_0004.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
                {
                    src: require('@/assets/images/studio_0006.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
                {
                    src: require('@/assets/images/studio_0001.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
                {
                    src: require('@/assets/images/studio_0002.jpg'),
                    link: 'https://www.baidu.com/',
                    info: '图片描述信息',
                },
            ],
        }
    },
    methods: {
        initImgsArr() {
            this.imgsArr = this.imgsArr.concat(this.fetchImgsArr)
        },
        fetchImgsData() {
            if (this.imgsArr.length > 50) {
                this.$refs.waterfall.waterfallOver()
                return
            }
            setTimeout(() => {
                this.initImgsArr()
            }, 1000)
        },
    },
    mounted() {
        this.initImgsArr()
    },
}
</script>

<style lang="less" scoped>
.waterfall {
    width: 100%;
    .some-info {
        text-align: center;
        margin: 0;
        line-height: 25px;
    }
}
</style>
