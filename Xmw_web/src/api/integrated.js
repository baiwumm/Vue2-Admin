/*
 * @Description: 综合组件模块接口
 * @Version: 2.0
 * @Autor: Xie Mingwei
 * @Date: 2020-11-10 16:07:02
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2020-12-08 10:06:35
 */
import request from '@/utils/request'
const Api = {
    getOrganizationList: '/integrated/getOrganizationList',
    addEditOrganization: '/integrated/addEditOrganization',
    deleteOrganization: '/integrated/deleteOrganization',
    advancedTable: '/integrated/getAdvancedTable',
    addEditAdvancedTable: '/integrated/addEditAdvancedTable',
    deleteAdvancedTable: '/integrated/deleteAdvancedTable',
    vehicleInfo: '/integrated/getVehicleInfo',
    addEditVehicleInfo: '/integrated/addEditVehicleInfo',
    deleteVehicleInfo: '/integrated/deleteVehicleInfo',
    saveSeniorExcel: '/integrated/saveSeniorExcel',
}

// 获取组织架构-部门列表
export function getOrganizationList(parameter) {
    return request({
        url: Api.getOrganizationList,
        method: 'get',
        params: parameter
    })
}
// 添加-编辑部门
export function addEditOrganization(parameter) {
    return request({
        url: Api.addEditOrganization,
        method: 'post',
        data: parameter
    })
}
// 删除部门
export function deleteOrganization(parameter) {
    return request({
        url: Api.deleteOrganization,
        method: 'post',
        data: parameter
    })
}
// 获取高级表格列表
export function advancedTable(parameter) {
    return request({
        url: Api.advancedTable,
        method: 'get',
        params: parameter
    })
}
// 添加-编辑高级表格
export function addEditAdvancedTable(parameter) {
    return request({
        url: Api.addEditAdvancedTable,
        method: 'post',
        data: parameter
    })
}
// 删除高级表格
export function deleteAdvancedTable(parameter) {
    return request({
        url: Api.deleteAdvancedTable,
        method: 'post',
        data: parameter
    })
}
// 获取车辆信息
export function vehicleInfo(parameter) {
    return request({
        url: Api.vehicleInfo,
        method: 'get',
        params: parameter
    })
}
// 添加编辑车辆信息
export function addEditVehicleInfo(parameter) {
    return request({
        url: Api.addEditVehicleInfo,
        method: 'post',
        data: parameter
    })
}
// 删除部门
export function deleteVehicleInfo(parameter) {
    return request({
        url: Api.deleteVehicleInfo,
        method: 'post',
        data: parameter
    })
}
// 保存高级表格上传
export function saveSeniorExcel(parameter) {
    return request({
        url: Api.saveSeniorExcel,
        method: 'post',
        data: parameter
    })
}