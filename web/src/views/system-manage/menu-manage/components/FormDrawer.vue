<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-form-item :label="$t(I18nGlobal.Parent)">
        <a-tree-select
          v-decorator="rules.parentId"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="data"
          :placeholder="I18nSelect($t(I18nGlobal.Parent))"
          tree-default-expand-all
          allow-clear
          :replace-fields="{
            title: 'name',
            key: 'id',
            value: 'id'
          }"
        >
          <span slot="title" slot-scope="{ meta }">
            {{ $t(meta.title) }}
          </span>
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
        <a-input v-decorator="rules.path" :placeholder="I18nEntry(I18nMenu('path'))" :max-length="200" allow-clear />
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
        <a-input
          v-decorator="rules.meta.icon"
          :placeholder="I18nEntry(I18nMenu('meta.icon'))"
          :max-length="200"
          allow-clear
        />
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
import { Flag } from '@/constant'
import { ActionOptions } from '@/constant/action'
import { I18nEntry, I18nGlobal, I18nMenu, I18nSelect } from '@/constant/i18n'
export default {
  name: 'FormModal',
  props: ['data', 'rules'],
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nSelect,
      I18nMenu,
      ActionOptions,
      Flag
    }
  }
}
</script>
