import request from '@/utils/request'

/**
 * @description: 获取用户管理列表
 */
export function getUserList(parameter) {
  return request({
    url: '/system/user-manage',
    method: 'get',
    params: parameter
  })
}

/**
 * @description: 创建用户
 */
export function addUser(parameter) {
  return request({
    url: '/system/user-manage',
    method: 'post',
    data: parameter
  })
}

/**
 * @description: 更新用户
 */
export function updateUser({ id, ...parameter }) {
  return request({
    url: `/system/user-manage/${id}`,
    method: 'put',
    data: parameter
  })
}

/**
 * @description: 删除用户
 */
export function delUser(id) {
  return request({
    url: `/system/user-manage/${id}`,
    method: 'delete'
  })
}
