<template>
    <div class="photoCard">
        <img :src="item" v-for="(item, index) in imgList" :key="index" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            imgList: [
                'https://www.jq22.com/demo/jquery-css3hover20151014/images/studio_0001.jpg',
                'https://www.jq22.com/demo/jquery-css3hover20151014/images/studio_0002.jpg',
                'https://www.jq22.com/demo/jquery-css3hover20151014/images/studio_0003.jpg',
                'https://www.jq22.com/demo/jquery-css3hover20151014/images/studio_0004.jpg',
                'https://www.jq22.com/demo/jquery-css3hover20151014/images/studio_0005.jpg',
                'https://www.jq22.com/demo/jquery-css3hover20151014/images/studio_0006.jpg',
                'https://www.jq22.com/demo/jquery-css3hover20151014/images/studio_0001.jpg',
            ],
        }
    },
}
</script>

<style lang="less" scoped>
.photoCard {
    position: relative;
    width: 90%;
    margin: 0 auto;
    img {
        position: absolute;
        transition: 0.5s all;
        width: 100%;
        background: #fff;
        padding: 5px;
    }
}
.photoCard:hover img {
    z-index: 1;
}
.photoCard:hover img:nth-child(1) {
    transform: rotate(10deg);
}
.photoCard:hover img:nth-child(2) {
    transform: rotate(-10deg);
}
.photoCard:hover img:nth-child(3) {
    transform: rotate(20deg);
}
.photoCard:hover img:nth-child(4) {
    transform: rotate(-20deg);
}
.photoCard:hover img:nth-child(5) {
    transform: rotate(30deg);
}
.photoCard:hover img:nth-child(6) {
    transform: rotate(-30deg);
}
.photoCard:hover img:nth-child(7) {
    transform: scale(0.9, 0.9);
}
</style>