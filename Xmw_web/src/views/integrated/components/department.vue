
<template>
    <div class="department">
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
                            <a-range-picker @change="dealTime" />
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
            <!-- 表格数据 -->
            <a-table
                v-if="data.length"
                :columns="columns"
                rowKey="DepartmentID"
                :data-source="data"
                :pagination="pagination"
                @change="tableChange"
                :loading="loading"
                :defaultExpandAllRows="expandAll"
            >
                <span slot="action" slot-scope="text, record">
                    <a @click="onEdit(record)" v-action:edit>编辑</a>
                    <a-divider type="vertical" />
                    <a @click="onDelete(record)" v-action:delete>删除</a>
                </span>
            </a-table>
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
                            <a-form-item label="父级部门">
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
                            <a-form-item label="部门名称">
                                <a-input v-decorator="rules.name" placeholder="请输入部门名称" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </a-modal>
        </div>
    </div>
</template>

<script>
import { departmentList, addEditDepartment, deleteDepartment } from '@/api/integrated'
import { dataFormat, treeData } from '@/utils/util.js'
export default {
    data() {
        return {
            departmentName: '',
            createTime: [],
            columns: [
                { title: '部门名称', dataIndex: 'name', key: 'name', ellipsis: true },
                { title: '创建时间', dataIndex: 'createTime', key: 'createTime', ellipsis: true },
                {
                    title: '操作',
                    width: '120px',
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
                showTotal: (total) => `共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['20', '40', '60', '100'],
            },
            loading: false,
            modelVisible: false,
            modelTitle: '',
            subLoading: false,
            parentList: [],
            form: this.$form.createForm(this),
            rules: {
                parentId: ['parentId', { initialValue: '' }],
                name: ['name', { initialValue: '', rules: [{ required: true, message: '请输入部门名称' }] }],
            },
            DepartmentID: '',
            expandAll: true,
        }
    },
    methods: {
        dealTime(date, dateString) {
            this.createTime = dateString
        },
        tableChange(e) {
            this.pagination.defaultCurrent = e.current
            this.pagination.defaultPageSize = e.pageSize
            this.getDepartmentList()
        },
        async getDepartmentList() {
            let _this = this
            _this.loading = true
            let params = {
                departmentName: _this.departmentName,
                createTime: JSON.stringify(_this.createTime),
                current: _this.pagination.defaultCurrent,
                pageSize: _this.pagination.defaultPageSize,
            }
            await departmentList(params).then((res) => {
                if (res.state == 1) {
                    _this.data = res.result.list
                    _this.data.forEach((v) => {
                        v.createTime = dataFormat(v.createTime, 'yyyy-MM-dd hh:mm:ss')
                    })
                    _this.data = treeData(res.result.list, 'DepartmentID', 'parentId', 'children')
                    _this.pagination.total = res.result.total
                    res.parentList.forEach((v) => {
                        v.value = v.DepartmentID
                        v.key = v.DepartmentID
                        v.title = v.name
                    })
                    _this.parentList = treeData(res.parentList, 'DepartmentID', 'parentId', 'children')
                    _this.loading = false
                    _this.expandAll = true
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        // 编辑
        onEdit(record) {
            let _this = this
            _this.title = '编辑部门:' + record.name
            _this.DepartmentID = record.DepartmentID
            let keys = Object.keys(_this.rules)
            keys.map((v) => {
                _this.rules[v][1].initialValue = record[v]
            })
            _this.modelVisible = true
        },
        // 删除
        onDelete(record) {
            let _this = this
            let params = {
                DepartmentID: record.DepartmentID,
                name: record.name,
            }
            _this.$confirm({
                title: '确认操作',
                content: '您确认提交吗?',
                onOk: async () => {
                    await deleteDepartment(params).then((res) => {
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
            const validateFieldsKey = ['parentId', 'name']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const params = { ...values }
                    params.DepartmentID = _this.DepartmentID
                    _this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await addEditDepartment(params)
                                .then((res) => {
                                    if (res.state == 1) {
                                        _this.form.resetFields()
                                        let keys = Object.keys(_this.rules)
                                        keys.map((v) => {
                                            _this.rules[v][1].initialValue = ''
                                        })
                                        _this.DepartmentID = ''
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