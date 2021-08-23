<template>
    <page-header-wrapper content="该模块主要给路由菜单赋予对应的按钮操作权限，需配合封装的指令权限操作。">
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
                <span slot="subTitle" slot-scope="text, record">
                    <a-icon
                        :component="iconfontSvg(record.icon)"
                        :style="{
                            fontSize: '16px',
                            color: 'rgb(24, 144, 255)',
                            marginRight: '5px',
                            verticalAlign: 'middle',
                        }"
                        v-if="record.icon && record.icon.includes('Icon')"
                    />
                    <a-icon
                        :type="iconfontSvg(record.icon)"
                        :style="{
                            fontSize: '16px',
                            color: 'rgb(24, 144, 255)',
                            marginRight: '5px',
                            verticalAlign: 'middle',
                        }"
                        v-else-if="record.icon"
                    />
                    {{ record.subTitle }}
                </span>
                <span slot="permission" slot-scope="text, record">
                    <a-tag color="blue">{{ record.permission }}</a-tag>
                </span>
                <span slot="actions" slot-scope="text, record">
                    <a-tag v-for="(item, index) in record.actions" color="purple" :key="index">{{
                        item.describe
                    }}</a-tag>
                </span>
                <span slot="action" slot-scope="text, record" v-if="!record.redirect">
                    <a @click="onEdit(record)" v-action:edit>编辑</a>
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
    </page-header-wrapper>
</template>

<script>
import { Action, updateActionList } from '@/api/system'
import { treeData } from '@/utils/util.js'
import iconfont from '@/core/icons'
import cloneDeep from 'lodash/cloneDeep'
import pick from 'lodash/pick'
export default {
    name: 'permission',
    data() {
        return {
            columns: [
                {
                    title: '菜单名称',
                    dataIndex: 'subTitle',
                    key: 'subTitle',
                    ellipsis: true,
                    scopedSlots: { customRender: 'subTitle' },
                },
                {
                    title: '用户权限Key',
                    dataIndex: 'permission',
                    key: 'permission',
                    ellipsis: true,
                    scopedSlots: { customRender: 'permission' },
                },
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
                defaultPageSize: 60,
                showTotal: (total, range) => `第${range[0]}-${range[1]}条/总共 ${total} 条数据`,
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
        // 引用图表静态文件
        iconfontSvg(icon) {
            return iconfont[icon] || icon
        },
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
            let _this = this,
                cloneData = cloneDeep(record),
                actions = cloneData.actions
            _this.visible = true
            _this.title = '编辑权限:' + cloneData.subTitle
            _this.ID = cloneData.ID
            cloneData.actions = []
            if (actions && actions.length) {
                actions.map((v) => {
                    cloneData.actions.push(v.action)
                })
            }
            _this.$nextTick(() => {
                _this.form.setFieldsValue(pick(cloneData, ['permission', 'subTitle', 'actions']))
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