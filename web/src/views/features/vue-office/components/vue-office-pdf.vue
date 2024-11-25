<template>
  <a-spin :spinning="loading">
    <a-space direction="vertical" size="middle" style="width: 100%">
      <a-upload accept=".pdf" :max-count="1" :before-upload="beforeUpload">
        <a-button>{{ I18nVueOffice('upload') }}</a-button>
      </a-upload>
      <vue-office-pdf :src="src" @rendered="renderedHandler" @error="errorHandler" />
    </a-space>
  </a-spin>
</template>

<script>
import VueOfficePdf from '@vue-office/pdf'

import PdfFile from '@/assets/office/test.pdf'
import { I18nVueOffice } from '@/constant/i18n'
export default {
  components: {
    VueOfficePdf
  },
  data() {
    return {
      loading: true,
      src: PdfFile,
      I18nVueOffice
    }
  },
  methods: {
    // 渲染完成回调
    renderedHandler() {
      this.loading = false
    },
    // 渲染失败回调
    errorHandler() {
      this.loading = false
    },
    // 上传回调
    beforeUpload(file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = (loadEvent) => {
        const arrayBuffer = loadEvent.target?.result
        this.src = arrayBuffer
      }
      return false
    }
  }
}
</script>
