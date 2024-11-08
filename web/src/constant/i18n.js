import { i18nRender } from '@/locales'

/**
 * @description: 公共字段
 */
export const I18nGlobal = {
  Search: 'global.search',
  Add: 'global.add',
  Edit: 'global.edit',
  Delete: 'global.delete',
  ConfirmDelete: 'global.confirmDelete',
  Action: 'global.action',
  CreatedAt: 'global.createdAt',
  Parent: 'global.parent',
  Enter: 'global.enter',
  Select: 'global.select',
  Cancel: 'global.cancel',
  Confirm: 'global.confirm',
  Sort: 'global.sort',
  Status: 'global.status',
  StatusNormal: 'global.status.normal',
  StatusForbidden: 'global.status.forbidden',
  ShowTotal: 'global.showTotal',
  Yes: 'global.yes',
  No: 'global.no',
  Upload: 'global.upload',
  UploadValidate: 'global.upload.validate',
  UploadSuccess: 'global.upload.success'
}

/**
 * @description: 请输入
 */
export const I18nEntry = (text) => `${i18nRender(I18nGlobal.Enter)}${text}`

/**
 * @description: 请选择
 */
export const I18nSelect = (text) => `${i18nRender(I18nGlobal.Select)}${text}`

/**
 * @description: 系统设置-用户登录
 */
export const I18nLogin = (field = '') => i18nRender(`views.user.login${field ? '.' : ''}${field}`)

/**
 * @description: 系统设置-用户管理
 */
export const I18nUser = (field = '') => i18nRender(`views.system-manage.user-manage${field ? '.' : ''}${field}`)

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
export const I18nInternationalization = (field) =>
  i18nRender(`views.system-manage.internationalization${field ? '.' : ''}${field}`)
