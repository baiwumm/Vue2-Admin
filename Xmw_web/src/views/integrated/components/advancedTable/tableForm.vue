<template>
    <!-- 抽屉-新建编辑表单 -->
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
                        <a-select v-decorator="rules.type" style="width: 100%" placeholder="请选择Bug类型" allowClear>
                            <a-select-option v-for="item in BugType" :key="item.value" :value="item.value">
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
                            <a-select-option v-for="item in DegreeType" :key="item.value" :value="item.value">
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
                            <a-select-option v-for="item in PriorityType" :key="item.value" :value="item.value">
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
                            <a-select-option v-for="item in StatusType" :key="item.value" :value="item.value">
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
                        <a-date-picker v-decorator="rules.endTime" style="width: 100%" format="YYYY-MM-DD" />
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
</template>

<script>
import { addEditAdvancedTable } from '@/api/integrated'
import bus from '@/utils/bus'
import moment from 'moment'
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'tableForm',
    props: {
        BugType: { type: Array, default: () => [] }, // BUG类型列表
        DegreeType: { type: Array, default: () => [] }, // 严重程度列表
        PriorityType: { type: Array, default: () => [] }, // 优先级列表
        StatusType: { type: Array, default: () => [] }, // 进度状态列表
        userList: { type: Array, default: () => [] }, // 指派给谁列表
    },
    data() {
        return {
            drawerTitle: '',
            visible: false,
            form: this.$form.createForm(this),
            loginState: false,
            BugID: '',
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
            sliderDis: false,
        }
    },
    created() {
        bus.$on('addForm', () => {
            this.visible = true
            this.drawerTitle = '新建BUG'
        })
        bus.$on('editForm', (record) => {
            let _this = this,
                cloneData = cloneDeep(record)
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
        })
    },
    beforeDestroy() {
        bus.$off('addForm')
        bus.$off('editForm')
    },
    methods: {
        // 进度显示控制
        formatter(value) {
            return `${value}%`
        },
        // 控制进度显示
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
        // 新建
        addBug() {
            let _this = this
            _this.visible = true
            _this.drawerTitle = '新建BUG'
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
                            await addEditAdvancedTable(params)
                                .then((res) => {
                                    if (res.state == 1) {
                                        _this.form.resetFields()
                                        _this.BugID = ''
                                        _this.visible = false
                                        _this.sliderDis = false
                                        _this.$message.success(res.msg)
                                        bus.$emit('updateTable')
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
    },
    watch: {
        BugType: {
            handler(newValue, oldValue) {
                this.BugType = newValue
            },
            immediate: true,
            deep: true,
        },
        DegreeType: {
            handler(newValue, oldValue) {
                this.DegreeType = newValue
            },
            immediate: true,
            deep: true,
        },
        PriorityType: {
            handler(newValue, oldValue) {
                this.PriorityType = newValue
            },
            immediate: true,
            deep: true,
        },
        StatusType: {
            handler(newValue, oldValue) {
                this.StatusType = newValue
            },
            immediate: true,
            deep: true,
        },
        userList: {
            handler(newValue, oldValue) {
                this.userList = newValue
            },
            immediate: true,
            deep: true,
        },
    },
}
</script>

<style>
</style>