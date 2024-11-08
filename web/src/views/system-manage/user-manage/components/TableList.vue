<template>
  <a-table
    :columns="getColumns()"
    rowKey="id"
    :data-source="data"
    :loading="loading"
    :pagination="pagination"
    :scroll="{ x: 1200 }"
  >
    <template slot="userName" slot-scope="text">
      <a-tag color="purple">
        <a-space>
          <a-icon type="user" />
          <span>{{ text }}</span>
        </a-space>
      </a-tag>
    </template>
    <template slot="avatar" slot-scope="text">
      <a-avatar :src="text" />
    </template>
    <template slot="role" slot-scope="text, record">
      <a-tag>
        <a-space>
          <a-icon type="solution" />
          <span>{{ record.role.name }}</span>
        </a-space>
      </a-tag>
    </template>
    <template slot="org" slot-scope="text, record">
      <a-tag>
        <a-space>
          <a-icon :component="MenuIcon['OrganizationIcon']" />
          <span>{{ record.organization.name }}</span>
        </a-space>
      </a-tag>
    </template>
    <template slot="post" slot-scope="text, record">
      <a-tag>
        <a-space>
          <a-icon :component="MenuIcon['PostIcon']" />
          <span>{{ record.post.name }}</span>
        </a-space>
      </a-tag>
    </template>
    <template slot="sex" slot-scope="text">
      <a-tag :color="text === Sex.Male ? 'blue' : 'pink'">
        <a-icon :type="text === Sex.Male ? 'man' : 'woman'" />
      </a-tag>
    </template>
    <template slot="status" slot-scope="text">
      <a-tag :color="text === Status.Active ? 'green' : 'red'">
        {{ $t(text === Status.Active ? I18nGlobal.StatusNormal : I18nGlobal.StatusForbidden) }}
      </a-tag>
    </template>
    <template slot="sort" slot-scope="text">
      <a-tag color="blue">
        {{ text }}
      </a-tag>
    </template>
    <template slot="createdAt" slot-scope="text, record">
      {{ dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
    </template>
    <template slot="action" slot-scope="text, record">
      <a @click="onEdit(record)" v-action:[ActionMap.edit]>{{ $t(I18nGlobal.Edit) }}</a>
      <a-divider type="vertical" />
      <a-popconfirm :title="$t(I18nGlobal.Delete)" @confirm="onDelete(record)">
        <a v-action:[ActionMap.delete]>{{ $t(I18nGlobal.Delete) }}</a>
      </a-popconfirm>
    </template>
  </a-table>
</template>
<script>
import dayjs from 'dayjs'

import { CommonText, Sex, Status } from '@/constant'
import { ActionMap } from '@/constant/action'
import { I18nGlobal, I18nUser } from '@/constant/i18n'
import MenuIcon from '@/core/icons'
export default {
  name: 'TableList',
  props: ['data', 'loading', 'pagination'],
  data() {
    return {
      dayjs,
      I18nGlobal,
      ActionMap,
      MenuIcon,
      CommonText,
      Sex,
      Status
    }
  },
  methods: {
    getColumns() {
      return [
        {
          title: I18nUser('userName'),
          dataIndex: 'userName',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: I18nUser('cnName'),
          dataIndex: 'cnName',
          align: 'center',
          ellipsis: true
        },
        {
          title: I18nUser('avatar'),
          dataIndex: 'avatar',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'avatar' }
        },
        {
          title: I18nUser('roleId'),
          dataIndex: 'roleId',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'role' }
        },
        {
          title: I18nUser('orgId'),
          dataIndex: 'orgId',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'org' }
        },
        {
          title: I18nUser('postId'),
          dataIndex: 'postId',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'post' }
        },
        {
          title: I18nUser('sex'),
          dataIndex: 'sex',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: this.$t(I18nGlobal.Status),
          dataIndex: 'status',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: I18nUser('phone'),
          dataIndex: 'phone',
          align: 'center',
          ellipsis: true
        },
        {
          title: I18nUser('email'),
          dataIndex: 'email',
          align: 'center',
          ellipsis: true
        },
        {
          title: this.$t(I18nGlobal.Sort),
          dataIndex: 'sort',
          align: 'center',
          scopedSlots: { customRender: 'sort' }
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
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
    onEdit(record) {
      this.$emit('onEdit', record)
    },
    onDelete(record) {
      this.$emit('onDelete', record)
    }
  }
}
</script>
