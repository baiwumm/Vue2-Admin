
<template>
    <!-- 上传模板 -->
    <a-tooltip>
        <template slot="title"> 上传模板 </template>
        <a-button icon="file-text" @click="exportTemplate()" />
    </a-tooltip>
</template>

<script>
import { export_json_to_excel } from '@/utils/Excel/Export2Excel'
export default {
    name: 'exportTemplate',
    methods: {
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
    },
}
</script>

<style>
</style>