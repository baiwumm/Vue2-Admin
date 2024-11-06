<template>
  <a-row :gutter="16">
    <a-col :span="24">
      <a-form-item :label="I18nRole('name')">
        <a-input v-decorator="rules.name" :placeholder="I18nEntry(I18nRole('name'))" :max-length="200" allow-clear />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nRole('code')">
        <a-input v-decorator="rules.code" :placeholder="I18nEntry(I18nRole('code'))" :max-length="200" allow-clear />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="$t(I18nGlobal.sort)">
        <a-input-number
          v-decorator="rules.sort"
          :placeholder="I18nEntry($t(I18nGlobal.sort))"
          :min="1"
          :max="9999"
          style="width: 100%"
        />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nRole('description')">
        <a-textarea
          v-decorator="rules.description"
          :placeholder="I18nEntry(I18nRole('description'))"
          :max-length="200"
          allow-clear
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>
<script>
import { CommonText } from '@/constant'
import { ActionOptions } from '@/constant/action'
import { I18nEntry, I18nGlobal, I18nRole, I18nSelect } from '@/constant/i18n'
import MenuIcon from '@/core/icons'
export default {
  name: 'FormModal',
  props: ['data', 'rules'],
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nSelect,
      I18nRole,
      ActionOptions,
      CommonText,
      MenuIcon
    }
  }
}
</script>
