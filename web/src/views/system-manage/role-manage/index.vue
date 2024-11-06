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
          <a-form-item :label="I18nRole('menus')">
            <a-tree
              v-decorator="rules.menus"
              v-model="checkedKeys"
              :tree-data="menuList"
              @check="onCheckTree"
              checkable
              show-icon
              :replace-fields="{
                key: 'id',
                title: 'name',
                children: 'children'
              }"
            >
              <template slot="title" slot-scope="record">{{ $t(record.meta.title) }}</template>
            </a-tree>
          </a-form-item>
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
            {{ $t(I18nGlobal.cancel) }}
          </a-button>
          <a-button type="primary" @click="handleSubmit" :loading="loginState">
            {{ $t(I18nGlobal.confirm) }}
          </a-button>
        </div>
      </a-drawer>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import dayjs from 'dayjs'
import { assign, forEach, get, pick } from 'lodash-es'

import { getMenuList } from '@/api/system-manage/menu-manage'
import { addRole, delRole, getRoleList, updateRole } from '@/api/system-manage/role-manage'
import { RequestCode } from '@/constant'
import { I18nEntry, I18nGlobal, I18nRole, I18nSelect } from '@/constant/i18n'

import FormDrawer from './components/FormDrawer' // 表单抽屉
import HeaderSearch from './components/HeaderSearch.vue' // 顶部搜索
import TableList from './components/TableList.vue' // 表格列表
export default {
  name: 'RoleManage',
  components: {
    TableList,
    HeaderSearch,
    FormDrawer
  },
  data() {
    return {
      current: 1,
      size: 10,
      data: [],
      loading: false,
      dayjs,
      rules: {
        name: ['name', { rules: [{ required: true, message: I18nEntry(I18nRole('name')) }] }],
        code: ['code', { rules: [{ required: true, message: I18nEntry(I18nRole('code')) }] }],
        description: ['description', { rules: [{ required: true, message: I18nEntry(I18nRole('description')) }] }],
        sort: ['sort', { initialValue: 1, rules: [{ required: true, message: I18nEntry(this.$t(I18nGlobal.sort)) }] }],
        menus: ['menus', { initialValue: [], rules: [{ required: true, message: I18nSelect(I18nRole('menus')) }] }]
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
      I18nRole
    }
  },
  methods: {
    // 获取菜单列表
    async fetchRoleList() {
      const { data, code } = await getMenuList()
      if (code === RequestCode.Success) {
        const result = get(data, 'records', [])
        // 递归处理
        const loopTree = (tree) => {
          tree.forEach((item) => {
            if (!item.children?.length && item.actions?.length) {
              item.children = []
              item.actions.forEach((action) => {
                item.children.push({
                  id: `${item.id}:${action}`,
                  name: action,
                  meta: {
                    title: `global.${action}`
                  }
                })
              })
            }
            if (item.children?.length) {
              loopTree(item.children)
            }
          })
        }
        loopTree(result)
        this.menuList = result
      }
    },
    // 获取角色列表
    async getList() {
      this.loading = true
      const params = {
        current: this.current,
        size: this.size,
        name: this.queryForm.name,
        code: this.queryForm.code
      }
      if (this.queryForm.createdAt?.length) {
        assign(params, {
          startTime: dayjs(this.queryForm.createdAt[0]).startOf('day').valueOf(),
          endTime: dayjs(this.queryForm.createdAt[1]).endOf('day').valueOf()
        })
      }
      const { data, code } = await getRoleList(params)
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
      this.title = `${this.$t(I18nGlobal.add)}${I18nRole('name')}`
    },
    // 编辑
    onEdit(record) {
      this.visible = true
      this.title = `${this.$t(I18nGlobal.edit)}${I18nRole('name')}：${record.name}`
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
          ...pick(record, ['name', 'code', 'sort', 'description']),
          menus: [...checkedKeys, ...halfCheckedKeys]
        })
      })
    },
    // 删除
    async onDelete(record) {
      await delRole(record.id).then((res) => {
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
          // 创建一个临时对象来收集数据
          const tempObj = {}

          menus.forEach((item) => {
            const [menuId, action] = item.split(':')
            if (!tempObj[menuId]) {
              tempObj[menuId] = []
            }
            if (action) {
              tempObj[menuId].push(action)
            }
          })

          // 将临时对象转换为所需的数组格式
          const result = Object.keys(tempObj).map((menuId) => ({
            menuId,
            actions: tempObj[menuId]
          }))
          const params = { id, menus: result, ...values }
          this.loginState = true
          await (id ? updateRole : addRole)(params)
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
      this.fetchRoleList()
    })
  }
}
</script>
