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
    DictionaryCD: '/public/getDictionaryCD',
}

// 获取表字典表数据
export function DictionaryCD(parameter) {
    return request({
        url: publicApi.DictionaryCD,
        method: 'get',
        params: parameter
    })
}
