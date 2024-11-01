import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export const defaultLang = 'zh-CN'

const i18n = new VueI18n({
  silentTranslationWarn: true,
  locale: defaultLang,
  fallbackLocale: defaultLang
})

export function setI18nLanguage(lang) {
  i18n.locale = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function i18nRender(key) {
  return i18n.t(`${key}`)
}

export default i18n
