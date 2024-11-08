import request from '@/utils/request'

/**
 * @description: 获取组织列表
 */
export function getOrgList(parameter) {
  return request({
    url: '/administrative/organazation',
    method: 'get',
    params: parameter
  })
}

/**
 * @description: 创建组织
 */
export function addOrg(parameter) {
  return request({
    url: '/administrative/organazation',
    method: 'post',
    data: parameter
  })
}

/**
 * @description: 更新组织
 */
export function updateOrg({ id, ...parameter }) {
  return request({
    url: `/administrative/organazation/${id}`,
    method: 'put',
    data: parameter
  })
}

/**
 * @description: 删除组织
 */
export function delOrg(id) {
  return request({
    url: `/administrative/organazation/${id}`,
    method: 'delete'
  })
}
