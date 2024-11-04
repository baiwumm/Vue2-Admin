<script>
import iconfont from '@/core/icons'

import events from './events'
export default {
  name: 'MultiTab',
  data() {
    return {
      fullPathList: [],
      pages: [],
      activeKey: '',
      newTabIndex: 0
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
        this.$message.info(this.$t('components.mutilTab.closeThat.info'))
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
        this.$message.info(this.$t('components.mutilTab.closeLeft.info'))
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
        this.$message.info(this.$t('components.mutilTab.closeRight.info'))
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
      const renderIcon = (type) => <a-icon type={type} />
      return (
        <a-menu
          {...{
            on: {
              click: ({ key }) => {
                this.closeMenuClick(key, e)
              }
            }
          }}
        >
          <a-menu-item key="closeThat">
            {renderIcon('close')}
            {this.$t('components.mutilTab.closeThat')}
          </a-menu-item>
          <a-menu-item key="closeRight">
            {renderIcon('vertical-left')}
            {this.$t('components.mutilTab.closeRight')}
          </a-menu-item>
          <a-menu-item key="closeLeft">
            {renderIcon('vertical-right')}
            {this.$t('components.mutilTab.closeLeft')}
          </a-menu-item>
          <a-menu-item key="closeAll">
            {renderIcon('column-width')}
            {this.$t('components.mutilTab.closeAll')}
          </a-menu-item>
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
    }
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
    }
  },
  render() {
    const {
      onEdit,
      $data: { pages }
    } = this
    const panes = pages.map((page) => {
      const isActiveKey = this.activeKey === page.fullPath
      const isCustomIcon = Object.prototype.toString.call(page.meta.icon) === '[object Object]'
      const color = isActiveKey ? '#fff' : 'inherit'
      return (
        <a-tab-pane key={page.fullPath} closable={pages.length > 1}>
          <template slot="tab">
            {isActiveKey ? <a-badge status="processing" color="#fff" /> : null}
            {page.meta.icon ? (
              <a-icon
                type={isCustomIcon ? undefined : page.meta.icon}
                component={isCustomIcon ? page.meta.icon : undefined}
                style={{ color }}
              />
            ) : null}
            <span style={{ color }}>{this.renderTabPane(this.$t(page.meta.title), page.fullPath)}</span>
          </template>
        </a-tab-pane>
      )
    })

    return (
      <div class="ant-pro-multi-tab" id="ant-pro-multi-tab">
        <div class="ant-pro-multi-tab-wrapper">
          <a-tabs
            size="small"
            hideAdd
            type={'editable-card'}
            v-model={this.activeKey}
            tabBarStyle={{ background: '#fff', margin: 0, padding: '0 16px', paddingTop: '1px' }}
            {...{ on: { edit: onEdit } }}
          >
            {panes}
          </a-tabs>
        </div>
      </div>
    )
  }
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
