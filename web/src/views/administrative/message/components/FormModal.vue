<template>
  <a-row :gutter="16">
    <a-col :span="24">
      <a-form-item :label="I18nMessage('title')">
        <a-input
          v-decorator="rules.title"
          :placeholder="I18nEntry(I18nMessage('title'))"
          :max-length="50"
          allow-clear
        />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="I18nMessage('pinned')">
        <a-radio-group v-decorator="rules.pinned">
          <a-radio :value="Flag.True"> {{ $t(I18nGlobal.Yes) }} </a-radio>
          <a-radio :value="Flag.False"> {{ $t(I18nGlobal.No) }} </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="$t(I18nGlobal.Status)">
        <a-radio-group v-decorator="rules.status">
          <a-radio :value="Status.Active"> {{ $t(I18nGlobal.StatusNormal) }} </a-radio>
          <a-radio :value="Status.Inactive"> {{ $t(I18nGlobal.StatusForbidden) }} </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label="I18nMessage('content')">
        <quill-editor v-decorator="rules.content" />
      </a-form-item>
    </a-col>
  </a-row>
</template>
<script>
import QuillEditor from '@/components/Editor/QuillEditor.vue'
import { CommonText, Flag, Status } from '@/constant'
import { ActionOptions } from '@/constant/action'
import { I18nEntry, I18nGlobal, I18nMessage, I18nSelect } from '@/constant/i18n'
import MenuIcon from '@/core/icons'
export default {
  name: 'FormModal',
  components: {
    QuillEditor
  },
  props: ['data', 'rules'],
  data() {
    return {
      I18nGlobal,
      I18nEntry,
      I18nSelect,
      I18nMessage,
      ActionOptions,
      CommonText,
      MenuIcon,
      Status,
      Flag
    }
  }
}
</script>
