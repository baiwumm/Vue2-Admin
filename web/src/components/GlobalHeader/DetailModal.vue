<template>
  <!-- 详情页 -->
  <a-modal
    :footer="null"
    width="100%"
    :dialog-style="{ position: 'fixed', top: '0', left: '0' }"
    :zIndex="1080"
    v-model="visible"
  >
    <div class="article-container">
      <h1>{{ articleData.title }}</h1>
      <div class="describe">
        <div>
          {{ $t(I18nMessage('author')) }}：<a-tag color="cyan">
            {{ articleData.user?.cnName }}
          </a-tag>
        </div>
        <div>{{ $t(I18nGlobal.CreatedAt) }}：{{ dayjs(articleData.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
      </div>
      <div class="content" v-html="articleData.content"></div>
    </div>
  </a-modal>
</template>

<script>
import dayjs from 'dayjs'

import { I18nGlobal, I18nMessage } from '@/constant/i18n'
export default {
  data() {
    return {
      visible: false,
      articleData: {},
      I18nMessage,
      I18nGlobal,
      dayjs
    }
  },
  methods: {
    showDetails(data) {
      const _this = this
      _this.visible = true
      _this.articleData = data
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 48px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  h1 {
    color: #333;
    font-weight: bold;
    text-align: center;
  }
  .describe {
    text-align: right;
    font-size: 14px;
    color: #000;
  }
  .content {
    margin-top: 10px;
  }
}
</style>
