<template>
    <div class="lock-container">
        <div class="lock-form">
            <h1 style="font-weight: bold; color: rgba(255, 255, 255, 0.8)">{{ nickname }}</h1>
            <a-input-password
                v-model="lockpd"
                placeholder="请输入锁屏密码"
                size="large"
                allowClear
                @pressEnter="handleLogin"
            >
                <div slot="addonAfter">
                    <a-space size="middle">
                        <a-tooltip>
                            <template slot="title"> 解锁 </template>
                            <a-icon type="unlock" style="cursor: pointer; font-size: 20px" @click="handleLogin" />
                        </a-tooltip>
                        <a-tooltip>
                            <template slot="title"> 注销登录 </template>
                            <a-icon type="logout" style="cursor: pointer; font-size: 20px" @click="handleLogout" />
                        </a-tooltip>
                    </a-space>
                </div>
            </a-input-password>
        </div>
    </div>
</template>
<script>
import { Modal } from 'ant-design-vue'
import storage from 'store'
import { SET_LOCK_PASSWD, LOCK_PATH } from '@/store/mutation-types'
import CryptoJS from 'crypto-js'
import { crypto_key, crypto_iv } from '@/utils/util'
export default {
    name: 'Lock',
    data() {
        return {
            lockpd: '',
        }
    },
    computed: {
        nickname() {
            return this.$store.getters.nickname
        },
    },
    methods: {
        handleLogout() {
            Modal.confirm({
                title: this.$t('layouts.usermenu.dialog.title'),
                content: this.$t('layouts.usermenu.dialog.content'),
                onOk: () => {
                    return this.$store.dispatch('Logout').then(async () => {
                        this.$message.success('注销成功!')
                        this.$router.push({ name: 'login' })
                    })
                },
            })
        },
        handleLogin() {
            let _this = this
            //拿到加密后的密码并解密
            let decrypted = CryptoJS.AES.decrypt(storage.get(SET_LOCK_PASSWD), crypto_key, {
                iv: crypto_iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            })
            let decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)
            if (_this.lockpd != decryptedStr) {
                _this.$message.error('锁屏密码不正确!')
                return
            }
            setTimeout(() => {
                let path = storage.get(LOCK_PATH)
                this.$store.commit('CLEAR_LOCK')
                this.$router.push({ path: path })
            }, 1000)
        },
    },
}
</script>

<style lang="less" scoped>
.lock-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .title {
        margin-bottom: 8px;
        color: #333;
    }
}
.lock-container::before {
    z-index: -999;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url('../../assets/lockScreen.jpg');
    background-size: cover;
}
.lock-form {
    width: 300px;
}
</style>