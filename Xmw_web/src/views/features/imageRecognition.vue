<template>
    <page-header-wrapper content="基于百度智能云的图像识别技术">
        <a-row :gutter="20">
            <a-col :span="24">
                <a-card :bordered="false">
                    <a-space>
                        <a-upload name="file" :showUploadList="false" :beforeUpload="beforeUpload">
                            <a-button> <a-icon type="upload" /> 上传图片</a-button>
                        </a-upload>
                        <a-button type="primary" @click="initiateCall"> 发起调用 </a-button>
                    </a-space>
                </a-card>
            </a-col>
            <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
                <a-card :bordered="false" hoverable title="调用图片">
                    <div class="img-container">
                        <img :src="uploadImg" style="width: 100%" />
                    </div>
                </a-card>
            </a-col>
            <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
                <a-card :bordered="false" hoverable title="识别数据">
                    <div class="img-container">
                        <a-table rowKey="score" :columns="columns" :data-source="data" :loading="loading"> </a-table>
                    </div>
                </a-card>
            </a-col>
            <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
                <a-card :bordered="false" hoverable title="JSON数据">
                    <a-spin :spinning="loading">
                        <div class="img-container">
                            <a-empty v-if="!data.length" />
                            <pre v-else>{{ JSON.stringify(data, null, 4) }}</pre>
                        </div>
                    </a-spin>
                </a-card>
            </a-col>
        </a-row>
    </page-header-wrapper>
</template>

<script>
import axios from 'axios'
const Qs = require('qs')
export default {
    name: 'imageRecognition',
    data() {
        return {
            data: [],
            uploadImg: '',
            access_token: '',
            columns: [
                {
                    title: '所属类目',
                    dataIndex: 'root',
                    key: 'root',
                },
                {
                    title: '关键词',
                    dataIndex: 'keyword',
                    key: 'keyword',
                },
                {
                    title: '识别度',
                    dataIndex: 'score',
                    key: 'score',
                },
            ],
            loading: false,
        }
    },
    methods: {
        beforeUpload(file) {
            // 获取文件类型
            let fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
            let whitelist = ['jpg', 'jpeg', 'png'].indexOf(fileType.toLowerCase()) !== -1
            // 判断图片大小
            let isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M || !whitelist) {
                this.$message.warning('文件只能是jpg、jpeg、png格式，且大小不能超过 5MB!')
                return false
            }
            const reader = new FileReader()
            // 把Array Buffer转化为blob 如果是base64不需要
            // 转化为base64
            reader.readAsDataURL(file)
            reader.onload = () => {
                this.uploadImg = reader.result
            }
            // 转化为blob
            // reader.readAsArrayBuffer(file)
            return false
        },
        // 发起调用百度图像识别接口
        async initiateCall() {
            this.loading = true
            if (!this.uploadImg) {
                this.$message.warning('请上传图片!')
                this.loading = false
                return false
            }
            // 调用token的三个必须参数,grant_type固定为client_credentials,client_id是应用APIKey,client_secret是应用SecretKey
            let grant_type = 'client_credentials',
                APIKey = '9dL8XaGrF2CwbwU2PeCQzpYV',
                SecretKey = 'g1wq2AFb5Xz7K7PBsvdk6eKutZXxtwHe'
            // 获取token
            await axios
                .get(
                    `/baiduApi/oauth/2.0/token?grant_type=${grant_type}&client_id=${APIKey}&client_secret=${SecretKey}`,
                    {
                        headers: {
                            dataType: 'json',
                        },
                    }
                )
                .then((res) => {
                    if (res.status == 200) {
                        this.access_token = res.data.access_token
                    }
                })
            await axios
                .post(
                    '/baiduApi/rest/2.0/image-classify/v2/advanced_general',
                    Qs.stringify({
                        access_token: this.access_token,
                        image: this.uploadImg.split(',')[1],
                    })
                )
                .then((res) => {
                    this.data = res.data.result
                    this.loading = false
                })
        },
    },
}
</script>

<style lang="less" scoped>
.ant-card /deep/ .ant-card-body {
    margin-bottom: 20px;
}
.img-container {
    height: 500px;
    overflow-y: auto;
}
</style>