<template>
    <div class="webSocket-container">
        <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <a-alert type="success" :closable="false" :message="status"></a-alert>
                <br />
                <a-form ref="form" :form="form" label-width="100px" @submit="submit">
                    <a-form-item label="地址">
                        <a-input v-model="url" disabled></a-input>
                    </a-form-item>
                    <a-form-item label="消息" prop="message">
                        <a-input
                            v-decorator="[
                                'message',
                                { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' },
                            ]"
                        ></a-input>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" htmlType="submit">发送消息</a-button>
                    </a-form-item>
                    <a-form-item label="返回信息汇总">
                        {{ data }}
                    </a-form-item>
                </a-form>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    name: 'WebSocket',
    components: {},
    data() {
        return {
            url: 'ws://127.0.0.1:7001/chat',
            webSocket: null,
            data: [],
            status: '',
            form: this.$form.createForm(this),
        }
    },
    created() {
        this.init()
    },
    destroyed() {
        this.webSocket.close()
    },
    methods: {
        submit(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
            } = _this
            const validateFieldsKey = ['message']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                console.log(values)
                if (!err) {
                    this.send(values.message)
                } else {
                    return false
                }
            })
        },
        init() {
            const wsuri = this.url
            this.webSocket = new WebSocket(wsuri)
            this.webSocket.onmessage = this.onmessage
            this.webSocket.onopen = this.onopen
            this.webSocket.onerror = this.onerror
            this.webSocket.onclose = this.onclose
        },
        onopen() {
            this.status = 'webSocket连接成功'
        },
        onerror() {
            this.status = 'webSocket连接失败'
            this.initWebSocket()
        },
        onmessage({ data }) {
            //截掉测试webSocket地址广告
            this.data.push(data.substring(0, data.length - 66))
        },
        send(Data) {
            this.webSocket.send(Data)
        },
        onclose(e) {
            this.status = 'webSocket连接断开'
        },
    },
}
</script>
