/*
 * @Description:公共方法
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-11-23 17:10:43
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-12-02 17:43:38
 */
'use strict';

const Controller = require('egg').Controller;
class PublicMethods extends Controller {
    /**
    * 获取CD字典表数据  例:[{tableName:'字符串',columns:'字符串',where:'字符串'},...]
    * */
    async getCDTable() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let params = Object.values(ctx.query)
            let CDDataList = params.map(v => {
                return JSON.parse(v)
            })
            let result = [];
            for (var i = 0; i < CDDataList.length; i++) {
                let where = ``
                if (CDDataList[i].where) where = CDDataList[i].where
                const list = await Raw.QueryList(`select ${CDDataList[i].columns} from ${CDDataList[i].tableName} ${where}`);
                result.push(list);
            }
            ctx.body = { state: 1, data: result, msg: "请求成功" };
        } catch (error) {
            ctx.logger.info('getCDTable方法报错：' + error)
            ctx.body = { code: 500, message: '请求失败!' }
        }
    }
}

module.exports = PublicMethods;
