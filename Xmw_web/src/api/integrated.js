/*
 * @Description: 组织架构模块接口
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-11-10 16:07:02
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-11-10 17:08:16
 */
import request from '@/utils/request'
const Api = {
    departmentList: '/integrated/getDepartmentList',
    addEditDepartment: '/integrated/addEditDepartment',
    deleteDepartment: '/integrated/deleteDepartment'
}

// 获取组织架构-部门列表
export function departmentList(parameter) {
    return request({
        url: Api.departmentList,
        method: 'get',
        params: parameter
    })
}
// 添加-编辑部门
export function addEditDepartment(parameter) {
    return request({
        url: Api.addEditDepartment,
        method: 'post',
        data: parameter
    })
}
// 删除部门
export function deleteDepartment(parameter) {
    return request({
        url: Api.deleteDepartment,
        method: 'post',
        data: parameter
    })
}