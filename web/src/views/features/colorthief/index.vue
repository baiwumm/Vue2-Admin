<template>
  <page-header-wrapper :content="$t('views.features.colorthief.content')">
    <div ref="colorThiefRef" class="colorthief-container">
      <div v-for="i in 12" :key="i" class="imgbox">
        <img
          :src="imgs[i - 1]"
          :style="{
            opacity: hoverIndex === -1 ? 1 : hoverIndex === i ? 1 : 0.3,
            filter: `blur(${hoverIndex === -1 ? '0px' : hoverIndex === i ? '0px' : '1px'})`
          }"
          @mouseover="onMouseOver($event, i)"
          @mouseout="onMouseOut()"
        />
      </div>
    </div>
  </page-header-wrapper>
</template>
<script>
import ColorThief from 'colorthief'
import { map } from 'lodash'

import { getRandomImg } from '@/utils'
export default {
  data() {
    return {
      hoverIndex: -1,
      colorThief: new ColorThief(),
      imgs: getRandomImg(12)
    }
  },
  methods: {
    // 鼠标悬停回调
    onMouseOver(event, i) {
      this.hoverIndex = i
      const img = event.target
      let colors = this.colorThief.getPalette(img, 3)
      colors = map(colors, (c) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`)
      if (this.$refs.colorThiefRef) {
        this.$refs.colorThiefRef.style.setProperty('--c1', colors[0])
        this.$refs.colorThiefRef.style.setProperty('--c2', colors[1])
        this.$refs.colorThiefRef.style.setProperty('--c3', colors[2])
      }
    },
    // 鼠标移出回调
    onMouseOut() {
      this.hoverIndex = -1
      if (this.$refs.colorThiefRef) {
        this.$refs.colorThiefRef.style.setProperty('--c1', '#fff')
        this.$refs.colorThiefRef.style.setProperty('--c2', '#fff')
        this.$refs.colorThiefRef.style.setProperty('--c3', '#fff')
      }
    }
  },
  mounted() {
    this.onMouseOut()
  }
}
</script>
<style scoped lang="less">
@property --c1 {
  syntax: '<color>';
  initial-value: transparent;
  inherits: false;
}
@property --c2 {
  syntax: '<color>';
  initial-value: transparent;
  inherits: false;
}
@property --c3 {
  syntax: '<color>';
  initial-value: transparent;
  inherits: false;
}
.colorthief-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  border-radius: 6px;
  padding: 20px;
  background: linear-gradient(to bottom, var(--c1) 33%, var(--c2) 66%, var(--c3) 100%);
  animation: spread 0.35s ease-in forwards;
  transition-property: --c1, --c2, --c3;
  transition-duration: 0.35s;
  transition-timing-function: ease-in;
  height: calc(100vh - 322px);
  .imgbox {
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: 0.5s;
    border-radius: 5px;
    border: 4px solid transparent;
    img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      object-fit: cover;
    }
  }
  .imgbox:hover {
    filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.5));
    border-color: #fff;
    transform: scale(1.05);
  }
}
</style>
