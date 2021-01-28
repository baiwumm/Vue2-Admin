<template>
    <div id="lockScreen">
        <a-tooltip placement="bottom">
            <template slot="title"> 锁屏 </template>
            <a-icon type="lock" style="font-size: 20px" @click="lockVisible = true" />
        </a-tooltip>
        <a-modal v-model="lockVisible" title="设置锁屏密码" @ok="handleSubmit" @cancel="clearPw">
            <div class="user-avatar">
                <a-avatar :size="100" :src="avatar" />
                <p>{{ nickname }}</p>
            </div>
            <a-form :form="form">
                <a-form-item label="锁屏密码">
                    <a-input-password
                        v-decorator="['lockPasswd', { rules: [{ required: true, message: '请输入锁屏密码' }] }]"
                        placeholder="请输入锁屏密码"
                        allowClear
                        @pressEnter="handleSubmit"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import store from '../../store'
import CryptoJS from 'crypto-js'
import { crypto_key, crypto_iv } from '@/utils/util.js'
export default {
    name: 'LockScreen',
    data() {
        return {
            lockVisible: false,
            form: this.$form.createForm(this),
        }
    },
    computed: {
        avatar() {
            return this.$store.getters.avatar
        },
        nickname() {
            return this.$store.getters.nickname
        },
    },
    methods: {
        clearPw() {
            this.form.resetFields()
        },
        // 设置锁屏密码
        handleSubmit(e) {
            let _this = this
            e.preventDefault()
            const {
                form: { validateFields },
            } = _this
            const validateFieldsKey = ['lockPasswd']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    let lockPasswd = CryptoJS.AES.encrypt(values.lockPasswd, crypto_key, {
                        iv: crypto_iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7,
                    }).toString()
                    store.commit('SET_LOCK_PASSWD', lockPasswd)
                    _this.handleLock()
                }
            })
        },
        handleLock() {
            store.commit('SET_LOCK')
            setTimeout(() => {
                this.$router.push({ path: '/lock' })
            }, 100)
        },
    },
}
</script>

<style lang="less" scoped>
.user-avatar {
    text-align: center;
}
.user-avatar p {
    font-size: 24px;
    font-weight: bold;
    color: #000;
}
</style>