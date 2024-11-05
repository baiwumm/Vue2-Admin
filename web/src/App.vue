<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import antdEnUS from 'ant-design-vue/lib/locale-provider/en_US'
import antdJaJP from 'ant-design-vue/lib/locale-provider/ja_JP'
import antdZhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import antdZhTw from 'ant-design-vue/lib/locale-provider/zh_TW'
import { forIn } from 'lodash-es'

import { getLocales } from '@/api/auth'
import { i18nRender } from '@/locales'
import { domTitle, setDocumentTitle } from '@/utils/domUtil'

export default {
  data() {
    return {
      locales: {
        'zh-CN': antdZhCN,
        'zh-TW': antdZhTw,
        'en-US': antdEnUS,
        'ja-JP': antdJaJP
      }
    }
  },
  computed: {
    locale() {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && setDocumentTitle(`${i18nRender(title)} - ${domTitle}`)
      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  },
  methods: {
    async getLocales() {
      const { code, data } = await getLocales()
      if (code === 200) {
        forIn(data, (value, key) => {
          this.$i18n.setLocaleMessage(key, { ...value, antLocale: this.locales[key] })
        })
      }
    }
  },
  mounted() {
    this.getLocales()
  }
}
</script>
