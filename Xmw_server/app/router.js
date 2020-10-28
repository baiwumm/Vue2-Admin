'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    // 用户登录及信息修改模块
    router.post('/home/login', controller.home.home.login); // 用户登录
    router.post('/home/logout', controller.home.home.logout); // 注销登录
    router.post('/home/updateUserInfo', controller.home.home.updateUserInfo); // 更新用户信息
    router.post('/home/changeUserPassword', controller.home.home.changeUserPassword); // 修改用户密码
    router.post('/home/changeUserLabel', controller.home.home.changeUserLabel); // 修改用户标签
    router.post('/home/changeUserImg', controller.home.home.changeUserImg); // 修改用户头像

    // 系统设置模块接口
    router.get('/system/getLogsList', controller.system.admin.getLogsList); // 请求操作日志列表
    router.get('/system/getRouterMenu', controller.system.admin.getRouterMenu); // 获取路由菜单
    router.post('/system/addRouterMenu', controller.system.admin.addRouterMenu); // 添加编辑路由菜单
    router.post('/system/deleteRouterMenu', controller.system.admin.deleteRouterMenu); // 删除路由菜单
    router.get('/system/getActionList', controller.system.admin.getActionList); // 获取权限列表
    router.post('/system/updateActionList', controller.system.admin.updateActionList); // 更新权限列表
    router.get('/system/getRoleList', controller.system.admin.getRoleList); // 获取角色列表
    router.post('/system/updateRoleList', controller.system.admin.updateRoleList); // 更新角色列表
    router.post('/system/deleteRole', controller.system.admin.deleteRole); // 删除角色列表
    router.get('/system/getUserList', controller.system.admin.getUserList); // 获取用户列表
    router.post('/system/updateUserList', controller.system.admin.updateUserList); // 添加或编辑用户列表
    router.post('/system/deleteUser', controller.system.admin.deleteUser); // 删除用户列表
}; 
