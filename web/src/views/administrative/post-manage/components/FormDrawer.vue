<template>
  <a-row :gutter="16">
    <a-col :span="24">
      <a-form-item>
        <a-space slot="label">
          <span>
            {{ $t(I18nGlobal.Parent) }}
          </span>
          <a-tooltip :title="$t(I18nGlobal.ParentTip)">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </a-space>
        <a-tree-select
          v-decorator="rules.parentId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="postTree"
          :placeholder="I18nSelect($t(I18nGlobal.Parent))"
          tree-default-expand-all
          allow-clear
        >
          <a-space slot="title" slot-scope="{ name }">
            <a-icon :component="MenuIcon['PostIcon']" :style="{ fontSize: '14px' }" />
            <span>
              {{ name }}
            </span>
          </a-space>
        </a-tree-select>
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nPost('name')">
        <a-input v-decorator="rules.name" :placeholder="I18nEntry(I18nPost('name'))" :max-length="200" allow-clear />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nPost('orgId')">
        <a-tree-select
          v-decorator="rules.orgId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="orgTree"
          :placeholder="I18nSelect(I18nPost('orgId'))"
          tree-default-expand-all
          allow-clear
          :replaceFields="{ value: 'id', label: 'name', children: 'children' }"
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
    <a-col :span="24">
      <a-form-item :label="$t(I18nGlobal.Sort)">
        <a-input-number
          v-decorator="rules.sort"
          :placeholder="I18nEntry($t(I18nGlobal.Sort))"
          :min="1"
          :max="9999"
          style="width: 100%"
        />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nPost('description')">
        <a-textarea
          v-decorator="rules.description"
          :placeholder="I18nEntry(I18nPost('description'))"
          :max-length="200"
          allow-clear
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>
<script>
import { cloneDeep, forEach } from 'lodash-es'

import { CommonText } from '@/constant'
import { ActionOptions } from '@/constant/action'
import { I18nEntry, I18nGlobal, I18nPost, I18nSelect } from '@/constant/i18n'
import MenuIcon from '@/core/icons'
export default {
  name: 'FormDrawer',
  props: ['data', 'rules', 'orgList'],
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nSelect,
      I18nPost,
      ActionOptions,
      CommonText,
      MenuIcon
    }
  },
  computed: {
    postTree() {
      const treeData = cloneDeep(this.data)
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
    },
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
