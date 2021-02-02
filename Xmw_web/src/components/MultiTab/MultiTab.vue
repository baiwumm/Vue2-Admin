<script>
import events from './events'
import iconfont from '@/core/icons'
export default {
    name: 'MultiTab',
    data() {
        return {
            fullPathList: [],
            pages: [],
            activeKey: '',
            newTabIndex: 0,
        }
    },
    created() {
        // bind event
        events
            .$on('open', (val) => {
                if (!val) {
                    throw new Error(`multi-tab: open tab ${val} err`)
                }
                this.activeKey = val
            })
            .$on('close', (val) => {
                if (!val) {
                    this.closeThat(this.activeKey)
                    return
                }
                this.closeThat(val)
            })
            .$on('rename', ({ key, name }) => {
                try {
                    const item = this.pages.find((item) => item.path === key)
                    item.meta.customTitle = name
                    this.$forceUpdate()
                } catch (e) {}
            })

        this.pages.push(this.$route)
        this.fullPathList.push(this.$route.fullPath)
        this.selectedLastPath()
    },
    methods: {
        // 引用图表静态文件
        iconfontSvg(icon) {
            return iconfont[icon] || icon
        },
        onEdit(targetKey, action) {
            this[action](targetKey)
        },
        remove(targetKey) {
            this.pages = this.pages.filter((page) => page.fullPath !== targetKey)
            this.fullPathList = this.fullPathList.filter((path) => path !== targetKey)
            // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
            if (!this.fullPathList.includes(this.activeKey)) {
                this.selectedLastPath()
            }
        },
        selectedLastPath() {
            this.activeKey = this.fullPathList[this.fullPathList.length - 1]
        },

        // content menu
        closeThat(e) {
            // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
            if (this.fullPathList.length > 1) {
                this.remove(e)
            } else {
                this.$message.info('这是最后一个标签了, 无法被关闭')
            }
        },
        closeLeft(e) {
            const currentIndex = this.fullPathList.indexOf(e)
            if (currentIndex > 0) {
                this.fullPathList.forEach((item, index) => {
                    if (index < currentIndex) {
                        this.remove(item)
                    }
                })
            } else {
                this.$message.info('左侧没有标签')
            }
        },
        closeRight(e) {
            const currentIndex = this.fullPathList.indexOf(e)
            if (currentIndex < this.fullPathList.length - 1) {
                this.fullPathList.forEach((item, index) => {
                    if (index > currentIndex) {
                        this.remove(item)
                    }
                })
            } else {
                this.$message.info('右侧没有标签')
            }
        },
        closeAll(e) {
            const currentIndex = this.fullPathList.indexOf(e)
            this.fullPathList.forEach((item, index) => {
                if (index !== currentIndex) {
                    this.remove(item)
                }
            })
        },
        closeMenuClick(key, route) {
            this[key](route)
        },
        // 刷新路由
        reloadRouter(e) {
            this.$emit('update', e)
        },
        renderTabPaneMenu(e) {
            return (
                <a-menu
                    {...{
                        on: {
                            click: ({ key, item, domEvent }) => {
                                this.closeMenuClick(key, e)
                            },
                        },
                    }}
                >
                    <a-menu-item key="reloadRouter">刷新当前页</a-menu-item>
                    <a-menu-item key="closeThat">关闭当前标签</a-menu-item>
                    <a-menu-item key="closeRight">关闭右侧</a-menu-item>
                    <a-menu-item key="closeLeft">关闭左侧</a-menu-item>
                    <a-menu-item key="closeAll">关闭全部</a-menu-item>
                </a-menu>
            )
        },
        // render
        renderTabPane(title, keyPath) {
            const menu = this.renderTabPaneMenu(keyPath)

            return (
                <a-dropdown overlay={menu} trigger={['contextmenu']}>
                    <span style={{ userSelect: 'none' }}>{title}</span>
                </a-dropdown>
            )
        },
    },
    watch: {
        $route: function (newVal) {
            this.activeKey = newVal.fullPath
            if (this.fullPathList.indexOf(newVal.fullPath) < 0) {
                this.fullPathList.push(newVal.fullPath)
                this.pages.push(newVal)
            }
        },
        activeKey: function (newPathKey) {
            this.$router.push({ path: newPathKey })
        },
    },
    render() {
        const {
            onEdit,
            $data: { pages },
        } = this
        const panes = pages.map((page) => {
            if (this.activeKey == page.fullPath) {
                if (page.meta.icon && Object.prototype.toString.call(page.meta.icon) === '[object Object]') {
                    return (
                        <a-tab-pane key={page.fullPath} closable={pages.length > 1}>
                            <span slot="tab">
                                <a-badge status="processing" color="#fff" />
                                <a-icon component={this.iconfontSvg(page.meta.icon)} style="color:#fff" />
                                <span style="color:#fff">
                                    {this.renderTabPane(this.$t(page.meta.title), page.fullPath)}
                                </span>
                            </span>
                        </a-tab-pane>
                    )
                } else if (page.meta.icon) {
                    return (
                        <a-tab-pane key={page.fullPath} closable={pages.length > 1}>
                            <span slot="tab">
                                <a-badge status="processing" color="#fff" />
                                <a-icon type={this.iconfontSvg(page.meta.icon)} style="color:#fff" />
                                <span style="color:#fff">
                                    {this.renderTabPane(this.$t(page.meta.title), page.fullPath)}
                                </span>
                            </span>
                        </a-tab-pane>
                    )
                } else {
                    return (
                        <a-tab-pane key={page.fullPath} closable={pages.length > 1}>
                            <span slot="tab">
                                <a-badge status="processing" color="#fff" />
                                <span style="color:#fff">
                                    {this.renderTabPane(this.$t(page.meta.title), page.fullPath)}
                                </span>
                            </span>
                        </a-tab-pane>
                    )
                }
            } else {
                if (page.meta.icon && Object.prototype.toString.call(page.meta.icon) === '[object Object]') {
                    return (
                        <a-tab-pane key={page.fullPath} closable={pages.length > 1}>
                            <span slot="tab">
                                <a-icon component={this.iconfontSvg(page.meta.icon)} />
                                {this.renderTabPane(this.$t(page.meta.title), page.fullPath)}
                            </span>
                        </a-tab-pane>
                    )
                } else if (page.meta.icon) {
                    return (
                        <a-tab-pane key={page.fullPath} closable={pages.length > 1}>
                            <span slot="tab">
                                <a-icon type={this.iconfontSvg(page.meta.icon)} />
                                {this.renderTabPane(this.$t(page.meta.title), page.fullPath)}
                            </span>
                        </a-tab-pane>
                    )
                } else {
                    return (
                        <a-tab-pane key={page.fullPath} closable={pages.length > 1}>
                            <span slot="tab">{this.renderTabPane(this.$t(page.meta.title), page.fullPath)}</span>
                        </a-tab-pane>
                    )
                }
            }
        })

        return (
            <div class="ant-pro-multi-tab" id="ant-pro-multi-tab">
                <div class="ant-pro-multi-tab-wrapper">
                    <a-tabs
                        size={'small'}
                        hideAdd
                        type={'editable-card'}
                        v-model={this.activeKey}
                        tabBarStyle={{ background: '#FFF', margin: 0, padding: '0 16px', paddingTop: '1px' }}
                        {...{ on: { edit: onEdit } }}
                    >
                        {panes}
                    </a-tabs>
                </div>
            </div>
        )
    },
}
</script>
<style lang="less" scoped>
@import '~@/components/index.less';
.ant-pro-multi-tab .ant-tabs {
    /deep/ .ant-tabs-nav-container {
        height: 28px;
    }
    /deep/ .ant-tabs-tab {
        height: 26px;
        line-height: 26px;
        padding: 0 8px;
        font-size: 12px;
        background: #fff;
    }
    /deep/ .ant-tabs-tab-active {
        height: 26px;
        line-height: 26px;
        background: @primary-color;
        .ant-badge-status-text {
            color: #fff;
            font-size: 12px;
        }
        .ant-tabs-close-x {
            color: #fff;
        }
    }
}
</style>
