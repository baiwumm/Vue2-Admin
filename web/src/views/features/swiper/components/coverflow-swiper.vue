<template>
  <swiper :options="swiperOptions">
    <swiper-slide v-for="i in 8" :key="i">
      <img :src="imgs[i - 1]" class="swiper-img" />
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

import { getRandomImg } from '@/utils'
export default {
  name: 'CoverflowSwiper',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperOptions: {
        effect: 'coverflow',
        grabCursor: true,
        loop: true,
        autoplay: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      },
      imgs: getRandomImg(8)
    }
  }
}
</script>
<style lang="less" scoped>
.swiper-slide {
  width: 320px;
  height: 320px;
}
.swiper-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
