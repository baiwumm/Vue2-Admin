<template>
  <swiper :options="swiperOptions">
    <swiper-slide v-for="i in 8" :key="i">
      <img :src="imgs[i - 1]" class="swiper-img" />
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
    <div class="swiper-button-next" slot="button-next"></div>
    <div class="swiper-button-prev" slot="button-prev"></div>
  </swiper>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

import { getRandomImg } from '@/utils'
export default {
  name: 'VisualSwiper',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperOptions: {
        watchSlidesProgress: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: true,
        loopAdditionalSlides: 5,
        autoplay: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        on: {
          progress: function (progress) {
            for (let i = 0; i < this.slides.length; i++) {
              const slide = this.slides.eq(i)
              const slideProgress = this.slides[i].progress
              let modify = 1
              if (Math.abs(slideProgress) > 1) {
                modify = (Math.abs(slideProgress) - 1) * 0.3 + 1
              }
              const translate = slideProgress * modify * 260 + 'px'
              const scale = 1 - Math.abs(slideProgress) / 5
              const zIndex = 999 - Math.abs(Math.round(10 * slideProgress))
              slide.transform('translateX(' + translate + ') scale(' + scale + ')')
              slide.css('zIndex', zIndex)
              slide.css('opacity', 1)
              if (Math.abs(slideProgress) > 3) {
                slide.css('opacity', 0)
              }
            }
          },
          setTransition: function (transition) {
            for (let i = 0; i < this.slides.length; i++) {
              const slide = this.slides.eq(i)
              slide.transition(transition)
            }
          }
        }
      },
      imgs: getRandomImg(8)
    }
  }
}
</script>
<style lang="less" scoped>
.swiper-container {
  padding-bottom: 40px;
}
.swiper-slide {
  width: 600px;
  height: 450px;
}
.swiper-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
