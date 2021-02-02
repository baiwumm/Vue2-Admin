<template>
    <!-- 批量上传 -->
    <a-tooltip v-action:import>
        <template slot="title"> 批量上传 </template>
        <a-upload :before-upload="beforeUpload" :showUploadList="false">
            <a-button icon="upload" />
        </a-upload>
    </a-tooltip>
</template>

<script>
import bus from '@/utils/bus'
import { addEditAdvancedTable, saveSeniorExcel } from '@/api/integrated'
export default {
    name: 'batchUpload',
    data() {
        return {
            file: '',
        }
    },
    methods: {
        // 批量上传excel文件
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
            await saveSeniorExcel(formData)
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
                    let params = { upload: true, formData: excelData }
                    _this.loading = true
                    await addEditAdvancedTable(params)
                        .then((res) => {
                            if (res.state) {
                                _this.$message.success(res.msg)
                                bus.$emit('updateTable')
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
    },
}
</script>

<style>
</style>