<template>
  <a-table
    :columns="getColumns()"
    rowKey="id"
    :data-source="data"
    :loading="loading"
    :pagination="pagination"
    :scroll="{ x: 1000 }"
    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
  >
    <pre slot="expandedRowRender" slot-scope="record"> {{ JSON.stringify(record.params, null, 2) }}</pre>
    <template slot="userId" slot-scope="text, record">
      <a-space>
        <a-avatar :src="record.user.avatar" />
        <span>{{ record.user.cnName }}</span>
      </a-space>
    </template>
    <template slot="method" slot-scope="text">
      <a-tag :color="get(find(MethodOptions, ['value', text]), 'key')">
        {{ text }}
      </a-tag>
    </template>
    <template slot="city" slot-scope="text, record">
      <span v-if="compact([record.province, record.city]).length">{{
        uniq([record.province, record.city]).join('-')
      }}</span>
      <span>{{ CommonText.Null }}</span>
    </template>
    <template slot="createdAt" slot-scope="text, record">
      {{ dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
    </template>
    <template slot="operation" slot-scope="text, record">
      <a-popconfirm :title="$t(I18nGlobal.ConfirmDelete)" @confirm="onDelete(record)">
        <a type="link" v-action:[ActionMap.delete]>{{ $t(I18nGlobal.Delete) }}</a>
      </a-popconfirm>
    </template>
  </a-table>
</template>
<script>
import dayjs from 'dayjs'
import { compact, find, get, join, uniq } from 'lodash-es'

import { CommonText, MethodOptions } from '@/constant'
import { ActionMap } from '@/constant/action'
import { I18nGlobal, I18nOperationLog } from '@/constant/i18n'
export default {
  name: 'TableList',
  props: ['data', 'loading', 'pagination', 'selectedRowKeys'],
  data() {
    return {
      I18nGlobal,
      dayjs,
      ActionMap,
      CommonText,
      MethodOptions,
      get,
      find,
      compact,
      uniq,
      join
    }
  },
  methods: {
    getColumns() {
      return [
        {
          title: I18nOperationLog('userId'),
          dataIndex: 'userId',
          align: 'center',
          scopedSlots: { customRender: 'userId' }
        },
        {
          title: I18nOperationLog('action'),
          dataIndex: 'action',
          align: 'center',
          ellipsis: true
        },
        {
          title: I18nOperationLog('method'),
          dataIndex: 'method',
          align: 'center',
          scopedSlots: { customRender: 'method' }
        },
        {
          title: I18nOperationLog('os'),
          dataIndex: 'os',
          align: 'center',
          ellipsis: true
        },
        {
          title: I18nOperationLog('browser'),
          dataIndex: 'browser',
          align: 'center',
          ellipsis: true
        },
        {
          title: I18nOperationLog('city'),
          dataIndex: 'city',
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'city' }
        },
        {
          title: I18nOperationLog('ip'),
          dataIndex: 'ip',
          align: 'center',
          ellipsis: true
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
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    },
    onDelete(record) {
      this.$emit('onDelete', [record.id])
    },
    onSelectChange(selectedRowKeys) {
      this.$emit('onSelectChange', selectedRowKeys)
    }
  }
}
</script>
