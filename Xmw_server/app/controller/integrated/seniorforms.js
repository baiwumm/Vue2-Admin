/*
 * @Description:高级表格API接口
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-11-19 13:54:00
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-11-27 13:41:12
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
            createTime = JSON.parse(createTime)
            endTime = JSON.parse(endTime)
            let where = `1=1`
            if (title) where += ` and title like '%${title}%'`
            if (type) where += ` and type = '${type}'`
            if (degree) where += ` and degree = '${degree}'`
            if (priority) where += ` and priority = '${priority}'`
            if (state) where += ` and state = '${state}'`
            if (createTime.length && createTime[0] != '' && createTime[1] != '') where += ` and createTime between '${createTime[0]} 00:00:00' and '${createTime[1]} 23:59:59'`
            if (endTime.length && endTime[0] != '' && endTime[1] != '') where += ` and endTime between '${endTime[0]} 00:00:00' and '${endTime[1]} 23:59:59'`
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
            // 新增
            if (!params.BugID) {
                params.createTime = new Date()
                params.creator = UserID
                delete params.BugID
                console.log(params)
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
}
module.exports = SeniorFormsController;
