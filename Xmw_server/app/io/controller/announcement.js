'use strict';

module.exports = app => {
    class Controller extends app.Controller {
        async index() {
            const message = this.ctx.args[0];
            console.log('announcement :', message + ' : ' + process.pid);
            const say = await this.ctx.service.user.say();
            this.ctx.socket.emit('res', say);
            this.ctx.body = { state: 1, msg: '请求成功!', data: say }
        }
    }
    return Controller;
};