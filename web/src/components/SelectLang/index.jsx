import './index.less'

import { Dropdown, Icon, Menu } from 'ant-design-vue'

import localIcon from '@/core/icons'
import { i18nRender } from '@/locales'
import i18nMixin from '@/store/i18n-mixin'

const locales = ['zh-CN', 'en-US', 'ja-JP', 'zh-TW']
const languageLabels = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'ja-JP': '日本语',
  'zh-TW': '繁體中文'
}
// eslint-disable-next-line
const languageIcons = {
  'zh-CN': '🇨🇳',
  'en-US': '🇺🇸',
  'ja-JP': '🇯🇵',
  'zh-TW': '🇭🇰'
}

const SelectLang = {
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-drop-down'
    }
  },
  name: 'SelectLang',
  mixins: [i18nMixin],
  render () {
    const { prefixCls } = this
    const changeLang = ({ key }) => {
      this.setLang(key)
    }
    const langMenu = (
      <Menu class={['menu', 'ant-pro-header-menu']} selectedKeys={[this.currentLang]} onClick={changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    )
    return (
      <Dropdown overlay={langMenu} placement="bottomRight">
        <span class={prefixCls}>
          <Icon component={localIcon['LocaleIcon']} title={i18nRender('navBar.lang')} />
        </span>
      </Dropdown>
    )
  }
}

export default SelectLang
