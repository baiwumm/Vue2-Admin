
// 这个中间件的作用是提示用户连接与断开的，连接成功的消息发送到客户端，断开连接的消息在服务端打印
'use strict';

module.exports = () => {
    return async (ctx, next) => {
        const { socket, app } = ctx;
        const id = socket.id; // 获取 Socket ID
        let UserID = null
        if (ctx.session.userInfo) {
            // 根据用户ID存储socket.id
            UserID = ctx.session.userInfo.UserID
            app.redis.set(UserID, id); // 设置 Socket ID
        }
        ctx.socket.emit('res', `Your id is ${id}`);
        await next();
        // 当websocket服务器断开连接移除socket.id
        app.redis.del(UserID);
        console.log('websocket服务器已断开连接!');
    };
};