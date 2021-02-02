<template>
    <a-modal
        title="修改头像"
        :visible="visible"
        :maskClosable="false"
        :confirmLoading="confirmLoading"
        :width="800"
        :footer="null"
        @cancel="cancelHandel"
    >
        <a-row>
            <a-col :xs="24" :md="12" :style="{ height: '350px' }">
                <vue-cropper
                    ref="cropper"
                    :img="options.img"
                    :info="true"
                    :autoCrop="options.autoCrop"
                    :autoCropWidth="options.autoCropWidth"
                    :autoCropHeight="options.autoCropHeight"
                    :fixedBox="options.fixedBox"
                    @realTime="realTime"
                >
                </vue-cropper>
            </a-col>
            <a-col :xs="24" :md="12" :style="{ height: '350px' }">
                <div class="avatar-upload-preview">
                    <img :src="previews.url" :style="previews.img" />
                </div>
            </a-col>
        </a-row>
        <br />
        <a-row>
            <a-col :lg="2" :md="2">
                <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false">
                    <a-button icon="upload">选择图片</a-button>
                </a-upload>
            </a-col>
            <a-col :lg="{ span: 1, offset: 2 }" :md="2">
                <a-button icon="plus" @click="changeScale(1)" />
            </a-col>
            <a-col :lg="{ span: 1, offset: 1 }" :md="2">
                <a-button icon="minus" @click="changeScale(-1)" />
            </a-col>
            <a-col :lg="{ span: 1, offset: 1 }" :md="2">
                <a-button icon="undo" @click="rotateLeft" />
            </a-col>
            <a-col :lg="{ span: 1, offset: 1 }" :md="2">
                <a-button icon="redo" @click="rotateRight" />
            </a-col>
            <a-col :lg="{ span: 2, offset: 6 }" :md="2">
                <a-button type="primary" @click="finish('blob')">保存</a-button>
            </a-col>
        </a-row>
    </a-modal>
</template>
<script>
import storage from 'store'
import { USER_INFO } from '@/store/mutation-types'
import { changeUserImg } from '@/api/login'
import { getBase64Image } from '../../../utils/util.js'
export default {
    data() {
        return {
            visible: false,
            id: null,
            confirmLoading: false,
            fileList: [],
            uploading: false,
            options: {
                img: '',
                autoCrop: true,
                autoCropWidth: 200,
                autoCropHeight: 200,
                fixedBox: true,
            },
            previews: {},
            fileName: '',
            user: {},
        }
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfo
        },
    },
    created() {
        this.user = this.userInfo
    },
    methods: {
        edit(id) {
            this.visible = true
            this.id = id
            /* 获取原始头像 */
        },
        close() {
            this.id = null
            this.visible = false
        },
        cancelHandel() {
            this.close()
        },
        changeScale(num) {
            num = num || 1
            this.$refs.cropper.changeScale(num)
        },
        rotateLeft() {
            this.$refs.cropper.rotateLeft()
        },
        rotateRight() {
            this.$refs.cropper.rotateRight()
        },
        beforeUpload(file) {
            // 获取文件名
            this.fileName = file.name
            // 获取文件类型
            let fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
            let whitelist = ['jpg', 'jpeg', 'png'].indexOf(fileType.toLowerCase()) !== -1
            // 判断图片大小
            let isLt5M = file.size / 1024 / 1024 < 2
            if (!isLt5M || !whitelist) {
                this.$message.warning('文件只能是jpg、jpeg、png格式，且大小不能超过 2MB!')
                return false
            }
            const reader = new FileReader()
            // 把Array Buffer转化为blob 如果是base64不需要
            // 转化为base64
            reader.readAsDataURL(file)
            reader.onload = () => {
                this.options.img = reader.result
            }
            // 转化为blob
            // reader.readAsArrayBuffer(file)
            return false
        },
        // 上传图片（点击上传按钮）
        finish(type) {
            const _this = this
            const formData = new FormData()
            // 输出
            if (type === 'blob') {
                this.$refs.cropper.getCropBlob(async (data) => {
                    const img = window.URL.createObjectURL(data)
                    this.model = true
                    this.modelSrc = img
                    var fileOfBlob = new File([data], this.fileName)
                    formData.append('SaveFileName', 'admin')
                    formData.append('file', fileOfBlob)
                    formData.append('UserID', this.user.UserID)
                    await changeUserImg(formData).then((res) => {
                        _this.options.img = ''
                        if (res.state == 1) {
                            let avatar = { avatar: res.fullPath }
                            let storeUser = Object.assign(this.user, avatar)
                            storage.set(USER_INFO, storeUser)
                            _this.$message.success(res.msg)
                            _this.$emit('ok', res.fullPath)
                            _this.visible = false
                        } else {
                            _this.$message.error(res.msg)
                        }
                    })
                })
            } else {
                this.$refs.cropper.getCropData((data) => {
                    this.model = true
                    this.modelSrc = data
                })
            }
        },
        okHandel() {
            const vm = this

            vm.confirmLoading = true
            setTimeout(() => {
                vm.confirmLoading = false
                vm.close()
                vm.$message.success('上传头像成功')
            }, 2000)
        },

        realTime(data) {
            this.previews = data
        },
    },
}
</script>

<style lang="less" scoped>
.avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>
