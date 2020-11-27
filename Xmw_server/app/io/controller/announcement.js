
'use strict';

module.exports = app => {
    class Controller extends app.Controller {
        async jieshou() {
            const { app } = this.ctx;
            var data = this.ctx.packet[1];
            const nsp = app.io.of('/')
            nsp.emit('announcement', data) //给所有在线的人发送消息
        }
    }
    return Controller;
};