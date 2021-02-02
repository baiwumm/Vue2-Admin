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
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'exportFile',
    inject: ['tHeader', 'filterVal', 'getExportData', 'getSelectedRowKeys'],
    computed: {
        exportData() {
            return this.getExportData()
        },
        selectedRowKeys() {
            return this.getSelectedRowKeys()
        },
    },
    methods: {
        // 导出excel表格
        exportExcel() {
            require.ensure([], () => {
                let list = []
                const tHeader = cloneDeep(this.tHeader)
                const filterVal = this.filterVal
                tHeader.pop()
                // 判断是否是多选
                if (this.selectedRowKeys.length) {
                    for (let i = 0; i < this.exportData.length; i++) {
                        for (let j = 0; j < this.selectedRowKeys.length; j++) {
                            if (this.exportData[i].BugID == this.selectedRowKeys[j]) {
                                list.push(this.exportData[i])
                            }
                        }
                    }
                } else {
                    list = JSON.parse(JSON.stringify(this.exportData))
                }
                const data = this.formatJson(filterVal, list)
                export_json_to_excel(tHeader, data, 'BUG列表' + dataFormat(new Date(), 'yyyyMMdd'))
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map((v) => filterVal.map((j) => v[j]))
        },
        // 导出csv格式
        exportCsv() {
            let list = []
            const tHeader = this.tHeader
            tHeader.pop()
            tHeader.unshift('序号')
            // 判断是否是多选
            if (this.selectedRowKeys.length) {
                for (let i = 0; i < this.exportData.length; i++) {
                    for (let j = 0; j < this.selectedRowKeys.length; j++) {
                        if (this.exportData[i].BugID == this.selectedRowKeys[j]) {
                            list.push(this.exportData[i])
                        }
                    }
                }
            } else {
                list = JSON.parse(JSON.stringify(this.exportData))
            }
            CsvExportor.downloadCsv(list, { header: tHeader }, 'BUG列表' + dataFormat(new Date(), 'yyyyMMdd') + '.csv')
        },
    },
}
</script>

<style>
</style>