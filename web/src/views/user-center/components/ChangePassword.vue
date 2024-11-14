<template>
  <a-row :gutter="16">
    <a-col :md="24" :lg="16">
      <a-form layout="vertical" :form="form" @submit="handleSubmit">
        <a-form-item :label="I18nUserCenter(`${TabsKey.changePassword}.old-password`)">
          <a-input-password
            :placeholder="I18nEntry(I18nUserCenter(`${TabsKey.changePassword}.old-password`))"
            v-decorator="[
              'originalPassword',
              {
                rules: [
                  { required: true, message: I18nEntry(I18nUserCenter(`${TabsKey.changePassword}.old-password`)) }
                ],
                validateTrigger: 'change'
              }
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input-password>
        </a-form-item>
        <a-form-item :label="I18nUserCenter(`${TabsKey.changePassword}.password`)">
          <a-input-password
            :placeholder="I18nEntry(I18nUserCenter(`${TabsKey.changePassword}.password`))"
            v-decorator="[
              'password',
              {
                rules: [{ required: true, message: I18nEntry(I18nUserCenter(`${TabsKey.changePassword}.password`)) }],
                validateTrigger: 'change'
              }
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input-password>
        </a-form-item>
        <a-form-item :label="I18nUserCenter(`${TabsKey.changePassword}.confirm-password`)">
          <a-input-password
            :placeholder="I18nEntry(I18nUserCenter(`${TabsKey.changePassword}.confirm-password`))"
            v-decorator="[
              'confirmPassword',
              {
                rules: [
                  { required: true, message: I18nEntry(I18nUserCenter(`${TabsKey.changePassword}.confirm-password`)) },
                  { validator: this.validatorConfirmPassword }
                ],
                validateTrigger: 'change'
              }
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" htmlType="submit" :loading="loading" block>{{ $t(I18nGlobal.Submit) }}</a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>
<script>
import { changeUserPassword } from '@/api/system-manage/user-manage'
import { RequestCode } from '@/constant'
import { I18nEntry, I18nGlobal, I18nUser, I18nUserCenter } from '@/constant/i18n'

import { TabsKey } from './constant'
export default {
  name: 'ChangePassword',
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      I18nGlobal,
      I18nUserCenter,
      TabsKey,
      I18nEntry
    }
  },
  methods: {
    // 验证两次输入密码是否正确
    validatorConfirmPassword(_, value, callback) {
      if (value && value !== this.form.getFieldValue('password')) {
        callback(new Error(I18nUser('confirmPassword.validate')))
      } else {
        callback()
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      const validateFieldsKey = ['originalPassword', 'password', 'confirmPassword']
      this.form.validateFields(validateFieldsKey, { force: true }, async (err, values) => {
        if (!err) {
          this.loading = true
          const params = {
            password: values.originalPassword,
            newPassword: values.password
          }
          await changeUserPassword(params)
            .then(({ code, msg }) => {
              if (code === RequestCode.Success) {
                this.$message.success(msg)
                this.$store.dispatch('Logout').then(() => {
                  window.location.reload()
                })
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
