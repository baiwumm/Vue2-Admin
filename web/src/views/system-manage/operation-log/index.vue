<template>
  <page-header-wrapper>
    <a-space direction="vertical" size="middle" style="width: 100%">
      <a-card :bordered="false">
        <!-- 顶部搜索 -->
        <header-search :query-form="queryForm" @query="query" />
      </a-card>
      <a-card :bordered="false">
        <a-button
          type="primary"
          :disabled="!hasSelected"
          :loading="delLoading"
          slot="extra"
          @click="onDelete(selectedRowKeys)"
          v-action:[ActionMap.batchDelete]
        >
          {{ $t(I18nGlobal.BatchDelete) }}
        </a-button>
        <!-- 表格数据 -->
        <table-list
          :data="data"
          :loading="loading"
          :pagination="pagination"
          @onDelete="onDelete"
          :selectedRowKeys="selectedRowKeys"
          @onSelectChange="onSelectChange"
        />
      </a-card>
    </a-space>
  </page-header-wrapper>
</template>
<script>
import dayjs from 'dayjs'
import { assign, get } from 'lodash-es'

import { delRole, getLogList } from '@/api/system-manage/operation-log'
import { RequestCode } from '@/constant'
import { ActionMap } from '@/constant/action'
import { I18nEntry, I18nGlobal, I18nOperationLog, I18nSelect } from '@/constant/i18n'

import HeaderSearch from './components/HeaderSearch.vue' // 顶部搜索
import TableList from './components/TableList.vue' // 表格列表
export default {
  name: 'OperationLog',
  components: {
    TableList,
    HeaderSearch
  },
  data() {
    return {
      data: [],
      loading: false,
      dayjs,
      rules: {
        name: ['name', { rules: [{ required: true, message: I18nEntry(I18nOperationLog('name')) }] }],
        code: ['code', { rules: [{ required: true, message: I18nEntry(I18nOperationLog('code')) }] }],
        description: [
          'description',
          { rules: [{ required: true, message: I18nEntry(I18nOperationLog('description')) }] }
        ],
        sort: ['sort', { initialValue: 1, rules: [{ required: true, message: I18nEntry(this.$t(I18nGlobal.Sort)) }] }],
        menus: [
          'menus',
          { initialValue: [], rules: [{ required: true, message: I18nSelect(I18nOperationLog('menus')) }] }
        ]
      },
      queryForm: {},
      I18nGlobal,
      I18nOperationLog,
      pagination: {
        total: 0,
        onChange: (page, pageSize) => {
          this.pagination.current = page
          this.pagination.pageSize = pageSize
          this.getList()
        },
        current: 1,
        pageSize: 5,
        showTotal: (total) => this.$t(I18nGlobal.ShowTotal, { total })
      },
      delLoading: false,
      ActionMap,
      selectedRowKeys: [] // 多选
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    // 获取操作日志列表
    async getList() {
      this.loading = true
      const params = {
        current: this.pagination.current,
        size: this.pagination.pageSize,
        userId: this.queryForm.userId,
        method: this.queryForm.method
      }
      if (this.queryForm.createdAt?.length) {
        assign(params, {
          startTime: dayjs(this.queryForm.createdAt[0]).startOf('day').valueOf(),
          endTime: dayjs(this.queryForm.createdAt[1]).endOf('day').valueOf()
        })
      }
      const { data, code } = await getLogList(params)
      if (code === RequestCode.Success) {
        this.data = get(data, 'records', [])
        this.pagination.total = get(data, 'total', 0)
      }
      this.loading = false
      this.selectedRowKeys = []
    },
    // 查询
    query() {
      this.getList()
    },
    // 删除
    async onDelete(ids) {
      this.delLoading = true
      await delRole({ ids })
        .then((res) => {
          if (res.code === RequestCode.Success) {
            this.$message.success(res.msg)
            this.getList()
          }
        })
        .finally(() => {
          this.delLoading = false
        })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
    })
  }
}
</script>
