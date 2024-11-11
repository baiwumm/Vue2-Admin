import request from '@/utils/request'

/**
 * @description: 获取消息公告列表
 */
export function getMessageList(parameter) {
  return request({
    url: '/administrative/message',
    method: 'get',
    params: parameter
  })
}

/**
 * @description: 创建消息公告
 */
export function addMessage(parameter) {
  return request({
    url: '/administrative/message',
    method: 'post',
    data: parameter
  })
}

/**
 * @description: 更新消息公告
 */
export function updateMessage({ id, ...parameter }) {
  return request({
    url: `/administrative/message/${id}`,
    method: 'put',
    data: parameter
  })
}

/**
 * @description: 删除消息公告
 */
export function delMessage(id) {
  return request({
    url: `/administrative/message/${id}`,
    method: 'delete'
  })
}

/**
 * @description: 修改置顶状态
 */
export function changePinned(id) {
  return request({
    url: `/administrative/message/${id}`,
    method: 'patch'
  })
}

/**
 * @description: 创建已读消息
 */
export function createMessageRead(parameter) {
  return request({
    url: 'administrative/message/createMessageRead',
    method: 'post',
    data: parameter
  })
}
