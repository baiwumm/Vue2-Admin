<template>
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="[16, 16]" align="middle">
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="I18nOperationLog('userId')">
            <a-select
              allowClear
              :placeholder="I18nSelect(I18nOperationLog('userId'))"
              v-model="queryForm.userId"
              :loading="userLoading"
            >
              <a-select-option :value="user.id" v-for="user in userList" :key="user.id">
                <a-space>
                  <a-avatar :src="user.avatar" size="small" />
                  <span>{{ user.cnName }}</span>
                </a-space>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="I18nOperationLog('method')">
            <a-select
              allowClear
              :placeholder="I18nSelect(I18nOperationLog('method'))"
              v-model="queryForm.method"
              :options="MethodOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="$t(I18nGlobal.CreatedAt)">
            <a-range-picker v-model="queryForm.createdAt" valueFormat="YYYY-MM-DD" />
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <span class="table-page-search-submitButtons">
            <a-space>
              <a-button type="primary" icon="search" @click="query" v-action:[ActionMap.search]>{{
                $t(I18nGlobal.Search)
              }}</a-button>
            </a-space>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import { get } from 'lodash-es'

import { getUserList } from '@/api/system-manage/user-manage'
import { MethodOptions, RequestCode } from '@/constant'
import { ActionMap } from '@/constant/action'
import { I18nEntry, I18nGlobal, I18nOperationLog, I18nSelect } from '@/constant/i18n'
export default {
  name: 'HeaderSearch',
  props: ['queryForm'],
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nOperationLog,
      ActionMap,
      userLoading: false,
      userList: [],
      I18nSelect,
      MethodOptions
    }
  },
  methods: {
    query() {
      this.$emit('query')
    },
    async fetchUserList() {
      this.userLoading = true
      const { data, code } = await getUserList({ current: 1, size: 999 })
      if (code === RequestCode.Success) {
        this.userList = get(data, 'records', [])
      }
      this.userLoading = false
    }
  },
  mounted() {
    this.fetchUserList()
  }
}
</script>
