import request from '@/utils/request'

/**
 * @description: 获取国际化列表
 */
export function getInternalizationList(parameter) {
  return request({
    url: '/system/internalization',
    method: 'get',
    params: parameter
  })
}

/**
 * @description: 创建国际化
 */
export function addInternalization(parameter) {
  return request({
    url: '/system/internalization',
    method: 'post',
    data: parameter
  })
}

/**
 * @description: 更新国际化
 */
export function updateInternalization({ id, ...parameter }) {
  return request({
    url: `/system/internalization/${id}`,
    method: 'put',
    data: parameter
  })
}

/**
 * @description: 删除国际化
 */
export function delInternalization(id) {
  return request({
    url: `/system/internalization/${id}`,
    method: 'delete'
  })
}
