<template>
  <page-header-wrapper>
    <a-button slot="extra" type="primary" href="https://github.com/Alessandro-Pang/vue-print-next" target="_blank">
      vue-print-next
    </a-button>
    <div id="print-el">
      <a-card>
        <a-space>
          <a-button v-print type="primary">{{ I18nPrint('fullScreen') }}</a-button>
          <a-button v-print="'#print-el'" type="primary">{{ I18nPrint('instruction') }}</a-button>
          <a-button type="primary" @click="handleBasicPrint">{{ I18nPrint('method') }}</a-button>
          <a-button v-print="printOps" type="primary">{{ I18nPrint('ingoreImg') }}</a-button>
        </a-space>
      </a-card>
    </div>
  </page-header-wrapper>
</template>
<script>
import { vPrint, VuePrintNext } from 'vue-print-next'

import { I18nPrint } from '@/constant/i18n'
export default {
  name: 'Print',
  directives: {
    print: vPrint
  },
  data() {
    return {
      I18nPrint,
      printOps: {
        el: '#print-el',
        // 打印忽略 img
        noPrintSelector: ['img']
      }
    }
  },
  methods: {
    handleBasicPrint() {
      // eslint-disable-next-line no-new
      new VuePrintNext({ el: '#print-el' })
    }
  }
}
</script>
