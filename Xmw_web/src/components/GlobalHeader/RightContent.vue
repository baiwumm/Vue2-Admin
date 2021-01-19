
<template>
    <div :class="wrpCls">
        <div class="header-search" v-if="!isMobile" id="header-search">
            <a-tooltip>
                <template slot="title"> 全局搜索 </template>
                <a-icon type="search" style="font-size: 20px; vertical-align: middle" @click.stop="showSelect" />
            </a-tooltip>
            <a-select
                ref="headerSearchSelect"
                show-search
                :class="{ show: show }"
                :value="searchPath"
                placeholder="输入点什么吧..."
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                not-found-content="暂无数据"
                labelInValue
                @search="handleSearch"
                @change="hopRouter"
            >
                <a-select-option v-for="(item, index) in searchPool" :key="index" :value="item.item.path">
                    {{ item.item.title }}
                </a-select-option>
            </a-select>
        </div>
        <!-- 锁屏 -->
        <div :class="prefixCls" id="lockScreen">
            <a-tooltip>
                <template slot="title"> 锁屏 </template>
                <a-icon type="lock" style="font-size: 20px" @click="lockVisible = true" />
            </a-tooltip>
        </div>
        <a-modal v-model="lockVisible" title="设置锁屏密码" @ok="handleSubmit" @cancel="clearPw">
            <div class="user-avatar">
                <a-avatar :size="100" :src="user.avatar" />
                <p>{{ user.CnName }}</p>
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
        <!-- 公告详情 -->
        <a-popover trigger="hover" arrow-point-at-center v-if="!isMobile">
            <template slot="content">
                <div class="infinite-container">
                    <a-list :data-source="announcementList" :loading="listLoading">
                        <a-list-item slot="renderItem" slot-scope="item" style="position: relative; height: 80px">
                            <a-list-item-meta>
                                <a slot="title" @click="showAnnouncementDetail(item)">
                                    <a-tooltip>
                                        <template slot="title">
                                            {{ item.title }}
                                        </template>
                                        <a-badge
                                            :dot="!(item.already ? JSON.parse(item.already) : []).includes(user.UserID)"
                                            >{{
                                                item.title.length > 30 ? item.title.substr(0, 30) + '...' : item.title
                                            }}</a-badge
                                        >
                                    </a-tooltip>
                                </a>
                                <a-avatar slot="avatar" :src="item.avatar" :size="50" style="vertical-align: middle" />
                                <div slot="description">
                                    <a-tag color="purple">
                                        {{ item.CnName }}
                                    </a-tag>
                                    <a-icon type="clock-circle" /> {{ culTime(item.createTime) }}
                                </div>
                            </a-list-item-meta>
                        </a-list-item>
                        <div slot="header">
                            <a-radio-group v-model="articleType" @change="changeArticleType">
                                <a-radio-button :value="Number(v.value)" v-for="(v, i) in typeList" :key="i">
                                    {{ v.text }}
                                </a-radio-button>
                            </a-radio-group>
                        </div>
                        <div
                            slot="loadMore"
                            :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
                        >
                            <a-spin v-if="loadingMore" />
                            <a-button
                                v-else-if="!loadingMore && announcementList.length"
                                @click="onLoadMore"
                                type="primary"
                            >
                                加载更多
                            </a-button>
                        </div>
                    </a-list>
                </div>
            </template>
            <!-- 详情 -->
            <article-details ref="articleDetails"></article-details>
            <div :class="prefixCls" id="AnnouncementList">
                <a-badge :count="unread">
                    <a-icon type="bell" style="font-size: 20px" />
                </a-badge>
            </div>
        </a-popover>
        <div :class="prefixCls" @click="toggleFullscreen" v-if="!isMobile">
            <a-tooltip>
                <template slot="title"> 全屏 </template>
                <a-icon :type="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" style="font-size: 20px" />
            </a-tooltip>
        </div>
        <avatar-dropdown :menu="showMenu" :class="prefixCls" ref="avatar" />
        <select-lang :class="prefixCls" />
        <lock-screen></lock-screen>
    </div>
</template>

<script>
import store from '../../store'
import storage from 'store'
import { SET_LOCK_PASSWD, IS_LOCK } from '@/store/mutation-types'
import CryptoJS from 'crypto-js'
import AvatarDropdown from './AvatarDropdown'
import LockScreen from './LockScreen'
import SelectLang from '@/components/SelectLang'
import screenfull from 'screenfull'
import { Menu } from '@/api/system'
import { crypto_key, crypto_iv, treeData, relativeTime } from '@/utils/util.js'
import Fuse from 'fuse.js'
import { Announcement, saveAnnouncementRead, webSockets, User } from '@/api/system'
import articleDetails from './articleDetails'
import bus from '@/utils/bus'
import { DictionaryCD } from '@/api/public'
export default {
    name: 'RightContent',
    components: {
        AvatarDropdown,
        LockScreen,
        SelectLang,
        articleDetails,
    },
    props: {
        prefixCls: {
            type: String,
            default: 'ant-pro-global-header-index-action',
        },
        isMobile: {
            type: Boolean,
            default: () => false,
        },
        topMenu: {
            type: Boolean,
            required: true,
        },
        theme: {
            type: String,
            required: true,
        },
    },
    // 监听websocket信息
    sockets: {
        // 监听发布公告
        announcement(data) {
            if (data) {
                this.unread = 0
                this.current = 1
                this.fetchData((res) => {
                    this.announcementList = res.result.list
                    this.total = res.result.total
                })
                webSockets().then((res) => {
                    if (res.state) {
                        const key = `open${Date.now()}`
                        this.$notification.success({
                            message: res.data.CnName + '发布了公告',
                            description: res.data.title,
                            duration: 0,
                            btn: (h) => {
                                return h(
                                    'a-button',
                                    {
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                        },
                                        on: {
                                            click: () => {
                                                this.$notification.close(key)
                                                this.showAnnouncementDetail(res.data)
                                            },
                                        },
                                    },
                                    '查看详情'
                                )
                            },
                            key,
                        })
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            }
        },
        // 监听聊天消息
        async chat(data) {
            let _this = this
            if (data && data.ToUserID == _this.user.UserID && this.$route.path != '/features/chatRoom') {
                const key = `open${Date.now()}`
                let params = {
                    UserID: data.UserID,
                }
                let res = await User(params)
                this.$notification.success({
                    message: res.result.CnName + '给你发送了一条消息',
                    description: this.parMsg(data.Content),
                    duration: 0,
                    btn: (h) => {
                        return h(
                            'a-button',
                            {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                on: {
                                    click: () => {
                                        this.$notification.close(key)
                                        this.showChatMsg(data.UserID)
                                    },
                                },
                            },
                            '马上查看'
                        )
                    },
                    key,
                })
            }
        },
    },
    data() {
        return {
            showMenu: true,
            isFullscreen: false,
            searchPath: undefined,
            pathList: [],
            fuse: null,
            searchPool: [],
            show: false,
            announcementList: [],
            current: 1,
            pageSize: 10,
            total: 0,
            loadingMore: false,
            unread: 0, // 公告未读条数
            user: {},
            announcementDetail: {},
            lockVisible: false,
            form: this.$form.createForm(this),
            articleType: 1,
            listLoading: false,
            typeList: [],
        }
    },
    computed: {
        wrpCls() {
            return {
                'ant-pro-global-header-index-right': true,
                [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true,
            }
        },
        userInfo() {
            return this.$store.getters.userInfo
        },
    },
    created() {
        this.user = this.userInfo
        bus.$on('showArticle', (value) => {
            if (value) this.showAnnouncementDetail(value)
            else this.changeArticleType()
        })
    },
    beforeDestroy() {
        bus.$off('showArticle')
    },
    methods: {
        parMsg(val) {
            var patt = /&#\d+;/g
            var H, L, code
            var arr = val.match(patt) || []
            for (var i = 0; i < arr.length; i++) {
                code = arr[i]
                code = code.replace('&#', '').replace(';', '')
                // 高位
                H = Math.floor((code - 0x10000) / 0x400) + 0xd800
                // 低位
                L = ((code - 0x10000) % 0x400) + 0xdc00
                code = '&#' + code + ';'
                var s = String.fromCharCode(H, L)
                val = val.replace(code, s)
            }
            return val
        },
        // 计算相对时间
        culTime(time) {
            return relativeTime(time)
        },
        async getDictionaryCD() {
            let _this = this
            await DictionaryCD().then((res) => {
                _this.typeList = res.result.sys_announcement_type
            })
        },
        fetchData(callback) {
            let _this = this
            _this.listLoading = true
            let params = {
                current: _this.current,
                pageSize: _this.pageSize,
                type: _this.articleType,
            }
            Announcement(params).then((res) => {
                callback(res)
                _this.listLoading = false
                res.result.list.map((v) => {
                    let readList = JSON.parse(v.already) || []
                    if (!readList.includes(_this.user.UserID)) {
                        _this.unread += 1
                    }
                })
            })
        },
        initData() {
            let _this = this
            _this.unread = 0
            _this.fetchData((res) => {
                _this.announcementList = res.result.list
                _this.total = res.result.total
            })
        },
        // 加载更多
        onLoadMore() {
            let _this = this
            _this.current += 1
            _this.loadingMore = true
            if (_this.announcementList.length >= _this.total) {
                _this.$message.warning('已经加载全部')
                _this.loadingMore = false
                return
            }
            this.fetchData((res) => {
                _this.announcementList = _this.announcementList.concat(res.result.list)
                _this.loadingMore = false
            })
        },
        // 公告详情
        async showAnnouncementDetail(data) {
            let _this = this
            _this.announcementDetail = data
            _this.$refs.articleDetails.showDetails(data)
            // 如果点击未读信息，则请求将用户ID添加到已读字段
            let readList = JSON.parse(data.already) || []
            if (!readList.includes(_this.user.UserID)) {
                let params = {
                    AnnouncementID: data.AnnouncementID,
                    title: data.title,
                    already: readList,
                }
                await saveAnnouncementRead(params).then((res) => {
                    _this.unread -= 1
                    _this.announcementList.forEach((v) => {
                        if (v.AnnouncementID == data.AnnouncementID) {
                            let readArr = JSON.parse(v.already) || []
                            readArr.push(_this.user.UserID)
                            v.already = JSON.stringify(readArr)
                        }
                    })
                })
            }
        },
        toggleFullscreen() {
            if (!screenfull.isEnabled) {
                this.$notification.warning({
                    message: '警告',
                    description: `您的浏览器不支持全屏!`,
                })
                return false
            }
            screenfull.toggle()
            this.isFullscreen = !this.isFullscreen
        },
        // 获取路由菜单
        async getMenuList() {
            let _this = this
            Menu().then((res) => {
                if (res.state == 1) {
                    let routerPath = []
                    res.result = res.result.filter((v) => v.parentId != 0)
                    routerPath = treeData(res.result, 'ID', 'parentId', 'children')
                    routerPath.map((v) => {
                        if (!v.children) {
                            _this.pathList.push({
                                title: v.subTitle,
                                path: v.path,
                            })
                        } else {
                            v.children.map((e) => {
                                _this.pathList.push({
                                    title: v.subTitle + ' > ' + e.subTitle,
                                    path: e.path,
                                })
                            })
                        }
                    })
                    // 初始化
                    let options = {
                        shouldSort: true, // 是否按分数对结果列表排序
                        includeScore: true, //  是否应将分数包含在结果集中。0分表示完全匹配，1分表示完全不匹配。
                        threshold: 0.6, // 匹配算法阈值。阈值为0.0需要完全匹配（字母和位置），阈值为1.0将匹配任何内容。
                        /**
                         * 确定匹配与模糊位置（由位置指定）的距离。一个精确的字母匹配，即距离模糊位置很远的字符将被视为完全不匹配。
                         *  距离为0要求匹配位于指定的准确位置，距离为1000则要求完全匹配位于使用阈值0.8找到的位置的800个字符以内。
                         */
                        location: 0, // 确定文本中预期找到的模式的大致位置。
                        distance: 100,
                        maxPatternLength: 32, // 模式的最大长度
                        minMatchCharLength: 1, // 模式的最小字符长度
                        // 搜索标题与作者名
                        keys: [
                            {
                                name: 'title',
                                weight: 0.7,
                            },
                            {
                                name: 'path',
                                weight: 0.3,
                            },
                        ],
                    }
                    // 设置数据与参数
                    _this.fuse = new Fuse(_this.pathList, options)
                } else {
                    _this.$message.error(res.msg)
                }
            })
        },
        // 过滤路由名称
        handleSearch(value) {
            this.searchPool = this.fuse.search(value)
        },
        hopRouter(value, option) {
            this.$router.push(value.key)
            this.searchPath = undefined
            this.searchPool = []
        },
        showSelect() {
            this.show = !this.show
            if (this.show) {
                this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
            }
        },
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
        // 跳转到聊天页面
        showChatMsg(UserID) {
            this.$router.push({ name: 'chatRoom', params: { UserID: UserID } })
        },
        changeArticleType() {
            this.current = 1
            this.initData()
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.getDictionaryCD()
            this.initData()
            this.getMenuList()
        })
    },
}
</script>
<style lang="less" scoped>
.header-search {
    display: inline-block;
    height: 100%;
    padding: 0 12px;
    /deep/ .ant-select-focused .ant-select-selection,
    .ant-select-selection:active,
    .ant-select-selection:focus {
        border: none;
        box-shadow: none;
    }
    /deep/ .ant-select-selection {
        border: none;
        border-bottom: 1px solid #d9d9d9;
    }
    /deep/ .ant-select {
        width: 0;
        transition: width 0.2s;
    }
    .show {
        width: 210px;
        margin-left: 10px;
    }
}
.infinite-container {
    border-radius: 4px;
    padding: 8px 10px;
    overflow: auto;
    height: 300px;
    width: 360px;
}
.ant-descriptions /deep/ .ant-descriptions-view .ant-descriptions-row th {
    width: 120px;
}

.ant-pro-global-header-index-dark {
    .header-search {
        color: hsla(0, 0%, 100%, 0.85);
    }
    .ant-pro-global-header-index-action {
        color: hsla(0, 0%, 100%, 0.85);
    }
}
.user-avatar {
    text-align: center;
}
.user-avatar p {
    font-size: 24px;
    font-weight: bold;
    color: #000;
}
</style>
