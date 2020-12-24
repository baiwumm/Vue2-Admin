
// 这个中间件的作用是将接收到的数据再发送给客户端
'use strict';

module.exports = () => {
    return async (ctx, next) => {
        console.log(ctx.packet);
        ctx.socket.emit('res', 'packet!');
        await next();
        console.log('接收包响应!');
    };
};