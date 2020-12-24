
module.exports = app => {
    const { router, controller, io } = app;
    io.of('/').route('announcement', io.controller.announcement.jieshou)
    io.of('/').route('chat', io.controller.chatRoom.chat)
}