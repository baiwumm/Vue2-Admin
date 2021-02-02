<template>
    <page-header-wrapper
        content="在开发过程中（尤其是专门为手机开发页面）的时候,基本都会扫码进行手机真机查看,需要有二维码生成的诸多功能，并且根据需要增加了多二维码的一些需要的功能。"
    >
        <!-- 二维码卡片列表 -->
        <a-card>
            <a-row type="flex" justify="space-between" :gutter="24">
                <a-col :span="2">
                    <a-select style="width: 100%" size="large" v-model="cType">
                        <a-select-option value="link"> 链接 </a-select-option>
                        <a-select-option value="content"> 内容 </a-select-option>
                    </a-select>
                </a-col>
                <!-- 二维码表单 -->
                <a-col :span="8">
                    <a-input v-model="qrTitle" size="large" addon-before="标题" placeholder="请输入标题" allowClear
                /></a-col>
                <a-col :span="8">
                    <a-input v-model="qrLink" size="large" placeholder="请输入链接" allowClear v-if="cType == 'link'">
                        <a-select slot="addonBefore" style="width: 90px" v-model="agreement">
                            <a-select-option value="http://"> http:// </a-select-option>
                            <a-select-option value="https://"> https:// </a-select-option>
                        </a-select>
                        <a-select slot="addonAfter" style="width: 80px" v-model="suffix">
                            <a-select-option value=".com"> .com </a-select-option>
                            <a-select-option value=".jp"> .jp </a-select-option>
                            <a-select-option value=".cn"> .cn </a-select-option>
                            <a-select-option value=".org"> .org </a-select-option>
                        </a-select>
                    </a-input>
                    <a-input
                        v-else
                        v-model="qrContent"
                        size="large"
                        addon-before="内容"
                        placeholder="请输入内容"
                        allowClear
                    />
                </a-col>
                <a-col :span="6">
                    <a-space>
                        <a-button type="primary" @click="createQrCode" size="large" :loading="qrLoading" v-action:add>
                            生成
                        </a-button>
                        <a-button type="primary" @click="UpdateQr" size="large" v-if="showUpdate"> 更新 </a-button>
                        <a-button @click="cancelUpdate" size="large" v-if="showUpdate"> 取消 </a-button>
                    </a-space>
                </a-col>
            </a-row>
        </a-card>
        <!-- 二维码列表,a-list不能插入拖拽，采用栅格布局 -->
        <a-row :gutter="24">
            <vuedraggable :list="qrList" @change="changeDra">
                <a-col
                    :lg="6"
                    :md="8"
                    :sm="12"
                    :xs="24"
                    v-for="(item, index) in qrList"
                    :key="index"
                    style="margin-top: 20px"
                >
                    <a-card :hoverable="true">
                        <VueQrcode
                            :value="item.link || item.content"
                            :options="QrCodeOpt"
                            style="margin: 0 auto"
                        ></VueQrcode>
                        <h1 style="text-align: center; margin: 10px 0 0">{{ item.title }}</h1>
                        <template class="ant-card-actions" slot="actions">
                            <a-button type="link" icon="edit" @click="editQrCode(item)" v-action:edit />
                            <a-button type="link" icon="delete" @click="deleteQrCode(item.title)" v-action:delete />
                            <a-tooltip>
                                <template slot="title"> {{ formatTime(item.timestamp) }} </template>
                                <a-button type="link" icon="clock-circle" />
                            </a-tooltip>
                        </template>
                    </a-card>
                </a-col>
            </vuedraggable>
        </a-row>
    </page-header-wrapper>
</template>

<script>
import storage from 'store'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { dataFormat } from '@/utils/util.js'
export default {
    name: 'qrcode',
    components: { VueQrcode },
    data() {
        return {
            cType: 'link',
            agreement: 'https://',
            suffix: '.com',
            qrTitle: '',
            qrLink: '',
            qrContent: '',
            qrLoading: false,
            qrList: storage.get('QRCODE_LIST') || [],
            showUpdate: false,
            isExist: false,
            qrID: '',
            QrCodeOpt: {
                errorCorrectionLevel: 'H',
                width: 250,
                height: 250,
                quality: 0.3,
                margin: 1,
                // color: {
                //     dark: '#010599FF',
                //     light: '#FFBF60FF',
                // },
            },
        }
    },
    methods: {
        // 生成二维码
        createQrCode(e) {
            let _this = this
            let qrType = _this.cType == 'link'
            _this.qrLoading = true
            _this.isExist = false
            if (!_this.qrTitle || !(qrType ? _this.qrLink : _this.qrContent)) {
                _this.$message.warning(`标题或${qrType ? '链接' : '内容'}不能为空!`)
                _this.qrLoading = false
                return false
            }
            _this.qrList.map((v) => {
                if (v.title == _this.qrTitle) {
                    _this.$message.error(`标题已存在,创建时间:${_this.formatTime(v.timestamp)}`)
                    _this.qrLoading = false
                    _this.isExist = true
                }
            })
            if (_this.isExist) return false
            let id = _this.qrList.length ? _this.qrList[0].id : 0
            let qrTemp = { id: id + 1, title: _this.qrTitle, timestamp: dataFormat(new Date(), 'yyyy-MM-dd hh:mm:ss') }
            _this.qrList.unshift(
                Object.assign(
                    qrTemp,
                    qrType ? { link: _this.agreement + _this.qrLink + _this.suffix } : { content: _this.qrContent }
                )
            )
            storage.set('QRCODE_LIST', _this.qrList)
            _this.cancelUpdate()
        },
        formatTime(time) {
            return dataFormat(time, 'yyyy/MM/dd', 1)
        },
        // 删除二维码
        deleteQrCode(title) {
            let _this = this
            _this.qrList = _this.qrList.filter((v) => {
                return v.title != title
            })
            _this.$message.success('删除成功!')
            storage.set('QRCODE_LIST', _this.qrList)
        },
        // 编辑二维码
        editQrCode(item) {
            let _this = this
            _this.qrID = item.id
            _this.qrTitle = item.title
            if (item.link) {
                let link = item.link.split('//')[1].split('.')
                link.pop()
                let suffix = item.link.split('.')
                _this.cType = 'link'
                _this.agreement = item.link.split('//')[0] + '//'
                _this.suffix = '.' + suffix[suffix.length - 1]
                _this.qrLink = link.join('.')
            } else {
                _this.cType = 'content'
                _this.qrContent = item.content
            }
            _this.showUpdate = true
        },
        // 更新二维码
        UpdateQr() {
            let _this = this
            _this.qrList.forEach((v) => {
                if (v.id == _this.qrID) {
                    v.title = _this.qrTitle
                    _this.cType == 'link'
                        ? (v.link = _this.agreement + _this.qrLink + _this.suffix)
                        : (v.content = _this.qrContent)
                    v.timestamp = dataFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                }
            })
            storage.set('QRCODE_LIST', _this.qrList)
            _this.cancelUpdate()
        },
        // 取消更新
        cancelUpdate() {
            let _this = this
            _this.qrID = ''
            _this.qrTitle = ''
            _this.qrLink = ''
            _this.qrContent = ''
            _this.cType = 'link'
            ;(_this.agreement = 'https://'), (_this.suffix = '.com'), (_this.qrLoading = false)
            _this.showUpdate = false
        },
        // 拖拽
        changeDra() {
            storage.set('QRCODE_LIST', this.qrList)
        },
    },
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
.card-list {
    /deep/ .ant-card-body:hover {
        .ant-card-meta-title > a {
            color: @primary-color;
        }
    }
}
</style>
