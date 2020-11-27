/*
 * @Description: 此中间件是为了给API请求加上token权限认证
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-10-28 09:42:50
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-11-27 14:19:01
 */
'use strict';

const jwt = require('jsonwebtoken');

module.exports = (options, app) => {
    return async function tokenAuthentication(ctx, next) {
        try {
            const { Raw } = app.Db.xmw;
            const url = ctx.request.url;
            if (url == '/' || url == '/home/login' || url == '/system/getRouterMenu' || url == '/system/webSockets') {
                await next();
                return;
            }
            const token = ctx.request.header['access-token']; //获取头部token信息
            if (token) {
                let overdue = true;
                // 查看请求头token是否存在，不存在直接return
                const exist = await Raw.Query(`select count(1) as total from xmw_user where token = '${token}'`);
                if (!exist.total) {
                    ctx.body = { state: 2, msg: 'token令牌非法!' }
                    return
                }
                // 解析token生成用户信息
                jwt.verify(token, app.config.privateKey, (err, decoded) => {
                    if (err) {   //如果token过期或解析错误则会执行err的代码块
                        ctx.logger.info('token认证信息失败：' + JSON.stringify(decoded));
                        ctx.logger.error(err);
                        overdue = false;
                        ctx.body = { code: 0, data: "", message: "token令牌失效或已过期!" };
                        return true;
                    }
                })
                if (overdue) await next()
            } else {
                ctx.body = { state: 2, msg: 'token令牌非法!' }
            }
        } catch (error) {
            ctx.logger.error(error);
            ctx.body = { code: 0, data: "", message: "token令牌认证失败!" };
        }

    }
}
