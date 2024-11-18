import request from '@/utils/request'

/**
 * @description: 获取操作日志列表
 */
export function getLogList(parameter) {
  return request({
    url: '/system/operation-log',
    method: 'get',
    params: parameter
  })
}

/**
 * @description: 批量删除日志
 */
export function delRole(parameter) {
  return request({
    url: `/system/operation-log`,
    method: 'delete',
    data: parameter
  })
}
