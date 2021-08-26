
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller, io } = app;
    // websocket消息推送
    require('./io/router/socket-io-api')(app)
    // 获取表字典表数据
    router.get('/public/getDictionaryCD', controller.publicmethods.getDictionaryCD);
    // 用户登录及信息修改模块
    router.post('/home/login', controller.home.home.login); // 用户登录
    router.post('/home/logout', controller.home.home.logout); // 注销登录
    router.post('/home/updateUserInfo', controller.home.home.updateUserInfo); // 更新用户信息
    router.post('/home/changeUserPassword', controller.home.home.changeUserPassword); // 修改用户密码
    router.post('/home/changeUserLabel', controller.home.home.changeUserLabel); // 修改用户标签
    router.post('/home/changeUserImg', controller.home.home.changeUserImg); // 修改用户头像
    router.get('/home/getUserPw', controller.home.home.getUserPw); // 获取当前用户密码
    router.get('/home/generateVerifCode', controller.home.home.generateVerifCode); // 生成验证码

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
    router.get('/system/getAnnouncementList', controller.system.admin.getAnnouncementList); // 请求消息公告列表
    router.post('/system/updateAnnouncement', controller.system.admin.updateAnnouncement); // 发布公告
    router.post('/system/deleteAnnouncement', controller.system.admin.deleteAnnouncement); // 删除公告
    router.get('/system/webSockets', controller.system.admin.webSockets); // 接收webSockets消息推送
    router.post('/system/saveAnnouncementRead', controller.system.admin.saveAnnouncementRead); // 添加公告已读列表
    router.get('/system/getDictionaryList', controller.system.admin.getDictionaryList); // 获取字典列表
    router.post('/system/addEditDictionary', controller.system.admin.addEditDictionary); // 添加-编辑字典
    router.post('/system/deleteDictionary', controller.system.admin.deleteDictionary); // 删除字典

    // 组织架构模块接口
    router.get('/integrated/getOrganizationList', controller.integrated.organizational.getOrganizationList); // 获取组织架构-部门列表
    router.post('/integrated/addEditOrganization', controller.integrated.organizational.addEditOrganization); // 添加-编辑部门
    router.post('/integrated/deleteOrganization', controller.integrated.organizational.deleteOrganization); // 删除部门
    // 高级表格模块接口
    router.get('/integrated/getAdvancedTable', controller.integrated.advancedTable.getAdvancedTable); // 获取高级表格列表
    router.post('/integrated/addEditAdvancedTable', controller.integrated.advancedTable.addEditAdvancedTable); // 添加-编辑高级表格
    router.post('/integrated/deleteAdvancedTable', controller.integrated.advancedTable.deleteAdvancedTable); // 删除高级表格
    router.get('/integrated/getVehicleInfo', controller.integrated.advancedTable.getVehicleInfo); // 获取车辆信息
    router.post('/integrated/addEditVehicleInfo', controller.integrated.advancedTable.addEditVehicleInfo); // 添加编辑车辆信息
    router.post('/integrated/deleteVehicleInfo', controller.integrated.advancedTable.deleteVehicleInfo); // 删除车辆信息
    router.post('/integrated/saveSeniorExcel', controller.integrated.advancedTable.saveSeniorExcel); // 保存高级表格上传
    // 聊天室模块
    router.get('/features/getChatRecord', controller.features.chat.getChatRecord); // 获取聊天记录
    router.post('/features/saveCharMsg', controller.features.chat.saveCharMsg); // 发送消息
};
