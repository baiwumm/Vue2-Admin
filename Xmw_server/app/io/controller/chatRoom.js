
'use strict';

module.exports = app => {
    class Controller extends app.Controller {
        async chat() {
            const { app } = this.ctx;
            // 根据发送消息给哪个用户的ID提取socket.id
            var data = this.ctx.packet[1];
            const id = await app.redis.get(data.ToUserID); // 获取 ID
            const nsp = app.io.of('/')
            if (id) nsp.sockets[id].emit('chat', data)
        }
    }
    return Controller;
};