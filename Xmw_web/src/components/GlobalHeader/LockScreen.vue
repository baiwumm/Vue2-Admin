<template>
    <a-modal v-model="lockVisible" title="长时间未操作,屏幕已锁定" :closable="false" :maskClosable="false">
        <h1 style="font-weight: bold">{{ nickname }}</h1>
        <a-form :form="form">
            <a-form-item label="登录密码">
                <a-input-password
                    size="large"
                    v-decorator="['password', { rules: [{ required: true, message: '请输入登录密码' }] }]"
                    placeholder="请输入登录密码"
                    allowClear
                    @pressEnter="handleSubmit"
                />
            </a-form-item>
        </a-form>
        <template slot="footer">
            <a-button type="primary" @click="handleSubmit">确定</a-button>
        </template>
    </a-modal>
</template>

<script>
import storage from 'store'
import { UserPw } from '@/api/login'
import CryptoJS from 'crypto-js'
import { crypto_key, crypto_iv } from '@/utils/util'
export default {
    data() {
        return {
            lockVisible: false,
            form: this.$form.createForm(this),
            lastTime: new Date().getTime(), // 用户最后操作的时间
            currentTime: new Date().getTime(), // 当前时间
            timeOut: 60 * 60 * 1000, //设置超时时间: 1小时
            timer: null,
        }
    },
    computed: {
        nickname() {
            return this.$store.getters.nickname
        },
        userInfo() {
            return this.$store.getters.userInfo
        },
    },
    methods: {
        handleSubmit(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
            } = _this
            const validateFieldsKey = ['password']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    UserPw().then((res) => {
                        if (res.state) {
                            //拿到加密后的密码并解密
                            let decrypted = CryptoJS.AES.decrypt(res.result.password, crypto_key, {
                                iv: crypto_iv,
                                mode: CryptoJS.mode.CBC,
                                padding: CryptoJS.pad.Pkcs7,
                            })
                            let decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)
                            if (values.password != decryptedStr) {
                                _this.$message.error('登录密码不正确!')
                                return
                            }
                            // 当确认密码后，再次启用定时器和设置storage
                            _this.setTimer()
                            storage.set('LockScreen', false)
                            storage.set('lastTime', new Date().getTime())
                            _this.lockVisible = false
                            _this.form.resetFields()
                        } else {
                            _this.$message.error(res.msg)
                        }
                    })
                }
            })
        },
        setTimer() {
            window.document.onmousedown = function () {
                storage.set('lastTime', new Date().getTime())
            }
            this.timer = setInterval(this.checkTimeout, 10 * 60 * 1000) // 10分钟执行一次
        },
        checkTimeout() {
            let _this = this
            _this.currentTime = new Date().getTime() //更新当前时间
            if (storage.get('lastTime')) _this.lastTime = storage.get('lastTime')
            // 判断是否超时
            if (_this.currentTime - _this.lastTime > _this.timeOut) {
                // 如果超时弹出框，并清除storage和timer
                storage.set('LockScreen', true)
                _this.lockVisible = true
                storage.remove('lastTime')
                clearInterval(this.timer)
            }
        },
    },
    mounted() {
        this.$nextTick(() => {
            if (storage.get('LockScreen')) this.lockVisible = true
            this.setTimer()
        })
    },
    // 页面销毁前清除定时器
    beforeDestroy() {
        clearInterval(this.timer)
    },
}
</script>

<style>
</style>
