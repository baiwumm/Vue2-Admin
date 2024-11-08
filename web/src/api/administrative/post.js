import request from '@/utils/request'

/**
 * @description: 获取岗位列表
 */
export function getPostList(parameter) {
  return request({
    url: '/administrative/post-manage',
    method: 'get',
    params: parameter
  })
}

/**
 * @description: 创建岗位
 */
export function addPost(parameter) {
  return request({
    url: '/administrative/post-manage',
    method: 'post',
    data: parameter
  })
}

/**
 * @description: 更新岗位
 */
export function updatePost({ id, ...parameter }) {
  return request({
    url: `/administrative/post-manage/${id}`,
    method: 'put',
    data: parameter
  })
}

/**
 * @description: 删除岗位
 */
export function delPost(id) {
  return request({
    url: `/administrative/post-manage/${id}`,
    method: 'delete'
  })
}
