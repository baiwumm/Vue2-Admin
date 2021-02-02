<template>
    <div class="header-search" id="header-search" @click.stop="" :class="prefixCls">
        <a-tooltip placement="bottom">
            <template slot="title"> 全局搜索 </template>
            <a-icon type="search" style="font-size: 20px; vertical-align: middle" @click.stop="showSelect" />
        </a-tooltip>
        <a-select
            ref="headerSearchSelect"
            show-search
            :class="{ show: show }"
            v-model="searchPath"
            placeholder="输入点什么吧..."
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            labelInValue
            @search="handleSearch"
            @change="hopRouter"
            :dropdownMatchSelectWidth="false"
        >
            <template slot="notFoundContent"><a-empty /></template>
            <a-select-option v-for="(item, index) in searchPool" :key="index" :value="item.item.path">
                <a-icon
                    :component="iconfontSvg(item.item.icon)"
                    :style="{ fontSize: '16px', color: 'rgb(24, 144, 255)', verticalAlign: 'middle' }"
                    v-if="item.item.icon && item.item.icon.includes('Icon')"
                />
                <a-icon
                    :type="iconfontSvg(item.item.icon)"
                    :style="{ fontSize: '16px', color: 'rgb(24, 144, 255)', verticalAlign: 'middle' }"
                    v-else-if="item.item.icon"
                />
                <a-divider type="vertical" />
                {{ item.item.title.join(' > ') }}
            </a-select-option>
        </a-select>
    </div>
</template>

<script>
import { Menu } from '@/api/system'
import Fuse from 'fuse.js'
import { treeData } from '@/utils/util.js'
import path from 'path'
import iconfont from '@/core/icons'
export default {
    name: 'HeaderSearch',
    props: {
        prefixCls: {
            type: String,
            default: 'ant-pro-global-header-index-action',
        },
    },
    data() {
        return {
            searchPath: undefined,
            pathList: [],
            fuse: null,
            searchPool: [],
            show: false,
        }
    },
    watch: {
        pathList(list) {
            this.initFuse(list)
        },
        show(value) {
            if (value) {
                document.body.addEventListener('click', this.close)
            } else {
                document.body.removeEventListener('click', this.close)
            }
        },
    },
    methods: {
        // 引用图表静态文件
        iconfontSvg(icon) {
            return iconfont[icon] || icon
        },
        close() {
            this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
            this.searchPool = []
            this.show = false
        },
        // 模糊搜索
        initFuse(list) {
            this.fuse = new Fuse(list, {
                shouldSort: true,
                threshold: 0.4,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
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
            })
        },
        // 递归循环处理路由
        generateRoutes(routes, basePath = '/', prefixTitle = []) {
            let res = []
            for (const router of routes) {
                if (router.hidden) {
                    continue
                }
                const data = {
                    path: path.resolve(basePath, router.path),
                    title: [...prefixTitle],
                    icon: router.icon,
                }
                if (router && router.subTitle) {
                    data.title = [...data.title, router.subTitle]
                    if (!router.redirect) {
                        res.push(data)
                    }
                }
                // 递归子路由
                if (router.children) {
                    const tempRoutes = this.generateRoutes(router.children, data.path, data.title)
                    if (tempRoutes.length >= 1) {
                        res = [...res, ...tempRoutes]
                    }
                }
            }
            return res
        },
        // 获取路由菜单
        async getMenuList() {
            let _this = this
            Menu().then((res) => {
                if (res.state == 1) {
                    res.result = res.result.filter((v) => v.parentId != 0)
                    let routerPath = treeData(res.result, 'ID', 'parentId', 'children')
                    _this.pathList = _this.generateRoutes(routerPath)
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
            this.$nextTick(() => {
                this.show = false
            })
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
.ant-pro-global-header-index-dark {
    .ant-pro-global-header-index-action {
        color: hsla(0, 0%, 100%, 0.85);
    }
}
</style>