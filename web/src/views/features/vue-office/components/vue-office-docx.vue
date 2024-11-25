<template>
  <a-spin :spinning="loading">
    <a-space direction="vertical" size="middle" style="width: 100%">
      <a-upload accept=".doc,.docx" :max-count="1" :before-upload="beforeUpload">
        <a-button>{{ I18nVueOffice('upload') }}</a-button>
      </a-upload>
      <div :style="{ height: '800px' }">
        <vue-office-docx :src="src" @rendered="renderedHandler" @error="errorHandler" />
      </div>
    </a-space>
  </a-spin>
</template>

<script>
import '@vue-office/docx/lib/index.css'

import VueOfficeDocx from '@vue-office/docx'

import DocxFile from '@/assets/office/test.docx'
import { I18nVueOffice } from '@/constant/i18n'
export default {
  components: {
    VueOfficeDocx
  },
  data() {
    return {
      loading: true,
      src: DocxFile,
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
