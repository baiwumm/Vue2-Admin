<template>
    <a-dropdown placement="bottomCenter">
        <a-button icon="download" />
        <a-menu slot="overlay">
            <a-menu-item>
                <a href="javascript:;" @click="exportExcel">导出excel</a>
            </a-menu-item>
            <a-menu-item>
                <a href="javascript:;" @click="exportCsv">导出Csv</a>
            </a-menu-item>
        </a-menu>
    </a-dropdown>
</template>
<script>
import { dataFormat } from '@/utils/util.js'
import { export_json_to_excel } from '@/utils/Excel/Export2Excel'
import CsvExportor from 'csv-exportor'
export default {
    props: {
        tHeader: { type: Array, default: () => [] }, // Excel的表格第一行的标题
        filterVal: { type: Array, default: () => [] }, // Data里对象的属性key值
        exportData: { type: Array, default: () => [] }, // excel数据列表
    },
    watch: {
        tHeader: {
            handler(newValue, oldValue) {
                this.tHeader = newValue
            },
            immediate: true,
            deep: true,
        },
        filterVal: {
            handler(newValue, oldValue) {
                this.filterVal = newValue
            },
            immediate: true,
            deep: true,
        },
        exportData: {
            handler(newValue, oldValue) {
                this.exportData = newValue
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        // 导出excel表格
        exportExcel() {
            require.ensure([], () => {
                const tHeader = this.tHeader
                const filterVal = this.filterVal
                tHeader.pop()
                const list = JSON.parse(JSON.stringify(this.exportData))
                const data = this.formatJson(filterVal, list)
                export_json_to_excel(tHeader, data, 'BUG列表' + dataFormat(new Date(), 'yyyyMMdd'))
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map((v) => filterVal.map((j) => v[j]))
        },
        // 导出csv格式
        exportCsv() {
            const tHeader = this.tHeader
            tHeader.pop()
            tHeader.unshift('序号')
            const list = JSON.parse(JSON.stringify(this.exportData))
            CsvExportor.downloadCsv(list, { header: tHeader }, 'BUG列表' + dataFormat(new Date(), 'yyyyMMdd') + '.csv')
        },
    },
}
</script>

<style>
</style>