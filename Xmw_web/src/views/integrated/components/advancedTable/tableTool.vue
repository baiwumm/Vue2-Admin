<template>
    <div class="toolbar">
        <a-row type="flex" justify="space-between">
            <a-col style="color: rgba(0, 0, 0, 0.85); font-weight: bold">高级表格</a-col>
            <a-col>
                <a-space size="middle">
                    <a-button type="primary" icon="plus" @click="addBug" v-action:add>新建</a-button>
                    <!-- 删除选中 -->
                    <a-tooltip v-action:delete>
                        <template slot="title"> 删除选中 </template>
                        <a-button
                            type="danger"
                            icon="delete"
                            @click="multiSelect"
                            :disabled="!selectedRowKeys.length"
                            :loading="delLoading"
                        />
                    </a-tooltip>
                    <!-- 批量上传 -->
                    <batch-upload></batch-upload>
                    <!-- 上传模板 -->
                    <export-template></export-template>
                    <!-- 导出文件 -->
                    <export-file></export-file>
                    <!-- 刷新 -->
                    <a-tooltip
                        ><template slot="title"> 刷新 </template
                        ><a-icon type="reload" style="cursor: pointer" :spin="addRotate" @click="reload"
                    /></a-tooltip>
                    <!-- 密度 -->
                    <a-tooltip>
                        <template slot="title"> 密度 </template>
                        <a-dropdown
                            :trigger="['click']"
                            placement="bottomCenter"
                            overlayClassName="ant-dropdown-menu-item-selected"
                        >
                            <a-icon type="column-height" style="cursor: pointer" @click="(e) => e.preventDefault()" />
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
                    <!-- 列设置 -->
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
                                        <a-col :span="12" v-for="(item, index) in plainOptions" :key="index">
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
            </a-col>
        </a-row>
    </div>
</template>

<script>
import bus from '@/utils/bus'
import batchUpload from './batchUpload'
import exportTemplate from './exportTemplate'
import exportFile from './exportFile'
export default {
    name: 'tableTool',
    components: {
        batchUpload,
        exportTemplate,
        exportFile,
    },
    props: {
        selectedRowKeys: {
            type: Array,
            default: () => [],
        },
        addRotate: {
            type: Boolean,
            default: false,
        },
        plainOptions: {
            type: Array,
            default: () => [],
        },
        checkedArr: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            delLoading: false,
            // 表格密度
            menuItem: [
                { key: 'default', label: '默认' },
                { key: 'middle', label: '中等' },
                { key: 'small', label: '紧凑' },
            ],
            density: 'default',
            indeterminate: false,
            checkedList: this.checkedArr,
            checkAll: true,
        }
    },
    methods: {
        // 新增
        addBug() {
            bus.$emit('addForm')
        },
        // 多选
        multiSelect() {
            this.$emit('multiSelect')
        },
        // 刷新
        reload() {
            this.$emit('reload')
        },
        // 表格密度
        menuClick(value) {
            this.density = this.menuItem[value.key].key
            this.$emit('density', this.density)
        },
        // 列设置
        onChange(checkedList) {
            this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
            this.checkAll = checkedList.length === this.plainOptions.length
            this.$emit('columnSetup', this.checkedList)
        },
        onCheckAllChange(e) {
            Object.assign(this, {
                checkedList: e.target.checked ? this.plainOptions.map((v) => v.value) : [],
                indeterminate: false,
                checkAll: e.target.checked,
            })
            this.$emit('columnSetup', this.checkedList)
        },
    },
    watch: {
        selectedRowKeys: {
            handler(newValue, oldValue) {
                this.selectedRowKeys = newValue
            },
            immediate: true,
            deep: true,
        },
        addRotate: {
            handler(newValue, oldValue) {
                this.addRotate = newValue
            },
            immediate: true,
            deep: true,
        },
        plainOptions: {
            handler(newValue, oldValue) {
                this.plainOptions = newValue
            },
            immediate: true,
            deep: true,
        },
        checkedArr: {
            handler(newValue, oldValue) {
                this.checkedArr = newValue
            },
            immediate: true,
            deep: true,
        },
    },
}
</script>

<style lang="less" scoped>
.toolbar {
    padding: 16px 0;
    font-size: 16px;
}
</style>