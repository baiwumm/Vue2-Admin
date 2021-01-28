<template>
    <page-header-wrapper
        content="高级表格参考了ProTable的设计理念，在其基础上增加了多种格式导出、批量导入、自定义列等功能，在其中封装了很多常用的逻辑。"
    >
        <div class="seniorForms">
            <table-filter
                :BugType="BugType"
                :DegreeType="DegreeType"
                :PriorityType="PriorityType"
                :StatusType="StatusType"
                :queryLoading="queryLoading"
                @filter="getAdvancedTable($event)"
            ></table-filter>
            <a-card :bordered="false" :bodyStyle="{ paddingBottom: 0, paddingTop: 0 }">
                <!-- 表格工具类 -->
                <table-tool
                    :selectedRowKeys="selectedRowKeys"
                    :addRotate="addRotate"
                    :plainOptions="plainOptions"
                    :checkedArr="checkedList"
                    @reload="getAdvancedTable"
                    @density="upDensity"
                    @multiSelect="deleteSeleted"
                    @columnSetup="columnSetup"
                ></table-tool>
                <!-- 表格数据 -->
                <a-table
                    :row-selection="rowSelection"
                    :size="density"
                    :columns="columns.filter((v) => checkedList.includes(v.key))"
                    rowKey="BugID"
                    :data-source="data"
                    :pagination="pagination"
                    @change="tableChange"
                    :loading="loading"
                >
                    <span slot="progress" slot-scope="text, record">
                        <a-progress
                            :percent="record.progress"
                            size="small"
                            :status="!record.progress ? 'exception' : record.progress == '100' ? 'success' : 'active'"
                            :stroke-color="{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }"
                        />
                    </span>
                    <span slot="endTime" slot-scope="text, record">
                        {{ record.endTime }}
                        <a-tooltip v-if="new Date(record.endTime).getTime() < new Date().getTime()">
                            <template slot="title"> 已延期 </template>
                            <a-icon type="exclamation-circle" style="cursor: pointer; margin-left: 5px; color: red" />
                        </a-tooltip>
                    </span>
                    <span slot="createTime" slot-scope="text, record">
                        <a-icon type="clock-circle" />
                        {{ record.createTime }}
                    </span>
                    <span slot="action" slot-scope="text, record">
                        <a @click="onEdit(record)" v-action:edit>编辑</a>
                        <a-divider type="vertical" />
                        <a @click="onDelete(record)" v-action:delete>删除</a>
                    </span>
                </a-table>
                <!-- 数据表单 -->
                <table-form
                    ref="tableform"
                    :BugType="BugType"
                    :DegreeType="DegreeType"
                    :PriorityType="PriorityType"
                    :StatusType="StatusType"
                    :userList="userList"
                ></table-form>
            </a-card>
        </div>
    </page-header-wrapper>
</template>

<script>
import { advancedTable, deleteAdvancedTable } from '@/api/integrated'
import { dataFormat } from '@/utils/util.js'
import moment from 'moment'
import tableFilter from './components/advancedTable/tableFilter'
import tableTool from './components/advancedTable/tableTool'
import tableForm from './components/advancedTable/tableForm'
import { DictionaryCD } from '@/api/public'
import bus from '@/utils/bus'
export default {
    name: 'advancedTable',
    components: {
        tableFilter,
        tableTool,
        tableForm,
    },
    provide() {
        return {
            tHeader: this.columns.map((c) => c.title),
            filterVal: this.columns.map((c) => c.key),
            getExportData: () => this.exportData,
            getSelectedRowKeys: () => this.selectedRowKeys,
        }
    },
    data() {
        return {
            BugType: [], // BUG类型列表
            DegreeType: [], // 严重程度列表
            PriorityType: [], // 优先级列表
            StatusType: [], // 进度状态列表
            columns: [
                {
                    title: 'Bug标题',
                    dataIndex: 'title',
                    key: 'title',
                    ellipsis: true,
                },
                {
                    title: 'Bug类型',
                    dataIndex: 'type',
                    key: 'type',
                    ellipsis: true,
                    filters: this.BugType,
                    onFilter: (value, record) => record.type == value,
                    customRender: (text, row, index) => {
                        let result = ''
                        this.BugType.map((v) => {
                            if (text == v.value) {
                                result = v.text
                            }
                        })
                        return <a-tag color="#f50">{result}</a-tag>
                    },
                },
                {
                    title: '严重程度',
                    dataIndex: 'degree',
                    key: 'degree',
                    ellipsis: true,
                    filters: this.DegreeType,
                    onFilter: (value, record) => record.degree == value,
                    customRender: (text, row, index) => {
                        let result = '',
                            color = ''
                        this.DegreeType.map((v) => {
                            if (text == v.value) {
                                result = v.text
                            }
                            switch (text) {
                                case '1':
                                    color = 'red'
                                    break
                                case '2':
                                    color = 'pink'
                                    break
                                case '3':
                                    color = 'blue'
                                    break
                                case '4':
                                    color = 'cyan'
                                    break
                            }
                        })
                        return <a-tag color={color}>{result}</a-tag>
                    },
                },
                {
                    title: '优先级',
                    dataIndex: 'priority',
                    key: 'priority',
                    ellipsis: true,
                    filters: this.PriorityType,
                    onFilter: (value, record) => record.priority == value,
                    customRender: (text, row, index) => {
                        let result = '',
                            color = ''
                        this.PriorityType.map((v) => {
                            if (text == v.value) {
                                result = v.text
                            }
                            switch (text) {
                                case 'P0':
                                    color = 'red'
                                    break
                                case 'P1':
                                    color = 'pink'
                                    break
                                case 'P2':
                                    color = 'blue'
                                    break
                                case 'P3':
                                    color = 'cyan'
                                    break
                            }
                        })
                        return <a-tag color={color}>{result}</a-tag>
                    },
                },
                {
                    title: '状态',
                    dataIndex: 'state',
                    key: 'state',
                    ellipsis: true,
                    filters: this.StatusType,
                    onFilter: (value, record) => record.state == value,
                    customRender: (text, row, index) => {
                        let result = '',
                            status = ''
                        this.StatusType.map((v) => {
                            if (text == v.value) {
                                result = v.text
                            }
                            switch (text) {
                                case '1':
                                    status = 'success'
                                    break
                                case '2':
                                    status = 'processing'
                                    break
                                case '3':
                                    status = 'error'
                                    break
                                case '4':
                                    status = 'default'
                                    break
                            }
                        })
                        return <a-badge status={status} text={result} />
                    },
                },
                {
                    title: '进度',
                    dataIndex: 'progress',
                    key: 'progress',
                    ellipsis: true,
                    scopedSlots: { customRender: 'progress' },
                    sorter: (a, b) => a.progress - b.progress,
                },
                {
                    title: '指派给谁',
                    dataIndex: 'designated',
                    key: 'designated',
                    ellipsis: true,
                    onFilter: (value, record) => record.designated == value,
                    customRender: (text, row, index) => {
                        let result = ''
                        this.userList.map((v) => {
                            if (text == v.key) {
                                result = v.label
                            }
                        })
                        return result
                    },
                },
                {
                    title: '创建人',
                    dataIndex: 'creator',
                    key: 'creator',
                    ellipsis: true,
                    onFilter: (value, record) => record.creator == value,
                    customRender: (text, row, index) => {
                        let result = ''
                        this.userList.map((v) => {
                            if (text == v.key) {
                                result = v.label
                            }
                        })
                        return result
                    },
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    ellipsis: true,
                    width: 130,
                    scopedSlots: { customRender: 'createTime' },
                    sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
                },
                {
                    title: '截止日期',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    ellipsis: true,
                    width: 130,
                    scopedSlots: { customRender: 'endTime' },
                    sorter: (a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime(),
                },
                {
                    title: '操作',
                    width: '120px',
                    dataIndex: 'action',
                    key: 'action',
                    align: 'center',
                    fixed: 'right',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            typeList: {},
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
            BugID: '',
            density: 'default',
            selectedRowKeys: [],
            exportData: [],
            indeterminate: false,
            checkAll: true,
            addRotate: false,
            queryLoading: false,
            queryForm: {},
            userList: [],
            plainOptions: [],
            checkedList: [],
        }
    },
    created() {
        bus.$on('updateTable', () => {
            this.getAdvancedTable()
        })
    },
    beforeDestroy() {
        bus.$off('updateTable')
    },
    computed: {
        rowSelection() {
            const { selectedRowKeys } = this
            return {
                selectedRowKeys,
                onChange: this.onSelectChange,
                hideDefaultSelections: true,
                selections: [
                    {
                        key: 'odd',
                        text: '奇数行',
                        onSelect: (changableRowKeys) => {
                            let newSelectedRowKeys = []
                            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                                if (index % 2 !== 0) {
                                    return false
                                }
                                return true
                            })
                            this.selectedRowKeys = newSelectedRowKeys
                        },
                    },
                    {
                        key: 'even',
                        text: '偶数行',
                        onSelect: (changableRowKeys) => {
                            let newSelectedRowKeys = []
                            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                                if (index % 2 !== 0) {
                                    return true
                                }
                                return false
                            })
                            this.selectedRowKeys = newSelectedRowKeys
                        },
                    },
                    {
                        key: 'inverse',
                        text: '反选行',
                        onSelect: (changableRowKeys) => {
                            let newSelectedRowKeys = []
                            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                                if (this.selectedRowKeys.includes(key)) {
                                    return false
                                }
                                return true
                            })
                            this.selectedRowKeys = newSelectedRowKeys
                        },
                    },
                ],
                onSelection: this.onSelection,
                file: '',
            }
        },
    },
    methods: {
        // 获取字典表数据
        async getDictionaryCD() {
            let _this = this
            await DictionaryCD().then((res) => {
                _this.BugType = res.result.sys_bug_type
                _this.DegreeType = res.result.sys_degree_type
                _this.PriorityType = res.result.sys_priority_type
                _this.StatusType = res.result.sys_status_Type
            })
        },
        // 切换分页
        tableChange(e) {
            let _this = this
            _this.pagination.defaultCurrent = e.current
            _this.pagination.defaultPageSize = e.pageSize
            _this.getAdvancedTable()
        },
        // 表格密度
        upDensity(msg) {
            this.density = msg
        },
        // 列设置
        columnSetup(msg) {
            this.checkedList = msg
        },
        // 初始化数据
        async getAdvancedTable(msg) {
            let _this = this
            _this.loading = true
            _this.queryLoading = true
            _this.addRotate = true
            if (msg) {
                _this.pagination.defaultCurrent = 1
                _this.queryForm = msg
            }
            let params = {
                title: _this.queryForm.bugTitle,
                type: _this.queryForm.type,
                degree: _this.queryForm.degree,
                priority: _this.queryForm.priority,
                state: _this.queryForm.state,
                createTime: JSON.stringify(_this.queryForm.createTime),
                endTime: JSON.stringify(_this.queryForm.endTime),
                current: _this.pagination.defaultCurrent,
                pageSize: _this.pagination.defaultPageSize,
            }
            await advancedTable(params).then((res) => {
                if (res.state == 1) {
                    _this.data = res.result.list
                    _this.data.forEach((v) => {
                        v.createTime = dataFormat(v.createTime, 'yyyy-MM-dd')
                        v.endTime = dataFormat(v.endTime, 'yyyy-MM-dd')
                    })
                    _this.userList = res.userList
                    // 深克隆导出数据
                    _this.exportData = JSON.parse(JSON.stringify(_this.data))
                    _this.exportData.forEach((v) => {
                        _this.BugType.map((a) => {
                            if (v.type == a.value) v.type = a.text
                        })
                        _this.DegreeType.map((a) => {
                            if (v.degree == a.value) v.degree = a.text
                        })
                        _this.PriorityType.map((a) => {
                            if (v.priority == a.value) v.priority = a.text
                        })
                        _this.StatusType.map((a) => {
                            if (v.state == a.value) v.state = a.text
                        })
                        _this.userList.map((a) => {
                            if (v.designated == a.key) v.designated = a.label
                            if (v.creator == a.key) v.creator = a.label
                        })
                    })
                    // 过滤指派给谁和创建人筛选
                    _this.columns.forEach((v) => {
                        if (v.key == 'designated' || v.key == 'creator') {
                            let result = [],
                                exist = []
                            for (let i = 0; i < _this.data.length; i++) {
                                if (exist.includes(_this.data[i][v.key])) break
                                exist.push(_this.data[i][v.key])
                                for (let j = 0; j < _this.userList.length; j++) {
                                    if (_this.data[i][v.key] == _this.userList[j].key)
                                        result.push({
                                            value: String(_this.data[i][v.key]),
                                            text: _this.userList[j].label,
                                        })
                                }
                            }
                            v.filters = result
                        }
                    })
                    _this.pagination.total = res.result.total
                } else {
                    _this.$message.error(res.msg)
                }
                _this.loading = false
                _this.queryLoading = false
                _this.addRotate = false
            })
        },

        // 编辑行
        onEdit(record) {
            bus.$emit('editForm', record)
        },
        // 删除行
        onDelete(record) {
            let _this = this
            let params = {
                BugID: record.BugID,
                title: record.title,
            }
            _this.$confirm({
                title: '确认操作',
                content: '您确认删除吗?',
                onOk: async () => {
                    await deleteAdvancedTable(params).then((res) => {
                        if (res.state == 1) {
                            _this.$message.success(res.msg)
                            _this.getAdvancedTable()
                        } else {
                            _this.$message.error(res.msg)
                        }
                    })
                },
            })
        },
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
        },
        // 多选删除
        deleteSeleted() {
            let _this = this
            let params = {
                BugID: this.selectedRowKeys,
                title: this.selectedRowKeys,
            }
            _this.$confirm({
                title: '确认操作',
                content: '您确认删除吗?',
                onOk: async () => {
                    await deleteAdvancedTable(params).then((res) => {
                        if (res.state == 1) {
                            _this.$message.success(res.msg)
                            _this.getAdvancedTable()
                        } else {
                            _this.$message.error(res.msg)
                        }
                    })
                },
            })
        },
    },
    mounted() {
        let _this = this
        _this.$nextTick(async () => {
            await _this.getDictionaryCD()
            _this.getAdvancedTable()
            _this.columns.forEach((v) => {
                _this.checkedList.push(v.key)
                _this.plainOptions.push({
                    label: v.title,
                    value: v.key,
                })
            })
        })
    },
}
</script>


