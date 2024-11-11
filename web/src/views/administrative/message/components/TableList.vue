<template>
  <div>
    <a-table :columns="getColumns()" rowKey="id" :data-source="data" :loading="loading" :pagination="pagination">
      <template slot="author" slot-scope="text, record">
        <a-space>
          <a-avatar :src="record.user.avatar" />
          <span>{{ record.user.cnName }}</span>
        </a-space>
      </template>
      <template slot="messageTitle" slot-scope="text, record">
        <a-tooltip :title="text" placement="topLeft">
          <a @click="showDetails(record)">{{ text }}</a>
        </a-tooltip>
      </template>
      <template slot="reads" slot-scope="text, record">
        <avatar-list
          :max-length="3"
          v-if="record.messageReads?.length"
          :excessItemsStyle="{
            color: '#fff',
            backgroundColor: primaryColor
          }"
        >
          <avatar-list-item
            :tips="item.user.cnName"
            :src="item.user.avatar"
            v-for="item in record.messageReads"
            :key="item.id"
          />
        </avatar-list>
        <span v-else>{{ CommonText.Null }}</span>
      </template>
      <template slot="pinned" slot-scope="text, record">
        <a-popconfirm
          :title="$t(I18nGlobal.PopconfirmTitle)"
          @confirm="handleChangePinned(record.id)"
          @cancel="currentId = ''"
        >
          <a-switch
            :checked="text"
            :checked-children="$t(I18nGlobal.Yes)"
            :un-checked-children="$t(I18nGlobal.No)"
            :loading="currentId === record.id"
            @click="currentId = record.id"
          />
        </a-popconfirm>
      </template>
      <template slot="status" slot-scope="text">
        <a-tag :color="text === Status.Active ? 'green' : 'red'">
          {{ $t(text === Status.Active ? I18nGlobal.StatusNormal : I18nGlobal.StatusForbidden) }}
        </a-tag>
      </template>
      <template slot="createdAt" slot-scope="text, record">
        {{ dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template slot="action" slot-scope="text, record">
        <a @click="onEdit(record)" v-action:[ActionMap.edit]>{{ $t(I18nGlobal.Edit) }}</a>
        <a-divider type="vertical" />
        <a-popconfirm :title="$t(I18nGlobal.Delete)" @confirm="onDelete(record)">
          <a type="link" v-action:[ActionMap.delete]>{{ $t(I18nGlobal.Delete) }}</a>
        </a-popconfirm>
      </template>
    </a-table>
    <detail-modal ref="messageDetails" />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { map } from 'lodash-es'

import { changePinned, createMessageRead } from '@/api/administrative/message'
import AvatarList, { AvatarListItem } from '@/components/AvatarList'
import { CommonText, RequestCode, Status } from '@/constant'
import { ActionMap } from '@/constant/action'
import { I18nGlobal, I18nMessage } from '@/constant/i18n'

import DetailModal from './DetailModal' // 公告详情

export default {
  name: 'TableList',
  components: {
    AvatarList,
    AvatarListItem,
    DetailModal
  },
  props: ['data', 'loading', 'pagination'],
  data() {
    return {
      I18nGlobal,
      dayjs,
      ActionMap,
      CommonText,
      Status,
      currentId: ''
    }
  },
  computed: {
    primaryColor() {
      return this.$store.getters.color
    },
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    getColumns() {
      return [
        {
          title: I18nMessage('author'),
          dataIndex: 'author',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'author' }
        },
        {
          title: I18nMessage('title'),
          dataIndex: 'title',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'messageTitle' }
        },
        {
          title: I18nMessage('reads'),
          dataIndex: 'reads',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'reads' }
        },
        {
          title: I18nMessage('pinned'),
          dataIndex: 'pinned',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'pinned' }
        },
        {
          title: this.$t(I18nGlobal.Status),
          dataIndex: 'status',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t(I18nGlobal.CreatedAt),
          dataIndex: 'createdAt',
          align: 'center',
          width: 160,
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          title: this.$t(I18nGlobal.Action),
          width: '110px',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
    onEdit(record) {
      this.$emit('onEdit', record)
    },
    onDelete(record) {
      this.$emit('onDelete', record)
    },
    async handleChangePinned(id) {
      this.currentId = ''
      await changePinned(id).then(({ code }) => {
        if (code === RequestCode.Success) {
          this.$emit('query')
        }
      })
    },
    // 公告详情
    async showDetails(record) {
      // 如果点击未读信息，则请求将用户ID添加到已读字段
      const readUserIds = map(record.messageReads, 'userId')
      if (!readUserIds.includes(this.userInfo.id)) {
        await createMessageRead({ id: record.id }).then(({ code }) => {
          if (code === RequestCode.Success) {
            this.$emit('query')
          }
        })
      }
      this.$refs.messageDetails.showDetails(record)
    }
  }
}
</script>
