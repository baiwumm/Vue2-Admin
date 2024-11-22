<template>
  <swiper :options="swiperOptions">
    <swiper-slide v-for="i in 8" :key="i">
      <img :src="imgs[i - 1]" class="swiper-img" />
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>
  </swiper>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

import { getRandomImg } from '@/utils'
export default {
  name: 'FlipSwiper',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperOptions: {
        effect: 'flip',
        grabCursor: true,
        loop: true,
        autoplay: true,
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
.swiper-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
