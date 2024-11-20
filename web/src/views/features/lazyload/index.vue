<template>
  <page-header-wrapper :content="$t('views.features.lazyload.content')">
    <div :style="{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }">
      <div v-for="i in 50" :key="i" class="lazy-img-cpntainer">
        <img
          v-lazyLoad="{
            src: getRandomImg(),
            callback: onCallback
          }"
          class="lazy-img"
        />
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import { getRandomImg } from '@/utils'
export default {
  name: 'LazyLoad',
  data() {
    return {
      getRandomImg
    }
  },
  methods: {
    onCallback(el) {
      el.style.opacity = 1
      el.style.display = 'block'
    }
  },
  mounted() {
    window.scrollTo(0, 0)
  }
}
</script>

<style lang="less" scoped>
.lazy-img-cpntainer {
  position: relative;
  .lazy-img {
    height: 250px;
    width: 100%;
    cursor: pointer;
    border-radius: 4px;
    object-fit: cover;
    opacity: 0;
    transition: opacity 2s;
  }
}
</style>
