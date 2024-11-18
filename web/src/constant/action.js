import { i18nRender } from '@/locales'

import { I18nGlobal } from './i18n'
/**
 * @description: 按钮权限
 */
export const ActionMap = {
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  search: 'search',
  batchDelete: 'batchDelete'
}

/**
 * @description: 按钮权限列项
 */
export const ActionOptions = [
  { value: ActionMap.add, label: i18nRender(I18nGlobal.Add) },
  { value: ActionMap.edit, label: i18nRender(I18nGlobal.Edit) },
  { value: ActionMap.delete, label: i18nRender(I18nGlobal.Delete) },
  { value: ActionMap.search, label: i18nRender(I18nGlobal.Search) },
  { value: ActionMap.batchDelete, label: i18nRender(I18nGlobal.BatchDelete) }
]
