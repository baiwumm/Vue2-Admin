<template>
    <page-header-wrapper content="动态路由权限配置">
        <a-card :bordered="false">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="名称">
                                <a-input placeholder="请输入" v-model="queryForm.routerName" allowClear />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="创建时间">
                                <a-range-picker v-model="queryForm.createTime" valueFormat="YYYY-MM-DD" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <span class="table-page-search-submitButtons">
                                <a-space>
                                    <a-button type="primary" @click="query" v-action:query>查询</a-button>
                                    <a-button type="primary" @click="addMenu" v-action:add>添加</a-button>
                                </a-space>
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
                <span slot="keepAlive" slot-scope="text, record">
                    {{ record.keepAlive ? '是' : '否' }}
                </span>
                <span slot="hidden" slot-scope="text, record">
                    {{ record.hidden == 0 ? '是' : '否' }}
                </span>
                <span slot="icon" slot-scope="text, record">
                    <a-icon
                        :component="iconfontSvg(record.icon)"
                        :style="{ fontSize: '20px', color: 'rgb(24, 144, 255)' }"
                        v-if="record.icon && record.icon.includes('Icon')"
                    />
                    <a-icon
                        :type="iconfontSvg(record.icon)"
                        :style="{ fontSize: '20px', color: 'rgb(24, 144, 255)' }"
                        v-else-if="record.icon"
                    />
                </span>
                <span slot="permission" slot-scope="text, record">
                    <a-tag color="purple" v-if="record.permission">
                        {{ record.permission }}
                    </a-tag>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="onEdit(record)" v-action:edit>编辑</a>
                    <a-divider type="vertical" />
                    <a @click="onDelete(record)" v-action:delete>删除</a>
                </span>
            </a-table>

            <!-- 抽屉-添加编辑 -->
            <a-drawer :title="title" :width="600" :visible="visible" @close="onClose" :maskClosable="false">
                <a-form :form="form" @submit="handleSubmit">
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="父级">
                                <a-tree-select
                                    v-decorator="rules.parentId"
                                    style="width: 100%"
                                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                    :tree-data="parentList"
                                    placeholder="请选择父级"
                                    tree-default-expand-all
                                >
                                    <!-- <template slot-scope="text" slot="home">
                                        <a-icon type="cluster" />
                                        {{ text.value }}
                                    </template> -->
                                    <!-- <a-icon
                                        slot="home"
                                        slot-scope="item"
                                        :component="iconfontSvg(item.icon)"
                                        style="color: rgb(24, 144, 255)"
                                        v-if="item.icon && item.icon.includes('Icon')"
                                    />
                                    <a-icon
                                        slot="home"
                                        slot-scope="item"
                                        :type="iconfontSvg(item.icon)"
                                        style="color: rgb(24, 144, 255)"
                                        v-else-if="item.icon"
                                    /> -->
                                </a-tree-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="名称">
                                <a-input v-decorator="rules.name" placeholder="请输入名称" allowClear />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="路由路径">
                                <a-input v-decorator="rules.path" placeholder="请输入路由路径" allowClear />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="重定向">
                                <a-input v-decorator="rules.redirect" placeholder="请输入重定向" allowClear />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="vue文件路径">
                                <a-input v-decorator="rules.component" placeholder="请输入vue文件路径" allowClear />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="标题">
                                <a-input v-decorator="rules.subTitle" placeholder="请输入标题" allowClear />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="图标icon">
                                <a-input v-decorator="rules.icon" placeholder="请输入图标icon" allowClear />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="用户权限Key">
                                <a-input v-decorator="rules.permission" placeholder="请输入用户权限Key" allowClear />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="是否隐藏">
                                <a-radio-group v-decorator="rules.hidden">
                                    <a-radio :value="1"> 否 </a-radio>
                                    <a-radio :value="0"> 是 </a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="是否缓存">
                                <a-radio-group v-decorator="rules.keepAlive">
                                    <a-radio :value="1"> 是 </a-radio>
                                    <a-radio :value="0"> 否 </a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="国际化字段">
                                <a-input v-decorator="rules.title" placeholder="请输入国际化字段" allowClear />
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
import { Menu, addMenu, deleteMenu } from '@/api/system'
import { dataFormat, treeData } from '@/utils/util.js'
import iconfont from '@/core/icons'
import cloneDeep from 'lodash/cloneDeep'
export default {
    data() {
        return {
            columns: [
                { title: '名称', dataIndex: 'name', key: 'name', align: 'center', ellipsis: true },
                { title: '路径', dataIndex: 'path', key: 'path', ellipsis: true, align: 'center' },
                { title: '重定向', dataIndex: 'redirect', key: 'redirect', ellipsis: true, align: 'center' },
                { title: 'vue文件路径', dataIndex: 'component', key: 'component', ellipsis: true, align: 'center' },
                { title: '标题', dataIndex: 'subTitle', key: 'subTitle', align: 'center' },
                { title: '国际化字段', dataIndex: 'title', key: 'title', align: 'center', ellipsis: true },
                {
                    title: '图标',
                    dataIndex: 'icon',
                    key: 'icon',
                    scopedSlots: { customRender: 'icon' },
                    align: 'center',
                },
                {
                    title: '是否缓存',
                    dataIndex: 'keepAlive',
                    key: 'keepAlive',
                    align: 'center',
                    scopedSlots: { customRender: 'keepAlive' },
                },
                {
                    title: '是否隐藏',
                    dataIndex: 'hidden',
                    key: 'hidden',
                    scopedSlots: { customRender: 'hidden' },
                    align: 'center',
                },
                {
                    title: '用户权限Key',
                    dataIndex: 'permission',
                    key: 'permission',
                    align: 'center',
                    scopedSlots: { customRender: 'permission' },
                },
                { title: '创建时间', dataIndex: 'createTime', key: 'createTime', ellipsis: true },
                {
                    title: '操作',
                    width: '110px',
                    dataIndex: 'action',
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            data: [],
            queryForm: {},
            pagination: {
                total: 0,
                defaultCurrent: 1,
                defaultPageSize: 60,
                showTotal: (total, range) => `第${range[0]}-${range[1]}条/总共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['20', '40', '60', '100'],
            },
            loading: false,
            form: this.$form.createForm(this),
            visible: false,
            title: '',
            loading: false,
            loginState: false,
            parentList: [],
            rules: {
                parentId: ['parentId', { rules: [{ required: true, message: '请选择父级' }] }],
                name: ['name', { rules: [{ required: true, message: '请输入名称' }] }],
                path: ['path', { rules: [{ required: true, message: '请输入路由路径' }] }],
                redirect: ['redirect'],
                component: ['component', { rules: [{ required: true, message: '请输入vue文件路径' }] }],
                title: ['title', { rules: [{ required: true, message: '请输入标题' }] }],
                icon: ['icon'],
                permission: [
                    'permission',
                    {
                        initialValue: '',
                        rules: [{ required: true, message: '请输入用户权限Key' }],
                    },
                ],
                hidden: ['hidden', { initialValue: 1, rules: [{ required: true, message: '请选择是否隐藏' }] }],
                keepAlive: ['keepAlive', { initialValue: 1, rules: [{ required: true, message: '请选择是否缓存' }] }],
                subTitle: ['subTitle', { rules: [{ required: true, message: '请输入国际化字段' }] }],
            },
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
            this.getMenuList()
        },
        async getMenuList() {
            let _this = this
            _this.loading = true
            let params = {
                routerName: _this.queryForm.routerName,
                createTime: JSON.stringify(_this.queryForm.createTime),
                current: _this.pagination.defaultCurrent,
                pageSize: _this.pagination.defaultPageSize,
            }
            await Menu(params).then((res) => {
                if (res.state == 1) {
                    res.result.list.forEach((v) => {
                        v.createTime = dataFormat(v.createTime, 'yyyy-MM-dd hh:mm:ss')
                    })
                    _this.data = treeData(res.result.list, 'ID', 'parentId', 'children')
                    _this.pagination.total = res.result.total
                    res.parentList.forEach((v) => {
                        v.value = v.ID
                        v.key = v.ID
                        // v.scopedSlots = {
                        //     title: v.icon,
                        // }
                    })
                    _this.parentList = treeData(res.parentList, 'ID', 'parentId', 'children')
                    _this.loading = false
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        query() {
            this.pagination.defaultCurrent = 1
            this.getMenuList()
        },
        // 添加编辑
        addMenu() {
            let _this = this
            _this.visible = true
            _this.title = '添加路由菜单'
        },
        showDrawer() {
            this.visible = true
        },
        handleSubmit(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
            } = _this
            _this.loginState = true
            const validateFieldsKey = [
                'parentId',
                'name',
                'path',
                'redirect',
                'component',
                'title',
                'icon',
                'keepAlive',
                'hidden',
                'permission',
                'subTitle',
            ]
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const params = { ...values }
                    params.ID = _this.ID
                    _this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await addMenu(params)
                                .then((res) => {
                                    if (res.state == 1) {
                                        _this.form.resetFields()
                                        _this.ID = ''
                                        _this.visible = false
                                        _this.$message.success(res.msg)
                                        _this.getMenuList()
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
        onClose() {
            let _this = this
            _this.visible = false
            _this.form.resetFields()
            _this.ID = ''
        },
        // 编辑表格数据
        onEdit(record) {
            let _this = this,
                cloneData = cloneDeep(record)
            _this.visible = true
            _this.title = '编辑菜单:' + cloneData.subTitle
            _this.ID = cloneData.ID
            delete cloneData.ID
            delete cloneData.children
            delete cloneData.actions
            delete cloneData.createTime
            _this.$nextTick(() => {
                _this.form.setFieldsValue(cloneData)
            })
        },
        // 删除数据
        onDelete(record) {
            let _this = this
            let params = {
                ID: record.ID,
                subTitle: record.subTitle,
            }
            _this.$confirm({
                title: '确认操作',
                content: '此操作将删除此菜单和子菜单,请谨慎操作,您确认提交吗?',
                onOk: async () => {
                    await deleteMenu(params).then((res) => {
                        if (res.state == 1) {
                            _this.$message.success(res.msg)
                            _this.getMenuList()
                        } else {
                            _this.$message.error(res.msg)
                        }
                    })
                },
            })
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.getMenuList()
        })
    },
}
</script>

<style>
</style>