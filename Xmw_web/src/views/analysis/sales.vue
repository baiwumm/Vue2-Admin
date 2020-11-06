<template>
    <div class="webSocket-container">
        <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <a-alert type="success" :closable="false" message="websocket连接成功"></a-alert>
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
import { webSockets } from '@/api/system'
export default {
    name: 'WebSocket',
    components: {},
    data() {
        return {
            data: [],
            url: 'http://127.0.0.1:7001/',
            form: this.$form.createForm(this),
        }
    },
    created() {
        this.sendMessageToServer()
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
                    this.data.push(values.message)
                    this.sendMessageToServer(values.message)
                } else {
                    return false
                }
            })
        },
        // 向服务端发送消息
        sendMessageToServer: function (data) {
            this.$socket.emit('announcement', data)
            // webSockets().then((res) => {
            //     console.log(res)
            // })
        },
    },
    mounted() {
        //接收服务端的信息
        this.sockets.subscribe('announcement', (data) => {
            console.log(111)
            console.log(data)
        })
    },
}
</script>
