/*
 * @Description: 系统设置模块API
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-10-10 17:46:41
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-10-26 11:44:14
 */
'use strict';

const Controller = require('egg').Controller;
class SystemController extends Controller {
    // 请求操作日志列表
    async getLogsList() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, createTime, current, pageSize } = ctx.query;
            createTime = JSON.parse(createTime)
            let where = '1+1'
            if (username) where += ` and username like '%${username}%'`
            if (createTime.length && createTime[0] != '' && createTime[1] != '') where += ` and createTime between '${createTime[0]} 00:00:00' and '${createTime[1]} 23:59:59'`
            const result = await Raw.QueryPageData(`select * from xmw_logs where ${where} order by createTime desc`, current, pageSize);
            ctx.body = { state: 1, msg: '请求成功!', result: result }
        } catch (error) {
            ctx.logger.info('getLogsList方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }
    // 获取路由菜单
    async getRouterMenu() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            // 判断是否有参数，如果有则是菜单页面，没有就路由请求
            if (Object.keys(ctx.query).length) {
                let { routerName, createTime, current, pageSize } = ctx.query;
                createTime = JSON.parse(createTime)
                let where = `name != 'index'`
                if (routerName) where += ` and name like '%${routerName}%'`
                if (createTime.length && createTime[0] != '' && createTime[1] != '') where += ` and createTime between '${createTime[0]} 00:00:00' and '${createTime[1]} 23:59:59'`
                let parentList = await Raw.QueryList(`select ID,parentId,subTitle as title from xmw_menu`)
                const result = await Raw.QueryPageData(`select * from xmw_menu where ${where}`, current, pageSize);
                ctx.body = { state: 1, msg: '请求成功!', result: result, parentList: parentList }
            } else {
                const result = await Raw.QueryList(`select ID, name, path, component, title, icon, keepAlive, permission, parentId, hidden, redirect from xmw_menu`);
                result.forEach(v => {
                    if (v.keepAlive) v.keepAlive = true
                    else v.keepAlive = false
                    if (v.hidden) v.hidden = false
                    else v.hidden = true
                })
                ctx.body = { state: 1, msg: '请求成功!', result: result }
            }

        } catch (error) {
            ctx.logger.info('getRouterMenu方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }
    // 添加菜单
    async addRouterMenu() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let params = ctx.request.body
            params.createTime = new Date()
            // 新增菜单
            if (!params.ID) {
                delete params.ID
                let { name, path, permission } = params
                let exitData = await Raw.QueryList(`select count(1) as total from xmw_menu where name = '${name}' or path = '${path}' or permission = '${permission}'`)
                // 判断名称、路径、权限是否相同
                if (exitData[0].total) {
                    ctx.body = { state: 2, msg: '名称、路由路径、用户权限Key不能与之重复，请核对!' }
                    return
                }
                await Raw.Insert('xmw_menu', params);
                await ctx.service.logs.saveLogs(username, CnName, '添加菜单:' + params.subTitle, '/system/menu')
                ctx.body = { state: 1, msg: '添加成功!' }
            } else { // 编辑菜单
                let ID = params.ID
                delete params.ID
                const options = {
                    wherestr: `where ID=${ID}`
                };
                await Raw.Update('xmw_menu', params, options);
                await ctx.service.logs.saveLogs(username, CnName, '编辑菜单:' + params.subTitle, '/system/menu')
                ctx.body = { state: 1, msg: '保存成功!' }
            }

        } catch (error) {
            ctx.logger.info('addRouterMenu方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }

    // 删除路由菜单
    async deleteRouterMenu() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let { ID, subTitle } = ctx.request.body
            await Raw.Delete("xmw_menu", {
                wherestr: `where ID = '${ID}' or parentId = '${ID}'`,
            })
            await ctx.service.logs.saveLogs(username, CnName, '删除菜单:' + subTitle, '/system/menu')
            ctx.body = { state: 1, msg: '删除成功!' }
        } catch (error) {
            ctx.logger.info('deleteRouterMenu方法报错：' + error)
            ctx.body = { state: 0, msg: '删除失败!', error: error }
        }
    }

    // 获取权限列表
    async getActionList() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { permission, subTitle, current, pageSize } = ctx.query;
            let where = `name != 'index'`
            if (permission) where += ` and permission like '%${permission}%'`
            if (subTitle) where += ` and subTitle like '%${subTitle}%'`
            const result = await Raw.QueryPageData(`select ID,permission,subTitle,actions,parentId,redirect from xmw_menu where ${where}`, current, pageSize);
            let actionList = await Raw.QueryList('select * from xmw_action');
            ctx.body = { state: 1, msg: '请求成功!', result: result, actionList: actionList }
        } catch (error) {
            ctx.logger.info('getActionList方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }

    // 更新权限列表
    async updateActionList() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let { ID, subTitle, actions } = ctx.request.body
            let actionList = await Raw.QueryList('select * from xmw_action');
            for (let i = 0; i < actions.length; i++) {
                for (let j = 0; j < actionList.length; j++) {
                    if (actions[i] == actionList[j].key) {
                        actions[i] = {
                            action: actions[i],
                            describe: actionList[j].label,
                        }
                        break
                    }
                }
            }
            const row = {
                actions: JSON.stringify(actions)
            };
            const options = {
                wherestr: `where ID=${ID}`
            };
            await Raw.Update('xmw_menu', row, options);
            await ctx.service.logs.saveLogs(username, CnName, '修改操作权限:' + subTitle, '/system/permissionList')
            ctx.body = { state: 1, msg: '保存成功!' }
        } catch (error) {
            ctx.logger.info('updateActionList方法报错：' + error)
            ctx.body = { state: 0, msg: '保存失败!', error: error }
        }
    }

    // 获取角色列表
    async getRoleList() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { roleName, status, current, pageSize } = ctx.query;
            let where = `1+1`
            if (roleName) where += ` and roleName like '%${roleName}%'`
            if (status != '') where += ` and status = ${status}`
            const result = await Raw.QueryPageData(`select * from xmw_role where ${where}`, current, pageSize);
            const roleList = await Raw.QueryList(`select ID,parentId,permission,actions,subTitle as title from xmw_menu where name != 'index'`);
            ctx.body = { state: 1, msg: '请求成功!', result: result, roleList: roleList }
        } catch (error) {
            ctx.logger.info('getRoleList方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }

    // 更新角色列表
    async updateRoleList() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let { roleID, roleName, status, roleList } = ctx.request.body
            let where = `where roleName = '${roleName}'`
            if (roleID) where += ` and roleID != ${roleID}`
            const exist = await Raw.Query(`select count(1) as total from xmw_role ${where}`);
            if (exist.total) {
                ctx.body = { state: 2, msg: '角色名称已存在!' }
                return
            }
            // 处理权限数据
            let roleArr = [], roleObj = {}
            let permissionList = await Raw.QueryList(`select permission,subTitle from xmw_menu`)
            // 过滤勾选的路由权限，如果只有操作权限，不勾选路由，则过滤掉
            roleList.map(v => {
                let splitArr = v.value.split('-')
                permissionList.map(e => {
                    if (splitArr[0] == e.permission) {
                        if (!roleObj[splitArr[0]]) {
                            roleObj[splitArr[0]] = {
                                permissionId: splitArr[0],
                                permissionName: e.subTitle,
                                actions: [],
                                actionList: []
                            }
                        }
                        if (splitArr.length > 1) {
                            roleObj[splitArr[0]].actions.push({
                                action: splitArr[1],
                                describe: v.label
                            })
                            roleObj[splitArr[0]].actionList.push(splitArr[1])
                        }

                    }
                })
            })
            roleArr = Object.values(roleObj)
            // 新增操作
            if (!roleID) {
                const row = {
                    roleName: roleName,
                    status: status,
                    roleList: JSON.stringify(roleArr),
                    createTime: new Date()
                }
                await Raw.Insert('xmw_role', row);
                await ctx.service.logs.saveLogs(username, CnName, '新增角色组:' + roleName, '/system/roleList')
                ctx.body = { state: 1, msg: '保存成功!' }
            } else { // 更新操作
                const row = {
                    roleName: roleName,
                    status: status,
                    roleList: JSON.stringify(roleArr),
                    updateTime: new Date()
                };

                const options = {
                    wherestr: `where roleID=${roleID}`
                };
                await Raw.Update('xmw_role', row, options);
                await ctx.service.logs.saveLogs(username, CnName, '编辑角色组:' + roleName, '/system/roleList')
                ctx.body = { state: 1, msg: '保存成功!' }
            }

        } catch (error) {
            ctx.logger.info('updateRoleList方法报错：' + error)
            ctx.body = { state: 0, msg: '保存失败!', error: error }
        }
    }

    // 删除角色列表
    async deleteRole() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let { roleID, roleName } = ctx.request.body
            await Raw.Delete("xmw_role", {
                wherestr: `where roleID = '${roleID}'`,
            });
            await ctx.service.logs.saveLogs(username, CnName, '删除角色组:' + roleName, '/system/roleList')
            ctx.body = { state: 1, msg: '删除成功!' }
        } catch (error) {
            ctx.logger.info('deleteRole方法报错：' + error)
            ctx.body = { state: 0, msg: '删除失败!', error: error }
        }
    }

    // 获取用户列表
    async getUserList() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName, Status, current, pageSize } = ctx.query;
            let where = `1=1`
            if (username) where += ` and username like '%${username}%'`
            if (CnName) where += ` and CnName like '%${CnName}%'`
            if (Status && Status != '') where += ` and Status = ${Status}`
            let roleList = await Raw.QueryList(`select roleName from xmw_role where status = 1`)
            const result = await Raw.QueryPageData(`select * from xmw_user where ${where}`, current, pageSize);
            ctx.body = { state: 1, msg: '请求成功!', result: result, roleList: roleList }
        } catch (error) {
            ctx.logger.info('getUserList方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }

    // 添加或编辑用户列表
    async updateUserList() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let host = ctx.request.header.host
            let { ID, ...params } = ctx.request.body
            console.log(111)
            console.log(params)
            params.SectorJobs = JSON.stringify(params.SectorJobs)
            params.address = JSON.stringify(params.address)
            params.roleList = JSON.stringify(params.roleList)
            //    添加用户
            if (!ID) {
                const exist = await Raw.Query(`select count(1) as total from xmw_user where username = '${params.username}'`);
                if (exist.total) {
                    ctx.body = { state: 2, msg: '用户名已存在!' }
                    return
                }
                params.CreateTime = new Date()
                params.avatar = 'http://' + host + '/public/admin/avatar2.jpg'
                await Raw.Insert('xmw_user', params);
                await ctx.service.logs.saveLogs(username, CnName, '添加用户:' + params.username, '/system/userList')
                ctx.body = { state: 1, msg: '保存成功!' }
            }
            else { // 编辑用户
                const options = {
                    wherestr: `where UserID = '${ID}'`
                };
                await Raw.Update('xmw_user', params, options);
                await ctx.service.logs.saveLogs(username, CnName, '编辑用户:' + params.username, '/system/userList')
                ctx.body = { state: 1, msg: '保存成功!' }
            }

        } catch (error) {
            ctx.logger.info('updateUserList方法报错：' + error)
            ctx.body = { state: 0, msg: '保存失败!', error: error }
        }
    }

    // 删除用户列表
    async deleteUser() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let { ID, username } = ctx.request.body
            await Raw.Delete("xmw_user", {
                wherestr: `where UserID = '${ID}'`
            });
            await ctx.service.logs.saveLogs(username, CnName, '删除用户:' + username, '/system/userList')
            ctx.body = { state: 1, msg: '删除成功!' }
        } catch (error) {
            ctx.logger.info('deleteUser方法报错：' + error)
            ctx.body = { state: 0, msg: '删除失败!', error: error }
        }
    }
}
module.exports = SystemController;