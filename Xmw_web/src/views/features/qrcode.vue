<template>
    <page-header-wrapper
        content="在开发过程中（尤其是专门为手机开发页面）的时候,基本都会扫码进行手机真机查看,需要有二维码生成的诸多功能，并且根据需要增加了多二维码的一些需要的功能。"
    >
        <!-- 二维码卡片列表 -->
        <a-card>
            <!-- 二维码表单 -->
            <a-input v-model="qrTitle" size="large" placeholder="请输入标题" allowClear style="width: 100%" />
            <a-textarea
                style="width: 100%; margin: 10px 0"
                v-model="qrContent"
                placeholder="请输入内容或链接"
                allowClear
                :autoSize="{ minRows: 4, maxRows: 6 }"
            />
            <a-row type="flex" justify="space-between">
                <a-col>
                    <a-space>
                        <a-button type="primary" @click="createQrCode" :loading="qrLoading"> 生成 </a-button>
                        <a-button type="primary" @click="UpdateQr" v-if="showUpdate"> 更新 </a-button>
                        <a-button @click="cancelUpdate" v-if="showUpdate"> 取消 </a-button>
                    </a-space>
                </a-col>
            </a-row>
        </a-card>

        <a-list
            rowKey="id"
            :grid="{ gutter: 24, lg: 4, md: 3, sm: 2, xs: 1 }"
            :dataSource="qrList"
            style="margin-top: 20px"
        >
            <vuedraggable :list="qrList" @change="changeDra" slot="renderItem" slot-scope="item">
                <a-list-item>
                    <a-card :hoverable="true">
                        <VueQrcode :value="item.link" :options="QrCodeOpt" style="margin: 0 auto"></VueQrcode>
                        <h1 style="text-align: center; margin: 10px 0 0">{{ item.title }}</h1>
                        <template class="ant-card-actions" slot="actions">
                            <a-button type="link" icon="edit" @click="editQrCode(item)" />
                            <a-button type="link" icon="delete" @click="deleteQrCode(item.title)" />
                            <a-tooltip>
                                <template slot="title"> {{ item.timestamp }} </template>
                                <a-button type="link" icon="clock-circle" />
                            </a-tooltip>
                        </template>
                    </a-card>
                </a-list-item>
            </vuedraggable>
        </a-list>

        <!--  -->
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
            qrTitle: '',
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
            _this.qrLoading = true
            _this.isExist = false
            if (!_this.qrTitle || !_this.qrContent) {
                _this.$message.warning('标题或内容不能为空!')
                _this.qrLoading = false
                return false
            }
            _this.qrList.map((v) => {
                if (v.title == _this.qrTitle) {
                    _this.$message.error(`标题已存在,创建时间:${v.timestamp}`)
                    _this.qrLoading = false
                    _this.isExist = true
                }
            })
            if (_this.isExist) return false
            let id = _this.qrList.length ? _this.qrList[0].id : 0
            _this.qrList.unshift({
                id: id + 1,
                title: _this.qrTitle,
                link: _this.qrContent,
                timestamp: dataFormat(new Date(), 'yyyy/MM/dd', 1),
            })
            storage.set('QRCODE_LIST', _this.qrList)
            _this.qrTitle = ''
            _this.qrContent = ''
            _this.qrLoading = false
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
            _this.qrContent = item.link
            _this.showUpdate = true
        },
        // 更新二维码
        UpdateQr() {
            let _this = this
            _this.qrList.forEach((v) => {
                if (v.id == _this.qrID) {
                    v.title = _this.qrTitle
                    v.link = _this.qrContent
                    v.timestamp = dataFormat(new Date(), 'yyyy/MM/dd', 1)
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
            _this.qrContent = ''
            _this.showUpdate = false
        },
        // 拖拽
        changeDra() {
            console.log(_this.qrList)
            storage.set('QRCODE_LIST', _this.qrList)
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
