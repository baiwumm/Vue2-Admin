import { computed } from 'vue';
<template>
  <a-list item-layout="horizontal" :data-source="dataSource">
    <a-list-item slot="renderItem" slot-scope="item">
      <a-list-item-meta :title="item.title" :description="item.desc"> </a-list-item-meta>
      <a slot="actions" v-if="item.tab" @click="$emit('changeTabs', item.tab)">{{ $t(I18nGlobal.Edit) }}</a>
      <a-tag slot="actions" color="green" v-else>{{
        I18nUserCenter(`${TabsKey.securitySetting}.authenticated`)
      }}</a-tag>
    </a-list-item>
  </a-list>
</template>
<script>
import { I18nGlobal, I18nUserCenter } from '@/constant/i18n'

import { TabsKey } from './constant'
export default {
  name: 'SecuritySetting',
  emit: ['changeTabs'],
  computed: {
    dataSource() {
      const { cnName, phone, email } = this.$store.getters.userInfo
      return [
        {
          title: I18nUserCenter(`${TabsKey.securitySetting}.authentication`),
          desc: this.$t(`views.user-center.${TabsKey.securitySetting}.authentication-information`, { cnName })
        },
        {
          title: I18nUserCenter(`${TabsKey.securitySetting}.account-password`),
          desc: I18nUserCenter(`${TabsKey.securitySetting}.account-password-desc`),
          tab: TabsKey.changePassword
        },
        {
          title: I18nUserCenter(`${TabsKey.securitySetting}.security-phone`),
          desc: this.$t(`views.user-center.${TabsKey.securitySetting}.security-phone-desc`, {
            phone: phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
          }),
          tab: TabsKey.basicSetting
        },
        {
          title: I18nUserCenter(`${TabsKey.securitySetting}.security-email`),
          desc: this.$t(`views.user-center.${TabsKey.securitySetting}.security-email-desc`, { email }),
          tab: TabsKey.basicSetting
        }
      ]
    }
  },
  data() {
    return {
      I18nUserCenter,
      I18nGlobal,
      TabsKey
    }
  }
}
</script>
