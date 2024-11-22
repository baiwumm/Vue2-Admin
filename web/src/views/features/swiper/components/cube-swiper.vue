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
  name: 'CubeSwiper',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperOptions: {
        effect: 'cube',
        grabCursor: true,
        autoplay: true,
        cubeEffect: {
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94
        },
        loop: true,
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
