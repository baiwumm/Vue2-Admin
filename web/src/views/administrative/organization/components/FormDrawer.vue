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
          :tree-data="orgTree"
          :placeholder="I18nSelect($t(I18nGlobal.Parent))"
          tree-default-expand-all
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
    <a-col :span="24">
      <a-form-item :label="I18nOrganization('name')">
        <a-input
          v-decorator="rules.name"
          :placeholder="I18nEntry(I18nOrganization('name'))"
          :max-length="200"
          allow-clear
        />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nOrganization('code')">
        <a-input
          v-decorator="rules.code"
          :placeholder="I18nEntry(I18nOrganization('code'))"
          :max-length="200"
          allow-clear
        />
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
      <a-form-item :label="I18nOrganization('description')">
        <a-textarea
          v-decorator="rules.description"
          :placeholder="I18nEntry(I18nOrganization('description'))"
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
import { I18nEntry, I18nGlobal, I18nOrganization, I18nSelect } from '@/constant/i18n'
import MenuIcon from '@/core/icons'
export default {
  name: 'FormDrawer',
  props: ['data', 'rules'],
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nSelect,
      I18nOrganization,
      ActionOptions,
      CommonText,
      MenuIcon
    }
  },
  computed: {
    orgTree() {
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
    }
  }
}
</script>
