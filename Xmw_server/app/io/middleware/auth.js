
// 这个中间件的作用是提示用户连接与断开的，连接成功的消息发送到客户端，断开连接的消息在服务端打印
'use strict';

module.exports = () => {
    return async (ctx, next) => {
        const say = await ctx.service.user.say();
        ctx.socket.emit('res', 'auth!' + say);
        await next();
        console.log('disconnect!');
    };
};