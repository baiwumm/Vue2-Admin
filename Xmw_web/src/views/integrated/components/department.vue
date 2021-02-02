<template>
    <div class="department">
        <a-card :bordered="false" class="content">
            <a-row :gutter="24">
                <!-- 左侧树结构 -->
                <a-col :span="4">
                    <a-spin :spinning="loading">
                        <a-input-search
                            placeholder="输入点什么"
                            style="width: 100%"
                            @change="onChange"
                            v-model="keyword"
                        />
                        <a-radio-group v-model="category" @change="changeCategory" style="margin-top: 10px">
                            <a-radio-button :value="1"> 部门管理 </a-radio-button>
                            <a-radio-button :value="2"> 岗位管理 </a-radio-button>
                        </a-radio-group>
                        <a-tree
                            :tree-data="organizationTree"
                            @select="changeTree"
                            default-expand-all
                            showIcon
                            v-if="organizationTree.length"
                        >
                            <a-icon slot="smile" :component="iconfontSvg(category)" />
                        </a-tree>

                        <a-empty v-else />
                    </a-spin>
                </a-col>

                <!-- 右侧表格数据 -->
                <a-col :span="20">
                    <div class="table-page-search-wrapper">
                        <a-form layout="inline">
                            <a-row :gutter="48">
                                <a-col :md="6" :sm="24">
                                    <a-form-item label="部门名称">
                                        <a-input placeholder="请输入" v-model="departmentName" allowClear />
                                    </a-form-item>
                                </a-col>
                                <a-col :md="6" :sm="24">
                                    <a-form-item label="创建时间">
                                        <a-range-picker v-model="createTime" valueFormat="YYYY-MM-DD" />
                                    </a-form-item>
                                </a-col>
                                <a-col :md="6" :sm="24">
                                    <span class="table-page-search-submitButtons">
                                        <a-space>
                                            <a-button type="primary" @click="query" v-action:query>查询</a-button>
                                            <a-button type="primary" @click="addDepartment" v-action:add>添加</a-button>
                                        </a-space>
                                    </span>
                                </a-col>
                            </a-row>
                        </a-form>
                    </div>
                    <a-spin :spinning="loading">
                        <a-table
                            v-if="tableData.length"
                            :columns="columns"
                            rowKey="OrganizationID"
                            :data-source="tableData"
                            :pagination="pagination"
                            @change="tableChange"
                            :defaultExpandAllRows="expandAll"
                        >
                            <span slot="status" slot-scope="text, record">
                                <a-badge
                                    :status="!record.status ? 'success' : 'error'"
                                    :text="!record.status ? '开启' : '关闭'"
                                />
                            </span>
                            <span slot="action" slot-scope="text, record">
                                <a @click="onEdit(record)" v-action:edit>编辑</a>
                                <a-divider type="vertical" />
                                <a @click="onDelete(record)" v-action:delete>删除</a>
                            </span>
                        </a-table>
                        <a-empty v-else />
                    </a-spin>
                </a-col>
                <!-- 添加编辑Modal框 -->
                <a-modal v-model="modelVisible" :title="modelTitle" on-ok="handleOk">
                    <template slot="footer">
                        <a-button key="back" @click="modelVisible = false"> 取消 </a-button>
                        <a-button type="primary" :loading="subLoading" @click="handleOk"> 提交 </a-button>
                    </template>
                    <a-form :form="form">
                        <a-row :gutter="16">
                            <a-col :span="24">
                                <a-tag color="red"> 注:如果不选择父级，则默认顶级 </a-tag>
                            </a-col>
                            <a-col :span="24">
                                <a-form-item label="父级">
                                    <a-tree-select
                                        allowClear
                                        v-decorator="rules.parentId"
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="parentList"
                                        placeholder="如果不选择父级，则默认顶级"
                                        tree-default-expand-all
                                    >
                                    </a-tree-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-item label="状态">
                                    <a-radio-group v-decorator="rules.status">
                                        <a-radio :value="0"> 开启 </a-radio>
                                        <a-radio :value="1"> 关闭 </a-radio>
                                    </a-radio-group>
                                </a-form-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-item label="名称">
                                    <a-input v-decorator="rules.name" placeholder="请输入名称" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </a-modal>
            </a-row>
        </a-card>
    </div>
</template>

<script>
import { getOrganizationList, addEditOrganization, deleteOrganization } from '@/api/integrated'
import { dataFormat, treeData } from '@/utils/util.js'
import iconfont from '@/core/icons'
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'department',
    data() {
        return {
            organizationTree: [],
            columns: [
                { title: '名称', dataIndex: 'name', key: 'name', ellipsis: true },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    ellipsis: true,
                    scopedSlots: { customRender: 'status' },
                },
                { title: '创建时间', dataIndex: 'createTime', key: 'createTime', ellipsis: true },
                {
                    title: '操作',
                    width: '120px',
                    dataIndex: 'action',
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            tableData: [],
            pagination: {
                total: 0,
                defaultCurrent: 1,
                defaultPageSize: 20,
                showTotal: (total, range) => `第${range[0]}-${range[1]}条/总共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['20', '40', '60', '100'],
            },
            loading: false,
            expandAll: true,
            departmentName: '',
            createTime: [],
            modelVisible: false,
            modelTitle: '',
            subLoading: false,
            parentList: [],
            form: this.$form.createForm(this),
            rules: {
                status: ['status', { initialValue: 0 }],
                parentId: ['parentId'],
                name: ['name', { rules: [{ required: true, message: '请输入部门名称' }] }],
            },
            OrganizationID: '',
            parentId: '',
            cloneData: [],
            keyword: '',
            category: 1,
        }
    },
    methods: {
        // 引用图表静态文件
        iconfontSvg(category) {
            return category == 1 ? iconfont['departmentIcon'] : iconfont['jobsIcon']
        },
        // 改变分页
        tableChange(e) {
            this.pagination.defaultCurrent = e.current
            this.pagination.defaultPageSize = e.pageSize
            this.getDepartmentList()
        },
        // 获取表格数据
        async getDepartmentList() {
            let _this = this
            _this.loading = true
            _this.tableData = []
            _this.organizationTree = []
            let params = {
                departmentName: _this.departmentName,
                createTime: JSON.stringify(_this.createTime),
                parentId: _this.parentId,
                category: _this.category,
                current: _this.pagination.defaultCurrent,
                pageSize: _this.pagination.defaultPageSize,
            }
            await getOrganizationList(params).then((res) => {
                if (res.state == 1) {
                    _this.tableData = res.result.list
                    _this.tableData.forEach((v) => {
                        v.createTime = dataFormat(v.createTime, 'yyyy-MM-dd hh:mm:ss')
                    })
                    _this.tableData = treeData(res.result.list, 'OrganizationID', 'parentId', 'children')
                    _this.pagination.total = res.result.total
                    res.parentList.forEach((v) => {
                        v.value = v.OrganizationID
                        v.key = v.OrganizationID
                        v.title = v.name
                        v.slots = {
                            icon: 'smile',
                        }
                    })
                    _this.cloneData = cloneDeep(res.parentList)
                    _this.parentList = treeData(res.parentList, 'OrganizationID', 'parentId', 'children')
                    _this.organizationTree = treeData(
                        res.parentList.filter((v) => v.title.includes(_this.keyword)),
                        'OrganizationID',
                        'parentId',
                        'children'
                    )
                    _this.$nextTick(() => {
                        _this.expandAll = true
                        _this.loading = false
                    })
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        // 编辑
        onEdit(record) {
            let _this = this,
                cloneData = cloneDeep(record)
            _this.title = '编辑:' + record.name
            _this.OrganizationID = record.OrganizationID
            _this.modelVisible = true
            _this.$nextTick(() => {
                _this.form.setFieldsValue({
                    ['status']: cloneData.status,
                    ['parentId']: cloneData.parentId,
                    ['name']: cloneData.name,
                })
            })
        },
        // 删除
        onDelete(record) {
            let _this = this
            let params = {
                OrganizationID: record.OrganizationID,
                name: record.name,
            }
            _this.$confirm({
                title: '确认操作',
                content: '您确认提交吗?',
                onOk: async () => {
                    await deleteOrganization(params).then((res) => {
                        if (res.state == 1) {
                            _this.$message.success(res.msg)
                            _this.getDepartmentList()
                        } else if (res.state == 2) {
                            _this.$message.warn(res.msg)
                        } else {
                            _this.$message.error(res.msg)
                        }
                    })
                },
            })
        },
        // 查询
        query() {
            this.pagination.defaultCurrent = 1
            this.getDepartmentList()
        },
        // 添加
        addDepartment() {
            this.modelTitle = '添加部门'
            this.modelVisible = true
        },
        handleOk(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
            } = _this
            _this.subLoading = true
            const validateFieldsKey = ['status', 'parentId', 'name']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const params = { ...values }
                    params.OrganizationID = _this.OrganizationID
                    params.category = _this.category
                    _this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await addEditOrganization(params)
                                .then((res) => {
                                    if (res.state == 1) {
                                        _this.form.resetFields()
                                        _this.OrganizationID = ''
                                        _this.modelVisible = false
                                        _this.$message.success(res.msg)
                                        _this.getDepartmentList()
                                    } else if (res.state == 2) {
                                        _this.$message.warn(res.msg)
                                    } else {
                                        _this.$message.error(res.msg)
                                    }
                                })
                                .finally(() => {
                                    setTimeout(() => {
                                        _this.subLoading = false
                                    }, 600)
                                })
                        },
                        onCancel() {
                            _this.subLoading = false
                        },
                    })
                } else {
                    setTimeout(() => {
                        _this.subLoading = false
                    }, 600)
                }
            })
        },
        // 单选改变组织类别
        changeCategory() {
            this.parentId = ''
            this.getDepartmentList()
        },
        // 点击树结构触发
        changeTree(selectedKeys, e) {
            let _this = this
            _this.parentId = selectedKeys[0]
            _this.getDepartmentList()
        },
        // 搜索
        onChange(e) {
            const value = e.target.value
            this.organizationTree = treeData(
                this.cloneData.filter((v) => v.title.includes(value)),
                'OrganizationID',
                'parentId',
                'children'
            )
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.getDepartmentList()
        })
    },
}
</script>

<style>
</style>