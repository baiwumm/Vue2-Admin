<template>
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="16" align="middle">
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="I18nPost('orgId')">
            <a-tree-select
              v-model="queryForm.orgId"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="orgTree"
              :placeholder="I18nSelect(I18nPost('orgId'))"
              :replaceFields="{ value: 'id', label: 'name', children: 'children' }"
              allow-clear
            >
              <a-space slot="title" slot-scope="{ name }">
                <a-icon :component="MenuIcon['OrganizationIcon']" :style="{ fontSize: '14px' }" />
                <span>
                  {{ name }}
                </span>
              </a-space>
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-item :label="I18nPost('name')">
            <a-input :placeholder="I18nEntry(I18nPost('name'))" allowClear v-model="queryForm.name" />
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
              <a-button icon="plus" @click="onAdd" v-action:[ActionMap.add]>{{ $t(I18nGlobal.Add) }}</a-button>
            </a-space>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import { cloneDeep, forEach } from 'lodash-es'

import { ActionMap } from '@/constant/action'
import { I18nEntry, I18nGlobal, I18nPost, I18nSelect } from '@/constant/i18n'
import MenuIcon from '@/core/icons'
export default {
  name: 'HeaderSearch',
  props: ['queryForm', 'orgList'],
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nPost,
      ActionMap,
      I18nSelect,
      MenuIcon
    }
  },
  methods: {
    query() {
      this.$emit('query')
    },
    onAdd() {
      this.$emit('onAdd')
    }
  },
  computed: {
    orgTree() {
      const treeData = cloneDeep(this.orgList)
      const loopTree = (tree) => {
        forEach(tree, (node) => {
          node.key = node.id
          node.value = node.id
          node.scopedSlots = {
            title: 'title'
          }
          if (node?.children?.length) {
            loopTree(node.children)
          }
        })
      }
      loopTree(treeData)
      return treeData
    }
  }
}
</script>
