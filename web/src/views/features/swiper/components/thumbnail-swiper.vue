<template>
  <div class="thumb-swiper">
    <swiper class="swiper gallery-top" :options="swiperOptionTop" ref="swiperTop">
      <swiper-slide v-for="i in 20" :key="i">
        <img :src="imgs[i - 1]" class="swiper-img" />
      </swiper-slide>
      <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
      <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
    </swiper>
    <!-- 缩略图 -->
    <swiper class="swiper gallery-thumbs" :options="swiperOptionThumbs" ref="swiperThumbs">
      <SwiperSlide v-for="i in 20" :key="i">
        <img :src="imgs[i - 1]" class="swiper-img" />
      </SwiperSlide>
    </swiper>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

import { getRandomImg } from '@/utils'
export default {
  name: 'ThumbnailSwiper',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperOptionTop: {
        loop: true,
        autoplay: true,
        loopedSlides: 5, // looped slides should be the same
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      swiperOptionThumbs: {
        loop: true,
        loopedSlides: 5, // looped slides should be the same
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true
      },
      imgs: getRandomImg(20)
    }
  },
  mounted() {
    this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop.$swiper
      const swiperThumbs = this.$refs.swiperThumbs.$swiper
      swiperTop.controller.control = swiperThumbs
      swiperThumbs.controller.control = swiperTop
    })
  }
}
</script>
<style lang="less" scoped>
.thumb-swiper {
  height: 320px;
}
.swiper {
  &.gallery-top {
    height: 80%;
    width: 100%;
  }
  &.gallery-thumbs {
    height: 20%;
    box-sizing: border-box;
    padding-top: 10px;
  }
  &.gallery-thumbs .swiper-slide {
    width: 25%;
    height: 100%;
    opacity: 0.4;
    cursor: pointer;
  }
  &.gallery-thumbs .swiper-slide-active {
    opacity: 1;
  }
}

.swiper-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
