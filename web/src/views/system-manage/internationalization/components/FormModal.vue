<template>
  <a-row>
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
        </a-tree-select>
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nInternationalization('name')">
        <a-input
          v-decorator="rules.name"
          :placeholder="I18nEntry(I18nInternationalization('name'))"
          :max-length="100"
          allow-clear
        />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nInternationalization('zh-CN')">
        <a-input
          v-decorator="rules.zhCN"
          :placeholder="I18nEntry(I18nInternationalization('zh-CN'))"
          :max-length="500"
          allow-clear
        />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nInternationalization('en-US')">
        <a-input
          v-decorator="rules.enUS"
          :placeholder="I18nEntry(I18nInternationalization('en-US'))"
          :max-length="500"
          allow-clear
        />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nInternationalization('ja-JP')">
        <a-input
          v-decorator="rules.jaJP"
          :placeholder="I18nEntry(I18nInternationalization('ja-JP'))"
          :max-length="500"
          allow-clear
        />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nInternationalization('zh-TW')">
        <a-input
          v-decorator="rules.zhTW"
          :placeholder="I18nEntry(I18nInternationalization('zh-TW'))"
          :max-length="500"
          allow-clear
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>
<script>
import { I18nEntry, I18nGlobal, I18nInternationalization, I18nSelect } from '@/constant/i18n'
export default {
  name: 'FormModal',
  props: ['data', 'rules'],
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nSelect,
      I18nInternationalization
    }
  }
}
</script>
