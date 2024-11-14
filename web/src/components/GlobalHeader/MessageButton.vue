<template>
  <a-popover :overlay-style="{ width: '400px' }" placement="bottomRight" @visible-change="visibleChange">
    <a-badge :count="total">
      <a-icon type="bell" style="font-size: 20px" />
    </a-badge>
    <template slot="content">
      <a-list item-layout="horizontal" :data-source="unreadMessageList" :loading="loading" :pagination="pagination">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <a slot="title" @click="showDetails(item)">{{ item.title }}</a>
            <a-avatar slot="avatar" :src="item.user.avatar" />
            <a-row slot="description" type="flex" justify="space-between">
              <a-col>{{ item.user.cnName }}</a-col>
              <a-col>{{ dayjs(item.createdAt).fromNow() }}</a-col>
            </a-row>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </template>
    <detail-modal ref="messageDetails" />
  </a-popover>
</template>
<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { assign, map } from 'lodash-es'
import storage from 'store'

import { createMessageRead, getUnreadCount, getUnreadMessageList } from '@/api/administrative/message'
import { RequestCode } from '@/constant'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import bus from '@/utils/bus'

import DetailModal from './DetailModal'
// 使用 relativeTime 插件
dayjs.extend(relativeTime) // 公告详情
export default {
  name: 'MessageButton',
  components: {
    DetailModal
  },
  data() {
    return {
      total: 0,
      unreadLoading: false,
      unreadMessageList: [],
      pagination: {
        current: 1,
        pageSize: 5,
        total: 0,
        showSizeChanger: false,
        onChange: (current) => {
          assign(this.pagination, { current })
          this.fetchUnreadMessageList()
        }
      },
      loading: false,
      dayjs,
      eventSource: new EventSourcePolyfill(`/api/administrative/message/sse/event`, {
        headers: {
          Authorization: `Bearer ${storage.get(ACCESS_TOKEN)}`
        },
        heartbeatTimeout: 60 * 60 * 1000 // 这是自定义配置请求超时时间  默认是45000ms
      })
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  created() {
    bus.$on('showDetail', (record) => {
      if (record) {
        this.showDetails(record)
      }
    })
  },
  methods: {
    async fetchUnreadCount() {
      this.unreadLoading = true
      await getUnreadCount()
        .then(({ code, data }) => {
          if (code === RequestCode.Success) {
            this.total = data
            this.pagination.total = data
          }
        })
        .finally(() => {
          this.unreadLoading = false
        })
    },
    async fetchUnreadMessageList() {
      this.loading = true
      await getUnreadMessageList({
        current: this.pagination.current,
        size: this.pagination.pageSize
      })
        .then(({ data, code }) => {
          if (code === RequestCode.Success) {
            this.unreadMessageList = data
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    visibleChange(visible) {
      if (visible && !this.unreadMessageList.value?.length) {
        this.fetchUnreadMessageList()
      }
    },
    // 公告详情
    async showDetails(record) {
      // 如果点击未读信息，则请求将用户ID添加到已读字段
      const readUserIds = map(record.messageReads, 'userId')
      this.$refs.messageDetails.showDetails(record)
      if (!readUserIds.includes(this.userInfo.id)) {
        await createMessageRead({ id: record.id }).then(({ code }) => {
          if (code === RequestCode.Success) {
            this.initUnReadMessage()
          }
        })
      }
    },
    initUnReadMessage() {
      this.fetchUnreadCount()
      this.fetchUnreadMessageList()
    },
    // 服务器消息推送
    handleMessageEvent() {
      this.eventSource.onmessage = (e) => {
        const record = JSON.parse(e.data) || {}
        const { user, title, userId } = record
        // 初始化未读数据
        this.initUnReadMessage()
        // 弹窗提示
        if (this.userInfo.id !== userId) {
          this.$notification.open({
            message: `${user.cnName} - ${this.$t('components.messageButton.title')}`,
            description: title,
            duration: null,
            icon: (h) =>
              h('a-avatar', {
                props: {
                  src: user.avatar
                }
              }),
            btn: (h) => {
              return h(
                'a-button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.showDetails(record)
                      this.$notification.destroy()
                    }
                  }
                },
                this.$t('components.messageButton.view')
              )
            }
          })
        }
      }
    }
  },
  mounted() {
    this.initUnReadMessage()
    this.handleMessageEvent()
  },
  beforeDestroy() {
    bus.$off('showDetail')
  }
}
</script>
