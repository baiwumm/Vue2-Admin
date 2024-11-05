import request from '@/utils/request'

/**
 * @description: 获取菜单管理列表
 */
export function getMenuList(parameter) {
  return request({
    url: '/system/menu-manage',
    method: 'get',
    params: parameter
  })
}

/**
 * @description: 创建菜单
 */
export function addMenu(parameter) {
  return request({
    url: '/system/menu-manage',
    method: 'post',
    data: parameter
  })
}

/**
 * @description: 更新菜单
 */
export function updateMenu({ id, ...parameter }) {
  return request({
    url: `/system/menu-manage/${id}`,
    method: 'put',
    data: parameter
  })
}

/**
 * @description: 删除菜单
 */
export function delMenu(id) {
  return request({
    url: `/system/menu-manage/${id}`,
    method: 'delete'
  })
}
