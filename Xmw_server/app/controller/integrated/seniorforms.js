/*
 * @Description:高级表格API接口
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-11-19 13:54:00
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-12-03 17:31:56
 */
'use strict';

const Controller = require('egg').Controller;
class SeniorFormsController extends Controller {
    // 获取高级表格列表
    async getseniorFormsList() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { title, type, degree, priority, state, createTime, endTime, current, pageSize } = ctx.query;
            let where = `1=1`
            if (title) where += ` and title like '%${title}%'`
            if (type) where += ` and type = '${type}'`
            if (degree) where += ` and degree = '${degree}'`
            if (priority) where += ` and priority = '${priority}'`
            if (state) where += ` and state = '${state}'`
            if (createTime && JSON.parse(createTime).length) where += ` and createTime between '${JSON.parse(createTime)[0]} 00:00:00' and '${JSON.parse(createTime)[1]} 23:59:59'`
            if (endTime && JSON.parse(endTime).length) where += ` and endTime between '${JSON.parse(endTime)[0]} 00:00:00' and '${JSON.parse(endTime)[1]} 23:59:59'`
            const result = await Raw.QueryPageData(`select * from xmw_bug where ${where}`, current, pageSize);
            const userList = await Raw.QueryList(`select UserID as 'key',CnName as label from xmw_user`)
            ctx.body = { state: 1, msg: '请求成功!', result: result, userList: userList }
        } catch (error) {
            ctx.logger.info('getseniorFormsList方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }

    // 添加-编辑高级表格
    async addEditSeniorForms() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { UserID, username, CnName } = ctx.session.userInfo
            let params = ctx.request.body
            //批量上传
            if (params.upload) {
                params.formData.forEach(v => {
                    v.createTime = new Date()
                })
                await Raw.InsertList('xmw_bug', params.formData);
                await ctx.service.logs.saveLogs(username, CnName, '批量上传:' + params.formData.length + '条数据', '/integrated/seniorForms')
                ctx.body = { state: 1, msg: '上传成功!' }
            }
            // 新增
            else if (!params.BugID) {
                params.createTime = new Date()
                params.creator = UserID
                delete params.BugID
                await Raw.Insert('xmw_bug', params);
                await ctx.service.logs.saveLogs(username, CnName, '添加BUG:' + params.title, '/integrated/seniorForms')
                ctx.body = { state: 1, msg: '添加成功!' }
            } else { // 编辑
                let BugID = params.BugID
                delete params.BugID
                const options = {
                    wherestr: `where BugID=${BugID}`
                };
                await Raw.Update('xmw_bug', params, options);
                await ctx.service.logs.saveLogs(username, CnName, '编辑BUG:' + params.title, '/integrated/seniorForms')
                ctx.body = { state: 1, msg: '保存成功!' }
            }

        } catch (error) {
            ctx.logger.info('addEditSeniorForms方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }

    // 删除高级表格
    async deleteSeniorForms() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let { BugID, title } = ctx.request.body
            await Raw.Delete("xmw_bug", {
                wherestr: `where BugID in (${BugID})`
            });
            await ctx.service.logs.saveLogs(username, CnName, '删除BUG:' + title, '/integrated/seniorForms')
            ctx.body = { state: 1, msg: '删除成功!' }
        } catch (error) {
            ctx.logger.info('deleteSeniorForms方法报错：' + error)
            ctx.body = { state: 0, msg: '删除失败!', error: error }
        }
    }

    // 获取车辆信息
    async getVehicleInfo() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { current, pageSize } = ctx.query;
            const result = await Raw.QueryPageData(`select * from xmw_vehicleinfo`, current, pageSize);
            ctx.body = { state: 1, msg: '请求成功!', result: result }
        } catch (error) {
            ctx.logger.info('getVehicleInfo方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }

    // 添加编辑车辆信息
    async addEditVehicleInfo() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let params = ctx.request.body
            params.address = JSON.stringify(params.address)
            if (params.ID) {
                let ID = params.ID
                delete params.ID
                const options = {
                    wherestr: `where ID=${ID}`
                };
                await Raw.Update('xmw_vehicleinfo', params, options);
                await ctx.service.logs.saveLogs(username, CnName, '编辑车辆信息:' + params.VLPN, '/integrated/advancedForm')
                ctx.body = { state: 1, msg: '保存成功!' }
            } else {
                params.createTime = new Date()
                await Raw.Insert('xmw_vehicleinfo', params);
                await ctx.service.logs.saveLogs(username, CnName, '添加车辆信息:' + params.VLPN, '/integrated/advancedForm')
                ctx.body = { state: 1, msg: '添加成功!' }
            }
        } catch (error) {
            ctx.logger.info('addEditVehicleInfo方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!', error: error }
        }
    }

    // 删除车辆信息
    async deleteVehicleInfo() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { username, CnName } = ctx.session.userInfo
            let { ID, VLPN } = ctx.request.body
            await Raw.Delete("xmw_vehicleinfo", {
                wherestr: `where ID in (${ID})`
            });
            await ctx.service.logs.saveLogs(username, CnName, '删除车辆信息:' + VLPN, '/integrated/advancedForm')
            ctx.body = { state: 1, msg: '删除成功!' }
        } catch (error) {
            ctx.logger.info('deleteVehicleInfo方法报错：' + error)
            ctx.body = { state: 0, msg: '删除失败!', error: error }
        }
    }
}
module.exports = SeniorFormsController;
