/*
 * @Description: 系统设置模块请求接口
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-10-10 17:55:55
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-11-27 16:16:46
 */
import request from '@/utils/request'
const sysApi = {
    Logs: '/system/getLogsList',
    Menu: '/system/getRouterMenu',
    addMenu: '/system/addRouterMenu',
    deleteMenu: '/system/deleteRouterMenu',
    Action: '/system/getActionList',
    updateActionList: '/system/updateActionList',
    Role: '/system/getRoleList',
    updateRoleList: '/system/updateRoleList',
    deleteRole: '/system/deleteRole',
    User: '/system/getUserList',
    updateUserList: '/system/updateUserList',
    deleteUser: '/system/deleteUser',
    Announcement: '/system/getAnnouncementList',
    addAnnouncement: '/system/updateAnnouncement',
    deleteAnnouncement: '/system/deleteAnnouncement',
    saveAnnouncementRead: '/system/saveAnnouncementRead',
    webSockets: '/system/webSockets',
    DictionaryList: '/system/getDictionaryList',
    addDictionary: '/system/addEditDictionary',
    deleteDictionary: '/system/deleteDictionary',
}

// 获取操作日志列表
export function Logs(parameter) {
    return request({
        url: sysApi.Logs,
        method: 'get',
        params: parameter
    })
}
// 获取路由菜单列表
export function Menu(parameter) {
    return request({
        url: sysApi.Menu,
        method: 'get',
        params: parameter
    })
}
// 新增编辑路由菜单
export function addMenu(parameter) {
    return request({
        url: sysApi.addMenu,
        method: 'post',
        data: parameter
    })
}
// 删除路由菜单
export function deleteMenu(parameter) {
    return request({
        url: sysApi.deleteMenu,
        method: 'post',
        data: parameter
    })
}
// 获取权限列表
export function Action(parameter) {
    return request({
        url: sysApi.Action,
        method: 'get',
        params: parameter
    })
}
// 更新权限列表
export function updateActionList(parameter) {
    return request({
        url: sysApi.updateActionList,
        method: 'post',
        data: parameter
    })
}
// 获取角色列表
export function Role(parameter) {
    return request({
        url: sysApi.Role,
        method: 'get',
        params: parameter
    })
}
// 更新角色列表
export function updateRoleList(parameter) {
    return request({
        url: sysApi.updateRoleList,
        method: 'post',
        data: parameter
    })
}
// 删除角色列表
export function deleteRole(parameter) {
    return request({
        url: sysApi.deleteRole,
        method: 'post',
        data: parameter
    })
}
// 获取用户列表
export function User(parameter) {
    return request({
        url: sysApi.User,
        method: 'get',
        params: parameter
    })
}
// 添加或编辑用户列表
export function updateUserList(parameter) {
    return request({
        url: sysApi.updateUserList,
        method: 'post',
        data: parameter
    })
}
// 删除用户列表
export function deleteUser(parameter) {
    return request({
        url: sysApi.deleteUser,
        method: 'post',
        data: parameter
    })
}

// 获取消息公告列表
export function Announcement(parameter) {
    return request({
        url: sysApi.Announcement,
        method: 'get',
        params: parameter
    })
}
// 添加公告
export function addAnnouncement(parameter) {
    return request({
        url: sysApi.addAnnouncement,
        method: 'post',
        data: parameter
    })
}

// 删除公告
export function deleteAnnouncement(parameter) {
    return request({
        url: sysApi.deleteAnnouncement,
        method: 'post',
        data: parameter
    })
}

// 添加公告已读列表
export function saveAnnouncementRead(parameter) {
    return request({
        url: sysApi.saveAnnouncementRead,
        method: 'post',
        data: parameter
    })
}

// 接收webSockets消息推送
export function webSockets(parameter) {
    return request({
        url: sysApi.webSockets,
        method: 'get',
        params: parameter
    })
}

// 获取字典列表
export function DictionaryList(parameter) {
    return request({
        url: sysApi.DictionaryList,
        method: 'get',
        params: parameter
    })
}

// 新增-编辑字典
export function addDictionary(parameter) {
    return request({
        url: sysApi.addDictionary,
        method: 'post',
        data: parameter
    })
}

// 删除字典
export function deleteDictionary(parameter) {
    return request({
        url: sysApi.deleteDictionary,
        method: 'post',
        data: parameter
    })
}