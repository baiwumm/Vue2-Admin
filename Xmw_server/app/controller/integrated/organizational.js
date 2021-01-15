/*
 * @Description: 组织架构API接口
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-11-10 16:02:27
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-11-19 13:53:24
 */
'use strict';

const Controller = require('egg').Controller;
class OrganizationalController extends Controller {
    // 获取组织架构-部门列表
    async getOrganizationList() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { departmentName, createTime, parentId, category, current, pageSize } = ctx.query;
            createTime = JSON.parse(createTime)
            let where = `1=1`
            if (departmentName) where += ` and name like '%${departmentName}%'`
            if (createTime.length && createTime[0] != '' && createTime[1] != '') where += ` and createTime between '${createTime[0]} 00:00:00' and '${createTime[1]} 23:59:59'`
            if (parentId) where += ` and parentId = ${parentId}`
            if (category) where += ` and category = ${category}`
            const result = await Raw.QueryPageData(`select * from xmw_organization where ${where}`, current, pageSize);
            let parentList = await Raw.QueryList(`select * from xmw_organization  where ${where}`)
            ctx.body = { state: 1, msg: '请求成功!', result: result, parentList: parentList }
        } catch (error) {
            ctx.logger.info('getDepartmentList方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }

    // 添加-编辑部门
    async addEditOrganization() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let params = ctx.request.body
            params.createTime = new Date()
            // 新增部门
            if (!params.OrganizationID) {
                delete params.OrganizationID
                // let exitData = await Raw.QueryList(`select count(1) as total from xmw_organization where name = '${params.name}'`)
                // // 部门名称是否已存在
                // if (exitData[0].total) {
                //     ctx.body = { state: 2, msg: '部门名称已存在!' }
                //     return
                // }
                await Raw.Insert('xmw_organization', params);
                await ctx.service.logs.saveLogs(username, CnName, '添加部门:' + params.name, '/integrated/organizational')
                ctx.body = { state: 1, msg: '添加成功!' }
            } else { // 编辑部门
                let OrganizationID = params.OrganizationID
                delete params.OrganizationID
                // let exitData = await Raw.QueryList(`select count(1) as total from xmw_organization where name = '${params.name}' and OrganizationID != '${OrganizationID}'`)
                // // 部门名称是否已存在
                // if (exitData[0].total) {
                //     ctx.body = { state: 2, msg: '部门名称已存在!' }
                //     return
                // }
                const options = {
                    wherestr: `where OrganizationID=${OrganizationID}`
                };
                await Raw.Update('xmw_organization', params, options);
                await ctx.service.logs.saveLogs(username, CnName, '编辑部门:' + params.name, '/integrated/organizational')
                ctx.body = { state: 1, msg: '保存成功!' }
            }

        } catch (error) {
            ctx.logger.info('addEditDepartment方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }

    // 删除部门
    async deleteOrganization() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let { OrganizationID, name } = ctx.request.body
            let exitData = await Raw.QueryList(`select count(1) as total from xmw_organization where parentId = '${OrganizationID}'`)
            // 部门名称是否存在子部门
            if (exitData[0].total) {
                ctx.body = { state: 2, msg: '当前部门存在子部门，请先删除子部门!' }
                return
            }
            await Raw.Delete("xmw_organization", {
                wherestr: `where OrganizationID = '${OrganizationID}'`
            });
            await ctx.service.logs.saveLogs(username, CnName, '删除部门:' + name, '/integrated/organizational')
            ctx.body = { state: 1, msg: '删除成功!' }
        } catch (error) {
            ctx.logger.info('deleteDepartment方法报错：' + error)
            ctx.body = { state: 0, msg: '删除失败!', error: error }
        }
    }
}
module.exports = OrganizationalController;