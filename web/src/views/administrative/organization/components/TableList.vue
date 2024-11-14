<template>
  <a-table :columns="getColumns()" rowKey="id" :data-source="data" :loading="loading" :pagination="false">
    <template slot="name" slot-scope="text, record">
      <a-tag color="purple">
        <a-space>
          <a-icon :component="MenuIcon['OrganizationIcon']" />
          <span>{{ record.name }}</span>
        </a-space>
      </a-tag>
    </template>
    <template slot="code" slot-scope="text">
      <a-tag color="green">{{ text }}</a-tag>
    </template>
    <template slot="posts" slot-scope="text, record">
      <a-space direction="vertical">
        <template v-if="record.posts?.length">
          <a-tag v-for="item in record.posts" :key="item.id">
            <a-space>
              <a-icon :component="MenuIcon['PostIcon']" />
              <span>{{ item.name }}</span>
            </a-space>
          </a-tag>
        </template>
        <span v-else>{{ CommonText.Null }}</span>
      </a-space>
    </template>
    <template slot="description" slot-scope="text">
      {{ text || CommonText.Null }}
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
      <a-popconfirm :title="$t(I18nGlobal.ConfirmDelete)" @confirm="onDelete(record)">
        <a type="link" v-action:[ActionMap.delete]>{{ $t(I18nGlobal.Delete) }}</a>
      </a-popconfirm>
    </template>
  </a-table>
</template>
<script>
import dayjs from 'dayjs'

import { CommonText } from '@/constant'
import { ActionMap } from '@/constant/action'
import { I18nGlobal, I18nOrganization } from '@/constant/i18n'
import MenuIcon from '@/core/icons'
export default {
  name: 'TableList',
  props: ['data', 'loading'],
  data() {
    return {
      I18nGlobal,
      dayjs,
      ActionMap,
      CommonText,
      MenuIcon
    }
  },
  methods: {
    getColumns() {
      return [
        {
          title: I18nOrganization('name'),
          dataIndex: 'name',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: I18nOrganization('code'),
          dataIndex: 'code',
          align: 'center',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: I18nOrganization('posts'),
          dataIndex: 'posts',
          align: 'center',
          scopedSlots: { customRender: 'posts' }
        },
        {
          title: I18nOrganization('description'),
          dataIndex: 'description',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'description' }
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
