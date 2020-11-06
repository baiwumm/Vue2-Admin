
<template>
    <div :class="wrpCls">
        <div class="header-search">
            <a-icon type="search" style="font-size: 20px; vertical-align: middle" @click.stop="showSelect" />
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
        <a-popover trigger="hover" arrow-point-at-center>
            <template slot="content">
                <div class="infinite-container">
                    <a-list :data-source="announcementList" style="">
                        <a-list-item slot="renderItem" slot-scope="item">
                            <a-list-item-meta
                                :description="
                                    item.content.length > 30 ? item.content.substr(0, 30) + '...' : item.content
                                "
                            >
                                <a slot="title" @click="showAnnouncementDetail(item)"
                                    ><a-badge
                                        :dot="!(item.already ? JSON.parse(item.already) : []).includes(user.UserID)"
                                        >{{
                                            item.title.length > 15 ? item.title.substr(0, 15) + '...' : item.title
                                        }}</a-badge
                                    ></a
                                >
                                <a-avatar slot="avatar" :src="item.avatar" />
                            </a-list-item-meta>
                            <div>
                                <a-tag color="purple">
                                    {{ item.CnName }}
                                </a-tag>
                            </div>
                        </a-list-item>
                        <div slot="header" style="font-size: 20px; font-weight: bold; margin-top: -20px">公告列表</div>
                        <div
                            slot="loadMore"
                            :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
                        >
                            <a-spin v-if="loadingMore" />
                            <a-button v-else @click="onLoadMore" type="primary"> 加载更多 </a-button>
                        </div>
                    </a-list>
                </div>
            </template>
            <div :class="prefixCls">
                <a-badge :count="unread">
                    <a-icon type="bell" style="font-size: 20px" />
                </a-badge>
            </div>
        </a-popover>
        <!-- 公告详情 -->
        <a-drawer width="640" placement="right" :visible="detailVisible" @close="detailVisible = false" :zIndex="1200">
            <a-descriptions title="公告详情" bordered :column="1">
                <a-descriptions-item label="发布者：">{{ announcementDetail.author }} </a-descriptions-item>
                <a-descriptions-item label="标题：">{{ announcementDetail.title }} </a-descriptions-item>
                <a-descriptions-item label="发布时间："
                    ><a-badge status="processing" :text="announcementDetail.createTime"
                /></a-descriptions-item>
                <a-descriptions-item label="发布内容：">{{ announcementDetail.content }} </a-descriptions-item>
            </a-descriptions>
            <div
                :style="{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                    zIndex: 1,
                }"
            >
                <a-button type="primary" @click="detailVisible = false"> 关闭 </a-button>
            </div>
        </a-drawer>
        <div :class="prefixCls" @click="toggleFullscreen">
            <a-icon :type="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" style="font-size: 20px" />
        </div>
        <avatar-dropdown :menu="showMenu" :class="prefixCls" />
        <select-lang :class="prefixCls" />
    </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import screenfull from 'screenfull'
import { Menu } from '@/api/system'
import { treeData } from '@/utils/util.js'
import Fuse from 'fuse.js'
import { Announcement, saveAnnouncementRead } from '@/api/system'
export default {
    name: 'RightContent',
    components: {
        AvatarDropdown,
        SelectLang,
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
            detailVisible: false,
            announcementDetail: {},
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
    },
    beforeMount() {
        let _this = this
        _this.fetchData((res) => {
            _this.announcementList = res.result.list
            _this.total = res.result.total
        })
    },
    methods: {
        fetchData(callback) {
            let _this = this
            let params = {
                current: _this.current,
                pageSize: _this.pageSize,
            }
            Announcement(params).then((res) => {
                callback(res)
                res.result.list.map((v) => {
                    let readList = JSON.parse(v.already) || []
                    if (!readList.includes(_this.user.UserID)) {
                        _this.unread += 1
                    }
                })
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
        showAnnouncementDetail(data) {
            let _this = this
            _this.detailVisible = true
            _this.announcementDetail = data
            // 如果点击未读信息，则请求将用户ID添加到已读字段
            let readList = JSON.parse(data.already) || []
            if (!readList.includes(_this.user.UserID)) {
                let params = { AnnouncementID: data.AnnouncementID }
                saveAnnouncementRead(params).then((res) => {
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
    },
    mounted() {
        this.$nextTick(() => {
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
    width: 400px;
}
.ant-descriptions /deep/ .ant-descriptions-view .ant-descriptions-row th {
    width: 120px;
}
</style>
