<template>
    <a-popover trigger="hover" arrow-point-at-center placement="bottom">
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
</template>

<script>
import articleDetails from './articleDetails'
import { relativeTime } from '@/utils/util.js'
import { Announcement, saveAnnouncementRead, webSockets, User } from '@/api/system'
import bus from '@/utils/bus'
import { DictionaryCD } from '@/api/public'
export default {
    name: 'HeaderAnnouncement',
    components: {
        articleDetails,
    },
    props: {
        prefixCls: {
            type: String,
            default: 'ant-pro-global-header-index-action',
        },
    },
    data() {
        return {
            announcementList: [],
            current: 1,
            pageSize: 10,
            total: 0,
            loadingMore: false,
            unread: 0, // 公告未读条数
            user: {},
            announcementDetail: {},
            articleType: 1,
            listLoading: false,
            typeList: [],
        }
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
    computed: {
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
        })
    },
}
</script>

<style lang="less" scoped>
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
    .ant-pro-global-header-index-action {
        color: hsla(0, 0%, 100%, 0.85);
    }
}
</style>