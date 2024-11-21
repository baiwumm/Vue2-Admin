<template>
  <page-header-wrapper>
    <a-button slot="extra" type="primary" href="https://github.com/mirari/v-viewer" target="_blank">v-viewer</a-button>
    <a-card>
      <div v-viewer class="img-container">
        <img v-for="img in getRandomImg(20)" :key="img" :src="img" />
      </div>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import 'viewerjs/dist/viewer.css'

import VueViewer from 'v-viewer'
import Vue from 'vue'

import { getRandomImg } from '@/utils'
Vue.use(VueViewer)
export default {
  name: 'Viewer',
  data() {
    return {
      getRandomImg
    }
  }
}
</script>
<style lang="less" scoped>
.img-container {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  img {
    width: 100%;
    height: 250px;
    cursor: pointer;
    border-radius: 4px;
    object-fit: cover;
  }
}
</style>
