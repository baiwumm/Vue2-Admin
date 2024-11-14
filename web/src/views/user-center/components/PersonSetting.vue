<template>
  <a-card>
    <a-tabs :activeKey="activeKey" tabPosition="left" @change="changeTabs">
      <a-tab-pane :key="TabsKey.basicSetting" :tab="I18nUserCenter(TabsKey.basicSetting)">
        <basic-setting />
      </a-tab-pane>
      <a-tab-pane :key="TabsKey.securitySetting" :tab="I18nUserCenter(TabsKey.securitySetting)">
        <security-setting @changeTabs="changeTabs" />
      </a-tab-pane>
      <a-tab-pane :key="TabsKey.changePassword" :tab="I18nUserCenter(TabsKey.changePassword)">
        <change-password />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import { I18nUserCenter } from '@/constant/i18n'

import BasicSetting from './BasicSetting'
import ChangePassword from './ChangePassword'
import { TabsKey } from './constant'
import SecuritySetting from './SecuritySetting'
export default {
  name: 'PersonSetting',
  components: { BasicSetting, SecuritySetting, ChangePassword },
  componetnts: {
    BasicSetting,
    SecuritySetting,
    ChangePassword
  },
  data() {
    return {
      activeKey: TabsKey.basicSetting,
      I18nUserCenter,
      TabsKey
    }
  },
  methods: {
    changeTabs(key) {
      this.activeKey = key
    }
  }
}
</script>
