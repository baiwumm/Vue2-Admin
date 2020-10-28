/*
 * @Description: 记录操作日志
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-10-10 15:37:18
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-10-23 16:30:38
 */
// 后端公共方法
'use strict'
const Service = require('egg').Service

class Logs extends Service {
    // 记录每一个接口的操作到日志
    async saveLogs(username, CnName, action, path) {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let logInfo = {
                username: username,
                CnName: CnName,
                action: action,
                IP: ctx.request.ip,
                createTime: new Date(),
                path: ctx.header.host + path,
                userAgent: ctx.header['user-agent']
            }
            await Raw.Insert('xmw_logs', logInfo);
            return { state: 1, msg: '保存成功!' }
        } catch (error) {
            ctx.logger.info('saveLogs方法报错：' + error)
            return { state: 0, msg: '保存失败!', error: error }
        }
    }
}

module.exports = Logs