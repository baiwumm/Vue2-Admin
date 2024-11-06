import { i18nRender } from '@/locales'

/**
 * @description: 公共字段
 */
export const I18nGlobal = {
  search: 'global.search',
  add: 'global.add',
  edit: 'global.edit',
  delete: 'global.delete',
  confirmDelete: 'global.confirmDelete',
  action: 'global.action',
  createdAt: 'global.createdAt',
  parent: 'global.parent',
  enter: 'global.enter',
  select: 'global.select',
  cancel: 'global.cancel',
  confirm: 'global.confirm',
  sort: 'global.sort'
}

/**
 * @description: 请输入
 */
export const I18nEntry = (text) => `${i18nRender(I18nGlobal.enter)}${text}`

/**
 * @description: 请选择
 */
export const I18nSelect = (text) => `${i18nRender(I18nGlobal.select)}${text}`

/**
 * @description: 系统设置-菜单管理
 */
export const I18nMenu = (field = '') => i18nRender(`views.system-manage.menu-manage${field ? '.' : ''}${field}`)

/**
 * @description: 系统设置-角色管理
 */
export const I18nRole = (field = '') => i18nRender(`views.system-manage.role-manage${field ? '.' : ''}${field}`)

/**
 * @description: 系统设置-国际化
 */
export const I18nInternationalization = (field) => i18nRender(`views.system-manage.internationalization.${field}`)
