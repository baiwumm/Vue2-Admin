/*
 * @Description: 聊天室API接口
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-11-10 16:02:27
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-12-22 14:14:24
 */
'use strict';

const Controller = require('egg').Controller;
class ChatRoomController extends Controller {
    // 获取聊天记录
    async getChatRecord() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            const userList = await Raw.QueryList(`select UserID,username,CnName,avatar from xmw_user`);
            const result = await Raw.QueryList(`select * from xmw_chat`);
            ctx.body = { state: 1, msg: '请求成功!', result: result, userList: userList }
        } catch (error) {
            ctx.logger.info('getChatRecord方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }
    // 发送消息
    async saveCharMsg() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let params = ctx.request.body
            console.log(params)
            await Raw.Insert('xmw_chat', params);
            await ctx.service.logs.saveLogs(username, CnName, '发送消息:' + params.Content, '/features/chatRoom')
            ctx.body = { state: 1, msg: '保存成功!' }
        } catch (error) {
            ctx.logger.info('saveCharMsg方法报错：' + error)
            ctx.body = { state: 0, msg: '保存失败!', error: error }
        }
    }
}
module.exports = ChatRoomController;