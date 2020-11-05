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
        <div :class="prefixCls">
            <a-badge count="5">
                <a-icon type="bell" style="font-size: 20px" />
            </a-badge>
        </div>
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
        }
    },
    computed: {
        wrpCls() {
            return {
                'ant-pro-global-header-index-right': true,
                [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true,
            }
        },
    },
    methods: {
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
</style>
