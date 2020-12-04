/*
 * @Description:公共方法
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-12-02 17:39:20
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-12-02 17:41:05
 */
import request from '@/utils/request'
const publicApi = {
    CDTable: '/public/getCDTable',
}

// 获取表字典表数据
export function CDTable(parameter) {
    return request({
        url: publicApi.CDTable,
        method: 'get',
        params: parameter
    })
}
