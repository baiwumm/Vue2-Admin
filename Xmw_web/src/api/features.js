import request from '@/utils/request'
const Api = {
    getChatRecord: '/features/getChatRecord',
    saveCharMsg: '/features/saveCharMsg',
}
// 聊天室模块
export function getChatRecord(parameter) {
    return request({
        url: Api.getChatRecord,
        method: 'get',
        params: parameter
    })
}
// 发送消息
export function saveCharMsg(parameter) {
    return request({
        url: Api.saveCharMsg,
        method: 'post',
        data: parameter
    })
}