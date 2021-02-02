<template>
    <a-dropdown v-if="user && user.CnName" placement="bottomRight">
        <span class="ant-pro-account-avatar">
            <a-avatar size="small" :src="user.avatar" v-if="user.avatar" class="antd-pro-global-header-index-avatar" />
            <a-avatar size="small" :src="user.avatar" v-else class="antd-pro-global-header-index-avatar">
                {{ user.CnName.charAt(user.CnName.length - 1) }}
            </a-avatar>
            <span style="vertical-align: middle; margin-left: 5px">{{ user.CnName }}</span>
        </span>
        <template v-slot:overlay>
            <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
                <a-menu-item key="center" @click="handleToCenter">
                    <a-icon type="user" />
                    个人中心
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                    <a-icon type="logout" />
                    注销登录
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
    <span v-else>
        <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
    </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
export default {
    name: 'AvatarDropdown',
    data() {
        return {
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
        handleToCenter() {
            this.$router.push({ path: '/personal/center' })
        },
        handleLogout(e) {
            Modal.confirm({
                title: this.$t('layouts.usermenu.dialog.title'),
                content: this.$t('layouts.usermenu.dialog.content'),
                onOk: () => {
                    return this.$store.dispatch('Logout').then(() => {
                        this.$router.push({ path: '/user/login' })
                        this.$message.success('注销成功!')
                    })
                },
            })
        },
    },
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
.ant-pro-drop-down {
    /deep/ .action {
        margin-right: 8px;
    }
    /deep/ .ant-dropdown-menu-item {
        min-width: 160px;
    }
}
.antd-pro-global-header-index-avatar {
    background: @primary-color;
}
</style>
