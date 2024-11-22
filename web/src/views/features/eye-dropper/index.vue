<template>
  <page-header-wrapper :content="I18nEyeDropper('content')">
    <a-card>
      <a-space direction="vertical">
        <a-button type="primary" @click="handleEyeDropper">{{ I18nEyeDropper('open') }}</a-button>
        <a-tag :color="color">
          {{ color }}
        </a-tag>
      </a-space>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import storage from 'store'

import { I18nEyeDropper } from '@/constant/i18n'
import { TOGGLE_COLOR } from '@/store/mutation-types'
export default {
  name: 'EyeDropper',
  data() {
    return {
      I18nEyeDropper,
      color: storage.get(TOGGLE_COLOR)
    }
  },
  methods: {
    async handleEyeDropper() {
      if (!('EyeDropper' in window)) {
        this.$message?.error(I18nEyeDropper('support'))
        return
      }
      // eslint-disable-next-line no-undef
      const eyeDropper = new EyeDropper()
      try {
        const result = await eyeDropper.open()
        this.color = result.sRGBHex
      } catch {
        this.$message?.warning(I18nEyeDropper('cancel'))
      }
    }
  }
}
</script>
