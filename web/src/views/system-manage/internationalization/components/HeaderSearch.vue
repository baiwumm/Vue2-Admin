<template>
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="[16, 16]" align="middle">
        <a-col :md="6" :sm="12">
          <a-form-item :label="I18nInternationalization('name')">
            <a-input :placeholder="I18nEntry(I18nInternationalization('name'))" allowClear v-model="queryForm.name" />
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="12">
          <a-form-item :label="I18nInternationalization('zh-CN')">
            <a-input :placeholder="I18nEntry(I18nInternationalization('zh-CN'))" allowClear v-model="queryForm.zhCN" />
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item :label="$t(I18nGlobal.createdAt)">
            <a-range-picker v-model="queryForm.createdAt" valueFormat="YYYY-MM-DD" />
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="12">
          <span class="table-page-search-submitButtons">
            <a-space>
              <a-button type="primary" @click="query">{{ $t(I18nGlobal.search) }}</a-button>
              <a-button type="primary" @click="onAdd">{{ $t(I18nGlobal.add) }}</a-button>
            </a-space>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import { I18nEntry, I18nGlobal, I18nInternationalization } from '@/utils/i18n'
export default {
  name: 'HeaderSearch',
  props: ['queryForm'],
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nInternationalization
    }
  },
  methods: {
    query() {
      this.$emit('query')
    },
    onAdd() {
      this.$emit('onAdd')
    }
  }
}
</script>
