<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="8" :sm="24">
                        <a-form-item label="菜单名称">
                            <a-input placeholder="请输入菜单名称" v-model="subTitle" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="24">
                        <a-form-item label="用户权限Key">
                            <a-input placeholder="请输入用户权限Key" v-model="permission" allowClear />
                        </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="24">
                        <span class="table-page-search-submitButtons">
                            <a-button type="primary" @click="query" v-action:query>查询</a-button>
                        </span>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <!-- 表格数据 -->
        <a-table
            :columns="columns"
            rowKey="ID"
            :data-source="data"
            :pagination="pagination"
            @change="tableChange"
            :loading="loading"
            :defaultExpandAllRows="true"
        >
            <span slot="actions" slot-scope="text, record">
                <a-tag v-for="(item, index) in record.actions" color="purple" :key="index">{{ item.describe }}</a-tag>
            </span>
            <span slot="action" slot-scope="text, record" v-if="!record.redirect">
                <a @click="onEdit(record)">编辑</a>
            </span>
        </a-table>
        <!-- 抽屉-编辑权限 -->
        <a-drawer :title="title" :width="600" :visible="visible" @close="onClose">
            <a-form ref="formLogin" :form="form" @submit="handleSubmit">
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="用户权限Key">
                            <a-input v-decorator="rules.permission" disabled />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="菜单名称">
                            <a-input v-decorator="rules.subTitle" disabled />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="可操作性权限">
                            <a-select
                                v-decorator="rules.actions"
                                mode="multiple"
                                style="width: 100%"
                                placeholder="请选择操作权限"
                            >
                                <a-select-option v-for="item in actionList" :key="item.ActionID" :value="item.key">
                                    {{ item.label }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
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
                        zIndex: 1,
                    }"
                >
                    <a-button type="primary" htmlType="submit" :loading="loginState" :disabled="loginState">
                        提交
                    </a-button>
                </div>
            </a-form>
        </a-drawer>
    </a-card>
</template>

<script>
import { Action, updateActionList } from '@/api/system'
import { dataFormat, treeData } from '@/utils/util.js'
export default {
    data() {
        return {
            columns: [
                { title: '菜单名称', dataIndex: 'subTitle', key: 'subTitle', ellipsis: true },
                { title: '用户权限Key', dataIndex: 'permission', key: 'permission', ellipsis: true },
                {
                    title: '可操作性权限',
                    dataIndex: 'actions',
                    key: 'actions',
                    ellipsis: true,
                    scopedSlots: { customRender: 'actions' },
                },
                {
                    title: '操作',
                    width: '60px',
                    dataIndex: 'action',
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            data: [],
            permission: '',
            subTitle: '',
            pagination: {
                total: 0,
                defaultCurrent: 1,
                defaultPageSize: 20,
                showTotal: (total) => `共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['20', '40', '60', '100'],
            },
            loading: false,
            title: '',
            visible: false,
            form: this.$form.createForm(this),
            loginState: false,
            rules: {
                permission: ['permission', { initialValue: '' }],
                subTitle: ['subTitle', { initialValue: '' }],
                actions: ['actions', { initialValue: [] }],
            },
            actionList: [],
            ID: '',
        }
    },
    methods: {
        tableChange(e) {
            this.pagination.defaultCurrent = e.current
            this.pagination.defaultPageSize = e.pageSize
            this.getActionList()
        },
        async getActionList() {
            let _this = this
            _this.loading = true
            let params = {
                permission: _this.permission,
                subTitle: _this.subTitle,
                current: _this.pagination.defaultCurrent,
                pageSize: _this.pagination.defaultPageSize,
            }
            await Action(params).then((res) => {
                if (res.state == 1) {
                    _this.actionList = res.actionList
                    res.result.list.forEach((v) => {
                        if (v.actions) v.actions = JSON.parse(v.actions)
                    })
                    _this.data = treeData(res.result.list, 'ID', 'parentId', 'children')
                    _this.pagination.total = res.result.total
                    _this.loading = false
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        query() {
            this.pagination.defaultCurrent = 1
            this.getActionList()
        },
        // 编辑
        onEdit(record) {
            let _this = this
            _this.visible = true
            _this.title = '编辑权限:' + record.subTitle
            _this.ID = record.ID
            let keys = Object.keys(_this.rules)
            keys.map((v) => {
                if (v == 'actions') {
                    let action = []
                    if (record[v] && record[v].length) {
                        record[v].map((v) => {
                            action.push(v.action)
                        })
                    }
                    _this.rules[v][1].initialValue = action
                } else _this.rules[v][1].initialValue = record[v]
            })
        },
        // 保存
        handleSubmit(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
            } = _this
            _this.loginState = true
            const validateFieldsKey = ['permission', 'subTitle', 'actions']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const params = { ...values }
                    params.ID = _this.ID
                    _this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await updateActionList(params)
                                .then((res) => {
                                    if (res.state == 1) {
                                        _this.form.resetFields()
                                        let keys = Object.keys(_this.rules)
                                        keys.map((v) => {
                                            if (v == 'actions') _this.rules[v][1].initialValue = []
                                            else _this.rules[v][1].initialValue = ''
                                        })
                                        _this.ID = ''
                                        _this.visible = false
                                        _this.$message.success(res.msg)
                                        _this.getActionList()
                                    } else {
                                        _this.$message.error(res.msg)
                                    }
                                })
                                .finally(() => {
                                    setTimeout(() => {
                                        _this.loginState = false
                                    }, 600)
                                })
                        },
                        onCancel() {
                            _this.loginState = false
                        },
                    })
                } else {
                    setTimeout(() => {
                        _this.loginState = false
                    }, 600)
                }
            })
        },
        onClose() {
            let _this = this
            _this.visible = false
            _this.form.resetFields()
            _this.ID = ''
            let keys = Object.keys(_this.rules)
            keys.map((v) => {
                if (v == 'actions') _this.rules[v][1].initialValue = []
                else _this.rules[v][1].initialValue = ''
            })
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.getActionList()
        })
    },
}
</script>

<style>
</style>