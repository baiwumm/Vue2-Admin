<template>
  <page-header-wrapper>
    <a-button slot="extra" type="primary" href="https://github.com/simonwep/pickr" target="_blank">
      @simonwep/pickr
    </a-button>
    <a-card>
      <a-row type="flex" justify="center" :gutter="30">
        <a-col>
          <a-space direction="vertical" align="center">
            <a-button type="primary" ghost>{{ classicTheme }}</a-button>
            <color-picker :value="classicColor" :theme="classicTheme" @change="classicColor = $event" />
          </a-space>
        </a-col>
        <a-col>
          <a-space direction="vertical" align="center">
            <a-button type="primary" ghost>{{ monolithTheme }}</a-button>
            <color-picker :value="monolithColor" :theme="monolithTheme" @change="monolithColor = $event" />
          </a-space>
        </a-col>
        <a-col>
          <a-space direction="vertical" align="center">
            <a-button type="primary" ghost>{{ nanoTheme }}</a-button>
            <color-picker :value="nanoColor" :theme="nanoTheme" @change="nanoColor = $event" />
          </a-space>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import storage from 'store'

import ColorPicker from '@/components/ColorPicker'
import { TOGGLE_COLOR } from '@/store/mutation-types'
export default {
  name: 'Pickr',
  components: {
    ColorPicker
  },
  data() {
    return {
      classicTheme: 'classic',
      classicColor: storage.get(TOGGLE_COLOR),
      monolithTheme: 'monolith',
      monolithColor: storage.get(TOGGLE_COLOR),
      nanoTheme: 'nano',
      nanoColor: storage.get(TOGGLE_COLOR)
    }
  }
}
</script>
