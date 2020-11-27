/*
 * @Description: 综合组件模块接口
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-11-10 16:07:02
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-11-19 18:03:17
 */
import request from '@/utils/request'
const Api = {
    departmentList: '/integrated/getDepartmentList',
    addEditDepartment: '/integrated/addEditDepartment',
    deleteDepartment: '/integrated/deleteDepartment',
    seniorFormsList: '/integrated/getseniorFormsList',
    addEditSeniorForms: '/integrated/addEditSeniorForms',
    deleteSeniorForms: '/integrated/deleteSeniorForms',
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
// 获取高级表格列表
export function seniorFormsList(parameter) {
    return request({
        url: Api.seniorFormsList,
        method: 'get',
        params: parameter
    })
}
// 添加-编辑高级表格
export function addEditSeniorForms(parameter) {
    return request({
        url: Api.addEditSeniorForms,
        method: 'post',
        data: parameter
    })
}
// 删除高级表格
export function deleteSeniorForms(parameter) {
    return request({
        url: Api.deleteSeniorForms,
        method: 'post',
        data: parameter
    })
}