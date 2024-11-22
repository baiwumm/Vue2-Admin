<template>
  <page-header-wrapper>
    <a-row :gutter="[16, 16]">
      <!-- 方块 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <a-card :title="I18nSwiper('cube')">
          <cube-swiper />
        </a-card>
      </a-col>
      <!-- 翻转 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <a-card :title="I18nSwiper('flip')">
          <flip-swiper />
        </a-card>
      </a-col>
      <!-- 淡出 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
        <a-card :title="I18nSwiper('fade')">
          <fade-swiper />
        </a-card>
      </a-col>
      <!-- 3d流翻转 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <a-card :title="I18nSwiper('coverFlow')">
          <coverflow-swiper />
        </a-card>
      </a-col>
      <!-- 缩略图 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <a-card :title="I18nSwiper('thumbnail')">
          <thumbnail-swiper />
        </a-card>
      </a-col>
      <!-- 横向循环焦点图片展示 -->
      <a-col :span="24">
        <a-card :title="I18nSwiper('visual')">
          <visual-swiper />
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>
<script>
import { I18nSwiper } from '@/constant/i18n'

import CoverflowSwiper from './components/coverflow-swiper' // 3d流翻转
import CubeSwiper from './components/cube-swiper' // 方块
import FadeSwiper from './components/fade-swiper' // 淡出
import FlipSwiper from './components/flip-swiper' // 翻转
import ThumbnailSwiper from './components/thumbnail-swiper' // 缩略图
import VisualSwiper from './components/visual-swiper' // 横向循环焦点图片展示
export default {
  name: 'Swiper',
  components: {
    CubeSwiper,
    FlipSwiper,
    CoverflowSwiper,
    ThumbnailSwiper,
    FadeSwiper,
    VisualSwiper
  },
  data() {
    return {
      I18nSwiper
    }
  }
}
</script>
