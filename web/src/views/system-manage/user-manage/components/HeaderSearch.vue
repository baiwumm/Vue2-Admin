<template>
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="16" align="middle">
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="I18nUser('userName')">
            <a-input :placeholder="I18nEntry(I18nUser('userName'))" allowClear v-model="queryForm.userName" />
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="$t(I18nGlobal.Status)">
            <a-select allowClear :placeholder="I18nSelect($t(I18nGlobal.Status))" v-model="queryForm.status">
              <a-select-option value="ACTIVE">
                {{ $t(I18nGlobal.StatusNormal) }}
              </a-select-option>
              <a-select-option value="INACTIVE">
                {{ $t(I18nGlobal.StatusForbidden) }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <span class="table-page-search-submitButtons">
            <a-space>
              <a-button type="primary" icon="search" @click="query" v-action:[ActionMap.search]>{{
                $t(I18nGlobal.Search)
              }}</a-button>
              <a-button icon="plus" @click="onAdd" v-action:[ActionMap.add]>{{ $t(I18nGlobal.Add) }}</a-button>
            </a-space>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import { ActionMap } from '@/constant/action'
import { I18nEntry, I18nGlobal, I18nSelect, I18nUser } from '@/constant/i18n'
export default {
  name: 'HeaderSearch',
  props: ['queryForm'],
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nUser,
      ActionMap,
      I18nSelect
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
