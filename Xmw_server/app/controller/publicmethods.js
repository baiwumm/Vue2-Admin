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
    * 获取CD字典表数据 xmw_dictionary
    * */
    async getDictionaryCD() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            const result = await Raw.QueryList(`select * from xmw_dictionary`);
            // 处理字典数据
            let dictTemp = {}, dictResult = {}
            result.map(v => {
                if (!v.parentId) dictTemp[v.DictionaryID] = []
                if (dictTemp[v.parentId]) dictTemp[v.parentId].push({
                    value: v.DictionaryValue,
                    text: v.DictionaryLabel
                })
            })
            result.map(v => {
                if (dictTemp[v.DictionaryID]) dictResult[v.category] = dictTemp[v.DictionaryID]
            })
            ctx.body = { state: 1, result: dictResult, msg: "请求成功" };
        } catch (error) {
            ctx.logger.info('getDictionaryCD方法报错：' + error)
            ctx.body = { state: 0, msg: '请求失败!' }
        }
    }
}

module.exports = PublicMethods;
