<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 顶部搜索 -->
      <header-search :query-form="queryForm" @query="query" @onAdd="onAdd" />
      <!-- 表格数据 -->
      <table-list :data="data" :loading="loading" @onEdit="onEdit" @onDelete="onDelete" />
      <!-- 新增/编辑弹窗 -->
      <a-drawer :title="title" :width="600" :visible="visible" :maskClosable="false" @close="onClose">
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
import { assign, get, pick } from 'lodash-es'

import { addMenu, delMenu, getMenuList, updateMenu } from '@/api/system-manage/menu-manage'
import { Flag, RequestCode } from '@/constant'
import { I18nEntry, I18nGlobal, I18nMenu } from '@/constant/i18n'

import FormDrawer from './components/FormDrawer' // 表单抽屉
import HeaderSearch from './components/HeaderSearch.vue' // 顶部搜索
import TableList from './components/TableList.vue' // 表格列表
export default {
  name: 'MenuManage',
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
        parentId: ['parentId'],
        name: ['name', { rules: [{ required: true, message: I18nEntry(I18nMenu('name')) }] }],
        path: ['path', { rules: [{ required: true, message: I18nEntry(I18nMenu('path')) }] }],
        redirect: ['redirect'],
        component: ['component', { rules: [{ required: true, message: I18nEntry(I18nMenu('component')) }] }],
        hidden: ['hidden', { initialValue: Flag.False }],
        actions: ['actions', { initialValue: [] }],
        sort: ['sort', { initialValue: 1, rules: [{ required: true, message: I18nEntry(this.$t(I18nGlobal.Sort)) }] }],
        meta: {
          title: ['meta.title', { rules: [{ required: true, message: I18nEntry(I18nMenu('meta.title')) }] }],
          icon: ['meta.icon', { rules: [{ required: true, message: I18nEntry(I18nMenu('meta.icon')) }] }],
          keepAlive: ['meta.keepAlive', { initialValue: Flag.True }],
          permission: [
            'meta.permission',
            { rules: [{ required: true, message: I18nEntry(I18nMenu('meta.permission')) }] }
          ]
        }
      },
      id: undefined,
      title: '',
      visible: false,
      I18nGlobal
    }
  },
  methods: {
    // 获取菜单列表
    async getList() {
      this.loading = true
      const params = {
        name: this.queryForm.name,
        zhCN: this.queryForm.zhCN
      }
      if (this.queryForm.createdAt?.length) {
        assign(params, {
          startTime: dayjs(this.queryForm.createdAt[0]).startOf('day').valueOf(),
          endTime: dayjs(this.queryForm.createdAt[1]).endOf('day').valueOf()
        })
      }
      const { data, code } = await getMenuList(params)
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
      this.title = `${this.$t(I18nGlobal.Add)}${I18nMenu()}`
    },
    // 编辑
    onEdit(record) {
      this.visible = true
      this.title = `${this.$t(I18nGlobal.Edit)}${I18nMenu()}：${record.name}`
      this.id = record.id
      // 使用 $nextTick 确保 DOM 更新后再设置表单值
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(record, ['parentId', 'name', 'path', 'redirect', 'component', 'hidden', 'actions', 'sort', 'meta'])
        )
      })
    },
    // 删除
    async onDelete(record) {
      await delMenu(record.id).then((res) => {
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
          const params = { id, ...values }
          this.loginState = true
          await (id ? updateMenu : addMenu)(params)
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
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
    })
  }
}
</script>
