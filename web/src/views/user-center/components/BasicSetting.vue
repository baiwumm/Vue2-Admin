<template>
  <a-form :form="form" @submit="handleSubmit">
    <form-drawer :rules="rules" :is-user-center="true" />
    <a-row type="flex" justify="center">
      <a-button type="primary" html-type="submit" :loading="loading">
        {{ $t(I18nGlobal.Confirm) }}
      </a-button>
    </a-row>
  </a-form>
</template>
<script>
import { assign, keys, pick } from 'lodash-es'

import { updateUser } from '@/api/system-manage/user-manage'
import { RequestCode, Sex, Status } from '@/constant'
import { I18nEntry, I18nGlobal, I18nSelect, I18nUser } from '@/constant/i18n'
import FormDrawer from '@/views/system-manage/user-manage/components/FormDrawer'
export default {
  name: 'BasicSetting',
  components: {
    FormDrawer
  },
  data() {
    return {
      form: this.$form.createForm(this),
      rules: {
        userName: [
          'userName',
          { rules: [{ required: true, whitespace: true, message: I18nEntry(I18nUser('userName')) }] }
        ],
        cnName: ['cnName', { rules: [{ required: true, whitespace: true, message: I18nEntry(I18nUser('cnName')) }] }],
        phone: [
          'phone',
          { rules: [{ required: true, message: I18nEntry(I18nUser('phone')) }, { validator: this.validatorPhone }] }
        ],
        email: [
          'email',
          {
            rules: [
              {
                type: 'email',
                message: I18nUser('email.validate')
              },
              { required: true, message: I18nEntry(I18nUser('email')) }
            ]
          }
        ],
        sex: ['sex', { initialValue: Sex.Male, rules: [{ required: true }] }],
        status: ['status', { initialValue: Status.Active, rules: [{ required: true }] }],
        sort: ['sort', { initialValue: 1, rules: [{ required: true, message: I18nEntry(this.$t(I18nGlobal.Sort)) }] }],
        roleId: ['roleId', { rules: [{ required: true, message: I18nSelect(I18nUser('roleId')) }] }],
        orgId: ['orgId', { rules: [{ required: true, message: I18nSelect(I18nUser('orgId')) }] }],
        postId: ['postId', { rules: [{ required: true, message: I18nSelect(I18nUser('postId')) }] }],
        city: ['city', { rules: [{ required: true, message: I18nSelect(I18nUser('city')) }] }],
        address: ['address'],
        tags: [
          'tags',
          {
            initialValue: [],
            rules: [{ required: true, message: I18nEntry(I18nUser('tags')) }]
          }
        ],
        avatar: ['avatar', { rules: [{ required: true, message: I18nSelect(I18nUser('avatar')) }] }],
        password: [
          'password',
          { rules: [{ required: true, whitespace: true, message: I18nEntry(I18nUser('password')) }] }
        ],
        confirmPassword: [
          'confirmPassword',
          {
            rules: [
              { required: true, whitespace: true, message: I18nEntry(I18nUser('confirmPassword')) },
              { validator: this.validatorConfirmPassword }
            ]
          }
        ]
      },
      I18nGlobal,
      loading: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.loading = true
          await updateUser({ ...values, ...pick(this.userInfo, ['id', 'tags']) })
            .then(async ({ code, msg }) => {
              if (code === RequestCode.Success) {
                this.$message.success(msg)
                assign(this.$store.getters.userInfo, values)
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.userInfo, keys(this.rules)))
    })
  }
}
</script>
