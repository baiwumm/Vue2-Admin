<template>
  <swiper :options="swiperOptions">
    <swiper-slide v-for="i in 8" :key="i">
      <img :src="imgs[i - 1]" class="swiper-img" />
    </swiper-slide>
    <div class="swiper-pagination swiper-pagination-white" slot="pagination"></div>
    <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
    <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
  </swiper>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

import { getRandomImg } from '@/utils'
export default {
  name: 'FadeSwiper',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperOptions: {
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        speed: 500,
        spaceBetween: 30,
        effect: 'fade',
        loop: true, // 必须
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      imgs: getRandomImg(8)
    }
  }
}
</script>
<style lang="less" scoped>
.swiper-container {
  width: 320px;
  height: 320px;
}
.swiper-slide img {
  width: 100%;
  height: auto;
  min-height: 100%;
  transition: 1s linear 2s;
  transform: scale(1.1, 1.1);
}
.swiper-slide-active img,
.swiper-slide-duplicate-active img {
  transition: 6s linear;
  transform: scale(1, 1);
}
.swiper-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
