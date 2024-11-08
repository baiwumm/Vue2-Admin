<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-space direction="vertical" :size="24">
        <!-- 顶部搜索 -->
        <header-search :query-form="queryForm" @query="query" @onAdd="onAdd" />
        <!-- 表格数据 -->
        <table-list
          :data="data"
          :loading="loading"
          @onEdit="onEdit"
          @onDelete="onDelete"
          :pagination="pagination"
          @query="query"
        />
      </a-space>
      <!-- 新增/编辑弹窗 -->
      <a-modal
        :title="title"
        :width="800"
        :visible="visible"
        :maskClosable="false"
        @cancel="onClose"
        @ok="handleSubmit"
        :loading="loginState"
        :okButtonProps="{
          disabled: loginState
        }"
      >
        <a-form :form="form">
          <form-modal :rules="rules" :data="data" />
        </a-form>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import dayjs from 'dayjs'
import { assign, forEach, get, pick } from 'lodash-es'

import { addMessage, delMessage, getMessageList, updateMessage } from '@/api/administrative/message'
import { Flag, RequestCode, Status } from '@/constant'
import { I18nEntry, I18nGlobal, I18nMessage } from '@/constant/i18n'

import FormModal from './components/FormModal' // 表单抽屉
import HeaderSearch from './components/HeaderSearch.vue' // 顶部搜索
import TableList from './components/TableList.vue' // 表格列表
export default {
  name: 'Message',
  components: {
    TableList,
    HeaderSearch,
    FormModal
  },
  data() {
    return {
      current: 1,
      size: 10,
      data: [],
      loading: false,
      dayjs,
      rules: {
        title: ['title', { rules: [{ required: true, whitespace: true, message: I18nEntry(I18nMessage('title')) }] }],
        pinned: ['pinned', { initialValue: Flag.False, rules: [{ required: true }] }],
        status: ['status', { initialValue: Status.Active, rules: [{ required: true }] }],
        content: ['content', { rules: [{ required: true, message: I18nEntry(I18nMessage('content')) }] }]
      },
      queryForm: {},
      form: this.$form.createForm(this),
      loginState: false,
      id: undefined,
      title: '',
      visible: false,
      I18nGlobal,
      menuList: [],
      checkedKeys: [],
      I18nMessage,
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
    // 获取角色列表
    async getList() {
      this.loading = true
      const params = {
        current: this.pagination.current,
        size: this.pagination.pageSize,
        ...pick(this.queryForm, ['userId', 'title', 'status'])
      }
      if (this.queryForm.createdAt?.length) {
        assign(params, {
          startTime: dayjs(this.queryForm.createdAt[0]).startOf('day').valueOf(),
          endTime: dayjs(this.queryForm.createdAt[1]).endOf('day').valueOf()
        })
      }
      const { data, code } = await getMessageList(params)
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
      this.title = `${this.$t(I18nGlobal.Add)}${I18nMessage()}`
    },
    // 编辑
    onEdit(record) {
      this.visible = true
      this.title = `${this.$t(I18nGlobal.Edit)}${I18nMessage()}`
      this.id = record.id
      // 使用 $nextTick 确保 DOM 更新后再设置表单值
      this.$nextTick(() => {
        const checkedKeys = []
        const halfCheckedKeys = []
        forEach(record.permissions, (p) => {
          if (p.actions.length) {
            forEach(p.actions, (action) => {
              checkedKeys.push(`${p.menuId}:${action}`)
            })
          } else if (p.menu.redirect) {
            halfCheckedKeys.push(p.menuId)
          } else {
            checkedKeys.push(p.menuId)
          }
        })
        this.checkedKeys = checkedKeys
        this.form.setFieldsValue({
          ...pick(record, ['title', 'pinned', 'status', 'content'])
        })
      })
    },
    // 删除
    async onDelete(record) {
      await delMessage(record.id).then((res) => {
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
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const id = this.id
          const params = { id, ...values }
          this.loginState = true
          await (id ? updateMessage : addMessage)(params)
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
