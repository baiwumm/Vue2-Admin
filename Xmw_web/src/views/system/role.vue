<template>
    <page-header-wrapper content="该模块主要给角色组赋予路由菜单和按钮操作权限">
        <a-card :bordered="false">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="角色名称">
                                <a-input placeholder="请输入角色名称" allowClear v-model="roleName" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="状态">
                                <a-select placeholder="请选择状态" allowClear v-model="status">
                                    <a-select-option value="1">正常</a-select-option>
                                    <a-select-option value="0">禁用</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <span class="table-page-search-submitButtons">
                                <a-space>
                                    <a-button type="primary" @click="query" v-action:query>查询</a-button>
                                    <a-button type="primary" @click="addRole" v-action:add>添加</a-button>
                                </a-space>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <!-- 表格数据 -->
            <a-table
                :columns="columns"
                rowKey="roleID"
                :data-source="data"
                :pagination="pagination"
                @change="tableChange"
                :loading="loading"
                :defaultExpandAllRows="true"
            >
                <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
                    <a-row :gutter="24">
                        <a-col
                            :span="12"
                            v-for="(role, index) in record.roleList"
                            :key="index"
                            :style="{ margin: '5px 0', height: '22px' }"
                        >
                            <a-col :span="6">
                                <span>{{ role.permissionName }}：</span>
                            </a-col>
                            <a-col :span="18" v-if="role.actionList.length">
                                <a-tag color="purple" v-for="(action, k) in role.actionList" :key="k">{{
                                    actionList[action]
                                }}</a-tag>
                            </a-col>
                            <a-col :span="18" v-else>-</a-col>
                        </a-col>
                    </a-row>
                </div>
                <span slot="status" slot-scope="text, record">
                    <a-tag :color="record.status ? 'blue' : 'red'">
                        {{ record.status ? '启用' : '禁用' }}
                    </a-tag>
                </span>
                <span slot="createTime" slot-scope="text, record">
                    {{ record.createTime, }}
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="onEdit(record)" v-action:edit>编辑</a>
                    <a-divider type="vertical" />
                    <a @click="onDelete(record)" v-action:delete>删除</a>
                </span>
            </a-table>
            <!-- 抽屉-编辑权限 -->
            <a-drawer :title="title" :width="600" :visible="visible" @close="onClose" :maskClosable="false">
                <a-form ref="formLogin" :form="form" @submit="handleSubmit">
                    <a-row>
                        <a-col :span="24">
                            <a-form-item label="角色名称">
                                <a-input v-decorator="rules.roleName" placeholder="请输入角色名称" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="状态">
                                <a-radio-group v-decorator="rules.status">
                                    <a-radio :value="1"> 启用 </a-radio>
                                    <a-radio :value="0"> 禁用 </a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="角色权限">
                                <a-tree
                                    v-model="checkedKeys"
                                    checkable
                                    show-icon
                                    :tree-data="treeData"
                                    @check="onCheckTree"
                                >
                                    <!-- <a-icon
                                        slot="icon"
                                        :type="item.icon"
                                        slot-scope="item"
                                        style="color: rgb(24, 144, 255)"
                                    /> -->
                                    <a-icon
                                        slot="icon"
                                        slot-scope="item"
                                        :component="iconfontSvg(item.icon)"
                                        style="color: rgb(24, 144, 255)"
                                        v-if="item.icon && item.icon.includes('Icon')"
                                    />
                                    <a-icon
                                        slot="icon"
                                        slot-scope="item"
                                        :type="iconfontSvg(item.icon)"
                                        style="color: rgb(24, 144, 255)"
                                        v-else-if="item.icon"
                                    />
                                </a-tree>
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
import { Role, updateRoleList, deleteRole } from '@/api/system'
import { dataFormat, treeData } from '@/utils/util.js'
import { TreeSelect } from 'ant-design-vue'
import iconfont from '@/core/icons'
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'role',
    data() {
        return {
            columns: [
                { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
                { title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' } },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                },
                {
                    title: '更新时间',
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                },
                {
                    title: '操作',
                    width: '110px',
                    dataIndex: 'action',
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            data: [],
            pagination: {
                total: 0,
                defaultCurrent: 1,
                defaultPageSize: 20,
                showTotal: (total, range) => `第${range[0]}-${range[1]}条/总共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['20', '40', '60', '100'],
            },
            loading: false,
            roleName: '',
            status: undefined,
            title: '',
            visible: false,
            roleID: '',
            form: this.$form.createForm(this),
            loginState: false,
            rules: {
                roleName: ['roleName', { rules: [{ required: true, message: '请输入角色名称' }] }],
                status: ['status', { initialValue: 1, rules: [{ required: true, message: '请选择状态' }] }],
            },
            treeData: [],
            SHOW_ALL: TreeSelect.SHOW_ALL,
            checkedKeys: [],
            duplicateKeys: [],
            actionList: {},
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
            this.getRoleList()
        },
        async getRoleList() {
            let _this = this
            _this.permissionList = []
            _this.loading = true
            let params = {
                roleName: _this.roleName,
                status: _this.status,
                current: _this.pagination.defaultCurrent,
                pageSize: _this.pagination.defaultPageSize,
            }
            await Role(params).then((res) => {
                if (res.state == 1) {
                    res.result.list.forEach((v) => {
                        if (v.roleList) v.roleList = JSON.parse(v.roleList)
                        else v.roleList = []
                        v.createTime = dataFormat(v.createTime, 'yyyy-MM-dd hh:mm:ss')
                        v.updateTime = dataFormat(v.updateTime, 'yyyy-MM-dd hh:mm:ss')
                    })
                    _this.data = res.result.list
                    _this.actionList = res.actionList
                    _this.pagination.total = res.result.total
                    // 处理树形数据
                    res.roleList.forEach((v) => {
                        v.key = v.permission
                        if (v.icon) v.scopedSlots = { icon: 'icon' }
                        if (v.actions) v.actions = JSON.parse(v.actions)
                    })
                    res.roleList.forEach((v, index, arr) => {
                        v.children = []
                        if (v.actions && v.actions.length) {
                            v.actions.forEach((e) => {
                                v.children.push({
                                    key: v.permission + '-' + e.action,
                                    title: e.describe,
                                })
                            })
                        }
                    })
                    _this.treeData = treeData(res.roleList, 'ID', 'parentId', 'children')
                    _this.loading = false
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        query() {
            this.pagination.defaultCurrent = 1
            this.getRoleList()
        },
        // 保存
        handleSubmit(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
            } = _this
            // _this.loginState = true
            const validateFieldsKey = ['roleName', 'status']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const params = { ...values }
                    params.roleID = _this.roleID
                    params.roleList = _this.duplicateKeys
                    _this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await updateRoleList(params)
                                .then((res) => {
                                    if (res.state == 1) {
                                        _this.form.resetFields()
                                        _this.roleID = ''
                                        _this.checkedKeys = []
                                        _this.visible = false
                                        _this.$message.success(res.msg)
                                        _this.getRoleList()
                                    } else if (res.state == 2) {
                                        _this.$message.warn(res.msg)
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
        addRole() {
            this.visible = true
            this.title = '添加角色规则'
        },
        onClose() {
            let _this = this
            _this.visible = false
            _this.ID = ''
            _this.checkedKeys = []
            _this.form.resetFields()
        },
        onEdit(record) {
            let _this = this,
                cloneData = cloneDeep(record)
            _this.roleID = record.roleID
            _this.visible = true
            _this.title = '编辑角色规则:' + cloneData.roleName
            _this.$nextTick(() => {
                _this.form.setFieldsValue({
                    roleName: cloneData.roleName,
                    status: cloneData.status,
                })
            })
            cloneData.roleList.map((v) => {
                if (v.actionList.length) {
                    v.actionList.map((e) => {
                        _this.checkedKeys.push(v.permissionId + '-' + e)
                    })
                }
            })
        },
        // 删除
        onDelete(record) {
            let _this = this
            let params = {
                roleID: record.roleID,
                roleName: record.roleName,
            }
            _this.$confirm({
                title: '确认操作',
                content: '您确认提交吗?',
                onOk: async () => {
                    await deleteRole(params).then((res) => {
                        if (res.state == 1) {
                            _this.$message.success(res.msg)
                            _this.getRoleList()
                        } else {
                            _this.$message.error(res.msg)
                        }
                    })
                },
            })
        },
        onCheckTree(checkedKeys, e) {
            let _this = this
            _this.duplicateKeys = Array.from(new Set([...checkedKeys, ...e.halfCheckedKeys]))
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.getRoleList()
        })
    },
}
</script>
