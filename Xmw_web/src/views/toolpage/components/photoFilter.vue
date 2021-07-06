<template>
    <div class="image-container">
        <div class="image" style="--clip-start: ellipse(0 0 at 0 0); --clip-end: ellipse(150% 150% at 0 0)">
            <img :src="require('@/assets/images/studio_0001.jpg')" /><img
                :src="require('@/assets/images/studio_0001.jpg')"
            />
        </div>
        <div class="image" style="--clip-start: inset(100% 0 0 0); --clip-end: inset(0 0 0 0)">
            <img :src="require('@/assets/images/studio_0002.jpg')" /><img
                :src="require('@/assets/images/studio_0002.jpg')"
            />
        </div>
        <div class="image" style="--clip-start: ellipse(0 0 at 100% 0); --clip-end: ellipse(150% 150% at 100% 0)">
            <img :src="require('@/assets/images/studio_0003.jpg')" /><img
                :src="require('@/assets/images/studio_0003.jpg')"
            />
        </div>
        <div
            class="image"
            style="
                --clip-start: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%);
                --clip-end: polygon(-50% 50%, 50% -50%, 150% 50%, 50% 150%);
            "
        >
            <img :src="require('@/assets/images/studio_0004.jpg')" /><img
                :src="require('@/assets/images/studio_0004.jpg')"
            />
        </div>
        <div class="image" style="--clip-start: circle(0); --clip-end: circle(125%)">
            <img :src="require('@/assets/images/studio_0005.jpg')" /><img
                :src="require('@/assets/images/studio_0005.jpg')"
            />
        </div>
        <div class="image" style="--clip-start: inset(100% 100% 100% 100%); --clip-end: inset(0 0 0 0)">
            <img :src="require('@/assets/images/studio_0006.jpg')" /><img
                :src="require('@/assets/images/studio_0006.jpg')"
            />
        </div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.image-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    width: 100%;
    grid-gap: 0.5rem;
}
.image-container .image {
    position: relative;
    padding-bottom: 100%;
}
.image-container .image img {
    height: 100%;
    width: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    left: 0;
    position: absolute;
    top: 0;
}
.image-container .image img:nth-of-type(1) {
    filter: grayscale(1) brightness(40%);
}
.image-container .image img:nth-of-type(2) {
    -webkit-clip-path: var(--clip-start);
    clip-path: var(--clip-start);
    transition: -webkit-clip-path 0.5s;
    transition: clip-path 0.5s;
    transition: clip-path 0.5s, -webkit-clip-path 0.5s;
}
.image-container .image:hover img:nth-of-type(2) {
    -webkit-clip-path: var(--clip-end);
    clip-path: var(--clip-end);
}
</style>