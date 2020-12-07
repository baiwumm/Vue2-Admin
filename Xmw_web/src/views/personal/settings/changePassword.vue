<template>
    <div class="account-settings-info-view">
        <a-card :bordered="false" title="修改密码">
            <a-row :gutter="16">
                <a-col :md="24" :lg="16">
                    <a-alert
                        v-if="isLoginError.state"
                        :type="isLoginError.error"
                        showIcon
                        style="margin-bottom: 24px"
                        :message="isLoginError.message"
                    />
                    <a-form layout="vertical" :form="form" @submit="handleSubmit">
                        <a-form-item label="原密码">
                            <a-input-password
                                placeholder="请输入原密码!"
                                v-decorator="[
                                    'originalPassword',
                                    {
                                        rules: [{ required: true, message: '请输入原密码!' }],
                                        validateTrigger: 'change',
                                    },
                                ]"
                            >
                                <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
                            </a-input-password>
                        </a-form-item>
                        <a-form-item label="新密码">
                            <a-input-password
                                placeholder="请输入新密码!"
                                v-decorator="[
                                    'newPassword',
                                    {
                                        rules: [{ required: true, message: '请输入新密码!' }],
                                        validateTrigger: 'change',
                                    },
                                ]"
                            >
                                <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
                            </a-input-password>
                        </a-form-item>
                        <a-form-item label="确认密码">
                            <a-input-password
                                placeholder="请确认新密码!"
                                v-decorator="[
                                    'confirmPassword',
                                    {
                                        rules: [{ required: true, message: '请确认新密码!' }],
                                        validateTrigger: 'change',
                                    },
                                ]"
                            >
                                <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
                            </a-input-password>
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                type="primary"
                                htmlType="submit"
                                :loading="passwordState"
                                :disabled="passwordState"
                                v-action:password
                                >提交</a-button
                            >
                        </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import { changeUserPassword } from '@/api/login'
import { crypto_key, crypto_iv } from '@/utils/util'
export default {
    data() {
        return {
            form: this.$form.createForm(this),
            passwordState: false,
            isLoginError: {
                state: false,
                error: 'error',
                message: '',
            },
        }
    },
    methods: {
        handleSubmit(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
            } = _this
            _this.passwordState = true
            const validateFieldsKey = ['originalPassword', 'newPassword', 'confirmPassword']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const passwordParams = { ...values }
                    if (passwordParams.newPassword != passwordParams.confirmPassword) {
                        _this.isLoginError.state = true
                        _this.isLoginError.message = '新密码不匹配,请确认!'
                        _this.passwordState = false
                        return
                    }
                    if (passwordParams.newPassword.length < 6 || passwordParams.confirmPassword.length < 6) {
                        _this.isLoginError.state = true
                        _this.isLoginError.message = '密码长度不能小于6位!'
                        _this.passwordState = false
                        return
                    }
                    passwordParams.lastPassword = _this.$options.methods.getAesString(
                        values.newPassword,
                        crypto_key,
                        crypto_iv
                    )
                    passwordParams.originalPassword = _this.$options.methods.getAesString(
                        values.originalPassword,
                        crypto_key,
                        crypto_iv
                    )
                    _this.$confirm({
                        title: '确认操作',
                        content: '您确认提交吗?',
                        onOk: async () => {
                            await changeUserPassword(passwordParams)
                                .then((res) => {
                                    _this.isLoginError.message = res.msg
                                    if (res.state == 1) {
                                        _this.isLoginError.error = 'success'
                                        setTimeout(() => {
                                            _this.isLoginError.state = false
                                        }, 2000)
                                    } else {
                                        _this.isLoginError.error = 'error'
                                    }
                                })
                                .catch((err) => {
                                    _this.$message.error(err.msg)
                                })
                                .finally(() => {
                                    _this.isLoginError.state = true
                                    setTimeout(() => {
                                        _this.passwordState = false
                                    }, 600)
                                })
                        },
                        onCancel() {
                            _this.passwordState = false
                        },
                    })
                } else {
                    setTimeout(() => {
                        _this.passwordState = false
                    }, 600)
                }
            })
        },
        getAesString(data, key, iv) {
            //加密
            var encrypted = CryptoJS.AES.encrypt(data, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            })
            return encrypted.toString() //返回的是base64格式的密文
        },
    },
}
</script>

<style lang="less" scoped>
.avatar-upload-wrapper {
    height: 200px;
    width: 100%;
}
</style>
