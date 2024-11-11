<template>
  <a-dropdown v-if="userInfo && userInfo.cnName" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar size="small" :src="userInfo.avatar" class="antd-pro-global-header-index-avatar" />
      <span>{{ userInfo.cnName }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item key="center" @click="handleToCenter">
          <a-icon type="idcard" />
          {{ $t('menu.user-center') }}
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          {{ $t('components.avatarDropdown.logout') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'

export default {
  name: 'AvatarDropdown',
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    handleToCenter() {
      this.$router.push({ path: '/user-center' })
    },
    handleLogout(e) {
      Modal.confirm({
        title: this.$t('components.avatarDropdown.title'),
        content: this.$t('components.avatarDropdown.confirm'),
        onOk: () => {
          return this.$store.dispatch('Logout').then(() => {
            // this.$router.push({ name: 'login' })
            window.location.reload()
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  :deep(.action) {
    margin-right: 8px;
  }
  :deep(.ant-dropdown-menu-item) {
    min-width: 160px;
  }
}
</style>
