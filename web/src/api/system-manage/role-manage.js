import request from '@/utils/request'

/**
 * @description: 获取角色管理列表
 */
export function getRoleList(parameter) {
  return request({
    url: '/system/role-manage',
    method: 'get',
    params: parameter
  })
}

/**
 * @description: 创建角色
 */
export function addRole(parameter) {
  return request({
    url: '/system/role-manage',
    method: 'post',
    data: parameter
  })
}

/**
 * @description: 更新角色
 */
export function updateRole({ id, ...parameter }) {
  return request({
    url: `/system/role-manage/${id}`,
    method: 'put',
    data: parameter
  })
}

/**
 * @description: 删除角色
 */
export function delRole(id) {
  return request({
    url: `/system/role-manage/${id}`,
    method: 'delete'
  })
}
