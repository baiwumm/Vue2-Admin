<template>
  <div @click="toggleFullscreen">
    <a-tooltip placement="bottom">
      <template slot="title"> {{ $t(`components.fullScreen.${isFullscreen ? 'exit' : 'title'}`) }} </template>
      <a-icon :type="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" style="font-size: 20px" />
    </a-tooltip>
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'FullScreen',
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    toggleFullscreen() {
      if (!screenfull.isEnabled) {
        return false
      }
      screenfull.toggle()
      this.isFullscreen = !this.isFullscreen
    }
  }
}
</script>

<style></style>
