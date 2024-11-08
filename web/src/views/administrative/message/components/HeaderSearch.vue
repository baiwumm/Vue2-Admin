<template>
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="16" align="middle">
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="I18nMessage('author')">
            <a-select
              allowClear
              :placeholder="I18nSelect(I18nMessage('author'))"
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
          <a-form-item :label="I18nMessage('title')">
            <a-input :placeholder="I18nEntry(I18nMessage('title'))" allowClear v-model="queryForm.title" />
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="$t(I18nGlobal.Status)">
            <a-select allowClear :placeholder="I18nSelect($t(I18nGlobal.Status))" v-model="queryForm.status">
              <a-select-option :value="Status.Active">
                {{ $t(I18nGlobal.StatusNormal) }}
              </a-select-option>
              <a-select-option :value="Status.Inactive">
                {{ $t(I18nGlobal.StatusForbidden) }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="$t(I18nGlobal.CreatedAt)">
            <a-range-picker v-model="queryForm.createdAt" valueFormat="YYYY-MM-DD" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-row type="flex" justify="end">
            <a-space>
              <a-button type="primary" icon="search" @click="query" v-action:[ActionMap.search]>{{
                $t(I18nGlobal.Search)
              }}</a-button>
              <a-button icon="plus" @click="onAdd" v-action:[ActionMap.add]>{{ $t(I18nGlobal.Add) }}</a-button>
            </a-space>
          </a-row>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import { get } from 'lodash-es'

import { getUserList } from '@/api/system-manage/user-manage'
import { RequestCode, Status } from '@/constant'
import { ActionMap } from '@/constant/action'
import { I18nEntry, I18nGlobal, I18nMessage, I18nSelect } from '@/constant/i18n'
export default {
  name: 'HeaderSearch',
  props: ['queryForm'],
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nMessage,
      ActionMap,
      userList: [],
      userLoading: false,
      Status,
      I18nSelect
    }
  },
  methods: {
    query() {
      this.$emit('query')
    },
    onAdd() {
      this.$emit('onAdd')
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
