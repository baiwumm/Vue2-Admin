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
  UploadSuccess: 'global.upload.success',
  PopconfirmTitle: 'global.popconfirmTitle',
  Submit: 'global.submit',
  ParentTip: 'global.parent.tip',
  BatchDelete: 'global.batchDelete',
  Reset: 'global.reset'
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
 * @description: 用户登录
 */
export const I18nLogin = (field = '') => i18nRender(`views.user.login${field ? '.' : ''}${field}`)

/**
 * @description: 智能行政-消息公告
 */
export const I18nMessage = (field = '') => i18nRender(`views.administrative.message${field ? '.' : ''}${field}`)

/**
 * @description: 智能行政-岗位管理
 */
export const I18nPost = (field = '') => i18nRender(`views.administrative.post-manage${field ? '.' : ''}${field}`)

/**
 * @description: 智能行政-组织管理
 */
export const I18nOrganization = (field = '') =>
  i18nRender(`views.administrative.organization${field ? '.' : ''}${field}`)

/**
 * @description: 个人中心
 */
export const I18nUserCenter = (field = '') => i18nRender(`views.user-center${field ? '.' : ''}${field}`)

/**
 * @description: 功能页-验证码
 */
export const I18nCaptcha = (field = '') => i18nRender(`views.features.captcha${field ? '.' : ''}${field}`)

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
export const I18nInternationalization = (field = '') =>
  i18nRender(`views.system-manage.internationalization${field ? '.' : ''}${field}`)

/**
 * @description: 系统设置-操作日志
 */
export const I18nOperationLog = (field = '') =>
  i18nRender(`views.system-manage.operation-log${field ? '.' : ''}${field}`)

/**
 * @description: 关于
 */
export const I18nAbout = (field = '') => i18nRender(`views.about${field ? '.' : ''}${field}`)
