<template>
  <a-table :columns="getColumns()" rowKey="id" :data-source="data" :loading="loading" :pagination="pagination">
    <div slot="expandedRowRender" slot-scope="record">
      <a-row :gutter="[12, 6]">
        <a-col :span="12" v-for="(p, index) in record.permissions" :key="index">
          <a-col :span="6">
            <span>{{ $t(p.menu.meta.title) }}：</span>
          </a-col>
          <a-col :span="18" v-if="p.actions.length">
            <a-tag color="purple" v-for="(action, k) in p.actions" :key="k">{{ $t(`global.${action}`) }}</a-tag>
          </a-col>
          <a-col :span="18" v-else>{{ CommonText.Null }}</a-col>
        </a-col>
      </a-row>
    </div>
    <span slot="sort" slot-scope="text">
      <a-tag color="blue">
        {{ text }}
      </a-tag>
    </span>
    <span slot="createdAt" slot-scope="text, record">
      {{ dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
    </span>
    <span slot="action" slot-scope="text, record">
      <a @click="onEdit(record)" v-action:[ActionMap.edit]>{{ $t(I18nGlobal.Edit) }}</a>
      <a-divider type="vertical" />
      <a-popconfirm :title="$t(I18nGlobal.Delete)" @confirm="onDelete(record)">
        <a type="link" v-action:[ActionMap.delete]>{{ $t(I18nGlobal.Delete) }}</a>
      </a-popconfirm>
    </span>
  </a-table>
</template>
<script>
import dayjs from 'dayjs'

import { CommonText } from '@/constant'
import { ActionMap } from '@/constant/action'
import { I18nGlobal, I18nRole } from '@/constant/i18n'
export default {
  name: 'TableList',
  props: ['data', 'loading', 'pagination'],
  data() {
    return {
      I18nGlobal,
      dayjs,
      ActionMap,
      CommonText
    }
  },
  methods: {
    getColumns() {
      return [
        {
          title: I18nRole('name'),
          dataIndex: 'name',
          align: 'center',
          ellipsis: true
        },
        {
          title: I18nRole('code'),
          dataIndex: 'code',
          align: 'center',
          ellipsis: true
        },
        {
          title: I18nRole('description'),
          dataIndex: 'description',
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
