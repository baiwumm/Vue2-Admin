<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 顶部搜索 -->
      <header-search :query-form="queryForm" @query="query" @onAdd="onAdd" />
      <!-- 表格数据 -->
      <table-list :data="data" :loading="loading" @onEdit="onEdit" @onDelete="onDelete" :pagination="pagination" />
      <!-- 新增/编辑弹窗 -->
      <a-drawer :title="title" :width="600" :visible="visible" :maskClosable="false" @close="onClose">
        <a-form :form="form">
          <form-drawer :rules="rules" :id="id" style="padding-bottom: 30px" />
        </a-form>
        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1
          }"
        >
          <a-button :style="{ marginRight: '8px' }" @click="onClose">
            {{ $t(I18nGlobal.Cancel) }}
          </a-button>
          <a-button type="primary" @click="handleSubmit" :loading="loginState">
            {{ $t(I18nGlobal.Confirm) }}
          </a-button>
        </div>
      </a-drawer>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import dayjs from 'dayjs'
import { get, keys, omit, pick } from 'lodash-es'

import { addUser, delUser, getUserList, updateUser } from '@/api/system-manage/user-manage'
import { RequestCode, Sex, Status } from '@/constant'
import { I18nEntry, I18nGlobal, I18nSelect, I18nUser } from '@/constant/i18n'

import FormDrawer from './components/FormDrawer' // 表单抽屉
import HeaderSearch from './components/HeaderSearch.vue' // 顶部搜索
import TableList from './components/TableList.vue' // 表格列表
export default {
  name: 'UserManage',
  components: {
    HeaderSearch,
    FormDrawer,
    TableList
  },
  data() {
    return {
      data: [],
      loading: false,
      dayjs,
      queryForm: {},
      form: this.$form.createForm(this),
      loginState: false,
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
      id: undefined,
      title: '',
      visible: false,
      I18nGlobal,
      pagination: {
        total: 0,
        onChange: (page, pageSize) => {
          this.pagination.current = page
          this.pagination.pageSize = pageSize
          this.getList()
        },
        current: 1,
        pageSize: 5,
        showTotal: (total) => this.$t(I18nGlobal.ShowTotal, { total })
      }
    }
  },
  methods: {
    // 获取菜单列表
    async getList() {
      this.loading = true
      const params = {
        current: this.pagination.current,
        size: this.pagination.pageSize,
        ...this.queryForm
      }
      const { data, code } = await getUserList(params)
      if (code === RequestCode.Success) {
        this.data = get(data, 'records', [])
        this.pagination.total = get(data, 'total', 0)
      }
      this.loading = false
    },
    // 查询
    query() {
      this.getList()
    },
    // 新增
    onAdd() {
      this.visible = true
      this.title = `${this.$t(I18nGlobal.Add)}${I18nUser()}`
    },
    // 编辑
    onEdit(record) {
      this.visible = true
      this.title = `${this.$t(I18nGlobal.Edit)}${I18nUser()}：${record.userName}`
      this.id = record.id
      // 使用 $nextTick 确保 DOM 更新后再设置表单值
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(record, keys(this.rules)))
      })
    },
    // 删除
    async onDelete(record) {
      await delUser(record.id).then((res) => {
        if (res.code === RequestCode.Success) {
          this.$message.success(res.msg)
          this.getList()
        }
      })
    },
    // 关闭弹窗
    onClose() {
      this.visible = false
      this.id = undefined
      this.form.resetFields()
    },
    // 保存
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const id = this.id
          const params = { id, ...omit(values, 'confirmPassword') }
          this.loginState = true
          await (id ? updateUser : addUser)(params)
            .then(async ({ code, msg }) => {
              if (code === RequestCode.Success) {
                this.$message.success(msg)
                this.onClose()
                this.getList()
              }
            })
            .finally(() => {
              this.loginState = false
            })
        }
      })
    },
    // 校验手机号码格式
    validatorPhone(_, value, callback) {
      if (value && !/^1\d{10}$/.test(value)) {
        callback(new Error(I18nUser('phone.validate')))
      } else {
        callback()
      }
    },
    // 确认密码
    validatorConfirmPassword(_, value, callback) {
      if (value && value !== this.form.getFieldValue('password')) {
        callback(new Error(I18nUser('confirmPassword.validate')))
      } else {
        callback()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
    })
  }
}
</script>
