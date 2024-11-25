<template>
  <a-row :gutter="16">
    <a-col :span="12">
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
          :tree-data="menuTree"
          :placeholder="I18nSelect($t(I18nGlobal.Parent))"
          tree-default-expand-all
          allow-clear
        >
          <a-space slot="title" slot-scope="{ meta }">
            <a-icon :component="MenuIcon[meta.icon]" :style="{ fontSize: '14px' }" v-if="meta.icon.includes('Icon')" />
            <a-icon :type="meta.icon" :style="{ fontSize: '14px' }" v-else />
            <span>
              {{ $t(meta.title) }}
            </span>
          </a-space>
        </a-tree-select>
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nMenu('name')">
        <a-input v-decorator="rules.name" :placeholder="I18nEntry(I18nMenu('name'))" :max-length="100" allow-clear />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nMenu('path')">
        <a-input
          v-decorator="rules.path"
          :placeholder="I18nEntry(I18nMenu('path'))"
          :max-length="200"
          allow-clear
          @change="changePath"
        />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nMenu('redirect')">
        <a-input
          v-decorator="rules.redirect"
          :placeholder="I18nEntry(I18nMenu('redirect'))"
          :max-length="200"
          allow-clear
        />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nMenu('component')">
        <a-input
          v-decorator="rules.component"
          :placeholder="I18nEntry(I18nMenu('component'))"
          :max-length="200"
          allow-clear
        />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nMenu('meta.title')">
        <a-input
          v-decorator="rules.meta.title"
          :placeholder="I18nEntry(I18nMenu('meta.title'))"
          :max-length="200"
          allow-clear
        />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nMenu('meta.icon')">
        <a-popover placement="bottom" :overlayStyle="{ width: '500px' }">
          <template slot="content">
            <icon-selector :value="iconValue" @change="handleIconChange" />
          </template>
          <a-input
            v-decorator="rules.meta.icon"
            :placeholder="I18nEntry(I18nMenu('meta.icon'))"
            :max-length="200"
            allow-clear
            @change="changeIcon"
          >
            <a-icon
              slot="suffix"
              :component="MenuIcon[iconValue]"
              :style="{ fontSize: '20px' }"
              v-if="iconValue.includes('Icon')"
            />
            <a-icon :type="iconValue" slot="suffix" :style="{ fontSize: '20px' }" v-else />
          </a-input>
        </a-popover>
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nMenu('meta.permission')">
        <a-input
          v-decorator="rules.meta.permission"
          :placeholder="I18nEntry(I18nMenu('meta.permission'))"
          :max-length="200"
          allow-clear
        />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nMenu('hidden')">
        <a-radio-group v-decorator="rules.hidden">
          <a-radio :value="Flag.True"> {{ $t(I18nGlobal.Yes) }} </a-radio>
          <a-radio :value="Flag.False"> {{ $t(I18nGlobal.No) }} </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nMenu('meta.keepAlive')">
        <a-radio-group v-decorator="rules.meta.keepAlive">
          <a-radio :value="Flag.True"> {{ $t(I18nGlobal.Yes) }} </a-radio>
          <a-radio :value="Flag.False"> {{ $t(I18nGlobal.No) }} </a-radio>
        </a-radio-group>
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
      <a-form-item :label="I18nMenu('actions')">
        <a-select
          mode="multiple"
          v-decorator="rules.actions"
          :placeholder="I18nSelect(I18nMenu('actions'))"
          :options="ActionOptions"
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>
<script>
import { cloneDeep, compact, forEach, last } from 'lodash-es'

import IconSelector from '@/components/IconSelector'
import { Flag } from '@/constant'
import { ActionOptions } from '@/constant/action'
import { I18nEntry, I18nGlobal, I18nMenu, I18nSelect } from '@/constant/i18n'
import MenuIcon from '@/core/icons'
export default {
  name: 'FormDrawer',
  props: ['data', 'rules', 'form'],
  components: {
    IconSelector
  },
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nSelect,
      I18nMenu,
      ActionOptions,
      Flag,
      MenuIcon,
      iconValue: ''
    }
  },
  computed: {
    menuTree() {
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
  },
  methods: {
    changePath(e) {
      const data = e.target.value
      if (data) {
        const values = compact(data.split('/'))
        this.form.setFieldsValue({
          name: last(values),
          component: data.replace(/^\//, ''),
          meta: {
            title: `menu.${values.join('.')}`,
            permission: last(values)
          }
        })
      }
    },
    handleIconChange(icon) {
      this.form.setFieldsValue({
        meta: {
          icon
        }
      })
      this.iconValue = icon
    },
    changeIcon(e) {
      this.iconValue = e.target.value
    }
  }
}
</script>
