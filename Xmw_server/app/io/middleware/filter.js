
// 这个中间件的作用是将接收到的数据再发送给客户端
'use strict';

module.exports = () => {
    return async (ctx, next) => {
        console.log(ctx.packet);
        const say = await ctx.service.user.say();
        ctx.socket.emit('res', 'packet!' + say);
        await next();
        console.log('packet response!');
    };
};