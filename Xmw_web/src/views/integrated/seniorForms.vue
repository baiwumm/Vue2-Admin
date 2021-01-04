<template>
    <page-header-wrapper
        content="高级表格参考了ProTable的设计理念，在其基础上增加了多种格式导出、批量导入、自定义列等功能，在其中封装了很多常用的逻辑。"
    >
        <div class="seniorForms">
            <a-card :bordered="false" :bodyStyle="{ 'margin-bottom': '24px' }">
                <div class="table-page-search-wrapper">
                    <a-form layout="inline">
                        <a-row :gutter="48">
                            <a-col :md="6" :sm="24">
                                <a-form-item label="标题">
                                    <a-input placeholder="请输入标题" v-model="queryForm.bugTitle" allowClear />
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="Bug类型">
                                    <a-select placeholder="请选择Bug类型" v-model="queryForm.type" allowClear>
                                        <a-select-option
                                            :value="item.value"
                                            v-for="(item, index) in typeList.BugTypeList"
                                            :key="index"
                                            >{{ item.text }}</a-select-option
                                        >
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="严重程度">
                                    <a-select placeholder="请选择严重程度" v-model="queryForm.degree" allowClear>
                                        <a-select-option
                                            :value="item.value"
                                            v-for="(item, index) in typeList.degreeList"
                                            :key="index"
                                            >{{ item.text }}</a-select-option
                                        >
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <template v-if="colShow">
                                <a-col :md="6" :sm="24">
                                    <a-form-item label="优先级">
                                        <a-select placeholder="请选择优先级" v-model="queryForm.priority" allowClear>
                                            <a-select-option
                                                :value="item.value"
                                                v-for="(item, index) in typeList.priorityList"
                                                :key="index"
                                                >{{ item.text }}</a-select-option
                                            >
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                                <a-col :md="6" :sm="24">
                                    <a-form-item label="状态">
                                        <a-select placeholder="请选择状态" v-model="queryForm.state" allowClear>
                                            <a-select-option
                                                :value="item.value"
                                                v-for="(item, index) in typeList.stateList"
                                                :key="index"
                                                >{{ item.text }}</a-select-option
                                            >
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                                <a-col :md="6" :sm="24">
                                    <a-form-item label="创建时间">
                                        <a-range-picker
                                            style="width: 100%"
                                            v-model="queryForm.createTime"
                                            valueFormat="YYYY-MM-DD"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :md="6" :sm="24">
                                    <a-form-item label="截止时间">
                                        <a-range-picker
                                            style="width: 100%"
                                            v-model="queryForm.endTime"
                                            valueFormat="YYYY-MM-DD"
                                        />
                                    </a-form-item>
                                </a-col>
                            </template>
                            <a-col :md="6" :sm="24" style="text-align: right">
                                <a-space>
                                    <a-button @click="() => (queryForm = {})">重置</a-button>
                                    <a-button type="primary" @click="query" :loading="queryLoading" v-action:query>
                                        查询
                                    </a-button>
                                    <a @click="togglePackUp">
                                        {{ colShow ? '收起' : '展开' }}
                                        <a-icon :type="colShow ? 'up' : 'down'"
                                    /></a>
                                </a-space>
                            </a-col>
                        </a-row>
                    </a-form>
                </div>
            </a-card>
            <a-card :bordered="false" :bodyStyle="{ paddingBottom: 0, paddingTop: 0 }">
                <div class="toolbar">
                    <a-row type="flex" justify="space-between">
                        <a-col style="color: rgba(0, 0, 0, 0.85); font-weight: bold">高级表格</a-col>
                        <a-col>
                            <a-space size="middle">
                                <a-button type="primary" icon="plus" @click="addBug" v-action:add>新建</a-button>
                                <a-tooltip v-action:import>
                                    <template slot="title"> 批量上传 </template>
                                    <a-upload :before-upload="beforeUpload" :showUploadList="false">
                                        <a-button icon="upload" />
                                    </a-upload>
                                </a-tooltip>
                                <a-tooltip>
                                    <template slot="title"> 上传模板 </template>
                                    <a-button icon="file-text" @click="exportTemplate()" />
                                </a-tooltip>
                                <a-tooltip v-action:export>
                                    <template slot="title"> 导出文件 </template>
                                    <export-file
                                        :tHeader="columns.map((c) => c.title)"
                                        :filterVal="columns.map((c) => c.key)"
                                        :exportData="exportData"
                                        :selectedRowKeys="selectedRowKeys"
                                    ></export-file>
                                </a-tooltip>
                                <a-tooltip v-action:delete>
                                    <template slot="title"> 删除选中 </template>
                                    <a-button
                                        type="danger"
                                        icon="delete"
                                        @click="deleteSeleted"
                                        :disabled="!selectedRowKeys.length"
                                        :loading="delLoading"
                                    />
                                </a-tooltip>
                                <a-space size="middle">
                                    <a-tooltip
                                        ><template slot="title"> 刷新 </template
                                        ><a-icon type="reload" style="cursor: pointer" :spin="addRotate" @click="query"
                                    /></a-tooltip>
                                    <a-tooltip>
                                        <template slot="title"> 密度 </template>
                                        <a-dropdown
                                            :trigger="['click']"
                                            placement="bottomCenter"
                                            overlayClassName="ant-dropdown-menu-item-selected"
                                        >
                                            <a-icon
                                                type="column-height"
                                                style="cursor: pointer"
                                                @click="(e) => e.preventDefault()"
                                            />
                                            <a-menu slot="overlay" @click="menuClick">
                                                <a-menu-item
                                                    v-for="(item, index) in menuItem"
                                                    :key="index"
                                                    :class="{ 'ant-dropdown-menu-item-selected': item.key == density }"
                                                >
                                                    {{ item.label }}
                                                </a-menu-item>
                                            </a-menu>
                                        </a-dropdown>
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title"> 列设置 </template>
                                        <a-popover trigger="click" placement="bottomRight">
                                            <template slot="title">
                                                <a-checkbox
                                                    :indeterminate="indeterminate"
                                                    :checked="checkAll"
                                                    @change="onCheckAllChange"
                                                >
                                                    列设置
                                                </a-checkbox>
                                            </template>
                                            <template slot="content">
                                                <a-checkbox-group v-model="checkedList" @change="onChange">
                                                    <a-row style="width: 200px">
                                                        <a-col
                                                            :span="12"
                                                            v-for="(item, index) in plainOptions"
                                                            :key="index"
                                                        >
                                                            <a-checkbox :value="item.value">
                                                                {{ item.label }}
                                                            </a-checkbox>
                                                        </a-col>
                                                    </a-row>
                                                </a-checkbox-group>
                                            </template>
                                            <a-icon type="setting" style="cursor: pointer" />
                                        </a-popover>
                                    </a-tooltip>
                                </a-space>
                            </a-space>
                        </a-col>
                    </a-row>
                </div>
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
                <!-- 抽屉-新建编辑 -->
                <a-drawer :title="drawerTitle" :width="600" :visible="visible" @close="onClose" :maskClosable="false">
                    <a-form :form="form" @submit="handleSubmit">
                        <a-row :gutter="16">
                            <a-col :span="12">
                                <a-form-item label="Bug标题">
                                    <a-input v-decorator="rules.title" placeholder="请输入Bug标题" allowClear />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="Bug类型">
                                    <a-select
                                        v-decorator="rules.type"
                                        style="width: 100%"
                                        placeholder="请选择Bug类型"
                                        allowClear
                                    >
                                        <a-select-option
                                            v-for="item in typeList.BugTypeList"
                                            :key="item.value"
                                            :value="item.value"
                                        >
                                            {{ item.text }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="严重程度">
                                    <a-select
                                        v-decorator="rules.degree"
                                        style="width: 100%"
                                        placeholder="请选择严重程度"
                                        allowClear
                                    >
                                        <a-select-option
                                            v-for="item in typeList.degreeList"
                                            :key="item.value"
                                            :value="item.value"
                                        >
                                            {{ item.text }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="优先级">
                                    <a-select
                                        v-decorator="rules.priority"
                                        style="width: 100%"
                                        placeholder="请选择优先级"
                                        allowClear
                                    >
                                        <a-select-option
                                            v-for="item in typeList.priorityList"
                                            :key="item.value"
                                            :value="item.value"
                                        >
                                            {{ item.text }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="状态">
                                    <a-select
                                        v-decorator="rules.state"
                                        style="width: 100%"
                                        placeholder="请选择状态"
                                        allowClear
                                        @change="changeState"
                                    >
                                        <a-select-option
                                            v-for="item in typeList.stateList"
                                            :key="item.value"
                                            :value="item.value"
                                        >
                                            {{ item.text }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="进度">
                                    <a-slider
                                        :tip-formatter="formatter"
                                        v-decorator="rules.progress"
                                        :marks="marks"
                                        :disabled="sliderDis"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="指派给谁">
                                    <a-select
                                        v-decorator="rules.designated"
                                        style="width: 100%"
                                        placeholder="请选择指派给谁"
                                        allowClear
                                    >
                                        <a-select-option v-for="item in userList" :key="item.key" :value="item.key">
                                            {{ item.label }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="截止日期">
                                    <a-date-picker
                                        v-decorator="rules.endTime"
                                        style="width: 100%"
                                        format="YYYY-MM-DD"
                                    />
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
        </div>
    </page-header-wrapper>
</template>

<script>
import { seniorFormsList, addEditSeniorForms, deleteSeniorForms, saveSeniorExcel } from '@/api/integrated'
import { dataFormat } from '@/utils/util.js'
import moment from 'moment'
import formType from './components/formType.json'
import exportFile from './components/exportFile'
import { export_json_to_excel } from '@/utils/Excel/Export2Excel'
export default {
    components: {
        exportFile,
    },
    data() {
        return {
            typeList: formType,
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
                    filters: formType.BugTypeList,
                    onFilter: (value, record) => record.type == value,
                    customRender: (text, row, index) => {
                        let result = ''
                        formType.BugTypeList.map((v) => {
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
                    filters: formType.degreeList,
                    onFilter: (value, record) => record.degree == value,
                    customRender: (text, row, index) => {
                        let result = '',
                            color = ''
                        formType.degreeList.map((v) => {
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
                    filters: formType.priorityList,
                    onFilter: (value, record) => record.priority == value,
                    customRender: (text, row, index) => {
                        let result = '',
                            color = ''
                        formType.priorityList.map((v) => {
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
                    filters: formType.stateList,
                    onFilter: (value, record) => record.state == value,
                    customRender: (text, row, index) => {
                        let result = '',
                            status = ''
                        formType.stateList.map((v) => {
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
            drawerTitle: '',
            visible: false,
            form: this.$form.createForm(this),
            loginState: false,
            rules: {
                title: ['title', { rules: [{ required: true, message: '请输入Bug标题' }] }],
                type: ['type', { rules: [{ required: true, message: '请选择Bug类型' }] }],
                degree: ['degree', { rules: [{ required: true, message: '请选择严重程度' }] }],
                priority: ['priority', { rules: [{ required: true, message: '请选择优先级' }] }],
                state: ['state', { rules: [{ required: true, message: '请选择状态' }] }],
                progress: ['progress', { initialValue: 50 }],
                designated: ['designated', { rules: [{ required: true, message: '请选择指派给谁' }] }],
                endTime: ['endTime', { rules: [{ required: true, message: '请选择日期' }] }],
            },
            marks: {
                0: '0%',
                100: {
                    style: {
                        color: '#f50',
                    },
                    label: <strong>100%</strong>,
                },
            },
            userList: [],
            sliderDis: false,
            BugID: '',
            // 表格密度
            menuItem: [
                { key: 'default', label: '默认' },
                { key: 'middle', label: '中等' },
                { key: 'small', label: '紧凑' },
            ],
            density: 'default',
            popoverVisible: false,
            selectedRowKeys: [],
            delLoading: false,
            queryForm: {},
            colShow: false,
            queryLoading: false,
            exportData: [],
            indeterminate: false,
            checkedList: [],
            checkAll: true,
            plainOptions: [],
            addRotate: false,
        }
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
        // 进度显示控制
        formatter(value) {
            return `${value}%`
        },
        changeState(value, option) {
            let _this = this
            if (value == '1' || value == '4') {
                _this.$nextTick(() => {
                    _this.form.setFieldsValue({
                        progress: 100,
                    })
                })
                _this.sliderDis = true
            } else if (value == '3') {
                _this.$nextTick(() => {
                    _this.form.setFieldsValue({
                        progress: 0,
                    })
                })
                _this.sliderDis = true
            } else {
                _this.$nextTick(() => {
                    _this.form.setFieldsValue({
                        progress: 50,
                    })
                })
                _this.sliderDis = false
            }
        },
        // 表格密度
        menuClick(value) {
            this.density = this.menuItem[value.key].key
        },
        // 切换分页
        tableChange(e) {
            let _this = this
            _this.pagination.defaultCurrent = e.current
            _this.pagination.defaultPageSize = e.pageSize
            _this.getseniorFormsList()
        },
        addBug() {
            let _this = this
            _this.visible = true
            _this.drawerTitle = '新建BUG'
        },
        // 初始化数据
        async getseniorFormsList() {
            let _this = this
            _this.loading = true
            _this.queryLoading = true
            _this.addRotate = true
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
            await seniorFormsList(params).then((res) => {
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
                        _this.typeList.BugTypeList.map((a) => {
                            if (v.type == a.value) v.type = a.text
                        })
                        _this.typeList.degreeList.map((a) => {
                            if (v.degree == a.value) v.degree = a.text
                        })
                        _this.typeList.priorityList.map((a) => {
                            if (v.priority == a.value) v.priority = a.text
                        })
                        _this.typeList.stateList.map((a) => {
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
                        _this.checkedList.push(v.key)
                        _this.plainOptions.push({
                            label: v.title,
                            value: v.key,
                        })
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
        // 提交表单
        handleSubmit(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
            } = _this
            _this.loginState = true
            const validateFieldsKey = [
                'title',
                'type',
                'degree',
                'priority',
                'state',
                'progress',
                'designated',
                'endTime',
            ]
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const params = { ...values }
                    params.BugID = _this.BugID
                    _this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await addEditSeniorForms(params)
                                .then((res) => {
                                    if (res.state == 1) {
                                        _this.form.resetFields()
                                        _this.BugID = ''
                                        _this.visible = false
                                        _this.sliderDis = false
                                        _this.$message.success(res.msg)
                                        _this.getseniorFormsList()
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
            _this.BugID = ''
            _this.sliderDis = false
        },
        // 编辑行
        onEdit(record) {
            let _this = this,
                cloneData = _this._.cloneDeep(record)
            _this.visible = true
            _this.title = '编辑BUG:' + cloneData.title
            _this.BugID = cloneData.BugID
            cloneData.endTime = moment(cloneData.endTime, 'YYYY-MM-DD')
            delete cloneData.BugID
            delete cloneData.createTime
            delete cloneData.creator
            _this.$nextTick(() => {
                _this.form.setFieldsValue(cloneData)
            })
            if (record.state == '2') {
                _this.sliderDis = false
            } else {
                _this.sliderDis = true
            }
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
                    await deleteSeniorForms(params).then((res) => {
                        if (res.state == 1) {
                            _this.$message.success(res.msg)
                            _this.getseniorFormsList()
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
        deleteSeleted(e) {
            let _this = this
            e.preventDefault()
            let params = {
                BugID: this.selectedRowKeys,
                title: this.selectedRowKeys,
            }
            _this.$confirm({
                title: '确认操作',
                content: '您确认删除吗?',
                onOk: async () => {
                    await deleteSeniorForms(params).then((res) => {
                        if (res.state == 1) {
                            _this.$message.success(res.msg)
                            _this.getseniorFormsList()
                        } else {
                            _this.$message.error(res.msg)
                        }
                    })
                },
            })
        },
        togglePackUp() {
            let _this = this
            _this.colShow = !_this.colShow
        },
        // 筛选
        query() {
            this.pagination.defaultCurrent = 1
            this.getseniorFormsList()
        },
        // 上传excel文件
        beforeUpload(file) {
            // 获取文件名
            this.file = file
            // 获取文件类型
            let fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
            let whitelist = ['xls', 'xlsx', 'csv'].indexOf(fileType.toLowerCase()) !== -1
            // 判断图片大小
            let isLt10M = file.size / 1024 / 1024 < 10
            if (!isLt10M || !whitelist) {
                this.$message.warning('请上传excel表格，且大小不能超过 10MB!')
                return false
            }
            this.saveExcel()
            this.importf(file)
            return false //  取消默认上传
        },
        async saveExcel() {
            let _this = this
            const formData = new FormData()
            let fileOfBlob = new File([_this.file], _this.file.name)
            formData.append('SaveFileName', 'seniorForm')
            formData.append('file', fileOfBlob)
            await saveSeniorExcel(formData).then((res) => {
                if (res.state == 1) {
                    _this.$message.success(res.msg)
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        importf(obj) {
            let _this = this
            // 通过DOM取文件数据
            let f = obj,
                reader = new FileReader(),
                rABS = false
            FileReader.prototype.readAsBinaryString = function (f) {
                //rABS是否将文件读取为二进制字符串,wb读取完成的数据
                let binary = '',
                    rABS = false,
                    wb,
                    outdata
                reader.onload = async function (e) {
                    let bytes = new Uint8Array(reader.result)
                    let length = bytes.byteLength
                    for (let i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i])
                    }
                    let XLSX = require('xlsx')
                    if (rABS) {
                        wb = XLSX.read(btoa(fixdata(binary)), {
                            //手动转化
                            type: 'base64',
                            cellDates: true,
                        })
                    } else {
                        wb = XLSX.read(binary, {
                            type: 'binary',
                            cellDates: true,
                        })
                    }
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) //outdata就是读取excel内容之后输出的东西
                    // 全局替换表头字段
                    let excelData = JSON.parse(
                        JSON.stringify(outdata)
                            .replace(/Bug标题/g, 'title')
                            .replace(/Bug类型/g, 'type')
                            .replace(/严重程度/g, 'degree')
                            .replace(/优先级/g, 'priority')
                            .replace(/进度/g, 'progress')
                            .replace(/状态/g, 'state')
                            .replace(/创建人/g, 'creator')
                            .replace(/指派给谁/g, 'designated')
                            .replace(/截止日期/g, 'endTime')
                    )
                    // 插入数据库
                    let params = { upload: true, excelData: excelData }
                    _this.loading = true
                    await addEditSeniorForms(params)
                        .then((res) => {
                            if (res.state) {
                                _this.$message.success(res.msg)
                                _this.getseniorFormsList()
                            } else {
                                _this.$message.error('上传文件字段不对,请下载模板上传!')
                            }
                        })
                        .finally(() => {
                            _this.loading = false
                        })
                }
                reader.readAsArrayBuffer(f)
            }
            if (rABS) {
                reader.readAsArrayBuffer(f)
            } else {
                reader.readAsBinaryString(f)
            }
        },
        // 上传模板
        exportTemplate() {
            require.ensure([], () => {
                const tHeader = [
                    'Bug标题',
                    'Bug类型',
                    '严重程度',
                    '优先级',
                    '状态',
                    '进度',
                    '指派给谁',
                    '创建人',
                    '截止日期',
                ]
                const filterVal = [
                    'title',
                    'type',
                    'degree',
                    'priority',
                    'state',
                    'progress',
                    'designated',
                    'creator',
                    'endTime',
                ]
                const list = []
                const data = this.formatJson(filterVal, list)
                export_json_to_excel(tHeader, data, '上传模板')
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map((v) => filterVal.map((j) => v[j]))
        },
        onChange(checkedList) {
            this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
            this.checkAll = checkedList.length === this.plainOptions.length
        },
        onCheckAllChange(e) {
            Object.assign(this, {
                checkedList: e.target.checked ? this.plainOptions.map((v) => v.value) : [],
                indeterminate: false,
                checkAll: e.target.checked,
            })
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.getseniorFormsList()
        })
    },
}
</script>

<style lang="less" scoped>
.toolbar {
    padding: 16px 0;
    font-size: 16px;
}
</style>
