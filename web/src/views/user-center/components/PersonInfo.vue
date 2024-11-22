<template>
  <a-space direction="vertical" :size="16" style="width: 100%">
    <a-card>
      <a-space direction="vertical" align="center" style="width: 100%">
        <a-avatar :size="128" :src="userInfo.avatar" />
        <h2 style="font-weight: bold; font-size: 24px">{{ userInfo.cnName }}</h2>
      </a-space>
      <a-descriptions :column="1" size="small" bordered>
        <a-descriptions-item v-for="{ icon, field, value } in identityOptions" :key="field">
          <template #label>
            <a-space align="center">
              <a-icon :component="MenuIcon[icon]" v-if="icon.includes('Icon')" />
              <a-icon :type="icon" v-else />
              {{ I18nUser(field) }}
            </a-space>
          </template>
          <a-tag>{{ value === 'address' ? getAreaName : get(userInfo, value, '') }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider orientation="left">{{ I18nUser('tags') }}</a-divider>
      <user-tags @change="changeTags" :value="userInfo.tags" />
    </a-card>
    <a-card :title="$t('views.user-center.publishMessage')">
      <a-list item-layout="horizontal" :data-source="messageList" :loading="loading" :pagination="pagination">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-tag :color="item.status === Status.Active ? 'green' : 'red'" slot="actions">
            {{ $t(item.status === Status.Active ? I18nGlobal.StatusNormal : I18nGlobal.StatusForbidden) }}
          </a-tag>
          <a-list-item-meta>
            <a slot="title" @click="showDetails(item)">{{ item.title }}</a>
            <a-avatar slot="avatar" :src="item.user.avatar" />
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-card>
  </a-space>
</template>
<script>
import { codeToText } from 'element-china-area-data'
import { assign, forEach, get } from 'lodash-es'

import { getMessageList } from '@/api/administrative/message'
import { updateUserTags } from '@/api/system-manage/user-manage'
import UserTags from '@/components/UserTags'
import { RequestCode, Status } from '@/constant'
import { I18nEntry, I18nGlobal, I18nUser } from '@/constant/i18n'
import MenuIcon from '@/core/icons'
export default {
  name: 'PersonInfo',
  components: { UserTags },
  data() {
    return {
      identityOptions: [
        { icon: 'solution', field: 'roleId', value: 'roleInfo.name' },
        { icon: 'OrganizationIcon', field: 'orgId', value: 'organization.name' },
        { icon: 'PostIcon', field: 'postId', value: 'post.name' },
        { icon: 'environment', field: 'address', value: 'address' }
      ],
      I18nUser,
      I18nEntry,
      I18nGlobal,
      Status,
      MenuIcon,
      get,
      messageList: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 5,
        total: 0,
        size: 'small',
        onChange: (current) => {
          assign(this.pagination, { current })
          this.fetchMessageList()
        }
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    // 获取省市区名称
    getAreaName() {
      const { city, address } = this.$store.getters.userInfo
      let result = ''
      forEach(city, (code) => {
        result += codeToText[code]
      })
      return result + address
    }
  },
  methods: {
    async changeTags(tags) {
      await updateUserTags({ tags }).then(({ code, msg }) => {
        if (code === RequestCode.Success) {
          this.$message.success(msg)
          assign(this.$store.getters.userInfo, { tags })
        }
      })
    },
    async fetchMessageList() {
      this.loading = true
      await getMessageList({
        current: this.pagination.current,
        size: this.pagination.pageSize,
        userId: this.userInfo.id
      })
        .then(({ data, code }) => {
          this.unreadMessageList = data
          if (code === RequestCode.Success) {
            this.pagination.total = get(data, 'total', 0)
            this.messageList = get(data, 'records', [])
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  mounted() {
    this.fetchMessageList()
  }
}
</script>
