<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 顶部搜索 -->
      <header-search :query-form="queryForm" @query="query" @onAdd="onAdd" />
      <!-- 表格数据 -->
      <table-list :data="data" :loading="loading" @onEdit="onEdit" @onDelete="onDelete" />
      <!-- 新增/编辑弹窗 -->
      <a-drawer :title="title" :width="400" :visible="visible" :maskClosable="false" @close="onClose">
        <a-form :form="form">
          <form-drawer :rules="rules" :data="data" />
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
import { get, keys, pick } from 'lodash-es'

import { addOrg, delOrg, getOrgList, updateOrg } from '@/api/administrative/organization'
import { RequestCode } from '@/constant'
import { I18nEntry, I18nGlobal, I18nOrganization } from '@/constant/i18n'

import FormDrawer from './components/FormDrawer' // 表单抽屉
import HeaderSearch from './components/HeaderSearch.vue' // 顶部搜索
import TableList from './components/TableList.vue' // 表格列表
export default {
  name: 'Organization',
  components: {
    TableList,
    HeaderSearch,
    FormDrawer
  },
  data() {
    return {
      data: [],
      loading: false,
      dayjs,
      rules: {
        parentId: ['parentId'],
        name: ['name', { rules: [{ required: true, message: I18nEntry(I18nOrganization('name')) }] }],
        code: ['code', { rules: [{ required: true, message: I18nEntry(I18nOrganization('code')) }] }],
        description: [
          'description',
          { rules: [{ required: true, message: I18nEntry(I18nOrganization('description')) }] }
        ],
        sort: ['sort', { initialValue: 1, rules: [{ required: true, message: I18nEntry(this.$t(I18nGlobal.Sort)) }] }]
      },
      queryForm: {},
      form: this.$form.createForm(this),
      loginState: false,
      id: undefined,
      title: '',
      visible: false,
      I18nGlobal,
      checkedKeys: [],
      I18nOrganization
    }
  },
  methods: {
    // 获取组织列表
    async getList() {
      this.loading = true
      const params = {
        name: this.queryForm.name,
        code: this.queryForm.code
      }
      const { data, code } = await getOrgList(params)
      if (code === RequestCode.Success) {
        this.data = get(data, 'records', [])
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
      this.title = `${this.$t(I18nGlobal.Add)}${I18nOrganization()}`
    },
    // 编辑
    onEdit(record) {
      this.visible = true
      this.title = `${this.$t(I18nGlobal.Edit)}${I18nOrganization()}：${record.name}`
      this.id = record.id
      // 使用 $nextTick 确保 DOM 更新后再设置表单值
      this.$nextTick(() => {
        this.form.setFieldsValue({
          ...pick(record, keys(this.rules))
        })
      })
    },
    // 删除
    async onDelete(record) {
      await delOrg(record.id).then((res) => {
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
      this.checkedKeys = []
      this.form.resetFields()
    },
    // 保存
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, { menus, ...values }) => {
        if (!err) {
          const id = this.id
          const params = { id, ...values }
          this.loginState = true
          await (id ? updateOrg : addOrg)(params)
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
    onCheckTree(checkedKeys, e) {
      this.form.setFieldsValue({ menus: [...checkedKeys, ...e.halfCheckedKeys] })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
    })
  }
}
</script>
