<template>
    <div class="phone-verify">
        <a-row :gutter="10">
            <a-col :span="10">
                <a-input placeholder="请输入手机号码" v-model="mobileNumber" />
            </a-col>
            <a-col :span="14">
                <a-input-search placeholder="请输入短信验证码" @search="sendSms" v-model="msgNumber">
                    <a-button slot="enterButton" type="primary" :disabled="isDisabled">
                        {{ btnText }}
                    </a-button>
                </a-input-search>
            </a-col>
        </a-row>
    </div>
</template>
<script>
import { randomNum } from '@/utils/util'
export default {
    name: 'phoneVerify',
    props: {
        // 验证码倒计时
        waitTime: {
            type: Number,
            default: 10,
        },
    },
    data() {
        return {
            timer: null,
            btnText: '获取验证码',
            isDisabled: false,
            mobileNumber: '',
            msgNumber: '',
            smsCode: '',
        }
    },
    methods: {
        // 发送验证码
        sendSms() {
            let _this = this
            if (!_this.mobileNumber) {
                _this.$message.warning('请输入手机号码!')
                return
            }
            if (!/^1[34578]\d{9}$/.test(_this.mobileNumber)) {
                _this.$message.warning('请输入正确的手机号码!')
                return
            }
            _this.smsCode = randomNum(1000, 9999)
            _this.$message.info(`短信验证码为:${_this.smsCode}`, 10)
            let countdown = _this.waitTime
            _this.timer = setInterval(() => {
                if (countdown > 1) {
                    countdown--
                    _this.isDisabled = true
                    _this.btnText = `${countdown}s 后重新获取`
                } else {
                    clearInterval(_this.timer)
                    _this.isDisabled = false
                    _this.btnText = '获取验证码'
                }
            }, 1000)
        },
        checkCode() {
            let _this = this
            if (_this.smsCode == _this.msgNumber) _this.$message.success('验证成功!')
            else _this.$message.error('验证码错误!')
        },
    },
}
</script>