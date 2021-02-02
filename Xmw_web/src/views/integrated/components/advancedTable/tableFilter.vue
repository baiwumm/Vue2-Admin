<template>
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
                                <a-select-option :value="item.value" v-for="(item, index) in BugType" :key="index">{{
                                    item.text
                                }}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item label="严重程度">
                            <a-select placeholder="请选择严重程度" v-model="queryForm.degree" allowClear>
                                <a-select-option :value="item.value" v-for="(item, index) in DegreeType" :key="index">{{
                                    item.text
                                }}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <template v-if="colShow">
                        <a-col :md="6" :sm="24">
                            <a-form-item label="优先级">
                                <a-select placeholder="请选择优先级" v-model="queryForm.priority" allowClear>
                                    <a-select-option
                                        :value="item.value"
                                        v-for="(item, index) in PriorityType"
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
                                        v-for="(item, index) in StatusType"
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
</template>

<script>
export default {
    name: 'tableFilter',
    props: {
        BugType: { type: Array, default: () => [] }, // BUG类型列表
        DegreeType: { type: Array, default: () => [] }, // 严重程度列表
        PriorityType: { type: Array, default: () => [] }, // 优先级列表
        StatusType: { type: Array, default: () => [] }, // 进度状态列表
        queryLoading: { type: Boolean, default: false }, // 按钮状态
    },
    data() {
        return {
            queryForm: {},
            colShow: false,
        }
    },
    methods: {
        togglePackUp() {
            let _this = this
            _this.colShow = !_this.colShow
        },
        // 筛选
        query() {
            this.$emit('filter', this.queryForm)
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
        queryLoading: {
            handler(newValue, oldValue) {
                this.queryLoading = newValue
            },
            immediate: true,
            deep: true,
        },
    },
}
</script>

<style>
</style>